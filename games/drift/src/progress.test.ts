import { describe, expect, it } from 'vitest';
import { addResult, cupOver, CUPS, makeChampionship, playerPlace, POINTS, rivalPaces, table } from './cup';
import {
  carOpen, cupOpen, emptyProgress, lapMedal, loadProgress, medalTotal, pointsMedal, PROGRESS_KEY, recordCup, recordRun, saveProgress,
} from './progress';
import { ALL_TRACKS, TRACKS } from './tracks';
import { makeTrack } from './track';

const mem = () => { const m = new Map<string, string>(); return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) }; };

describe('progress', () => {
  it('gives medals for a lap and for drift points by the track length', () => {
    expect(lapMedal(780, 0)).toBe(0);
    expect(lapMedal(780, 36)).toBe(0);
    expect(lapMedal(780, 35)).toBe(1);
    expect(lapMedal(780, 30)).toBe(2);
    expect(lapMedal(780, 26)).toBe(3);
    expect(pointsMedal(1000, 999)).toBe(0);
    expect(pointsMedal(1000, 2000)).toBe(2);
    expect(pointsMedal(1000, 4000)).toBe(3);
  });

  it('keeps the best, reports new medals, and ignores the reversed tracks', () => {
    const p = emptyProgress();
    expect(recordRun(p, 'avenida', 780, 34, 700)).toEqual([1, 0]);
    expect(recordRun(p, 'avenida', 780, 40, 1000)).toEqual([0, 1]);
    expect(p.tracks.avenida).toEqual({ lap: 34, points: 1000 });
    expect(recordRun(p, 'avenida', 780, 25, null)).toEqual([3, 0]);
    expect(recordRun(p, 'avenida-r', 780, 20, 9999)).toEqual([0, 0]);
    expect(p.tracks['avenida-r']).toBeUndefined();
  });

  it('opens the cars with medals and the cups with a podium', () => {
    expect(carOpen(0, 0)).toBe(true);
    expect(carOpen(3, 1)).toBe(false);
    expect(carOpen(4, 1)).toBe(true);
    const p = emptyProgress();
    const order = CUPS.map((c) => c.theme);
    expect(cupOpen(p, order, 0)).toBe(true);
    expect(cupOpen(p, order, 1)).toBe(false);
    recordCup(p, 'city', 5);
    expect(cupOpen(p, order, 1)).toBe(false);
    recordCup(p, 'city', 3);
    recordCup(p, 'city', 4);
    expect(p.cups.city).toBe(3);
    expect(cupOpen(p, order, 1)).toBe(true);
  });

  it('adds up the medals on all six tracks', () => {
    const p = emptyProgress();
    const lengths = Object.fromEntries(TRACKS.map((t) => [t.id, makeTrack(t).length]));
    for (const t of TRACKS) recordRun(p, t.id, lengths[t.id], 1, lengths[t.id] * 4);
    expect(medalTotal(p, lengths)).toBe(36);
  });

  it('saves and loads, and starts fresh from nonsense', () => {
    const store = mem();
    const p = emptyProgress();
    recordRun(p, 'dunas', 800, 30, 2000);
    recordCup(p, 'city', 1);
    p.car = 'faisca';
    saveProgress(store, p);
    expect(loadProgress(store)).toEqual(p);
    store.setItem(PROGRESS_KEY, '{"tracks":{"dunas":{"lap":"x","points":-3}},"cups":{"city":9},"car":"nope"}');
    expect(loadProgress(store)).toEqual({ ...emptyProgress(), tracks: { dunas: { lap: 0, points: 0 } } });
    store.setItem(PROGRESS_KEY, 'nonsense');
    expect(loadProgress(store)).toEqual(emptyProgress());
  });
});

describe('championship', () => {
  it('has three cups of three races, each on its own place, all tracks known', () => {
    expect(CUPS.length).toBe(3);
    for (const c of CUPS) {
      expect(c.races.length).toBe(3);
      for (const id of c.races) {
        const t = ALL_TRACKS.find((s) => s.id === id)!;
        expect(t.theme).toBe(c.theme);
      }
      expect(c.cars.length).toBe(5);
      const p = rivalPaces(c);
      expect(p[0]).toBeCloseTo(c.pace[0]);
      expect(p[4]).toBeCloseTo(c.pace[1]);
    }
    expect(CUPS[2].pace[0]).toBeGreaterThan(CUPS[0].pace[0]);
  });

  it('adds points by place and ranks the table', () => {
    const c = makeChampionship(0);
    addResult(c, [1, 0, 2, 3, 4, 5]);
    addResult(c, [0, 1, 2, 3, 4, 5]);
    expect(c.points[0]).toBe(POINTS[1] + POINTS[0]);
    expect(c.points[1]).toBe(18);
    // A tie on points: the better last race first.
    expect(table(c).slice(0, 2)).toEqual([0, 1]);
    expect(playerPlace(c)).toBe(1);
    expect(cupOver(c)).toBe(false);
    addResult(c, [5, 4, 3, 2, 1, 0]);
    expect(cupOver(c)).toBe(true);
  });
});
