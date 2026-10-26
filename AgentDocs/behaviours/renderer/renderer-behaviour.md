## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | RendererBehaviour |
| Source file | src/behaviours/renderer/renderer-behaviour.ts |

The **RendererBehaviour** serves as the foundational rendering engine component within the entity-component system. It acts as the bridge between the high-level scene graph and the low-level WebGL2 API, providing the necessary logic to translate geometric data and material properties into visual pixels on a canvas or off-screen texture.

**Functional Mission**
The primary responsibility of **RendererBehaviour** is to manage the WebGL state machine and execute draw calls for 3D meshes. It solves the problem of abstracting complex WebGL operationssuch as buffer management, shader uniform updates, framebuffer switching, and depth/blend state configurationinto a manageable lifecycle for entities.

**System Context & Integration**
This component integrates deeply with the rendering pipeline by consuming [Mesh](/AgentDocs/core/mesh.md) data and [Shader](/AgentDocs/shaders/shader.md) programs. It interacts with [Transform](/AgentDocs/core/transform.md) to calculate model matrices and uses [Camera](/AgentDocs/entities/camera.md) data to establish view-projection matrices. It is designed to support multi-pass rendering through its framebuffer management capabilities, allowing the engine to perform operations like shadow mapping or post-processing by redirecting output to textures.

- **INTERNAL REFERENCES**: [Mesh](/AgentDocs/core/mesh.md), [Shader](/AgentDocs/shaders/shader.md), [Transform](/AgentDocs/core/transform.md), [Camera](/AgentDocs/entities/camera.md), [RendererBehaviour](/AgentDocs/behaviours/renderer/renderer-behaviour.md), [EntityBehaviour](/AgentDocs/behaviours/entity-behaviour.md), [CanvasViewport](/AgentDocs/core/canvas-viewport.md), [Light](/AgentDocs/entities/lights/light.md), [DirectionalLight](/AgentDocs/entities/lights/directional-light.md), [ObjectInstanciator](/AgentDocs/core/object-instanciator.md), [ColorMaterial](/AgentDocs/materials/color-material.md), [BlendingMode](/AgentDocs/interfaces/blend-mode.md), [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md), [IRendererBehaviour](/AgentDocs/interfaces/renderer-behaviour.md), [RenderLayer](/AgentDocs/enums/render-layer.enum.md), [GLPrimitiveType](/AgentDocs/enums/gl-primitive-type.enum.md), [FaceWinding](/AgentDocs/enums/gl/face-winding.enum.md), [CullFace](/AgentDocs/enums/gl/cull-face.enum.md), [DephFunction](/AgentDocs/enums/gl/deph-function.enum.md), [BlendingDestinationFactor](/AgentDocs/enums/gl/blend.enum.md), [BlendingSourceFactor](/AgentDocs/enums/gl/blend.enum.md), [ShaderUniformsEnum](/AgentDocs/enums/shader-uniforms.enum.md), [EntityType](/AgentDocs/enums/entity-type.enum.md), [Vector3](/AgentDocs/core/vector.md).

## 2. Environment & Configuration
**Environment Lookups:**
- `_gl` (via `constructor`)  The WebGL2 rendering context used for all API calls.
- `CanvasViewport.rendererWidth` (via `setShaderVariables`)  Global width of the rendering viewport.
- `CanvasViewport.rendererHeight` (via `setShaderVariables`)  Global height of the rendering viewport.

