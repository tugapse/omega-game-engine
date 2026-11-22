// The lane, ball and pins as physics entities (no rendering, so it runs in tests).
// Units are metres; the foul line is at z = 0 and the lane runs towards -Z.
import { quat, vec3 } from 'gl-matrix';
import {
  ColliderBehaviour, ColliderShape, PhysicsWorld, RigidBodyBehaviour, RigidBodyType, SceneEntity,
} from '../../../src';

export const LANE = {
  halfWidth: 1.0541 / 2,
  /** Foul line to head pin. */
  headPin: -18.29,
  /** Where the oil ends and the ball starts to grip (hook, phase 2). */
  oilEnd: -12.2,
  /** End of the pin deck; the pit is beyond. */
  deckEnd: -19.4,
  gutterWidth: 0.235,
  gutterDepth: 0.08,
};

export const BALL = { radius: 0.109, mass: 6.35, start: vec3.fromValues(0, 0.109, -0.25) };

export const PIN = {
  height: 0.381,
  /** Sum of PIN_PARTS' masses. */
  mass: 1.53,
  spacing: 0.3048,
  /** Regulation profile as [radius, height] in metres, top to bottom. */
  profile: ([
    [0, 15], [0.85, 14.75], [1.15, 14.25], [1.27, 13.5], [1.22, 12.5], [1.1, 11.75], [0.94, 10.9],
    [0.9, 10], [1.0, 9.4], [1.3, 8.625], [1.8, 7.25], [2.25, 5.875], [2.383, 4.5], [2.255, 3.375],
    [1.93, 2.25], [1.415, 0.75], [1.015, 0], [0, 0],
  ] as const).map(([r, y]) => [r * 0.0254, y * 0.0254] as [number, number]),
};

/** Pin spots, pins 1–10 in the usual order (1 at the front, 7–10 at the back). */
export const PIN_SPOTS: vec3[] = (() => {
  const spots: vec3[] = [];
  const rowStep = PIN.spacing * Math.sin(Math.PI / 3);
  for (let row = 0; row < 4; row++) {
    for (let i = 0; i <= row; i++) {
      spots.push(vec3.fromValues((i - row / 2) * PIN.spacing, 0, LANE.headPin - row * rowStep));
    }
  }
  return spots;
})();

export interface LaneEntities {
  ball: SceneEntity;
  ballBody: RigidBodyBehaviour;
  pins: SceneEntity[];
  pinBodies: RigidBodyBehaviour[];
  /** Static pieces, with their half extents (for the visuals). */
  blocks: { entity: SceneEntity; name: string; halfExtents: vec3 }[];
}

const box = (halfExtents: number[]): ColliderShape => ({ type: 'box', halfExtents: [halfExtents[0], halfExtents[1], halfExtents[2]] });

/**
 * The pin's collision shape: four pieces (base, belly, neck, head) with their
 * own masses, so the centre of mass sits low (about 15 cm) as in a real pin.
 * A convex hull of the profile would be closer in shape, but polyhedra
 * standing on their narrow base jitter and fall over by themselves in Rapier.
 */
export const PIN_PARTS: { shape: ColliderShape; offset: number[]; mass: number }[] = [
  { shape: { type: 'cylinder', halfHeight: 0.015, radius: 0.03 }, offset: [0, 0.015, 0], mass: 0.15 },
  { shape: { type: 'cylinder', halfHeight: 0.085, radius: 0.058 }, offset: [0, 0.115, 0], mass: 1.0 },
  { shape: { type: 'cylinder', halfHeight: 0.05, radius: 0.026 }, offset: [0, 0.25, 0], mass: 0.18 },
  { shape: { type: 'sphere', radius: 0.032 }, offset: [0, 0.343, 0], mass: 0.2 },
];

