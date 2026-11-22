import { describe, expect, it, vi } from 'vitest';

vi.hoisted(() => {
  (globalThis as any).WebGL2RenderingContext ??= new Proxy({}, { get: () => 0 });
});
import { gestureToThrow, THROW } from './controls';

describe('gestureToThrow', () => {
  it('ignores slow or downward swipes', () => {
    expect(gestureToThrow(0, -100, 800)).toBeNull();
    expect(gestureToThrow(0, 900, 800)).toBeNull();
  });
  it('maps speed to screens per second, within the limits', () => {
    expect(gestureToThrow(0, -2400, 800)!.speed).toBeCloseTo(7.8); // 3 screens/s
    expect(gestureToThrow(0, -300, 800)!.speed).toBe(THROW.minSpeed);
    expect(gestureToThrow(0, -20000, 800)!.speed).toBe(THROW.maxSpeed);
  });
  it('turns a slanted swipe into a small angle, capped', () => {
    expect(gestureToThrow(0, -2000, 800)!.angle).toBe(0);
    const right = gestureToThrow(400, -2000, 800)!.angle;
    expect(right).toBeGreaterThan(0);
    expect(right).toBeLessThan(0.03);
    expect(gestureToThrow(-5000, -1000, 800)!.angle).toBe(-THROW.maxAngle);
  });
});
