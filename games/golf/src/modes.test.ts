import { describe, expect, it } from 'vitest';
import { HOLES } from './holes';
import { buildHole } from './course';
import { NEAREST, rangePoints, rangeTargets, RANGE_DISTANCES } from './modes';

describe('other games', () => {
  it('puts the range targets on hole 1’s fairway at their distances', () => {
    const t = rangeTargets(HOLES[0]);
    const h = buildHole(HOLES[0]);
    t.forEach((p, i) => {
      expect(Math.hypot(p.x, p.z)).toBeCloseTo(RANGE_DISTANCES[i], -1);
      expect(h.ground.surface(p.x, p.z)).toBe('fairway');
    });
  });
  it('scores the rings of the nearest target', () => {
    const t = [{ x: 0, z: -100 }];
    expect(rangePoints(t, 1, -100)).toBe(50);
    expect(rangePoints(t, 5, -100)).toBe(25);
    expect(rangePoints(t, 0, -112)).toBe(10);
    expect(rangePoints(t, 0, -130)).toBe(0);
  });
  it('plays nearest-the-pin from dry ground', () => {
    for (const c of NEAREST) {
      const h = buildHole(HOLES[c.hole]);
      const from = c.from ?? HOLES[c.hole].tee;
      expect(['tee', 'fairway']).toContain(h.ground.surface(from.x, from.z));
    }
  });
});
