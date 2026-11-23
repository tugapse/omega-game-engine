import { describe, expect, it } from 'vitest';
import { botRun } from './bot';
import { followHero, makeCamera } from './camera';
import { Hero, HERO, HeroInput, makeHero, NO_INPUT, stepHero } from './hero';
import { Level, parseLevel, solidAt, tileAt } from './level';
import { LEVELS } from './levels';
import { Body, moveBody, STEP } from './physics';

const flat = (extra: string[] = []): Level => parseLevel({
  name: 'flat',
  rows: [...extra, '.S..........................F', '##############################', '##############################'],
});

const run = (hero: Hero, level: Level, input: Partial<HeroInput>, seconds: number, each?: (h: Hero) => void) => {
  for (let t = 0; t < seconds; t += STEP) { stepHero(hero, { ...NO_INPUT, ...input }, level); each?.(hero); }
};

describe('level', () => {
  it('reads rows top first, so row 0 is the bottom', () => {
    const l = parseLevel({ name: 't', rows: ['?..', 'S.F', '###'] });
    expect(l.width).toBe(3);
    expect(l.height).toBe(3);
    expect(tileAt(l, 0, 0)).toBe('ground');
    expect(tileAt(l, 0, 2)).toBe('bonus');
    expect(l.start).toEqual({ x: 0.5, y: 1 });
    expect(l.goal).toEqual({ x: 2.5, y: 1 });
  });
  it('has a wall on the left and open space everywhere else outside', () => {
    const l = flat();
    expect(solidAt(l, -1, 5)).toBe(true);
    expect(solidAt(l, 999, 0)).toBe(false);
    expect(solidAt(l, 3, -1)).toBe(false);
  });
  it('refuses unknown characters and levels without a start or goal', () => {
    expect(() => parseLevel({ name: 't', rows: ['S.F', '#Z#'] })).toThrow(/unknown/);
    expect(() => parseLevel({ name: 't', rows: ['..F', '###'] })).toThrow(/start/);
    expect(() => parseLevel({ name: 't', rows: ['S..', '###'] })).toThrow(/goal/);
  });
  it('every level parses', () => {
    for (const spec of LEVELS) expect(() => parseLevel(spec)).not.toThrow();
  });
});

describe('physics', () => {
  const body = (x: number, y: number, vx = 0, vy = 0): Body => ({ x, y, w: 0.7, h: 0.9, vx, vy, onGround: false });
  it('lands on the ground and stays on it', () => {
    const l = flat();
    const b = body(5, 4);
    let landed = 0;
    for (let i = 0; i < 240; i++) { b.vy -= 75 * STEP; if (moveBody(l, b).landed) landed++; }
    expect(b.y).toBeCloseTo(2, 6);
    expect(b.onGround).toBe(true);
    expect(landed).toBe(1);
  });
  it('stops at a wall on either side', () => {
    const l = parseLevel({ name: 'w', rows: ['X.S...F.X', 'X.......X', '#########'] });
    const b = body(4, 1, 8, 0);
    let wall = false;
    for (let i = 0; i < 120; i++) wall = moveBody(l, b).wallRight || wall;
    expect(wall).toBe(true);
    expect(b.x + b.w / 2).toBeCloseTo(8, 6);
    b.vx = -8;
    for (let i = 0; i < 240; i++) moveBody(l, b);
    expect(b.x - b.w / 2).toBeCloseTo(1, 6);
  });
  it('reports the block bumped with the head', () => {
    const l = parseLevel({ name: 'b', rows: ['.....', '..?..', '.....', 'S...F', '#####'] });
    const b = body(2.5, 1, 0, 15);
    let bumped: { x: number; y: number } | null = null;
    for (let i = 0; i < 30 && !bumped; i++) bumped = moveBody(l, b).bumped;
    expect(bumped).toEqual({ x: 2, y: 3 });
    expect(b.vy).toBe(0);
    expect(b.y + b.h).toBeCloseTo(3, 6);
  });
  it('slips past a corner it only clips', () => {
    const l = parseLevel({ name: 'c', rows: ['.....', '..X..', '.....', 'S...F', '#####'] });
    // The head overlaps the block's left corner by 0.1 m.
    const b = body(2 - 0.35 + 0.1, 1, 0, 15);
    let bumped = false;
    for (let i = 0; i < 40; i++) bumped = !!moveBody(l, b).bumped || bumped;
    expect(bumped).toBe(false);
    expect(b.y).toBeGreaterThan(3);
    expect(b.x + b.w / 2).toBeCloseTo(2, 6);
  });
});

