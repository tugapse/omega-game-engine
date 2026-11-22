// The throw gesture: drag sideways to move the ball, swipe up to bowl.
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
};

/**
 * A swipe to a throw, or null when it was not an upward swipe.
 * Speed comes from the release velocity (CSS px/s, y down), as screen heights
 * per second, so it is the same on every screen. Direction comes from the
 * whole swipe (start to release), not the last moment: a thumb curls
 * sideways as it lets go. Swipes near straight up throw straight, and the
 * angle grows slowly past that, so an aimed throw takes a clearly slanted swipe.
 */
export function gestureToThrow(vx: number, vy: number, dx: number, dy: number, screenHeight: number): ThrowParams | null {
  if (vy > -200 || dy >= 0) return null;
  const screensPerSecond = -vy / Math.max(1, screenHeight);
  const speed = Math.min(THROW.maxSpeed, Math.max(THROW.minSpeed, 3 + 1.6 * screensPerSecond));
  const deg = (Math.atan2(dx, -dy) * 180) / Math.PI;
  const past = Math.min(1, Math.max(0, (Math.abs(deg) - THROW.deadZoneDeg) / (THROW.fullAngleDeg - THROW.deadZoneDeg)));
  const angle = Math.sign(deg) * past ** 1.5 * THROW.maxAngle;
  return { speed, angle: angle || 0, spin: 0 };
}

export interface SwipeHandlers {
  /** Sideways drag, as a fraction of the canvas width since the last call. */
  onMove(dxFraction: number): void;
  onThrow(params: ThrowParams): void;
  /** A tap (no drag), e.g. to continue after a result. */
  onTap(): void;
}

/** Turns pointer gestures on `canvas` into moves, throws and taps. Returns a function that stops it. */
export function bindSwipe(canvas: HTMLCanvasElement, handlers: SwipeHandlers): () => void {
  const modes = new Map<number, { mode: 'none' | 'move' | 'throw'; lastX: number }>();
  const offDown = Pointer.onDown((p) => modes.set(p.id, { mode: 'none', lastX: p.x }));
  const offMove = Pointer.onMove((p: PointerState) => {
    const m = modes.get(p.id);
    if (!m) return;
    const dx = p.x - p.startX, dy = p.y - p.startY;
    if (m.mode === 'none' && Math.hypot(dx, dy) > 12) m.mode = Math.abs(dx) > Math.abs(dy) ? 'move' : 'throw';
    if (m.mode === 'move') handlers.onMove((p.x - m.lastX) / canvas.clientWidth);
    m.lastX = p.x;
  });
  const offUp = Pointer.onUp((p) => {
    const m = modes.get(p.id);
    modes.delete(p.id);
    if (!m) return;
    if (m.mode === 'none') { handlers.onTap(); return; }
    if (m.mode !== 'throw') return;
    const v = Pointer.velocity(p, 100);
    const t = gestureToThrow(v.x, v.y, p.x - p.startX, p.y - p.startY, canvas.clientHeight);
    if (t) handlers.onThrow(t);
  });
  return () => { offDown(); offMove(); offUp(); };
}
