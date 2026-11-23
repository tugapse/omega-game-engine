// Bit's skeleton: a hierarchy of joints (one entity each) and its animations,
// built in code and played by the engine's Animator. No rendering here, so it
// runs in tests; look.ts hangs the meshes on the joints.
//
// Bit faces +z at rest, feet at y = 0. Rotations are Euler angles in radians:
// about x, a limb hanging down swings back with a positive angle (forward with
// a negative one) and the body leans forward with a positive one; about z, the
// right arm (on +x) lifts outwards with a positive angle, the left with a negative.
import { quat } from 'gl-matrix';
import { AnimationChannel, AnimationClip, Animator, SceneEntity } from '../../../src';

export interface Bone {
  name: string;
  parent: string | null;
  offset: [number, number, number];
}

/** Small Bit, about 0.9 m to the top of its shell (the antenna sticks out above). */
export const BIT_BONES: Bone[] = [
  { name: 'Hips', parent: null, offset: [0, 0.2, 0] },
  { name: 'Body', parent: 'Hips', offset: [0, 0, 0] },
  { name: 'Antenna', parent: 'Body', offset: [0, 0.64, 0] },
  { name: 'ArmR', parent: 'Body', offset: [0.4, 0.25, 0] },
  { name: 'HandR', parent: 'ArmR', offset: [0, -0.2, 0] },
  { name: 'ArmL', parent: 'Body', offset: [-0.4, 0.25, 0] },
  { name: 'HandL', parent: 'ArmL', offset: [0, -0.2, 0] },
  { name: 'LegR', parent: 'Hips', offset: [0.14, 0, 0] },
  { name: 'FootR', parent: 'LegR', offset: [0, -0.15, 0] },
  { name: 'LegL', parent: 'Hips', offset: [-0.14, 0, 0] },
  { name: 'FootL', parent: 'LegL', offset: [0, -0.15, 0] },
];

/** The clips, by name: Idle, Run and Victory loop; Jump, Fall and Die hold their last pose. */
export type BitClip = 'Idle' | 'Run' | 'Jump' | 'Fall' | 'Die' | 'Victory';
export const LOOPING: Record<BitClip, boolean> = { Idle: true, Run: true, Jump: false, Fall: false, Die: false, Victory: true };
/** Running speed (m/s) at which the Run clip plays at its own pace. */
export const RUN_CLIP_SPEED = 6;

export interface BitRig {
  root: SceneEntity;
  bones: Map<string, SceneEntity>;
  animator: Animator;
}

/** Builds the joints under a root entity, with an Animator holding the clips. */
export function buildBit(name = 'Bit'): BitRig {
  const root = new SceneEntity(name);
  const bones = new Map<string, SceneEntity>();
  for (const b of BIT_BONES) {
    const e = new SceneEntity(b.name);
    e.transform.setParent((b.parent ? bones.get(b.parent)! : root).transform);
    e.transform.setLocalPosition(b.offset[0], b.offset[1], b.offset[2]);
    bones.set(b.name, e);
  }
  const animator = new Animator();
  animator.playOnStart = false;
  root.addBehaviour(animator);
  for (const clip of bitClips()) animator.addClip(clip);
  return { root, bones, animator };
}

/** A pose at a time: the hips' position and the joints' rotations. */
interface Key {
  t: number;
  hips: [number, number, number];
  rot: Partial<Record<string, [number, number, number]>>;
}

const REST: Key['rot'] = { ArmR: [0, 0, 0.35], ArmL: [0, 0, -0.35] };

const IDLE: Key[] = [
  { t: 0, hips: [0, 0.2, 0], rot: { ...REST, Antenna: [0, 0, 0.08] } },
  { t: 0.8, hips: [0, 0.185, 0], rot: { ArmR: [0, 0, 0.45], ArmL: [0, 0, -0.45], Body: [0.03, 0, 0], Antenna: [0, 0, -0.08] } },
  { t: 1.6, hips: [0, 0.2, 0], rot: { ...REST, Antenna: [0, 0, 0.08] } },
];

