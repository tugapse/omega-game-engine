## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| CubemapTexture | textures/cubemap-texture |

This component is responsible for managing the lifecycle of a cubemap texture within a WebGL environment. Its primary responsibility is to abstract the complexity of loading six individual face images (right, left, top, bottom, front, back) and compiling them into a single, usable WebGL texture object. It also provides a static method to generate a simple, white fallback cubemap for scenarios where external textures are unavailable.

Architecturally, `CubemapTexture` acts as a specialized resource manager within the rendering pipeline. It inherits from [Texture](/textures/texture.md) and handles asynchronous loading via promises, coordinating the loading of `HTMLImageElement`s before calling `createGLTexture` to upload the data to the GPU. It integrates serialization capabilities via `toJsonObject` and `fromJson` to persist its state, including the URIs and the `isWhiteCubemap` flag.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| CubemapTexture | Class | Manages the loading, creation, and binding of a cubemap texture. |
| CubemapTexture.createWhiteCubemap | Static Method | Creates and returns a new `CubemapTexture` instance initialized with a 1x1 white cubemap. |
| CubemapTexture.setTextureUris | Method | Sets the array of six URIs required for the cubemap faces. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The loading process is asynchronous. If `isWhiteCubemap` is true, `generateWhiteCubemap` is called immediately to create the GPU resource. Otherwise, `load()` initiates parallel fetching of six images. Once all images are loaded, `setLoadedImage` triggers `createGLTexture`, which binds the texture, sets parameters, and uploads the image data to the six corresponding cube map faces using `gl.texImage2D`.
- **Side Effects:** Interacts heavily with the WebGL context (`gl`), creating and manipulating GPU resources (`_glTexture`). It also interacts with the network via `new Image()` when loading from URIs.
- **Error Handling:** Rejects the loading promise if the required six URIs are missing or if any individual image fails to load (`_image.onerror`). It logs errors if WebGL texture creation fails.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [JsonSerializedData](/interfaces/json-serialized-data.md), [Texture](/textures/texture.md)