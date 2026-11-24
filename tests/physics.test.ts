/** Physics module against the Rapier backend (runs in Node, no GPU). */
import RAPIER from '@dimforge/rapier3d-compat';
import { quat, vec3 } from 'gl-matrix';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

// The GL enums read WebGL2RenderingContext constants when imported; Node has none.
vi.hoisted(() => {
  (globalThis as any).WebGL2RenderingContext ??= new Proxy({}, { get: () => 0 });
});
import {
  ColliderBehaviour, ColliderShape, ContactEvent, PhysicsBackend, PhysicsWorld, RapierBackend,
  RigidBodyBehaviour, RigidBodyType,
} from '../src/physics';
import { SceneEntity } from '../src/entities/entity';

let backend: PhysicsBackend;
let world: PhysicsWorld;

beforeAll(async () => {
  backend = await RapierBackend.load(RAPIER);
});

afterEach(() => world?.destroy());

function entity(position: number[], ...behaviours: any[]): SceneEntity {
  const e = new SceneEntity('e');
  e.transform.setLocalPosition(position[0], position[1], position[2]);
  for (const b of behaviours) e.addBehaviour(b);
  return e;
}

function body(type = RigidBodyType.Dynamic, extra: Partial<RigidBodyBehaviour> = {}): RigidBodyBehaviour {
  return Object.assign(new RigidBodyBehaviour(), { bodyType: type }, extra);
}

function collider(shape: ColliderShape, extra: Partial<ColliderBehaviour> = {}): ColliderBehaviour {
  return Object.assign(new ColliderBehaviour(shape), extra);
}

const ground = () => entity([0, -0.5, 0], collider({ type: 'box', halfExtents: [10, 0.5, 10] }));
const run = (seconds: number) => { for (let t = 0; t < seconds; t += world.fixedTimeStep) world.stepOnce(); };

