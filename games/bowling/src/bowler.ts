// The bowler: a jointed figure (a hierarchy of entities, one per joint) and
// its animations, built in code and played by the engine's Animator. No
// rendering here, so it runs in tests; look.ts gives it its meshes.
import { quat, vec3 } from 'gl-matrix';
import { AnimationChannel, AnimationClip, Animator, SceneEntity } from '../../../src';

/** A joint: its parent, where it sits on the parent at rest, and what hangs from it. */
export interface Bone {
  name: string;
  parent: string | null;
  offset: [number, number, number];
}

/** Proportions, in metres: a figure about 1.76 m tall, arms and legs hanging down at rest. */
export const SKELETON: Bone[] = [
  { name: 'Hips', parent: null, offset: [0, 0.98, 0] },
  { name: 'Spine', parent: 'Hips', offset: [0, 0.1, 0] },
  { name: 'Chest', parent: 'Spine', offset: [0, 0.24, 0] },
  { name: 'Head', parent: 'Chest', offset: [0, 0.2, 0] },
  { name: 'ShoulderR', parent: 'Chest', offset: [0.19, 0.17, 0] },
  { name: 'ElbowR', parent: 'ShoulderR', offset: [0, -0.31, 0] },
  { name: 'HandR', parent: 'ElbowR', offset: [0, -0.27, 0] },
  { name: 'ShoulderL', parent: 'Chest', offset: [-0.19, 0.17, 0] },
  { name: 'ElbowL', parent: 'ShoulderL', offset: [0, -0.31, 0] },
  { name: 'HandL', parent: 'ElbowL', offset: [0, -0.27, 0] },
  { name: 'HipR', parent: 'Hips', offset: [0.1, -0.04, 0] },
  { name: 'KneeR', parent: 'HipR', offset: [0, -0.44, 0] },
  { name: 'FootR', parent: 'KneeR', offset: [0, -0.44, 0] },
  { name: 'HipL', parent: 'Hips', offset: [-0.1, -0.04, 0] },
  { name: 'KneeL', parent: 'HipL', offset: [0, -0.44, 0] },
  { name: 'FootL', parent: 'KneeL', offset: [0, -0.44, 0] },
];

/** Where the ball's centre sits in the right hand's frame (below the wrist, in the palm). */
export const BALL_IN_HAND: [number, number, number] = [0, -0.12, 0];

/** Seconds into the throw when the ball leaves the hand. */
export const RELEASE_TIME = 1.38;

export interface BowlerRig {
  /** The figure's root, on the floor, facing -Z (down the lane). */
  root: SceneEntity;
  bones: Map<string, SceneEntity>;
  /** The ball held in the right hand (an empty entity; look.ts gives it a mesh). */
  ball: SceneEntity;
  animator: Animator;
}

/** Builds the joints under a root entity, with an Animator holding the clips. */
export function buildBowler(name = 'Bowler'): BowlerRig {
  const root = new SceneEntity(name);
  const bones = new Map<string, SceneEntity>();
  for (const b of SKELETON) {
    const e = new SceneEntity(b.name);
    e.transform.setParent((b.parent ? bones.get(b.parent)! : root).transform);
    e.transform.setLocalPosition(b.offset[0], b.offset[1], b.offset[2]);
    bones.set(b.name, e);
  }
  const ball = new SceneEntity('Held ball');
  ball.transform.setParent(bones.get('HandR')!.transform);
  ball.transform.setLocalPosition(...BALL_IN_HAND);
  const animator = new Animator();
  animator.playOnStart = false;
  animator.loop = false;
  root.addBehaviour(animator);
  for (const clip of bowlerClips()) animator.addClip(clip);
  return { root, bones, ball, animator };
}

/** All the entities of the rig, root first (to add to a scene). */
export function rigEntities(rig: BowlerRig): SceneEntity[] {
  return [rig.root, ...rig.bones.values(), rig.ball];
}

/** A pose: joint rotations as Euler angles in radians (x, y, z), and where the hips are. */
interface Key {
  t: number;
  hips: [number, number, number];
  rot: Partial<Record<string, [number, number, number]>>;
}

/**
 * Holding the ball at the waist, the left hand under it. Rotations about x
 * swing a limb forward (positive) or back; a bone pointing up (the spine)
 * leans forward with a negative x.
 */
