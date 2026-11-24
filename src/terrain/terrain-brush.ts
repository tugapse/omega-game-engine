// The terrain brush: sculpting the heights and painting the layers, in the
// terrain's own space, across chunk borders. Pure functions on a TerrainGrid
// (no WebGL), so they are tested in Node, and games can change the ground
// with them too. TerrainHistory undoes and redoes whole strokes.
import { MAX_TERRAIN_LAYERS, TerrainChunkData, TerrainGrid } from './terrain-data';
import { Noise2D } from './terrain-noise';

export type SculptTool = 'raise' | 'lower' | 'smooth' | 'flatten' | 'noise';

export interface BrushSettings {
  /** Radius (m). */
  radius: number;
  /** Strength: metres a second for raise, lower and noise; how fast it pulls for smooth, flatten and paint (0 to 1). */
  strength: number;
  /** 0 a soft edge to 1 a hard one. */
  hardness: number;
}

export const DEFAULT_BRUSH: BrushSettings = { radius: 12, strength: 0.6, hardness: 0.3 };

/** The brush's weight (0 to 1) at `t` = distance / radius. */
export function brushFalloff(t: number, hardness: number): number {
  if (t >= 1) return 0;
  const edge = Math.min(Math.max(hardness, 0), 0.99);
  if (t <= edge) return 1;
  const k = (t - edge) / (1 - edge);
  return 0.5 + 0.5 * Math.cos(k * Math.PI);
}

/** A rectangle of global vertices (inclusive), the area a stroke changed. */
export interface VertexRect { i0: number; j0: number; i1: number; j1: number }

const noise = new Noise2D(1234);

/**
 * One step of a sculpting tool at terrain-space (x, z) over `dt` seconds.
 * `target` is the height `flatten` pulls to. Returns the vertices changed.
 */
export function sculpt(grid: TerrainGrid, tool: SculptTool, x: number, z: number, brush: BrushSettings, dt: number, target = 0): VertexRect | null {
  const n = grid.settings.resolution;
  const s = grid.settings.size / n;
  const r = Math.max(brush.radius, s * 0.5);
  const i0 = Math.ceil((x - r) / s), i1 = Math.floor((x + r) / s);
  const j0 = Math.ceil((z - r) / s), j1 = Math.floor((z + r) / s);
  if (i1 < i0 || j1 < j0) return null;
  // Read every height first, so smoothing does not feed on its own writes.
  const w = i1 - i0 + 1;
  const old = new Float32Array(w * (j1 - j0 + 1));
  const has = new Uint8Array(old.length);
  for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
    const h = grid.vertexHeight(i, j);
    if (h !== undefined) { old[(j - j0) * w + (i - i0)] = h; has[(j - j0) * w + (i - i0)] = 1; }
  }
  let changed = false;
  for (let j = j0; j <= j1; j++) {
    for (let i = i0; i <= i1; i++) {
      const k = (j - j0) * w + (i - i0);
      if (!has[k]) continue;
      const f = brushFalloff(Math.hypot(i * s - x, j * s - z) / r, brush.hardness);
      if (f <= 0) continue;
      const h = old[k];
      let next = h;
      const pull = 1 - Math.pow(1 - Math.min(brush.strength, 1), dt * 10 * f);
      switch (tool) {
        case 'raise': next = h + brush.strength * 10 * f * dt; break;
        case 'lower': next = h - brush.strength * 10 * f * dt; break;
        case 'flatten': next = h + (target - h) * pull; break;
        case 'smooth': {
          let sum = 0, count = 0;
          for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]]) {
            const v = grid.vertexHeight(i + di, j + dj);
            if (v !== undefined) { sum += v; count++; }
          }
          if (count) next = h + (sum / count - h) * pull;
          break;
        }
        case 'noise': next = h + noise.get(i * s * 0.08, j * s * 0.08) * brush.strength * 10 * f * dt; break;
      }
      if (next !== h) { grid.setVertexHeight(i, j, next); changed = true; }
    }
  }
  if (!changed) return null;
  touchAround(grid, { i0, j0, i1, j1 });
  return { i0, j0, i1, j1 };
}

