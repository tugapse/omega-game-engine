## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| PostProcessingPass | core/render/pass/retro-filter.md |

This component implements a specific post-processing effect, the "retro filter," applied to the rendered scene. Its primary responsibility is to take the final rendered texture as input and apply shader-based visual distortionssuch as chromatic aberration and time-based flickeringto achieve a retro aesthetic. It manages the necessary WebGL resources, including the shader program and the fullscreen quad geometry, to execute this effect efficiently.

This class functions as a specialized rendering pass within the application's rendering pipeline. It integrates with the core rendering loop by accepting a `Scene` object and an input `Texture`. It relies on the `Shader` component for GPU computation and adheres to the `IRenderPass` interface, allowing it to be managed uniformly alongside other rendering stages like those found in [render-pass.interface](/core/render/pass/render-pass.interface.md).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| PostProcessingPass | Class | Manages the retro filter rendering pass. Initializes shaders and executes the effect on the input texture. |
| setInputTexture | Method | Sets the texture that this pass will process. |
| execute | Method | Executes the rendering pass, applying the retro filter effect to the input texture. |
| resize | Method | Handles viewport resizing, though currently implemented as a no-op. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `execute` method updates a time accumulator and then uses the `postShader` to draw a fullscreen quad. During this draw call, it binds the input texture to texture unit 0 and passes uniforms (`u_time`, `u_distortionStrength`, `u_aberrationSpread`) to the fragment shader to drive the visual effect.
- **Side Effects:** Mutates external state by interacting directly with the WebGL2RenderingContext (`gl`), which manages GPU resources (shaders, VAOs, textures). It modifies the internal `timeAccumulator` state.
- **Error Handling:** The execution method includes checks (`if (!this.enabled || !this.inputTexture || !this.postShader._shaderProgram)`) to prevent execution if necessary resources are missing or the pass is disabled.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [Scene](/core/entities.md), [Shader](/core/shaders.md), [Texture](/core/textures.md), [JsonSerializable](/core/json-serializable.md), [IRenderPass](/core/render/pass/render-pass.interface.md)