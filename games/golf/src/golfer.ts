// The golfer: the bowler's jointed figure (a hierarchy of entities, one per
// joint) holding a club, with an address pose, a full swing and a putt keyed in
// code and played by the engine's Animator. No rendering here; look.ts dresses it.
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

/** A pose: joint rotations as Euler angles in radians (x, y, z), and where the hips are. */
interface Key {
  t: number;
  hips: [number, number, number];
  rot: Partial<Record<string, [number, number, number]>>;
}

/**
 * The figure faces -Z with the ball in front of it; the target is to its left
 * (-X), as for a right-handed golfer. Rotations about x swing a limb forward
 * (positive); a bone pointing up leans forward with a negative x; about y, a
 * positive angle turns the body to its right (away from the target).
 */
const ADDRESS: Key['rot'] = {
  Spine: [-0.42, 0, 0], Chest: [-0.12, 0, 0], Head: [0.45, 0, 0],
  ShoulderR: [0.55, 0, -0.2], ElbowR: [0.12, 0, 0],
  ShoulderL: [0.5, 0, 0.26], ElbowL: [0.05, 0, 0],
  HipR: [0.28, 0, -0.05], KneeR: [-0.38, 0, 0], HipL: [0.28, 0, 0.05], KneeL: [-0.38, 0, 0],
};

/** Seconds into the swing: the top of the backswing, and the club meeting the ball. */
export const TOP_TIME = 0.9;
export const IMPACT_TIME = 1.12;

const SWING: Key[] = [
  { t: 0, hips: [0, -0.9, 0], rot: ADDRESS },
  {
    t: 0.45, hips: [0, -0.9, 0], rot: {
      ...ADDRESS, Spine: [-0.42, -0.35, 0], Chest: [-0.1, -0.35, 0], Head: [0.45, 0.6, 0],
      ShoulderR: [0.9, 0, -0.1], ElbowR: [0.5, 0, 0], ShoulderL: [0.95, 0, 0.55], ElbowL: [0.05, 0, 0], HandL: [0.4, 0, 0.1],
    },
  },
  {
    t: TOP_TIME, hips: [0, -0.9, 0.02], rot: {
      Spine: [-0.38, -0.6, 0], Chest: [-0.05, -0.55, 0], Head: [0.42, 1.05, 0],
      ShoulderR: [1.55, 0, 0.35], ElbowR: [1.5, 0, 0], ShoulderL: [1.75, 0, 0.75], ElbowL: [0.1, 0, 0], HandL: [1.0, 0, 0.3],
      HipR: [0.24, -0.2, -0.05], KneeR: [-0.32, 0, 0], HipL: [0.32, -0.2, 0.12], KneeL: [-0.5, 0, 0],
    },
  },
  {
    t: IMPACT_TIME, hips: [0, -0.9, 0], rot: {
      ...ADDRESS, Spine: [-0.4, 0.25, 0], Chest: [-0.12, 0.1, 0], Head: [0.45, -0.3, 0],
      ShoulderR: [0.6, 0, -0.25], ElbowR: [0.15, 0, 0], ShoulderL: [0.45, 0, 0.2],
      HipR: [0.3, 0.25, -0.05], KneeR: [-0.45, 0, 0.05], HipL: [0.26, 0.25, 0.05], KneeL: [-0.3, 0, 0],
    },
  },
  {
    t: 1.45, hips: [-0.04, -0.92, 0], rot: {
      Spine: [-0.25, 0.9, 0], Chest: [-0.05, 0.5, 0], Head: [0.3, -0.7, 0],
      ShoulderR: [1.5, 0, -0.75], ElbowR: [0.3, 0, 0], ShoulderL: [1.3, 0, -0.2], ElbowL: [1.2, 0, 0],
      HipR: [0.1, 0.6, -0.1], KneeR: [-0.75, 0, 0.1], HipL: [0.15, 0.6, 0.05], KneeL: [-0.1, 0, 0],
    },
  },
  {
    t: 2.2, hips: [-0.06, -0.94, 0], rot: {
      Spine: [-0.1, 1.1, 0.1], Chest: [0, 0.5, 0], Head: [0.15, -0.85, 0],
      ShoulderR: [2.1, 0, -0.9], ElbowR: [0.6, 0, 0], ShoulderL: [1.9, 0, -0.4], ElbowL: [1.6, 0, 0],
      HipR: [0.05, 0.8, -0.1], KneeR: [-0.9, 0, 0.1], HipL: [0.08, 0.8, 0.05], KneeL: [-0.05, 0, 0],
    },
  },
];

