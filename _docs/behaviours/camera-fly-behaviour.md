## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| CameraFlyBehaviour | behaviours/camera-fly-behaviour |

This component implements a sophisticated free-look camera controller, often referred to as a "flycam" or "FPS camera." Its primary responsibility is to translate raw user inputkeyboard presses for movement (WASD/QE), mouse movement for rotation, and mouse wheel input for zoominginto continuous, physics-like movement and orientation changes for an attached entity. It manages acceleration, dampening, and velocity to provide a fluid navigation experience within a 3D environment.

This behavior acts as a specialized controller within the application's entity system. It extends [EntityBehaviour](/behaviours/entity-behaviour.md) and is designed to be attached to an entity that represents the camera. It heavily relies on input handling from [Mouse](/core/input.md) and [Keyboard](/core/input.md) to drive its state, and it modifies the [Transform](/core/transform.md) of its parent entity to reflect the calculated movement and rotation.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| ICameraMoveKeys | Interface | Defines the string mappings for keyboard controls (forward, back, left, right, up, down, boost). |
| ICameraMouseButtons | Interface | Defines the numerical mappings for mouse buttons used for panning and looking. |
| CameraFlyBehaviour | Class | Implements the camera control logic. Provides properties like `moveSpeed`, `rotationSpeed`, and methods like `clone()`. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The behavior operates on a per-frame update cycle. It first reads input to calculate desired velocity changes for forward, strafe, and vertical movement, applying acceleration and dampening based on the current state. Rotation is calculated by accumulating yaw and pitch based on mouse delta, which is then smoothed using SLERP against the entity's current rotation. Movement is applied by projecting the calculated velocities onto the entity's local axes (forward, right, up), with special logic to handle orthographic camera zooming by modifying the camera's `orthoSize`.
- **Side Effects:** Mutates the `Transform` of the parent entity by calling `transform.translate()` and updating `transform.worldRotationQuat`. It also directly modifies the `orthoSize` of the parent `Camera` entity when in orthographic mode.
- **Error Handling:** The `initialize()` method checks for successful initialization. The `applyMovementVelocity` method includes a safeguard to prevent `camera.orthoSize` from becoming zero or negative in orthographic mode.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [EntityBehaviour](/behaviours/entity-behaviour.md), [Camera](/entities/camera.md), [Transform](/core/transform.md), [Mouse](/core/input.md), [Keyboard](/core/input.md), [JsonSerializedData](/interfaces/json-serialized-data.md)