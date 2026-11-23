import { describe, expect, it } from 'vitest';
import { ArcadeGame, levelFor, MAX_LEVEL, roundPoints } from './arcade';
import { Match } from './match';

describe('ArcadeGame', () => {
  it('levels go by pins knocked down and stop at the top', () => {
    expect(levelFor(0)).toBe(1);
    expect(levelFor(11)).toBe(1);
    expect(levelFor(12)).toBe(2);
    expect(levelFor(24)).toBe(3);
    expect(levelFor(100)).toBe(MAX_LEVEL); // a perfect game reaches the top
    expect(levelFor(9999)).toBe(MAX_LEVEL);
  });

  it('multiplies a round by its level, with strike and spare bonuses', () => {
    expect(roundPoints([3, 4], 1)).toBe(7);
    expect(roundPoints([3, 4], 3)).toBe(14); // ×2
    expect(roundPoints([10], 1)).toBe(20); // 10 + 10
    expect(roundPoints([6, 4], 2)).toBe(23); // (10 + 5) × 1.5 → 22.5, rounded
  });

  it('raises the level only between rounds, and never lowers it', () => {
    const g = new ArcadeGame();
    g.roll(8); g.roll(0); // 8 pins
    expect(g.level).toBe(1);
    g.roll(3);
    expect(g.level).toBe(1); // mid-round: the round keeps its level
    g.roll(1); // 12 pins
    expect(g.level).toBe(2);
    g.roll(0); g.roll(0);
    expect(g.level).toBe(2);
  });

  it('plays ten rounds of up to two balls', () => {
    const g = new ArcadeGame();
    for (let i = 0; i < 10; i++) g.roll(10);
    expect(g.isOver).toBe(true);
    expect(g.rolls.length).toBe(10);
    expect(g.frames()[9].marks).toEqual(['', 'X', '']);
    expect(g.frames()[9].total).toBe(g.score);
  });

  it('gives each player their own level in a match (30 pins against a beginner's 10)', () => {
    const m = new Match(['Ana', 'Rui'], () => new ArcadeGame());
    const p1 = [[8, 1], [7, 2], [3, 1], [5, 3]]; // 30 pins
    const p2 = [[2, 1], [3, 0], [1, 1], [1, 1]]; // 10 pins
    for (let r = 0; r < 4; r++) {
      for (const pins of p1[r]) m.roll(pins);
      for (const pins of p2[r]) m.roll(pins);
    }
    const [a, b] = m.players.map((p) => p.game as ArcadeGame);
    expect(a.level).toBe(3);
    expect(b.level).toBe(1);
  });
});
