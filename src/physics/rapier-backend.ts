import { quat, vec3 } from 'gl-matrix';
import type * as RapierModule from '@dimforge/rapier3d-compat';
import {
  BackendBodyDesc, BackendColliderDesc, BackendRaycastHit, ColliderShape,
  PhysicsBackend, PhysicsBackendWorld, RigidBodyType,
} from './physics-backend';

type R = typeof RapierModule;

/**
 * The Rapier 3D backend. The engine does not import Rapier: the game passes
 * the module in, so the WebAssembly is only loaded by games that use physics.
 *
 * ```ts
 * import RAPIER from '@dimforge/rapier3d-compat';
 * const world = new PhysicsWorld(await RapierBackend.load(RAPIER));
 * ```
 */
export class RapierBackend implements PhysicsBackend {
  readonly name = 'rapier';
  private readonly rapier: R;

  /** `rapier` = the `@dimforge/rapier3d-compat` module, already initialised. */
  constructor(rapier: object) {
    this.rapier = rapier as R;
  }

  /** Initialises the module (loads the WebAssembly) and returns the backend. */
  static async load(rapier: { init(): Promise<void> }): Promise<RapierBackend> {
    await rapier.init();
    return new RapierBackend(rapier);
  }

  createWorld(gravity: vec3): PhysicsBackendWorld {
    return new RapierWorld(this.rapier, gravity);
  }
}

const v = (a: ArrayLike<number>) => ({ x: a[0], y: a[1], z: a[2] });
const q = (a: ArrayLike<number>) => ({ x: a[0], y: a[1], z: a[2], w: a[3] });

class RapierWorld implements PhysicsBackendWorld {
  private readonly world: RapierModule.World;
  private readonly events: RapierModule.EventQueue;

  constructor(private readonly R: R, gravity: vec3) {
    this.world = new R.World(v(gravity));
    this.events = new R.EventQueue(true);
  }

  setGravity(gravity: vec3): void {
    this.world.gravity = v(gravity);
  }

  step(dt: number): void {
    this.world.timestep = dt;
    this.world.step(this.events);
  }

  createBody(d: BackendBodyDesc): number {
    const { RigidBodyDesc } = this.R;
    const desc = d.type === RigidBodyType.Dynamic ? RigidBodyDesc.dynamic()
      : d.type === RigidBodyType.Kinematic ? RigidBodyDesc.kinematicPositionBased()
        : RigidBodyDesc.fixed();
    desc.setTranslation(d.position[0], d.position[1], d.position[2])
      .setRotation(q(d.rotation))
      .setLinearDamping(d.linearDamping)
      .setAngularDamping(d.angularDamping)
      .setCcdEnabled(d.ccd)
      .setGravityScale(d.gravityScale)
      .setCanSleep(d.canSleep);
    return this.world.createRigidBody(desc).handle;
  }

  removeBody(body: number): void {
    const b = this.world.getRigidBody(body);
    if (b) this.world.removeRigidBody(b);
  }

  createCollider(d: BackendColliderDesc, body: number | null): number {
    const desc = this.shapeDesc(d.shape);
    desc.setTranslation(d.position[0], d.position[1], d.position[2])
      .setRotation(q(d.rotation))
      .setFriction(d.friction)
      .setRestitution(d.restitution)
      .setSensor(d.sensor);
    if (d.mass > 0) desc.setMass(d.mass);
    else desc.setDensity(d.density);
    let events = 0;
    if (d.contactEvents) events |= this.R.ActiveEvents.COLLISION_EVENTS;
    if (d.contactForceThreshold >= 0) {
      events |= this.R.ActiveEvents.CONTACT_FORCE_EVENTS;
      desc.setContactForceEventThreshold(d.contactForceThreshold);
    }
    if (events) desc.setActiveEvents(events);
    const parent = body === null ? undefined : this.world.getRigidBody(body);
    return this.world.createCollider(desc, parent).handle;
  }

