/** The course: each hole is built where its description says, and each can be played to par. */
import { describe, expect, it } from 'vitest';
import { buildHole, dropPoint, Hole } from './course';
import { HOLES } from './holes';
import { Course, simulate } from './ball';
import { club, ClubId, lieFactor, shotFor } from './clubs';

const holes = HOLES.map(buildHole);
const courseOf = (h: Hole): Course => ({ ground: h.ground, cup: h.spec.pin, trees: h.trees });

/** The best full or part shot from `from` towards the green (as a careful player): end nearest the pin, never wet or out. */
function bestShot(h: Hole, from: { x: number; z: number }): { x: number; z: number } {
  const lie = h.ground.surface(from.x, from.z);
  const aimAt = (p: { x: number; z: number }) => Math.atan2(p.x - from.x, -(p.z - from.z));
  const targets = [h.spec.pin, ...h.spec.fairway.filter((p) => p.z < from.z - 40)];
  let best = { x: from.x, z: from.z }, bestD = Infinity;
  const clubs: ClubId[] = lie === 'tee' ? ['driver', 'wood', 'iron', 'wedge'] : ['wood', 'iron', 'wedge'];
  for (const t of targets) for (const id of clubs) for (let p = 0.3; p <= 1.001; p += 0.1) for (const da of [-0.04, -0.02, 0, 0.02, 0.04]) {
    const shot = shotFor(club(id), p, aimAt(t) + da);
    shot.speed *= lieFactor(lie, id);
    const r = simulate(courseOf(h), from, shot, 30, 1e9);
    if (r.phase === 'water' || r.phase === 'out') continue;
    const d = Math.hypot(r.end[0] - h.spec.pin.x, r.end[2] - h.spec.pin.z);
    if (d < bestD) { bestD = d; best = { x: r.end[0], z: r.end[2] }; }
  }
  return best;
}

describe('course', () => {
  it('has nine holes, par 36', () => {
    expect(HOLES.length).toBe(9);
    expect(HOLES.reduce((s, h) => s + h.par, 0)).toBe(36);
  });

  it('puts every tee, green, fairway, bunker and lake where the description says', () => {
    for (const h of holes) {
      const g = h.ground, s = h.spec;
      expect(g.surface(s.tee.x, s.tee.z)).toBe('tee');
      expect(g.surface(s.pin.x, s.pin.z)).toBe('green');
      for (const b of s.bunkers ?? []) expect(g.surface(b.x, b.z)).toBe('sand');
      for (const w of h.water) if (w.shape.kind === 'lake' && Math.hypot(w.shape.x - s.pin.x, w.shape.z - s.pin.z) > s.green.radius + 4) {
        expect(g.surface(w.shape.x, w.shape.z)).toBe('water');
        expect(g.height(w.shape.x, w.shape.z)).toBeLessThan(w.level);
      }
      for (const t of h.trees) expect(g.surface(t.x, t.z)).toBe('rough');
    }
  });

  it('keeps the island green dry and ringed by water', () => {
    const h = holes[5];
    expect(h.ground.surface(0, -125)).toBe('green');
    expect(h.ground.height(0, -125)).toBeGreaterThan(h.water[0].level);
    expect(h.ground.surface(0, -100)).toBe('water');
  });

  it('a ball short of the lake on hole 2 goes in, and drops back on dry ground', () => {
    const h = holes[1];
    const r = simulate(courseOf(h), h.spec.tee, shotFor(club('wedge'), 0.85, 0));
    expect(r.phase).toBe('water');
    const d = dropPoint(h.ground, h.spec.tee, { x: r.end[0], z: r.end[2] });
    expect(['fairway', 'rough']).toContain(h.ground.surface(d.x, d.z));
    expect(d.z).toBeGreaterThan(r.end[2]);
  });

  it('a trunk sends the ball back', () => {
    const h = holes[0];
    const t = h.trees[0];
    const from = { x: t.x, z: t.z + 30 };
    const r = simulate(courseOf(h), from, { speed: 25, launch: 0.02, direction: 0, backspin: 0, sidespin: 0 });
    expect(r.end[2]).toBeGreaterThan(t.z);
  });

  it('every green can be reached in regulation (par minus two shots) without wind', () => {
    for (const h of holes) {
      let at = { ...h.spec.tee }, shots = 0;
      while (h.ground.surface(at.x, at.z) !== 'green' && shots < h.spec.par) { at = bestShot(h, at); shots++; }
      expect({ hole: h.spec.name, shots, green: h.ground.surface(at.x, at.z) }).toEqual({ hole: h.spec.name, shots: h.spec.par - 2, green: 'green' });
    }
  }, 120_000);
});
