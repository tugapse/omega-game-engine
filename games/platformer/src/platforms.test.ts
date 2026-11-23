import { describe, expect, it } from 'vitest';
import { makeHero, NO_INPUT, HeroInput } from './hero';
import { LevelSpec, parseLevel } from './level';
import { STEP } from './physics';
import { makePlatforms, PLATFORMS, Stage, stepHeroOnStage } from './platforms';
import { makeWorld, nextTry, stepWorld } from './world';

const stage = (rows: string[]): Stage => {
  const level = parseLevel({ name: 't', rows });
  return { level, platforms: makePlatforms(level.platforms), elapsed: 0 };
};
const run = (s: Stage, hero: ReturnType<typeof makeHero>, input: Partial<HeroInput>, seconds: number) => {
  for (let t = 0; t < seconds; t += STEP) stepHeroOnStage(s, hero, { ...NO_INPUT, ...input });
};

describe('platforms', () => {
  it('reads runs of = and ~ with their tracks', () => {
    const l = parseLevel({
      name: 't', rows: [
        '.......|....',
        '..--===|.~~.',
        '......===...',
        'S.........F.',
        '############',
      ],
    });
    expect(l.platforms).toEqual([
      { kind: 'move', x: 4, y: 3, w: 3, track: { axis: 'x', from: 2, to: 4 } },
      { kind: 'fall', x: 9, y: 3, w: 2, track: null },
      { kind: 'move', x: 6, y: 2, w: 3, track: { axis: 'y', from: 2, to: 4 } },
    ]);
    // Platforms and tracks leave empty tiles.
    expect(l.tiles[5][3]).toBe('empty');
    expect(l.tiles[7][4]).toBe('empty');
  });

  it('lands on a platform from above and jumps up through it from below', () => {
    const s = stage(['..........', '..........', '...===....', '..........', '..........', 'S........F', '##########']);
    const hero = makeHero(4.5, 1);
    hero.body.vy = 0;
    // A full jump from under it goes through and comes down on its top (y = 5).
    stepHeroOnStage(s, hero, { ...NO_INPUT, jump: true, jumpPressed: true });
    run(s, hero, { jump: true }, 0.5);
    run(s, hero, {}, 1);
    expect(hero.body.y).toBeCloseTo(5, 6);
    expect(hero.body.onGround).toBe(true);
    expect(hero.riding).toBe(0);
  });

  it('carries Bit along its track, there and back', () => {
    const s = stage(['..........', '.===-----.', '..........', 'S........F', '##########']);
    const hero = makeHero(2.5, 4);
    hero.body.onGround = false;
    run(s, hero, {}, 0.3);
    expect(hero.riding).toBe(0);
    let far = 0;
    const p = s.platforms[0];
    for (let t = 0; t < 6; t += STEP) {
      stepHeroOnStage(s, hero, NO_INPUT);
      far = Math.max(far, p.x);
      // Bit keeps his place on it.
      expect(hero.body.x - p.x).toBeCloseTo(1.5, 3);
    }
    expect(far).toBeCloseTo(6, 2);
    expect(p.x).toBeLessThan(5);
  });

  it('a falling platform drops a moment after Bit lands on it, and Bit with it', () => {
    const s = stage(['.........', '..~~~....', '.........', 'S.......F', '.........']);
    const hero = makeHero(3.5, 4.5);
    hero.body.onGround = false;
    run(s, hero, {}, 0.2);
    expect(s.platforms[0].state).toBe('shake');
    run(s, hero, {}, PLATFORMS.fallDelay - 0.1);
    expect(s.platforms[0].y).toBe(3);
    run(s, hero, {}, 0.5);
    expect(s.platforms[0].state).toBe('fall');
    expect(hero.body.y).toBeLessThan(3);
  });

  it('in a world: a big coin is worth points and stays taken on the next try', () => {
    const spec: LevelSpec = { name: 't', rows: ['S.$...^^^^^^^^F', '###############'] };
    const w = makeWorld(spec);
    for (let t = 0; t < 3 && !w.dead; t += STEP) stepWorld(w, { ...NO_INPUT, right: true }, 99);
    expect(w.bigCoins[0].taken).toBe(true);
    expect(w.score).toBe(2000);
    expect(w.dead).toBe(true);
    expect(nextTry(w)!.bigCoins[0].taken).toBe(true);
  });
});
