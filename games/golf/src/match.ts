// A game for one to four players: each plays a hole (or a challenge) in turn,
// from the first player to the last, then all move on. A round counts strokes
// and the fewest wins; "nearest the pin" counts metres (fewest wins); the range
// counts points (most wins).

export const MAX_PLAYERS = 4;
/** A hole ends at this many strokes even if the ball is not in (a casual pick-up rule). */
export const MAX_STROKES = 10;

export type Scoring = 'strokes' | 'metres' | 'points';

export interface GolfPlayer<S = string> {
  name: string;
  /** The computer's skill, when it plays for this player. */
  cpu?: S;
  /** The score on each hole (or challenge) played so far: strokes, metres or points. */
  strokes: number[];
}

export class GolfMatch<S = string> {
  readonly players: GolfPlayer<S>[];
  /** The player playing now, and the hole (index into `pars`). */
  current = 0;
  hole = 0;

  constructor(names: string[], readonly pars: number[], cpu?: S, readonly scoring: Scoring = 'strokes') {
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
    this.player.strokes[this.hole] = this.scoring === 'strokes' ? Math.min(MAX_STROKES, strokes) : strokes;
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

  /** Players from best to worst (fewest strokes or metres, most points); ties keep the playing order. */
  ranking(): GolfPlayer<S>[] {
    const sign = this.scoring === 'points' ? -1 : 1;
    return this.players.map((p, i) => ({ p, i })).sort((a, b) => sign * (this.total(a.p) - this.total(b.p)) || a.i - b.i).map((x) => x.p);
  }
}

/** "par", "+3", "−2" for a score against par. */
export function formatToPar(d: number): string {
  return d === 0 ? 'par' : d > 0 ? `+${d}` : `−${-d}`;
}
