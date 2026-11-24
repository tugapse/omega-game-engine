import { quat, vec3 } from 'gl-matrix';

/**
 * The contract between Omega's physics API and a physics engine. The engine
 * code (PhysicsWorld, RigidBodyBehaviour, ColliderBehaviour) only talks to
 * these interfaces, so the engine behind them (Rapier today) can be swapped
 * by writing another backend. Bodies and colliders are plain numeric handles.
 */
export interface PhysicsBackend {
  /** A short name, e.g. "rapier". */
  readonly name: string;
  createWorld(gravity: vec3): PhysicsBackendWorld;
}

/** How a rigid body moves. */
export enum RigidBodyType {
  /** Moved by forces, gravity and contacts. */
  Dynamic = 'dynamic',
  /** Never moves (floors, walls). */
  Fixed = 'fixed',
  /** Moved by code through its entity's transform; pushes dynamic bodies but is not pushed. */
  Kinematic = 'kinematic',
}

/** A collision shape, in the collider's own space (centred on it). Sizes in world units. */
export type ColliderShape =
  | { type: 'sphere'; radius: number }
  | { type: 'box'; halfExtents: [number, number, number] }
  /** Along the Y axis: halfHeight is the straight part, without the caps. */
  | { type: 'capsule'; halfHeight: number; radius: number }
  /** Along the Y axis. */
  | { type: 'cylinder'; halfHeight: number; radius: number }
  /** Flat x, y, z list of points; the shape is their convex hull. */
  | { type: 'convexHull'; points: number[] }
  /** Triangle mesh, for fixed bodies only (no volume, so no mass). */
  | { type: 'trimesh'; vertices: number[]; indices: number[] }
  /**
   * A grid of heights, for fixed bodies only (terrain chunks): (cols+1) ×
   * (rows+1) heights, row by row along z (heights[j·(cols+1) + i], i along x),
   * spanning size[0] along x and size[1] along z, centred on the collider.
   * Each cell is split along the diagonal from (i, j) to (i+1, j+1).
   */
  | { type: 'heightfield'; rows: number; cols: number; heights: ArrayLike<number>; size: [number, number] };

export interface BackendBodyDesc {
  type: RigidBodyType;
  position: vec3;
  rotation: quat;
  linearDamping: number;
  angularDamping: number;
  /** Continuous collision detection, so fast bodies do not pass through thin ones. */
  ccd: boolean;
  gravityScale: number;
  canSleep: boolean;
}

export interface BackendColliderDesc {
  shape: ColliderShape;
  /** Relative to the body, or in world space when the collider has no body. */
  position: vec3;
  rotation: quat;
  friction: number;
  restitution: number;
  density: number;
  /** When above 0, overrides the mass that the density would give. */
  mass: number;
  sensor: boolean;
  /** Reports contact start and end. */
  contactEvents: boolean;
  /** Reports contact forces above this magnitude (newtons); below 0 = off. */
  contactForceThreshold: number;
}

export interface BackendRaycastHit {
  collider: number;
  distance: number;
  point: vec3;
  normal: vec3;
}

/** One simulated world inside a backend. */
export interface PhysicsBackendWorld {
  setGravity(gravity: vec3): void;
  /** Advances the simulation by dt seconds. */
  step(dt: number): void;

  createBody(desc: BackendBodyDesc): number;
  removeBody(body: number): void;
  /** `body` null = a fixed collider placed in world space. */
  createCollider(desc: BackendColliderDesc, body: number | null): number;
  removeCollider(collider: number): void;

  getBodyPose(body: number, position: vec3, rotation: quat): void;
  /** Moves the body at once (a teleport). */
  setBodyPose(body: number, position: vec3, rotation: quat): void;
  /** For kinematic bodies: where the body must be at the end of the next step. */
  setKinematicTarget(body: number, position: vec3, rotation: quat): void;

  getLinearVelocity(body: number, out: vec3): vec3;
  setLinearVelocity(body: number, velocity: vec3): void;
  getAngularVelocity(body: number, out: vec3): vec3;
  setAngularVelocity(body: number, velocity: vec3): void;
  /** An instant change of momentum, at the centre of mass or at a world point. */
  applyImpulse(body: number, impulse: vec3, point?: vec3): void;
  applyTorqueImpulse(body: number, impulse: vec3): void;
  /** A force kept until resetForces. */
  addForce(body: number, force: vec3): void;
  resetForces(body: number): void;
  isSleeping(body: number): boolean;
  wakeUp(body: number): void;

  /** The nearest hit along a ray; `direction` need not be normalised. */
  raycast(origin: vec3, direction: vec3, maxDistance: number, solid: boolean): BackendRaycastHit | null;
  /** Hands over the events of the last step, then forgets them. */
  drainEvents(
    onContact: (colliderA: number, colliderB: number, started: boolean) => void,
    onContactForce: (colliderA: number, colliderB: number, force: number) => void,
  ): void;
  destroy(): void;
}
