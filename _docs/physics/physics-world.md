## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| PhysicsWorld | [src/physics/physics-world.ts](/src/physics/physics-world.ts) |

This component implements the core physics simulation engine, managing the state, integration, and collision detection for all physical entities within a simulated world. Its primary responsibility is to advance the state of rigid bodies and colliders over discrete time steps, calculating forces, contacts, and resulting motion based on physical laws.

It serves as a central service within the application's architecture, acting as a specialized `EntityBehaviour` that implements `SceneEntityBehaviour`. It integrates with external physics backends (via `PhysicsBackend`) to perform the heavy computation, while exposing interfaces like `onContact` and `step` to allow other parts of the application, such as rendering or game logic, to observe and interact with the simulation state.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `PhysicsWorldOptions` | Interface | Defines configuration parameters for the physics world, including gravity, fixed time step, and interpolation settings. |
| `ContactEvent` | Interface | Describes a contact event between two colliders, noting if the contact has started or ended. |
| `ContactForceEvent` | Interface | Describes a contact event that includes the total contact force exerted between two colliders. |
| `RaycastHit` | Interface | Represents the result of a raycast query, containing hit details like the collider, entity, distance, point, and normal. |
| `PhysicsWorld` | Class | The main simulation manager. It handles the stepping logic, body/collider registration, and event dispatching. |
| `PhysicsWorld.main` | Static Property | A static reference to the currently active `PhysicsWorld` instance. |
| `PhysicsWorld.gravity` | Getter/Setter | Provides controlled access to the world's gravitational vector, updating the underlying backend accordingly. |
| `PhysicsWorld.onContact` | Method | Registers a listener to receive `ContactEvent` notifications, returning an unsubscribe function. |
| `PhysicsWorld.onContactForce` | Method | Registers a listener to receive `ContactForceEvent` notifications, returning an unsubscribe function. |
| `PhysicsWorld.onBeforeStep` | Method | Registers a listener to execute code immediately before each fixed physics step, returning an unsubscribe function. |
| `PhysicsWorld.step` | Method | Advances the simulation by a given elapsed time, handling fixed-step integration and interpolation. |
| `PhysicsWorld.stepOnce` | Method | Executes exactly one fixed physics step, bypassing interpolation for deterministic results. |
| `PhysicsWorld.flush` | Method | Processes all bodies and colliders that were added or modified since the last step, registering them with the backend. |
| `PhysicsWorld.raycast` | Method | Performs a raycast against the physics world, returning a `RaycastHit` if an intersection occurs. |
| `PhysicsWorld.beforeUpdate` | Method | Hook called before the simulation updates, triggering the physics step if not paused. |
| `PhysicsWorld.afterUpdate` | Method | Hook called after the simulation updates. |
| `PhysicsWorld.beforeDraw` | Method | Hook called before rendering begins. |
| `PhysicsWorld.afterDraw` | Method | Hook called after rendering completes. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `PhysicsWorld` manages time integration using an accumulator pattern to ensure physics steps occur at a constant `fixedTimeStep`, even if the frame rate fluctuates. Bodies and colliders are staged (`pendingBodies`, `pendingColliders`) and only registered with the backend during the `flush()` phase. The `step()` method iteratively calls `stepOnce()` until the accumulated time is consumed or the maximum sub-step limit is reached. Transforms are interpolated between the previous and current poses during the `writeTransforms` phase for smooth visual representation.
- **Side Effects:** Mutates the state of the internal `PhysicsBackendWorld` instance (`this.world`). It also mutates the `transform` properties of registered `RigidBodyBehaviour` instances by writing back calculated positions and rotations.
- **Error Handling:** The `step` method includes logic to cap the accumulator if `maxSubSteps` is reached, preventing the simulation from falling excessively behind in a single frame.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [../behaviours/entity-behaviour](/../behaviours/entity-behaviour.md), [../entities/entity](/../entities/entity.md), [../interfaces/scene-behaviour](/../interfaces/scene-behaviour.md), [./collider-behaviour](/./collider-behaviour.md), [./physics-backend](/./physics-backend.md), [./rigid-body-behaviour](/./rigid-body-behaviour.md)