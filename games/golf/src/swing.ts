// The swing gesture: drag down to take the club back (the power bar fills),
// then flick up to hit (it goes off as the finger turns up). A slanted flick curves the ball. A sideways drag before
// that turns the aim. Keyboard: hold space for power, Q/E for curve.
import { Pointer, PointerState } from '../../../src';

export const SWING = {
  /** A backswing this long (share of the screen height) is full power. */
  fullBack: 0.25,
  /** The swing fires as soon as the finger comes back up this share of the backswing... */
  trigger: 0.2,
  /** ...at least this fast (screen heights per second, over the last 80 ms). */
  minFlick: 0.2,
  /** Flicks within this many degrees of straight up go straight. */
  deadZoneDeg: 14,
  /** A flick this slanted (degrees) gives the full curve. */
  fullCurveDeg: 45,
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
 * The swing in a gesture, as soon as there is one: the finger went down, then
 * started back up quickly enough (it need not let go), or null while there is
 * none yet. Power comes from the backswing (shown on the bar), not from the
 * flick; the flick's slant from the lowest point gives the curve, gently near
 * straight so a slightly crooked thumb still hits it straight.
 */
export function gestureToSwing(path: Point[], screenHeight: number): Swing | null {
  if (path.length < 3) return null;
  let lowest = 0;
  for (let i = 1; i < path.length; i++) if (path[i].y >= path[lowest].y) lowest = i;
  const back = path[lowest].y - path[0].y;
  if (back < screenHeight * 0.03) return null;
  const end = path[path.length - 1];
  const up = path[lowest].y - end.y;
  if (up < Math.max(back * SWING.trigger, screenHeight * 0.02)) return null;
  // Speed of the last 80 ms going up.
  let i = path.length - 1;
  while (i > lowest && end.t - path[i - 1].t < 80) i--;
  const from = path[Math.max(lowest, i - 1)];
  const seconds = Math.max(0.016, (end.t - from.t) / 1000);
  if ((from.y - end.y) / screenHeight / seconds < SWING.minFlick) return null;
  const deg = (Math.atan2(end.x - path[lowest].x, up) * 180) / Math.PI;
  const t = Math.min(1, Math.max(0, (Math.abs(deg) - SWING.deadZoneDeg) / (SWING.fullCurveDeg - SWING.deadZoneDeg)));
  return { power: backswingPower(path, screenHeight), curve: Math.sign(deg) * t * t || 0 };
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
  const gestures = new Map<number, { mode: 'none' | 'aim' | 'swing' | 'done'; lastX: number; path: Point[] }>();
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
    if (g.mode !== 'swing') return;
    // The swing goes off the moment the finger turns back up: no waiting for it to lift.
    const s = gestureToSwing(g.path, canvas.clientHeight);
    if (s) { g.mode = 'done'; handlers.onPower(null); handlers.onSwing(s); return; }
    handlers.onPower(backswingPower(g.path, canvas.clientHeight));
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
    // Let go without turning back up: the swing is called off.
    handlers.onPower(null);
  });
  return () => { offDown(); offMove(); offUp(); };
}
