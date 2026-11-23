import { describe, expect, it } from 'vitest';
import { BOSS, bossContact, makeBoss, stepBoss, wakeBoss } from './boss';
import { NO_INPUT } from './hero';
import { parseLevel } from './level';
import { STEP } from './physics';
import { makeWorld, stepWorld } from './world';

const room = parseLevel({ name: 'arena', rows: [
  'X..............................X',
  'X..............................X',
  'X..............................X',
  'X..............................X',
  'X..............................X',
  'X..............................X',
  'X..............................X',
  'X.S...........................FX',
  '################################',
  '################################',
] });
const hero = (x: number, y = 2) => ({ x, y, w: 0.7, h: 0.9, vx: 0, vy: 0, onGround: true });
const run = (b: ReturnType<typeof makeBoss>, h: ReturnType<typeof hero>, seconds: number) => {
  const events: string[] = [];
  for (let t = 0; t < seconds; t += STEP) events.push(...stepBoss(b, h, room, STEP));
  return events;
};

describe('bosses', () => {
  it('stay put until woken', () => {
    const b = makeBoss('king', 20, 2);
    run(b, hero(5), 2);
    expect(b.body.x).toBe(20);
    expect(b.state).toBe('idle');
  });

  it('Rei Bolota walks at Bit, crouches, then leaps at him and lands', () => {
    const b = makeBoss('king', 20, 2);
    wakeBoss(b);
    const states = new Set<string>();
    let events: string[] = [];
    for (let t = 0; t < 4; t += STEP) { events.push(...stepBoss(b, hero(8), room, STEP)); states.add(b.state); }
    expect(b.body.x).toBeLessThan(20);
    expect([...states]).toEqual(expect.arrayContaining(['walk', 'crouch', 'leap']));
    expect(events).toContain('thud');
  });

  it('Geodo fires shards at Bit: one low at first, more and higher ones after stomps', () => {
    const b = makeBoss('golem', 20, 2);
    wakeBoss(b);
    let shots = 0;
    for (let t = 0; t < 4; t += STEP) shots += stepBoss(b, hero(8), room, STEP).filter((e) => e === 'shoot').length;
    expect(shots).toBe(1);
    b.hp = 1;
    const ys: number[] = [];
    b.state = 'aim'; b.time = 0;
    for (let t = 0; t < 3; t += STEP) {
      if (stepBoss(b, hero(8), room, STEP).includes('shoot')) ys.push(b.shots[b.shots.length - 1].body.y);
    }
    expect(ys.length).toBe(3);
    expect(ys[0]).toBeCloseTo(2 + BOSS.golem.low, 6);
    // The high one flies over a small Bit standing still.
    expect(ys[1]).toBeGreaterThan(2 + 0.9);
  });

  it('Turbina flies out of reach dropping bolts, then swoops down to rest on the floor', () => {
    const b = makeBoss('drone', 16, 2);
    wakeBoss(b);
    let low = Infinity, drops = 0, rested = false;
    for (let t = 0; t < 4; t += STEP) {
      drops += stepBoss(b, hero(8), room, STEP).filter((e) => e === 'drop').length;
      low = Math.min(low, b.body.y);
    }
    // Out of reach of a full jump (4.3 m) while flying.
    expect(low).toBeGreaterThan(2 + 4.3);
    expect(drops).toBeGreaterThan(0);
    for (let t = 0; t < 4; t += STEP) { stepBoss(b, hero(8), room, STEP); rested ||= b.state === 'rest'; }
    expect(rested).toBe(true);
  });

  it('a stomp costs a hit and a moment of flashing; the side hurts Bit; three stomps knock it out', () => {
    const b = makeBoss('king', 20, 2);
    const top = 2 + BOSS.king.h;
    const falling = { ...hero(20, top - 0.1), vy: -5, onGround: false };
    expect(bossContact(b, falling, top + 0.05)).toBe('stomp');
    expect(b.hp).toBe(2);
    expect(bossContact(b, falling, top + 0.05)).toBe('bounce');
    expect(bossContact(b, hero(19), 2)).toBe(null);
    b.hurt = 0;
    expect(bossContact(b, hero(19), 2)).toBe('hurt');
    expect(bossContact(b, falling, top + 0.05)).toBe('stomp');
    b.hurt = 0;
    expect(bossContact(b, falling, top + 0.05)).toBe('down');
    expect(b.state).toBe('down');
  });

  it('in a level: the gate closes behind Bit as the fight starts, and opens when the boss is beaten', () => {
    const w = makeWorld({ name: 'a', rows: [
      '.....H...........GG....',
      '.....H...........GG....',
      '.S...H.......M...GG..F.',
      '#######################',
      '#######################',
    ] });
    for (let t = 0; t < 1.2; t += STEP) stepWorld(w, { ...NO_INPUT, right: true }, 99);
    expect(w.boss!.state).not.toBe('idle');
    expect(w.level.tiles[5][2]).toBe('gate');
    w.boss!.hp = 1;
    w.boss!.hurt = 0;
    const b = w.boss!.body;
    w.hero.body.x = b.x; w.hero.body.y = b.y + b.h - 0.1; w.hero.body.vy = -3; w.hero.body.onGround = false;
    stepWorld(w, NO_INPUT, 99);
    expect(w.boss!.state).toBe('down');
    expect(w.level.tiles[5][2]).toBe('empty');
    expect(w.level.tiles[17][2]).toBe('empty');
  });
});
