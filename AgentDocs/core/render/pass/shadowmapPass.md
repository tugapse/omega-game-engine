## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | ShadowMapPass |
| Source file | shadowmapPass.ts |

The **ShadowMapPass** is a specialized rendering stage within the engine's pipeline designed to generate depth information from the perspective of a light source. By capturing the distance from the light to the nearest geometry, it creates a shadow map texture that serves as a spatial reference for subsequent lighting calculations.

**Functional Mission**
The primary responsibility of **ShadowMapPass** is to populate a high-resolution depth texture with the scene's occlusion data. It solves the problem of determining which fragments are obscured from a light source by rendering shadow-casting geometry into a dedicated framebuffer using a lightweight depth-only shader.

**System Context & Integration**
This component implements the [IRenderPass](/AgentDocs/core/render/render-pass.interface.md) interface and is typically executed early in the [Render Pipeline](/AgentDocs/core/render/render-pipeline.md). It identifies a [DirectionalLight](/AgentDocs/entities/lights/directional-light.md) within the [Scene](/AgentDocs/entities/scene.md) to establish the light-space view-projection matrix. The resulting [Texture](/AgentDocs/textures/texture.md) is then made available to downstream shaders, such as the [LitShader](/AgentDocs/shaders/lit-shader.md), which sample the depth map to perform shadow tests (e.g., PCF) during the main color pass.

## 2. Environment & Configuration
**Environment Lookups:**
- `gl` (via `constructor`)  The WebGL2 rendering context used for all GPU operations.

**Hardcoded Constants:**
- `shadowMapSize` (Default: `4096`)  The fixed resolution (width and height) of the shadow map texture.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `ShadowMapPass` | Class | Manages the lifecycle, resource allocation, and execution of the shadow mapping pass. |
| `shadowstrength` | NumberRange | Controls the intensity/darkness of the shadows in the final composition. |
| `shadowmapTexture` | Texture | Holds the generated depth data for sampling by other shaders. |
| `enabled` | boolean | Toggles the execution of the shadow pass. |
| `initialize()` | Method | Allocates the WebGL framebuffer required for off-screen rendering. |
| `execute(scene)` | Method | Performs the actual rendering of shadow-casting objects into the depth texture. |
| `clearShadowMap()` | Method | Resets the depth texture to prevent stale shadow data. |
| `cleanup()` | Method | Releases GPU resources including textures, shaders, and framebuffers. |
| `toJsonObject()` | Method | Serializes the pass configuration for persistence. |
| `fromJson(json)` | Method | Restores the pass configuration from serialized data. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. Creates a depth-specific [Texture](/AgentDocs/textures/texture.md) with `TEXTURE_COMPARE_MODE` set to `COMPARE_REF_TO_TEXTURE` for hardware-accelerated depth comparison.
    2. Compiles a specialized [Shader](/AgentDocs/shaders/shader.md) using `shadow_caster` vertex and `depth_only` fragment sources.
    3. Prepares the [WebGLFramebuffer](/AgentDocs/core/render/pass/shadowmapPass.md) via `initialize()`.
- **Data Path**: 
    1. **Input**: [Scene](/AgentDocs/entities/scene.md) containing [DirectionalLight](/AgentDocs/entities/lights/directional-light.md) and objects with [RendererBehaviour](/AgentDocs/behaviours/renderer/renderer-behaviour.md).
    2. **Processing**: 
        - Bind framebuffer and attach depth texture.
        - Iterate through `shadowCasters` (objects where `castShadows` is true).
        - Calculate `modelLightMvpMatrix` by multiplying the light's MVP matrix with the entity's model matrix.
        - Render geometry using front-face culling (`CULL_FACE` with `FRONT`) to mitigate shadow acne.
    3. **Output**: A populated depth texture stored in `shadowmapTexture`.
- **Conditional Branching**:
    - If `enabled` is false or required resources (shader/texture) are missing, the pass calls `clearShadowMap()` and exits.
    - If no active `DirectionalLight` is found in the scene, the pass clears the map and exits.
    - If the framebuffer status is not `FRAMEBUFFER_COMPLETE`, an error is logged and execution halts.

## 5. Resource Dependencies
- **Standard Libraries**: `gl-matrix` (math operations)
- **Internal Modules**: 
    - [RendererBehaviour](/AgentDocs/behaviours/renderer/renderer-behaviour.md)
    - [ShaderUniformsEnum](/AgentDocs/enums/shader-uniforms.enum.md)
    - [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md)
    - [Shader](/AgentDocs/shaders/shader.md)
    - [ShaderSources](/AgentDocs/shaders/shader-sources.md)
    - [Texture](/AgentDocs/textures/texture.md)
    - [JsonSerializable](/AgentDocs/core/json-serializable.md)
    - [NumberRange](/AgentDocs/core/range.md)
    - [Scene](/AgentDocs/entities/scene.md)
    - [Camera](/AgentDocs/entities/camera.md)
    - [DirectionalLight](/AgentDocs/entities/lights/directional-light.md)
    - [IRenderPass](/AgentDocs/core/render/render-pass.interface.md)
- **External Packages**: `gl-matrix`