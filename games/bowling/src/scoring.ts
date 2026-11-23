// Ten-pin bowling rules and scoring, with no engine: a game is its list of rolls.

export interface FrameView {
  /** What each box shows: "X", "/", "-", a digit, or "" when not rolled yet. */
  marks: string[];
  /** Running total up to this frame, or null until its bonus rolls are known. */
  total: number | null;
}

export interface NextRoll {
  /** 0–9. */
  frame: number;
  /** 0-based roll within the frame. */
  roll: number;
  /** True when the roll starts with all ten pins set. */
  freshRack: boolean;
  /** Pins standing for this roll. */
  pinsLeft: number;
  /** A new rack of only these pins (0-based), set before this roll (the spare challenge's layouts). */
  rack?: number[];
}

export class BowlingGame {
  private readonly _rolls: number[] = [];

  get rolls(): readonly number[] {
    return this._rolls;
  }

  /** The roll to come, or null when the game is over. */
  get next(): NextRoll | null {
    const r = this._rolls;
    let i = 0;
    for (let frame = 0; frame < 9; frame++) {
      if (i >= r.length) return { frame, roll: 0, freshRack: true, pinsLeft: 10 };
      if (r[i] === 10) { i += 1; continue; }
      if (i + 1 >= r.length) return { frame, roll: 1, freshRack: false, pinsLeft: 10 - r[i] };
      i += 2;
    }
    const tenth = r.slice(i);
    const [a, b] = tenth;
    switch (tenth.length) {
      case 0: return { frame: 9, roll: 0, freshRack: true, pinsLeft: 10 };
      case 1: return a === 10
        ? { frame: 9, roll: 1, freshRack: true, pinsLeft: 10 }
        : { frame: 9, roll: 1, freshRack: false, pinsLeft: 10 - a };
      case 2:
        if (a === 10) return b === 10
          ? { frame: 9, roll: 2, freshRack: true, pinsLeft: 10 }
          : { frame: 9, roll: 2, freshRack: false, pinsLeft: 10 - b };
        if (a + b === 10) return { frame: 9, roll: 2, freshRack: true, pinsLeft: 10 };
        return null;
      default: return null;
    }
  }

  get isOver(): boolean {
    return this.next === null;
  }

  /** Adds a roll (clamped to the pins standing); ignored once the game is over. */
  roll(pins: number): void {
    const next = this.next;
    if (!next) return;
    this._rolls.push(Math.max(0, Math.min(next.pinsLeft, Math.round(pins))));
  }

  /** The ten frames as a scoreboard shows them. */
  frames(): FrameView[] {
    const r = this._rolls;
    const views: FrameView[] = [];
    let i = 0;
    let total = 0;
    let known = true;
    const mark = (pins: number | undefined) => (pins === undefined ? '' : pins === 0 ? '-' : String(pins));
    for (let frame = 0; frame < 10; frame++) {
      if (frame < 9) {
        const a = r[i], b = r[i + 1], c = r[i + 2];
        let marks: string[];
        let score: number | null = null;
        if (a === 10) {
          marks = ['', 'X'];
          if (b !== undefined && c !== undefined) score = 10 + b + c;
          i += 1;
        } else {
          marks = [mark(a), a !== undefined && b !== undefined && a + b === 10 ? '/' : mark(b)];
          if (a !== undefined && b !== undefined) score = a + b === 10 ? (c !== undefined ? 10 + c : null) : a + b;
          i += 2;
        }
        known = known && score !== null;
        if (known) total += score!;
        views.push({ marks, total: known ? total : null });
      } else {
        const t = r.slice(i, i + 3);
        const marks = ['', '', ''];
        // A box shows X for ten pins on a fresh rack and / for clearing what was left.
        let fresh = true, left = 10;
        t.forEach((pins, k) => {
          marks[k] = fresh && pins === 10 ? 'X' : !fresh && pins === left ? '/' : mark(pins);
          if (fresh && pins === 10) { fresh = true; left = 10; }
          else if (!fresh) { fresh = true; left = 10; }
          else { fresh = false; left = 10 - pins; }
        });
        const complete = this.isOver;
        known = known && complete;
        if (known) total += t.reduce((s, x) => s + x, 0);
        views.push({ marks, total: known ? total : null });
      }
    }
    return views;
  }

  /** The score so far, counting bonuses that are known. */
  get score(): number {
    let last = 0;
    for (const f of this.frames()) if (f.total !== null) last = f.total;
    return last;
  }
}
