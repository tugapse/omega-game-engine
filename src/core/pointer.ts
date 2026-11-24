/** One position of a pointer, in CSS pixels relative to the canvas, at a time in ms. */
export interface PointerSample {
  x: number;
  y: number;
  time: number;
}

/** A finger, pen or mouse button held on the canvas. */
export interface PointerState {
  id: number;
  /** "mouse", "touch" or "pen". */
  type: string;
  x: number;
  y: number;
  startX: number;
  startY: number;
  startTime: number;
  /** Recent samples, oldest first (the last {@link Pointer.historyMs} ms). */
  history: PointerSample[];
}

export type PointerListener = (pointer: PointerState) => void;

/**
 * Touch, pen and mouse input through pointer events, fed by the engine's
 * InputManager. Keeps every pointer held on the canvas, with a short history
 * of positions to measure gestures (a swipe's speed and direction).
 */
export class Pointer {
  /** How long the history keeps samples, in ms. */
  static historyMs = 250;
  /** Pointers held now, by id. */
  static readonly active = new Map<number, PointerState>();

  private static readonly downListeners = new Set<PointerListener>();
  private static readonly moveListeners = new Set<PointerListener>();
  private static readonly upListeners = new Set<PointerListener>();

  /** The first pointer still held, if any. */
  static get primary(): PointerState | undefined {
    return this.active.values().next().value;
  }

  /** Calls `listener` when a pointer goes down; returns a function that unsubscribes. */
  static onDown(listener: PointerListener): () => void {
    this.downListeners.add(listener);
    return () => this.downListeners.delete(listener);
  }

  static onMove(listener: PointerListener): () => void {
    this.moveListeners.add(listener);
    return () => this.moveListeners.delete(listener);
  }

  /** Calls `listener` when a pointer is lifted (or cancelled), with its final state. */
  static onUp(listener: PointerListener): () => void {
    this.upListeners.add(listener);
    return () => this.upListeners.delete(listener);
  }

  /**
   * Velocity in CSS pixels per second over the last `windowMs` of the pointer's
   * history (y grows downwards). Zero with fewer than two samples.
   */
  static velocity(pointer: PointerState, windowMs = 100): { x: number; y: number } {
    const h = pointer.history;
    if (h.length < 2) return { x: 0, y: 0 };
    const last = h[h.length - 1];
    let first = h[h.length - 2];
    for (let i = h.length - 2; i >= 0 && last.time - h[i].time <= windowMs; i--) first = h[i];
    const dt = (last.time - first.time) / 1000;
    if (dt <= 0) return { x: 0, y: 0 };
    return { x: (last.x - first.x) / dt, y: (last.y - first.y) / dt };
  }

  /** @internal Called by the InputManager (and tests). */
  static _down(id: number, type: string, x: number, y: number, time: number): void {
    const state: PointerState = { id, type, x, y, startX: x, startY: y, startTime: time, history: [{ x, y, time }] };
    this.active.set(id, state);
    for (const l of this.downListeners) l(state);
  }

  /** @internal */
  static _move(id: number, x: number, y: number, time: number): void {
    const state = this.active.get(id);
    if (!state) return;
    state.x = x;
    state.y = y;
    state.history.push({ x, y, time });
    while (state.history.length > 2 && time - state.history[0].time > this.historyMs) state.history.shift();
    for (const l of this.moveListeners) l(state);
  }

  /** @internal */
  static _up(id: number, x: number, y: number, time: number): void {
    const state = this.active.get(id);
    if (!state) return;
    this._move(id, x, y, time);
    this.active.delete(id);
    for (const l of this.upListeners) l(state);
  }
}
