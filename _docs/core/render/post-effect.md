## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **PostEffect** | [core/render/post-effect.ts](/core/render/post-effect.ts) |

This component defines the abstract base class `PostEffect`, which serves as the core mechanism for applying visual modifications to the rendered frame during the post-processing pipeline. Its primary responsibility is to manage the rendering process for a specific screen-space effect, taking the source texture from the render context and drawing the modified result to the target buffer.

This class acts as a service layer within the rendering architecture. Concrete implementations, such as [RetroEffect](/core/render/post-effect.ts), inherit from `PostEffect` to define their specific visual parameters and shader logic, allowing the rendering engine to chain multiple effects sequentially.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `PostEffect` | Class | Abstract base class for all post-processing effects. Manages the lifecycle of the rendering program. |
| `RetroEffect` | Class | Concrete implementation of `PostEffect` that applies a retro CRT look, including barrel distortion and chromatic aberration. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `render` method initializes or retrieves a `FullscreenProgram` using the effect's defined fragment shader URI. It then binds the source color texture (`ctx.source.colorTexture`) to the shader uniform `u_screenTexture`, applies effect-specific uniforms via `setUniforms`, and executes the draw call. The `dispose` method ensures the underlying rendering program resources are released.
- **Side Effects:** Mutates external state by interacting with the OpenGL context (`ctx.gl`), binding textures, and drawing geometry.
- **Error Handling:** Includes a guard clause in `render` (`if (!ctx.source) return;`) to prevent execution if the source context is unavailable.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.
- **Internal:** [ShaderSources](/core/render/shader-sources.ts), [FullscreenProgram](/core/render/fullscreen-program.ts), [RenderContext](/core/render/render-pass.interface.ts).