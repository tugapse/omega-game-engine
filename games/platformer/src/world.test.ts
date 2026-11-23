import { describe, expect, it } from 'vitest';
import { HeroInput, NO_INPUT } from './hero';
import { LevelSpec } from './level';
import { STEP } from './physics';
import { ENEMY, makeWorld, nextTry, RULES, stepWorld, World } from './world';

const spec = (rows: string[]): LevelSpec => ({ name: 'test', rows });
const run = (w: World, input: Partial<HeroInput>, seconds: number, until?: (w: World) => boolean) => {
  const events: string[] = [];
  for (let t = 0; t < seconds; t += STEP) {
    stepWorld(w, { ...NO_INPUT, ...input }, w.hero.body.x + 9);
    events.push(...w.events.map((e) => e.type));
    if (until?.(w) || w.dead || w.cleared) break;
  }
  return events;
};
const jumpAt = (w: World, hold = 0.4) => {
  stepWorld(w, { ...NO_INPUT, jump: true, jumpPressed: true }, 99);
  return run(w, { jump: true }, hold);
};

describe('world', () => {
  it('collects coins it touches', () => {
    const w = makeWorld(spec(['S.ooo....F', '##########']));
    run(w, { right: true }, 1.2);
    expect(w.coinCount).toBe(3);
    expect(w.score).toBe(3 * RULES.points.coin);
    expect(w.coins.every((c) => c.taken)).toBe(true);
  });
  it('a bonus block gives one coin and is used up', () => {
    const w = makeWorld(spec(['.....', '..?..', '.....', '..S.F', '#####']));
    const events = jumpAt(w, 0.6);
    expect(events).toContain('bump');
    expect(w.coinCount).toBe(1);
    expect(w.level.tiles[2][3]).toBe('used');
    run(w, {}, 1);
    jumpAt(w, 0.6);
    expect(w.coinCount).toBe(1);
  });
  it('stomping a walker squashes it and bounces the hero', () => {
    const w = makeWorld(spec(['..........', '..........', 'S...g....F', '##########']));
    // Drop the hero onto it from above.
    Object.assign(w.hero.body, { x: 4.5, y: 4, vy: 0, onGround: false });
    const events = run(w, { jump: true }, 1.5, (x) => x.enemies[0].state === 'squashed');
    expect(events).toContain('stomp');
    expect(w.dead).toBe(false);
    expect(w.enemies[0].state).toBe('squashed');
    expect(w.hero.body.vy).toBeGreaterThan(0);
    expect(w.score).toBe(RULES.points.stomp);
  });
  it('walking into a walker loses a life', () => {
    const w = makeWorld(spec(['S.....g...F', '###########']));
    const events = run(w, { right: true }, 3);
    expect(events).toContain('die');
    expect(w.dead).toBe(true);
    expect(w.lives).toBe(RULES.lives - 1);
  });
  it('a shell: stomp to hide it, then kick it into another enemy', () => {
    const w = makeWorld(spec(['...............', '...............', 'S..k......g...F', '###############']));
    const shell = w.enemies[0], walker = w.enemies[1];
    Object.assign(w.hero.body, { x: 3.5, y: 4, vy: 0, onGround: false });
    run(w, {}, 1.5, () => shell.state === 'shell');
    expect(shell.state).toBe('shell');
    expect(shell.body.h).toBe(ENEMY.shell.shellH);
    // Stand beside it, then walk into it: a kick.
    Object.assign(w.hero.body, { x: shell.body.x - 2, y: 1, vx: 0, vy: 0, onGround: true });
    const events = run(w, { right: true }, 2, () => shell.state === 'slide');
    expect(events).toContain('kick');
    expect(w.dead).toBe(false);
    run(w, {}, 2, () => walker.state === 'out');
    expect(walker.state).toBe('out');
  });
  it('a block bumped from below knocks off the enemy on it', () => {
    const w = makeWorld(spec(['.....', '..g..', '..B..', '.....', '..S.F', '#####']));
    // Let the walker land on the brick first.
    w.enemies[0].state = 'walk';
    w.enemies[0].dir = 0;
    run(w, {}, 0.3);
    jumpAt(w, 0.6);
    expect(w.enemies[0].state).toBe('out');
  });
  it('spikes hurt, and the next try starts at the checkpoint with one life less', () => {
    const w = makeWorld(spec(['S..C...^^^...F', '##############']));
    const events = run(w, { right: true }, 3);
    expect(events).toContain('checkpoint');
    expect(w.dead).toBe(true);
    const again = nextTry(w)!;
    expect(again.lives).toBe(RULES.lives - 1);
    expect(again.hero.body.x).toBe(3.5);
  });
  it('no lives left: no next try', () => {
    const w = makeWorld(spec(['S..^^^^^^^...F', '##############']), { lives: 1, coinCount: 0, score: 0, checkpoint: null });
    run(w, { right: true }, 3);
    expect(w.dead).toBe(true);
    expect(nextTry(w)).toBeNull();
  });
  it('100 coins give a life', () => {
    const w = makeWorld(spec(['S.oo.F', '######']), { lives: 3, coinCount: 99, score: 0, checkpoint: null });
    const events = run(w, { right: true }, 1);
    expect(events).toContain('oneUp');
    expect(w.lives).toBe(4);
  });
  it('the clock running out loses a life; reaching the flag adds the time left', () => {
    const slow = makeWorld(spec(['S........F', '##########']));
    slow.time = 0.05;
    run(slow, {}, 0.2);
    expect(slow.dead).toBe(true);
    const fast = makeWorld(spec(['S...F', '#####']));
    run(fast, { right: true }, 2);
    expect(fast.cleared).toBe(true);
    expect(fast.score).toBe(Math.ceil(fast.time) * RULES.points.timeLeft);
  });
  it('enemies sleep until the camera reaches them', () => {
    const w = makeWorld(spec(['S.....................................g..F', '##########################################']));
    stepWorld(w, NO_INPUT, 10);
    expect(w.enemies[0].state).toBe('asleep');
    stepWorld(w, NO_INPUT, 37);
    expect(w.enemies[0].state).toBe('walk');
  });
});