  private shapeDesc(shape: ColliderShape): RapierModule.ColliderDesc {
    const { ColliderDesc } = this.R;
    switch (shape.type) {
      case 'sphere': return ColliderDesc.ball(shape.radius);
      case 'box': return ColliderDesc.cuboid(shape.halfExtents[0], shape.halfExtents[1], shape.halfExtents[2]);
      case 'capsule': return ColliderDesc.capsule(shape.halfHeight, shape.radius);
      case 'cylinder': return ColliderDesc.cylinder(shape.halfHeight, shape.radius);
      case 'convexHull': {
        const desc = ColliderDesc.convexHull(new Float32Array(shape.points));
        if (!desc) throw new Error('Physics: the convex hull points are degenerate');
        return desc;
      }
      case 'trimesh': return ColliderDesc.trimesh(new Float32Array(shape.vertices), new Uint32Array(shape.indices));
      case 'heightfield': {
        // Rapier wants the matrix column by column, its rows along z.
        const { rows, cols, heights } = shape;
        const m = new Float32Array((rows + 1) * (cols + 1));
        for (let j = 0; j <= rows; j++) for (let i = 0; i <= cols; i++) m[i * (rows + 1) + j] = heights[j * (cols + 1) + i];
        return ColliderDesc.heightfield(rows, cols, m, { x: shape.size[0], y: 1, z: shape.size[1] });
      }
    }
  }

  removeCollider(collider: number): void {
    const c = this.world.getCollider(collider);
    if (c) this.world.removeCollider(c, true);
  }

  private body(handle: number): RapierModule.RigidBody {
    return this.world.getRigidBody(handle);
  }

  getBodyPose(body: number, position: vec3, rotation: quat): void {
    const b = this.body(body);
    const t = b.translation(), r = b.rotation();
    vec3.set(position, t.x, t.y, t.z);
    quat.set(rotation, r.x, r.y, r.z, r.w);
  }

  setBodyPose(body: number, position: vec3, rotation: quat): void {
    const b = this.body(body);
    b.setTranslation(v(position), true);
    b.setRotation(q(rotation), true);
  }

  setKinematicTarget(body: number, position: vec3, rotation: quat): void {
    const b = this.body(body);
    b.setNextKinematicTranslation(v(position));
    b.setNextKinematicRotation(q(rotation));
  }

  getLinearVelocity(body: number, out: vec3): vec3 {
    const l = this.body(body).linvel();
    return vec3.set(out, l.x, l.y, l.z);
  }

  setLinearVelocity(body: number, velocity: vec3): void {
    this.body(body).setLinvel(v(velocity), true);
  }

  getAngularVelocity(body: number, out: vec3): vec3 {
    const a = this.body(body).angvel();
    return vec3.set(out, a.x, a.y, a.z);
  }

  setAngularVelocity(body: number, velocity: vec3): void {
    this.body(body).setAngvel(v(velocity), true);
  }

  applyImpulse(body: number, impulse: vec3, point?: vec3): void {
    if (point) this.body(body).applyImpulseAtPoint(v(impulse), v(point), true);
    else this.body(body).applyImpulse(v(impulse), true);
  }

  applyTorqueImpulse(body: number, impulse: vec3): void {
    this.body(body).applyTorqueImpulse(v(impulse), true);
  }

  addForce(body: number, force: vec3): void {
    this.body(body).addForce(v(force), true);
  }

  resetForces(body: number): void {
    this.body(body).resetForces(true);
  }

  isSleeping(body: number): boolean {
    return this.body(body).isSleeping();
  }

  wakeUp(body: number): void {
    this.body(body).wakeUp();
  }

  raycast(origin: vec3, direction: vec3, maxDistance: number, solid: boolean): BackendRaycastHit | null {
    const dir = vec3.normalize(vec3.create(), direction);
    const hit = this.world.castRayAndGetNormal(new this.R.Ray(v(origin), v(dir)), maxDistance, solid);
    if (!hit) return null;
    const distance = hit.timeOfImpact;
    return {
      collider: hit.collider.handle,
      distance,
      point: vec3.scaleAndAdd(vec3.create(), origin, dir, distance),
      normal: vec3.fromValues(hit.normal.x, hit.normal.y, hit.normal.z),
    };
  }

  drainEvents(
    onContact: (a: number, b: number, started: boolean) => void,
    onContactForce: (a: number, b: number, force: number) => void,
  ): void {
    this.events.drainCollisionEvents((a, b, started) => onContact(a, b, started));
    this.events.drainContactForceEvents((e) => onContactForce(e.collider1(), e.collider2(), e.totalForceMagnitude()));
  }

  destroy(): void {
    this.events.free();
    this.world.free();
  }
}
