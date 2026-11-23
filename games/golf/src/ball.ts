// The golf ball: flight with drag and the Magnus effect, bounces and rolling on
// the ground, the cup. Our own integrator (no physics engine), so it is small,
// deterministic and testable.
import { FEEL, Ground, Surface } from './terrain';

export const BALL = {
  radius: 0.02135,
  mass: 0.04593,
  /** Air density (kg/m³), drag coefficient. */
  air: 1.2,
  drag: 0.25,
  /** Lift coefficient per unit of spin ratio (r·ω / v), and its cap. */
  liftPerSpin: 1.6,
  maxLift: 0.32,
  /** Spin halves in this many seconds in the air. */
  spinHalfLife: 7,
  gravity: 9.81,
  /** Below this speed into the ground (m/s) a bounce becomes a roll. */
  rollBelow: 0.6,
  /** At rest below this speed (m/s), when the slope can't keep it going. */
  restBelow: 0.04,
  /** The cup: radius, and the fastest roll it catches (faster lips out over it). */
  cupRadius: 0.054,
  cupCatch: 1.5,
  step: 1 / 120,
};

/** A shot leaving the club. */
export interface Shot {
  /** m/s. */
  speed: number;
  /** Launch angle above the horizontal, radians. */
  launch: number;
  /** Direction, radians from straight down the hole (-z); positive = right. */
  direction: number;
  /** rad/s; positive lifts the ball. */
  backspin: number;
  /** rad/s; positive curves to the right. */
  sidespin: number;
}

export type BallPhase = 'flying' | 'rolling' | 'rest' | 'holed' | 'water' | 'out';

export interface BallState {
  pos: number[];
  vel: number[];
  /** Spin vector, rad/s (world axes). */
  spin: number[];
  phase: BallPhase;
  /** Seconds since the shot. */
  time: number;
  /** Where it first touched the ground (the carry), once it has. */
  landed: number[] | null;
  /** Times it hit a trunk, and steps spent in leaves (for sounds). */
  trunkHits: number;
  inLeaves: number;
  /** It has run over the cup's lip already (once per shot). */
  lipped?: boolean;
}

/** A tree: a trunk (a cylinder from the ground) and a canopy (a ball of leaves). */
export interface Tree {
  x: number; z: number;
  /** Ground height at the trunk. */
  y: number;
  trunkRadius: number;
  trunkHeight: number;
  /** The canopy's centre height and radius. */
  canopyY: number;
  canopyRadius: number;
}

export interface Course {
  ground: Ground;
  /** The cup's centre on the ground. */
  cup: { x: number; z: number };
  /** Wind, m/s (x, z). */
  wind?: { x: number; z: number };
  trees?: Tree[];
}

/** A ball resting at `pos` (its centre is set on the ground). */
export function restingBall(ground: Ground, x: number, z: number): BallState {
  return { pos: [x, ground.height(x, z) + BALL.radius, z], vel: [0, 0, 0], spin: [0, 0, 0], phase: 'rest', time: 0, landed: null, trunkHits: 0, inLeaves: 0 };
}

/** Starts a shot from a resting ball. */
export function hit(ball: BallState, shot: Shot): void {
  const h = Math.cos(shot.launch) * shot.speed;
  const fx = Math.sin(shot.direction), fz = -Math.cos(shot.direction); // forward on the ground
  ball.vel = [fx * h, Math.sin(shot.launch) * shot.speed, fz * h];
  // Backspin about forward × up (lift for ω × v); sidespin about -up (curves right).
  ball.spin = [-fz * shot.backspin, -shot.sidespin, fx * shot.backspin];
  ball.phase = shot.launch < 0.02 ? 'rolling' : 'flying';
  ball.time = 0;
  ball.landed = null;
  ball.trunkHits = 0;
  ball.inLeaves = 0;
  ball.lipped = false;
}

const n = [0, 1, 0];

