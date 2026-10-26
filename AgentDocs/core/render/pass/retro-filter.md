## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | PostProcessingPass |
| Source file | retro-filter.ts |

The **PostProcessingPass** is a specialized rendering component designed to apply aesthetic visual filters to a rendered scene after the primary geometry pass has completed. It functions as a screen-space effect, utilizing a fullscreen quad to manipulate the final image buffer through custom fragment shaders.

**Functional Mission**
The primary responsibility of **PostProcessingPass** is to implement a "retro" visual style by applying temporal distortion and chromatic aberration to a provided input texture. It solves the problem of post-render visual stylization by intercepting the rendered frame and re-processing it through a dedicated shader pipeline.

**System Context & Integration**
This component operates within the rendering pipeline as an implementation of [IRenderPass](/AgentDocs/core/render/render-pass.interface.md). It receives a rendered texture via `setInputTexture`, which typically originates from a previous render pass or a frame buffer. During the `execute` phase, it disables depth testing to ensure the fullscreen quad covers the entire viewport and uses a specialized shader from [ShaderSources](/AgentDocs/shaders/shader-sources.md) to transform the pixel data. It integrates with the [Scene](/AgentDocs/entities/scene.md) object to maintain execution context, though its primary data dependency is the texture provided by the caller.

- **INTERNAL REFERENCES**: [IRenderPass](/AgentDocs/core/render/render-pass.interface.md), [Scene](/AgentDocs/entities/scene.md), [Shader](/AgentDocs/shaders/shader.md), [ShaderSources](/AgentDocs/shaders/shader-sources.md), [Texture](/AgentDocs/textures/texture.md), [JsonSerializable](/AgentDocs/core/json-serializable.md).

## 2. Environment & Configuration
**Environment Lookups:**
- `gl` (via `setGl`)  The WebGL2 rendering context used for all GPU operations.

**Hardcoded Constants:**
- `u_distortionStrength` (Default: `0.15`)  Controls the intensity of the retro visual distortion.
- `u_aberrationSpread` (Default: `0.008`)  Controls the magnitude of the chromatic aberration effect.
- `timeAccumulator` increment (Default: `0.016`)  Simulated delta time for temporal shader effects.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `PostProcessingPass` | Class | Manages the lifecycle and execution of the retro post-processing effect. |
| `setGl` | Method | Initializes the WebGL context, compiles the retro shader, and creates the empty VAO. |
| `initialize` | Method | Re-initializes the pass with a provided WebGL context. |
| `setInputTexture` | Method | Sets the source texture (the rendered scene) to be processed by the filter. |
| `execute` | Method | Performs the actual draw call, applying shader uniforms and rendering the fullscreen quad. |
| `cleanup` | Method | Releases GPU resources including the shader program and the VAO. |
| `resize` | Method | Placeholder for handling viewport dimension changes. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. The constructor calls `setGl`.
    2. `setGl` instantiates a new [Shader](/AgentDocs/shaders/shader.md) using `ShaderSources.frag.retro` and `ShaderSources.vertex.fullscreen`.
    3. A WebGL2 Vertex Array Object (`emptyVAO`) is created to facilitate the fullscreen draw call.
- **Data Path**: 
    1. **Input**: A `Texture` object containing the rendered scene.
    2. **Processing**: The texture is bound to `TEXTURE0`. The shader is activated, and temporal/distortion uniforms (`u_time`, `u_distortionStrength`, `u_aberrationSpread`) are uploaded to the GPU.
    3. **Output**: A distorted, "retro-style" image rendered directly to the current WebGL framebuffer.
- **Conditional Branching**: 
    - In `execute`, the process is aborted if `enabled` is false, `inputTexture` is null, or the `postShader` program is not initialized.

## 5. Resource Dependencies
- **Standard Libraries**: `WebGL2RenderingContext` (Web API)
- **Internal Modules**: 
    - [Scene](/AgentDocs/entities/scene.md)
    - [Shader](/AgentDocs/shaders/shader.md)
    - [ShaderSources](/AgentDocs/shaders/shader-sources.md)
    - [Texture](/AgentDocs/textures/texture.md)
    - [JsonSerializable](/AgentDocs/core/json-serializable.md)
    - [IRenderPass](/AgentDocs/core/render/render-pass.interface.md)