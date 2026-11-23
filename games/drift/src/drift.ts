// Drift points and the turbo. While the car slides (an assisted drift, or a
// free slide past 12° above 10 m/s) it earns points each second: the angle in
// degrees times the speed in m/s, over 10. Drifts linked within a moment of
// each other raise the multiplier, up to ×5; once the car has gone straight a
// moment the chain is banked, points times the multiplier. Hitting a wall
// before then loses it. The points also fill the turbo; when it is full, the
// turbo fires as the drift ends. No engine, so it is tested in Node.
import { Car, driftAngle, speedOf } from './car';

export const SCORE = {
  /** A free slide counts past this angle (rad) and speed (m/s). */
  angle: 0.21,
  speed: 10,
  /** Points per second: degrees × m/s × this. */
  rate: 0.1,
  /** A new drift within this many seconds of the last links to it, and raises the multiplier. */
  link: 1.5,
  /** The highest multiplier. */
  most: 5,
  /** A wall hit at more than this (m/s) loses the chain. */
  hit: 3,
  /** Points that fill the turbo, and how long it lasts (s). */
  turbo: 900,
  boost: 1.5,
};

export interface DriftScore {
  /** Points banked. */
  total: number;
  /** The chain's points not yet banked, and its multiplier. */
  chain: number;
  mult: number;
  /** Sliding now, and the seconds since the last slide ended. */
  sliding: boolean;
  since: number;
  /** The turbo's charge (0 to 1), and whether it fires when this drift ends. */
  charge: number;
  /** The longest chain banked (points with its multiplier). */
  best: number;
}

export const makeScore = (): DriftScore => ({ total: 0, chain: 0, mult: 1, sliding: false, since: Infinity, charge: 0, best: 0 });

/** Whether the car counts as drifting. */
export function isDrifting(c: Car): boolean {
  return !!c.drift || (Math.abs(driftAngle(c)) > SCORE.angle && speedOf(c) > SCORE.speed);
}

export type ScoreEvent = 'banked' | 'lost' | 'turbo' | 'link' | null;

/**
 * Moves the score on by `dt`: `hit` is the speed the car hit a wall with this
 * step (0 if none). Sets the car's turbo when it fires.
 */
export function updateScore(s: DriftScore, c: Car, hit: number, dt: number): ScoreEvent {
  const was = s.sliding;
  s.sliding = isDrifting(c);
  if (hit > SCORE.hit && (s.sliding || s.chain > 0)) {
    s.chain = 0; s.mult = 1; s.since = Infinity;
    return 'lost';
  }
  let event: ScoreEvent = null;
  if (s.sliding) {
    if (!was && s.chain > 0 && s.since < SCORE.link) { s.mult = Math.min(SCORE.most, s.mult + 1); event = 'link'; }
    const deg = Math.min(60, Math.abs(driftAngle(c)) * 180 / Math.PI);
    const got = deg * speedOf(c) * SCORE.rate * dt;
    s.chain += got;
    s.charge = Math.min(1, s.charge + (got * s.mult) / SCORE.turbo);
    s.since = 0;
  } else {
    // The drift just ended: the turbo, if it is full.
    if (was && s.charge >= 1) { s.charge = 0; c.boost = SCORE.boost; event = 'turbo'; }
    s.since += dt;
    if (s.chain > 0 && s.since >= SCORE.link) {
      const banked = Math.round(s.chain * s.mult);
      s.total += banked;
      s.best = Math.max(s.best, banked);
      s.chain = 0; s.mult = 1;
      return 'banked';
    }
  }
  return event;
}

/** The chain as it would bank now. */
export const pending = (s: DriftScore) => Math.round(s.chain * s.mult);
