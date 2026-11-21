import { quat } from 'gl-matrix';

export type AnimationInterpolation = 'STEP' | 'LINEAR' | 'CUBICSPLINE';
export type AnimatedProperty = 'translation' | 'rotation' | 'scale';

/**
 * The keyframes of one property of one bone.
 *
 * `values` holds 3 numbers per key (translation, scale) or 4 (rotation, a
 * quaternion x, y, z, w). CUBICSPLINE keys hold in-tangent, value and
 * out-tangent, as in glTF.
 */
export interface AnimationChannel {
  /** The bone's entity name (bones are matched by name under the Animator). */
  target: string;
  property: AnimatedProperty;
  times: Float32Array;
  values: Float32Array;
  interpolation: AnimationInterpolation;
}

/** Keyframe animation of a skeleton: one channel per bone and property. */
export class AnimationClip {
  constructor(
    public name: string,
    public channels: AnimationChannel[],
    public duration = AnimationClip.durationOf(channels),
  ) {}

  static durationOf(channels: AnimationChannel[]): number {
    let d = 0;
    for (const c of channels) if (c.times.length) d = Math.max(d, c.times[c.times.length - 1]);
    return d;
  }
}

/** Size of one value of a property: 4 for a quaternion, 3 otherwise. */
export function componentCount(property: AnimatedProperty): number {
  return property === 'rotation' ? 4 : 3;
}

/**
 * Index of the last key at or before `t` (0 before the first key).
 * `hint` is the index found last time, so playing forward costs O(1).
 */
export function findKey(times: Float32Array, t: number, hint = 0): number {
  const n = times.length;
  if (n < 2 || t <= times[0]) return 0;
  if (t >= times[n - 1]) return n - 1;
  if (hint >= 0 && hint < n - 1 && times[hint] <= t && t < times[hint + 1]) return hint;
  if (hint + 1 < n - 1 && times[hint + 1] <= t && t < times[hint + 2]) return hint + 1;
  let lo = 0, hi = n - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (times[mid] <= t) lo = mid; else hi = mid;
  }
  return lo;
}

const qa = quat.create(), qb = quat.create();

/**
 * The value of a channel at time `t` (clamped to its keys), written to `out`.
 * Returns the key index, to pass back as `hint` next frame.
 */
export function sampleChannel(channel: AnimationChannel, t: number, out: Float32Array | number[], hint = 0): number {
  const { times, values, interpolation } = channel;
  const size = componentCount(channel.property);
  const cubic = interpolation === 'CUBICSPLINE';
  const stride = cubic ? size * 3 : size;
  const offset = cubic ? size : 0; // the value sits between the tangents
  const i = findKey(times, t, hint);
  const last = times.length - 1;

  if (interpolation === 'STEP' || i >= last || t <= times[0]) {
    for (let k = 0; k < size; k++) out[k] = values[i * stride + offset + k];
    return i;
  }

  const t0 = times[i], t1 = times[i + 1];
  const dt = t1 - t0;
  const s = dt > 0 ? (t - t0) / dt : 0;

  if (cubic) {
    // Hermite spline with the glTF tangents (scaled by the key interval).
    const s2 = s * s, s3 = s2 * s;
    const h00 = 2 * s3 - 3 * s2 + 1, h10 = s3 - 2 * s2 + s, h01 = -2 * s3 + 3 * s2, h11 = s3 - s2;
    const a = i * stride, b = (i + 1) * stride;
    for (let k = 0; k < size; k++) {
      const p0 = values[a + size + k], m0 = values[a + 2 * size + k] * dt;
      const p1 = values[b + size + k], m1 = values[b + k] * dt;
      out[k] = h00 * p0 + h10 * m0 + h01 * p1 + h11 * m1;
    }
    if (size === 4) normalize4(out);
    return i;
  }

  const a = i * size, b = (i + 1) * size;
  if (size === 4) {
    quat.set(qa, values[a], values[a + 1], values[a + 2], values[a + 3]);
    quat.set(qb, values[b], values[b + 1], values[b + 2], values[b + 3]);
    // quat.slerp takes the short way round (it flips qb when the dot is negative).
    quat.slerp(qa, qa, qb, s);
    out[0] = qa[0]; out[1] = qa[1]; out[2] = qa[2]; out[3] = qa[3];
  } else {
    for (let k = 0; k < size; k++) out[k] = values[a + k] + (values[b + k] - values[a + k]) * s;
  }
  return i;
}

function normalize4(v: Float32Array | number[]): void {
  const l = Math.hypot(v[0], v[1], v[2], v[3]) || 1;
  v[0] /= l; v[1] /= l; v[2] /= l; v[3] /= l;
}
