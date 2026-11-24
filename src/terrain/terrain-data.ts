// Terrain data: square chunks of heights laid out on a grid. No WebGL here, so
// it is tested in Node.
//
// A chunk at grid cell (cx, cz) covers x from cx·size to (cx+1)·size and z the
// same, in the terrain's local space. It holds (N+1)² heights in metres, N the
// resolution (a power of two), row by row along z: vertex (i, j) is at
// x = cx·size + i·size/N, z = cz·size + j·size/N and is heights[j·(N+1) + i].
// Neighbouring chunks share their border row: both keep a copy and every write
// goes to all the copies, so they never part.
//
// The surface between vertices is the mesh's: each cell is split into two
// triangles along the diagonal from (i, j) to (i+1, j+1), so heightAt matches
// what is drawn and what the physics collides with.
import { vec3 } from 'gl-matrix';

/** Settings shared by every chunk of a terrain. */
export interface TerrainSettings {
  /** Cells per chunk side, a power of two (64, 128, 256). */
  resolution: number;
  /** A chunk's side in metres. */
  size: number;
  /** The range heights are kept in when saved as 16 bits (m). */
  heightRange: [number, number];
  /** Splat texels per chunk side (the painted layers). */
  splatResolution: number;
}

export const DEFAULT_TERRAIN_SETTINGS: TerrainSettings = {
  resolution: 128,
  size: 128,
  heightRange: [-64, 192],
  splatResolution: 256,
};

/** Most layers a terrain can have: two RGBA splat textures. */
export const MAX_TERRAIN_LAYERS = 8;

export class TerrainChunkData {
  /** (N+1)² heights in metres, row by row along z. */
  readonly heights: Float32Array;
  /**
   * The painted weights of the 8 layers: splat[0] holds layers 0–3 and
   * splat[1] layers 4–7, RGBA8, splatResolution² texels each. Their sum (0 to
   * 1) is how much the painting covers the automatic rules there.
   */
  readonly splat: [Uint8Array, Uint8Array];
  /** Goes up on every change to the heights (renderers and colliders follow it). */
  heightVersion = 0;
  /** Goes up on every change to the splat. */
  splatVersion = 0;

  constructor(readonly cx: number, readonly cz: number, readonly settings: TerrainSettings) {
    const n = settings.resolution + 1;
    this.heights = new Float32Array(n * n);
    const s = settings.splatResolution;
    this.splat = [new Uint8Array(s * s * 4), new Uint8Array(s * s * 4)];
  }

  get resolution(): number { return this.settings.resolution; }
  get size(): number { return this.settings.size; }
  /** Metres between vertices. */
  get spacing(): number { return this.settings.size / this.settings.resolution; }
  /** The chunk's corner with the lowest x and z, in terrain space. */
  get originX(): number { return this.cx * this.settings.size; }
  get originZ(): number { return this.cz * this.settings.size; }

  /** The height of vertex (i, j), clamped to the chunk. */
  vertex(i: number, j: number): number {
    const n = this.settings.resolution;
    i = i < 0 ? 0 : i > n ? n : i;
    j = j < 0 ? 0 : j > n ? n : j;
    return this.heights[j * (n + 1) + i];
  }

  /** The lowest and highest heights. */
  heightBounds(): [number, number] {
    let lo = Infinity, hi = -Infinity;
    for (const h of this.heights) { if (h < lo) lo = h; if (h > hi) hi = h; }
    return [lo, hi];
  }

  /** The height of the surface at (u, v) metres from the chunk's corner. */
  heightAtLocal(u: number, v: number): number {
    const n = this.settings.resolution;
    const gx = Math.min(Math.max(u / this.spacing, 0), n);
    const gz = Math.min(Math.max(v / this.spacing, 0), n);
    const i = Math.min(Math.floor(gx), n - 1);
    const j = Math.min(Math.floor(gz), n - 1);
    return cellHeight(this.vertex(i, j), this.vertex(i + 1, j), this.vertex(i, j + 1), this.vertex(i + 1, j + 1), gx - i, gz - j);
  }
}

