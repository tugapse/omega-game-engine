import { quat, vec3 } from 'gl-matrix';
import { EntityBehaviour } from '../behaviours/entity-behaviour';
import { SceneEntity } from '../entities/entity';
import { SceneEntityBehaviour } from '../interfaces/scene-behaviour';
import { ColliderBehaviour } from './collider-behaviour';
import { BackendColliderDesc, ColliderShape, PhysicsBackend, PhysicsBackendWorld, RigidBodyType } from './physics-backend';
import { RigidBodyBehaviour } from './rigid-body-behaviour';

export interface PhysicsWorldOptions {
  /** Default 0, -9.81, 0. */
  gravity?: ArrayLike<number>;
  /** Seconds per physics step. Default 1/60. */
  fixedTimeStep?: number;
  /** Steps at most per call to step(), so a slow frame does not snowball. Default 5. */
  maxSubSteps?: number;
  /** Draw dynamic bodies between the last two steps, for smooth motion. Default true. */
  interpolate?: boolean;
}

export interface ContactEvent {
  a: ColliderBehaviour;
  b: ColliderBehaviour;
  /** True when the contact starts, false when it ends. */
  started: boolean;
}

export interface ContactForceEvent {
  a: ColliderBehaviour;
  b: ColliderBehaviour;
  /** Total contact force in newtons, above the colliders' threshold. */
  force: number;
}

export interface RaycastHit {
  collider: ColliderBehaviour;
  entity: SceneEntity;
  distance: number;
  point: vec3;
  normal: vec3;
}

/**
 * A physics simulation driven by a {@link PhysicsBackend}. Add it to a scene
 * (`scene.addBehaviour(world)`) to step it every frame, or call
 * {@link step} yourself. Entities take part through
 * {@link RigidBodyBehaviour} and {@link ColliderBehaviour}, which join the
 * world given to them, or else {@link PhysicsWorld.main}.
 *
 * Bodies and colliders are created at the start of the next step (or by
 * {@link flush}), so set an entity's transform before then.
 */
export class PhysicsWorld extends EntityBehaviour implements SceneEntityBehaviour {
  /** The world bodies and colliders join when none is given. The first world created. */
  static main: PhysicsWorld | null = null;

  protected override _className = 'PhysicsWorld';

  readonly backend: PhysicsBackend;
  fixedTimeStep: number;
  maxSubSteps: number;
  interpolate: boolean;
  /** Multiplies the time given to step(); 0.25 = slow motion. */
  timeScale = 1;
  paused = false;

  private readonly world: PhysicsBackendWorld;
  private readonly _gravity: vec3;
  private accumulator = 0;
  private readonly bodies = new Set<RigidBodyBehaviour>();
  private readonly pendingBodies = new Set<RigidBodyBehaviour>();
  private readonly pendingColliders = new Set<ColliderBehaviour>();
  private readonly colliders = new Map<number, ColliderBehaviour>();
  private readonly contactListeners = new Set<(e: ContactEvent) => void>();
  private readonly forceListeners = new Set<(e: ContactForceEvent) => void>();
  private readonly stepListeners = new Set<(dt: number) => void>();

  constructor(backend: PhysicsBackend, options: PhysicsWorldOptions = {}) {
    super();
    this.backend = backend;
    this._gravity = vec3.fromValues(...((options.gravity ?? [0, -9.81, 0]) as [number, number, number]));
    this.fixedTimeStep = options.fixedTimeStep ?? 1 / 60;
    this.maxSubSteps = options.maxSubSteps ?? 5;
    this.interpolate = options.interpolate ?? true;
    this.world = backend.createWorld(this._gravity);
    PhysicsWorld.main ??= this;
    this._serializationIgnoreKeys.push('backend', 'world', 'bodies', 'pendingBodies', 'pendingColliders',
      'colliders', 'contactListeners', 'forceListeners', 'stepListeners', 'accumulator');
  }

  get gravity(): vec3 {
    return vec3.clone(this._gravity);
  }

  set gravity(value: vec3) {
    vec3.copy(this._gravity, value);
    this.world.setGravity(this._gravity);
  }

  /** Calls `listener` for every contact start and end; returns a function that unsubscribes. */
  onContact(listener: (e: ContactEvent) => void): () => void {
    this.contactListeners.add(listener);
    return () => this.contactListeners.delete(listener);
  }

  /** Calls `listener` for contact forces above the colliders' threshold; returns a function that unsubscribes. */
  onContactForce(listener: (e: ContactForceEvent) => void): () => void {
    this.forceListeners.add(listener);
    return () => this.forceListeners.delete(listener);
  }

  /**
   * Calls `listener` before every fixed step with the step length, for forces
   * and impulses that must follow the fixed timestep (custom friction, wind,
   * buoyancy). Returns a function that unsubscribes.
   */
  onBeforeStep(listener: (dt: number) => void): () => void {
    this.stepListeners.add(listener);
    return () => this.stepListeners.delete(listener);
  }

