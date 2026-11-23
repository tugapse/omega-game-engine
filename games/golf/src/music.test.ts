import { describe, expect, it } from 'vitest';
import { MUSIC, notesAt } from './music';

const D_MAJOR = [2, 4, 6, 7, 9, 11, 1]; // pitch classes of D E F# G A B C#

describe('background music', () => {
  const loop = MUSIC.bars * MUSIC.stepsPerBar;
  it('loops: the same notes come back after the last bar', () => {
    for (let s = 0; s < loop; s += 5) expect(notesAt(s + loop)).toEqual(notesAt(s));
  });
  it('stays in D major', () => {
    for (let s = 0; s < loop; s++) for (const n of notesAt(s)) if (n.midi) expect(D_MAJOR).toContain(n.midi % 12);
  });
  it('starts gently: no drums in the first two bars, the melody from bar 4', () => {
    const first = Array.from({ length: 2 * MUSIC.stepsPerBar }, (_, s) => notesAt(s)).flat();
    expect(first.some((n) => n.voice === 'kick' || n.voice === 'shaker')).toBe(false);
    const early = Array.from({ length: 4 * MUSIC.stepsPerBar }, (_, s) => notesAt(s)).flat();
    expect(early.some((n) => n.voice === 'bell')).toBe(false);
    expect(notesAt(4 * MUSIC.stepsPerBar).some((n) => n.voice === 'bell')).toBe(true);
  });
});
