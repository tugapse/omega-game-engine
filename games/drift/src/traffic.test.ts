import { describe, expect, it } from 'vitest';
import { makeCar, STEP, stepCar } from './car';
import { CARS } from './cars';
import { guideCurve, makeRival, rivalDrive } from './driver';
import { held, makeRace, standings, updateRace } from './race';
import { keepOnTrack, makeTrack, Place } from './track';
import { TRACKS } from './tracks';
import { BODY, collide } from './traffic';

describe('traffic', () => {
  it('pushes two overlapping cars apart and bounces them', () => {
    const a = makeCar(0, 0, 0), b = makeCar(2.5, 0, Math.PI);
    a.vx = 10; b.vx = -10;
    const hits = collide([a, b]);
    expect(hits[0]).toBeGreaterThan(15);
    expect(a.vx).toBeLessThan(0);
    expect(b.vx).toBeGreaterThan(0);
    // Nose to nose they are apart now.
    const gap = Math.abs((a.x + BODY.along) - (b.x - BODY.along));
    expect(gap).toBeGreaterThanOrEqual(BODY.radius * 2 - 1e-6);
  });

  it('leaves cars apart alone', () => {
    const a = makeCar(0, 0, 0), b = makeCar(0, 3, 0);
    a.vx = 10;
    expect(collide([a, b])).toEqual([0, 0]);
    expect(a.vx).toBe(10);
  });

  it('a heavier car is pushed less', () => {
    const light = makeCar(0, 0, 0, CARS[1].spec), heavy = makeCar(1.8, 0, 0, CARS[2].spec);
    light.vx = 8;
    collide([light, heavy]);
    expect(Math.abs(heavy.vx)).toBeLessThan(Math.abs(light.vx - 8));
  });
});

describe('cars', () => {
  it('each is faster than the one before at the top', () => {
    const tops = CARS.map((m) => m.spec.top);
    for (let i = 1; i < tops.length; i++) expect(tops[i]).toBeGreaterThan(tops[i - 1]);
  });
  for (const model of CARS) {
    it(`${model.name} laps every track drifting with the guide, never off the road`, () => {
      for (const spec of TRACKS) {
        const t = makeTrack(spec);
        const p0 = t.samples[0];
        const car = makeCar(p0.x, p0.y, Math.atan2(p0.ty, p0.tx), model.spec);
        let place = keepOnTrack(t, car);
        const r = makeRival(1, 0);
        let travelled = 0, last = place.along, time = 0, widest = 0, hits = 0;
        while (travelled < t.length && time < 90) {
          stepCar(car, rivalDrive(r, car, t, place, []));
          place = keepOnTrack(t, car, place.index);
          let st = place.along - last;
          if (st < -t.length / 2) st += t.length;
          travelled += st; last = place.along; time += STEP;
          widest = Math.max(widest, Math.abs(place.side));
          if (place.hit > 0) hits++;
        }
        expect(travelled, spec.name).toBeGreaterThanOrEqual(t.length);
        expect(hits, spec.name).toBe(0);
        expect(widest, spec.name).toBeLessThan(t.kerbEdge);
      }
    });
  }
});

describe('a race against five rivals', () => {
  for (const spec of TRACKS) {
    it(`${spec.name}: all six finish two laps, bumping now and then, never stuck`, () => {
      const t = makeTrack(spec);
      const n = t.samples.length;
      const cars = Array.from({ length: 6 }, (_, i) => {
        const p = t.samples[(n - 6 - Math.floor(i / 2) * 8) % n];
        const side = i % 2 ? -3 : 3;
        return makeCar(p.x + p.nx * side, p.y + p.ny * side, Math.atan2(p.ty, p.tx), CARS[i % 4].spec);
      });
      const rivals = cars.map((_, i) => makeRival(0.5 + i * 0.1, [-3, 3, 0, -2, 2, -1][i]));
      let places: (Place & { hit: number })[] = cars.map((c) => keepOnTrack(t, c));
      const races = places.map((p) => makeRace(t.length, 2, p.along));
      let wallHits = 0;
      for (let time = 0; time < 160 && races.some((r) => r.phase !== 'done'); time += STEP) {
        cars.forEach((c, i) => {
          const others = cars.filter((_, j) => j !== i).map((o, k) => ({ car: o, place: places[k >= i ? k + 1 : k] }));
          stepCar(c, held(races[i]) ? { throttle: 0, brake: 0, steer: 0, handbrake: false } : rivalDrive(rivals[i], c, t, places[i], others));
        });
        collide(cars);
        places = cars.map((c, i) => keepOnTrack(t, c, places[i].index));
        places.forEach((p, i) => { updateRace(races[i], p.along, STEP); if (p.hit > 3) wallHits++; });
      }
      expect(races.every((r) => r.phase === 'done')).toBe(true);
      expect(wallHits).toBeLessThan(40);
      const order = standings(races);
      expect(new Set(order).size).toBe(6);
      void guideCurve;
    });
  }
});
