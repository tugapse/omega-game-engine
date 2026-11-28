## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| CubemapTexture | [src/textures/cubemap-texture.ts](/src/textures/cubemap-texture.ts) |

This component is responsible for managing the lifecycle of a cubemap texture within a WebGL environment. Its primary function is to handle the loading of six individual image assets—one for each face of a cube—and subsequently compiling them into a single, usable WebGL texture object. It supports both loading from external URIs and generating a procedural white fallback cubemap.

Architecturally, `CubemapTexture` extends the base [Texture](/src/textures/texture.ts.md) class, positioning it as a specialized resource manager within the engine's asset pipeline. It interfaces directly with the WebGL rendering context (`WebGL2RenderingContext`) to perform texture creation and binding, integrating asset loading logic with low-level graphics API calls.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `CubemapTexture` | Class | Manages the loading, creation, and binding of a cubemap texture. |
| `CubemapTexture.createWhiteCubemap` | Static Method | Creates and returns a new `CubemapTexture` instance pre-filled with white pixels for all faces. |
| `CubemapTexture.setTextureUris` | Method | Sets the array of six URIs required for the cubemap faces. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The class manages two primary loading paths: asynchronous loading via `load()` which fetches six images using `Image` objects and resolves upon successful retrieval, or synchronous generation via `createWhiteCubemap()`. If loading, `setLoadedImage` coordinates the final texture creation (`createGLTexture`) once all images are ready. `createGLTexture` uses `gl.texImage2D` six times, once for each cube map face target, to populate the texture.
- **Side Effects:** Interacts heavily with the WebGL context (`gl`) by calling `gl.createTexture()`, `gl.bindTexture()`, and `gl.texImage2D()`. It also interacts with the network/asset system via `Resources.resolveUri()` during the `load()` process.
- **Error Handling:** Rejects the loading Promise if `textureUris` is missing or does not contain six elements. It handles image loading errors by rejecting the Promise upon failure of any single image fetch. It logs errors if WebGL texture creation fails.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `Image` (Browser API), `Uint8Array` (JavaScript standard).
- **Internal:** [Resources](/src/core/resources/resources.md), [JsonSerializedData](/src/interfaces.md), [Texture](/src/textures/texture.ts.md).