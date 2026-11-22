import { quat } from 'gl-matrix';
import { describe, expect, it, vi } from 'vitest';

vi.hoisted(() => {
  (globalThis as any).WebGL2RenderingContext ??= new Proxy({}, { get: () => 0 });
});
import { SceneEntity } from '../../../src';
import { ReplayRecorder } from './replay';
import { forceToGain } from './sound';

describe('ReplayRecorder', () => {
  it('plays recorded poses back, interpolated between frames', () => {
    const e = new SceneEntity('pin');
    const rec = new ReplayRecorder([e]);
    e.transform.setLocalPosition(0, 0, 0);
    rec.record(0);
    e.transform.setLocalPosition(2, 0, -4);
    e.transform.setLocalRotationQuat(quat.setAxisAngle(quat.create(), [1, 0, 0], Math.PI / 2));
    rec.record(0.1);
    rec.apply(0.05);
    expect(e.transform.worldPosition[0]).toBeCloseTo(1);
    expect(e.transform.worldPosition[2]).toBeCloseTo(-2);
    const half = quat.setAxisAngle(quat.create(), [1, 0, 0], Math.PI / 4);
    expect(Math.abs(quat.dot(e.transform.worldRotationQuat, half))).toBeCloseTo(1, 4);
    rec.apply(5); // past the end: the last frame
    expect(e.transform.worldPosition[0]).toBeCloseTo(2);
    expect(rec.duration).toBeCloseTo(0.1);
    rec.clear();
    expect(rec.duration).toBe(0);
  });
});

describe('forceToGain', () => {
  it('is silent at the threshold, louder with force on a log scale, capped at 1', () => {
    expect(forceToGain(20)).toBe(0);
    expect(forceToGain(200)).toBeCloseTo(0.4);
    expect(forceToGain(1e6)).toBe(1);
  });
});
