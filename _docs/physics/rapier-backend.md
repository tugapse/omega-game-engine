## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| RapierBackend | [src/physics/rapier-backend.ts](/src/physics/rapier-backend.ts) |

This component provides a concrete implementation of the `PhysicsBackend` interface using the `@dimforge/rapier3d-compat` library. Its primary responsibility is to abstract the complex physics simulation logic of Rapier 3D into a standardized interface that the rest of the engine can consume, allowing the game to utilize physics without directly depending on the underlying physics engine implementation.

This class acts as a service provider within the physics subsystem. It manages the lifecycle of the physics world, including initialization via the static `load` method, and exposes methods to create, manipulate, and query rigid bodies and colliders. It integrates with the broader architecture by providing the `PhysicsBackendWorld` implementation, which is used by higher-level systems to simulate time steps and handle physics interactions.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `RapierBackend` | Class | Implements `PhysicsBackend`. Manages the Rapier module instance and provides factory methods for creating physics worlds. |
| `RapierBackend.load` | Static Method | Asynchronously initializes the Rapier module (loading WebAssembly) and returns a configured `RapierBackend` instance. |
| `RapierBackend.createWorld` | Method | Creates and returns a new `PhysicsBackendWorld` instance, initialized with the provided gravity vector. |
| `RapierWorld` | Class | Implements `PhysicsBackendWorld`. Encapsulates the Rapier `World` and `EventQueue`, handling the simulation loop and object management. |
| `RapierWorld.setGravity` | Method | Updates the gravitational acceleration applied to the physics world. |
| `RapierWorld.step` | Method | Advances the physics simulation by the given time delta (`dt`). |
| `RapierWorld.createBody` | Method | Creates a new rigid body in the world based on the provided `BackendBodyDesc`, returning its unique handle. |
| `RapierWorld.removeBody` | Method | Removes a rigid body from the simulation using its handle. |
| `RapierWorld.createCollider` | Method | Creates a new collider attached to an optional rigid body, based on `BackendColliderDesc`, returning its unique handle. |
| `RapierWorld.removeCollider` | Method | Removes a collider from the simulation using its handle. |
| `RapierWorld.getBodyPose` | Method | Retrieves the current position and rotation (pose) of a specified rigid body. |
| `RapierWorld.setBodyPose` | Method | Forces a rigid body to adopt a specific position and rotation. |
| `RapierWorld.setKinematicTarget` | Method | Sets the target position and rotation for a kinematic rigid body for the next step. |
| `RapierWorld.getLinearVelocity` | Method | Retrieves the linear velocity vector of a specified rigid body. |
| `RapierWorld.setLinearVelocity` | Method | Sets the linear velocity vector of a specified rigid body. |
| `RapierWorld.getAngularVelocity` | Method | Retrieves the angular velocity vector of a specified rigid body. |
| `RapierWorld.setAngularVelocity` | Method | Sets the angular velocity vector of a specified rigid body. |
| `RapierWorld.applyImpulse` | Method | Applies an impulse (force applied over a short time) to a body, optionally at a specific point. |
| `RapierWorld.applyTorqueImpulse` | Method | Applies a torque impulse to a body. |
| `RapierWorld.addForce` | Method | Applies a continuous force to a body. |
| `RapierWorld.resetForces` | Method | Clears accumulated forces on a specified body. |
| `RapierWorld.isSleeping` | Method | Checks if a rigid body is currently inactive (sleeping). |
| `RapierWorld.wakeUp` | Method | Forces a sleeping rigid body to become active. |
| `RapierWorld.raycast` | Method | Performs a raycast query against the physics world, returning hit information or null. |
| `RapierWorld.drainEvents` | Method | Processes and consumes all pending collision and contact force events from the physics world. |
| `RapierWorld.destroy` | Method | Cleans up all resources associated with the physics world and event queue. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `RapierBackend` acts as a wrapper, delegating all heavy lifting to the imported `RapierModule`. `RapierWorld` manages the simulation state by calling `world.step(events)` to advance time. Body creation translates engine-specific `BackendBodyDesc` into Rapier's `RigidBodyDesc` using helper functions (`v`, `q`) to map coordinate systems. Collider creation involves a complex `switch` statement in `shapeDesc` to translate various geometric shapes (sphere, box, trimesh, heightfield) into the appropriate Rapier `ColliderDesc`.
- **Side Effects:** The code interacts with external state by initializing and running the WebAssembly module provided by `@dimforge/rapier3d-compat`. It mutates the internal state of the `RapierModule.World` and `RapierModule.EventQueue` during simulation steps and event draining.
- **Error Handling:** The `shapeDesc` method explicitly throws an `Error` if a `convexHull` shape is determined to be degenerate.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [./physics-backend](/src/physics/physics-backend.ts)