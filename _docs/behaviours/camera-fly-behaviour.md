## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **CameraFlyBehaviour** | [src/behaviours/camera-fly-behaviour.ts](/src/behaviours/camera-fly-behaviour.ts) |

This component implements a free-look camera controller, often termed "flycam" or "FPS camera." Its primary responsibility is to manage the continuous, physics-like movement and rotational control of an attached entity, allowing the user to navigate a 3D scene using keyboard inputs for translation and mouse input for orientation. It incorporates features like acceleration, dampening, and boost mechanics for realistic camera control.

This behaviour acts as a controller attached to an [EntityBehaviour](/src/behaviours/entity-behaviour.ts) instance. It translates raw input signals from [Mouse](/src/core/input.ts) and [Keybord](/src/core/input.ts) into changes in the entity's [Transform](/src/core/transform.ts), effectively making the entity behave as a movable camera within the scene graph.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `ICameraMoveKeys` | Interface | Defines string mappings for directional movement keys (forward, back, left, right, up, down, boost). |
| `ICameraMouseButtons` | Interface | Defines numeric mappings for mouse buttons used for panning and looking. |
| `CameraFlyBehaviour` | Class | Implements the camera control logic, extending [EntityBehaviour](/src/behaviours/entity-behaviour.ts). |

## 3. Implementation Details & Side Effects
- **Core Logic:** The behaviour calculates movement and rotation by integrating velocity changes over time (`ellapsed`). Movement velocities (`_forwardVelocity`, `_strafeVelocity`, `_upVelocity`) are updated based on key states, applying acceleration and dampening. Rotation is managed by accumulating yaw and pitch angles derived from mouse movement, which are then smoothed using spherical linear interpolation (`quat.slerp`) against the entity's current rotation. Movement is applied via `transform.translate` using the calculated velocities, with special logic implemented for orthographic camera modes to adjust `orthoSize`.
- **Side Effects:** Mutates the `Transform` of the parent entity by calling `transform.translate` and updating `transform.worldRotationQuat`. It reads state from the global input systems (`Keybord` and `Mouse`).
- **Error Handling:** The `initialize` method performs validation on the camera's forward vector to correctly initialize pitch and yaw from the camera's orientation. Velocity updates include checks against `stopThreshold` to prevent infinite micro-movements when input ceases.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix` (for `quat`, `vec3`).
- **Internal:** [EntityBehaviour](/src/behaviours/entity-behaviour.ts), [JsonSerializedData](/src/interfaces/json-serialized-data.ts), [Transform](/src/core/transform.ts), [Camera](/src/entities/camera.ts), [CameraType](/src/entities/camera.ts), [Keybord](/src/core/input.ts), [Mouse](/src/core/input.ts).