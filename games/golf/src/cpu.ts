// The computer opponent: plays like a careful player who tries shots in its
// head (the same simulation the ball uses), then swings with errors that depend
// on its skill. No engine, so it is tested in Node.
import { Course, simulate } from './ball';
import { club, ClubId, lieFactor, MAX_PUTT, shotFor } from './clubs';
import { Hole } from './course';
import { Swing } from './swing';

export type CpuSkill = 'easy' | 'medium' | 'hard';
export const CPU_NAMES: Record<CpuSkill, string> = { easy: 'Fácil', medium: 'Médio', hard: 'Difícil' };

/** Standard deviation of each error: power (share), aim (rad), curve; and the same for putts. */
export const CPU_ERROR: Record<CpuSkill, { power: number; aim: number; curve: number; putt: number; puttAim: number }> = {
  easy: { power: 0.085, aim: 0.032, curve: 0.3, putt: 0.15, puttAim: 0.028 },
  medium: { power: 0.065, aim: 0.024, curve: 0.2, putt: 0.11, puttAim: 0.018 },
  hard: { power: 0.03, aim: 0.008, curve: 0.07, putt: 0.05, puttAim: 0.007 },
};

export interface CpuPlan { club: ClubId; aim: number; swing: Swing }

function gauss(rnd: () => number): number {
  const u = Math.max(1e-9, rnd());
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rnd());
}

const PENALTY: Record<string, number> = { water: 1e4, out: 1e4, sand: 25, rough: 8, tree: 0 };

/**
 * The shot for a ball at `from`: on the green a putt searched for the cup
 * (slope included); elsewhere the club, power and aim whose result ends
 * nearest the pin (or a fairway point within reach), away from water, sand
 * and rough. `reach` is each club's full distance; the easy computer ignores
 * the wind when it plans.
 */
export function planShot(skill: CpuSkill, hole: Hole, course: Course, from: { x: number; z: number }, reach: Record<ClubId, number>, rnd: () => number): CpuPlan {
  const e = CPU_ERROR[skill];
  const lie = hole.ground.surface(from.x, from.z);
  const pin = hole.spec.pin;
  const toPin = Math.hypot(pin.x - from.x, pin.z - from.z);
  const aimAt = (p: { x: number; z: number }) => Math.atan2(p.x - from.x, -(p.z - from.z));
  const thinking: Course = skill === 'easy' ? { ...course, wind: undefined } : course;
  if (lie === 'green' && toPin <= MAX_PUTT * 1.2) {
    let best = { p: Math.min(1, toPin / MAX_PUTT), a: aimAt(pin), d: Infinity };
    for (let da = -0.12; da <= 0.12 + 1e-9; da += 0.01) {
      for (let p = Math.max(0.02, toPin / MAX_PUTT * 0.6); p <= Math.min(1, toPin / MAX_PUTT * 1.8 + 0.05); p += 0.01) {
        const r = simulate(thinking, from, shotFor(club('putter'), p, aimAt(pin) + da), 20, 1e9);
        // Holed is best; otherwise nearest, with a little preference for past the hole (never up, never in).
        const d = r.phase === 'holed' ? -1 + Math.abs(da) : Math.hypot(r.end[0] - pin.x, r.end[2] - pin.z);
        if (d < best.d) best = { p, a: aimAt(pin) + da, d };
      }
    }
    return {
      club: 'putter',
      aim: best.a + gauss(rnd) * e.puttAim,
      swing: { power: Math.max(0.02, Math.min(1, best.p * (1 + gauss(rnd) * e.putt))), curve: 0 },
    };
  }
  // Targets: the pin, and fairway points further on (for long holes).
  const targets = [pin, ...hole.spec.fairway.filter((p) => Math.hypot(p.x - from.x, p.z - from.z) > 40 && Math.hypot(p.x - pin.x, p.z - pin.z) < toPin)];
  const clubs: ClubId[] = lie === 'tee' ? ['driver', 'wood', 'iron', 'wedge'] : ['wood', 'iron', 'wedge'];
  let best: CpuPlan & { score: number } = { club: 'wedge', aim: aimAt(pin), swing: { power: 0.5, curve: 0 }, score: Infinity };
  for (const t of targets) {
    const dist = Math.hypot(t.x - from.x, t.z - from.z);
    for (const id of clubs) {
      if (reach[id] * lieFactor(lie, id) < dist * 0.55 && id !== 'driver' && id !== 'wood') continue; // far too short
      if (reach[id] > dist * 2.2 && id !== 'wedge') continue; // far too long
      for (let p = 0.3; p <= 1.001; p += 0.07) {
        for (let da = -0.06; da <= 0.06 + 1e-9; da += 0.015) {
          const shot = shotFor(club(id), p, aimAt(t) + da);
          shot.speed *= lieFactor(lie, id);
          const r = simulate(thinking, from, shot, 30, 1e9);
          const end = hole.ground.surface(r.end[0], r.end[2]);
          const left = Math.hypot(r.end[0] - pin.x, r.end[2] - pin.z);
          const score = left + (PENALTY[r.phase] ?? PENALTY[end] ?? 0) + (end === 'green' ? -5 : 0);
          if (score < best.score) best = { club: id, aim: aimAt(t) + da, swing: { power: p, curve: 0 }, score };
        }
      }
    }
  }
  return {
    club: best.club,
    aim: best.aim + gauss(rnd) * e.aim,
    swing: { power: Math.max(0.05, Math.min(1, best.swing.power * (1 + gauss(rnd) * e.power))), curve: Math.max(-1, Math.min(1, gauss(rnd) * e.curve)) },
  };
}