  /**
   * Advances the simulation by `elapsed` seconds (times {@link timeScale}) in
   * fixed steps, then writes the bodies' poses to their entities.
   */
  step(elapsed: number): void {
    const dt = this.fixedTimeStep;
    this.accumulator += Math.max(0, elapsed) * this.timeScale;
    let steps = 0;
    // The epsilon absorbs float error, so 0.25 + 0.05 makes 3 steps of 0.1.
    while (this.accumulator >= dt - 1e-9 && steps < this.maxSubSteps) {
      this.stepOnce();
      this.accumulator = Math.max(0, this.accumulator - dt);
      steps++;
    }
    // Too far behind: drop the rest instead of catching up next frame.
    if (steps === this.maxSubSteps) this.accumulator = Math.min(this.accumulator, dt);
    this.writeTransforms(this.interpolate ? this.accumulator / dt : 1);
  }

  /** Exactly one fixed step, with no interpolation (for tests and replays). */
  stepOnce(): void {
    this.flush();
    for (const listener of this.stepListeners) listener(this.fixedTimeStep);
    for (const body of this.bodies) {
      if (body.bodyType === RigidBodyType.Kinematic && body.transform) {
        this.world.setKinematicTarget(body._handle, body.transform.worldPosition, body.transform.worldRotationQuat);
      }
    }
    this.world.step(this.fixedTimeStep);
    for (const body of this.bodies) {
      if (body.bodyType !== RigidBodyType.Dynamic) continue;
      vec3.copy(body._prevPosition, body._position);
      quat.copy(body._prevRotation, body._rotation);
      this.world.getBodyPose(body._handle, body._position, body._rotation);
    }
    this.dispatchEvents();
    this.writeTransforms(1);
  }

  /** Creates the bodies and colliders added since the last step. */
  flush(): void {
    for (const body of this.pendingBodies) this.createBody(body);
    this.pendingBodies.clear();
    if (!this.pendingColliders.size) return;
    const groups = new Map<RigidBodyBehaviour | null, ColliderBehaviour[]>();
    for (const collider of this.pendingColliders) {
      const body = findBody(collider.parent);
      const key = body && body._handle >= 0 ? body : null;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(collider);
    }
    this.pendingColliders.clear();
    for (const [body, list] of groups) {
      for (const collider of list) this.createCollider(collider, body, body && body.mass > 0 ? body.mass / list.length : 0);
    }
  }

  /**
   * The nearest collider along a ray, or null. Sees colliders as of the last
   * step: ones added since are not hit until the world steps.
   */
  raycast(origin: vec3, direction: vec3, maxDistance = 1000, solid = true): RaycastHit | null {
    const hit = this.world.raycast(origin, direction, maxDistance, solid);
    const collider = hit && this.colliders.get(hit.collider);
    if (!hit || !collider) return null;
    return { collider, entity: collider.parent, distance: hit.distance, point: hit.point, normal: hit.normal };
  }

  // --- scene behaviour hooks ---
  beforeUpdate(elapsed: number): void {
    if (!this.paused) this.step(elapsed);
  }
  afterUpdate(): void {}
  beforeDraw(): void {}
  afterDraw(): void {}

  override destroy(): void {
    for (const body of this.bodies) body._handle = -1;
    for (const collider of this.colliders.values()) collider._handle = -1;
    this.bodies.clear();
    this.colliders.clear();
    this.pendingBodies.clear();
    this.pendingColliders.clear();
    this.world.destroy();
    if (PhysicsWorld.main === this) PhysicsWorld.main = null;
  }

  // --- used by the behaviours ---
  /** @internal */
  _backendWorld(): PhysicsBackendWorld {
    return this.world;
  }

  /** @internal */
  _addBody(body: RigidBodyBehaviour): void {
    // initialize() can run twice (addBehaviour, then the entity's initialize).
    if (body._handle < 0) this.pendingBodies.add(body);
  }

  /** @internal */
  _removeBody(body: RigidBodyBehaviour): void {
    this.pendingBodies.delete(body);
    if (body._handle < 0) return;
    // The backend removes the body's colliders with it.
    for (const [handle, collider] of this.colliders) {
      if (collider._body === body) {
        this.colliders.delete(handle);
        collider._handle = -1;
        collider._body = null;
      }
    }
    this.world.removeBody(body._handle);
    this.bodies.delete(body);
    body._handle = -1;
  }

  /** @internal */
  _addCollider(collider: ColliderBehaviour): void {
    if (collider._handle < 0) this.pendingColliders.add(collider);
  }

  /** @internal */
  _removeCollider(collider: ColliderBehaviour): void {
    this.pendingColliders.delete(collider);
    if (collider._handle < 0) return;
    this.world.removeCollider(collider._handle);
    this.colliders.delete(collider._handle);
    collider._handle = -1;
    collider._body = null;
  }

