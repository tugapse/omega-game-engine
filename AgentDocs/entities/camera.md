## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | Camera |
| Source file | camera.ts |

The **Camera** component serves as the mathematical bridge between the 3D world space and the 2D viewport. It is responsible for calculating the view and projection matrices required by the rendering pipeline to transform vertex data from world coordinates into clip space. By managing both perspective and orthographic projections, it provides the necessary spatial context for the user's visual representation of the scene.

**Functional Mission**
The primary mission of the **Camera** is to manage the observer's viewpoint within the engine. It solves the problem of spatial projection by generating valid `mat4` matrices (View and Projection) and provides utility functions for coordinate space transformations, such as converting world positions to screen pixels or unprojecting screen-space mouse coordinates into world-space rays for object picking.

**System Context & Integration**
As a specialized [SceneEntity](/AgentDocs/entities/entity.md), the camera integrates deeply with the [Transform](/AgentDocs/core/transform.md) system to derive its position and orientation. It acts as a critical data provider for the [Render Pipeline](/AgentDocs/core/render/render-pipeline.md), supplying the matrices used in shaders to position geometry relative to the viewer. It also facilitates interaction between the [Input Manager](/AgentDocs/managers/input-manager.md) and the scene by translating 2D input into 3D spatial queries.

- **INTERNAL REFERENCES**: [SceneEntity](/AgentDocs/entities/entity.md), [Transform](/AgentDocs/core/transform.md), [EntityType](/AgentDocs/enums/entity-type.enum.md), [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md).

## 2. Environment & Configuration
**Environment Lookups:**
- `cameraType` (via `this.cameraType`)  Determines if the projection is `PERSPECTIVE` or `ORTHOGRAPHIC`.
- `aspectRatio` (via `this.aspectRatio`)  Defines the viewport width-to-height ratio for projection calculations.

**Hardcoded Constants:**
- `CameraType.PERSPECTIVE` (Default: `0`)  Standard 3D projection mode.
- `CameraType.ORTHOGRAPHIC` (Default: `1`)  Parallel projection mode.
- `nearPlane` (Default: `0.01`)  Minimum distance for depth clipping.
- `farPlane` (Default: `2000.0`)  Maximum distance for depth clipping.
- `fieldOfView` (Default: `45`)  Vertical angle of view in degrees.
- `orthoSize` (Default: `10.0`)  Vertical scale for orthographic view.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `Camera` | Class | Main entity managing view/projection matrices and coordinate transformations. |
| `CameraType` | Enum | Defines projection modes: `PERSPECTIVE` or `ORTHOGRAPHIC`. |
| `mainCamera` | Static Getter | Provides global access to the active primary camera instance. |
| `setMainCamera` | Static Method | Assigns the global primary camera instance. |
| `updateProjectionMatrix` | Method | Recalculates the projection matrix based on FOV, aspect, and clipping planes. |
| `updateViewMatrix` | Method | Recalculates the view matrix using the entity's world position and orientation. |
| `worldToScreenPosition` | Method | Projects a 3D world coordinate into 2D pixel coordinates. |
| `screenToWorldRay` | Method | Generates a 3D ray (origin and direction) from a 2D screen point. |
| `screenToWorldPosition` | Method | Calculates a 3D point at a specific distance along a screen-space ray. |
| `worldToClipPosition` | Method | Transforms a 3D point into 4D clip-space coordinates. |
| `instanciate` | Static Method | Factory method for creating new Camera instances with specific transforms. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. Calls `super('Camera')` to initialize the base entity.
    2. Sets `entityType` to `EntityType.CAMERA`.
    3. Allocates memory for `_projectionMatrix` and `_viewMatrix` using `mat4.create()`.
    4. `initialize()` triggers the first calculation of both projection and view matrices.
- **Data Path (Projection)**: 
    `Camera Properties (FOV, Aspect, Planes)` $\rightarrow$ `updateProjectionMatrix()` $\rightarrow$ `mat4.perspective` or `mat4.ortho` $\rightarrow$ `_projectionMatrix`.
- **Data Path (View)**: 
    `Transform (WorldPosition, Forward, Up)` $\rightarrow$ `updateViewMatrix()` $\rightarrow$ `mat4.lookAt` $\rightarrow$ `_viewMatrix`.
- **Data Path (Unprojection/Raycasting)**: 
    `Screen Position (vec2)` $\rightarrow$ `NDC Conversion` $\rightarrow$ `Inverse View-Projection Multiplication` $\rightarrow$ `Perspective Division` $\rightarrow$ `Ray (Origin/Direction)`.
- **Conditional Branching**:
    - `updateProjectionMatrix`: Branches between `mat4.perspective` and `mat4.ortho` based on `cameraType`.
    - `worldToScreenPosition`: Checks if `clipSpacePosition[3]` (W component) is `0` to prevent division by zero.
    - `screenToWorldRay`: Checks if `nearPointWorld[3]` or `farPointWorld[3]` is `0` to prevent division by zero.

## 5. Resource Dependencies
- **Standard Libraries**: `Math` (via `Math.PI`)
- **Internal Modules**: 
    - [Transform](/AgentDocs/core/transform.md)
    - [EntityType](/AgentDocs/enums/entity-type.enum.md)
    - [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md)
    - [SceneEntity](/AgentDocs/entities/entity.md)
- **External Packages**: `gl-matrix` (mat4, vec2, vec3, vec4)