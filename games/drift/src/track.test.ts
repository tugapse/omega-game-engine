import { describe, expect, it } from 'vitest';
import { makeCar, STEP, stepCar } from './car';
import { drive, makeDriver } from './driver';
import { keepOnTrack, makeTrack, placeOn, surfaceAt } from './track';
import { ALL_TRACKS as TRACKS } from './tracks';

describe('track', () => {
  // A circle of radius 50 round the origin, driven counter-clockwise from (50, 0).
  const points: [number, number][] = [];
  for (let i = 0; i < 16; i++) points.push([50 * Math.cos((i / 16) * Math.PI * 2), 50 * Math.sin((i / 16) * Math.PI * 2)]);
  const circle = makeTrack({ id: 'circle', name: 'circle', theme: 'city', width: 10, kerb: 1, runoff: 4, points });

  it('samples a closed line about a metre apart, with left normals', () => {
    const t = circle;
    expect(t.length).toBeCloseTo(2 * Math.PI * 50, -1);
    const gaps = t.samples.map((p, i) => { const q = t.samples[(i + 1) % t.samples.length]; return Math.hypot(q.x - p.x, q.y - p.y); });
    expect(Math.max(...gaps)).toBeLessThan(1.1);
    // Counter-clockwise: every bend goes left.
    expect(t.samples.every((p) => p.bend > -1e-3)).toBe(true);
    const p = t.samples[0];
    expect(p.tx * p.nx + p.ty * p.ny).toBeCloseTo(0);
    expect(p.tx * p.ny - p.ty * p.nx).toBeCloseTo(1);
  });

  it('places a point along and across, and tells the surface', () => {
    // 3 m inside the circle is 3 m to the left.
    const near = placeOn(circle, 47 * Math.cos(0.5), 47 * Math.sin(0.5));
    expect(near.side).toBeGreaterThan(2.5);
    expect(near.side).toBeLessThan(3.5);
    expect(surfaceAt(circle, near.side)).toBe('road');
    expect(surfaceAt(circle, 5.5)).toBe('kerb');
    expect(surfaceAt(circle, -8)).toBe('off');
    expect(near.along).toBeCloseTo(25, 0);
    const later = placeOn(circle, 47 * Math.cos(0.52), 47 * Math.sin(0.52), near.index);
    expect(later.along - near.along).toBeCloseTo(1, 0);
  });

  it('bounces a car off the wall and keeps it inside', () => {
    // Heading straight out of the circle at 20 m/s.
    const car = makeCar(52, 0, 0);
    car.vx = 20;
    let place = keepOnTrack(circle, car);
    let hit = 0;
    for (let t = 0; t < 1; t += STEP) {
      stepCar(car, { throttle: 0, brake: 0, steer: 0, handbrake: false });
      place = keepOnTrack(circle, car, place.index);
      hit = Math.max(hit, place.hit);
    }
    expect(hit).toBeGreaterThan(10);
    expect(Math.abs(place.side)).toBeLessThanOrEqual(circle.wall - car.spec.radius + 1e-6);
    expect(car.vx).toBeLessThan(0);
  });

  for (const spec of TRACKS) {
    describe(spec.name, () => {
      const t = makeTrack(spec);

      it('never comes back near itself (walls apart) and has no bend tighter than 12 m', () => {
        const n = t.samples.length;
        for (let i = 0; i < n; i += 2) {
          expect(Math.abs(t.samples[i].bend)).toBeLessThan(1 / 12);
          for (let j = i + 2; j < n; j += 2) {
            const along = Math.min(j - i, n - (j - i)) * (t.length / n);
            if (along < 80) continue;
            expect(Math.hypot(t.samples[i].x - t.samples[j].x, t.samples[i].y - t.samples[j].y)).toBeGreaterThan(2 * t.wall + 4);
          }
        }
      });

      it('is lapped by the driver without leaving the road or touching a wall', () => {
        const p0 = t.samples[0];
        const car = makeCar(p0.x, p0.y, Math.atan2(p0.ty, p0.tx));
        const d = makeDriver();
        let place = keepOnTrack(t, car);
        let travelled = 0, last = place.along, time = 0, widest = 0, hits = 0;
        while (travelled < t.length && time < 120) {
          stepCar(car, drive(d, car, t, place));
          place = keepOnTrack(t, car, place.index);
          let step = place.along - last;
          if (step < -t.length / 2) step += t.length;
          travelled += step;
          last = place.along;
          time += STEP;
          widest = Math.max(widest, Math.abs(place.side));
          if (place.hit > 0) hits++;
        }
        expect(travelled).toBeGreaterThanOrEqual(t.length);
        expect(hits).toBe(0);
        expect(widest).toBeLessThan(t.kerbEdge);
      });
    });
  }
});
