// Seeded 2D gradient noise and fractal sums of it, for generating relief.
// Pure TypeScript (no Math.random), so the same seed gives the same terrain
// everywhere, and chunks generated apart join because they read the same
// world coordinates.
import { TerrainGrid } from './terrain-data';
import { gridArea, Heightmap } from './terrain-heightmap';

/** A small seeded random generator (mulberry32). */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Perlin-style gradient noise in 2D, about -1 to 1. */
export class Noise2D {
  private readonly perm = new Uint8Array(512);
  private readonly gx = new Float32Array(256);
  private readonly gz = new Float32Array(256);

  constructor(seed = 1) {
    const rnd = seededRandom(seed);
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) {
      p[i] = i;
      const a = rnd() * Math.PI * 2;
      this.gx[i] = Math.cos(a);
      this.gz[i] = Math.sin(a);
    }
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      const t = p[i]; p[i] = p[j]; p[j] = t;
    }
    for (let i = 0; i < 512; i++) this.perm[i] = p[i & 255];
  }

  /**
   * The noise at (x, z). With `period` (a whole number up to 256) it repeats
   * every `period` units, for textures that tile.
   */
  get(x: number, z: number, period = 256): number {
    const xi = Math.floor(x), zi = Math.floor(z);
    const fx = x - xi, fz = z - zi;
    const wrap = (v: number) => ((v % period) + period) % period;
    const X = wrap(xi), Z = wrap(zi), X1 = wrap(xi + 1), Z1 = wrap(zi + 1);
    const g = (ix: number, iz: number, dx: number, dz: number) => {
      const h = this.perm[ix + this.perm[iz]];
      return this.gx[h] * dx + this.gz[h] * dz;
    };
    const u = fx * fx * fx * (fx * (fx * 6 - 15) + 10);
    const v = fz * fz * fz * (fz * (fz * 6 - 15) + 10);
    const a = g(X, Z, fx, fz), b = g(X1, Z, fx - 1, fz);
    const c = g(X, Z1, fx, fz - 1), d = g(X1, Z1, fx - 1, fz - 1);
    const ab = a + u * (b - a), cd = c + u * (d - c);
    return (ab + v * (cd - ab)) * 1.4142;
  }
}

export interface ReliefOptions {
  seed?: number;
  /** Metres across the largest features. */
  scale?: number;
  /** Layers of detail, each half the size of the one before. */
  octaves?: number;
  /** How much each finer layer keeps (0 to 1). */
  persistence?: number;
  /** Height of the relief (m): the noise goes about ±amplitude/2 around `base`. */
  amplitude?: number;
  base?: number;
  /** 0 rolling hills to 1 sharp ridges. */
  ridges?: number;
  /** Raises the high ground more than the low (1 none, 2 or more for flat valleys and peaks). */
  sharpness?: number;
}

/** The height of a relief at a terrain-space point. */
export function relief(noise: Noise2D, x: number, z: number, o: Required<ReliefOptions>): number {
  let sum = 0, amp = 1, freq = 1 / o.scale, norm = 0;
  for (let k = 0; k < o.octaves; k++) {
    const n = noise.get(x * freq + k * 31.7, z * freq - k * 17.3);
    const ridged = 1 - Math.abs(n) * 2;
    sum += amp * (n * (1 - o.ridges) + ridged * o.ridges);
    norm += amp;
    amp *= o.persistence;
    freq *= 2;
  }
  // Gradient noise seldom passes ±0.6: stretched so the amplitude is about
  // the range of heights you get.
  let t = (sum / norm) * 0.8 + 0.5; // 0..1
  t = Math.pow(Math.min(Math.max(t, 0), 1), o.sharpness);
  return o.base + (t - 0.5) * o.amplitude;
}

export const DEFAULT_RELIEF: Required<ReliefOptions> = {
  seed: 1, scale: 256, octaves: 5, persistence: 0.5, amplitude: 60, base: 0, ridges: 0, sharpness: 1,
};

/** A box in terrain space: what a relief's island and image are laid over. */
export interface ReliefArea { x0: number; z0: number; x1: number; z1: number }

