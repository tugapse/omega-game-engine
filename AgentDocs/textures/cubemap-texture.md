## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | CubemapTexture |
| Source file | cubemap-texture.ts |

The **CubemapTexture** class is a specialized texture management component designed to handle the complexities of six-sided environmental mapping. It provides a robust mechanism for loading, managing, and uploading cubemap data to the GPU, supporting both external image-based assets and procedurally generated fallback textures.

**Functional Mission**
The primary responsibility of **CubemapTexture** is to orchestrate the asynchronous loading of six distinct image URIs and consolidate them into a single WebGL cubemap texture object. It solves the problem of synchronizing multiple network requests for environmental assets and ensures that the rendering pipeline has a valid texture (even a white fallback) to prevent shader errors during environment mapping or skybox rendering.

**System Context & Integration**
This component extends the base [Texture](/AgentDocs/textures/texture.md) class and serves as a critical data provider for materials and shaders. It is heavily utilized by [Skybox Material](/AgentDocs/materials/skybox-material.md) and [Skybox Renderer](/AgentDocs/behaviours/renderer/skybox-renderer.md) to provide environmental lighting and background imagery. The component integrates with the serialization system via [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md) to allow for the persistence of texture URIs and configuration states.

- **INTERNAL REFERENCES**: [Texture](/AgentDocs/textures/texture.md), [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md).

## 2. Environment & Configuration
**Environment Lookups:**
- `gl` (via `constructor`)  The `WebGL2RenderingContext` required for all GPU-side operations.

**Hardcoded Constants:**
- `whitePixel` (Default: `[255, 255, 255, 255]`)  Used to generate a 1x1 fallback white cubemap.
- `faces` (Default: `TEXTURE_CUBE_MAP_POSITIVE_X` through `NEGATIVE_Z`)  The standard WebGL cubemap target sequence.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `CubemapTexture` | Class | Manages the lifecycle of a 6-face cubemap texture. |
| `createWhiteCubemap` | Static Func | Factory method to instantiate a 1x1 white fallback cubemap. |
| `load` | Async Func | Orchestrates the asynchronous loading of all six face images. |
| `setLoadedImage` | Func | Updates individual face status and triggers GPU upload when complete. |
| `bind` | Func | Binds the underlying WebGL texture to the `TEXTURE_CUBE_MAP` target. |
| `createGLTexture` | Protected Func | Performs the actual WebGL `texImage2D` calls and mipmap generation. |
| `setTextureUris` | Func | Updates the array of source URIs for the cubemap faces. |
| `toJsonObject` | Func | Serializes texture state (URIs, fallback flag) for persistence. |
| `fromJson` | Func | Restores state from JSON and resets loading flags to trigger re-fetch. |

## 4. Execution Logic & Flow
- **Initialization**: 
    - Receives `gl` context and an optional array of 6 `textureUris`.
    - Sets `isLoaded` to `false` and initializes `loadedImages` tracking array with `null`.
- **Data Path**: 
    - **Input**: 6 Image URIs $\rightarrow$ **Processing**: `Image.onload` triggers for each $\rightarrow$ **Verification**: `allImagesFetchedAndLoaded()` checks completion $\rightarrow$ **Output**: `createGLTexture()` uploads data to GPU $\rightarrow$ `isLoaded = true`.
- **Conditional Branching**:
    - **Fallback Path**: If `isWhiteCubemap` is true, bypasses image loading and executes `generateWhiteCubemap` immediately.
    - **Error Path**: If any single image fails to load (`onerror`), the entire `load()` promise is rejected.
    - **Validation Path**: If `textureUris` length $\neq$ 6, the loading process is aborted with an error.

## 5. Resource Dependencies
- **Standard Libraries**: `Promise` (Asynchronous orchestration).
- **Internal Modules**: 
    - [Texture](/AgentDocs/textures/texture.md)
    - [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md)
- **External Packages**: `HTMLImageElement` (Browser API for image loading).