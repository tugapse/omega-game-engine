// Ground textures made in code, so a terrain looks like something before any
// image is given to it: grass, dirt, rock, snow, sand and gravel. Each is a
// tiling height field turned into a colour (alpha = height, for the height
// blend) and a normal map (alpha = roughness). Pure TypeScript, tested in Node.
import { Noise2D } from './terrain-noise';

export type GroundKind = 'grass' | 'dirt' | 'rock' | 'snow' | 'sand' | 'gravel';

export const GROUND_KINDS: GroundKind[] = ['grass', 'dirt', 'rock', 'snow', 'sand', 'gravel'];

export interface GroundTexture {
  size: number;
  /** RGBA: colour, alpha the height (0 to 255). */
  albedo: Uint8Array;
  /** RGBA: tangent-space normal (x along u, y along v, z out), alpha the roughness. */
  normal: Uint8Array;
}

type Rgb = [number, number, number];

const mix = (a: Rgb, b: Rgb, t: number): Rgb => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** A recipe: height (0 to 1) and colour at texel (u, v) in 0..1, plus roughness and bumpiness. */
interface Recipe {
  height(f: (x: number, z: number, cells: number) => number, u: number, v: number): number;
  color(h: number, f: (x: number, z: number, cells: number) => number, u: number, v: number): Rgb;
  roughness: number;
  bump: number;
}

const RECIPES: Record<GroundKind, Recipe> = {
  grass: {
    height: (f, u, v) => clamp01(0.5 + f(u, v, 64) * 0.5 + f(u, v, 16) * 0.25),
    color: (h, f, u, v) => {
      const patch = clamp01(0.5 + f(u, v, 4) * 0.9);
      const base = mix([0.17, 0.27, 0.08], [0.3, 0.38, 0.13], patch);
      return mix(mix(base, [0.1, 0.17, 0.05], 0.55), mix(base, [0.45, 0.5, 0.22], 0.3), h);
    },
    roughness: 0.92, bump: 1.4,
  },
  dirt: {
    height: (f, u, v) => {
      const pebble = Math.max(0, f(u, v, 64) - 0.35) * 2;
      return clamp01(0.45 + f(u, v, 8) * 0.2 + f(u, v, 32) * 0.12 + f(u, v, 128) * 0.08 + pebble * 0.35);
    },
    color: (h, f, u, v) => mix(mix([0.25, 0.18, 0.12], [0.36, 0.27, 0.18], clamp01(0.5 + f(u, v, 4) + f(u, v, 16) * 0.4)), [0.45, 0.4, 0.34], Math.max(0, h - 0.62) * 1.5),
    roughness: 0.95, bump: 2.2,
  },
  rock: {
    height: (f, u, v) => {
      const ridge = 1 - Math.abs(f(u, v, 6));
      const strata = 0.5 + 0.5 * Math.sin((v * 9 + f(u, v, 4) * 0.8) * Math.PI * 2);
      return clamp01(ridge * 0.55 + strata * 0.15 + f(u, v, 32) * 0.2 + 0.1);
    },
    color: (h, f, u, v) => {
      const base = mix([0.25, 0.24, 0.23], [0.47, 0.45, 0.42], h);
      return mix(base, [0.42, 0.37, 0.31], clamp01(0.5 + f(u, v, 3)) * 0.4);
    },
    roughness: 0.8, bump: 4,
  },
  snow: {
    height: (f, u, v) => clamp01(0.55 + f(u, v, 4) * 0.25 + f(u, v, 24) * 0.08),
    color: (h, f, u, v) => mix([0.78, 0.83, 0.92], [0.97, 0.98, 1], clamp01(h * 1.2 + f(u, v, 40) * 0.1)),
    roughness: 0.55, bump: 0.8,
  },
  sand: {
    height: (f, u, v) => {
      const ripples = 0.5 + 0.5 * Math.sin((u * 14 + f(u, v, 3) * 1.2) * Math.PI * 2);
      return clamp01(ripples * 0.55 + f(u, v, 64) * 0.15 + 0.25);
    },
    color: (h, f, u, v) => mix([0.66, 0.54, 0.36], [0.86, 0.75, 0.53], clamp01(h * 0.7 + 0.15 + f(u, v, 5) * 0.3)),
    roughness: 0.9, bump: 1.2,
  },
  gravel: {
    height: (f, u, v) => clamp01(0.5 + Math.abs(f(u, v, 24)) * 0.9 - Math.abs(f(u, v, 48)) * 0.3),
    color: (h, f, u, v) => mix(mix([0.28, 0.27, 0.26], [0.52, 0.5, 0.47], h), [0.45, 0.38, 0.3], clamp01(0.5 + f(u, v, 12)) * 0.35),
    roughness: 0.85, bump: 3,
  },
};

/** Makes a ground texture of `size` texels a side (a power of two, 64 or more). */
export function groundTexture(kind: GroundKind, size = 256, seed = 1): GroundTexture {
  const recipe = RECIPES[kind];
  const noise = new Noise2D(seed * 101 + GROUND_KINDS.indexOf(kind) * 7);
  // Noise with `cells` lattice cells across the texture: tiles exactly.
  const f = (u: number, v: number, cells: number) => noise.get(u * cells, v * cells, cells);
  const heights = new Float32Array(size * size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) heights[y * size + x] = recipe.height(f, x / size, y / size);
  const albedo = new Uint8Array(size * size * 4);
  const normal = new Uint8Array(size * size * 4);
  const at = (x: number, y: number) => heights[((y + size) % size) * size + ((x + size) % size)];
  const k = recipe.bump * (size / 256);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = y * size + x;
      const h = heights[i];
      const c = recipe.color(h, f, x / size, y / size);
      albedo[i * 4] = Math.round(clamp01(c[0]) * 255);
      albedo[i * 4 + 1] = Math.round(clamp01(c[1]) * 255);
      albedo[i * 4 + 2] = Math.round(clamp01(c[2]) * 255);
      albedo[i * 4 + 3] = Math.round(h * 255);
      const dx = (at(x + 1, y) - at(x - 1, y)) * k;
      const dy = (at(x, y + 1) - at(x, y - 1)) * k;
      const len = Math.hypot(dx, dy, 1);
      normal[i * 4] = Math.round((-dx / len * 0.5 + 0.5) * 255);
      normal[i * 4 + 1] = Math.round((-dy / len * 0.5 + 0.5) * 255);
      normal[i * 4 + 2] = Math.round((1 / len * 0.5 + 0.5) * 255);
      normal[i * 4 + 3] = Math.round(recipe.roughness * 255);
    }
  }
  return { size, albedo, normal };
}
