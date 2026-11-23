// The computer opponent: picks a spot, an aim and a throw like a player would,
// with errors that depend on its skill. No engine, so it runs in tests.
import { BALL, ThrowParams } from './lane';
import { movingClear, ObstacleSpec } from './obstacles';

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
 * The throw for these standing pins (their x, z positions). A full rack on a
 * clean lane gets a hook into the pocket between pins 1 and 3; otherwise a
 * straight ball at the front pin, leaning towards the rest (the pocket for a
 * full rack). With fixed obstacles (`discs`, from fixedDiscs) it picks the
 * spot and aim whose straight line misses them all and ends nearest that
 * target.
 */
export function planThrow(
  skill: CpuSkill, standing: { x: number; z: number }[], rnd: () => number,
  discs: { x: number; z: number; r: number }[] = [], avoid: { x: number; z: number; r: number }[] = [],
): CpuPlan {
  const e = CPU_ERROR[skill];
  const limit = 0.4;
  let x: number, aim: number, speed: number, spin: number;
  if (standing.length === 10 && !discs.length) {
    // From the right with a left hook: the regression test's strike.
    x = 0.3; aim = 0; speed = 8; spin = 10;
  } else {
    const front = standing.reduce((a, b) => (b.z > a.z ? b : a), standing[0] ?? { x: 0, z: -18.3 });
    const mid = standing.reduce((s, p) => s + p.x, 0) / Math.max(1, standing.length);
    const tx = standing.length === 10 ? 0.07 : front.x * 0.7 + mid * 0.3;
    const distance = BALL.start[2] - front.z;
    speed = 7.5; spin = 0;
    x = Math.max(-limit, Math.min(limit, tx * 0.5));
    aim = Math.atan2(tx - x, distance);
    if (discs.length || avoid.length) {
      // The clear line (with 2 cm to spare) that ends nearest the target: clear of
      // the paddles' whole sweep too if it can be, else timed past them.
      for (const keepOut of [[...discs, ...avoid], discs]) {
        let best = Infinity;
        for (let cx = -limit; cx <= limit + 1e-9; cx += 0.02) {
          for (let ca = -0.05; ca <= 0.05 + 1e-9; ca += 0.0025) {
            const at = (z: number) => cx + Math.tan(ca) * (BALL.start[2] - z);
            if (keepOut.some((d) => Math.abs(at(d.z) - d.x) < d.r + 0.02)) continue;
            const miss = Math.abs(at(front.z) - tx) + Math.abs(ca) * 0.5; // straighter is safer
            if (miss < best) { best = miss; x = cx; aim = ca; }
          }
        }
        // A line that clears everything but ends far off the pins is worse than timing the paddle.
        if (best < 0.25) break;
      }
    }
  }
  return {
    x: Math.max(-limit, Math.min(limit, x + gauss(rnd) * e.x)),
    aim: Math.max(-0.07, Math.min(0.07, aim + gauss(rnd) * e.aim)),
    throw: { speed: Math.max(4, Math.min(10, speed + gauss(rnd) * e.speed)), angle: 0, spin: spin + gauss(rnd) * e.spin },
  };
}

/**
 * How long the computer waits before it bowls, so moving obstacles are out of
 * the way when the ball gets there: `clock` is the obstacle clock now and
 * `delay` the time from the end of the wait to the ball leaving the hand. The
 * hard computer always times it, the medium one half the time, the easy one
 * never.
 */
export function cpuWait(skill: CpuSkill, layout: readonly ObstacleSpec[], clock: number, delay: number, plan: CpuPlan, rnd: () => number): number {
  if (!layout.some((o) => o.kind === 'slider' || o.kind === 'spinner')) return rnd() * 0.4;
  const times = skill === 'hard' || (skill === 'medium' && rnd() < 0.5);
  if (times) {
    for (let w = 0; w < 4; w += 0.05) {
      if (movingClear(layout, clock + w + delay, plan.x, plan.aim + plan.throw.angle, plan.throw.speed)) return w;
    }
  }
  return rnd() * 2;
}
