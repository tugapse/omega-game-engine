import { EntityBehaviour } from '../behaviours/entity-behaviour';
import { JsonSerializedData } from '../interfaces/json-serialized-data';
import { ColliderShape } from './physics-backend';
import type { RigidBodyBehaviour } from './rigid-body-behaviour';
import { ContactEvent, PhysicsWorld } from './physics-world';

/**
 * A collision shape on an entity, sized in the entity's local units (it grows
 * with the entity's scale). It belongs to the {@link RigidBodyBehaviour} on
 * the entity or on its nearest ancestor; with none, it is a fixed collider
 * that stays where the entity was when it was created.
 */
export class ColliderBehaviour extends EntityBehaviour {
  static override instanciate(): ColliderBehaviour {
    return new ColliderBehaviour();
  }
  protected override _className = 'ColliderBehaviour';

  shape: ColliderShape = { type: 'box', halfExtents: [0.5, 0.5, 0.5] };
  /** Centre of the shape in the entity's local space. */
  offset: number[] = [0, 0, 0];
  friction = 0.5;
  /** Bounciness, 0 to 1. */
  restitution = 0;
  /** kg per cubic unit, used when neither this collider nor its body sets a mass. */
  density = 1;
  /** Mass in kg; 0 = from the body's mass or the density. */
  mass = 0;
  /** Detects overlaps (contact events) without pushing anything. */
  sensor = false;
  /** Report contact start and end (to onContact and the world's listeners). */
  contactEvents = false;
  /** Report contact forces above this many newtons to the world; below 0 = off. */
  contactForceThreshold = -1;
  /** Called on each contact start and end of this collider. */
  onContact?: (event: ContactEvent, other: ColliderBehaviour) => void;
  /** The world to join; null = PhysicsWorld.main when initialised. */
  world: PhysicsWorld | null = null;

  /** @internal */ _handle = -1;
  /** @internal */ _body: RigidBodyBehaviour | null = null;

  constructor(shape?: ColliderShape) {
    super();
    if (shape) this.shape = shape;
    this._serializationIgnoreKeys.push('world', 'onContact', '_handle', '_body');
  }

  override initialize(): boolean {
    this.world ??= PhysicsWorld.main;
    if (!this.world) console.warn('ColliderBehaviour: no PhysicsWorld; create one before adding colliders.');
    this.world?._addCollider(this);
    return super.initialize();
  }

  override destroy(): void {
    this.world?._removeCollider(this);
  }

  /** The body this collider belongs to, once created (null for fixed colliders). */
  get body(): RigidBodyBehaviour | null {
    return this._body;
  }

  override toJsonObject(): JsonSerializedData {
    return this.serializeAutomatically();
  }

  override fromJson(jsonObject: JsonSerializedData): void {
    super.fromJson(jsonObject);
    this.deserializeAutomatically(jsonObject);
  }
}
