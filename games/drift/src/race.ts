// A race on a track: the start lights, the laps (counted from the distance
// driven along the track, so a lap only counts once every part of it has been
// driven, in order), the lap times and the finish. And the ghost: a lap
// recorded 30 times a second, replayed beside the car. No engine, so it is
// tested in Node.

/** How long (s) each start light takes: three reds, then green. */
export const LIGHTS = { each: 0.8, count: 3 };
/** Checkpoints per lap: a lap counts once all of them are passed in order. */
export const CHECKPOINTS = 8;

export type RacePhase = 'lights' | 'racing' | 'done';

export interface Race {
  laps: number;
  length: number;
  phase: RacePhase;
  /** Time since the lights started (s); the race clock is `clock - start`. */
  clock: number;
  start: number;
  /** Distance driven along the track since the start line (m), and the most of it reached. */
  covered: number;
  best: number;
  /** The last place along the track (m), to follow the car across the line. */
  along: number;
  /** Checkpoints passed (0 to CHECKPOINTS × laps). */
  checks: number;
  /** Each finished lap's time (s), and when the current lap began (race clock). */
  times: number[];
  lapStart: number;
  /** The race time when it finished (s). */
  total: number;
}

/** A race of `laps` laps; the car starts `behind` metres before the line (at `along`). */
export function makeRace(length: number, laps: number, along: number): Race {
  let covered = along;
  if (covered > length / 2) covered -= length;
  return { laps, length, phase: 'lights', clock: 0, start: LIGHTS.each * (LIGHTS.count + 1), covered, best: covered, along, checks: 0, times: [], lapStart: 0, total: 0 };
}

/** The race clock (s): 0 until the green light. */
export const raceTime = (r: Race) => Math.max(0, r.clock - r.start);

/** How many reds are lit (0 to 3), and whether it is green. */
export function lights(r: Race): { red: number; green: boolean } {
  if (r.phase !== 'lights') return { red: 0, green: r.clock - r.start < 1.2 };
  return { red: Math.min(LIGHTS.count, Math.floor(r.clock / LIGHTS.each)), green: false };
}

/** The lap being driven (1 to laps). */
export const currentLap = (r: Race) => Math.min(r.laps, r.times.length + 1);

/** Whether the car must wait (the lights are on). */
export const held = (r: Race) => r.phase === 'lights';

export type RaceEvent = 'go' | 'lap' | 'best' | 'finish' | null;

/**
 * Moves the race on by `dt` with the car now at `along` (m along the track).
 * `lapBest` is the best lap to beat (for the 'best' event). Returns what happened.
 */
export function updateRace(r: Race, along: number, dt: number, lapBest = Infinity): RaceEvent {
  r.clock += dt;
  let step = along - r.along;
  if (step < -r.length / 2) step += r.length;
  if (step > r.length / 2) step -= r.length;
  r.along = along;
  if (r.phase === 'lights') {
    if (r.clock >= r.start) { r.phase = 'racing'; return 'go'; }
    return null;
  }
  if (r.phase === 'done') return null;
  r.covered += step;
  r.best = Math.max(r.best, r.covered);
  const every = r.length / CHECKPOINTS;
  let event: RaceEvent = null;
  while (r.checks < r.laps * CHECKPOINTS && r.best >= (r.checks + 1) * every) {
    r.checks++;
    if (r.checks % CHECKPOINTS === 0) {
      const t = raceTime(r);
      const lap = t - r.lapStart;
      const before = Math.min(lapBest, ...r.times);
      r.times.push(lap);
      r.lapStart = t;
      event = lap < before ? 'best' : 'lap';
      if (r.times.length >= r.laps) {
        r.phase = 'done';
        r.total = t;
        return 'finish';
      }
    }
  }
  return event;
}

/** How far round the race the car is (m): for the positions. */
export const progress = (r: Race) => r.best;

/** The best lap so far in this race (Infinity before one). */
export const bestLap = (r: Race) => Math.min(Infinity, ...r.times);

/** A time as m:ss.cc (or ss.cc under a minute). */
export function formatTime(t: number): string {
  if (!isFinite(t)) return '–:––.––';
  const cs = Math.round(t * 100);
  const m = Math.floor(cs / 6000), s = Math.floor((cs % 6000) / 100), c = cs % 100;
  return `${m}:${String(s).padStart(2, '0')}.${String(c).padStart(2, '0')}`;
}

/** A difference as +s.cc or −s.cc. */
export const formatDelta = (d: number) => `${d < 0 ? '−' : '+'}${Math.abs(d).toFixed(2)}`;

// The ghost.

/** Samples per second, and how each is kept: x, y in cm and the heading in milliradians. */
export const GHOST_RATE = 30;

export interface Ghost {
  /** The lap time (s), and the samples, flat: x, y, heading, x, y, heading, ... */
  time: number;
  data: number[];
}

/** Records a lap as it is driven. */
export class Recorder {
  private data: number[] = [];
  private next = 0;
  /** Starts a new lap at race time `t`. */
  begin(t: number): void { this.data = []; this.next = t; this.start = t; }
  start = 0;
  /** Adds the car's place if a sample is due at race time `t`. */
  add(t: number, x: number, y: number, heading: number): void {
    while (t >= this.next) {
      this.data.push(Math.round(x * 100), Math.round(y * 100), Math.round(heading * 1000));
      this.next += 1 / GHOST_RATE;
    }
  }
  /** The lap so far as a ghost of `time` s. */
  finish(time: number): Ghost { return { time, data: this.data.slice() }; }
}

/** Where the ghost is `t` s into its lap (null after it ends). */
export function ghostAt(g: Ghost, t: number): { x: number; y: number; heading: number } | null {
  const n = g.data.length / 3;
  if (n < 2 || t < 0) return null;
  const f = t * GHOST_RATE;
  const i = Math.floor(f);
  if (i >= n - 1) return null;
  const k = f - i, a = i * 3, b = a + 3, d = g.data;
  let dh = (d[b + 2] - d[a + 2]) / 1000;
  dh = Math.atan2(Math.sin(dh), Math.cos(dh));
  return {
    x: (d[a] + (d[b] - d[a]) * k) / 100,
    y: (d[a + 1] + (d[b + 1] - d[a + 1]) * k) / 100,
    heading: d[a + 2] / 1000 + dh * k,
  };
}

/** Reads a kept ghost; anything unreadable is none. */
export function readGhost(text: string | null): Ghost | null {
  try {
    const g = JSON.parse(text ?? 'null');
    if (!g || typeof g.time !== 'number' || !Array.isArray(g.data) || g.data.length % 3 || !g.data.every((v: unknown) => typeof v === 'number')) return null;
    return { time: g.time, data: g.data };
  } catch {
    return null;
  }
}

/** The racers in race order (their indices): those finished by time, then the rest by how far round they are. */
export function standings(races: Race[]): number[] {
  return races.map((_, i) => i).sort((i, j) => {
    const a = races[i], b = races[j];
    const da = a.phase === 'done', db = b.phase === 'done';
    if (da && db) return a.total - b.total;
    if (da !== db) return da ? -1 : 1;
    return b.best - a.best;
  });
}
