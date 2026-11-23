// A track: a closed centre line through control points (a Catmull-Rom curve,
// sampled every metre or so) with a width. Across it, from the middle out:
// the road, a kerb, a strip of grass, then a wall. It answers where the car
// is along and across it, what is under it, and pushes it off the walls.
import { Car, endDrift } from './car';

export interface TrackSpec {
  /** A short key (for what is kept in the browser), and the name shown. */
  id: string;
  name: string;
  /** Control points [x, y] (m), in driving order; the line closes back to the first. */
  points: [number, number][];
  /** Road width (m), the kerbs' width, and the grass from the kerb to the wall. */
  width: number;
  kerb?: number;
  runoff?: number;
}

export interface Sample {
  x: number;
  y: number;
  /** Unit tangent (driving direction) and the normal to its left. */
  tx: number;
  ty: number;
  nx: number;
  ny: number;
  /** Distance along the line from the start (m). */
  s: number;
  /** Signed curvature (1/m, positive bends left). */
  bend: number;
}

export interface Track {
  id: string;
  name: string;
  samples: Sample[];
  length: number;
  /** Half the road's width, where the kerb ends, and where the wall stands, from the middle (m). */
  half: number;
  kerbEdge: number;
  wall: number;
}

export type Surface = 'road' | 'kerb' | 'grass';

/** Grip and extra drag (N per m/s) on each surface. */
export const SURFACE: Record<Surface, { grip: number; drag: number }> = {
  road: { grip: 1, drag: 0 },
  kerb: { grip: 0.95, drag: 30 },
  grass: { grip: 0.6, drag: 260 },
};

/** A wall bounce keeps this share of the speed into the wall, and of the speed along it. */
export const WALL = { bounce: 0.25, scrape: 0.92 };

function catmull(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const t2 = t * t, t3 = t2 * t;
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}

export function makeTrack(spec: TrackSpec, spacing = 1): Track {
  const pts = spec.points;
  const n = pts.length;
  // A dense run along the curve first, then even steps along it.
  const dense: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    for (let k = 0; k < 40; k++) {
      const t = k / 40;
      dense.push([catmull(p0[0], p1[0], p2[0], p3[0], t), catmull(p0[1], p1[1], p2[1], p3[1], t)]);
    }
  }
  const run = [0];
  for (let i = 1; i <= dense.length; i++) {
    const a = dense[i - 1], b = dense[i % dense.length];
    run.push(run[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1]));
  }
  const length = run[dense.length];
  const count = Math.max(8, Math.round(length / spacing));
  const step = length / count;
  const at: [number, number][] = [];
  let j = 0;
  for (let i = 0; i < count; i++) {
    const s = i * step;
    while (run[j + 1] < s) j++;
    const a = dense[j], b = dense[(j + 1) % dense.length];
    const f = (s - run[j]) / Math.max(1e-9, run[j + 1] - run[j]);
    at.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]);
  }
  const samples: Sample[] = at.map(([x, y], i) => {
    const prev = at[(i - 1 + count) % count], next = at[(i + 1) % count];
    const dx = next[0] - prev[0], dy = next[1] - prev[1], l = Math.hypot(dx, dy) || 1;
    return { x, y, tx: dx / l, ty: dy / l, nx: -dy / l, ny: dx / l, s: i * step, bend: 0 };
  });
  samples.forEach((p, i) => {
    const a = samples[(i - 1 + count) % count], b = samples[(i + 1) % count];
    const turn = Math.atan2(a.tx * b.ty - a.ty * b.tx, a.tx * b.tx + a.ty * b.ty);
    p.bend = turn / (2 * step);
  });
  const half = spec.width / 2;
  const kerbEdge = half + (spec.kerb ?? 1);
  return { id: spec.id, name: spec.name, samples, length, half, kerbEdge, wall: kerbEdge + (spec.runoff ?? 5) };
}

export interface Place {
  /** The nearest sample, and the distance along the line (m) and across it (m, positive to the left). */
  index: number;
  along: number;
  side: number;
}

/**
 * Where (x, y) is on the track. With `hint` (the last index) only the samples
 * near it are searched; the track must not come back within this window.
 */
export function placeOn(track: Track, x: number, y: number, hint = -1): Place {
  const ss = track.samples, n = ss.length;
  let best = 0, bestD = Infinity;
  const look = (i: number) => {
    const p = ss[i];
    const d = (x - p.x) ** 2 + (y - p.y) ** 2;
    if (d < bestD) { bestD = d; best = i; }
  };
  if (hint < 0) for (let i = 0; i < n; i++) look(i);
  else for (let k = -40; k <= 40; k++) look((hint + k + n) % n);
  // Between the nearest sample and its better neighbour.
  const p = ss[best];
  const dx = x - p.x, dy = y - p.y;
  const ahead = dx * p.tx + dy * p.ty;
  let along = p.s + ahead;
  if (along < 0) along += track.length;
  if (along >= track.length) along -= track.length;
  return { index: best, along, side: dx * p.nx + dy * p.ny };
}

export function surfaceAt(track: Track, side: number): Surface {
  const d = Math.abs(side);
  return d <= track.half ? 'road' : d <= track.kerbEdge ? 'kerb' : 'grass';
}

/** The sample `ahead` metres along from `index`. */
export function sampleAhead(track: Track, index: number, ahead: number): Sample {
  const n = track.samples.length;
  const step = track.length / n;
  return track.samples[(((index + Math.round(ahead / step)) % n) + n) % n];
}

/**
 * Sets the ground under the car from where it is, and pushes it back off the
 * walls. Returns its place and the speed it hit a wall with (0 if none).
 */
export function keepOnTrack(track: Track, car: Car, hint = -1): Place & { hit: number } {
  let place = placeOn(track, car.x, car.y, hint);
  const surface = SURFACE[surfaceAt(track, place.side)];
  car.surfaceGrip = surface.grip;
  car.surfaceDrag = surface.drag;
  let hit = 0;
  const limit = track.wall - car.spec.radius;
  if (Math.abs(place.side) > limit) {
    const p = track.samples[place.index];
    const out = Math.sign(place.side);
    // The wall's outward normal, and the car put back inside it.
    const nx = p.nx * out, ny = p.ny * out;
    const over = Math.abs(place.side) - limit;
    car.x -= nx * over;
    car.y -= ny * over;
    const into = car.vx * nx + car.vy * ny;
    if (into > 0) {
      hit = into;
      // Bounce off the wall and scrape along it.
      const tx = car.vx - into * nx, ty = car.vy - into * ny;
      car.vx = tx * WALL.scrape - into * WALL.bounce * nx;
      car.vy = ty * WALL.scrape - into * WALL.bounce * ny;
      car.spin *= 0.6;
      if (into > 3) endDrift(car);
    }
    place = placeOn(track, car.x, car.y, place.index);
  }
  return { ...place, hit };
}
