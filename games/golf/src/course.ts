// Holes described in code, and the ground built from a description: relief,
// fairway, green, tee, bunkers, water and trees. No engine, so it is tested in Node.
import { Tree } from './ball';
import { HeightField, Surface } from './terrain';

/** An ellipse on the ground (radii along its own axes, turned `rot` radians). */
export interface Ellipse { x: number; z: number; rx: number; rz: number; rot?: number }
/** Water: a lake (an ellipse) or a creek (a band along a line). */
export type WaterShape = ({ kind: 'lake' } & Ellipse) | { kind: 'creek'; line: { x: number; z: number }[]; width: number };

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
  /** Hills: how high (m) and how many waves along the hole; the seed moves them. `rise`: metres up from tee to green. */
  relief: { height: number; waves: number; seed: number; rise?: number };
  bunkers?: Ellipse[];
  water?: WaterShape[];
  /** How many trees to scatter in the rough (seeded), and trees placed by hand. */
  trees?: { count: number; seed: number; at?: { x: number; z: number }[] };
  /** The strongest wind on this hole, m/s (each play draws one up to it). */
  windMax: number;
}

export interface Hole {
  spec: HoleSpec;
  ground: HeightField;
  /** Each water shape with the level of its surface. */
  water: { shape: WaterShape; level: number }[];
  trees: Tree[];
}

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

/** How far inside an ellipse a point is: < 1 inside, 1 on its edge. */
export function ellipseDistance(e: Ellipse, x: number, z: number): number {
  const c = Math.cos(e.rot ?? 0), s = Math.sin(e.rot ?? 0);
  const dx = x - e.x, dz = z - e.z;
  const u = dx * c + dz * s, v = -dx * s + dz * c;
  return Math.hypot(u / e.rx, v / e.rz);
}

/** Distance (m) outside a water shape: negative inside. */
export function waterDistance(w: WaterShape, x: number, z: number): number {
  if (w.kind === 'creek') return distanceToLine(w.line, x, z) - w.width / 2;
  return (ellipseDistance(w, x, z) - 1) * Math.min(w.rx, w.rz);
}

/** 0 at `edge0` and below, 1 at `edge1` and above, smooth between. */
function smooth(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/** A seeded random number generator (0–1). */
export function seeded(seed: number): () => number {
  let s = (seed * 2654435761) >>> 0 || 1;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 2 ** 32; };
}

/** Builds the ground for a hole: 2 m height grid, 0.5 m surface grid, margin around it. */
export function buildHole(spec: HoleSpec): Hole {
  const pts = [spec.tee, spec.pin, ...spec.fairway];
  for (const w of spec.water ?? []) if (w.kind === 'lake') pts.push(w); else pts.push(...w.line);
  const margin = 55;
  const xMin = Math.min(...pts.map((p) => p.x)) - margin, xMax = Math.max(...pts.map((p) => p.x)) + margin;
  const zMin = Math.min(...pts.map((p) => p.z)) - margin, zMax = Math.max(...pts.map((p) => p.z)) + 30;
  const cell = 2;
  const nx = Math.ceil((xMax - xMin) / cell) + 1, nz = Math.ceil((zMax - zMin) / cell) + 1;
  const ground = new HeightField(xMin, zMin, cell, nx, nz, 0.5);
  const green = spec.pin;
  const length = Math.hypot(spec.pin.x - spec.tee.x, spec.pin.z - spec.tee.z) || 1;
  const { height, waves, seed } = spec.relief;
  const rise = spec.relief.rise ?? 0;
  const k = (2 * Math.PI * waves) / length;
  // Rolling hills, rising (or falling) steadily from the tee to the green.
  const hills = (x: number, z: number) => {
    const along = Math.max(-0.2, Math.min(1.2, ((spec.tee.z - z) * (spec.tee.z - green.z) + (x - spec.tee.x) * (green.x - spec.tee.x)) / (length * length)));
    return height * (0.6 * Math.sin(k * z + seed) * Math.cos(0.7 * k * x + seed * 2) + 0.4 * Math.sin(1.9 * k * z + 0.8 * k * x + seed * 3))
      + rise * along;
  };
  const greenHeight = hills(green.x, green.z);
  const teeHeight = hills(spec.tee.x, spec.tee.z);
  // Each water's level: just under the lowest ground around its edge.
  const water = (spec.water ?? []).map((shape) => {
    let low = Infinity;
    const edge = shape.kind === 'lake'
      ? Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2, c = Math.cos(shape.rot ?? 0), s = Math.sin(shape.rot ?? 0);
        const u = Math.cos(a) * shape.rx * 1.2, v = Math.sin(a) * shape.rz * 1.2;
        return { x: shape.x + u * c - v * s, z: shape.z + u * s + v * c };
      })
      : shape.line;
    for (const p of edge) low = Math.min(low, hills(p.x, p.z));
    return { shape, level: low - 0.35 };
  });
  const landOver = (x: number, z: number) => {
    // The green and the tee are land even inside a lake (an island green).
    const g = 1 - smooth(spec.green.radius + 1, spec.green.radius + 3, Math.hypot(x - green.x, z - green.z));
    const t = 1 - smooth(5, 8, Math.hypot(x - spec.tee.x, z - spec.tee.z));
    return Math.max(g, t);
  };
  ground.shape((x, z) => {
    let h = hills(x, z);
    // Rough rises a little away from the fairway, framing the hole.
    h += smooth(spec.fairwayWidth / 2, spec.fairwayWidth / 2 + 30, distanceToLine(spec.fairway, x, z)) * 2;
    // Bunkers: a dish half a metre deep.
    for (const b of spec.bunkers ?? []) h -= 0.5 * (1 - smooth(0.6, 1.1, ellipseDistance(b, x, z)));
    // Water: the bed under the level, the banks easing back into the hills.
    const land = landOver(x, z);
    for (const w of water) {
      const d = waterDistance(w.shape, x, z);
      const bed = w.level - 0.5;
      const t = smooth(-1, 6, d);
      h = Math.min(h, bed * (1 - t) + h * t) * (1 - land) + h * land;
    }
    const dg = Math.hypot(x - green.x, z - green.z);
    const onGreen = 1 - smooth(spec.green.radius, spec.green.radius + 8, dg);
    const greenPlane = greenHeight + 0.25 + spec.green.tiltX * (x - green.x) + spec.green.tiltZ * (z - green.z);
    const onTee = 1 - smooth(5, 14, Math.hypot(x - spec.tee.x, z - spec.tee.z));
    return h * (1 - onGreen) * (1 - onTee) + greenPlane * onGreen + (teeHeight + 0.15) * onTee * (1 - onGreen);
  });
  ground.paint((x, z): Surface => {
    if (Math.hypot(x - green.x, z - green.z) < spec.green.radius) return 'green';
    if (Math.abs(x - spec.tee.x) < 4 && Math.abs(z - spec.tee.z) < 5) return 'tee';
    for (const w of water) if (waterDistance(w.shape, x, z) < 0) return 'water';
    for (const b of spec.bunkers ?? []) if (ellipseDistance(b, x, z) < 1) return 'sand';
    if (distanceToLine(spec.fairway, x, z) < spec.fairwayWidth / 2) return 'fairway';
    if (x < xMin + 8 || x > xMax - 8 || z < zMin + 8 || z > zMax - 4) return 'out';
    return 'rough';
  });
  return { spec, ground, water, trees: plantTrees(spec, ground) };
}

