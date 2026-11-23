// What the player has won, kept in the browser: on each track the best lap
// and the most drift points in a race, and the medals they earn; the best
// place in each cup; the car chosen. Medals open the other cars, and a podium
// in a cup opens the next. No engine, so it is tested in Node.
import { CARS } from './cars';
import { ThemeName } from './themes';
import { TRACKS } from './tracks';

export interface TrackRecord {
  /** Best lap (s), or 0 for none; most drift points in one race. */
  lap: number;
  points: number;
}

export interface Progress {
  tracks: Record<string, TrackRecord>;
  /** Best place (1 to 6) in each cup, 0 for not finished. */
  cups: Record<ThemeName, number>;
  car: string;
}

export interface Store { getItem(key: string): string | null; setItem(key: string, value: string): void }

export const PROGRESS_KEY = 'omega-drift-progress';

/** Medal targets from the track's length L (m): a lap faster than L/22, L/26, L/30 s; drift points in a race past L, 2L, 3.5L. */
export const MEDALS = { lap: [22, 26, 30], points: [1, 2, 3.5] };

/** 0 none, 1 bronze, 2 silver, 3 gold. */
export function lapMedal(length: number, lap: number): number {
  if (!(lap > 0)) return 0;
  return MEDALS.lap.filter((v) => lap <= length / v).length;
}

export function pointsMedal(length: number, points: number): number {
  return MEDALS.points.filter((k) => points >= length * k).length;
}

/** The medals' value a car needs to open: Bolinha always, then 4, 12 and 22 (of 36: gold is 3, silver 2, bronze 1). */
export const CAR_NEEDS = [0, 4, 12, 22];

export function emptyProgress(): Progress {
  return { tracks: {}, cups: { city: 0, desert: 0, snow: 0 }, car: CARS[0].id };
}

export function loadProgress(store: Store | null): Progress {
  const p = emptyProgress();
  try {
    const s = JSON.parse(store?.getItem(PROGRESS_KEY) ?? 'null');
    if (!s || typeof s !== 'object') return p;
    for (const t of TRACKS) {
      const r = s.tracks?.[t.id];
      if (r && typeof r === 'object') p.tracks[t.id] = { lap: typeof r.lap === 'number' && r.lap > 0 ? r.lap : 0, points: typeof r.points === 'number' && r.points > 0 ? Math.floor(r.points) : 0 };
    }
    for (const k of Object.keys(p.cups) as ThemeName[]) {
      const v = s.cups?.[k];
      if (typeof v === 'number' && v >= 1 && v <= 6) p.cups[k] = Math.floor(v);
    }
    if (typeof s.car === 'string' && CARS.some((c) => c.id === s.car)) p.car = s.car;
  } catch { /* unreadable: fresh */ }
  return p;
}

export function saveProgress(store: Store | null, p: Progress): void {
  try { store?.setItem(PROGRESS_KEY, JSON.stringify(p)); } catch { /* private mode, or full */ }
}

const record = (p: Progress, id: string) => (p.tracks[id] ??= { lap: 0, points: 0 });

/**
 * Records a lap and a race's drift points on a track (only the six count, not
 * the reversed ones). Returns the medals it newly earned: [lap, points], each
 * the new medal or 0 if no better than before.
 */
export function recordRun(p: Progress, id: string, length: number, lap: number, points: number | null): [number, number] {
  if (!TRACKS.some((t) => t.id === id)) return [0, 0];
  const r = record(p, id);
  const lapBefore = lapMedal(length, r.lap), ptsBefore = pointsMedal(length, r.points);
  if (lap > 0 && (!r.lap || lap < r.lap)) r.lap = lap;
  if (points !== null && points > r.points) r.points = Math.floor(points);
  const lapNow = lapMedal(length, r.lap), ptsNow = pointsMedal(length, r.points);
  return [lapNow > lapBefore ? lapNow : 0, ptsNow > ptsBefore ? ptsNow : 0];
}

/** The medals on a track: [lap, points]. */
export function medalsOn(p: Progress, id: string, length: number): [number, number] {
  const r = p.tracks[id];
  return r ? [lapMedal(length, r.lap), pointsMedal(length, r.points)] : [0, 0];
}

/** All the medals' value (gold 3, silver 2, bronze 1); `lengths` maps each track to its length. */
export function medalTotal(p: Progress, lengths: Record<string, number>): number {
  let n = 0;
  for (const t of TRACKS) { const [a, b] = medalsOn(p, t.id, lengths[t.id] ?? 0); n += a + b; }
  return n;
}

export const carOpen = (total: number, index: number) => total >= CAR_NEEDS[index];

/** A cup opens once the one before it is finished on the podium. */
export function cupOpen(p: Progress, order: ThemeName[], index: number): boolean {
  if (index === 0) return true;
  const before = p.cups[order[index - 1]];
  return before >= 1 && before <= 3;
}

export function recordCup(p: Progress, theme: ThemeName, place: number): void {
  if (!p.cups[theme] || place < p.cups[theme]) p.cups[theme] = place;
}
