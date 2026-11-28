## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| PhysicsBackend | [src/physics/physics-backend.ts](/src/physics/physics-backend.ts) |

This component defines the abstract contract for integrating a specific physics engine (like Rapier) into Omega's core simulation loop. It establishes a set of interfaces (`PhysicsBackend`, `PhysicsBackendWorld`) that decouple the high-level game logic from the low-level implementation details of the physics solver. This allows the engine to swap underlying physics libraries without modifying the rest of the application code.

This file serves as a critical service layer interface definition. It acts as the boundary between the application's simulation logic and the concrete physics engine implementation. Consumers interact with these interfaces to create, manipulate, and query the state of simulated bodies and colliders, ensuring a standardized interaction pattern across different backend implementations.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `PhysicsBackend` | Interface | Defines the contract for initializing a physics world, requiring a `name` and a `createWorld` method. |
| `RigidBodyType` | Enum | Defines the physical behavior types for rigid bodies: `Dynamic` (force-driven), `Fixed` (immovable), and `Kinematic` (code-driven movement). |
| `ColliderShape` | Type | A discriminated union defining all possible geometric shapes a collider can possess, including sphere, box, capsule, cylinder, convexHull, trimesh, and heightfield. |
| `BackendBodyDesc` | Interface | Describes the initial properties for creating a rigid body, including type, position, damping, and CCD settings. |
| `BackendColliderDesc` | Interface | Describes the properties for creating a collider, including its `ColliderShape`, physical material properties (friction, restitution), and mass. |
| `BackendRaycastHit` | Interface | Represents the result of a raycast query, containing the hit collider ID, distance, world point, and surface normal. |
| `PhysicsBackendWorld` | Interface | Defines the operational methods for a single simulated physics world, including stepping the simulation, creating/destroying bodies/colliders, and querying state. |

## 3. Implementation Details & Side Effects
Structural definitions only; no complex logic or side effects.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** None