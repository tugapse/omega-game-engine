// The obstacle mode's lanes: what stands on the lane at each level (seeded, so
// a level is always the same lane), and the physics bodies that play it. The
// bodies come from a fixed pool, parked under the floor when not used, so
// changing lanes never creates or destroys anything. No rendering here (look.ts
// dresses the pool), so it runs in tests.
import { quat, vec3 } from 'gl-matrix';
import { ColliderBehaviour, ColliderShape, PhysicsWorld, RigidBodyBehaviour, RigidBodyType, SceneEntity } from '../../../src';
import { BALL, LANE, LaneEntities } from './lane';

export type ObstacleSpec =
  /** A fixed post (traffic bollard). */
  | { kind: 'post'; x: number; z: number }
  /** A short rubber bumper the ball bounces off. */
  | { kind: 'bumper'; x: number; z: number }
  /** A bar sliding across the lane: x = range · sin(2πt / period + phase). */
  | { kind: 'slider'; z: number; range: number; period: number; phase: number }
  /** A paddle turning about its centre, `speed` rad/s. */
  | { kind: 'spinner'; x: number; z: number; speed: number }
  /** A stretch of lane that pushes the ball sideways (`accel` m/s², + is to the right). */
  | { kind: 'wind'; z0: number; z1: number; accel: number };

export type ObstacleKind = ObstacleSpec['kind'];

/** Sizes, in metres. */
export const OBSTACLE = {
  post: { radius: 0.09, height: 0.4 },
  bumper: { radius: 0.07, height: 0.12 },
  slider: { half: [0.17, 0.15, 0.06] as [number, number, number] },
  spinner: { half: [0.25, 0.12, 0.035] as [number, number, number] },
  /** How far below the lane the obstacles sink while the lane changes. */
  sink: 0.5,
};

/** How many of each the pool holds (the most any level uses). */
export const POOL: Record<ObstacleKind, number> = { post: 3, bumper: 3, slider: 3, spinner: 1, wind: 1 };

