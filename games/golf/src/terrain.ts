// The ground: a grid of heights (sampled smoothly between points) and a grid of
// surface kinds. No engine, so the ball physics and its tests run without one.

export type Surface = 'tee' | 'fairway' | 'rough' | 'sand' | 'green' | 'water' | 'out';

export interface SurfaceFeel {
  /** Share of the speed into the ground that bounces back. */
  restitution: number;
  /** Share of the speed along the ground kept at a bounce (before spin bites). */
  bounceKeep: number;
  /** Rolling deceleration, m/s². */
  rolling: number;
}

/** How each surface plays. Tuned with the tests in ball.test.ts. */
export const FEEL: Record<Surface, SurfaceFeel> = {
  tee: { restitution: 0.35, bounceKeep: 0.75, rolling: 2.2 },
  fairway: { restitution: 0.35, bounceKeep: 0.75, rolling: 2.2 },
  rough: { restitution: 0.22, bounceKeep: 0.5, rolling: 5 },
  sand: { restitution: 0.06, bounceKeep: 0.15, rolling: 12 },
  green: { restitution: 0.2, bounceKeep: 0.5, rolling: 0.55 },
  water: { restitution: 0, bounceKeep: 0, rolling: 50 },
  out: { restitution: 0.25, bounceKeep: 0.5, rolling: 5 },
};

/** The ground the ball plays on. Heights are y; the hole runs towards -z. */
export interface Ground {
  height(x: number, z: number): number;
  /** The unit normal at (x, z), written to `out` (and returned). */
  normal(x: number, z: number, out: number[]): number[];
  surface(x: number, z: number): Surface;
}

const SURFACES: Surface[] = ['tee', 'fairway', 'rough', 'sand', 'green', 'water', 'out'];

/**
 * Heights on a regular grid from (x0, z0), `cell` metres apart, `nx` × `nz`
 * points; between points the height is interpolated bilinearly. Surfaces sit
 * on their own grid (`surfaceCell` metres) over the same area. Outside the
 * area the surface is "out" and the height that of the nearest edge.
 */
export class HeightField implements Ground {
  readonly heights: Float32Array;
  readonly surfaces: Uint8Array;
  readonly snx: number;
  readonly snz: number;

  constructor(
    readonly x0: number, readonly z0: number, readonly cell: number,
    readonly nx: number, readonly nz: number, readonly surfaceCell = cell,
  ) {
    this.heights = new Float32Array(nx * nz);
    this.snx = Math.round(((nx - 1) * cell) / surfaceCell);
    this.snz = Math.round(((nz - 1) * cell) / surfaceCell);
    this.surfaces = new Uint8Array(this.snx * this.snz).fill(SURFACES.indexOf('rough'));
  }

  /** The far corner (x1, z1). */
  get x1(): number { return this.x0 + (this.nx - 1) * this.cell; }
  get z1(): number { return this.z0 + (this.nz - 1) * this.cell; }

  /** Sets every height from a function of the point's position. */
  shape(f: (x: number, z: number) => number): this {
    for (let j = 0; j < this.nz; j++) {
      for (let i = 0; i < this.nx; i++) this.heights[j * this.nx + i] = f(this.x0 + i * this.cell, this.z0 + j * this.cell);
    }
    return this;
  }

  /** Sets every surface cell from a function of its centre. */
  paint(f: (x: number, z: number) => Surface): this {
    for (let j = 0; j < this.snz; j++) {
      for (let i = 0; i < this.snx; i++) {
        this.surfaces[j * this.snx + i] = SURFACES.indexOf(f(this.x0 + (i + 0.5) * this.surfaceCell, this.z0 + (j + 0.5) * this.surfaceCell));
      }
    }
    return this;
  }

  heightAt(i: number, j: number): number {
    return this.heights[Math.max(0, Math.min(this.nz - 1, j)) * this.nx + Math.max(0, Math.min(this.nx - 1, i))];
  }

  height(x: number, z: number): number {
    const fx = (x - this.x0) / this.cell, fz = (z - this.z0) / this.cell;
    const cx = Math.max(0, Math.min(this.nx - 1.000001, fx)), cz = Math.max(0, Math.min(this.nz - 1.000001, fz));
    const i = Math.floor(cx), j = Math.floor(cz), u = cx - i, v = cz - j;
    const h00 = this.heightAt(i, j), h10 = this.heightAt(i + 1, j), h01 = this.heightAt(i, j + 1), h11 = this.heightAt(i + 1, j + 1);
    return (h00 * (1 - u) + h10 * u) * (1 - v) + (h01 * (1 - u) + h11 * u) * v;
  }

  normal(x: number, z: number, out: number[]): number[] {
    const e = this.cell * 0.25;
    const dx = (this.height(x + e, z) - this.height(x - e, z)) / (2 * e);
    const dz = (this.height(x, z + e) - this.height(x, z - e)) / (2 * e);
    const len = Math.hypot(dx, 1, dz);
    out[0] = -dx / len; out[1] = 1 / len; out[2] = -dz / len;
    return out;
  }

  surface(x: number, z: number): Surface {
    const i = Math.floor((x - this.x0) / this.surfaceCell), j = Math.floor((z - this.z0) / this.surfaceCell);
    if (i < 0 || j < 0 || i >= this.snx || j >= this.snz) return 'out';
    return SURFACES[this.surfaces[j * this.snx + i]];
  }
}

/**
 * Which way and how steeply the ground falls at (x, z): the downhill direction
 * (x, z, unit) and the slope (rise per metre).
 */
export function downhill(ground: Ground, x: number, z: number): { x: number; z: number; slope: number } {
  const n = ground.normal(x, z, [0, 1, 0]);
  const h = Math.hypot(n[0], n[2]);
  if (h < 1e-9) return { x: 0, z: 0, slope: 0 };
  return { x: n[0] / h, z: n[2] / h, slope: h / Math.max(1e-6, n[1]) };
}