/**
 * The height inside a cell at (fx, fz) in 0..1 from its corner: the two
 * triangles split along the diagonal from (0, 0) to (1, 1).
 */
export function cellHeight(h00: number, h10: number, h01: number, h11: number, fx: number, fz: number): number {
  return fz > fx
    ? h00 + fz * (h01 - h00) + fx * (h11 - h01)
    : h00 + fx * (h10 - h00) + fz * (h11 - h10);
}

/** Heights to 16 bits and back, inside a height range. */
export function encodeHeights(heights: Float32Array, range: [number, number]): Uint16Array {
  const [lo, hi] = range;
  const out = new Uint16Array(heights.length);
  const k = 65535 / (hi - lo);
  for (let i = 0; i < heights.length; i++) out[i] = Math.round(Math.min(Math.max((heights[i] - lo) * k, 0), 65535));
  return out;
}

export function decodeHeights(data: Uint16Array, range: [number, number], out: Float32Array = new Float32Array(data.length)): Float32Array {
  const [lo, hi] = range;
  const k = (hi - lo) / 65535;
  for (let i = 0; i < data.length; i++) out[i] = lo + data[i] * k;
  return out;
}

/**
 * The chunks of a terrain, a sparse grid keyed by cell. Heights can be read
 * and written in terrain space or by global vertex (gi, gj), which a brush
 * uses: global vertex gi = cx·N + i, the same vertex for both chunks of a
 * shared border.
 */
export class TerrainGrid {
  private readonly chunks = new Map<string, TerrainChunkData>();

  constructor(readonly settings: TerrainSettings = { ...DEFAULT_TERRAIN_SETTINGS }) {
    const n = settings.resolution;
    if (n < 2 || (n & (n - 1)) !== 0) throw new Error(`Terrain resolution must be a power of two, got ${n}`);
  }

  static key(cx: number, cz: number): string { return `${cx},${cz}`; }

  get(cx: number, cz: number): TerrainChunkData | undefined { return this.chunks.get(TerrainGrid.key(cx, cz)); }

  all(): TerrainChunkData[] { return [...this.chunks.values()]; }

  get count(): number { return this.chunks.size; }

  /**
   * Adds a chunk at (cx, cz), flat at `height`, then copies the borders of
   * the chunks already beside it so it starts joined to them. Returns the
   * existing chunk if there is one.
   */
  add(cx: number, cz: number, height = 0): TerrainChunkData {
    const had = this.get(cx, cz);
    if (had) return had;
    const c = new TerrainChunkData(cx, cz, this.settings);
    c.heights.fill(height);
    this.chunks.set(TerrainGrid.key(cx, cz), c);
    const n = this.settings.resolution;
    // Every vertex on the border that another chunk also holds takes its value.
    for (let k = 0; k <= n; k++) {
      for (const [i, j] of [[k, 0], [k, n], [0, k], [n, k]]) {
        const h = this.sharedHeight(c, i, j);
        if (h !== undefined) c.heights[j * (n + 1) + i] = h;
      }
    }
    return c;
  }

  remove(cx: number, cz: number): boolean { return this.chunks.delete(TerrainGrid.key(cx, cz)); }

