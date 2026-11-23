// One to four players taking turns on the same lane: each bowls a whole frame,
// then the next player. Pure, no engine.
import { BowlingGame, FrameView, NextRoll } from './scoring';
import { CpuSkill } from './cpu';

export const MAX_PLAYERS = 4;

/** What a match needs of a game: the classic ten frames or the obstacle mode's rounds. */
export interface ScoredGame {
  readonly next: NextRoll | null;
  readonly isOver: boolean;
  readonly score: number;
  readonly rolls: readonly number[];
  roll(pins: number): void;
  frames(): FrameView[];
}

export interface Player {
  name: string;
  game: ScoredGame;
  /** Played by the computer, at this skill. */
  cpu?: CpuSkill;
}

export class Match {
  readonly players: Player[];
  private _current = 0;

  constructor(names: string[], newGame: () => ScoredGame = () => new BowlingGame()) {
    const n = Math.max(1, Math.min(MAX_PLAYERS, names.length));
    this.players = names.slice(0, n).map((name) => ({ name, game: newGame() }));
  }

  /**
   * Default names: "Jogador 1", "Jogador 2"…, and with `cpu` the computer
   * last (taking the fourth place if all four were asked for).
   */
  static withPlayers(count: number, newGame?: () => ScoredGame, cpu?: CpuSkill): Match {
    const humans = Math.max(1, Math.min(cpu ? MAX_PLAYERS - 1 : MAX_PLAYERS, count));
    const names = Array.from({ length: humans }, (_, i) => `Jogador ${i + 1}`);
    if (cpu) names.push('Computador');
    const match = new Match(names, newGame);
    if (cpu) match.players[humans].cpu = cpu;
    return match;
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