/** Advances the ball by one fixed step. */
export function stepBall(ball: BallState, course: Course, dt = BALL.step): void {
  if (ball.phase !== 'flying' && ball.phase !== 'rolling') return;
  ball.time += dt;
  const { ground } = course;
  const p = ball.pos, v = ball.vel;
  if (ball.phase === 'flying') {
    const wind = course.wind ?? { x: 0, z: 0 };
    const ax = v[0] - wind.x, ay = v[1], az = v[2] - wind.z; // velocity through the air
    const speed = Math.hypot(ax, ay, az);
    const area = Math.PI * BALL.radius * BALL.radius;
    const q = (0.5 * BALL.air * area * speed * speed) / BALL.mass; // dynamic pressure × area / mass
    const acc = [0, -BALL.gravity, 0];
    if (speed > 1e-6) {
      acc[0] -= (q * BALL.drag * ax) / speed;
      acc[1] -= (q * BALL.drag * ay) / speed;
      acc[2] -= (q * BALL.drag * az) / speed;
      const s = ball.spin, w = Math.hypot(s[0], s[1], s[2]);
      if (w > 1e-6) {
        const lift = Math.min(BALL.maxLift, (BALL.liftPerSpin * BALL.radius * w) / speed);
        // Direction of ω × v.
        const cx = s[1] * az - s[2] * ay, cy = s[2] * ax - s[0] * az, cz = s[0] * ay - s[1] * ax;
        const cl = Math.hypot(cx, cy, cz);
        if (cl > 1e-9) {
          acc[0] += (q * lift * cx) / cl;
          acc[1] += (q * lift * cy) / cl;
          acc[2] += (q * lift * cz) / cl;
        }
      }
    }
    const decay = Math.pow(0.5, dt / BALL.spinHalfLife);
    for (let k = 0; k < 3; k++) { v[k] += acc[k] * dt; p[k] += v[k] * dt; ball.spin[k] *= decay; }
    const floor = ground.height(p[0], p[2]) + BALL.radius;
    if (p[1] <= floor) {
      p[1] = floor;
      if (!ball.landed) ball.landed = [p[0], p[1], p[2]];
      touchDown(ball, course);
    }
  } else {
    roll(ball, course, dt);
  }
  if (course.trees) hitTrees(ball, course.trees, dt);
  settle(ball, course);
}

/** Trunks bounce the ball back; leaves slow it right down. */
function hitTrees(ball: BallState, trees: Tree[], dt: number): void {
  if (ball.phase !== 'flying' && ball.phase !== 'rolling') return;
  const p = ball.pos, v = ball.vel;
  for (const t of trees) {
    const dx = p[0] - t.x, dz = p[2] - t.z;
    if (Math.abs(dx) > t.canopyRadius + 1 || Math.abs(dz) > t.canopyRadius + 1) continue;
    const dh = Math.hypot(dx, dz);
    if (dh < t.trunkRadius + BALL.radius && p[1] < t.y + t.trunkHeight) {
      const nx = dh > 1e-6 ? dx / dh : 1, nz = dh > 1e-6 ? dz / dh : 0;
      p[0] = t.x + nx * (t.trunkRadius + BALL.radius);
      p[2] = t.z + nz * (t.trunkRadius + BALL.radius);
      const vn = v[0] * nx + v[2] * nz;
      if (vn < 0) {
        v[0] -= 1.45 * vn * nx;
        v[2] -= 1.45 * vn * nz;
        for (let k = 0; k < 3; k++) v[k] *= 0.7;
        ball.trunkHits++;
      }
      continue;
    }
    const dy = p[1] - t.canopyY;
    if (ball.phase === 'flying' && dh * dh + dy * dy < t.canopyRadius * t.canopyRadius) {
      const keep = Math.exp(-5 * dt);
      for (let k = 0; k < 3; k++) { v[k] *= keep; ball.spin[k] *= keep; }
      ball.inLeaves++;
    }
  }
}

/** The ball meets the ground in flight: bounce, or start rolling. */
function touchDown(ball: BallState, course: Course): void {
  const { ground } = course;
  const p = ball.pos, v = ball.vel;
  const surface = ground.surface(p[0], p[2]);
  if (surface === 'water') { ball.phase = 'water'; v.fill(0); return; }
  ground.normal(p[0], p[2], n);
  const vn = v[0] * n[0] + v[1] * n[1] + v[2] * n[2];
  if (vn >= 0) return;
  // A ball dropping into the cup.
  if (Math.hypot(p[0] - course.cup.x, p[2] - course.cup.z) < BALL.cupRadius && -vn < 4) { hole(ball, course); return; }
  const feel = FEEL[surface];
  const vt = [v[0] - vn * n[0], v[1] - vn * n[1], v[2] - vn * n[2]];
  // Backspin bites: the faster it spins, the more speed along the ground it takes away.
  const back = Math.hypot(ball.spin[0], ball.spin[2]);
  const keep = feel.bounceKeep * (1 - 0.6 * Math.min(1, back / 900));
  const out = -vn * feel.restitution;
  for (let k = 0; k < 3; k++) v[k] = vt[k] * keep + n[k] * out;
  for (let k = 0; k < 3; k++) ball.spin[k] *= 0.4;
  if (out < BALL.rollBelow) {
    // From skidding to rolling: friction takes the speed down to 5/7 of it, and
    // what backspin is left pulls it back further (a wedge checks up).
    ball.phase = 'rolling';
    const along = v[0] * n[0] + v[1] * n[1] + v[2] * n[2];
    const left = Math.hypot(ball.spin[0], ball.spin[2]);
    const check = (5 / 7) * (1 - 0.6 * Math.min(1, left / 250));
    for (let k = 0; k < 3; k++) v[k] = (v[k] - along * n[k]) * check;
  }
}

