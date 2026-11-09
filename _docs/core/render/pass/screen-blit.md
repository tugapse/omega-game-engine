## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| ScreenBlitPass | core/render/pass/screen-blit |

This component implements the `ScreenBlitPass`, a specialized render pass responsible for drawing a texture to the entire screen surface. Its primary function is to act as the final stage in a rendering pipeline, taking the output from a previous rendering operation (usually stored in a framebuffer attachment) and presenting it to the main display canvas.

Architecturally, `ScreenBlitPass` functions as a rendering service within the core rendering system. It relies on the `WebGL2RenderingContext` to manage drawing operations and utilizes a dedicated `UnlitShader` to perform the texture sampling and full-screen quad drawing, integrating seamlessly with the overall rendering flow managed by the `IRenderPass` interface.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| ScreenBlitPass | Class | Manages the screen blitting process. Requires initialization via `initialize()` and execution via `execute()`. |
| setGl | Method | Sets or updates the internal `WebGL2RenderingContext` used by the pass. |
| initialize | Method | Asynchronously compiles and prepares the internal shader resources for rendering. |
| execute | Method | Executes the render pass, drawing the `sourceTexture` across the entire viewport. |
| cleanup | Method | Releases all WebGL resources associated with the pass. |
| resize | Method | Handles viewport resizing, though this specific pass has no functional change on resize. |
| setInputTexture | Method | Sets the `Texture` object that will be sampled and drawn to the screen. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The pass initializes a fullscreen quad shader. During execution, it configures the viewport to match the canvas dimensions, disables depth testing, binds the provided `sourceTexture` to texture unit 0, and draws a fixed set of 6 vertices (forming two triangles) to cover the screen.
- **Side Effects:** Mutates external state by interacting directly with the `WebGL2RenderingContext` (`gl`), performing texture binding, viewport setting, and drawing commands.
- **Error Handling:** The `execute` method includes a guard clause to immediately return if `sourceTexture` is null or if the internal shader has not been initialized, preventing runtime errors during rendering.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [Scene](/core/entities.md), [UnlitMaterial](/core/materials.md), [Shader](/core/shaders.md), [Texture](/core/textures.md), [JsonSerializable](/core/json-serializable.md), [IRenderPass](/core/render-pass.interface.md)