**Hardcoded Constants:**
- `frustumSize` (Default: `60.0`)  Size of the orthographic frustum for shadow calculations.
- `near` (Default: `0.1`)  Near clipping plane for shadow frustum.
- `far` (Default: `200.0`)  Far clipping plane for shadow frustum.
- `pointSize` (Default: `10.0`)  Default pixel size for debug points.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `instanciate` | Static Method | Factory method to create new instances with the provided WebGL context. |
| `initialize` | Method | Sets up WebGL states and initializes shader buffers. |
| `setGlSettings` | Method | Configures `gl.DEPTH_TEST`, `gl.BLEND`, `gl.CULL_FACE`, and `gl.depthMask`. |
| `setCameraMatrices` | Method | Calculates and uploads the MVP matrix to the shader. |
| `setModelWorldMatrices` | Method | Calculates and uploads the Model and Normal (Inverse Transpose) matrices. |
| `setRenderTarget` | Method | Configures an FBO with a texture and depth renderbuffer for off-screen rendering. |
| `startPass` | Method | Initializes a new render pass by setting the target and clearing buffers. |
| `drawPoint` | Method | Utility to render a single 3D point for debugging. |
| `drawLine` | Method | Utility to render a line between two 3D coordinates for debugging. |
| `draw` | Method | The primary execution call that binds buffers and issues `drawElements`. |
| `createLightMatrices` | Method | Generates View, Projection, and MVP matrices for shadow mapping. |
| `toJsonObject` | Method | Serializes shader and mesh state for persistence. |
| `fromJson` | Method | Reconstructs shader and mesh state from JSON data. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. `initialize()` is called.
    2. `setGlSettings()` configures the global WebGL state (culling, depth, blending).
    3. `initializeShader()` allocates WebGL buffers for position, UV, and indices.
- **Data Path (Standard Draw)**:
    1. `draw()` is invoked.
    2. `shader.use()` activates the program.
    3. `shader.bindBuffers()` binds vertex attribute buffers.
    4. `gl.drawElements()` executes the GPU draw command using `mesh.meshData.indices`.
    5. `shader.release()` cleans up the state.
- **Data Path (Off-screen Pass)**:
    1. `startPass(texture, w, h)` is called.
    2. `setRenderTarget()` binds the FBO and attaches the texture/depth buffer.
    3. `gl.viewport()` is updated to the target dimensions.
    4. `gl.clear()` wipes the color and depth buffers.
- **Conditional Branching**:
    - **Shadow Matrix Stability**: In `createLightMatrices`, if the light direction is nearly parallel to the world "up" vector (dot product > 0.999), the "up" vector is swapped to `(0, 0, 1)` to prevent gimbal lock/matrix instability.
    - **Shader/Mesh Validation**: `draw()`, `drawPoint()`, and `drawLine()` perform null checks on `_gl`, `shader`, and `mesh` before attempting execution to prevent runtime crashes.

## 5. Resource Dependencies
- **Standard Libraries**: `gl-matrix` (math operations).
- **Internal Modules**: 
    - [Transform](/AgentDocs/core/transform.md)
    - [Mesh](/AgentDocs/core/mesh.md)
    - [Shader](/AgentDocs/shaders/shader.md)
    - [Camera](/AgentDocs/entities/camera.md)
    - [DirectionalLight](/AgentDocs/entities/lights/directional-light.md)
    - [Light](/AgentDocs/entities/lights/light.md)
    - [CanvasViewport](/AgentDocs/core/canvas-viewport.md)
    - [ObjectInstanciator](/AgentDocs/core/object-instanciator.md)
    - [ColorMaterial](/AgentDocs/materials/color-material.md)
    - [EntityBehaviour](/AgentDocs/behaviours/entity-behaviour.md)
    - [IRendererBehaviour](/AgentDocs/interfaces/renderer-behaviour.md)
    - [BlendingMode](/AgentDocs/interfaces/blend-mode.md)
    - [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md)
    - [RenderLayer](/AgentDocs/enums/render-layer.enum.md)
    - [GLPrimitiveType](/AgentDocs/enums/gl-primitive-type.enum.md)
    - [FaceWinding](/AgentDocs/enums/gl/face-winding.enum.md)
    - [CullFace](/AgentDocs/enums/gl/cull-face.enum.md)
    - [DephFunction](/AgentDocs/enums/gl/deph-function.enum.md)
    - [BlendingDestinationFactor](/AgentDocs/enums/gl/blend.enum.md)
    - [BlendingSourceFactor](/AgentDocs/enums/gl/blend.enum.md)
    - [ShaderUniformsEnum](/AgentDocs/enums/shader-uniforms.enum.md)
    - [EntityType](/AgentDocs/enums/entity-type.enum.md)
    - [Vector3](/AgentDocs/core/vector.md)
- **External Packages**: `gl-matrix`