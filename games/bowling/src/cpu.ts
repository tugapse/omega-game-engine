// The computer opponent: picks a spot, an aim and a throw like a player would,
// with errors that depend on its skill. No engine, so it runs in tests.
import { BALL, ThrowParams } from './lane';

export type CpuSkill = 'easy' | 'medium' | 'hard';

export const CPU_NAMES: Record<CpuSkill, string> = { easy: 'Fácil', medium: 'Médio', hard: 'Difícil' };

/** Standard deviation of each error: aim (rad), spot (m), speed (m/s), spin (rad/s). */
export const CPU_ERROR: Record<CpuSkill, { aim: number; x: number; speed: number; spin: number }> = {
  easy: { aim: 0.007, x: 0.06, speed: 0.9, spin: 5 },
  medium: { aim: 0.0035, x: 0.03, speed: 0.5, spin: 2.5 },
  hard: { aim: 0.0022, x: 0.018, speed: 0.3, spin: 1.5 },
};

export interface CpuPlan {
  /** Where to stand (the ball's x on the foul line). */
  x: number;
  /** The aim, radians (positive = right). */
  aim: number;
  /** The throw itself (its angle adds to the aim). */
  throw: ThrowParams;
}

/** A normally distributed number (Box–Muller) from a uniform generator. */
function gauss(rnd: () => number): number {
  const u = Math.max(1e-9, rnd());
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rnd());
}

/**
 * The throw for these standing pins (their x, z positions). A full rack gets a
 * hook into the pocket between pins 1 and 3; a leave gets a straight ball at
 * its front pin, leaning towards the rest. `corridor` is the x of a clear
 * straight path past fixed obstacles, when there are any: the computer stands
 * there and only aims a little.
 */
export function planThrow(skill: CpuSkill, standing: { x: number; z: number }[], rnd: () => number, corridor: number | null = null): CpuPlan {
  const e = CPU_ERROR[skill];
  const limit = 0.4;
  let x: number, aim: number, speed: number, spin: number;
  if (standing.length === 10 && corridor === null) {
    // From the right with a left hook: the regression test's strike.
    x = 0.3; aim = 0; speed = 8; spin = 10;
  } else {
    const front = standing.reduce((a, b) => (b.z > a.z ? b : a), standing[0] ?? { x: 0, z: -18.3 });
    const mid = standing.reduce((s, p) => s + p.x, 0) / Math.max(1, standing.length);
    const tx = front.x * 0.7 + mid * 0.3;
    const distance = BALL.start[2] - front.z;
    x = corridor ?? Math.max(-limit, Math.min(limit, tx * 0.5));
    aim = Math.atan2(tx - x, distance);
    if (corridor !== null) aim = Math.max(-0.01, Math.min(0.01, aim));
    speed = 7.5; spin = 0;
  }
  return {
    x: Math.max(-limit, Math.min(limit, x + gauss(rnd) * e.x)),
    aim: Math.max(-0.07, Math.min(0.07, aim + gauss(rnd) * e.aim)),
    throw: { speed: Math.max(4, Math.min(10, speed + gauss(rnd) * e.speed)), angle: 0, spin: spin + gauss(rnd) * e.spin },
  };
}