const STANCE: Key['rot'] = {
  Spine: [-0.06, 0, 0], Head: [0.06, 0, 0],
  ShoulderR: [0.45, 0, 0.05], ElbowR: [1.35, 0, 0],
  ShoulderL: [0.5, 0, 0.35], ElbowL: [1.3, 0, 0],
  HipR: [0.04, 0, 0], KneeR: [-0.08, 0, 0], HipL: [0.04, 0, 0], KneeL: [-0.08, 0, 0],
};

/** Four steps, the push-away, the backswing, the slide on the left foot, the release and the follow-through. */
const THROW: Key[] = [
  { t: 0, hips: [0, 0.98, 0], rot: STANCE },
  {
    t: 0.3, hips: [0, 0.95, -0.35], rot: {
      Spine: [-0.1, 0, 0], Head: [0.1, 0, 0],
      ShoulderR: [0.9, 0, 0.05], ElbowR: [0.4, 0, 0], ShoulderL: [0.8, 0, 0.25], ElbowL: [0.4, 0, 0],
      HipR: [0.45, 0, 0], KneeR: [-0.15, 0, 0], HipL: [-0.25, 0, 0], KneeL: [-0.3, 0, 0],
    },
  },
  {
    t: 0.6, hips: [0, 0.94, -0.85], rot: {
      Spine: [-0.15, 0, 0], Head: [0.15, 0, 0],
      ShoulderR: [-0.1, 0, 0.05], ElbowR: [0.05, 0, 0], ShoulderL: [0.2, 0, -0.6], ElbowL: [0.3, 0, 0],
      HipR: [-0.35, 0, 0], KneeR: [-0.4, 0, 0], HipL: [0.5, 0, 0], KneeL: [-0.15, 0, 0],
    },
  },
  {
    t: 0.9, hips: [0, 0.9, -1.4], rot: {
      Spine: [-0.35, 0, 0], Head: [0.3, 0, 0],
      ShoulderR: [-1.35, 0, 0.05], ElbowR: [0, 0, 0], ShoulderL: [0.3, 0, -1.1], ElbowL: [0.2, 0, 0],
      HipR: [0.55, 0, 0], KneeR: [-0.2, 0, 0], HipL: [-0.4, 0, 0], KneeL: [-0.5, 0, 0],
    },
  },
  {
    t: 1.2, hips: [0, 0.8, -2.0], rot: {
      Spine: [-0.7, 0, -0.1], Head: [0.5, 0, 0],
      ShoulderR: [-0.6, 0, 0.05], ElbowR: [0, 0, 0], ShoulderL: [0.35, 0, -1.25], ElbowL: [0.2, 0, 0],
      HipR: [-0.6, 0, -0.1], KneeR: [-0.4, 0, 0], HipL: [0.9, 0, 0], KneeL: [-1.0, 0, 0],
    },
  },
  {
    t: RELEASE_TIME, hips: [0, 0.635, -2.3], rot: {
      Spine: [-1.0, 0, -0.35], Head: [0.8, 0, 0],
      ShoulderR: [1.0, 0, 0.35], ElbowR: [0, 0, 0], ShoulderL: [0.4, 0, -1.3], ElbowL: [0.2, 0, 0],
      HipR: [-0.8, 0, -0.2], KneeR: [-0.3, 0, 0], HipL: [1.25, 0, 0], KneeL: [-1.7, 0, 0],
    },
  },
  {
    t: 1.65, hips: [0, 0.65, -2.42], rot: {
      Spine: [-0.7, 0, -0.1], Head: [0.55, 0, 0],
      ShoulderR: [2.6, 0, 0.05], ElbowR: [0.5, 0, 0], ShoulderL: [0.4, 0, -1.2], ElbowL: [0.2, 0, 0],
      HipR: [-0.8, 0, -0.2], KneeR: [-0.3, 0, 0], HipL: [1.2, 0, 0], KneeL: [-1.6, 0, 0],
    },
  },
  {
    t: 2.1, hips: [0, 0.68, -2.42], rot: {
      Spine: [-0.6, 0, -0.05], Head: [0.5, 0, 0],
      ShoulderR: [2.3, 0, 0.05], ElbowR: [0.7, 0, 0], ShoulderL: [0.35, 0, -1.0], ElbowL: [0.3, 0, 0],
      HipR: [-0.75, 0, -0.2], KneeR: [-0.35, 0, 0], HipL: [1.1, 0, 0], KneeL: [-1.45, 0, 0],
    },
  },
];

/** Standing with the ball, breathing. */
const IDLE: Key[] = [
  { t: 0, hips: [0, 0.98, 0], rot: STANCE },
  { t: 1.2, hips: [0, 0.975, 0], rot: { ...STANCE, Spine: [-0.08, 0, 0], ShoulderR: [0.47, 0, 0.05], ShoulderL: [0.52, 0, 0.35] } },
  { t: 2.4, hips: [0, 0.98, 0], rot: STANCE },
];

