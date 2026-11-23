import { describe, expect, it, vi } from 'vitest';

vi.hoisted(() => {
  (globalThis as any).WebGL2RenderingContext ??= new Proxy({}, { get: () => 0 });
});
import { emptyProgress, loadProgress, PROGRESS_KEY, recordClear, saveProgress, totals, unlocked } from './progress';

const memory = () => {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => { m.set(k, v); }, m };
};

describe('progress', () => {
  it('starts fresh, with only the first level open', () => {
    const p = loadProgress(memory(), 9);
    expect(p).toEqual(emptyProgress(9));
    expect(unlocked(p, 0)).toBe(true);
    expect(unlocked(p, 1)).toBe(false);
  });
  it('a cleared level opens the next, keeps the best score and adds the big coins found', () => {
    const p = emptyProgress(9);
    recordClear(p, 0, 5000, [true, false, false]);
    recordClear(p, 0, 3000, [false, false, true]);
    expect(p[0]).toEqual({ done: true, big: [true, false, true], best: 5000 });
    expect(unlocked(p, 1)).toBe(true);
    expect(unlocked(p, 2)).toBe(false);
    expect(totals(p)).toEqual({ done: 1, big: 2, bigOf: 27, score: 5000 });
  });
  it('is saved and read back, and survives a broken or missing store', () => {
    const store = memory();
    const p = emptyProgress(9);
    recordClear(p, 3, 1234, [false, true, false]);
    saveProgress(store, p);
    expect(loadProgress(store, 9)).toEqual(p);
    store.m.set(PROGRESS_KEY, '{not json');
    expect(loadProgress(store, 9)).toEqual(emptyProgress(9));
    store.m.set(PROGRESS_KEY, JSON.stringify([{ done: 'yes', big: [1, true], best: -4 }]));
    expect(loadProgress(store, 9)[0]).toEqual({ done: false, big: [false, true, false], best: 0 });
    expect(loadProgress(null, 9)).toEqual(emptyProgress(9));
    const throwing = { getItem: () => { throw new Error('denied'); }, setItem: () => { throw new Error('denied'); } };
    expect(loadProgress(throwing, 9)).toEqual(emptyProgress(9));
    expect(() => saveProgress(throwing, p)).not.toThrow();
  });
});
