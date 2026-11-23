import { describe, expect, it } from 'vitest';
import { buildHole, TEST_HOLE } from './course';
import { simulate } from './ball';
import { club, shotFor } from './clubs';

describe('test hole', () => {
  const hole = buildHole(TEST_HOLE);
  it('has its tee, fairway and green where the description puts them', () => {
    expect(hole.ground.surface(TEST_HOLE.tee.x, TEST_HOLE.tee.z)).toBe('tee');
    expect(hole.ground.surface(0, -140)).toBe('fairway');
    expect(hole.ground.surface(TEST_HOLE.pin.x, TEST_HOLE.pin.z)).toBe('green');
    expect(hole.ground.surface(-45, -140)).toBe('rough');
  });
  it('can be reached in two: a driver down the fairway, then an iron onto the green', () => {
    const course = { ground: hole.ground, cup: TEST_HOLE.pin };
    const drive = simulate(course, TEST_HOLE.tee, shotFor(club('driver'), 1, -0.005));
    expect(hole.ground.surface(drive.end[0], drive.end[2])).toBe('fairway');
    const to = { x: TEST_HOLE.pin.x - drive.end[0], z: TEST_HOLE.pin.z - drive.end[2] };
    const dist = Math.hypot(to.x, to.z);
    const aim = Math.atan2(to.x, -to.z);
    // Some power of iron finds the green near the pin, as a player would by trying.
    let best = Infinity;
    for (let p = 0.5; p <= 1; p += 0.02) {
      const r = simulate(course, { x: drive.end[0], z: drive.end[2] }, shotFor(club('iron'), p, aim));
      if (hole.ground.surface(r.end[0], r.end[2]) === 'green') best = Math.min(best, Math.hypot(r.end[0] - TEST_HOLE.pin.x, r.end[2] - TEST_HOLE.pin.z));
    }
    expect(dist).toBeGreaterThan(80);
    expect(best).toBeLessThan(6);
  });
});
