import { describe, expect, it } from 'vitest';
import { Match } from './match';

describe('Match', () => {
  it('passes the turn after each frame', () => {
    const m = Match.withPlayers(2);
    expect(m.current).toBe(0);
    expect(m.roll(3)).toBe(false); // same frame
    expect(m.roll(4)).toBe(true); // frame over: player 2
    expect(m.current).toBe(1);
    expect(m.roll(10)).toBe(true); // a strike ends the frame at once
    expect(m.current).toBe(0);
  });

  it('keeps one player bowling on their own', () => {
    const m = Match.withPlayers(1);
    for (let i = 0; i < 12; i++) expect(m.roll(10)).toBe(false);
    expect(m.isOver).toBe(true);
    expect(m.player.game.score).toBe(300);
  });

  it('plays a whole game for two players, the tenth frame with its bonus rolls', () => {
    const m = Match.withPlayers(2);
    // Player 1 strikes every time; player 2 rolls 9 and a miss.
    while (!m.isOver) m.roll(m.current === 0 ? 10 : m.player.game.next!.roll === 0 ? 9 : 0);
    expect(m.players[0].game.score).toBe(300);
    expect(m.players[1].game.score).toBe(90);
    expect(m.ranking().map((p) => p.name)).toEqual(['Jogador 1', 'Jogador 2']);
  });

  it('adds the computer last, in the fourth place at most', () => {
    const m = Match.withPlayers(1, undefined, 'hard');
    expect(m.players.map((p) => p.name)).toEqual(['Jogador 1', 'Computador']);
    expect(m.players[1].cpu).toBe('hard');
    expect(Match.withPlayers(4, undefined, 'easy').players.length).toBe(4);
  });

  it('clamps the number of players to 1..4', () => {
    expect(Match.withPlayers(0).players.length).toBe(1);
    expect(Match.withPlayers(9).players.length).toBe(4);
  });
});
