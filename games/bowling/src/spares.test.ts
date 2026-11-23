import { describe, expect, it } from 'vitest';
import { LEAVES, SparesGame } from './spares';
import { Match } from './match';

describe('SparesGame', () => {
  it('ten leaves, hardest last, each set as a rack of only its pins', () => {
    expect(LEAVES.length).toBe(10);
    expect(LEAVES[9].pins).toEqual([7, 10]);
    const g = new SparesGame();
    expect(g.next).toMatchObject({ frame: 0, roll: 0, freshRack: false, pinsLeft: 1, rack: [4] });
  });

  it('scores stars × 10 for a clear and the pins for a miss', () => {
    const g = new SparesGame();
    g.roll(1); // pin 5: cleared, 10
    g.roll(3); // left row, 3 of 4: 3
    expect(g.score).toBe(13);
    expect(g.cleared).toBe(1);
    expect(g.frames()[0].marks).toEqual(['', '/']);
    expect(g.frames()[1].marks).toEqual(['', '3']);
  });

  it('a perfect run scores 240, and each player tries every leave in turn', () => {
    const m = new Match(['A', 'B'], () => new SparesGame());
    while (!m.isOver) m.roll(10); // clamped to the leave's pins
    expect(m.players.map((p) => p.game.score)).toEqual([240, 240]);
  });
});
