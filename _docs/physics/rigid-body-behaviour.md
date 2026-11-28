## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **RigidBodyBehaviour** | [src/physics/rigid-body-behaviour.ts](/src/physics/rigid-body-behaviour.ts) |

This component implements the logic necessary to treat an entity as a rigid body within a physics simulation managed by a [PhysicsWorld](/src/physics/physics-world.md). It encapsulates physical properties such as mass, damping, gravity scaling, and collision detection settings, allowing the entity to interact dynamically with other objects in the simulation.

It serves as a core service layer component within the application's physics subsystem. It bridges the high-level entity structure with the low-level physics backend via the [PhysicsWorld](/src/physics/physics-world.md), managing the lifecycle of the physics body (creation, destruction, state updates) associated with the entity.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `RigidBodyBehaviour` | Class | Manages the entity's physical representation in the simulation. |
| `RigidBodyBehaviour.instanciate()` | Static Method | Factory method to create a new instance of `RigidBodyBehaviour`. |
| `created` | Getter | Returns true if the physics body has been successfully created in the simulation. |
| `isSleeping` | Getter | Checks if the associated physics body is currently in a sleeping state. |
| `wakeUp()` | Method | Forces the associated physics body to wake up from a sleeping state. |
| `getLinearVelocity(out)` | Method | Retrieves the linear velocity of the body, populating the provided output vector. |
| `setLinearVelocity(velocity)` | Method | Sets the linear velocity of the body to the specified vector. |
| `getAngularVelocity(out)` | Method | Retrieves the angular velocity of the body, populating the provided output vector. |
| `setAngularVelocity(velocity)` | Method | Sets the angular velocity of the body to the specified vector. |
| `applyImpulse(impulse, point)` | Method | Applies an instantaneous linear impulse to the body, optionally at a specific point. |
| `applyTorqueImpulse(impulse)` | Method | Applies an instantaneous rotational impulse (torque impulse) to the body. |
| `addForce(force)` | Method | Applies a continuous force to the body that persists until forces are reset. |
| `resetForces()` | Method | Clears all accumulated forces applied to the body for the current simulation step. |
| `teleport(position, rotation)` | Method | Instantly moves and rotates the body and its associated entity, preserving current velocities. |
| `toJsonObject()` | Method | Serializes the current state of the rigid body into a `JsonSerializedData` structure. |
| `fromJson(jsonObject)` | Method | Deserializes the rigid body state from a `JsonSerializedData` structure. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The class manages the lifecycle of a physics body by interacting with a `PhysicsWorld`. Initialization involves registering the body with the world, while destruction removes it. State retrieval and modification methods (like `setLinearVelocity` or `applyImpulse`) delegate operations to the underlying physics backend via the `backend()` accessor. The `teleport` method ensures both the entity's transform and the physics body's pose are updated synchronously.
- **Side Effects:** Mutates external state by registering and deregistering bodies within the [PhysicsWorld](/src/physics/physics-world.md). It directly interacts with the physics backend to modify physical properties and state.
- **Error Handling:** If `this.world` is null during initialization, a warning is logged via `console.warn`. The `backend()` method returns `null` if the world is not set or if the body handle (`_handle`) is invalid, preventing crashes during state access.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [EntityBehaviour](/src/behaviours/entity-behaviour.md), [JsonSerializedData](/src/interfaces/json-serialized-data.md), [RigidBodyType](/src/physics/physics-backend.md), [PhysicsWorld](/src/physics/physics-world.md)