// Where plants grow on a chunk: one candidate per cell of a jittered grid,
// kept as much as the ground suits a species (the layers it grows on, as the
// rules and the painting lay them; its heights; its slope) and as a large noise
// says woods. Every candidate draws the same random numbers whether it grows or
// not, so the same chunk, seed and numbers always give the same plants, and a
// lower density only takes some away.
import { vec3 } from 'gl-matrix';
import { TerrainChunkData, TerrainGrid } from './terrain-data';
import { Noise2D, seededRandom } from './terrain-noise';

export interface ScatterSpecies {
  /** The layers (indices) it grows on: it grows as much as they cover the ground. */
  layers: number[];
  /** How common it is beside the others that could grow there (1 by default). */
  weight?: number;
  /** Heights (m) it grows at; outside them it thins out over `fade` metres. */
  heights?: [number, number];
  fade?: number;
  /** Steepest ground it grows on (degrees), thinning over the 6° below; none by default. */
  maxSlope?: number;
  /** Smallest and largest size, times the species' own (0.75 to 1.25 by default). */
  scale?: [number, number];
  /** How many looks it has (each plant picks one): 1 by default. */
  variants?: number;
}

export interface ScatterOptions {
  seed: number;
  /** 0 none to 1 the most. */
  density: number;
  /** Metres between candidates. */
  cell: number;
  /** The water's level, or null: nothing grows under it or on the shore. */
  water: number | null;
  /** How far above the water nothing grows (m). */
  shore: number;
  /** Metres across the woods' noise (0 for an even spread). */
  woods: number;
  /** 0 to 1: how many plants grow out in the open, between the woods. */
  open: number;
}

export const DEFAULT_SCATTER: ScatterOptions = { seed: 1, density: 0.5, cell: 6, water: null, shore: 0.6, woods: 110, open: 0.12 };

export interface ScatterItem {
  /** Terrain space: where it stands on the ground. */
  x: number; y: number; z: number;
  /** Index into the species. */
  species: number;
  /** Times the species' size. */
  scale: number;
  /** Turn about y (radians). */
  turn: number;
  variant: number;
}

/** Each layer's weight (0 to 1) at a terrain-space point: what the ground is there. */
export type LayerCover = (x: number, z: number, out: Float32Array) => Float32Array;

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

/** How well a species fits a point, 0 to 1. */
export function speciesFit(s: ScatterSpecies, cover: Float32Array, h: number, slope: number): number {
  let fit = 0;
  for (const l of s.layers) fit += cover[l] ?? 0;
  if (s.heights) {
    const f = s.fade ?? 8;
    fit *= smoothstep(s.heights[0] - f, s.heights[0] + f, h) * (1 - smoothstep(s.heights[1] - f, s.heights[1] + f, h));
  }
  if (s.maxSlope !== undefined) fit *= 1 - smoothstep(s.maxSlope - 6, s.maxSlope, slope);
  return Math.min(fit, 1);
}

/** The plants of one chunk, in terrain space. */
export function scatter(grid: TerrainGrid, c: TerrainChunkData, species: ScatterSpecies[], cover: LayerCover, options: Partial<ScatterOptions> = {}): ScatterItem[] {
  const o = { ...DEFAULT_SCATTER, ...options };
  const items: ScatterItem[] = [];
  if (o.density <= 0 || !species.length) return items;
  const random = seededRandom((o.seed * 73856093) ^ (c.cx * 19349663) ^ (c.cz * 83492791));
  const woods = new Noise2D(o.seed + 501);
  const cells = Math.floor(c.size / o.cell);
  const normal = vec3.create(), weights = new Float32Array(8), fits = new Float32Array(species.length);
  for (let j = 0; j < cells; j++) {
    for (let i = 0; i < cells; i++) {
      const r0 = random(), r1 = random(), r2 = random(), r3 = random(), r4 = random(), r5 = random(), r6 = random();
      const x = c.originX + (i + 0.1 + r1 * 0.8) * o.cell;
      const z = c.originZ + (j + 0.1 + r2 * 0.8) * o.cell;
      const h = c.heightAtLocal(x - c.originX, z - c.originZ);
      if (o.water !== null && h < o.water + o.shore) continue;
      const n = grid.normalAt(x, z, normal);
      const slope = n ? Math.acos(Math.min(Math.max(n[1], 0), 1)) * 180 / Math.PI : 0;
      cover(x, z, weights);
      let best = 0, total = 0;
      species.forEach((s, k) => {
        fits[k] = speciesFit(s, weights, h, slope);
        best = Math.max(best, fits[k]);
        total += fits[k] * (s.weight ?? 1);
      });
      if (total <= 0) continue;
      const wood = o.woods > 0 ? o.open + (1 - o.open) * smoothstep(-0.1, 0.35, woods.get(x / o.woods, z / o.woods)) : 1;
      if (r0 >= best * wood * o.density * 1.6) continue;
      // Which species: by how well each fits, times how common it is.
      let pick = r3 * total, k = 0;
      for (; k < species.length - 1; k++) {
        pick -= fits[k] * (species[k].weight ?? 1);
        if (pick < 0) break;
      }
      const s = species[k], [lo, hi] = s.scale ?? [0.75, 1.25];
      items.push({
        x, y: h, z,
        species: k,
        // Smaller where the ground suits it less: a treeline, not a wall.
        scale: (lo + (hi - lo) * r4) * (0.65 + 0.35 * Math.min(fits[k] * 1.4, 1)),
        turn: r5 * Math.PI * 2,
        variant: Math.floor(r6 * (s.variants ?? 1)),
      });
    }
  }
  return items;
}
