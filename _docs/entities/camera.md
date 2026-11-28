## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **Camera** | [src/entities/camera.ts](/src/entities/camera.ts) |

This component defines the `Camera` class, which is responsible for managing the view and projection matrices necessary for rendering a 3D scene. It encapsulates camera properties such as field of view, aspect ratio, and clipping planes, allowing it to generate the mathematical transformations required to map 3D world coordinates onto a 2D viewport.

The `Camera` acts as a core entity within the rendering pipeline, inheriting from [SceneEntity](/src/entities/entity.md). It provides essential utility methods like `worldToScreenPosition` and `screenToWorldRay`, enabling interaction logic such as mouse picking and raycasting within the application's scene graph.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `CameraType` | Enum | Defines the projection type: `PERSPECTIVE` or `ORTHOGRAPHIC`. |
| `Camera.mainCamera` | Getter | Provides static, read-only access to the primary camera instance in the scene. |
| `Camera.setMainCamera` | Method | Sets a specific `Camera` instance as the scene's main camera. |
| `Camera.instanciate` | Static Method | Factory method to create and initialize a new `Camera` instance, optionally setting a name and transform. |
| `Camera.cameraType` | Property | The projection type used by the camera. |
| `Camera.orthoSize` | Property | Half the vertical size for orthographic projection. |
| `Camera.fieldOfView` | Property | The camera's field of view in degrees. |
| `Camera.nearPlane` | Property | The distance to the near clipping plane. |
| `Camera.farPlane` | Property | The distance to the far clipping plane. |
| `Camera.aspectRatio` | Property | The aspect ratio of the viewport. |
| `Camera.targetTexture` | Property | Name of the render texture this camera draws into. |
| `Camera.targetWidth` | Property | Width in pixels of the target texture. |
| `Camera.targetHeight` | Property | Height in pixels of the target texture. |
| `Camera.projectionMatrix` | Getter | Returns the camera's calculated projection matrix (`mat4`). |
| `Camera.viewMatrix` | Getter | Returns the camera's calculated view matrix (`mat4`). |
| `Camera.initialize` | Method | Initializes the camera, calculating both projection and view matrices. |
| `Camera.updateProjectionMatrix` | Method | Recalculates the projection matrix based on current camera settings. |
| `Camera.refreshMatrices` | Method | Forces an update of both projection and view matrices. |
| `Camera.update` | Method | Updates the camera's view matrix based on its current transform over elapsed time. |
| `Camera.worldToScreenPosition` | Method | Converts a 3D world position to a 2D screen coordinate using the camera's matrices. |
| `Camera.screenToWorldRay` | Method | Unprojects a 2D screen coordinate into a 3D ray (origin and direction) for picking. |
| `Camera.screenToWorldPosition` | Method | Unprojects a 2D screen coordinate to a specific 3D world position at a given distance. |
| `Camera.worldToClipPosition` | Method | Converts a 3D world position into a 4D clip-space position. |
| `Camera.toJsonObject` | Method | Serializes the camera's state into a `JsonSerializedData` object. |
| `Camera.fromJson` | Method | Deserializes the camera's state from a `JsonSerializedData` object. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The camera manages two primary matrices: the projection matrix (determined by `CameraType`, `fieldOfView`, etc.) and the view matrix (determined by the camera's `transform`). The `updateViewMatrix` method uses `mat4.lookAt` based on the camera's position and forward vector. Projection matrix calculation switches between `mat4.perspective` and `mat4.ortho` based on `cameraType`. Utility methods like `worldToScreenPosition` combine these matrices and perform perspective division to map world space to screen space.
- **Side Effects:** Mutates internal state (`_projectionMatrix`, `_viewMatrix`) upon initialization or update. It interacts with the `Transform` component's state (`worldPosition`, `forward`, `up`).
- **Error Handling:** `worldToScreenPosition` and `screenToWorldRay` include checks to prevent division by zero if the homogeneous coordinate ($w$) is zero during matrix transformations.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix` (for `mat4`, `vec3`, `vec4`, `vec2`).
- **Internal:** [Transform](/src/core/transform.md), [EntityType](/src/enums/entity-type.enum.md), [JsonSerializedData](/src/interfaces/json-serialized-data.md), [SceneEntity](/src/entities/entity.md).