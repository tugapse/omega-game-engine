## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| Texture | /src/textures/texture.md |

This component provides a comprehensive class, `Texture`, designed to manage the lifecycle of 2D textures within a WebGL rendering environment. Its primary responsibility is to abstract the complex process of loading image data (from URIs or raw buffers) and translating it into a usable `WebGLTexture` object on the GPU. It also offers static factory methods (`createDepthTexture`, `create`) for generating textures programmatically without external image loading.

Architecturally, `Texture` functions as a core resource manager within the engine's asset pipeline. It integrates with the engine's serialization system via `JsonSerializable` to allow textures to be saved and loaded from configuration files. It relies on the `WebGL2RenderingContext` for all GPU interactions and interacts with `EngineCache` for resource management upon destruction.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `Texture` | Class | Manages the loading, creation, and binding of 2D textures for WebGL. |
| `Texture.createDepthTexture` | Static Method | Creates a new `Texture` instance specifically configured for depth information (e.g., shadow mapping). |
| `Texture.create` | Static Method | Creates and returns a texture with a specified color and size, useful for solid color or fallback textures. |
| `load()` | Method | Asynchronously loads an image from `textureUri` and creates the corresponding WebGL texture. Returns a Promise. |
| `rebuild()` | Method | Re-uploads the existing texture data to the GPU, useful if the underlying image source has changed. |
| `setTextureParameters()` | Method | Applies the current `minFilter`, `magFilter`, `wrapS`, and `wrapT` settings to the GPU texture object. |
| `setMinFilter(filter)` | Method | Sets the minification filter for the texture and triggers a parameter update. |
| `setMagFilter(filter)` | Method | Sets the magnification filter for the texture and triggers a parameter update. |
| `setWrapS(wrap)` | Method | Sets the texture wrapping mode for the S axis and triggers a parameter update. |
| `setWrapT(wrap)` | Method | Sets the texture wrapping mode for the T axis and triggers a parameter update. |
| `setPixels(x, y, width, height, data)` | Method | Uploads a sub-region of pixel data directly to the texture on the GPU. |
| `getPixels(width, height)` | Method | Reads the pixel data from the texture back to CPU memory using a temporary Framebuffer Object (FBO). |
| `bind()` | Method | Binds the texture to the `TEXTURE_2D` target in the WebGL context. |
| `unBind()` | Method | Unbinds the texture from the `TEXTURE_2D` target. |
| `glTexture` | Getter | Returns the underlying `WebGLTexture` object. |
| `isImageLoaded` | Getter | Checks if the image data has been successfully loaded into the `HTMLImageElement`. |
| `width` | Getter | Returns the width of the texture in pixels. |
| `height` | Getter | Returns the height of the texture in pixels. |
| `destroy()` | Method | Releases the WebGL texture and associated resources from GPU memory. |
| `toJsonObject()` | Method | Serializes the texture state into a `JsonSerializedData` object. |
| `fromJson(jsonObject)` | Method | Populates the texture state from a deserialized `JsonSerializedData` object. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `Texture` class manages state transitions: from uninitialized to loading, and finally to loaded. Loading is handled asynchronously via `Image` object events. Once loaded, the texture is created on the GPU using `gl.texImage2D`. Parameter changes (`setMinFilter`, etc.) trigger a call to `setTextureParameters()`, which updates the GPU state. Reading pixels (`getPixels`) involves creating and binding a temporary Framebuffer Object (FBO) to facilitate the `gl.readPixels` operation.

- **Side Effects:** Interacts heavily with the external WebGL rendering context (`gl`), which manages GPU state. It interacts with the network when `load()` is called (fetching the image from `textureUri`). It mutates external state via `EngineCache.releaseTexture()` during `destroy()`.

- **Error Handling:** The `load()` method explicitly handles `onerror` events on the `Image` object, rejecting the promise upon failure. Static methods check for the availability of the `gl` context before proceeding.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `HTMLImageElement`, `WebGL2RenderingContext`, `Uint8Array`, `ArrayBufferView`.
- **Internal:** [EngineCache](/src/core/engine-cache.md), [JsonSerializable](/src/core/json-serializable.md), [JsonSerializedData](/src/interfaces/json-serialized-data.md).