import { describe, expect, it, vi } from 'vitest';

vi.hoisted(() => {
  (globalThis as any).WebGL2RenderingContext ??= new Proxy({}, { get: () => 0 });
});
import { THROW } from './controls';
import { GYRO, gyroToThrow } from './gyro';

/** A swing sampled every 16 ms: `swing(t)` and `twist(t)` give the rates (deg/s) at t ms. */
const swing = (ms: number, rate: (t: number) => number, twist: (t: number) => number = () => 0) =>
  Array.from({ length: Math.round(ms / 16) }, (_, i) => ({ time: i * 16, swing: rate(i * 16), twist: twist(i * 16) }));

describe('gyroToThrow', () => {
  it('ignores a phone that barely moved', () => {
    expect(gyroToThrow(swing(500, () => 40))).toBeNull();
    expect(gyroToThrow([])).toBeNull();
  });
  it('maps the peak swing rate to speed', () => {
    expect(gyroToThrow(swing(500, (t) => (t > 300 ? GYRO.fastSwing : 100)))!.speed).toBeCloseTo(THROW.maxSpeed);
    expect(gyroToThrow(swing(500, () => -GYRO.slowSwing))!.speed).toBeCloseTo(THROW.minSpeed);
  });
  it('turns a wrist twist just before release into spin, and ignores earlier turns', () => {
    const fast = (t: number) => 500 + t;
    // 250 deg/s over the last 300 ms = 75 degrees of twist: past full spin.
    expect(gyroToThrow(swing(800, fast, (t) => (t > 500 ? 250 : 0)))!.spin).toBeCloseTo(THROW.maxSpin, 0);
    expect(gyroToThrow(swing(800, fast, (t) => (t > 500 ? -250 : 0)))!.spin).toBeCloseTo(-THROW.maxSpin, 0);
    expect(gyroToThrow(swing(800, fast, (t) => (t < 300 ? 300 : 0)))!.spin).toBe(0);
  });
});