/**
 * Marks every chunk within a vertex of a changed area as changed, so the
 * normals along its borders (which read the neighbours) are made again.
 */
export function touchAround(grid: TerrainGrid, rect: VertexRect): void {
  const n = grid.settings.resolution;
  for (const c of grid.all()) {
    const ci0 = c.cx * n, cj0 = c.cz * n;
    if (rect.i1 + 1 < ci0 || rect.i0 - 1 > ci0 + n || rect.j1 + 1 < cj0 || rect.j0 - 1 > cj0 + n) continue;
    c.heightVersion++;
  }
}

/**
 * One step of painting layer `layer` at terrain-space (x, z): its painted
 * weight grows towards 1 and the others shrink, so the painting covers the
 * rules more. `erase` fades all painting instead, back to the rules.
 * Returns the chunks changed.
 */
export function paint(grid: TerrainGrid, layer: number, x: number, z: number, brush: BrushSettings, dt: number, erase = false): TerrainChunkData[] {
  const { size, splatResolution: S } = grid.settings;
  const r = brush.radius;
  const changed: TerrainChunkData[] = [];
  const texel = size / S;
  for (const c of grid.all()) {
    const u = x - c.originX, v = z - c.originZ;
    if (u + r < 0 || u - r > size || v + r < 0 || v - r > size) continue;
    const sx0 = Math.max(0, Math.floor((u - r) / texel)), sx1 = Math.min(S - 1, Math.ceil((u + r) / texel));
    const sy0 = Math.max(0, Math.floor((v - r) / texel)), sy1 = Math.min(S - 1, Math.ceil((v + r) / texel));
    let any = false;
    for (let sy = sy0; sy <= sy1; sy++) {
      for (let sx = sx0; sx <= sx1; sx++) {
        const f = brushFalloff(Math.hypot((sx + 0.5) * texel - u, (sy + 0.5) * texel - v) / r, brush.hardness);
        if (f <= 0) continue;
        const a = 1 - Math.pow(1 - Math.min(brush.strength, 1), dt * 10 * f);
        if (a <= 0) continue;
        const t = (sy * S + sx) * 4;
        for (let k = 0; k < MAX_TERRAIN_LAYERS; k++) {
          const arr = c.splat[k >> 2];
          const idx = t + (k & 3);
          const w = arr[idx];
          let next: number;
          if (erase) next = Math.floor(w * (1 - a));
          else if (k === layer) next = Math.min(255, Math.ceil(w + (255 - w) * a));
          else next = Math.floor(w * (1 - a));
          if (next !== w) { arr[idx] = next; any = true; }
        }
      }
    }
    if (any) { c.splatVersion++; changed.push(c); }
  }
  return changed;
}

/**
 * Writes weights into every splat texel of every chunk from `weightsAt`
 * (terrain-space x, z → 8 weights summing to 1): "apply the rules" bakes the
 * automatic layers this way, so they can be touched up by hand.
 */
export function fillSplat(grid: TerrainGrid, weightsAt: (x: number, z: number, out: Float32Array) => Float32Array): void {
  const { size, splatResolution: S } = grid.settings;
  const texel = size / S;
  const w = new Float32Array(MAX_TERRAIN_LAYERS);
  for (const c of grid.all()) {
    for (let sy = 0; sy < S; sy++) {
      for (let sx = 0; sx < S; sx++) {
        weightsAt(c.originX + (sx + 0.5) * texel, c.originZ + (sy + 0.5) * texel, w);
        // Bytes that sum to 255 exactly (the rest goes to the biggest weight).
        const t = (sy * S + sx) * 4;
        let total = 0, top = 0;
        for (let k = 0; k < MAX_TERRAIN_LAYERS; k++) {
          const b = Math.round(Math.max(0, w[k]) * 255);
          c.splat[k >> 2][t + (k & 3)] = b;
          total += b;
          if (w[k] > w[top]) top = k;
        }
        const fix = c.splat[top >> 2][t + (top & 3)] + 255 - total;
        c.splat[top >> 2][t + (top & 3)] = Math.min(255, Math.max(0, fix));
      }
    }
    c.splatVersion++;
  }
}