describe('hero', () => {
  it('walks and runs up to its top speeds', () => {
    const l = flat();
    const h = makeHero(l.start.x, l.start.y);
    run(h, l, { right: true }, 1);
    expect(h.body.vx).toBeCloseTo(HERO.walk, 6);
    run(h, l, { right: true, run: true }, 1);
    expect(h.body.vx).toBeCloseTo(HERO.run, 6);
    run(h, l, {}, 1);
    expect(h.body.vx).toBe(0);
  });
  it('jumps higher the longer the button is held', () => {
    const peak = (holdFor: number) => {
      const l = flat();
      const h = makeHero(l.start.x, l.start.y);
      let top = 0, t = 0;
      for (let i = 0; i < 240; i++, t += STEP) {
        stepHero(h, { ...NO_INPUT, jump: t < holdFor, jumpPressed: i === 0 }, l);
        top = Math.max(top, h.body.y - 2);
      }
      return top;
    };
    const tap = peak(STEP), full = peak(1);
    expect(tap).toBeGreaterThan(1.1);
    expect(tap).toBeLessThan(1.8);
    expect(full).toBeGreaterThan(4);
    expect(full).toBeLessThan(4.6);
  });
  it('still jumps just after running off a ledge (coyote time), but not long after', () => {
    const tryJump = (lateBy: number) => {
      const l = parseLevel({ name: 'ledge', rows: ['S.........F', '###........', '###........'] });
      const h = makeHero(1.5, 2);
      h.body.vx = HERO.walk;
      let left = -1;
      for (let i = 0; i < 400; i++) {
        const t = i * STEP;
        if (left < 0 && !h.body.onGround) left = t;
        const press = left >= 0 && Math.abs(t - left - lateBy) < STEP / 2;
        stepHero(h, { ...NO_INPUT, right: true, jump: press || (left >= 0 && t > left + lateBy && t < left + lateBy + 0.3), jumpPressed: press }, l);
        if (h.jumped) return true;
      }
      return false;
    };
    expect(tryJump(0.06)).toBe(true);
    expect(tryJump(0.2)).toBe(false);
  });
  it('keeps a press made just before landing (jump buffer)', () => {
    const l = flat();
    const h = makeHero(5, 4);
    h.body.onGround = false;
    let jumped = false, pressed = false;
    for (let i = 0; i < 240 && !jumped; i++) {
      // Press once, when 0.25 m above the ground and falling.
      const press = !pressed && h.body.vy < 0 && h.body.y - 2 < 0.25;
      if (press) pressed = true;
      stepHero(h, { ...NO_INPUT, jump: pressed, jumpPressed: press }, l);
      jumped = h.jumped;
    }
    expect(pressed).toBe(true);
    expect(jumped).toBe(true);
  });
  it('cannot jump again in the air', () => {
    const l = flat();
    const h = makeHero(5, 2);
    let jumps = 0;
    for (let i = 0; i < 60; i++) { stepHero(h, { ...NO_INPUT, jump: true, jumpPressed: i % 10 === 0 }, l); if (h.jumped) jumps++; }
    expect(jumps).toBe(1);
  });
});

describe('camera', () => {
  it('follows right, looks ahead, and never scrolls back', () => {
    const cam = makeCamera(2, 2, 8);
    expect(cam.x).toBe(8);
    const hero = { x: 2, y: 2, vx: 9.5, onGround: true };
    for (let i = 0; i < 600; i++) { hero.x += hero.vx / 120; followHero(cam, hero, 8, 200, 1 / 120); }
    expect(cam.x).toBeGreaterThan(hero.x);
    const far = cam.x;
    hero.vx = -6;
    for (let i = 0; i < 240; i++) { hero.x += hero.vx / 120; followHero(cam, hero, 8, 200, 1 / 120); }
    expect(cam.x).toBeGreaterThanOrEqual(far - 1e-9);
  });
  it('keeps the ground in view on low platforms, and climbs only for high ones', () => {
    const cam = makeCamera(2, 2, 8);
    const settle = (y: number) => { for (let i = 0; i < 1200; i++) followHero(cam, { x: 10, y, vx: 0, onGround: true }, 8, 200, 1 / 120, 4.4); return cam.y; };
    expect(settle(2)).toBeCloseTo(4.4, 3);
    expect(settle(4)).toBeCloseTo(4.4, 3);
    expect(settle(7)).toBeCloseTo(7, 3);
  });
  it('on a narrow (upright phone) screen the hero never gets near the right edge', () => {
    for (const halfWidth of [2, 2.5, 3.5, 12]) {
      const cam = makeCamera(2, 2, halfWidth);
      const hero = { x: 2, y: 2, vx: 0, onGround: true };
      let worst = Infinity;
      // From standing, then at full run, then a sudden stop and start again.
      for (let i = 0; i < 1800; i++) {
        hero.vx = i < 600 ? Math.min(9.5, i * 0.3) : i < 700 ? 0 : 9.5;
        hero.x += hero.vx / 120;
        followHero(cam, hero, halfWidth, 400, 1 / 120);
        worst = Math.min(worst, cam.x + halfWidth - hero.x);
      }
      expect(worst, `halfWidth ${halfWidth}`).toBeGreaterThanOrEqual(Math.min(3.25, halfWidth * 1.3) - 1e-9);
    }
  });
  it('climbs at once when the head would go above the room on top', () => {
    const cam = makeCamera(2, 2, 2.5);
    for (let y = 2; y < 12; y += 0.05) {
      followHero(cam, { x: 5, y, vx: 0, onGround: false }, 2.5, 200, 1 / 120, 4.4, 3, 0.9);
      expect(y + 0.9 - cam.y).toBeLessThanOrEqual(3 + 1e-9);
    }
  });
  it('stops at the level end', () => {
    const cam = makeCamera(2, 2, 8);
    for (let i = 0; i < 1200; i++) followHero(cam, { x: 49, y: 2, vx: 9.5, onGround: true }, 8, 50, 1 / 120);
    expect(cam.x).toBeCloseTo(42, 6);
  });
});

describe('levels', () => {
  it('every level can be finished by running and jumping, without dying', () => {
    for (const spec of LEVELS) {
      const r = botRun(spec);
      expect({ reached: r.reached, deaths: r.deaths }, `${spec.name} stopped at x=${r.x.toFixed(1)}`).toEqual({ reached: true, deaths: 0 });
    }
  });
});