/** Builds the lane in `world` and returns its entities (not added to any scene). */
export function buildLane(world: PhysicsWorld): LaneEntities {
  const blocks: LaneEntities['blocks'] = [];
  const block = (name: string, center: number[], halfExtents: number[], friction: number, restitution = 0.1) => {
    const entity = new SceneEntity(name);
    entity.transform.setLocalPosition(center[0], center[1], center[2]);
    entity.addBehaviour(Object.assign(new ColliderBehaviour(box(halfExtents)), { friction, restitution, world }));
    blocks.push({ entity, name, halfExtents: vec3.fromValues(halfExtents[0], halfExtents[1], halfExtents[2]) });
    return entity;
  };
  const { halfWidth: hw, oilEnd, deckEnd, gutterWidth: gw, gutterDepth: gd } = LANE;
  const t = 0.05; // slab thickness (half)
  const outer = hw + gw;
  // Approach, oiled lane, dry lane and pin deck: the top face is y = 0.
  block('approach', [0, -t, 2.3], [outer + 0.6, t, 2.3], 0.4);
  // Lane and pin deck are one slab: the ball catches the seam between two slabs and jumps.
  // Friction combines as the average: ball 0 + lane 0.1 = 0.05 (oiled); pins 0.4 + lane 0.1 = 0.25.
  // The dry back end, where the ball grips and hooks, is done in code (phase 2).
  block('lane', [0, -t, deckEnd / 2], [hw, t, -deckEnd / 2], 0.1);
  // Gutters, lower than the lane, with dividers outside them.
  for (const side of [-1, 1]) {
    const s = side < 0 ? 'left' : 'right';
    block(`gutter-${s}`, [side * (hw + gw / 2), -gd - t, deckEnd / 2], [gw / 2, t, -deckEnd / 2], 0.3);
    block(`divider-${s}`, [side * (outer + 0.02), 0.04, deckEnd / 2 + 0.5], [0.02, 0.12, -deckEnd / 2 - 0.5], 0.3);
    // Kickbacks: the tall side walls around the pin deck.
    // Down to the pit floor, so nothing rolls out under them.
    block(`kickback-${s}`, [side * (outer + 0.02), 0.14, -19.1], [0.02, 0.64, 1.6], 0.3, 0.3);
  }
  // The pit behind the deck and its back cushion.
  block('pit', [0, -0.45, -20.1], [outer + 0.04, t, 0.7], 0.6);
  block('cushion', [0, 0.3, -20.85], [outer + 0.04, 0.8, 0.05], 0.8, 0.05);

  const ball = new SceneEntity('Ball');
  ball.transform.setLocalPosition(BALL.start[0], BALL.start[1], BALL.start[2]);
  const ballBody = Object.assign(new RigidBodyBehaviour(), { mass: BALL.mass, ccd: true, angularDamping: 0.02, world });
  ball.addBehaviour(ballBody);
  ball.addBehaviour(Object.assign(new ColliderBehaviour({ type: 'sphere', radius: BALL.radius }), {
    friction: 0, restitution: 0.1, world, contactForceThreshold: 30,
  }));

  const pins: SceneEntity[] = [];
  const pinBodies: RigidBodyBehaviour[] = [];
  PIN_SPOTS.forEach((spot, i) => {
    const pin = new SceneEntity(`Pin ${i + 1}`);
    pin.transform.setLocalPosition(spot[0], spot[1], spot[2]);
    const body = Object.assign(new RigidBodyBehaviour(), { ccd: true, world });
    pin.addBehaviour(body);
    for (const part of PIN_PARTS) {
      pin.addBehaviour(Object.assign(new ColliderBehaviour(part.shape), {
        offset: part.offset, mass: part.mass, friction: 0.4, restitution: 0.7, world, contactForceThreshold: 20,
      }));
    }
    pins.push(pin);
    pinBodies.push(body);
  });
  world.flush();
  return { ball, ballBody, pins, pinBodies, blocks };
}

const ZERO = vec3.create();
const UPRIGHT = quat.create();

/** Puts every pin back on its spot, standing and still. */
export function rackPins(lane: LaneEntities): void {
  lane.pinBodies.forEach((body, i) => {
    body.teleport(PIN_SPOTS[i], UPRIGHT);
    body.setLinearVelocity(ZERO);
    body.setAngularVelocity(ZERO);
  });
}

/** Puts the ball back at the foul line, `x` metres from the centre. */
export function resetBall(lane: LaneEntities, x = 0): void {
  lane.ballBody.teleport(vec3.fromValues(x, BALL.start[1], BALL.start[2]), UPRIGHT);
  lane.ballBody.setLinearVelocity(ZERO);
  lane.ballBody.setAngularVelocity(ZERO);
}

export interface ThrowParams {
  /** Metres per second. */
  speed: number;
  /** Radians from straight down the lane; positive = to the right (+X). */
  angle: number;
  /** Side spin in rad/s around the direction of travel; positive hooks to the left. */
  spin: number;
}

export function throwBall(lane: LaneEntities, t: ThrowParams): void {
  const dir = vec3.fromValues(Math.sin(t.angle), 0, -Math.cos(t.angle));
  lane.ballBody.setLinearVelocity(vec3.scale(vec3.create(), dir, t.speed));
  // Side spin: rotation about the direction of travel.
  lane.ballBody.setAngularVelocity(vec3.scale(vec3.create(), dir, t.spin));
}

/** True when the pin is down: tilted more than 45°, off its spot by 10 cm, or off the deck. */
export function isPinDown(lane: LaneEntities, index: number): boolean {
  const t = lane.pins[index].transform;
  const p = t.worldPosition;
  const up = vec3.transformQuat(vec3.create(), [0, 1, 0], t.worldRotationQuat);
  const spot = PIN_SPOTS[index];
  return up[1] < Math.SQRT1_2 || Math.hypot(p[0] - spot[0], p[2] - spot[2]) > 0.1 || p[1] < -0.03;
}

export function pinsDown(lane: LaneEntities): number {
  return lane.pins.reduce((n, _, i) => n + (isPinDown(lane, i) ? 1 : 0), 0);
}

/** True when the ball and every pin have (nearly) stopped. */
export function allStill(lane: LaneEntities, threshold = 0.05): boolean {
  const v = vec3.create();
  return [lane.ballBody, ...lane.pinBodies].every((b) =>
    b.isSleeping || (vec3.length(b.getLinearVelocity(v)) < threshold && vec3.length(b.getAngularVelocity(v)) < threshold * 4));
}