/** Clears all painting (back to the rules). */
export function clearSplat(grid: TerrainGrid): void {
  for (const c of grid.all()) { c.splat[0].fill(0); c.splat[1].fill(0); c.splatVersion++; }
}

interface ChunkCopy { heights?: Float32Array; splat?: [Uint8Array, Uint8Array] }

/**
 * Undo and redo of whole strokes. `begin` before a stroke, `save(chunk)`
 * before each chunk's first change in it (cheap to call every step), `end`
 * after. Keeps the last `limit` strokes.
 */
export class TerrainHistory {
  private undoStack: Map<TerrainChunkData, ChunkCopy>[] = [];
  private redoStack: Map<TerrainChunkData, ChunkCopy>[] = [];
  private open: Map<TerrainChunkData, ChunkCopy> | null = null;
  private kind: 'heights' | 'splat' = 'heights';

  constructor(public limit = 24) {}

  /** A stroke is under way (begun, not yet ended). */
  get isOpen(): boolean { return this.open !== null; }
  get canUndo(): boolean { return this.undoStack.length > 0; }
  get canRedo(): boolean { return this.redoStack.length > 0; }

  begin(kind: 'heights' | 'splat'): void {
    this.open = new Map();
    this.kind = kind;
  }

  /** Keeps a copy of a chunk as it is, the first time the stroke touches it. */
  save(chunk: TerrainChunkData): void {
    if (!this.open || this.open.has(chunk)) return;
    this.open.set(chunk, copyOf(chunk, this.kind));
  }

  /** Saves every chunk overlapping a terrain-space circle (call before the step). */
  saveAround(grid: TerrainGrid, x: number, z: number, radius: number): void {
    if (!this.open) return;
    const size = grid.settings.size;
    for (const c of grid.all()) {
      if (x + radius + size / grid.settings.resolution < c.originX || x - radius - 1 > c.originX + size) continue;
      if (z + radius + size / grid.settings.resolution < c.originZ || z - radius - 1 > c.originZ + size) continue;
      this.save(c);
    }
  }

  end(): void {
    if (this.open && this.open.size) {
      this.undoStack.push(this.open);
      if (this.undoStack.length > this.limit) this.undoStack.shift();
      this.redoStack = [];
    }
    this.open = null;
  }

  /** Undoes the last stroke; with the grid, the neighbours' border normals follow. */
  undo(grid?: TerrainGrid): boolean { return this.swap(this.undoStack, this.redoStack, grid); }
  redo(grid?: TerrainGrid): boolean { return this.swap(this.redoStack, this.undoStack, grid); }

  clear(): void { this.undoStack = []; this.redoStack = []; this.open = null; }

  private swap(from: Map<TerrainChunkData, ChunkCopy>[], to: Map<TerrainChunkData, ChunkCopy>[], grid?: TerrainGrid): boolean {
    const step = from.pop();
    if (!step) return false;
    const back = new Map<TerrainChunkData, ChunkCopy>();
    for (const [c, copy] of step) {
      back.set(c, { heights: copy.heights ? c.heights.slice() : undefined, splat: copy.splat ? [c.splat[0].slice(), c.splat[1].slice()] : undefined });
      if (copy.heights) {
        c.heights.set(copy.heights);
        c.heightVersion++;
        const n = c.resolution;
        if (grid) touchAround(grid, { i0: c.cx * n, j0: c.cz * n, i1: c.cx * n + n, j1: c.cz * n + n });
      }
      if (copy.splat) { c.splat[0].set(copy.splat[0]); c.splat[1].set(copy.splat[1]); c.splatVersion++; }
    }
    to.push(back);
    return true;
  }
}

function copyOf(c: TerrainChunkData, kind: 'heights' | 'splat'): ChunkCopy {
  return kind === 'heights' ? { heights: c.heights.slice() } : { splat: [c.splat[0].slice(), c.splat[1].slice()] };
}
