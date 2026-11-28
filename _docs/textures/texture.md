## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **Texture** | [src/textures/texture.ts](/src/textures/texture.ts) |

This component provides a comprehensive class, `Texture`, for managing 2D textures within a WebGL rendering environment. Its primary responsibility is to encapsulate the lifecycle of a texture, from loading image data via a specified `ResourceLoader` to creating, configuring, and binding the corresponding `WebGLTexture` object on the GPU. It handles texture parameters such as filtering modes, wrapping modes, and allows for dynamic updates of pixel data.

Architecturally, `Texture` serves as a core data model within the engine's resource management system. It extends `JsonSerializable` to allow textures to be persisted and loaded from configuration files. It interacts heavily with low-level graphics context operations, relying on the `WebGL2RenderingContext` provided during instantiation, and utilizes `Resources` for default loading mechanisms.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `TextureTarget` | Enum | Enumeration of WebGL texture targets, primarily `TEXTURE_2D`. |
| `TextureFilterMode` | Enum | Enumeration defining texture filtering modes (e.g., `NEAREST`, `LINEAR_MIPMAP_LINEAR`). |
| `TextureWrapMode` | Enum | Enumeration defining texture wrapping modes (e.g., `REPEAT`, `CLAMP_TO_EDGE`). |
| `TextureParameter` | Enum | Enumeration mapping to specific WebGL texture parameters (e.g., `MIN_FILTER`, `WRAP_S`). |
| `Texture` | Class | Manages the loading, creation, and binding of 2D textures. |
| `Texture.createDepthTexture` | Static Method | Creates a new `Texture` instance specifically configured for depth information, suitable for shadow mapping. |
| `Texture.create` | Static Method | Creates and returns a new `Texture` instance initialized with specified color and dimensions, useful for solid color or fallback textures. |
| `Texture.load` | Method | Initiates the asynchronous loading of the texture from its URI, resolving when the GPU texture is ready. |
| `Texture.setTextureParameters` | Method | Applies the current `minFilter`, `magFilter`, `wrapS`, and `wrapT` settings to the bound texture on the GPU. |
| `Texture.setMinFilter` | Method | Sets the minification filter and triggers a parameter update. |
| `Texture.setMagFilter` | Method | Sets the magnification filter and triggers a parameter update. |
| `Texture.setWrapS` | Method | Sets the wrapping mode for the S axis and triggers a parameter update. |
| `Texture.setWrapT` | Method | Sets the wrapping mode for the T axis and triggers a parameter update. |
| `Texture.setPixels` | Method | Uploads a sub-region of pixel data (from an image, canvas, or array buffer) to the texture on the GPU. |
| `Texture.getPixels` | Method | Reads the pixel data back from the texture on the GPU into a `Uint8Array`, requiring temporary Framebuffer Object (FBO) setup. |
| `Texture.bind` | Method | Binds the texture to the `TEXTURE_2D` target in the WebGL context. |
| `Texture.unBind` | Method | Unbinds the texture from the `TEXTURE_2D` target. |
| `Texture.glTexture` | Getter | Returns the underlying `WebGLTexture` object. |
| `Texture.isImageLoaded` | Getter | Returns a boolean indicating if the image data has been successfully loaded into the `HTMLImageElement`. |
| `Texture.width` | Getter | Returns the width of the texture in pixels. |
| `Texture.height` | Getter | Returns the height of the texture in pixels. |
| `Texture.destroy` | Method | Releases the associated `WebGLTexture` from GPU memory and cleans up internal references. |
| `Texture.toJsonObject` | Method | Serializes the texture's state into a `JsonSerializedData` object. |
| `Texture.fromJson` | Method | Populates the texture object from a `JsonSerializedData` object. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `Texture` class manages two primary states: the CPU-side `LoadedImage` and the GPU-side `WebGLTexture`. Loading involves using the `ResourceLoader` to fetch an image, which resolves into the `image` property. Once loaded, `createGLTexture` uploads this image data to the GPU using `gl.texImage2D`. Parameter setting (`setTextureParameters`) applies filtering and wrapping modes. Methods like `setPixels` and `getPixels` facilitate data transfer between CPU memory and GPU memory using `texSubImage2D` and `readPixels`, respectively.
- **Side Effects:** The code interacts heavily with the external WebGL context (`gl`), performing GPU state changes (binding, setting parameters, uploading data) and managing GPU resources (creating/deleting textures and framebuffers). It also interacts with the network/file system indirectly via the `ResourceLoader` when `load()` is called.
- **Error Handling:** The `load()` method explicitly handles loading failures by rejecting the promise and logging errors. `createDepthTexture` includes a check for `gl.createTexture()` returning null, logging an error and returning a partially initialized texture. Methods like `getPixels` and `setPixels` include checks to ensure the `gl` context and `_glTexture` are available before proceeding.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `HTMLImageElement`, `WebGL2RenderingContext`, `WebGLTexture`, `Framebuffer` related types.
- **Internal:** [../core/resources/resources](/../core/resources/resources.md), [../core/resources/resource-loader](/../core/resources/resource-loader.md), [../core/interfaces](/../core/interfaces.md).