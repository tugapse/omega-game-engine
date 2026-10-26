## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | Texture |
| Source file | texture.ts |

The **Texture** component serves as the primary abstraction layer for managing image-based data within the WebGL2 rendering pipeline. It encapsulates the complexities of asynchronous image loading, GPU memory allocation, and the configuration of sampling parameters such as filtering and wrapping modes.

**Functional Mission**
The primary responsibility of **Texture** is to bridge the gap between high-level image assets (URIs/HTML elements) and low-level WebGL texture objects. It solves the problem of managing the lifecycle of GPU resources, providing a unified interface for creating standard color textures, depth textures for shadow mapping, and procedural textures via pixel manipulation.

**System Context & Integration**
This component acts as a critical data provider for the rendering subsystem. It is utilized by materials to define surface appearance and by render passes (such as shadow mapping) to store depth information. It integrates with the [EngineCache](/AgentDocs/core/engineCache.md) to manage resource lifecycles and implements [JsonSerializable](/AgentDocs/core/json-serializable.md) to allow texture configurations to be persisted or loaded from serialized scene data.

- **INTERNAL REFERENCES**: [EngineCache](/AgentDocs/core/engineCache.md), [JsonSerializable](/AgentDocs/core/json-serializable.md), [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md).

## 2. Environment Lookups
**Environment Lookups:**
- `gl` (via `constructor/setGL`)  The `WebGL2RenderingContext` required for all GPU operations.
- `textureUri` (via `constructor/load`)  The string path to the image asset.

**Hardcoded Constants:**
- `TextureTarget.TEXTURE_2D` (Default: `WebGL2RenderingContext.TEXTURE_2D`)  Target for 2D texture operations.
- `TextureFilterMode.LINEAR_MIPMAP_LINEAR` (Default: `TextureFilterMode.LINEAR_MIPMAP_LINEAR`)  Default minification filter.
- `TextureFilterMode.LINEAR` (Default: `TextureFilterMode.LINEAR`)  Default magnification filter.
- `TextureWrapMode.MIRRORED_REPEAT` (Default: `TextureWrapMode.MIRRORED_REPEAT`)  Default wrapping for S and T axes.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `TextureTarget` | Enum | Maps WebGL2 texture target constants. |
| `TextureFilterMode` | Enum | Maps WebGL2 minification and magnification filter constants. |
| `TextureWrapMode` | Enum | Maps WebGL2 texture wrapping constants. |
| `TextureParameter` | Enum | Maps WebGL2 texture parameter constants. |
| `Texture` | Class | Manages WebGL texture lifecycle, loading, and parameterization. |
| `createDepthTexture` | Static Method | Generates a specialized texture for depth/shadow mapping. |
| `create` | Static Method | Generates a color texture from dimensions and optional pixel data. |
| `load` | Method | Asynchronously loads an image from a URI and uploads it to the GPU. |
| `rebuild` | Method | Re-uploads the current image data to the existing GPU texture. |
| `setTextureParameters` | Method | Synchronizes class properties (filter/wrap) with the WebGL state. |
| `setPixels` | Method | Updates a specific sub-region of the texture with new pixel data. |
| `getPixels` | Method | Reads pixel data from the GPU using a temporary Framebuffer Object (FBO). |
| `bind` | Method | Binds the texture to the `TEXTURE_2D` target. |
| `unBind` | Method | Unbinds the texture from the `TEXTURE_2D` target. |
| `destroy` | Method | Releases GPU memory and clears local references. |
| `toJsonObject` | Method | Serializes texture configuration to [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md). |
| `fromJson` | Method | Deserializes texture configuration from [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md). |

## 4. Execution Logic & Flow
- **Initialization**: 
    - Instance is created via `constructor` or static factory methods (`create`, `createDepthTexture`).
    - Properties like `minFilter`, `magFilter`, `wrapS`, and `wrapT` are initialized to defaults.
    - `_glTexture` is initialized as `null`.
- **Data Path (Loading)**: 
    - `load()` is called $\rightarrow$ `Image` object created $\rightarrow$ `image.src` assigned $\rightarrow$ `onload` event triggers $\rightarrow$ `createGLTexture()` $\rightarrow$ `gl.texImage2D()` uploads data $\rightarrow$ `setTextureParameters()` applies sampling state $\rightarrow$ `isLoaded` set to `true`.
- **Data Path (Pixel Update)**: 
    - `setPixels()` $\rightarrow$ `bind()` $\rightarrow$ Type check (Image/Canvas vs ArrayBufferView) $\rightarrow$ `gl.texSubImage2D()` $\rightarrow$ `unBind()`.
- **Conditional Branching**:
    - `load()`: Checks `_loadPromise` to prevent redundant requests; checks `isLoaded` to return immediate resolution.
    - `setPixels()`: Branches logic based on whether `data` is a `TexImageSource` or an `ArrayBufferView` to select the correct WebGL overload.
    - `getPixels()`: Requires a temporary FBO attachment; if the texture is not valid, it returns `null`.

## 5. Resource Dependencies
- **Standard Libraries**: `Promise`
- **Internal Modules**: 
    - [EngineCache](/AgentDocs/core/engineCache.md)
    - [JsonSerializable](/AgentDocs/core/json-serializable.md)
    - [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md)
- **External Packages**: `WebGL2RenderingContext`, `HTMLImageElement`, `WebGLTexture` (Browser APIs)