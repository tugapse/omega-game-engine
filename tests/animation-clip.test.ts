import { describe, expect, it } from 'vitest';
import { AnimationChannel, AnimationClip, findKey, sampleChannel } from '../src/animation/animation-clip';

const channel = (property: AnimationChannel['property'], times: number[], values: number[], interpolation: AnimationChannel['interpolation'] = 'LINEAR'): AnimationChannel =>
  ({ target: 'Bone', property, times: Float32Array.from(times), values: Float32Array.from(values), interpolation });

describe('AnimationClip sampling', () => {
  it('finds keys by binary search and by hint', () => {
    const times = Float32Array.from([0, 1, 2, 3]);
    expect(findKey(times, -1)).toBe(0);
    expect(findKey(times, 1.5)).toBe(1);
    expect(findKey(times, 2.5, 1)).toBe(2);
    expect(findKey(times, 9)).toBe(3);
  });

  it('interpolates translation linearly and clamps outside the keys', () => {
    const c = channel('translation', [0, 2], [0, 0, 0, 2, 4, 6]);
    const out = [0, 0, 0];
    sampleChannel(c, 1, out);
    expect(out).toEqual([1, 2, 3]);
    sampleChannel(c, 5, out);
    expect(out).toEqual([2, 4, 6]);
    sampleChannel(c, -1, out);
    expect(out).toEqual([0, 0, 0]);
  });

  it('holds the previous key with STEP', () => {
    const c = channel('scale', [0, 1], [1, 1, 1, 3, 3, 3], 'STEP');
    const out = [0, 0, 0];
    sampleChannel(c, 0.99, out);
    expect(out).toEqual([1, 1, 1]);
  });

  it('slerps rotations the short way round', () => {
    const h = Math.SQRT1_2;
    // 0 deg and -270 deg (written as the far-side quaternion) about Y: halfway is 45 deg, not 135.
    const c = channel('rotation', [0, 1], [0, 0, 0, 1, 0, -h, 0, -h]);
    const out = [0, 0, 0, 0];
    sampleChannel(c, 0.5, out);
    const angle = 2 * Math.acos(Math.abs(out[3])) * (180 / Math.PI);
    expect(angle).toBeCloseTo(45, 3);
    expect(Math.hypot(...out)).toBeCloseTo(1, 6);
  });

  it('evaluates CUBICSPLINE through its keys', () => {
    // in-tangent, value, out-tangent per key.
    const c = channel('translation', [0, 1], [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0], 'CUBICSPLINE');
    const out = [0, 0, 0];
    sampleChannel(c, 0, out);
    expect(out[0]).toBeCloseTo(0);
    sampleChannel(c, 1, out);
    expect(out[0]).toBeCloseTo(1);
    sampleChannel(c, 0.5, out);
    expect(out[0]).toBeGreaterThan(0.4);
    expect(out[0]).toBeLessThan(0.6);
  });

  it('takes its duration from the last key', () => {
    const clip = new AnimationClip('Walk', [channel('translation', [0, 1.5], [0, 0, 0, 1, 1, 1])]);
    expect(clip.duration).toBe(1.5);
  });
});
