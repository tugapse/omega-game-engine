/** The golf ball: club distances, curve, slopes, surfaces and the cup. */
import { describe, expect, it } from 'vitest';
import { HeightField, Surface } from './terrain';
import { BALL, Course, simulate } from './ball';
import { club, ClubId, MAX_PUTT, shotFor } from './clubs';

/** A flat area of one surface (or a function of position), optionally tilted (rise per metre along x, z). */
function flat(surface: Surface | ((x: number, z: number) => Surface) = 'fairway', tiltX = 0, tiltZ = 0): HeightField {
  return new HeightField(-150, -400, 2, 151, 211, 1)
    .shape((x, z) => tiltX * x + tiltZ * z)
    .paint(typeof surface === 'function' ? surface : () => surface);
}
const far = { x: 0, z: -1e4 };
const play = (ground: HeightField, id: ClubId, power = 1, curve = 0, cup = far, from = { x: 0, z: 0 }, wind?: { x: number; z: number }) =>
  simulate({ ground, cup, wind } as Course, from, shotFor(club(id), power, 0, curve));

describe('golf ball', () => {
  it('each club goes about as far as the plan says (carry plus roll)', () => {
    const g = flat();
    const total = (id: ClubId) => -play(g, id).end[2];
    expect(total('driver')).toBeGreaterThan(215); expect(total('driver')).toBeLessThan(245);
    expect(total('wood')).toBeGreaterThan(178); expect(total('wood')).toBeLessThan(205);
    expect(total('iron')).toBeGreaterThan(140); expect(total('iron')).toBeLessThan(165);
    expect(total('wedge')).toBeGreaterThan(80); expect(total('wedge')).toBeLessThan(100);
  });

  it('a half swing goes roughly half as far', () => {
    const g = flat();
    for (const id of ['driver', 'iron', 'wedge'] as ClubId[]) {
      const ratio = play(g, id, 0.5).end[2] / play(g, id, 1).end[2];
      expect(ratio).toBeGreaterThan(0.45);
      expect(ratio).toBeLessThan(0.65);
    }
  });

  it('a wedge stops near where it lands; a driver runs on', () => {
    const g = flat();
    const run = (id: ClubId) => { const r = play(g, id); return r.carry![2] - r.end[2]; };
    expect(run('wedge')).toBeLessThan(15);
    expect(run('driver')).toBeGreaterThan(20);
  });

  it('sidespin curves the ball: slice right, hook left, more with a driver than a wedge', () => {
    const g = flat();
    const slice = play(g, 'driver', 1, 1).end[0], hook = play(g, 'driver', 1, -1).end[0];
    expect(slice).toBeGreaterThan(18);
    expect(hook).toBeLessThan(-18);
    expect(Math.abs(play(g, 'wedge', 1, 1).end[0])).toBeLessThan(slice / 4);
  });

  it('wind carries the ball', () => {
    const g = flat();
    const still = play(g, 'iron');
    expect(play(g, 'iron', 1, 0, far, { x: 0, z: 0 }, { x: 5, z: 0 }).end[0]).toBeGreaterThan(5);
    expect(play(g, 'iron', 1, 0, far, { x: 0, z: 0 }, { x: 0, z: 5 }).end[2]).toBeGreaterThan(still.end[2] + 8); // headwind: shorter
  });

  it('rough and sand keep the ball short; water stops it', () => {
    const run = (s: Surface) => { const r = play(flat(s), 'iron'); return r.carry![2] - r.end[2]; };
    expect(run('rough')).toBeLessThan(run('fairway') * 0.6);
    expect(run('sand')).toBeLessThan(3);
    const wet = play(flat((x, z) => (z < -100 ? 'water' : 'fairway')), 'iron');
    expect(wet.phase).toBe('water');
  });

  it('rolls down a slope and stops on the flat', () => {
    // A ball set rolling across a slope drifts downhill (towards -x here).
    const g = flat('green', 0.03, 0);
    const r = simulate({ ground: g, cup: far }, { x: 0, z: 0 }, shotFor(club('putter'), 0.5, 0));
    expect(r.end[0]).toBeLessThan(-0.5);
    expect(r.phase).toBe('rest');
  });

  it('a putt rolls about as far as its power says on a flat green', () => {
    const g = flat('green');
    for (const p of [0.25, 0.5, 1]) {
      const r = simulate({ ground: g, cup: far }, { x: 0, z: 0 }, shotFor(club('putter'), p, 0));
      expect(Math.abs(-r.end[2] - p * MAX_PUTT)).toBeLessThan(0.6);
    }
  });

  it('a putt at the cup drops in when it is slow enough, and lips over when it is too fast', () => {
    const g = flat('green');
    const cup = { x: 0, z: -5 };
    const soft = simulate({ ground: g, cup }, { x: 0, z: 0 }, shotFor(club('putter'), 6 / MAX_PUTT, 0));
    expect(soft.phase).toBe('holed');
    const hard = simulate({ ground: g, cup }, { x: 0, z: 0 }, shotFor(club('putter'), 1, 0));
    expect(hard.phase).toBe('rest');
    expect(-hard.end[2]).toBeGreaterThan(10);
  });

  it('off the ground is out of bounds', () => {
    const g = flat((x) => (x > 10 ? 'out' : 'fairway'));
    expect(play(g, 'driver', 1, 1).phase).toBe('out');
  });

  it('settles on the ground, not in it', () => {
    const r = play(flat(), 'wood');
    expect(r.end[1]).toBeCloseTo(BALL.radius, 3);
  });
});
