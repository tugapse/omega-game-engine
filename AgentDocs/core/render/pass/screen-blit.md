## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | ScreenBlitPass |
| Source file | screen-blit.ts |

The **ScreenBlitPass** serves as the terminal stage of the rendering pipeline. Its primary purpose is to take a rendered texturetypically the result of complex off-screen computations like lighting, shadows, or post-processing effectsand project it onto the primary canvas for display to the user.

**Functional Mission**
The core mission of **ScreenBlitPass** is to perform a "blit" operation, which involves copying pixel data from a source texture to the current framebuffer. It solves the problem of presenting off-screen framebuffer attachments to the screen by utilizing a full-screen triangle/quad approach, ensuring the final image is correctly mapped to the viewport dimensions.

**System Context & Integration**
This component implements the [IRenderPass](/AgentDocs/core/render/render-pass.interface.md) interface, allowing it to be integrated into a larger [RenderPipeline](/AgentDocs/core/render/render-pipeline.md). It acts as a bridge between the internal rendering buffers and the final output. It receives a [Texture](/AgentDocs/textures/texture.md) via `setInputTexture`, which is then processed by a specialized [UnlitShader](/AgentDocs/shaders/unlit-shader.md) to draw a full-screen geometry. While it accepts a [Scene](/AgentDocs/entities/scene.md) in its `execute` method to satisfy the interface, it is functionally agnostic to scene content, focusing purely on texture-to-screen projection.

## 2. Environment & Configuration
**Environment Lookups:**
- `gl` (via `constructor`/`setGl`)  The `WebGL2RenderingContext` used for all GPU commands.

**Hardcoded Constants:**
- `u_screenTexture` (Default: `0`)  The uniform name for the texture sampler in the shader.
- `TEXTURE0` (Default: `gl.TEXTURE0`)  The active texture unit assigned for the source texture.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `ScreenBlitPass` | Class | Manages the lifecycle and execution of the screen blitting render pass. |
| `constructor` | Function | Initializes the WebGL context and sets up the internal `UnlitShader`. |
| `setGl` | Method | Updates the internal WebGL rendering context. |
| `initialize` | Method | Asynchronously compiles and prepares the internal shader for use. |
| `execute` | Method | Performs the actual draw call, binding the source texture and drawing the full-screen quad. |
| `cleanup` | Method | Releases GPU resources by destroying the internal shader. |
| `resize` | Method | Placeholder for viewport adjustment (no-op). |
| `setInputTexture` | Method | Defines the source [Texture](/AgentDocs/textures/texture.md) to be blitted. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. The class is instantiated with a `WebGL2RenderingContext`.
    2. An `UnlitShader` is created using an `UnlitMaterial`.
    3. Shader URIs are assigned from `ShaderSources` (fullscreen vertex and screen_blit fragment).
    4. `initialize()` must be called to await the asynchronous compilation of the shader.
- **Data Path**: 
    1. **Input**: A `Texture` object provided via `setInputTexture`.
    2. **Processing**: The `execute` method sets the viewport, disables depth testing, activates the shader, binds the texture to `TEXTURE0`, and sets the `u_screenTexture` uniform.
    3. **Output**: A single draw call (`drawArrays`) renders a 6-vertex triangle/quad covering the viewport, outputting the texture pixels to the canvas.
- **Conditional Branching**:
    - In `execute`, if `sourceTexture` is null or `screenQuadShader.initialized` is false, the method returns early without performing any draw calls to prevent WebGL errors.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [Scene](/AgentDocs/entities/scene.md)
    - [UnlitMaterial](/AgentDocs/materials/unlit-material.md)
    - [Shader](/AgentDocs/shaders/shader.md)
    - [UnlitShader](/AgentDocs/shaders/unlit-shader.md)
    - [ShaderSources](/AgentDocs/shaders/shader-sources.md)
    - [Texture](/AgentDocs/textures/texture.md)
    - [JsonSerializable](/AgentDocs/core/json-serializable.md)
    - [IRenderPass](/AgentDocs/core/render/render-pass.interface.md)
- **External Packages**: None identified.