/** The obstacle lanes: every level playable, the same lane per level, and the bodies doing their job. */
import RAPIER from '@dimforge/rapier3d-compat';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

vi.hoisted(() => {
  (globalThis as any).WebGL2RenderingContext ??= new Proxy({}, { get: () => 0 });
});
import { PhysicsBackend, PhysicsWorld, RapierBackend } from '../../../src';
import { buildLane, pinsDown, resetBall, throwBall } from './lane';
import { MAX_LEVEL } from './arcade';
import { hasStraightPath, levelLayout, straightPath, ObstacleField, ObstacleKind, ObstacleSpec, POOL } from './obstacles';

let backend: PhysicsBackend;
let world: PhysicsWorld;
beforeAll(async () => { backend = await RapierBackend.load(RAPIER); });
afterEach(() => world?.destroy());

const levels = Array.from({ length: MAX_LEVEL }, (_, i) => i + 1);

/** Bowls straight at `x` on `layout`, after `wait` seconds of the obstacles moving; pins down and the ball's lowest z. */
function bowl(layout: ObstacleSpec[], x: number, wait = 0, angle = 0): { down: number; minZ: number } {
  world = new PhysicsWorld(backend, { fixedTimeStep: 1 / 120 });
  const lane = buildLane(world);
  const field = new ObstacleField(world, lane);
  field.setLayout(layout);
  resetBall(lane, x);
  for (let i = 0; i < wait * 120; i++) world.stepOnce();
  resetBall(lane, x);
  throwBall(lane, { speed: 8, angle, spin: 0 });
  let minZ = 0;
  for (let i = 0; i < 6 * 120; i++) {
    world.stepOnce();
    minZ = Math.min(minZ, lane.ball.transform.worldPosition[2]);
  }
  const down = pinsDown(lane);
  world.destroy();
  world = undefined as any;
  return { down, minZ };
}

describe('obstacle levels', () => {
  it('level 1 is a clean lane and every level fits the pool and leaves a straight path', () => {
    expect(levelLayout(1)).toEqual([]);
    for (const level of levels.slice(1)) {
      const layout = levelLayout(level);
      expect(layout.length).toBeGreaterThan(0);
      expect(hasStraightPath(layout)).toBe(true);
      for (const kind of Object.keys(POOL) as ObstacleKind[]) {
        expect(layout.filter((o) => o.kind === kind).length).toBeLessThanOrEqual(POOL[kind]);
      }
    }
  });

  it('a level is always the same lane, and the levels differ', () => {
    for (const level of levels) expect(levelLayout(level)).toEqual(levelLayout(level));
    expect(levelLayout(2)).not.toEqual(levelLayout(3));
  });

  it('gets harder: more obstacles and more of them moving', () => {
    const moving = (l: ObstacleSpec[]) => l.filter((o) => o.kind === 'slider' || o.kind === 'spinner').length;
    expect(moving(levelLayout(2))).toBe(0);
    expect(moving(levelLayout(MAX_LEVEL))).toBeGreaterThan(moving(levelLayout(3)));
  });

  it('a post in the way stops a straight throw', () => {
    const post = levelLayout(2).find((o) => o.kind === 'post')!;
    if (post.kind !== 'post') throw new Error('no post');
    const { minZ } = bowl([post], post.x);
    expect(minZ).toBeGreaterThan(post.z - 1); // never got far past it
  });

  it('every level can be beaten: a throw down the free corridor, at the right moment, knocks pins down', () => {
    for (const level of levels) {
      const layout = levelLayout(level);
      const x = straightPath(layout)!;
      let best = 0;
      // The moving ones: wait for a gap; the wind: aim a little against it.
      for (const angle of [0, 0.01, -0.01, 0.02, -0.02, 0.03, -0.03]) {
        for (let wait = 0; wait < 4 && best < 5; wait += 0.1) best = Math.max(best, bowl(layout, x, wait, angle).down);
      }
      expect(best, `level ${level}`).toBeGreaterThanOrEqual(5);
    }
  }, 120_000);
});
