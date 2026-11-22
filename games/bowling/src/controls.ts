// The throw gesture: drag sideways to move the ball, swipe up to bowl, curve the swipe for spin.
import { Pointer, PointerState } from '../../../src';
import { ThrowParams } from './lane';

export const THROW = {
  minSpeed: 4,
  maxSpeed: 10,
  /** Largest throw angle, in radians (about 1 m sideways at the pins). */
  maxAngle: 0.06,
  /** Swipes within this many degrees of straight up throw straight. */
  deadZoneDeg: 12,
  /** A swipe this slanted (degrees) gives the largest angle. */
  fullAngleDeg: 45,
  /** Largest side spin, rad/s (about 0.5 m of hook at 7 m/s). */
  maxSpin: 25,
  /** A swipe that turns less than this (degrees) has no spin. */
  spinDeadZoneDeg: 6,
  /** A swipe that turns this much (degrees) gives the most spin. */
  spinFullDeg: 30,
};

export interface Point { x: number; y: number }

/**
 * How much a swipe turns, in degrees (positive = clockwise on screen, i.e.
 * curving to the right): the direction of its second third of length minus
 * that of its first third. The last third is left out on purpose: a thumb
 * curls sideways as it lets go, and that curl must not become spin.
 */
export function swipeTurn(path: Point[]): number {
  if (path.length < 3) return 0;
  const lengths = [0];
  for (let i = 1; i < path.length; i++) {
    lengths.push(lengths[i - 1] + Math.hypot(path[i].x - path[i - 1].x, path[i].y - path[i - 1].y));
  }
  const total = lengths[lengths.length - 1];
  if (total < 1) return 0;
  const at = (d: number): Point => {
    let i = 1;
    while (i < path.length - 1 && lengths[i] < d) i++;
    const span = lengths[i] - lengths[i - 1] || 1;
    const t = (d - lengths[i - 1]) / span;
    return { x: path[i - 1].x + (path[i].x - path[i - 1].x) * t, y: path[i - 1].y + (path[i].y - path[i - 1].y) * t };
  };
  const a = path[0], b = at(total / 3), c = at((2 * total) / 3);
  const first = Math.atan2(b.x - a.x, a.y - b.y);
  const second = Math.atan2(c.x - b.x, b.y - c.y);
  let turn = ((second - first) * 180) / Math.PI;
  if (turn > 180) turn -= 360;
  if (turn < -180) turn += 360;
  return turn;
}

/**
 * A swipe to a throw, or null when it was not an upward swipe.
 * Speed comes from the release velocity (CSS px/s, y down), as screen heights
 * per second, so it is the same on every screen. Direction comes from the
 * whole swipe (start to release), not the last moment: a thumb curls
 * sideways as it lets go. Swipes near straight up throw straight, and the
 * angle grows slowly past that, so an aimed throw takes a clearly slanted swipe.
 * Spin comes from `turnDeg` (see {@link swipeTurn}): the ball follows the
 * drawing, so a swipe curving to the left hooks to the left.
 */
export function gestureToThrow(vx: number, vy: number, dx: number, dy: number, screenHeight: number, turnDeg = 0): ThrowParams | null {
  if (vy > -200 || dy >= 0) return null;
  const screensPerSecond = -vy / Math.max(1, screenHeight);
  const speed = Math.min(THROW.maxSpeed, Math.max(THROW.minSpeed, 3 + 1.6 * screensPerSecond));
  const deg = (Math.atan2(dx, -dy) * 180) / Math.PI;
  const angle = Math.sign(deg) * ramp(Math.abs(deg), THROW.deadZoneDeg, THROW.fullAngleDeg) ** 1.5 * THROW.maxAngle;
  const spin = -Math.sign(turnDeg) * ramp(Math.abs(turnDeg), THROW.spinDeadZoneDeg, THROW.spinFullDeg) * THROW.maxSpin;
  return { speed, angle: angle || 0, spin: spin || 0 };
}

/** 0 below `from`, 1 above `to`, linear between. */
function ramp(value: number, from: number, to: number): number {
  return Math.min(1, Math.max(0, (value - from) / (to - from)));
}

export interface SwipeHandlers {
  /** Sideways drag, as a fraction of the canvas width since the last call. */
  onMove(dxFraction: number): void;
  onThrow(params: ThrowParams): void;
  /** A tap (no drag), at canvas CSS pixels: to aim, or to continue after a result. */
  onTap(x: number, y: number): void;
}

/** Turns pointer gestures on `canvas` into moves, throws and taps. Returns a function that stops it. */
export function bindSwipe(canvas: HTMLCanvasElement, handlers: SwipeHandlers): () => void {
  const modes = new Map<number, { mode: 'none' | 'move' | 'throw'; lastX: number; path: Point[] }>();
  const offDown = Pointer.onDown((p) => modes.set(p.id, { mode: 'none', lastX: p.x, path: [{ x: p.x, y: p.y }] }));
  const offMove = Pointer.onMove((p: PointerState) => {
    const m = modes.get(p.id);
    if (!m) return;
    const dx = p.x - p.startX, dy = p.y - p.startY;
    if (m.mode === 'none' && Math.hypot(dx, dy) > 12) m.mode = Math.abs(dx) > Math.abs(dy) ? 'move' : 'throw';
    if (m.mode === 'move') handlers.onMove((p.x - m.lastX) / canvas.clientWidth);
    m.lastX = p.x;
    m.path.push({ x: p.x, y: p.y });
  });
  const offUp = Pointer.onUp((p) => {
    const m = modes.get(p.id);
    modes.delete(p.id);
    if (!m) return;
    const rect = canvas.getBoundingClientRect();
    if (m.mode === 'none') { handlers.onTap(p.x - rect.left, p.y - rect.top); return; }
    if (m.mode !== 'throw') return;
    m.path.push({ x: p.x, y: p.y });
    const v = Pointer.velocity(p, 100);
    const t = gestureToThrow(v.x, v.y, p.x - p.startX, p.y - p.startY, canvas.clientHeight, swipeTurn(m.path));
    if (t) handlers.onThrow(t);
  });
  return () => { offDown(); offMove(); offUp(); };
}
