import { quat, vec3 } from 'gl-matrix';
import { EntityBehaviour } from '../behaviours/entity-behaviour';
import { JsonSerializedData } from '../interfaces/json-serialized-data';
import { RigidBodyType } from './physics-backend';
import { PhysicsWorld } from './physics-world';

/**
 * Makes an entity a rigid body of a {@link PhysicsWorld}. Its shape comes from
 * the {@link ColliderBehaviour}s on the entity and on its children.
 *
 * - Dynamic: the world moves the entity; move it yourself only with {@link teleport}.
 * - Kinematic: you move the entity's transform; the body follows and pushes dynamic bodies.
 * - Fixed: placed once, never moves.
 *
 * Change the settings before the body is created (the next step); later changes need a new body.
 */
export class RigidBodyBehaviour extends EntityBehaviour {
  static override instanciate(): RigidBodyBehaviour {
    return new RigidBodyBehaviour();
  }
  protected override _className = 'RigidBodyBehaviour';

  bodyType: RigidBodyType = RigidBodyType.Dynamic;
  /** Total mass in kg, shared by its colliders; 0 = from the colliders' density. */
  mass = 0;
  linearDamping = 0;
  angularDamping = 0.05;
  /** Continuous collision detection, for fast bodies. */
  ccd = false;
  gravityScale = 1;
  canSleep = true;
  /** The world to join; null = PhysicsWorld.main when initialised. */
  world: PhysicsWorld | null = null;

  /** @internal */ _handle = -1;
  /** @internal */ _position = vec3.create();
  /** @internal */ _rotation = quat.create();
  /** @internal */ _prevPosition = vec3.create();
  /** @internal */ _prevRotation = quat.create();

  constructor() {
    super();
    this._serializationIgnoreKeys.push('world', '_handle', '_position', '_rotation', '_prevPosition', '_prevRotation');
  }

  override initialize(): boolean {
    this.world ??= PhysicsWorld.main;
    if (!this.world) console.warn('RigidBodyBehaviour: no PhysicsWorld; create one before adding bodies.');
    this.world?._addBody(this);
    return super.initialize();
  }

  override destroy(): void {
    this.world?._removeBody(this);
  }

  /** True once the body exists in the simulation. */
  get created(): boolean {
    return this._handle >= 0;
  }

  get isSleeping(): boolean {
    return this.backend() ? this.backend()!.isSleeping(this._handle) : false;
  }

  wakeUp(): void {
    this.backend()?.wakeUp(this._handle);
  }

  getLinearVelocity(out = vec3.create()): vec3 {
    return this.backend()?.getLinearVelocity(this._handle, out) ?? vec3.zero(out);
  }

  setLinearVelocity(velocity: vec3): void {
    this.backend()?.setLinearVelocity(this._handle, velocity);
  }

  getAngularVelocity(out = vec3.create()): vec3 {
    return this.backend()?.getAngularVelocity(this._handle, out) ?? vec3.zero(out);
  }

  /** Radians per second around each world axis. */
  setAngularVelocity(velocity: vec3): void {
    this.backend()?.setAngularVelocity(this._handle, velocity);
  }

  /** Instant change of momentum (kg·m/s), at the centre of mass or at a world point. */
  applyImpulse(impulse: vec3, point?: vec3): void {
    this.backend()?.applyImpulse(this._handle, impulse, point);
  }

  applyTorqueImpulse(impulse: vec3): void {
    this.backend()?.applyTorqueImpulse(this._handle, impulse);
  }

  /** A force (newtons) applied every step until {@link resetForces}. */
  addForce(force: vec3): void {
    this.backend()?.addForce(this._handle, force);
  }

  resetForces(): void {
    this.backend()?.resetForces(this._handle);
  }

  /** Moves the body and its entity at once, with no interpolation; velocities are kept. */
  teleport(position: vec3, rotation: quat = this.transform.worldRotationQuat): void {
    this.transform.worldPosition = position;
    this.transform.worldRotationQuat = rotation;
    const world = this.backend();
    if (!world) return;
    world.setBodyPose(this._handle, position, rotation);
    this._resetPose(position, rotation);
  }

  /** @internal */
  _resetPose(position: vec3, rotation: quat): void {
    vec3.copy(this._position, position);
    vec3.copy(this._prevPosition, position);
    quat.copy(this._rotation, rotation);
    quat.copy(this._prevRotation, rotation);
  }

  /** The backend world with this body created (flushing pending bodies first), or null. */
  private backend() {
    if (!this.world) return null;
    if (this._handle < 0) this.world.flush();
    return this._handle >= 0 ? this.world._backendWorld() : null;
  }

  override toJsonObject(): JsonSerializedData {
    return this.serializeAutomatically();
  }

  override fromJson(jsonObject: JsonSerializedData): void {
    super.fromJson(jsonObject);
    this.deserializeAutomatically(jsonObject);
  }
}