/** Trees in the rough: seeded, clear of the fairway, green, tee, sand and water. */
function plantTrees(spec: HoleSpec, ground: HeightField): Tree[] {
  const trees: Tree[] = [];
  const t = spec.trees;
  if (!t) return trees;
  const rnd = seeded(t.seed);
  const add = (x: number, z: number, size: number) => {
    const y = ground.height(x, z);
    const h = 5 + size * 4;
    trees.push({ x, z, y, trunkRadius: 0.25 + size * 0.15, trunkHeight: h * 0.45, canopyY: y + h * 0.62, canopyRadius: 1.8 + size * 1.6 });
  };
  for (const p of t.at ?? []) add(p.x, p.z, 0.6);
  let tries = 0;
  while (trees.length < t.count + (t.at?.length ?? 0) && tries++ < t.count * 40) {
    const x = ground.x0 + 10 + rnd() * (ground.x1 - ground.x0 - 20);
    const z = ground.z0 + 10 + rnd() * (ground.z1 - ground.z0 - 20);
    if (ground.surface(x, z) !== 'rough') continue;
    if (distanceToLine(spec.fairway, x, z) < spec.fairwayWidth / 2 + 4) continue;
    if (Math.hypot(x - spec.pin.x, z - spec.pin.z) < spec.green.radius + 10) continue;
    if (Math.hypot(x - spec.tee.x, z - spec.tee.z) < 14) continue;
    let clear = true;
    for (let a = 0; a < 6 && clear; a++) {
      const s = ground.surface(x + Math.cos(a) * 4, z + Math.sin(a) * 4);
      if (s === 'water' || s === 'sand') clear = false;
    }
    if (!clear || trees.some((o) => Math.hypot(o.x - x, o.z - z) < 5)) continue;
    add(x, z, rnd());
  }
  return trees;
}

/**
 * Where to drop after the ball went into water at `wet`: back along the line it
 * came on, to dry ground, then 2 m more.
 */
export function dropPoint(ground: HeightField, from: { x: number; z: number }, wet: { x: number; z: number }): { x: number; z: number } {
  const dx = from.x - wet.x, dz = from.z - wet.z;
  const len = Math.hypot(dx, dz) || 1;
  for (let d = 0.5; d < len; d += 0.5) {
    const x = wet.x + (dx / len) * d, z = wet.z + (dz / len) * d;
    const s = ground.surface(x, z);
    if (s !== 'water' && s !== 'out') {
      const back = Math.min(len, d + 2);
      return { x: wet.x + (dx / len) * back, z: wet.z + (dz / len) * back };
    }
  }
  return { ...from };
}
