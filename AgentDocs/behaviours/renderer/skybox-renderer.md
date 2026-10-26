## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | SkyboxRenderer |
| Source file | skybox-renderer.ts |

The **SkyboxRenderer** is a specialized rendering component designed to simulate a distant background or sky by rendering a large-scale cube mapped with a cubemap texture. It functions as a visual anchor for the scene, providing environmental context and depth illusion without requiring actual geometry at infinite distances.

**Functional Mission**
The primary responsibility of the **SkyboxRenderer** is to manage the lifecycle and draw calls of a skybox entity. It solves the problem of rendering a background that remains visually consistent regardless of the camera's position by manipulating the view matrix to strip translation components, ensuring the skybox effectively "follows" the camera.

**System Context & Integration**
This component integrates into the rendering pipeline by extending [MeshRendererBehaviour](/AgentDocs/behaviours/renderer/mesh-renderer-behaviour.md). It operates within a specific [RenderLayer.SKYBOX](/AgentDocs/enums/render-layer.enum.md) to ensure correct draw order. During the execution flow, it interacts with the [Camera](/AgentDocs/entities/camera.md) to derive view matrices and utilizes [SkyboxShader](/AgentDocs/shaders/skybox-shader.md) and [SkyboxMaterial](/AgentDocs/materials/skybox-material.md) to define the visual appearance. It is designed to be rendered with specific WebGL state changes, such as front-face culling and depth testing adjustments, to prevent the skybox from obscuring foreground geometry.

- **INTERNAL REFERENCES**: 
    - [MeshRendererBehaviour](/AgentDocs/behaviours/renderer/mesh-renderer-behaviour.md)
    - [SkyboxMaterial](/AgentDocs/materials/skybox-material.md)
    - [SkyboxShader](/AgentDocs/shaders/skybox-shader.md)
    - [CubePrimitive](/AgentDocs/primitives/cube-primitive.md)
    - [RenderLayer.SKYBOX](/AgentDocs/enums/render-layer.enum.md)
    - [Camera](/AgentDocs/entities/camera.md)
    - [ShaderUniformsEnum.U_MVP_MATRIX](/AgentDocs/enums/shader-uniforms.enum.md)

## 2. Environment & Configuration
**Environment Lookups:**
- `gl` (via `instanciate`/`constructor`)  The WebGL2 rendering context used for all GPU operations.

**Hardcoded Constants:**
- `1000` (via `initialize`)  The scale factor applied to the skybox cube to ensure it encompasses the scene.
- `0, 0, 0` (via `initialize`)  The local position used to center the skybox at the origin.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `instanciate` | Static Method | Factory method to create a new instance of the renderer using the provided WebGL context. |
| `constructor` | Class Constructor | Initializes the renderer, sets the class name, and triggers the default skybox creation. |
| `createDefaultSkybox` | Protected Method | Asynchronously sets up the mesh, material, shader, and default white cubemap texture. |
| `initialize` | Method | Sets the initial transform (position and massive scale) of the skybox. |
| `material` | Getter | Provides access to the underlying [SkyboxMaterial](/AgentDocs/materials/skybox-material.md). |
| `setGlSettings` | Protected Method | Configures WebGL state: enables front-face culling and sets depth function to `LEQUAL`. |
| `setCameraMatrices` | Method | Calculates the MVP matrix by removing translation from the camera's view matrix. |
| `draw` | Method | Orchestrates the rendering process: sets GL settings, updates matrices, and executes the draw call. |
| `setShaderVariables` | Method | Ensures shader uniforms and GL states are synchronized before drawing. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. `instanciate` is called with the `gl` context.
    2. `constructor` calls `createDefaultSkybox`.
    3. `createDefaultSkybox` awaits `EngineCache.getWhiteTextureCube` and assigns a `CubePrimitive` to the mesh.
    4. `initialize` is called to set the local scale to `1000` and position to `0,0,0`.
- **Data Path**: 
    1. **Input**: Camera `viewMatrix` and `projectionMatrix`.
    2. **Processing**: `setCameraMatrices` clones the `viewMatrix`, zeroes out indices `12, 13, 14` (translation), multiplies by `projectionMatrix`, and finally multiplies by the parent's `modelMatrix`.
    3. **Output**: The resulting `mvpMatrix` is uploaded to the GPU via `U_MVP_MATRIX`.
- **Conditional Branching**:
    - If `this.shader?._shaderProgram` is null/undefined, the `setCameraMatrices`, `draw`, and `setShaderVariables` methods abort execution to prevent errors.

## 5. Resource Dependencies
- **Standard Libraries**: `gl-matrix` (via `mat4`)
- **Internal Modules**: 
    - [EngineCache](/AgentDocs/core/engineCache.md)
    - [Camera](/AgentDocs/entities/camera.md)
    - [RenderLayer](/AgentDocs/enums/render-layer.enum.md)
    - [ShaderUniformsEnum](/AgentDocs/enums/shader-uniforms.enum.md)
    - [SkyboxMaterial](/AgentDocs/materials/skybox-material.md)
    - [CubePrimitive](/AgentDocs/primitives/cube-primitive.md)
    - [SkyboxShader](/AgentDocs/shaders/skybox-shader.md)
    - [MeshRendererBehaviour](/AgentDocs/behaviours/renderer/mesh-renderer-behaviour.md)
- **External Packages**: `gl-matrix`