/** One stride each side; legs and arms swing opposite, the body leans in and bobs. */
const stride = (side: 1 | -1, t: number): Key => ({
  t, hips: [0, 0.2, 0], rot: {
    Body: [0.18, 0, 0], Antenna: [0.35, 0, 0],
    LegR: [-0.85 * side, 0, 0], FootR: [0.3 * side, 0, 0], LegL: [0.85 * side, 0, 0], FootL: [-0.3 * side, 0, 0],
    ArmR: [0.9 * side, 0, 0.4], ArmL: [-0.9 * side, 0, -0.4],
  },
});
const passing = (t: number): Key => ({
  t, hips: [0, 0.25, 0], rot: {
    Body: [0.16, 0, 0], Antenna: [0.25, 0, 0],
    LegR: [0, 0, 0], FootR: [0.4, 0, 0], LegL: [0, 0, 0], FootL: [0.4, 0, 0], ArmR: [0, 0, 0.4], ArmL: [0, 0, -0.4],
  },
});
const RUN: Key[] = [stride(1, 0), passing(0.125), stride(-1, 0.25), passing(0.375), stride(1, 0.5)];

const JUMP_POSE: Key['rot'] = {
  Body: [-0.1, 0, 0], Antenna: [-0.4, 0, 0],
  ArmR: [-0.3, 0, 2.3], ArmL: [-0.3, 0, -2.3], HandR: [0, 0, 0.3], HandL: [0, 0, -0.3],
  LegR: [-0.7, 0, 0], FootR: [1.1, 0, 0], LegL: [-0.3, 0, 0], FootL: [0.8, 0, 0],
};
const JUMP: Key[] = [
  { t: 0, hips: [0, 0.2, 0], rot: REST },
  { t: 0.15, hips: [0, 0.22, 0], rot: JUMP_POSE },
];

const FALL: Key[] = [
  { t: 0, hips: [0, 0.22, 0], rot: JUMP_POSE },
  {
    t: 0.3, hips: [0, 0.2, 0], rot: {
      Body: [0.05, 0, 0], Antenna: [-0.6, 0, 0],
      ArmR: [0, 0, 1.35], ArmL: [0, 0, -1.35], HandR: [0, 0, -0.4], HandL: [0, 0, 0.4],
      LegR: [0.2, 0, 0.12], LegL: [-0.2, 0, -0.12], FootR: [-0.2, 0, 0], FootL: [0.2, 0, 0],
    },
  },
];

const DIE: Key[] = [
  { t: 0, hips: [0, 0.2, 0], rot: REST },
  {
    t: 0.2, hips: [0, 0.2, 0], rot: {
      Body: [-0.25, 0, 0], Antenna: [-0.8, 0, 0.5],
      ArmR: [0, 0, 2.8], ArmL: [0, 0, -2.8], LegR: [0, 0, 0.4], LegL: [0, 0, -0.4],
    },
  },
];

/** At the flag: hops and waves the right arm. */
const wave = (t: number, up: boolean): Key => ({
  t, hips: [0, up ? 0.32 : 0.2, 0], rot: {
    Body: [-0.08, 0, 0], Antenna: [up ? -0.3 : 0.2, 0, 0],
    ArmR: [0, 0, up ? 2.9 : 2.4], HandR: [0, 0, up ? 0.5 : -0.4], ArmL: [0, 0, -0.3],
    LegR: up ? [-0.5, 0, 0] : [0, 0, 0], FootR: up ? [0.7, 0, 0] : [0, 0, 0],
    LegL: up ? [-0.5, 0, 0] : [0, 0, 0], FootL: up ? [0.7, 0, 0] : [0, 0, 0],
  },
});
const VICTORY: Key[] = [wave(0, false), wave(0.3, true), wave(0.6, false)];

