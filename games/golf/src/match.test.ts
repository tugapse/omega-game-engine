import { describe, expect, it } from 'vitest';
import { formatToPar, GolfMatch, MAX_STROKES } from './match';

describe('golf match', () => {
  it('plays each hole player by player, then the next hole', () => {
    const m = new GolfMatch(['Ana', 'Rui'], [4, 3]);
    expect(m.player.name).toBe('Ana');
    expect(m.finish(5)).toBe('player');
    expect(m.player.name).toBe('Rui');
    expect(m.finish(4)).toBe('hole');
    expect(m.hole).toBe(1);
    m.finish(2); expect(m.finish(3)).toBe('over');
    expect(m.isOver).toBe(true);
    expect(m.total(m.players[0])).toBe(7);
    expect(m.toPar(m.players[0])).toBe(0);
    expect(m.ranking().map((p) => p.name)).toEqual(['Ana', 'Rui']);
  });
  it('puts the computer last and caps a hole at the pick-up limit', () => {
    const m = new GolfMatch(['Ana'], [4], 'hard');
    expect(m.players[1]).toMatchObject({ name: 'Computador', cpu: 'hard' });
    m.finish(15);
    expect(m.players[0].strokes[0]).toBe(MAX_STROKES);
  });
  it('ranks the range by most points and nearest-the-pin by fewest metres, with no pick-up cap', () => {
    const range = new GolfMatch(['Ana', 'Rui'], [0], undefined, 'points');
    range.finish(25); range.finish(50);
    expect(range.ranking()[0].name).toBe('Rui');
    const near = new GolfMatch(['Ana', 'Rui'], [0], undefined, 'metres');
    near.finish(12.5); near.finish(3.2);
    expect(near.ranking()[0].name).toBe('Rui');
    expect(near.players[0].strokes[0]).toBe(12.5);
  });

  it('writes scores against par', () => {
    expect(formatToPar(0)).toBe('par');
    expect(formatToPar(3)).toBe('+3');
    expect(formatToPar(-2)).toBe('−2');
  });
});