/** A putt: upright, a small pendulum from the shoulders. */
const PUTT_ADDRESS: Key['rot'] = {
  ...ADDRESS, Spine: [-0.55, 0, 0], Chest: [-0.15, 0, 0], Head: [0.6, 0, 0],
  ShoulderR: [0.75, 0, -0.22], ElbowR: [0.35, 0, 0], ShoulderL: [0.7, 0, 0.26], ElbowL: [0.3, 0, 0],
  HipR: [0.18, 0, -0.05], KneeR: [-0.2, 0, 0], HipL: [0.18, 0, 0.05], KneeL: [-0.2, 0, 0],
};
export const PUTT_BACK_TIME = 0.6;
export const PUTT_IMPACT_TIME = 0.9;
const swingArms = (rot: Key['rot'], a: number): Key['rot'] => ({
  ...rot, Chest: [-0.15, -a, 0], ShoulderR: [0.75, 0, -0.22 + a * 0.5], ShoulderL: [0.7, 0, 0.26 + a * 0.5],
});
const PUTT: Key[] = [
  { t: 0, hips: [0, -0.94, 0], rot: PUTT_ADDRESS },
  { t: PUTT_BACK_TIME, hips: [0, -0.94, 0], rot: swingArms(PUTT_ADDRESS, 0.28) },
  { t: PUTT_IMPACT_TIME, hips: [0, -0.94, 0], rot: PUTT_ADDRESS },
  { t: 1.4, hips: [0, -0.94, 0], rot: swingArms(PUTT_ADDRESS, -0.3) },
];

/** Standing over the ball, breathing. */
const IDLE: Key[] = [
  { t: 0, hips: [0, 0.9, 0], rot: ADDRESS },
  { t: 1.3, hips: [0, 0.895, 0], rot: { ...ADDRESS, Spine: [-0.44, 0, 0], ShoulderL: [0.52, 0, 0.26] } },
  { t: 2.6, hips: [0, 0.9, 0], rot: ADDRESS },
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

/** The club: its shaft length (m) for each kind. */
export const SHAFT: Record<string, number> = { driver: 1.12, wood: 1.05, iron: 0.98, wedge: 0.92, putter: 0.86 };

export interface GolferRig {
  /** The figure's root, on the ground, facing -Z, the target to its left (-X). */
  root: SceneEntity;
  bones: Map<string, SceneEntity>;
  /** The club, held in the left hand; its head at the end of the shaft. */
  club: SceneEntity;
  head: SceneEntity;
  animator: Animator;
}

/** The club's lie: down from the left hand, tilted forward towards the ball and across to the right hand. */
export const CLUB_TILT: [number, number, number] = [28, 0, 3];

/** Builds the joints and the club under a root entity, with an Animator holding the clips. */
export function buildGolfer(name = 'Golfer'): GolferRig {
  const root = new SceneEntity(name);
  const bones = new Map<string, SceneEntity>();
  for (const b of SKELETON) {
    const e = new SceneEntity(b.name);
    e.transform.setParent((b.parent ? bones.get(b.parent)! : root).transform);
    e.transform.setLocalPosition(b.offset[0], b.offset[1], b.offset[2]);
    bones.set(b.name, e);
  }
  const club = new SceneEntity('Club');
  club.transform.setParent(bones.get('HandL')!.transform);
  club.transform.setLocalPosition(0, -0.06, 0);
  club.transform.setLocalRotation(...CLUB_TILT);
  const head = new SceneEntity('Club head');
  head.transform.setParent(club.transform);
  head.transform.setLocalPosition(0, -SHAFT.iron, 0);
  const animator = new Animator();
  animator.playOnStart = false;
  animator.loop = false;
  root.addBehaviour(animator);
  for (const clip of golferClips()) animator.addClip(clip);
  return { root, bones, club, head, animator };
}

/** Sets the shaft length for a club (the head moves to its end). */
export function setShaft(rig: GolferRig, club: string): void {
  rig.head.transform.setLocalPosition(0, -(SHAFT[club] ?? SHAFT.iron), 0);
}

/** All the entities of the rig, root first (to add to a scene). */
export function rigEntities(rig: GolferRig): SceneEntity[] {
  return [rig.root, ...rig.bones.values(), rig.club, rig.head];
}

/** "Idle" (loops), "Swing" (top at {@link TOP_TIME}, impact at {@link IMPACT_TIME}) and "Putt". */
export function golferClips(): AnimationClip[] {
  return [clipFrom('Idle', IDLE), clipFrom('Swing', SWING), clipFrom('Putt', PUTT)];
}