  /** The free cells beside the chunks (where one could be added). */
  freeNeighbours(): [number, number][] {
    const out = new Map<string, [number, number]>();
    for (const c of this.chunks.values()) {
      for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const x = c.cx + dx, z = c.cz + dz;
        if (!this.get(x, z)) out.set(TerrainGrid.key(x, z), [x, z]);
      }
    }
    return [...out.values()];
  }

  /** The chunk cell holding a terrain-space point. */
  cellAt(x: number, z: number): [number, number] {
    return [Math.floor(x / this.settings.size), Math.floor(z / this.settings.size)];
  }

  /** The height of the surface at terrain-space (x, z), or undefined off the terrain. */
  heightAt(x: number, z: number): number | undefined {
    const [cx, cz] = this.cellAt(x, z);
    const c = this.get(cx, cz);
    return c?.heightAtLocal(x - c.originX, z - c.originZ);
  }

  /**
   * The surface normal at terrain-space (x, z), smooth (from the vertex
   * normals around it, as drawn). Undefined off the terrain.
   */
  normalAt(x: number, z: number, out = vec3.create()): vec3 | undefined {
    const [cx, cz] = this.cellAt(x, z);
    const c = this.get(cx, cz);
    if (!c) return undefined;
    const n = this.settings.resolution;
    const gx = (x - c.originX) / c.spacing, gz = (z - c.originZ) / c.spacing;
    const i = Math.min(Math.floor(gx), n - 1), j = Math.min(Math.floor(gz), n - 1);
    const fx = gx - i, fz = gz - j;
    const a = vec3.create();
    out[0] = out[1] = out[2] = 0;
    const add = (di: number, dj: number, w: number) => {
      this.vertexNormal(c.cx * n + i + di, c.cz * n + j + dj, a);
      vec3.scaleAndAdd(out, out, a, w);
    };
    add(0, 0, (1 - fx) * (1 - fz)); add(1, 0, fx * (1 - fz)); add(0, 1, (1 - fx) * fz); add(1, 1, fx * fz);
    return vec3.normalize(out, out);
  }

  // ---- Global vertices (gi = cx·N + i) ----

  /** The chunks holding global vertex (gi, gj): one, two on a border, four on a corner. */
  holders(gi: number, gj: number): [TerrainChunkData, number, number][] {
    const n = this.settings.resolution;
    const out: [TerrainChunkData, number, number][] = [];
    const xs = [Math.floor(gi / n)];
    if (gi % n === 0) xs.push(gi / n - 1);
    const zs = [Math.floor(gj / n)];
    if (gj % n === 0) zs.push(gj / n - 1);
    for (const cx of xs) for (const cz of zs) {
      const c = this.get(cx, cz);
      if (c) out.push([c, gi - cx * n, gj - cz * n]);
    }
    return out;
  }

  /** The height of global vertex (gi, gj), or undefined where there is no chunk. */
  vertexHeight(gi: number, gj: number): number | undefined {
    const h = this.holders(gi, gj)[0];
    if (!h) return undefined;
    const [c, i, j] = h;
    return c.heights[j * (this.settings.resolution + 1) + i];
  }

  /** Sets global vertex (gi, gj) in every chunk that holds it. */
  setVertexHeight(gi: number, gj: number, height: number): void {
    const n1 = this.settings.resolution + 1;
    for (const [c, i, j] of this.holders(gi, gj)) {
      c.heights[j * n1 + i] = height;
      c.heightVersion++;
    }
  }

  /**
   * The normal at global vertex (gi, gj) from the heights around it, read
   * across chunk borders so neighbours light their shared border the same.
   * At the terrain's edge the missing side is taken as level with the vertex.
   */
  vertexNormal(gi: number, gj: number, out = vec3.create()): vec3 {
    const s = this.settings.size / this.settings.resolution;
    const h = this.vertexHeight(gi, gj) ?? 0;
    const l = this.vertexHeight(gi - 1, gj) ?? h, r = this.vertexHeight(gi + 1, gj) ?? h;
    const d = this.vertexHeight(gi, gj - 1) ?? h, u = this.vertexHeight(gi, gj + 1) ?? h;
    vec3.set(out, l - r, 2 * s, d - u);
    return vec3.normalize(out, out);
  }

  /** The height a border vertex of `c` has in another chunk that holds it. */
  private sharedHeight(c: TerrainChunkData, i: number, j: number): number | undefined {
    const n = this.settings.resolution;
    for (const [o, oi, oj] of this.holders(c.cx * n + i, c.cz * n + j)) {
      if (o !== c) return o.heights[oj * (n + 1) + oi];
    }
    return undefined;
  }
}
