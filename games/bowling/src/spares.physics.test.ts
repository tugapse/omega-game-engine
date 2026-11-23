/** Every leave but the 7-10 can be cleared with one straight ball from some spot. */
import RAPIER from '@dimforge/rapier3d-compat';
import { beforeAll, describe, expect, it, vi } from 'vitest';

vi.hoisted(() => {
  (globalThis as any).WebGL2RenderingContext ??= new Proxy({}, { get: () => 0 });
});
import { PhysicsBackend, PhysicsWorld, RapierBackend } from '../../../src';
import { buildLane, isPinDown, LaneEntities, rackPins, removePin, resetBall, throwBall } from './lane';
import { LEAVES } from './spares';

let backend: PhysicsBackend;
beforeAll(async () => { backend = await RapierBackend.load(RAPIER); });

/** Sets only `rack` (0-based), bowls straight from x at `angle`; how many of them went down. */
export function tryLeave(rack: number[], x: number, angle: number): number {
  const world = new PhysicsWorld(backend, { fixedTimeStep: 1 / 120 });
  const lane: LaneEntities = buildLane(world);
  rackPins(lane);
  lane.pins.forEach((_, i) => { if (!rack.includes(i)) removePin(lane, i); });
  resetBall(lane, x);
  throwBall(lane, { speed: 8, angle, spin: 0 });
  for (let i = 0; i < 4.5 * 120; i++) world.stepOnce();
  const down = rack.filter((i) => isPinDown(lane, i)).length;
  world.destroy();
  return down;
}

describe('spare leaves', () => {
  it('each can be cleared (but the 7-10, which is nearly impossible)', () => {
    for (const leave of LEAVES.filter((l) => l.stars < 5)) {
      const rack = leave.pins.map((p) => p - 1);
      let cleared = false;
      search: for (let x = -0.4; x <= 0.4001; x += 0.1) {
        for (let angle = -0.02; angle <= 0.0201; angle += 0.005) {
          if (tryLeave(rack, x, angle) === rack.length) { cleared = true; break search; }
        }
      }
      expect(cleared, leave.name).toBe(true);
    }
  }, 120_000);
});