/** Catmull-Rom through the keys, so the motion eases between poses (looping clips wrap their tangents). */
function spline(keys: { t: number; v: number[] }[], t: number, loop: boolean): number[] {
  let i = 0;
  while (i < keys.length - 2 && keys[i + 1].t <= t) i++;
  const last = keys.length - 1;
  const k1 = keys[i], k2 = keys[Math.min(i + 1, last)];
  const k0 = i > 0 ? keys[i - 1] : loop ? { t: k1.t - (keys[last].t - keys[last - 1].t), v: keys[last - 1].v } : k1;
  const k3 = i + 2 <= last ? keys[i + 2] : loop ? { t: k2.t + (keys[1].t - keys[0].t), v: keys[1].v } : k2;
  const s = k2.t > k1.t ? Math.min(1, Math.max(0, (t - k1.t) / (k2.t - k1.t))) : 0;
  const s2 = s * s, s3 = s2 * s;
  return k1.v.map((p1, c) => {
    const p0 = k0.v[c], p2 = k2.v[c], p3 = k3.v[c];
    const m1 = k2.t > k0.t ? ((p2 - p0) / (k2.t - k0.t)) * (k2.t - k1.t) : 0;
    const m2 = k3.t > k1.t ? ((p3 - p1) / (k3.t - k1.t)) * (k2.t - k1.t) : 0;
    return (2 * s3 - 3 * s2 + 1) * p1 + (s3 - 2 * s2 + s) * m1 + (-2 * s3 + 3 * s2) * p2 + (s3 - s2) * m2;
  });
}

const RATE = 30;

/** Samples the keys at 30 Hz into one channel per joint (and the hips' position). */
function clipFrom(name: BitClip, keys: Key[]): AnimationClip {
  const loop = LOOPING[name];
  const duration = keys[keys.length - 1].t;
  const n = Math.round(duration * RATE) + 1;
  const times = new Float32Array(n);
  for (let i = 0; i < n; i++) times[i] = Math.min(duration, i / RATE);
  const channels: AnimationChannel[] = [];
  const q = quat.create();
  const d = 180 / Math.PI;
  for (const bone of BIT_BONES) {
    const track = keys.map((k) => ({ t: k.t, v: k.rot[bone.name] ?? [0, 0, 0] }));
    const values = new Float32Array(n * 4);
    for (let i = 0; i < n; i++) {
      const [x, y, z] = spline(track, times[i], loop);
      quat.fromEuler(q, x * d, y * d, z * d);
      values.set(q, i * 4);
    }
    channels.push({ target: bone.name, property: 'rotation', times, values, interpolation: 'LINEAR' });
  }
  const hips = keys.map((k) => ({ t: k.t, v: k.hips }));
  const hipValues = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) hipValues.set(spline(hips, times[i], loop), i * 3);
  channels.unshift({ target: 'Hips', property: 'translation', times, values: hipValues, interpolation: 'LINEAR' });
  return new AnimationClip(name, channels, duration);
}

export function bitClips(): AnimationClip[] {
  return [
    clipFrom('Idle', IDLE), clipFrom('Run', RUN), clipFrom('Jump', JUMP),
    clipFrom('Fall', FALL), clipFrom('Die', DIE), clipFrom('Victory', VICTORY),
  ];
}

/** Which clip suits the hero now, and how fast to play it. */
export function clipFor(state: { onGround: boolean; vx: number; vy: number; dead: boolean; won: boolean }): { clip: BitClip; speed: number } {
  if (state.dead) return { clip: 'Die', speed: 1 };
  if (state.won) return { clip: 'Victory', speed: 1 };
  if (!state.onGround) return { clip: state.vy > 0 ? 'Jump' : 'Fall', speed: 1 };
  const speed = Math.abs(state.vx);
  if (speed > 0.3) return { clip: 'Run', speed: Math.max(0.6, speed / RUN_CLIP_SPEED) };
  return { clip: 'Idle', speed: 1 };
}
