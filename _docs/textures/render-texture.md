## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| RenderTexture | [src/textures/render-texture.ts](/src/textures/render-texture.ts) |

This component defines `RenderTexture`, a specialized texture class designed to serve as a rendering target for a camera. Its primary responsibility is to manage a ping-pong buffering mechanism using two `RenderTarget` instances. This setup allows the camera to draw into one buffer while materials simultaneously read from the other, preventing feedback loops inherent in WebGL rendering.

Architecturally, `RenderTexture` extends the base `Texture` class, positioning it as a specialized resource within the rendering pipeline. It interacts with the core rendering system by utilizing `RenderTarget` objects (imported from [/core/render/render-target.ts](/core/render/render-target.ts)) to manage the actual drawing surfaces, making it a key data structure for camera output.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `RENDER_TEXTURE_SCHEME` | Constant | The URI scheme prefix used to identify render texture URIs (`rendertexture://`). |
| `isRenderTextureUri` | Function | Checks if a given string URI starts with the `RENDER_TEXTURE_SCHEME`. |
| `renderTextureUri` | Function | Ensures a given name is formatted as a full render texture URI, prepending the scheme if necessary. |
| `RenderTexture` | Class | Represents a texture that a camera renders into, managing two internal targets for double buffering. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `RenderTexture` maintains two internal `RenderTarget` targets and uses `readIndex` and `written` flags to manage which target is currently being written to and which is available for reading. The `beginWrite` method selects the inactive target, and `endWrite` swaps the read/write indices. The `glTexture` getter returns the texture associated with the most recently completed render.
- **Side Effects:** Mutates internal state (`targets`, `readIndex`, `written`). It interacts with the underlying WebGL context (`gl`) via methods like `bindTexture` and calls `dispose()` on its internal `RenderTarget`s during destruction.
- **Error Handling:** The `load()` method explicitly returns a resolved `Promise<void>`, indicating that loading is inherently synchronous/immediate for this texture type.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.
- **Internal:**
    - [/core/render/render-target.ts](/core/render/render-target.ts)
    - [/src/textures/texture.ts](/src/textures/texture.ts)