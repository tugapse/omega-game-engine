import { describe, expect, it, vi } from 'vitest';

vi.hoisted(() => {
  (globalThis as any).WebGL2RenderingContext ??= new Proxy({}, { get: () => 0 });
});
import { gestureToThrow, THROW } from './controls';

describe('gestureToThrow', () => {
  const up = (vy: number, dx = 0, dy = -400) => gestureToThrow(0, vy, dx, dy, 800);
  it('ignores slow or downward swipes', () => {
    expect(up(-100)).toBeNull();
    expect(gestureToThrow(0, 900, 0, 300, 800)).toBeNull();
  });
  it('maps speed to screens per second, within the limits', () => {
    expect(up(-2400)!.speed).toBeCloseTo(7.8); // 3 screens/s
    expect(up(-300)!.speed).toBe(THROW.minSpeed);
    expect(up(-20000)!.speed).toBe(THROW.maxSpeed);
  });
  it('throws straight for swipes near straight up, whatever the release does', () => {
    const tan = (deg: number) => Math.tan((deg * Math.PI) / 180) * 400;
    expect(up(-2000, tan(10))!.angle).toBe(0);
    expect(up(-2000, -tan(10))!.angle).toBe(0);
    // A sideways flick at release does not count: only the whole swipe does.
    expect(gestureToThrow(3000, -2000, 0, -400, 800)!.angle).toBe(0);
  });
  it('grows the angle slowly past the dead zone, capped', () => {
    const tan = (deg: number) => Math.tan((deg * Math.PI) / 180) * 400;
    const a20 = up(-2000, tan(20))!.angle;
    expect(a20).toBeGreaterThan(0);
    expect(a20).toBeLessThan(0.01); // under 20 cm at the pins
    expect(up(-2000, -tan(30))!.angle).toBeLessThan(0);
    expect(up(-2000, tan(60))!.angle).toBeCloseTo(THROW.maxAngle);
  });
});
