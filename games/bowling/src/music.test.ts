import { describe, expect, it, vi } from 'vitest';

vi.hoisted(() => {
  (globalThis as any).WebGL2RenderingContext ??= new Proxy({}, { get: () => 0 });
});
import { MUSIC, notesAt } from './music';

const LOOP = MUSIC.stepsPerBar * 16;
const bar = (b: number, s = 0) => b * MUSIC.stepsPerBar + s;

describe('background music', () => {
  it('loops every 16 bars, note for note', () => {
    for (let step = 0; step < LOOP; step += 7) expect(notesAt(step + LOOP)).toEqual(notesAt(step));
  });
  it('plays the chord root in the bass on every downbeat (F, D, G, C, Bb, A, G, C)', () => {
    const roots = Array.from({ length: 8 }, (_, b) => notesAt(bar(b)).find((n) => n.voice === 'bass')!.midi % 12);
    expect(roots).toEqual([5, 2, 7, 0, 10, 9, 7, 0]);
  });
  it('keeps the melody in the F major scale, with a rest every fourth bar', () => {
    const scale = new Set([5, 7, 9, 10, 0, 2, 4]); // F G A Bb C D E
    const melody = Array.from({ length: LOOP }, (_, s) => notesAt(s)).flat().filter((n) => n.voice === 'vibes');
    expect(melody.length).toBeGreaterThan(20);
    for (const n of melody) expect(scale.has(n.midi % 12)).toBe(true);
    for (let s = 0; s < MUSIC.stepsPerBar; s++) expect(notesAt(bar(3, s)).some((n) => n.voice === 'vibes')).toBe(false);
  });
});
