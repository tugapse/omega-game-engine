// The swing gesture: drag down to take the club back (the power bar fills),
// then flick up to hit. A slanted flick curves the ball. A sideways drag before
// that turns the aim. Keyboard: hold space for power, Q/E for curve.
import { Pointer, PointerState } from '../../../src';

export const SWING = {
  /** A backswing this long (share of the screen height) is full power. */
  fullBack: 0.3,
  /** The flick must go back up at least this share of the backswing... */
  minReturn: 0.5,
  /** ...at least this fast (screen heights per second). */
  minFlick: 1.2,
  /** Flicks within this many degrees of straight up go straight. */
  deadZoneDeg: 7,
  /** A flick this slanted (degrees) gives the full curve. */
  fullCurveDeg: 35,
};

export interface Point { x: number; y: number; t: number }

export interface Swing {
  /** 0–1. */
  power: number;
  /** -1 (hook, left) to 1 (slice, right). */
  curve: number;
}

/** The power so far: how far down the path has gone from where it started. */
export function backswingPower(path: Point[], screenHeight: number): number {
  if (!path.length) return 0;
  const low = Math.max(...path.map((p) => p.y));
  return Math.max(0, Math.min(1, (low - path[0].y) / (screenHeight * SWING.fullBack)));
}

/**
 * A finished gesture to a swing, or null when it was not one (no flick back up,
 * or too slow: the player let go to cancel). Power comes from the backswing,
 * not the flick, so it can be judged on the bar; the flick's slant (from the
 * lowest point to the end) gives the curve.
 */
export function gestureToSwing(path: Point[], screenHeight: number): Swing | null {
  if (path.length < 3) return null;
  let lowest = 0;
  for (let i = 1; i < path.length; i++) if (path[i].y >= path[lowest].y) lowest = i;
  const back = path[lowest].y - path[0].y;
  if (back < screenHeight * 0.03) return null;
  const end = path[path.length - 1];
  const up = path[lowest].y - end.y;
  if (up < back * SWING.minReturn) return null;
  // Flick speed over its last 100 ms.
  let i = path.length - 1;
  while (i > lowest && end.t - path[i - 1].t < 100) i--;
  const from = path[Math.max(lowest, i - 1)];
  const seconds = Math.max(0.016, (end.t - from.t) / 1000);
  if ((from.y - end.y) / screenHeight / seconds < SWING.minFlick) return null;
  const deg = (Math.atan2(end.x - path[lowest].x, up) * 180) / Math.PI;
  const t = Math.min(1, Math.max(0, (Math.abs(deg) - SWING.deadZoneDeg) / (SWING.fullCurveDeg - SWING.deadZoneDeg)));
  return { power: backswingPower(path, screenHeight), curve: Math.sign(deg) * t || 0 };
}

export interface SwingHandlers {
  /** Sideways drag before the swing, as a share of the canvas width. */
  onAim(dxFraction: number): void;
  /** The backswing so far (0–1), or null when the gesture ended. */
  onPower(power: number | null): void;
  onSwing(swing: Swing): void;
  onTap(x: number, y: number): void;
}

/** Turns pointer gestures on `canvas` into aim, power and swings. Returns a function that stops it. */
export function bindSwing(canvas: HTMLCanvasElement, handlers: SwingHandlers): () => void {
  const gestures = new Map<number, { mode: 'none' | 'aim' | 'swing'; lastX: number; path: Point[] }>();
  const now = () => performance.now();
  const offDown = Pointer.onDown((p) => gestures.set(p.id, { mode: 'none', lastX: p.x, path: [{ x: p.x, y: p.y, t: now() }] }));
  const offMove = Pointer.onMove((p: PointerState) => {
    const g = gestures.get(p.id);
    if (!g) return;
    const dx = p.x - p.startX, dy = p.y - p.startY;
    if (g.mode === 'none' && Math.hypot(dx, dy) > 12) g.mode = Math.abs(dx) > Math.abs(dy) * 1.2 ? 'aim' : 'swing';
    if (g.mode === 'aim') handlers.onAim((p.x - g.lastX) / canvas.clientWidth);
    g.lastX = p.x;
    g.path.push({ x: p.x, y: p.y, t: now() });
    if (g.mode === 'swing') handlers.onPower(backswingPower(g.path, canvas.clientHeight));
  });
  const offUp = Pointer.onUp((p) => {
    const g = gestures.get(p.id);
    gestures.delete(p.id);
    if (!g) return;
    if (g.mode === 'none') {
      const r = canvas.getBoundingClientRect();
      handlers.onTap(p.x - r.left, p.y - r.top);
      return;
    }
    if (g.mode !== 'swing') return;
    g.path.push({ x: p.x, y: p.y, t: now() });
    handlers.onPower(null);
    const s = gestureToSwing(g.path, canvas.clientHeight);
    if (s) handlers.onSwing(s);
  });
  return () => { offDown(); offMove(); offUp(); };
}
