import { describe, expect, it } from 'vitest';
import { BOOST, makeCar, speedOf, STEP, stepCar } from './car';
import { drive, guideCurve, makeDriver } from './driver';
import { makeScore, pending, SCORE, updateScore } from './drift';
import { keepOnTrack, makeTrack, sampleAhead } from './track';
import { ALL_TRACKS as TRACKS } from './tracks';

/** A car sliding at `deg` degrees and `v` m/s (the velocity off the nose). */
const sliding = (deg: number, v = 20) => {
  const c = makeCar(0, 0, 0);
  c.assist = false;
  const a = (deg * Math.PI) / 180;
  c.vx = Math.cos(a) * v; c.vy = Math.sin(a) * v;
  return c;
};

describe('drift score', () => {
  it('earns degrees × speed / 10 a second while sliding, banked after a moment straight', () => {
    const s = makeScore();
    const c = sliding(30, 20);
    for (let t = 0; t < 1; t += STEP) updateScore(s, c, 0, STEP);
    expect(s.chain).toBeCloseTo(60, -1);
    const straight = sliding(0, 20);
    let event = null;
    for (let t = 0; t < SCORE.link + 0.1 && !event; t += STEP) event = updateScore(s, straight, 0, STEP);
    expect(event).toBe('banked');
    expect(s.total).toBeGreaterThan(55);
    expect(s.chain).toBe(0);
  });

  it('does not count a small angle or a slow slide', () => {
    const s = makeScore();
    for (let t = 0; t < 1; t += STEP) { updateScore(s, sliding(8, 25), 0, STEP); updateScore(s, sliding(40, 6), 0, STEP); }
    expect(s.chain).toBe(0);
  });

  it('links drifts into a multiplier, up to ×5', () => {
    const s = makeScore();
    for (let k = 0; k < 7; k++) {
      for (let t = 0; t < 0.5; t += STEP) updateScore(s, sliding(30), 0, STEP);
      for (let t = 0; t < 0.5; t += STEP) updateScore(s, sliding(0), 0, STEP);
    }
    expect(s.mult).toBe(5);
    const before = pending(s);
    expect(before).toBeCloseTo(s.chain * 5, -1);
  });

  it('loses the chain on a wall hit', () => {
    const s = makeScore();
    for (let t = 0; t < 1; t += STEP) updateScore(s, sliding(30), 0, STEP);
    expect(updateScore(s, sliding(30), 8, STEP)).toBe('lost');
    expect(s.chain).toBe(0);
    expect(s.mult).toBe(1);
    // A soft touch does not.
    for (let t = 0; t < 0.5; t += STEP) updateScore(s, sliding(30), 0, STEP);
    expect(updateScore(s, sliding(30), 1, STEP)).not.toBe('lost');
  });

  it('fills the turbo, which fires as the drift ends and makes the car faster', () => {
    const s = makeScore();
    const c = sliding(35, 25);
    while (s.charge < 1) updateScore(s, c, 0, STEP);
    const straight = sliding(0, 25);
    expect(updateScore(s, straight, 0, STEP)).toBe('turbo');
    expect(straight.boost).toBe(SCORE.boost);
    expect(s.charge).toBe(0);
    // Boosted, the car pulls past its top speed.
    const fast = makeCar(0, 0, 0); fast.vx = 33;
    const slow = makeCar(0, 0, 0); slow.vx = 33;
    fast.boost = 3;
    for (let t = 0; t < 1.5; t += STEP) { stepCar(fast, { throttle: 1, brake: 0, steer: 0, handbrake: false }); stepCar(slow, { throttle: 1, brake: 0, steer: 0, handbrake: false }); }
    expect(speedOf(fast)).toBeGreaterThan(speedOf(slow) + 2);
    expect(speedOf(fast)).toBeLessThan(34 * BOOST + 0.5);
  });
});

describe('guided drift', () => {
  for (const spec of TRACKS) {
    for (const how of ['bends', 'always'] as const) {
      it(`${spec.name}: holding only the handbrake (${how === 'bends' ? 'in the bends' : 'all the way'}), no steering in a drift, laps drifting and never leaves the road`, () => {
        const t = makeTrack(spec);
        const p0 = t.samples[0];
        const car = makeCar(p0.x, p0.y, Math.atan2(p0.ty, p0.tx));
        let place = keepOnTrack(t, car);
        const d = makeDriver();
        let travelled = 0, last = place.along, time = 0, hits = 0, widest = 0, drifting = 0;
        while (travelled < t.length && time < 90) {
          let bend = 0;
          for (let k = 5; k <= 30; k += 5) bend = Math.max(bend, Math.abs(sampleAhead(t, place.index, k).bend));
          const hand = how === 'always' || bend > 1 / 45;
          // Off the handbrake and out of a drift the player steers down the straights (the driver's steering).
          const steer = hand || car.drift ? 0 : drive(d, car, t, place).steer;
          stepCar(car, { throttle: 1, brake: 0, steer, handbrake: hand, guide: guideCurve(car, t, place) });
          place = keepOnTrack(t, car, place.index);
          let st = place.along - last;
          if (st < -t.length / 2) st += t.length;
          travelled += st; last = place.along; time += STEP;
          if (place.hit > 0) hits++;
          if (car.drift) drifting += STEP;
          widest = Math.max(widest, Math.abs(place.side));
        }
        expect(travelled).toBeGreaterThanOrEqual(t.length);
        expect(hits).toBe(0);
        expect(widest).toBeLessThan(t.kerbEdge);
        expect(drifting).toBeGreaterThan(time * 0.4);
      });
    }
  }
});