function seeded(seed: number): () => number {
  let s = (seed * 2654435761) >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

/** Half-width of the band a fixed obstacle blocks for the ball's centre. */
function blockedHalfWidth(o: ObstacleSpec): number {
  if (o.kind === 'post') return OBSTACLE.post.radius + BALL.radius;
  if (o.kind === 'bumper') return OBSTACLE.bumper.radius + BALL.radius;
  if (o.kind === 'spinner') return OBSTACLE.spinner.half[2] + BALL.radius; // its centre never leaves
  return 0;
}

/**
 * The middle of the widest corridor a straight roll (x = const) can take past
 * every fixed obstacle, kept away from the gutters (|x| ≤ 0.32), or null when
 * it is narrower than 8 cm.
 */
export function straightPath(layout: ObstacleSpec[]): number | null {
  const fixed = layout.filter((o): o is Extract<ObstacleSpec, { x: number; z: number }> => o.kind === 'post' || o.kind === 'bumper' || o.kind === 'spinner');
  const free = (x: number) => fixed.every((o) => Math.abs(o.x - x) > blockedHalfWidth(o) + 0.01);
  let best: [number, number] | null = null;
  let start: number | null = null;
  const step = 0.01;
  for (let i = -32; i <= 33; i++) {
    const x = i * step;
    if (i <= 32 && free(x)) { if (start === null) start = x; continue; }
    if (start !== null) {
      const end = x - step;
      if (!best || end - start > best[1] - best[0]) best = [start, end];
      start = null;
    }
  }
  return best && best[1] - best[0] >= 0.08 ? (best[0] + best[1]) / 2 : null;
}

export const hasStraightPath = (layout: ObstacleSpec[]) => straightPath(layout) !== null;

/**
 * What stands on the lane at `level` (1 is a clean lane). The kinds and how
 * fast they move come from the level; where they stand comes from a seed per
 * level, so the same level is the same lane for every player.
 */
export function levelLayout(level: number): ObstacleSpec[] {
  const rnd = seeded(level * 7919 + 13);
  const between = (a: number, b: number) => a + rnd() * (b - a);
  const side = () => (rnd() < 0.5 ? -1 : 1);
  for (let attempt = 0; attempt < 50; attempt++) {
    const out: ObstacleSpec[] = [];
    const post = (z0: number, z1: number) => out.push({ kind: 'post', x: between(-0.34, 0.34), z: between(z0, z1) });
    const bumpers = (n: number, z0: number, z1: number) => {
      for (let i = 0; i < n; i++) out.push({ kind: 'bumper', x: between(-0.38, 0.38), z: z0 + ((z1 - z0) * (i + rnd() * 0.5)) / n });
    };
    const slider = (z: number, period: number, phase = rnd() * Math.PI * 2) => out.push({ kind: 'slider', z, range: 0.33, period, phase });
    switch (Math.min(level, 8)) {
      case 1: break;
      case 2: post(-5, -7); post(-9.5, -11.5); break;
      case 3: post(-4.5, -6); post(-10.5, -12); slider(-8.2, 3.2); break;
      case 4: bumpers(3, -4.5, -7); post(-12, -13); slider(-9.8, 2.6); break;
      case 5:
        out.push({ kind: 'spinner', x: 0, z: -8, speed: 1.6 * side() });
        post(-4.5, -5.8); post(-10.2, -11);
        out.push({ kind: 'wind', z0: -11.5, z1: -14.5, accel: 0.5 * side() });
        break;
      case 6: {
        const p = rnd() * Math.PI * 2;
        slider(-5.8, 2.4, p); slider(-11.2, 2.4, p + Math.PI);
        out.push({ kind: 'spinner', x: 0, z: -8.5, speed: 2 * side() });
        bumpers(2, -12.8, -14);
        break;
      }
      case 7: {
        const p = rnd() * Math.PI * 2;
        out.push({ kind: 'spinner', x: 0, z: -7.5, speed: 2.6 * side() });
        slider(-5.2, 2, p); slider(-10, 2, p + Math.PI);
        out.push({ kind: 'wind', z0: -11.5, z1: -14.5, accel: 0.7 * side() });
        post(-12.5, -13.5); post(-3.6, -4.2);
        break;
      }
      default: {
        const p = rnd() * Math.PI * 2;
        out.push({ kind: 'spinner', x: 0, z: -8, speed: 3 * side() });
        slider(-4.8, 1.8, p); slider(-6.4, 1.8, p + Math.PI); slider(-10.4, 1.6, p + Math.PI / 2);
        out.push({ kind: 'wind', z0: -11.5, z1: -15, accel: 0.9 * side() });
        bumpers(3, -12, -14.5);
        break;
      }
    }
    if (hasStraightPath(out)) return out;
  }
  return [];
}

interface Slot {
  kind: ObstacleKind;
  entity: SceneEntity;
  body: RigidBodyBehaviour | null;
  spec: ObstacleSpec | null;
}

const UP = quat.create();
const q = quat.create();

/** The pool of obstacle bodies, placed by {@link setLayout} and moved every fixed step. */
export class ObstacleField {
  readonly slots: Slot[] = [];
  private layout: ObstacleSpec[] = [];
  private time = 0;
  /** 1: standing on the lane; 0: sunk below it. */
  private raised = 1;

  constructor(private readonly world: PhysicsWorld, private readonly lane: LaneEntities) {
    let n = 0;
    for (const kind of Object.keys(POOL) as ObstacleKind[]) {
      for (let i = 0; i < POOL[kind]; i++) {
        const entity = new SceneEntity(`Obstacle ${kind} ${i + 1}`);
        let body: RigidBodyBehaviour | null = null;
        const shape = shapeOf(kind);
        if (shape) {
          body = Object.assign(new RigidBodyBehaviour(), { bodyType: RigidBodyType.Kinematic, world });
          entity.addBehaviour(body);
          entity.addBehaviour(Object.assign(new ColliderBehaviour(shape.shape), {
            offset: shape.offset, friction: 0.3, restitution: kind === 'bumper' ? 0.9 : 0.3, world, contactForceThreshold: 30,
          }));
        }
        this.slots.push({ kind, entity, body, spec: null });
        this.park(this.slots[this.slots.length - 1], n++);
      }
    }
    world.flush();
    world.onBeforeStep((dt) => this.step(dt));
  }

  get entities(): SceneEntity[] {
    return this.slots.map((s) => s.entity);
  }

  get current(): readonly ObstacleSpec[] {
    return this.layout;
  }

  /** Puts these obstacles on the lane (the rest of the pool goes under the floor). */
  setLayout(layout: ObstacleSpec[]): void {
    this.layout = layout;
    this.time = 0;
    const free = new Map<ObstacleKind, Slot[]>();
    for (const s of this.slots) {
      s.spec = null;
      free.set(s.kind, [...(free.get(s.kind) ?? []), s]);
    }
    for (const spec of layout) {
      const slot = free.get(spec.kind)?.shift();
      if (slot) slot.spec = spec; // more than the pool holds: the rest are left out
    }
    this.slots.forEach((s, i) => {
      if (!s.spec) { this.park(s, i); return; }
      this.place(s);
      // From under the floor in one jump, not a sweep across the room.
      s.body?.teleport(s.entity.transform.localPosition, s.entity.transform.localRotationQuat);
    });
  }

  /** Raises (1) or sinks (0) the obstacles, for the lane change. */
  setRaised(f: number): void {
    this.raised = Math.max(0, Math.min(1, f));
    for (const s of this.slots) if (s.spec) this.place(s);
  }

  /** One fixed step: moving obstacles move, the wind pushes the ball. */
  step(dt: number): void {
    this.time += dt;
    for (const s of this.slots) if (s.spec && (s.kind === 'slider' || s.kind === 'spinner')) this.place(s);
    const wind = this.slots.find((s) => s.kind === 'wind' && s.spec)?.spec;
    if (wind?.kind === 'wind' && this.raised >= 1) {
      const p = this.lane.ball.transform.worldPosition;
      const onLane = p[1] < BALL.radius + 0.01 && Math.abs(p[0]) < LANE.halfWidth;
      if (onLane && p[2] < wind.z0 && p[2] > wind.z1) {
        this.lane.ballBody.applyImpulse(vec3.fromValues(BALL.mass * wind.accel * dt, 0, 0));
      }
    }
  }

  /** Where a slot's obstacle is now (position and turn about Y). */
  private place(s: Slot): void {
    const o = s.spec!;
    const y = (this.raised - 1) * OBSTACLE.sink;
    let x = 0, z = 0, angle = 0;
    if (o.kind === 'post' || o.kind === 'bumper') { x = o.x; z = o.z; }
    else if (o.kind === 'slider') { x = o.range * Math.sin((2 * Math.PI * this.time) / o.period + o.phase); z = o.z; }
    else if (o.kind === 'spinner') { x = o.x; z = o.z; angle = o.speed * this.time; }
    else { z = (o.z0 + o.z1) / 2; angle = o.accel < 0 ? Math.PI : 0; }
    s.entity.transform.setLocalPosition(x, y + (o.kind === 'wind' ? 0.003 : 0), z);
    s.entity.transform.setLocalRotationQuat(quat.setAxisAngle(q, [0, 1, 0], angle));
    if (o.kind === 'wind') s.entity.transform.setLocalScale(1, 1, (o.z0 - o.z1) / 2);
  }

  private park(s: Slot, i: number): void {
    s.entity.transform.setLocalPosition(-2 + i * 0.6, -1.5, 5);
    s.entity.transform.setLocalRotationQuat(UP);
    s.body?.teleport(vec3.fromValues(-2 + i * 0.6, -1.5, 5), UP);
  }
}

/** The collider of each kind (wind has none), standing on y = 0. */
function shapeOf(kind: ObstacleKind): { shape: ColliderShape; offset: number[] } | null {
  switch (kind) {
    case 'post': return { shape: { type: 'cylinder', radius: OBSTACLE.post.radius, halfHeight: OBSTACLE.post.height / 2 }, offset: [0, OBSTACLE.post.height / 2, 0] };
    case 'bumper': return { shape: { type: 'cylinder', radius: OBSTACLE.bumper.radius, halfHeight: OBSTACLE.bumper.height / 2 }, offset: [0, OBSTACLE.bumper.height / 2, 0] };
    case 'slider': return { shape: { type: 'box', halfExtents: OBSTACLE.slider.half }, offset: [0, OBSTACLE.slider.half[1], 0] };
    case 'spinner': return { shape: { type: 'box', halfExtents: OBSTACLE.spinner.half }, offset: [0, OBSTACLE.spinner.half[1], 0] };
    default: return null;
  }
}
