// A round for one to four players: each plays a hole in turn, from the first
// player to the last, then all move to the next hole. Lowest total wins.

export const MAX_PLAYERS = 4;
/** A hole ends at this many strokes even if the ball is not in (a casual pick-up rule). */
export const MAX_STROKES = 10;

export interface GolfPlayer<S = string> {
  name: string;
  /** The computer's skill, when it plays for this player. */
  cpu?: S;
  /** Strokes on each hole played so far. */
  strokes: number[];
}

export class GolfMatch<S = string> {
  readonly players: GolfPlayer<S>[];
  /** The player playing now, and the hole (index into `pars`). */
  current = 0;
  hole = 0;

  constructor(names: string[], readonly pars: number[], cpu?: S) {
    this.players = names.map((name) => ({ name, strokes: [] }));
    if (cpu !== undefined) this.players.push({ name: 'Computador', cpu, strokes: [] });
  }

  get player(): GolfPlayer<S> { return this.players[this.current]; }
  get isOver(): boolean { return this.hole >= this.pars.length; }

  /**
   * The current player finished the hole in `strokes`. Moves on to the next
   * player, or to the next hole after the last one. Returns 'player', 'hole'
   * or 'over' for what changed.
   */
  finish(strokes: number): 'player' | 'hole' | 'over' {
    this.player.strokes[this.hole] = Math.min(MAX_STROKES, strokes);
    if (this.current < this.players.length - 1) { this.current++; return 'player'; }
    this.current = 0;
    this.hole++;
    return this.isOver ? 'over' : 'hole';
  }

  total(p: GolfPlayer<S>): number { return p.strokes.reduce((s, x) => s + (x ?? 0), 0); }

  /** Strokes against par over the holes this player has finished. */
  toPar(p: GolfPlayer<S>): number {
    return p.strokes.reduce((s, x, i) => s + (x === undefined ? 0 : x - this.pars[i]), 0);
  }

  /** Players from best (fewest strokes) to worst; ties keep the playing order. */
  ranking(): GolfPlayer<S>[] {
    return this.players.map((p, i) => ({ p, i })).sort((a, b) => this.total(a.p) - this.total(b.p) || a.i - b.i).map((x) => x.p);
  }
}

/** "par", "+3", "−2" for a score against par. */
export function formatToPar(d: number): string {
  return d === 0 ? 'par' : d > 0 ? `+${d}` : `−${-d}`;
}
