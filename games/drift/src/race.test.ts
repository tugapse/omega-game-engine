import { describe, expect, it } from 'vitest';
import { makeCar, STEP, stepCar } from './car';
import { drive, makeDriver } from './driver';
import {
  currentLap, formatDelta, formatTime, ghostAt, held, lights, LIGHTS, makeRace, readGhost, Recorder, updateRace,
} from './race';
import { keepOnTrack, makeTrack } from './track';
import { TRACKS } from './tracks';

describe('race', () => {
  const L = 100;
  const go = (r: ReturnType<typeof makeRace>) => { while (held(r)) updateRace(r, r.along, 0.1); };

  it('holds the car through three reds, then goes green', () => {
    const r = makeRace(L, 2, 95);
    expect(lights(r)).toEqual({ red: 0, green: false });
    updateRace(r, 95, LIGHTS.each * 1.5);
    expect(lights(r).red).toBe(1);
    updateRace(r, 95, LIGHTS.each * 2);
    expect(lights(r).red).toBe(3);
    expect(held(r)).toBe(true);
    expect(updateRace(r, 95, LIGHTS.each)).toBe('go');
    expect(held(r)).toBe(false);
    expect(lights(r).green).toBe(true);
  });

  it('counts a lap only once the whole track is driven, across the line', () => {
    const r = makeRace(L, 2, 95);
    go(r);
    const events: string[] = [];
    let along = 95;
    // Round once in 1 m steps, 0.1 s each.
    for (let i = 0; i < 105; i++) {
      along = (along + 1) % L;
      const e = updateRace(r, along, 0.1);
      if (e) events.push(e);
    }
    expect(events).toEqual(['best']);
    expect(r.times.length).toBe(1);
    expect(r.times[0]).toBeCloseTo(10.5 - 0.5, 0);
    expect(currentLap(r)).toBe(2);
  });

  it('does not count going back and forth over the line', () => {
    const r = makeRace(L, 1, 95);
    go(r);
    for (let k = 0; k < 20; k++) { updateRace(r, 1, 0.1); updateRace(r, 98, 0.1); }
    expect(r.times.length).toBe(0);
    expect(r.checks).toBe(0);
  });

  it('finishes after the last lap, with the total and the best', () => {
    const r = makeRace(L, 2, 0);
    go(r);
    const events: string[] = [];
    let along = 0;
    for (let i = 0; i < 300 && r.phase !== 'done'; i++) {
      along = (along + (i < 100 ? 1 : 2)) % L;
      const e = updateRace(r, along, 0.1);
      if (e) events.push(e);
    }
    expect(events).toEqual(['best', 'finish']);
    expect(r.times[1]).toBeLessThan(r.times[0]);
    expect(r.total).toBeCloseTo(r.times[0] + r.times[1], 5);
    // Nothing moves once done.
    expect(updateRace(r, 50, 1)).toBe(null);
  });

  it('a lap slower than the record to beat is not a best', () => {
    const r = makeRace(L, 3, 0);
    go(r);
    let e = null, along = 0;
    while (!e) { along = (along + 1) % L; e = updateRace(r, along, 0.1, 5); }
    expect(e).toBe('lap');
  });

  it('formats times', () => {
    expect(formatTime(62.345)).toBe('1:02.35');
    expect(formatTime(9.5)).toBe('0:09.50');
    expect(formatTime(Infinity)).toBe('–:––.––');
    expect(formatDelta(-0.5)).toBe('−0.50');
    expect(formatDelta(1.25)).toBe('+1.25');
  });

  it('records a ghost and plays it back between samples', () => {
    const rec = new Recorder();
    rec.begin(0);
    for (let t = 0; t <= 2; t += STEP) rec.add(t, t * 10, 5, 0.1 * t);
    const g = rec.finish(2);
    const p = ghostAt(g, 1.01)!;
    // Sampled on the first step due, so up to a step (0.08 m here) behind.
    expect(Math.abs(p.x - 10.1)).toBeLessThan(0.1);
    expect(p.y).toBeCloseTo(5, 2);
    expect(p.heading).toBeCloseTo(0.101, 2);
    expect(ghostAt(g, 3)).toBe(null);
    expect(readGhost(JSON.stringify(g))).toEqual(g);
    expect(readGhost('{"time":1,"data":[1,2]}')).toBe(null);
    expect(readGhost('nonsense')).toBe(null);
  });

  it('the driver finishes a race on every track', () => {
    for (const spec of TRACKS) {
      const t = makeTrack(spec);
      const back = t.samples[t.samples.length - 6];
      const car = makeCar(back.x, back.y, Math.atan2(back.ty, back.tx));
      let place = keepOnTrack(t, car);
      const r = makeRace(t.length, 2, place.along);
      const d = makeDriver();
      for (let time = 0; time < 200 && r.phase !== 'done'; time += STEP) {
        stepCar(car, held(r) ? { throttle: 0, brake: 1, steer: 0, handbrake: false } : drive(d, car, t, place));
        place = keepOnTrack(t, car, place.index);
        updateRace(r, place.along, STEP);
      }
      expect(r.phase, spec.name).toBe('done');
      expect(r.times.length).toBe(2);
      // The second lap is a flying lap: no slower than the standing first.
      expect(r.times[1]).toBeLessThan(r.times[0] + 0.5);
    }
  });
});
