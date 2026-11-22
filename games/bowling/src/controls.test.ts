import { describe, expect, it, vi } from 'vitest';

vi.hoisted(() => {
  (globalThis as any).WebGL2RenderingContext ??= new Proxy({}, { get: () => 0 });
});
import { gestureToThrow, Point, swipeTurn, THROW } from './controls';

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

/** A swipe up the screen from (0, 0), 400 px long, heading `startDeg` from straight up and turning `turnDeg` evenly. */
function arc(startDeg: number, turnDeg: number, n = 40): Point[] {
  const pts: Point[] = [{ x: 0, y: 0 }];
  for (let i = 0; i < n; i++) {
    const a = ((startDeg + (turnDeg * (i + 0.5)) / n) * Math.PI) / 180;
    const last = pts[pts.length - 1];
    pts.push({ x: last.x + Math.sin(a) * (400 / n), y: last.y - Math.cos(a) * (400 / n) });
  }
  return pts;
}

describe('swipeTurn and spin', () => {
  it('measures a straight swipe as no turn', () => {
    expect(swipeTurn(arc(0, 0))).toBeCloseTo(0);
    expect(swipeTurn(arc(25, 0))).toBeCloseTo(0);
  });
  it('measures an even curve by the turn between its first two thirds', () => {
    expect(swipeTurn(arc(20, -60))).toBeCloseTo(-20, 0); // curving left
    expect(swipeTurn(arc(-20, 60))).toBeCloseTo(20, 0);
  });
  it('ignores a curl at the very end of the swipe', () => {
    const path = arc(0, 0, 30).concat(arc(0, 0, 10).slice(1).map((p, i) => ({ x: p.x * 0 + (i + 1) * 12, y: -400 + p.y * 0.25 })));
    expect(Math.abs(swipeTurn(path))).toBeLessThan(THROW.spinDeadZoneDeg);
  });
  it('turns a curve into spin: curving left hooks left (positive spin), capped', () => {
    const t = (turn: number) => gestureToThrow(0, -2400, 0, -400, 800, turn)!.spin;
    expect(t(3)).toBe(0);
    expect(t(-18)).toBeGreaterThan(0);
    expect(t(18)).toBeLessThan(0);
    expect(t(-90)).toBeCloseTo(THROW.maxSpin);
  });
});
