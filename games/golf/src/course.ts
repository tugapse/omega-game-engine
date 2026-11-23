// Holes described in code, and the ground built from a description: relief,
// fairway, green and tee. Phase 1 has one test hole; phase 2 adds sand, water,
// trees and the real course.
import { HeightField, Surface } from './terrain';

export interface HoleSpec {
  name: string;
  par: number;
  tee: { x: number; z: number };
  pin: { x: number; z: number };
  /** The fairway's centre line, from near the tee to the green, and its width (m). */
  fairway: { x: number; z: number }[];
  fairwayWidth: number;
  /** The green's radius (m) and its tilt: the rise (m per m) along x and z. */
  green: { radius: number; tiltX: number; tiltZ: number };
  /** Hills: how high (m) and how many waves along the hole; the seed moves them. */
  relief: { height: number; waves: number; seed: number };
}

export interface Hole {
  spec: HoleSpec;
  ground: HeightField;
  /** The green's centre (the pin sits on it). */
  greenCentre: { x: number; z: number };
}

/** Phase 1's test hole: a par 4 of about 330 m, a gentle dogleg right, a tilted green. */
export const TEST_HOLE: HoleSpec = {
  name: 'Buraco de treino',
  par: 4,
  tee: { x: 0, z: 0 },
  pin: { x: 14, z: -322 },
  fairway: [{ x: 0, z: -20 }, { x: -4, z: -140 }, { x: 4, z: -230 }, { x: 13, z: -300 }],
  fairwayWidth: 32,
  green: { radius: 15, tiltX: -0.012, tiltZ: 0.018 },
  relief: { height: 1.6, waves: 3, seed: 1 },
};

/** Distance from (x, z) to the polyline `line`. */
export function distanceToLine(line: { x: number; z: number }[], x: number, z: number): number {
  let best = Infinity;
  for (let i = 1; i < line.length; i++) {
    const a = line[i - 1], b = line[i];
    const dx = b.x - a.x, dz = b.z - a.z;
    const t = Math.max(0, Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / (dx * dx + dz * dz || 1)));
    best = Math.min(best, Math.hypot(x - (a.x + dx * t), z - (a.z + dz * t)));
  }
  return best;
}

/** 0 at `edge0` and below, 1 at `edge1` and above, smooth between. */
function smooth(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/** Builds the ground for a hole: 2 m height grid, 1 m surface grid, 60 m of margin around it. */
export function buildHole(spec: HoleSpec): Hole {
  const pts = [spec.tee, spec.pin, ...spec.fairway];
  const margin = 60;
  const xMin = Math.min(...pts.map((p) => p.x)) - margin, xMax = Math.max(...pts.map((p) => p.x)) + margin;
  const zMin = Math.min(...pts.map((p) => p.z)) - margin, zMax = Math.max(...pts.map((p) => p.z)) + margin / 2;
  const cell = 2;
  const nx = Math.ceil((xMax - xMin) / cell) + 1, nz = Math.ceil((zMax - zMin) / cell) + 1;
  const ground = new HeightField(xMin, zMin, cell, nx, nz, 1);
  const green = spec.pin; // the green is centred on the pin for now
  const length = Math.hypot(spec.pin.x - spec.tee.x, spec.pin.z - spec.tee.z) || 1;
  const { height, waves, seed } = spec.relief;
  const k = (2 * Math.PI * waves) / length;
  const hills = (x: number, z: number) =>
    height * (0.6 * Math.sin(k * z + seed) * Math.cos(0.7 * k * x + seed * 2)
      + 0.4 * Math.sin(1.9 * k * z + 0.8 * k * x + seed * 3));
  const greenHeight = hills(green.x, green.z);
  const teeHeight = hills(spec.tee.x, spec.tee.z);
  ground.shape((x, z) => {
    const h = hills(x, z);
    // Flat tee box; the green is a tilted plane blended into the hills.
    const dg = Math.hypot(x - green.x, z - green.z);
    const onGreen = 1 - smooth(spec.green.radius, spec.green.radius + 8, dg);
    const greenPlane = greenHeight + 0.25 + spec.green.tiltX * (x - green.x) + spec.green.tiltZ * (z - green.z);
    const dt = Math.hypot(x - spec.tee.x, z - spec.tee.z);
    const onTee = 1 - smooth(5, 14, dt);
    // Rough rises a little away from the fairway, framing the hole.
    const side = smooth(spec.fairwayWidth / 2, spec.fairwayWidth / 2 + 30, distanceToLine(spec.fairway, x, z)) * 2.5;
    const base = h + side;
    return base * (1 - onGreen) * (1 - onTee) + greenPlane * onGreen + (teeHeight + 0.15) * onTee * (1 - onGreen);
  });
  ground.paint((x, z): Surface => {
    if (Math.hypot(x - green.x, z - green.z) < spec.green.radius) return 'green';
    if (Math.abs(x - spec.tee.x) < 4 && Math.abs(z - spec.tee.z) < 5) return 'tee';
    if (distanceToLine(spec.fairway, x, z) < spec.fairwayWidth / 2) return 'fairway';
    if (x < xMin + 10 || x > xMax - 10 || z < zMin + 10 || z > zMax - 5) return 'out';
    return 'rough';
  });
  return { spec, ground, greenCentre: { ...green } };
}
