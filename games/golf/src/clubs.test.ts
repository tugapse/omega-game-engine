import { describe, expect, it } from 'vitest';
import { ClubId, suggestClub } from './clubs';

const reach: Record<ClubId, number> = { driver: 230, wood: 190, iron: 150, wedge: 90, putter: 20 };

describe('club choice', () => {
  it('suggests the shortest club that gets there', () => {
    expect(suggestClub(60, reach, false, false)).toBe('wedge');
    expect(suggestClub(120, reach, false, false)).toBe('iron');
    expect(suggestClub(170, reach, false, false)).toBe('wood');
  });
  it('the driver only from the tee; the putter on the green', () => {
    expect(suggestClub(300, reach, false, true)).toBe('driver');
    expect(suggestClub(300, reach, false, false)).toBe('wood');
    expect(suggestClub(5, reach, true, false)).toBe('putter');
  });
});
