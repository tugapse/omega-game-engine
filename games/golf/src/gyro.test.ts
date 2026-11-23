import { describe, expect, it } from 'vitest';
import { GYRO, gyroToSwing } from './gyro';

const swing = (ms: number, rate: (t: number) => number, twist: (t: number) => number = () => 0) =>
  Array.from({ length: Math.round(ms / 16) }, (_, i) => ({ time: i * 16, swing: rate(i * 16), twist: twist(i * 16) }));

describe('gyro swing', () => {
  it('ignores a phone that barely moved', () => {
    expect(gyroToSwing(swing(500, () => 40))).toBeNull();
  });
  it('maps the peak swing rate to power', () => {
    expect(gyroToSwing(swing(500, (t) => (t > 300 ? GYRO.fullSwing : 50)))!.power).toBeCloseTo(1);
    expect(gyroToSwing(swing(500, () => GYRO.softSwing))!.power).toBeCloseTo(0.05);
  });
  it('turns a wrist twist just before release into curve, and ignores earlier turns', () => {
    expect(gyroToSwing(swing(800, () => 600, (t) => (t > 500 ? 250 : 0)))!.curve).toBeCloseTo(1, 1);
    expect(gyroToSwing(swing(800, () => 600, (t) => (t > 500 ? -250 : 0)))!.curve).toBeCloseTo(-1, 1);
    expect(gyroToSwing(swing(800, () => 600, (t) => (t < 300 ? 300 : 0)))!.curve).toBe(0);
  });
});
