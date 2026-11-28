// Shaping tools beyond the basic brushes: a straight ramp between two points,
// terraces cut into a slope, and stamps (a hill, a crater, a plateau, a
// volcano) in one go. Like terrain-brush.ts they work in terrain space on the
// grid's global vertices and return the vertices they changed; the
// TerrainBehaviour has world-space versions (rampAt, terraceAt, stampAt).
import { brushFalloff, BrushSettings, touchAround, VertexRect } from './terrain-brush';
import { TerrainGrid } from './terrain-data';

/** The vertices within `r` of terrain-space (x, z), clipped to nothing when empty. */
function around(grid: TerrainGrid, x: number, z: number, r: number): VertexRect & { s: number } {
  const s = grid.settings.size / grid.settings.resolution;
  return { s, i0: Math.ceil((x - r) / s), i1: Math.floor((x + r) / s), j0: Math.ceil((z - r) / s), j1: Math.floor((z + r) / s) };
}

const smoothstep = (a: number, b: number, t: number) => {
  const k = Math.min(Math.max((t - a) / (b - a), 0), 1);
  return k * k * (3 - 2 * k);
};

// ---- Terraces ----

/** The terraced height for `h`: flat steps `step` metres apart with short, steep risers between. */
export function terraceHeight(h: number, step: number): number {
  const q = h / step, base = Math.floor(q);
  return (base + smoothstep(0.38, 0.62, q - base)) * step;
}

/**
 * One step of the terrace brush: heights move towards flat steps `step`
 * metres apart, as fast as `strength` (0 to 1) pulls, less towards the edge.
 */
export function terrace(grid: TerrainGrid, x: number, z: number, brush: BrushSettings, dt: number, step: number): VertexRect | null {
  const r = Math.max(brush.radius, 0.5);
  const { s, i0, i1, j0, j1 } = around(grid, x, z, r);
  let changed = false;
  for (let j = j0; j <= j1; j++) {
    for (let i = i0; i <= i1; i++) {
      const h = grid.vertexHeight(i, j);
      if (h === undefined) continue;
      const f = brushFalloff(Math.hypot(i * s - x, j * s - z) / r, brush.hardness);
      if (f <= 0) continue;
      const pull = 1 - Math.pow(1 - Math.min(brush.strength, 1), dt * 10 * f);
      const next = h + (terraceHeight(h, step) - h) * pull;
      if (next !== h) { grid.setVertexHeight(i, j, next); changed = true; }
    }
  }
  if (!changed) return null;
  const rect = { i0, j0, i1, j1 };
  touchAround(grid, rect);
  return rect;
}

// ---- Stamps ----

export type StampShape = 'hill' | 'crater' | 'plateau' | 'volcano';

/** A stamp's height at t = distance / radius (0 at the middle to 1 at the edge), for a height of 1. Zero from t = 1 on. */
export function stampProfile(shape: StampShape, t: number): number {
  if (t >= 1) return 0;
  switch (shape) {
    case 'hill': return 0.5 + 0.5 * Math.cos(Math.PI * t);
    case 'plateau': return 1 - smoothstep(0.5, 1, t);
    case 'crater': {
      const bowl = -0.6 * (1 - smoothstep(0, 0.72, t));
      const rim = 0.4 * Math.exp(-(((t - 0.72) / 0.13) ** 2));
      return (bowl + rim) * (1 - smoothstep(0.85, 1, t));
    }
    case 'volcano': {
      const cone = Math.pow(1 - t, 1.4);
      const caldera = 0.45 * (1 - smoothstep(0, 0.22, t));
      return (cone - caldera) * (1 - smoothstep(0.9, 1, t));
    }
  }
}

/** Adds a stamp `height` metres high (negative digs it in) of `radius` at terrain-space (x, z). */
export function stamp(grid: TerrainGrid, shape: StampShape, x: number, z: number, radius: number, height: number): VertexRect | null {
  const r = Math.max(radius, 0.5);
  const { s, i0, i1, j0, j1 } = around(grid, x, z, r);
  let changed = false;
  for (let j = j0; j <= j1; j++) {
    for (let i = i0; i <= i1; i++) {
      const h = grid.vertexHeight(i, j);
      if (h === undefined) continue;
      const d = stampProfile(shape, Math.hypot(i * s - x, j * s - z) / r) * height;
      if (d !== 0) { grid.setVertexHeight(i, j, h + d); changed = true; }
    }
  }
  if (!changed) return null;
  const rect = { i0, j0, i1, j1 };
  touchAround(grid, rect);
  return rect;
}

// ---- Ramps ----

/** A point in terrain space: x, z and the height there. */
export interface RampEnd { x: number; z: number; h: number }

/**
 * Lays a straight ramp from `a` to `b` in terrain space: each vertex within
 * `width` of the segment moves towards the height along it (a's at a, b's at
 * b), fully in the middle and less towards the edges by `hardness`, like a
 * brush. Past the ends the edge is round. Returns the vertices changed.
 */
export function ramp(grid: TerrainGrid, a: RampEnd, b: RampEnd, width: number, hardness: number): VertexRect | null {
  const s = grid.settings.size / grid.settings.resolution;
  const r = Math.max(width, s * 0.5);
  const i0 = Math.ceil((Math.min(a.x, b.x) - r) / s), i1 = Math.floor((Math.max(a.x, b.x) + r) / s);
  const j0 = Math.ceil((Math.min(a.z, b.z) - r) / s), j1 = Math.floor((Math.max(a.z, b.z) + r) / s);
  const dx = b.x - a.x, dz = b.z - a.z;
  const len2 = dx * dx + dz * dz;
  let changed = false;
  for (let j = j0; j <= j1; j++) {
    for (let i = i0; i <= i1; i++) {
      const h = grid.vertexHeight(i, j);
      if (h === undefined) continue;
      const x = i * s, z = j * s;
      const t = len2 > 0 ? Math.min(Math.max(((x - a.x) * dx + (z - a.z) * dz) / len2, 0), 1) : 0;
      const f = brushFalloff(Math.hypot(x - (a.x + dx * t), z - (a.z + dz * t)) / r, hardness);
      if (f <= 0) continue;
      const next = h + (a.h + (b.h - a.h) * t - h) * f;
      if (next !== h) { grid.setVertexHeight(i, j, next); changed = true; }
    }
  }
  if (!changed) return null;
  const rect = { i0, j0, i1, j1 };
  touchAround(grid, rect);
  return rect;
}
