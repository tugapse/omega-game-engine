/** The lane's physics without a GPU: the phase 0 criteria. */
import RAPIER from '@dimforge/rapier3d-compat';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

vi.hoisted(() => {
  (globalThis as any).WebGL2RenderingContext ??= new Proxy({}, { get: () => 0 });
});
import { PhysicsBackend, PhysicsWorld, RapierBackend } from '../../../src';
import { BALL, buildLane, LaneEntities, LANE, pinsDown, ThrowParams, throwBall, resetBall, allStill } from './lane';

let backend: PhysicsBackend;
let world: PhysicsWorld;
beforeAll(async () => { backend = await RapierBackend.load(RAPIER); });
afterEach(() => world?.destroy());

/** Throws and simulates until everything stops (or 12 s); returns the pins down and the ball's furthest z. */
function bowl(t: ThrowParams, x = 0): { down: number; minZ: number; lane: LaneEntities } {
  world = new PhysicsWorld(backend, { fixedTimeStep: 1 / 120 });
  const lane = buildLane(world);
  resetBall(lane, x);
  throwBall(lane, t);
  let minZ = 0;
  for (let i = 0; i < 12 * 120; i++) {
    world.stepOnce();
    minZ = Math.min(minZ, lane.ball.transform.worldPosition[2]);
    if (i > 240 && allStill(lane)) break;
  }
  return { down: pinsDown(lane), minZ, lane };
}

describe('bowling lane', () => {
  it('leaves the pins standing when nothing is thrown', () => {
    world = new PhysicsWorld(backend, { fixedTimeStep: 1 / 120 });
    const lane = buildLane(world);
    for (let i = 0; i < 240; i++) world.stepOnce();
    expect(pinsDown(lane)).toBe(0);
    expect(lane.ball.transform.worldPosition[1]).toBeCloseTo(BALL.radius, 2);
  });

  it('a hard throw at the head pin knocks most pins down, the ball does not pass through them', () => {
    const { down, minZ, lane } = bowl({ speed: 8, angle: 0, spin: 0 });
    expect(down).toBeGreaterThanOrEqual(6);
    expect(minZ).toBeLessThan(LANE.deckEnd); // reached the pit
    expect(lane.ball.transform.worldPosition[1]).toBeLessThan(0); // and fell in
  });

  it('a gutter ball knocks nothing down', () => {
    const { down } = bowl({ speed: 7, angle: 0, spin: 0 }, LANE.halfWidth + 0.12);
    expect(down).toBe(0);
  });
});
