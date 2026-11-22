/** The lane's physics without a GPU: the phase 0 criteria. */
import RAPIER from '@dimforge/rapier3d-compat';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

vi.hoisted(() => {
  (globalThis as any).WebGL2RenderingContext ??= new Proxy({}, { get: () => 0 });
});
import { PhysicsBackend, PhysicsWorld, RapierBackend } from '../../../src';
import { BALL, buildLane, LaneEntities, LANE, pinsDown, removePin, ThrowParams, throwBall, resetBall } from './lane';

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
    expect(Math.abs(lane.ball.transform.worldPosition[0])).toBeLessThan(0.8); // and stayed in it
  });

  it('a gutter ball knocks nothing down', () => {
    const { down } = bowl({ speed: 7, angle: 0, spin: 0 }, LANE.halfWidth + 0.12);
    expect(down).toBe(0);
  });

  /** Throws on an empty deck; returns the ball's x as it passes each z in `marks`, and its speed at the last. */
  function path(t: ThrowParams, marks: number[]): { x: number[]; speed: number } {
    world = new PhysicsWorld(backend, { fixedTimeStep: 1 / 120 });
    const lane = buildLane(world);
    lane.pins.forEach((_, i) => removePin(lane, i));
    resetBall(lane, 0);
    throwBall(lane, t);
    const x: number[] = [];
    let speed = 0;
    for (let i = 0; i < 6 * 120 && x.length < marks.length; i++) {
      world.stepOnce();
      const p = lane.ball.transform.worldPosition;
      if (p[2] < marks[x.length]) {
        x.push(p[0]);
        speed = Math.hypot(...lane.ballBody.getLinearVelocity());
      }
    }
    return { x, speed };
  }

  it('rolls a ball without spin straight, keeping most of its speed', () => {
    const { x, speed } = path({ speed: 7, angle: 0, spin: 0 }, [-6, -18]);
    expect(Math.abs(x[1])).toBeLessThan(0.005);
    expect(speed).toBeGreaterThan(6);
  });

  it('hooks a spinning ball late, on the dry back end, by the spin direction', () => {
    const left = path({ speed: 7, angle: 0, spin: 20 }, [-12, -18]);
    expect(Math.abs(left.x[0])).toBeLessThan(0.15); // little drift on the oil
    expect(left.x[1]).toBeLessThan(-0.3); // most of the hook after it
    const right = path({ speed: 7, angle: 0, spin: -20 }, [-12, -18]);
    expect(right.x[1]).toBeCloseTo(-left.x[1], 2);
    // A faster ball has less time on the dry boards, so it hooks less.
    expect(Math.abs(path({ speed: 9, angle: 0, spin: 20 }, [-18]).x[0])).toBeLessThan(Math.abs(left.x[1]));
  });

  it('a hook from the right into the pocket (between pins 1 and 3) is a strike', () => {
    const { down } = bowl({ speed: 8, angle: 0, spin: 10 }, 0.3);
    expect(down).toBe(10);
  });
});
