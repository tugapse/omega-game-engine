// The obstacle mode's scoring, with no engine: ten rounds of up to two balls on
// a fresh rack. A player's level comes from the pins they have knocked down
// (it only goes up); each level puts more obstacles on their lane and
// multiplies the points of their rounds, so a harder lane pays more.
import { FrameView, NextRoll } from './scoring';

export const ARCADE = {
  rounds: 10,
  /** Pins knocked down (in completed rounds) needed for levels 1, 2, 3… */
  levelAt: [0, 15, 30, 50, 75, 105, 140, 180],
  /** Points multiplier per level (level 1 first). */
  multipliers: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5],
  strikeBonus: 10,
  spareBonus: 5,
};

export const MAX_LEVEL = ARCADE.levelAt.length;

/** The level reached with `pins` knocked down, 1..MAX_LEVEL. */
export function levelFor(pins: number): number {
  let level = 1;
  while (level < MAX_LEVEL && pins >= ARCADE.levelAt[level]) level++;
  return level;
}

export const multiplierFor = (level: number) => ARCADE.multipliers[Math.min(level, MAX_LEVEL) - 1];

interface Round { rolls: number[]; level: number }

const complete = (r: Round) => r.rolls[0] === 10 || r.rolls.length === 2;

/** Points of a finished round: pins plus a strike or spare bonus, times the level's multiplier. */
export function roundPoints(rolls: number[], level: number): number {
  const pins = rolls.reduce((s, x) => s + x, 0);
  const bonus = rolls[0] === 10 ? ARCADE.strikeBonus : pins === 10 ? ARCADE.spareBonus : 0;
  return Math.round((pins + bonus) * multiplierFor(level));
}

export class ArcadeGame {
  private readonly rounds: Round[] = [];

  get rolls(): readonly number[] {
    return this.rounds.flatMap((r) => r.rolls);
  }

  /** Pins knocked down in completed rounds (what the level goes by). */
  get pinsDown(): number {
    return this.rounds.filter(complete).reduce((s, r) => s + r.rolls.reduce((a, b) => a + b, 0), 0);
  }

  /** The level of the round being played, or of the next one (the last one when the game is over). */
  get level(): number {
    const last = this.rounds[this.rounds.length - 1];
    if (last && (!complete(last) || this.isOver)) return last.level;
    return levelFor(this.pinsDown);
  }

  get next(): NextRoll | null {
    const last = this.rounds[this.rounds.length - 1];
    if (last && !complete(last)) return { frame: this.rounds.length - 1, roll: 1, freshRack: false, pinsLeft: 10 - last.rolls[0] };
    if (this.rounds.length >= ARCADE.rounds) return null;
    return { frame: this.rounds.length, roll: 0, freshRack: true, pinsLeft: 10 };
  }

  get isOver(): boolean {
    return this.next === null;
  }

  roll(pins: number): void {
    const next = this.next;
    if (!next) return;
    const value = Math.max(0, Math.min(next.pinsLeft, Math.round(pins)));
    if (next.roll === 0) this.rounds.push({ rolls: [value], level: this.level });
    else this.rounds[this.rounds.length - 1].rolls.push(value);
  }

  /** Points of each finished round so far. */
  roundScores(): number[] {
    return this.rounds.filter(complete).map((r) => roundPoints(r.rolls, r.level));
  }

  get score(): number {
    return this.roundScores().reduce((s, x) => s + x, 0);
  }

  /** The ten rounds as the scoreboard shows them (the third box of the last one stays empty). */
  frames(): FrameView[] {
    const views: FrameView[] = [];
    let total = 0;
    const mark = (pins: number | undefined) => (pins === undefined ? '' : pins === 0 ? '-' : String(pins));
    for (let i = 0; i < ARCADE.rounds; i++) {
      const r = this.rounds[i];
      const [a, b] = r?.rolls ?? [];
      const marks = a === 10 ? ['', 'X'] : [mark(a), a !== undefined && b !== undefined && a + b === 10 ? '/' : mark(b)];
      if (i === ARCADE.rounds - 1) marks.push('');
      const done = r && complete(r);
      if (done) total += roundPoints(r.rolls, r.level);
      views.push({ marks, total: done ? total : null });
    }
    return views;
  }
}