/** Catmull-Rom through the keys' values, so the motion eases between poses. */
function spline(keys: { t: number; v: number[] }[], t: number): number[] {
  let i = 0;
  while (i < keys.length - 2 && keys[i + 1].t <= t) i++;
  const k1 = keys[i], k2 = keys[Math.min(i + 1, keys.length - 1)];
  const k0 = keys[Math.max(i - 1, 0)], k3 = keys[Math.min(i + 2, keys.length - 1)];
  const s = k2.t > k1.t ? Math.min(1, Math.max(0, (t - k1.t) / (k2.t - k1.t))) : 0;
  const s2 = s * s, s3 = s2 * s;
  return k1.v.map((p1, c) => {
    const p0 = k0.v[c], p2 = k2.v[c], p3 = k3.v[c];
    // Tangents scaled by the (uneven) key spacing.
    const m1 = k2.t > k0.t ? ((p2 - p0) / (k2.t - k0.t)) * (k2.t - k1.t) : 0;
    const m2 = k3.t > k1.t ? ((p3 - p1) / (k3.t - k1.t)) * (k2.t - k1.t) : 0;
    return (2 * s3 - 3 * s2 + 1) * p1 + (s3 - 2 * s2 + s) * m1 + (-2 * s3 + 3 * s2) * p2 + (s3 - s2) * m2;
  });
}

const RATE = 30;
/** The ankle joint's height when the sole is on the floor. */
const ANKLE_HEIGHT = 0.06;

/** Height of an ankle below the hips in sample `i` (hip and knee rotations, the legs' offsets). */
function ankleHeight(rotations: Map<string, Float32Array>, i: number, side: 'R' | 'L'): number {
  const bone = (n: string) => SKELETON.find((b) => b.name === n)!;
  const rot = (n: string) => {
    const r = rotations.get(n);
    return r ? quat.fromValues(r[i * 4], r[i * 4 + 1], r[i * 4 + 2], r[i * 4 + 3]) : quat.create();
  };
  const foot = vec3.transformQuat(vec3.create(), bone(`Foot${side}`).offset, rot(`Knee${side}`));
  vec3.add(foot, foot, bone(`Knee${side}`).offset);
  vec3.transformQuat(foot, foot, rot(`Hip${side}`));
  return bone(`Hip${side}`).offset[1] + foot[1];
}

/** Samples the keys at 30 Hz into one channel per joint. */
function clipFrom(name: string, keys: Key[]): AnimationClip {
  const duration = keys[keys.length - 1].t;
  const n = Math.round(duration * RATE) + 1;
  const times = new Float32Array(n);
  for (let i = 0; i < n; i++) times[i] = Math.min(duration, i / RATE);
  const channels: AnimationChannel[] = [];
  const q = quat.create();
  const rotations = new Map<string, Float32Array>();
  for (const bone of SKELETON) {
    const track = keys.map((k) => ({ t: k.t, v: k.rot[bone.name] ?? [0, 0, 0] }));
    if (track.every((k) => k.v.every((x) => x === 0))) continue;
    const values = new Float32Array(n * 4);
    for (let i = 0; i < n; i++) {
      const [x, y, z] = spline(track, times[i]);
      const d = 180 / Math.PI;
      quat.fromEuler(q, x * d, y * d, z * d);
      values.set(q, i * 4);
    }
    channels.push({ target: bone.name, property: 'rotation', times, values, interpolation: 'LINEAR' });
    rotations.set(bone.name, values);
  }
  // The hips: the keys' path, raised wherever the easing between poses would push a foot through the floor.
  const hips = keys.map((k) => ({ t: k.t, v: k.hips }));
  const hipValues = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const p = spline(hips, times[i]);
    const lowest = Math.min(ankleHeight(rotations, i, 'R'), ankleHeight(rotations, i, 'L'));
    p[1] += Math.max(0, ANKLE_HEIGHT - (p[1] + lowest));
    hipValues.set(p, i * 3);
  }
  channels.unshift({ target: 'Hips', property: 'translation', times, values: hipValues, interpolation: 'LINEAR' });
  return new AnimationClip(name, channels, duration);
}

/** "Idle" (loops) and "Throw" (the ball leaves the hand at {@link RELEASE_TIME}). */
export function bowlerClips(): AnimationClip[] {
  return [clipFrom('Idle', IDLE), clipFrom('Throw', THROW)];
}
