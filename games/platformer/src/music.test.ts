import { describe, expect, it } from 'vitest';
import { notesAt, TuneName, TUNES } from './music';

describe('music', () => {
  for (const name of Object.keys(TUNES) as TuneName[]) {
    const tune = TUNES[name];
    const loop = tune.bars * 16;
    it(`${name}: loops after its last bar`, () => {
      for (let s = 0; s < loop; s += 3) expect(notesAt(tune, s + loop)).toEqual(notesAt(tune, s));
    });
    it(`${name}: keeps to its key`, () => {
      for (let s = 0; s < loop; s++) for (const n of notesAt(tune, s)) if (n.midi) expect(tune.scale, `${n.voice} ${n.midi} at ${s}`).toContain(n.midi % 12);
    });
    it(`${name}: drums wait a bar, the melody comes in at its bar`, () => {
      const first = Array.from({ length: 16 }, (_, s) => notesAt(tune, s)).flat();
      expect(first.some((n) => ['kick', 'snare', 'hat', 'rim'].includes(n.voice))).toBe(false);
      const before = Array.from({ length: tune.melodyFrom * 16 }, (_, s) => notesAt(tune, s)).flat();
      expect(before.some((n) => n.voice === tune.lead && n.velocity === 0.55)).toBe(false);
      expect(notesAt(tune, tune.melodyFrom * 16).some((n) => n.voice === tune.lead)).toBe(true);
    });
  }
});
