import { describe, expect, it } from 'vitest';
import { BowlingGame } from './scoring';

const play = (rolls: number[]) => {
  const g = new BowlingGame();
  rolls.forEach((r) => g.roll(r));
  return g;
};

describe('BowlingGame', () => {
  it('scores a perfect game as 300 in 12 rolls', () => {
    const g = play(Array(12).fill(10));
    expect(g.isOver).toBe(true);
    expect(g.score).toBe(300);
    expect(g.frames()[0]).toEqual({ marks: ['', 'X'], total: 30 });
    expect(g.frames()[9].marks).toEqual(['X', 'X', 'X']);
  });

  it('scores all spares of 5 + 5 with a last 5 as 150', () => {
    const g = play(Array(21).fill(5));
    expect(g.isOver).toBe(true);
    expect(g.score).toBe(150);
    expect(g.frames()[3].marks).toEqual(['5', '/']);
    expect(g.frames()[9].marks).toEqual(['5', '/', '5']);
  });

  it('scores open frames and gutters, with no bonus rolls in the tenth', () => {
    const g = play(Array(20).fill(0).map((_, i) => (i % 2 ? 0 : 9)));
    expect(g.isOver).toBe(true);
    expect(g.score).toBe(90);
    expect(g.frames()[0].marks).toEqual(['9', '-']);
    expect(play(Array(20).fill(0)).score).toBe(0);
  });

  it('waits for the bonus rolls before showing a total', () => {
    const g = play([10, 7]);
    expect(g.frames()[0].total).toBeNull();
    g.roll(2);
    expect(g.frames()[0].total).toBe(19);
    expect(g.frames()[1]).toEqual({ marks: ['7', '2'], total: 28 });
  });

  it('tells what the next roll faces, through the tenth frame', () => {
    const g = play([3]);
    expect(g.next).toEqual({ frame: 0, roll: 1, freshRack: false, pinsLeft: 7 });
    g.roll(9); // clamped to the 7 standing
    expect(g.rolls).toEqual([3, 7]);
    const tenth = play(Array(18).fill(0));
    expect(tenth.next).toEqual({ frame: 9, roll: 0, freshRack: true, pinsLeft: 10 });
    tenth.roll(10);
    expect(tenth.next).toEqual({ frame: 9, roll: 1, freshRack: true, pinsLeft: 10 });
    tenth.roll(4);
    expect(tenth.next).toEqual({ frame: 9, roll: 2, freshRack: false, pinsLeft: 6 });
    tenth.roll(6);
    expect(tenth.isOver).toBe(true);
    expect(tenth.frames()[9]).toEqual({ marks: ['X', '4', '/'], total: 20 });
  });

  it('ends after two rolls in the tenth without a strike or spare', () => {
    const g = play([...Array(18).fill(0), 3, 4]);
    expect(g.isOver).toBe(true);
    g.roll(5);
    expect(g.rolls).toHaveLength(20);
  });
});
