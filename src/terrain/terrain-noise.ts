// Seeded 2D gradient noise and fractal sums of it, for generating relief.
// Pure TypeScript (no Math.random), so the same seed gives the same terrain
// everywhere, and chunks generated apart join because they read the same
// world coordinates.
import { TerrainGrid } from './terrain-data';

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

  get(x: number, z: number): number {
    const xi = Math.floor(x), zi = Math.floor(z);
    const fx = x - xi, fz = z - zi;
    const X = xi & 255, Z = zi & 255;
    const g = (ix: number, iz: number, dx: number, dz: number) => {
      const h = this.perm[ix + this.perm[iz]];
      return this.gx[h] * dx + this.gz[h] * dz;
    };
    const u = fx * fx * fx * (fx * (fx * 6 - 15) + 10);
    const v = fz * fz * fz * (fz * (fz * 6 - 15) + 10);
    const a = g(X, Z, fx, fz), b = g(X + 1, Z, fx - 1, fz);
    const c = g(X, Z + 1, fx, fz - 1), d = g(X + 1, Z + 1, fx - 1, fz - 1);
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
  let t = (sum / norm) * 0.5 + 0.5; // 0..1
  t = Math.pow(Math.min(Math.max(t, 0), 1), o.sharpness);
  return o.base + (t - 0.5) * o.amplitude;
}

export const DEFAULT_RELIEF: Required<ReliefOptions> = {
  seed: 1, scale: 256, octaves: 5, persistence: 0.5, amplitude: 60, base: 0, ridges: 0, sharpness: 1,
};

/** Writes a relief into every chunk of a grid (borders stay joined). */
export function generateRelief(grid: TerrainGrid, options: ReliefOptions = {}): void {
  const o = { ...DEFAULT_RELIEF, ...options };
  const noise = new Noise2D(o.seed);
  const n = grid.settings.resolution;
  for (const c of grid.all()) {
    const s = c.spacing;
    for (let j = 0; j <= n; j++) {
      for (let i = 0; i <= n; i++) {
        c.heights[j * (n + 1) + i] = relief(noise, c.originX + i * s, c.originZ + j * s, o);
      }
    }
    c.heightVersion++;
  }
}
