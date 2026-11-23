import { describe, expect, it } from 'vitest';
import { scoreName } from './score';

describe('score names', () => {
  it('names a score against par', () => {
    expect(scoreName(1, 3)).toBe('Hole in one!');
    expect(scoreName(2, 4)).toBe('Eagle!');
    expect(scoreName(3, 4)).toBe('Birdie!');
    expect(scoreName(4, 4)).toBe('Par');
    expect(scoreName(5, 4)).toBe('Bogey');
    expect(scoreName(9, 4)).toBe('+5');
  });
});
