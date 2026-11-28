## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| ColliderBehaviour | [src/physics/collider-behaviour.ts](/src/physics/collider-behaviour.ts) |

This component defines the `ColliderBehaviour`, which represents a collision shape attached to an entity. Its primary responsibility is to define the physical geometry of an entity—such as a box—and manage its interaction properties like friction, restitution, and mass. It handles the lifecycle of the collider, ensuring it is correctly registered with the physics simulation environment.

Architecturally, `ColliderBehaviour` inherits from `EntityBehaviour` and integrates deeply into the physics subsystem. It relies on `ColliderShape` for geometric definition and interacts with the `PhysicsWorld` to perform collision detection and response. It can optionally be linked to a `RigidBodyBehaviour` to participate actively in dynamic physics simulations.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `ColliderBehaviour` | Class | Represents a collision shape on an entity, managing its physical properties and interaction with the physics world. |
| `body` | Getter | Returns the associated `RigidBodyBehaviour` for this collider, or `null` if it is a fixed collider. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The class initializes by setting up its shape and physical parameters. In `initialize()`, it ensures a `PhysicsWorld` is available (defaulting to `PhysicsWorld.main`) and registers itself with that world via `_addCollider`. The `destroy()` method ensures proper cleanup by calling `_removeCollider` on the associated world. Serialization methods (`toJsonObject`, `fromJson`) handle persistence, ignoring transient state like `world` and `onContact`.
- **Side Effects:** Mutates external state by registering and unregistering itself with the `PhysicsWorld` instance.
- **Error Handling:** Issues a warning via `console.warn` if `initialize()` is called without an associated `PhysicsWorld`.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [EntityBehaviour](/src/behaviours/entity-behaviour.ts), [JsonSerializedData](/src/interfaces/json-serialized-data.ts), [ColliderShape](/src/physics/physics-backend.ts), [RigidBodyBehaviour](/src/physics/rigid-body-behaviour.ts), [ContactEvent](/src/physics/physics-world.ts), [PhysicsWorld](/src/physics/physics-world.ts)