  private createBody(body: RigidBodyBehaviour): void {
    const t = body.transform;
    if (!t) return;
    const position = t.worldPosition, rotation = t.worldRotationQuat;
    body._handle = this.world.createBody({
      type: body.bodyType, position, rotation,
      linearDamping: body.linearDamping, angularDamping: body.angularDamping,
      ccd: body.ccd, gravityScale: body.gravityScale, canSleep: body.canSleep,
    });
    body._resetPose(position, rotation);
    this.bodies.add(body);
  }

  private createCollider(collider: ColliderBehaviour, body: RigidBodyBehaviour | null, shareOfMass: number): void {
    const t = collider.transform;
    if (!t) return;
    const scale = t.worldScale;
    const colliderRotation = t.worldRotationQuat;
    // The offset is in the entity's local space, so it scales and turns with it.
    const offset = vec3.transformQuat(vec3.create(), vec3.mul(vec3.create(), vec3.fromValues(collider.offset[0], collider.offset[1], collider.offset[2]), scale), colliderRotation);
    const worldPosition = vec3.add(vec3.create(), t.worldPosition, offset);
    let position = worldPosition, rotation = colliderRotation;
    if (body) {
      // Relative to the body's pose.
      const inv = quat.invert(quat.create(), body._rotation);
      position = vec3.transformQuat(vec3.create(), vec3.sub(vec3.create(), worldPosition, body._position), inv);
      rotation = quat.mul(quat.create(), inv, colliderRotation);
    }
    const desc: BackendColliderDesc = {
      shape: scaleShape(collider.shape, scale), position, rotation,
      friction: collider.friction, restitution: collider.restitution,
      density: collider.density, mass: collider.mass > 0 ? collider.mass : shareOfMass,
      sensor: collider.sensor, contactEvents: collider.contactEvents,
      contactForceThreshold: collider.contactForceThreshold,
    };
    collider._handle = this.world.createCollider(desc, body ? body._handle : null);
    collider._body = body;
    this.colliders.set(collider._handle, collider);
  }

  private writeTransforms(alpha: number): void {
    const p = vec3.create(), r = quat.create();
    for (const body of this.bodies) {
      if (body.bodyType !== RigidBodyType.Dynamic || !body.transform) continue;
      if (alpha >= 1) {
        vec3.copy(p, body._position);
        quat.copy(r, body._rotation);
      } else {
        vec3.lerp(p, body._prevPosition, body._position, alpha);
        quat.slerp(r, body._prevRotation, body._rotation, alpha);
      }
      body.transform.worldPosition = p;
      body.transform.worldRotationQuat = r;
    }
  }

  private dispatchEvents(): void {
    this.world.drainEvents(
      (ha, hb, started) => {
        const a = this.colliders.get(ha), b = this.colliders.get(hb);
        if (!a || !b) return;
        const e: ContactEvent = { a, b, started };
        a.onContact?.(e, b);
        b.onContact?.(e, a);
        for (const listener of this.contactListeners) listener(e);
      },
      (ha, hb, force) => {
        const a = this.colliders.get(ha), b = this.colliders.get(hb);
        if (!a || !b) return;
        const e: ContactForceEvent = { a, b, force };
        for (const listener of this.forceListeners) listener(e);
      },
    );
  }
}

/** The rigid body on the entity, or else on its nearest ancestor. */
function findBody(entity: SceneEntity | undefined): RigidBodyBehaviour | null {
  for (let t = entity?.transform; t; t = t.parent ?? undefined) {
    const body = t.parentEntity?.getBehaviour(RigidBodyBehaviour);
    if (body) return body;
  }
  return null;
}

/** The shape grown by the entity's world scale. */
function scaleShape(shape: ColliderShape, s: vec3): ColliderShape {
  const sx = Math.abs(s[0]), sy = Math.abs(s[1]), sz = Math.abs(s[2]);
  switch (shape.type) {
    case 'sphere': return { type: 'sphere', radius: shape.radius * Math.max(sx, sy, sz) };
    case 'box': return { type: 'box', halfExtents: [shape.halfExtents[0] * sx, shape.halfExtents[1] * sy, shape.halfExtents[2] * sz] };
    case 'capsule':
    case 'cylinder': return { type: shape.type, halfHeight: shape.halfHeight * sy, radius: shape.radius * Math.max(sx, sz) };
    case 'convexHull': return { type: 'convexHull', points: shape.points.map((x, i) => x * [sx, sy, sz][i % 3]) };
    case 'trimesh': return { type: 'trimesh', vertices: shape.vertices.map((x, i) => x * [sx, sy, sz][i % 3]), indices: shape.indices };
    case 'heightfield': return {
      type: 'heightfield', rows: shape.rows, cols: shape.cols, size: [shape.size[0] * sx, shape.size[1] * sz],
      heights: sy === 1 ? shape.heights : Array.from(shape.heights, (h) => h * sy),
    };
  }
}
