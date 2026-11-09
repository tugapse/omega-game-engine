## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| Camera | entities/camera.md |

This component defines the `Camera` class, which is responsible for managing the view and projection matrices necessary for rendering 3D scenes. It encapsulates all parameters defining how the 3D world is projected onto a 2D viewport, supporting both perspective and orthographic projection modes.

The `Camera` acts as a core entity within the scene graph, inheriting from [SceneEntity](/entities/entity.md). It is crucial for the rendering pipeline, providing methods like `worldToScreenPosition` and `screenToWorldRay` that bridge the gap between 3D world coordinates and 2D screen coordinates, allowing for camera manipulation and user interaction like picking.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| CameraType | Enum | Defines the projection type: PERSPECTIVE or ORTHOGRAPHIC. |
| Camera | Class | Represents a camera entity in the 3D scene. |
| mainCamera | Static Property | Provides static access to the primary camera instance in the scene. |
| cameraType | Property | The projection type used by the camera. |
| orthoSize | Property | Half the vertical size for orthographic projection. |
| fieldOfView | Property | The camera's field of view in degrees for perspective projection. |
| nearPlane | Property | The distance to the near clipping plane. |
| farPlane | Property | The distance to the far clipping plane. |
| aspectRatio | Property | The aspect ratio of the viewport. |
| projectionMatrix | Getter | Returns the calculated projection matrix ($\text{mat4}$). |
| viewMatrix | Getter | Returns the calculated view matrix ($\text{mat4}$). |
| worldToScreenPosition | Method | Converts a 3D world position to a 2D screen pixel coordinate. |
| screenToWorldRay | Method | Unprojects a 2D screen coordinate into a 3D ray (origin and direction). |
| screenToWorldPosition | Method | Unprojects a 2D screen coordinate to a specific 3D world position at a given distance. |
| worldToClipPosition | Method | Converts a 3D world position to a 4D clip-space position. |
| toJsonObject | Method | Serializes the camera's state into a JSON structure. |
| fromJson | Method | Deserializes the camera's state from a JSON structure. |
| instanciate | Static Method | Factory method to create a new Camera instance with optional name and transform. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component calculates the view matrix using `mat4.lookAt` based on the entity's transform (position and forward vector). The projection matrix is calculated using either `mat4.perspective` or `mat4.ortho` depending on `cameraType`. Coordinate transformations (world-to-screen and screen-to-world) rely on multiplying the projection and view matrices and performing perspective division.
- **Side Effects:** Mutates internal state (`_projectionMatrix`, `_viewMatrix`) upon initialization or when `updateProjectionMatrix` is called. It also mutates the static `_mainCamera` reference when `setMainCamera` is called.
- **Error Handling:** Includes checks to prevent division by zero in `worldToScreenPosition` and `screenToWorldRay` when calculating perspective division.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [Transform](/core/transform.md), [SceneEntity](/entities/entity.md), [EntityType](/enums/entity-type.enum.md), [JsonSerializedData](/interfaces/json-serialized-data.md)