/** Rolling on the ground: the slope pulls (5/7 g for a rolling sphere), the surface slows it. */
function roll(ball: BallState, course: Course, dt: number): void {
  const { ground } = course;
  const p = ball.pos, v = ball.vel;
  const surface = ground.surface(p[0], p[2]);
  if (surface === 'water') { ball.phase = 'water'; v.fill(0); return; }
  ground.normal(p[0], p[2], n);
  const g = BALL.gravity;
  // Gravity along the slope (its horizontal part, downhill), 5/7 of it for a rolling sphere.
  const slope = [g * n[1] * n[0] * (5 / 7), 0, g * n[1] * n[2] * (5 / 7)];
  const speed = Math.hypot(v[0], v[2]);
  const decel = FEEL[surface].rolling;
  if (speed > 1e-6) {
    const dv = Math.min(speed, decel * dt);
    v[0] -= (v[0] / speed) * dv;
    v[2] -= (v[2] / speed) * dv;
  }
  v[0] += slope[0] * dt;
  v[2] += slope[2] * dt;
  p[0] += v[0] * dt;
  p[2] += v[2] * dt;
  const floor = ground.height(p[0], p[2]) + BALL.radius;
  // Over a crest faster than the ground falls away: it takes off again.
  const vy = (floor - p[1]) / dt;
  if (vy < -0.5 && speed > 3) { ball.phase = 'flying'; v[1] = 0; return; }
  v[1] = vy;
  p[1] = floor;
  // The cup.
  const d = Math.hypot(p[0] - course.cup.x, p[2] - course.cup.z);
  if (d < BALL.cupRadius && speed < BALL.cupCatch) { hole(ball, course); return; }
  // Too fast: it catches the lip once on the way over, turning away from the cup's
  // centre and losing some speed.
  if (d < BALL.cupRadius && !ball.lipped && speed > 1e-6) {
    ball.lipped = true;
    const ox = (p[0] - course.cup.x) / (d || 1), oz = (p[2] - course.cup.z) / (d || 1);
    const side = (v[0] * oz - v[2] * ox) >= 0 ? 1 : -1; // which side of the centre line it passes
    const turn = side * 0.25 * (1 - d / BALL.cupRadius);
    const c = Math.cos(turn), sn = Math.sin(turn);
    const vx = v[0] * c - v[2] * sn, vz = v[0] * sn + v[2] * c;
    v[0] = vx * 0.7; v[2] = vz * 0.7;
  }
  const pull = Math.hypot(slope[0], slope[2]);
  if (Math.hypot(v[0], v[2]) < BALL.restBelow && pull < decel) {
    ball.phase = 'rest';
    v.fill(0);
    ball.spin.fill(0);
  }
}

function hole(ball: BallState, course: Course): void {
  ball.phase = 'holed';
  ball.vel.fill(0);
  ball.spin.fill(0);
  ball.pos[0] = course.cup.x;
  ball.pos[2] = course.cup.z;
  ball.pos[1] = course.ground.height(course.cup.x, course.cup.z) - 0.06;
}

/** Off the ground's area: out of bounds. */
function settle(ball: BallState, course: Course): void {
  if (ball.phase === 'rest' || ball.phase === 'rolling') {
    if (course.ground.surface(ball.pos[0], ball.pos[2]) === 'out') { ball.phase = 'out'; ball.vel.fill(0); }
  }
}

export interface ShotResult {
  /** Where it ended (or went into water / out). */
  end: number[];
  /** Where it first landed. */
  carry: number[] | null;
  phase: BallPhase;
  /** The flight path, sampled every `every` steps. */
  path: number[][];
  surface: Surface;
}

/** Plays a shot to the end (at most `maxTime` seconds) without drawing it. */
export function simulate(course: Course, from: { x: number; z: number }, shot: Shot, maxTime = 30, every = 6): ShotResult {
  const ball = restingBall(course.ground, from.x, from.z);
  hit(ball, shot);
  const path: number[][] = [[...ball.pos]];
  let k = 0;
  while ((ball.phase === 'flying' || ball.phase === 'rolling') && ball.time < maxTime) {
    stepBall(ball, course);
    if (++k % every === 0) path.push([...ball.pos]);
  }
  return { end: [...ball.pos], carry: ball.landed, phase: ball.phase, path, surface: course.ground.surface(ball.pos[0], ball.pos[2]) };
}
