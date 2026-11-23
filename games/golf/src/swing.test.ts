import { describe, expect, it, vi } from 'vitest';

vi.hoisted(() => {
  (globalThis as any).WebGL2RenderingContext ??= new Proxy({}, { get: () => 0 });
});
import { backswingPower, gestureToSwing, Point, SWING } from './swing';

const H = 800;
/** Down `back` px over 400 ms, then up `up` px (ending `dx` px to the side) over `ms`. */
function gesture(back: number, up: number, dx = 0, ms = 120): Point[] {
  const p: Point[] = [];
  for (let i = 0; i <= 10; i++) p.push({ x: 200, y: 300 + (back * i) / 10, t: i * 40 });
  for (let i = 1; i <= 6; i++) p.push({ x: 200 + (dx * i) / 6, y: 300 + back - (up * i) / 6, t: 400 + (ms * i) / 6 });
  return p;
}

describe('swing gesture', () => {
  it('power comes from how far the club went back', () => {
    expect(gestureToSwing(gesture(H * SWING.fullBack, 300), H)!.power).toBeCloseTo(1);
    expect(gestureToSwing(gesture(H * SWING.fullBack * 0.5, 200), H)!.power).toBeCloseTo(0.5);
    expect(backswingPower(gesture(H, 0), H)).toBe(1);
  });
  it('goes off as soon as the finger turns back up, before it lets go', () => {
    const p = gesture(200, 250);
    // Only the first steps of the way up.
    expect(gestureToSwing(p.slice(0, 13), H)).not.toBeNull();
    expect(gestureToSwing(p.slice(0, 11), H)).toBeNull(); // still at the bottom
  });
  it('a straight or slightly crooked flick goes straight; a slanted one curves that way', () => {
    expect(gestureToSwing(gesture(200, 250, 5), H)!.curve).toBe(0);
    expect(gestureToSwing(gesture(200, 250, 50), H)!.curve).toBe(0); // about 11 degrees
    expect(gestureToSwing(gesture(200, 250, 250), H)!.curve).toBeGreaterThan(0.5);
    expect(gestureToSwing(gesture(200, 250, -200), H)!.curve).toBeLessThan(-0.2);
  });
  it('no swing without a turn back up, or a slow drift up', () => {
    expect(gestureToSwing(gesture(200, 0), H)).toBeNull();
    expect(gestureToSwing(gesture(200, 250, 0, 3000), H)).toBeNull();
    expect(gestureToSwing(gesture(10, 10), H)).toBeNull();
  });
});