describe('PhysicsWorld', () => {
  it('drops a ball that comes to rest on the ground', () => {
    world = new PhysicsWorld(backend);
    ground();
    const rb = body();
    const ball = entity([0, 3, 0], rb, collider({ type: 'sphere', radius: 0.5 }));
    run(3);
    expect(ball.transform.worldPosition[1]).toBeCloseTo(0.5, 1);
    expect(vec3.length(rb.getLinearVelocity())).toBeLessThan(0.05);
  });

  it('stops a fast body at a thin wall with CCD', () => {
    world = new PhysicsWorld(backend, { gravity: [0, 0, 0] });
    entity([5, 0, 0], collider({ type: 'box', halfExtents: [0.01, 2, 2] }));
    const shoot = (ccd: boolean) => {
      // 3000 m/s: 50 m per step, so the ball would skip the 2 cm wall between steps.
      const rb = body(RigidBodyType.Dynamic, { ccd });
      const e = entity([0, 0, 0], rb, collider({ type: 'sphere', radius: 0.02 }));
      rb.setLinearVelocity(vec3.fromValues(3000, 0, 0));
      run(0.2);
      const x = e.transform.worldPosition[0];
      e.destroy();
      return x;
    };
    // Rapier's speculative contacts often catch this even without CCD, so only the CCD case is asserted.
    expect(shoot(true)).toBeLessThan(5);
  });

  it('reports contact start to the world and to both colliders', () => {
    world = new PhysicsWorld(backend);
    const floor = collider({ type: 'box', halfExtents: [10, 0.5, 10] });
    entity([0, -0.5, 0], floor);
    const ballCollider = collider({ type: 'sphere', radius: 0.5 }, { contactEvents: true });
    const seen: ContactEvent[] = [];
    let other: ColliderBehaviour | null = null;
    ballCollider.onContact = (e, o) => { if (e.started) other = o; };
    world.onContact((e) => seen.push(e));
    entity([0, 2, 0], body(), ballCollider);
    run(1.5);
    const start = seen.find((e) => e.started)!;
    expect(start).toBeDefined();
    expect([start.a, start.b]).toContain(floor);
    expect(other).toBe(floor);
  });

  it('reports contact forces above the threshold', () => {
    world = new PhysicsWorld(backend);
    ground();
    const forces: number[] = [];
    world.onContactForce((e) => forces.push(e.force));
    entity([0, 2, 0], body(RigidBodyType.Dynamic, { mass: 6 }), collider({ type: 'sphere', radius: 0.1 }, { contactForceThreshold: 10 }));
    run(1.5);
    expect(forces.length).toBeGreaterThan(0);
    expect(Math.max(...forces)).toBeGreaterThan(10);
  });

  it('raycasts to the nearest collider with its entity, point and normal', () => {
    world = new PhysicsWorld(backend);
    const g = ground();
    world.stepOnce(); // queries see colliders from the last step
    const hit = world.raycast(vec3.fromValues(1, 5, 2), vec3.fromValues(0, -2, 0))!;
    expect(hit.entity).toBe(g);
    expect(hit.distance).toBeCloseTo(5);
    expect(Array.from(hit.point)).toEqual([1, 0, 2].map((n) => expect.closeTo(n)));
    expect(hit.normal[1]).toBeCloseTo(1);
    expect(world.raycast(vec3.fromValues(0, 5, 0), vec3.fromValues(0, 1, 0))).toBeNull();
  });

  it('builds compound bodies from colliders on child entities, scaled', () => {
    world = new PhysicsWorld(backend, { gravity: [0, 0, 0] });
    const parent = entity([0, 0, 0], body());
    parent.transform.rotate(0, 90, 0);
    const child = entity([0, 0, 2], collider({ type: 'sphere', radius: 0.5 }));
    child.transform.setParent(parent.transform);
    child.transform.setLocalScale(2, 2, 2);
    world.stepOnce();
    // The child sits at local z = 2, turned 90° about Y: world x = 2. Radius 0.5 × 2 = 1.
    const hit = world.raycast(vec3.fromValues(10, 0, 0), vec3.fromValues(-1, 0, 0))!;
    expect(hit.entity).toBe(child);
    expect(hit.point[0]).toBeCloseTo(3, 3);
  });

  it('moves kinematic bodies from their transform and they push dynamic ones', () => {
    world = new PhysicsWorld(backend, { gravity: [0, 0, 0] });
    const pusher = entity([0, 0, 0], body(RigidBodyType.Kinematic), collider({ type: 'box', halfExtents: [0.5, 0.5, 0.5] }));
    const box = entity([1.5, 0, 0], body(), collider({ type: 'box', halfExtents: [0.4, 0.4, 0.4] }));
    for (let i = 1; i <= 60; i++) {
      pusher.transform.setLocalPosition(i * 0.05, 0, 0);
      world.stepOnce();
    }
    expect(box.transform.worldPosition[0]).toBeGreaterThan(3);
  });

  it('applies impulses and teleports', () => {
    world = new PhysicsWorld(backend, { gravity: [0, 0, 0] });
    const rb = body(RigidBodyType.Dynamic, { mass: 2 });
    const e = entity([0, 0, 0], rb, collider({ type: 'sphere', radius: 0.5 }));
    rb.applyImpulse(vec3.fromValues(4, 0, 0)); // creates the body on demand
    expect(rb.getLinearVelocity()[0]).toBeCloseTo(2); // 4 / 2 kg
    rb.teleport(vec3.fromValues(0, 10, 0), quat.create());
    world.stepOnce();
    expect(e.transform.worldPosition[1]).toBeCloseTo(10);
    expect(e.transform.worldPosition[0]).toBeCloseTo(2 / 60, 3);
  });

  it('steps in fixed steps and interpolates between them', () => {
    world = new PhysicsWorld(backend, { gravity: [0, 0, 0], fixedTimeStep: 0.1 });
    const rb = body();
    const e = entity([0, 0, 0], rb, collider({ type: 'sphere', radius: 0.5 }));
    rb.setLinearVelocity(vec3.fromValues(1, 0, 0));
    world.step(0.25); // two steps (body at x = 0.2), half a step left over
    expect(e.transform.worldPosition[0]).toBeCloseTo(0.15, 3); // drawn halfway between 0.1 and 0.2
    world.step(0.05); // a third step (x = 0.3), nothing left over
    expect(e.transform.worldPosition[0]).toBeCloseTo(0.2, 3); // drawing lags one step behind
    expect(rb.getLinearVelocity()[0]).toBeCloseTo(1);
  });

  it('removes bodies with their entity and registers each body once', () => {
    world = new PhysicsWorld(backend);
    ground();
    const rb = body();
    const e = entity([0, 1, 0], rb, collider({ type: 'sphere', radius: 0.5 }));
    e.initialize(); // initialize() runs again on the behaviours
    world.stepOnce();
    expect(world.raycast(vec3.fromValues(0, 5, 0), vec3.fromValues(0, -1, 0))!.entity).toBe(e);
    e.destroy();
    expect(rb.created).toBe(false);
    world.stepOnce();
    expect(world.raycast(vec3.fromValues(0, 5, 0), vec3.fromValues(0, -1, 0))!.distance).toBeCloseTo(5);
  });

  it('calls step listeners before every fixed step', () => {
    world = new PhysicsWorld(backend, { gravity: [0, 0, 0], fixedTimeStep: 0.1 });
    const rb = body(RigidBodyType.Dynamic, { mass: 2 });
    entity([0, 0, 0], rb, collider({ type: 'sphere', radius: 0.5 }));
    const steps: number[] = [];
    const off = world.onBeforeStep((dt) => {
      steps.push(dt);
      rb.applyImpulse(vec3.fromValues(1, 0, 0)); // +0.5 m/s per step on 2 kg
    });
    world.step(0.3);
    expect(steps).toEqual([0.1, 0.1, 0.1]);
    expect(rb.getLinearVelocity()[0]).toBeCloseTo(1.5);
    off();
    world.stepOnce();
    expect(steps.length).toBe(3);
  });
});

describe('heightfield', () => {
  it('matches the terrain surface, cell diagonals included', async () => {
    const { TerrainGrid } = await import('../src/terrain/terrain-data');
    world = new PhysicsWorld(backend);
    const g = new TerrainGrid({ resolution: 4, size: 8, heightRange: [-10, 10], splatResolution: 4 });
    const c = g.add(0, 0);
    // A bump that makes the two triangles of each cell differ.
    c.heights.forEach((_, k) => (c.heights[k] = ((k * 7) % 5) * 0.6));
    const col = collider({ type: 'heightfield', rows: 4, cols: 4, heights: Array.from(c.heights), size: [8, 8] });
    col.offset = [4, 0, 4];
    entity([10, 1, -3], col);
    world.stepOnce();
    for (const [x, z] of [[0.7, 1.5], [1.5, 0.7], [3.1, 5.9], [6.6, 2.2], [4, 4]]) {
      const hit = world.raycast(vec3.fromValues(10 + x, 20, -3 + z), vec3.fromValues(0, -1, 0), 50);
      expect(hit, `${x}, ${z}`).not.toBeNull();
      expect(hit!.point[1] - 1, `${x}, ${z}`).toBeCloseTo(g.heightAt(x, z)!, 3);
    }
  });
});