/** A relief with two more numbers, for `heightField`. */
export interface ReliefFieldOptions extends ReliefOptions {
  /** 0 to 1: bends the relief by more noise, for winding valleys and ridges. */
  warp?: number;
  /** 0 to 1: sinks the ground towards the edges of the area (to the bottom of the relief), with a wobbly coast. */
  island?: number;
}

export const DEFAULT_RELIEF_FIELD: Required<ReliefFieldOptions> = { ...DEFAULT_RELIEF, warp: 0, island: 0 };

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

/**
 * A relief as a height function of terrain-space (x, z). With `image` the
 * heights come from it instead of the noise: stretched over `area`, its grey
 * 0 to 1 is base ∓ amplitude/2. `warp` and `island` work on either; the
 * island is the middle of `area` (without one there is no island). With warp
 * and island 0 it is exactly `relief`.
 */
export function heightField(options: ReliefFieldOptions = {}, area?: ReliefArea, image?: Heightmap | null): (x: number, z: number) => number {
  const s = { ...DEFAULT_RELIEF_FIELD, ...options };
  const noise = new Noise2D(s.seed);
  const warpX = new Noise2D(s.seed + 1013), warpZ = new Noise2D(s.seed + 2027);
  const a = area ?? { x0: 0, z0: 0, x1: s.scale, z1: s.scale };
  const w = a.x1 - a.x0, d = a.z1 - a.z0;
  const cx = a.x0 + w / 2, cz = a.z0 + d / 2, r = Math.min(w, d) / 2;
  const floor = s.base - s.amplitude / 2 - 6;
  const reach = s.warp * s.scale * 0.45, f = 1 / s.scale;
  const island = area ? s.island : 0;
  const fractal = (n: Noise2D, x: number, z: number) => n.get(x * f, z * f) + 0.5 * n.get(x * f * 2 + 5.2, z * f * 2 + 1.3);

  const sample = image
    ? (x: number, z: number) => {
        const u = Math.min(Math.max((x - a.x0) / w, 0), 1) * (image.width - 1);
        const v = Math.min(Math.max((z - a.z0) / d, 0), 1) * (image.height - 1);
        const i0 = Math.floor(u), j0 = Math.floor(v);
        const i1 = Math.min(i0 + 1, image.width - 1), j1 = Math.min(j0 + 1, image.height - 1);
        const tu = u - i0, tv = v - j0, at = (i: number, j: number) => image.data[j * image.width + i];
        const top = at(i0, j0) + (at(i1, j0) - at(i0, j0)) * tu;
        const bottom = at(i0, j1) + (at(i1, j1) - at(i0, j1)) * tu;
        return s.base + ((top + (bottom - top) * tv) / 65535 - 0.5) * s.amplitude;
      }
    : (x: number, z: number) => relief(noise, x, z, s);

  return (x, z) => {
    let px = x, pz = z;
    if (reach > 0) {
      px += fractal(warpX, x, z) * reach;
      pz += fractal(warpZ, x, z) * reach;
    }
    let h = sample(px, pz);
    if (island > 0) {
      const t = Math.hypot(x - cx, z - cz) / r;
      const edge = smoothstep(0.45, 1.02, t + noise.get(x * 0.012 + 40, z * 0.012 - 40) * 0.18);
      h += (floor - h) * edge * island;
    }
    return h;
  };
}

/** Writes a height function of terrain-space (x, z) into every chunk (shared borders get the same value). */
export function generateFrom(grid: TerrainGrid, height: (x: number, z: number) => number): void {
  const n = grid.settings.resolution;
  for (const c of grid.all()) {
    const sp = c.spacing;
    for (let j = 0; j <= n; j++) {
      for (let i = 0; i <= n; i++) c.heights[j * (n + 1) + i] = height(c.originX + i * sp, c.originZ + j * sp);
    }
    c.heightVersion++;
  }
}

/**
 * Writes a relief into every chunk (borders stay joined). `warp` and
 * `island` (laid over the box around the chunks) are optional; without them
 * it is the plain fractal relief.
 */
export function generateRelief(grid: TerrainGrid, options: ReliefFieldOptions = {}): void {
  generateFrom(grid, heightField(options, gridArea(grid)));
}
