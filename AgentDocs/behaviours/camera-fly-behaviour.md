## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | CameraFlyBehaviour |
| Source file | camera-fly-behaviour.ts |

The **CameraFlyBehaviour** is a specialized controller designed to facilitate first-person or "flycam" style navigation within a 3D environment. It acts as a bridge between raw user input (keyboard and mouse) and the spatial transformation of a camera entity, providing a fluid, high-fidelity movement experience through physics-inspired mechanics like acceleration, deceleration, and rotation smoothing.

**Functional Mission**
The primary responsibility of **CameraFlyBehaviour** is to translate discrete input events into continuous, smoothed movement and rotation vectors. It solves the problem of "jittery" or "robotic" camera movement by implementing dampening and interpolation, ensuring that the user's perspective transitions smoothly through the scene. It also provides specialized logic for orthographic cameras, converting forward/backward movement into zoom functionality (adjusting `orthoSize`).

**System Context & Integration**
This component functions as a consumer of the [Mouse](/AgentDocs/core/input.md) and [Keyboard](/AgentDocs/core/input.md) input systems. It is intended to be attached to an entity that possesses a [Transform](/AgentDocs/core/transform.md), specifically one that is a [Camera](/AgentDocs/entities/camera.md). During the engine's update loop, it processes input to modify the [Transform](/AgentDocs/core/transform.md) of its parent, which in turn dictates the view matrix used by the [Render Pipeline](/AgentDocs/core/render/render-pipeline.md).

- **INTERNAL REFERENCES**: [EntityBehaviour](/AgentDocs/behaviours/entity-behaviour.md), [Camera](/AgentDocs/entities/camera.md), [Transform](/AgentDocs/core/transform.md), [CameraType](/AgentDocs/entities/camera.md).

## 2. Environment & Configuration
**Environment Lookups:**
- `Keyboard.keyDown[key]`  Checks the current state of a specific keyboard key.
- `Mouse.mouseButtonDown[button]`  Checks the current state of a specific mouse button.
- `Mouse.mouseMovement`  Accesses the delta movement of the mouse cursor.
- `Mouse.wheelY`  Accesses the vertical scroll delta of the mouse wheel.

**Hardcoded Constants:**
- `stopThreshold` (Default: `0.1`)  The velocity magnitude below which movement is snapped to zero to prevent infinite micro-drifting.
- `is2D` (Default: `false`)  A local flag used to toggle rotation logic (currently a placeholder/FIXME).

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `ICameraMoveKeys` | Interface | Defines the string mappings for movement keys (forward, back, left, right, up, down, boost). |
| `ICameraMouseButtons` | Interface | Defines the integer mappings for mouse buttons (pan, look). |
| `CameraFlyBehaviour` | Class | The main controller implementing movement and rotation logic. |
| `instanciate()` | Static Method | Factory method to create a new instance of the behavior. |
| `initialize()` | Method | Captures the initial rotation from the parent transform to sync internal state. |
| `update(ellapsed)` | Method | The per-frame entry point for processing input and applying transformations. |
| `clone()` | Method | Creates a deep copy of the behavior using JSON serialization. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. The `initialize` method is called.
    2. It extracts the current `localRotation` (pitch and yaw) from the parent's [Transform](/AgentDocs/core/transform.md) and stores them in `_currentPitch` and `_currentYaw` to prevent sudden camera snaps upon attachment.
- **Data Path**:
    1. **Input Capture**: `updateInput` calls `updateMoveVelocity`, `updateScrollVelocity`, and `updatePanVelocity`.
    2. **Velocity Calculation**: 
        - Keyboard inputs increment/decrement velocity based on `_acceleration`.
        - Lack of input triggers `moveDampening` to reduce velocity.
        - Mouse movement/scroll modifies velocity or `orthoSize`.
    3. **Transformation**: 
        - `applyMovementVelocity` calculates a `movementVector` using `transform.forward`, `right`, and `up`.
        - `applyRotationVelocity` calculates a target quaternion using Euler angles (yaw/pitch) and applies `slerp` for smoothing.
    4. **Output**: The parent's [Transform](/AgentDocs/core/transform.md) is updated via `translate` and `worldRotationQuat` assignment.
- **Conditional Branching**:
    - **Boost Check**: If `moveKeys.boost` is active, `maxSpeed` is multiplied by `boostMultiplier`.
    - **Orthographic Mode**: If the parent is a [Camera](/AgentDocs/entities/camera.md) with `CameraType.ORTHOGRAPHIC`, movement logic switches from translation to modifying `camera.orthoSize` (zoom).
    - **Rotation Lock**: Pitch is clamped between -90 and 90 degrees to prevent gimbal lock/flipping.

## 5. Resource Dependencies
- **Standard Libraries**: `Math`
- **Internal Modules**: 
    - [EntityBehaviour](/AgentDocs/behaviours/entity-behaviour.md)
    - [Transform](/AgentDocs/core/transform.md)
    - [Camera](/AgentDocs/entities/camera.md)
    - [CameraType](/AgentDocs/entities/camera.md)
    - [Mouse](/AgentDocs/core/input.md)
    - [Keyboard](/AgentDocs/core/input.md)
    - [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md)
- **External Packages**: `gl-matrix` (quat, vec3)