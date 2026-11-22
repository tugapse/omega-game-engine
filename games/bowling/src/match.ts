// One to four players taking turns on the same lane: each bowls a whole frame,
// then the next player. Pure, no engine.
import { BowlingGame } from './scoring';

export const MAX_PLAYERS = 4;

export interface Player {
  name: string;
  game: BowlingGame;
}

export class Match {
  readonly players: Player[];
  private _current = 0;

  constructor(names: string[]) {
    const n = Math.max(1, Math.min(MAX_PLAYERS, names.length));
    this.players = names.slice(0, n).map((name) => ({ name, game: new BowlingGame() }));
  }

  /** Default names: "Jogador 1", "Jogador 2"… */
  static withPlayers(count: number): Match {
    return new Match(Array.from({ length: Math.max(1, Math.min(MAX_PLAYERS, count)) }, (_, i) => `Jogador ${i + 1}`));
  }

  /** Index of the player whose turn it is. */
  get current(): number {
    return this._current;
  }

  get player(): Player {
    return this.players[this._current];
  }

  get isOver(): boolean {
    return this.players.every((p) => p.game.isOver);
  }

  /**
   * Adds a roll for the current player. Returns true when that ended their
   * frame and the turn passed to someone else (the caller announces it).
   */
  roll(pins: number): boolean {
    const game = this.player.game;
    const frame = game.next?.frame;
    game.roll(pins);
    const next = game.next;
    if (next && next.frame === frame) return false; // same frame, same player
    if (this.isOver) return false;
    const before = this._current;
    // The next player who still has frames to bowl (all have, until the last frame).
    do this._current = (this._current + 1) % this.players.length;
    while (this.players[this._current].game.isOver);
    return this._current !== before;
  }

  /** Players by score, best first (ties keep the playing order). */
  ranking(): Player[] {
    return [...this.players].sort((a, b) => b.game.score - a.game.score);
  }
}
