// The throw gesture: drag sideways to move the ball, swipe up to bowl.
import { Pointer, PointerState } from '../../../src';
import { ThrowParams } from './lane';

export const THROW = { minSpeed: 4, maxSpeed: 10, maxAngle: 0.06 };

/**
 * A swipe's release velocity (CSS px/s, y down) to a throw, or null when it
 * was not an upward swipe. `screenHeight` makes it the same on every screen:
 * speed follows screen heights per second.
 */
export function gestureToThrow(vx: number, vy: number, screenHeight: number): ThrowParams | null {
  if (vy > -200) return null;
  const screensPerSecond = -vy / Math.max(1, screenHeight);
  const speed = Math.min(THROW.maxSpeed, Math.max(THROW.minSpeed, 3 + 1.6 * screensPerSecond));
  // A tenth of the swipe's angle, so a slanted swipe still stays on the lane.
  const angle = Math.max(-THROW.maxAngle, Math.min(THROW.maxAngle, Math.atan2(vx, -vy) * 0.12));
  return { speed, angle, spin: 0 };
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
    const t = gestureToThrow(v.x, v.y, canvas.clientHeight);
    if (t) handlers.onThrow(t);
  });
  return () => { offDown(); offMove(); offUp(); };
}
