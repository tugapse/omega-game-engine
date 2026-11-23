/** The computer opponent: better skills knock more pins down. */
import RAPIER from '@dimforge/rapier3d-compat';
import { beforeAll, describe, expect, it, vi } from 'vitest';

vi.hoisted(() => {
  (globalThis as any).WebGL2RenderingContext ??= new Proxy({}, { get: () => 0 });
});
import { PhysicsBackend, PhysicsWorld, RapierBackend } from '../../../src';
import { buildLane, PIN_SPOTS, pinsDown, resetBall, throwBall } from './lane';
import { CpuSkill, planThrow } from './cpu';

let backend: PhysicsBackend;
beforeAll(async () => { backend = await RapierBackend.load(RAPIER); });

function seeded(seed: number): () => number {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 2 ** 32; };
}

/** Average first-ball pins over `n` racks. */
function average(skill: CpuSkill, n: number): number {
  const rnd = seeded(42);
  let total = 0;
  for (let k = 0; k < n; k++) {
    const plan = planThrow(skill, PIN_SPOTS.map((p) => ({ x: p[0], z: p[2] })), rnd);
    const world = new PhysicsWorld(backend, { fixedTimeStep: 1 / 120 });
    const lane = buildLane(world);
    resetBall(lane, plan.x);
    throwBall(lane, { ...plan.throw, angle: plan.aim + plan.throw.angle });
    for (let i = 0; i < 4.5 * 120; i++) world.stepOnce();
    total += pinsDown(lane);
    world.destroy();
  }
  return total / n;
}

describe('computer opponent', () => {
  it('aims a leave at its front pin', () => {
    const plan = planThrow('hard', [{ x: PIN_SPOTS[9][0], z: PIN_SPOTS[9][2] }], () => 0.5);
    expect(plan.aim).toBeGreaterThan(0); // pin 10 is on the right
    expect(Math.abs(plan.throw.spin)).toBeLessThan(2); // straight, but for its error
  });

  it('stands in the corridor past obstacles and only aims a little', () => {
    const plan = planThrow('hard', PIN_SPOTS.map((p) => ({ x: p[0], z: p[2] })), () => 0.5, -0.25);
    expect(plan.x).toBeCloseTo(-0.25, 1);
    expect(Math.abs(plan.aim)).toBeLessThan(0.015);
  });

  it('a harder computer knocks more pins down with its first ball', () => {
    const easy = average('easy', 16);
    const medium = average('medium', 16);
    const hard = average('hard', 16);
    console.log('first ball, easy', easy.toFixed(1), 'medium', medium.toFixed(1), 'hard', hard.toFixed(1));
    expect(medium).toBeGreaterThan(easy);
    expect(hard).toBeGreaterThan(medium);
    expect(hard).toBeGreaterThanOrEqual(7.5);
  }, 60_000);
});
