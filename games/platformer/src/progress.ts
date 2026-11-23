// What the player has done, kept in the browser between visits: each level
// finished or not, its big coins found and its best score. A level opens once
// the one before it is finished. No engine, so it is tested in Node.
import { BIG_COINS } from './world';

export interface LevelProgress {
  done: boolean;
  big: boolean[];
  best: number;
}

/** Where it is kept (localStorage, or a stand-in in tests). */
export interface Store {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export const PROGRESS_KEY = 'omega-run-progress';

export function emptyProgress(levels: number): LevelProgress[] {
  return Array.from({ length: levels }, () => ({ done: false, big: Array<boolean>(BIG_COINS).fill(false), best: 0 }));
}

/** Reads the progress; anything missing or unreadable starts fresh. */
export function loadProgress(store: Store | null, levels: number): LevelProgress[] {
  const fresh = emptyProgress(levels);
  try {
    const saved = JSON.parse(store?.getItem(PROGRESS_KEY) ?? 'null');
    if (!Array.isArray(saved)) return fresh;
    return fresh.map((p, i) => {
      const s = saved[i];
      if (!s || typeof s !== 'object') return p;
      return {
        done: s.done === true,
        big: p.big.map((_, k) => Array.isArray(s.big) && s.big[k] === true),
        best: typeof s.best === 'number' && s.best > 0 ? Math.floor(s.best) : 0,
      };
    });
  } catch {
    return fresh;
  }
}

export function saveProgress(store: Store | null, progress: LevelProgress[]): void {
  try { store?.setItem(PROGRESS_KEY, JSON.stringify(progress)); } catch { /* private mode, or full: keep playing */ }
}

/** Records a finished level: done, the big coins found (added to those found before), the best score. */
export function recordClear(progress: LevelProgress[], level: number, score: number, big: boolean[]): void {
  const p = progress[level];
  p.done = true;
  p.best = Math.max(p.best, score);
  big.forEach((t, i) => { if (t) p.big[i] = true; });
}

/** Whether a level can be played: the first always, the others once the one before is finished. */
export function unlocked(progress: LevelProgress[], level: number): boolean {
  return level === 0 || !!progress[level - 1]?.done;
}

export function totals(progress: LevelProgress[]): { done: number; big: number; bigOf: number; score: number } {
  return {
    done: progress.filter((p) => p.done).length,
    big: progress.reduce((n, p) => n + p.big.filter(Boolean).length, 0),
    bigOf: progress.length * BIG_COINS,
    score: progress.reduce((n, p) => n + p.best, 0),
  };
}
