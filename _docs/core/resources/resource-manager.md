## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| ResourceManager | /core/resources/resource-manager.ts |

The `ResourceManager` class is the central service responsible for managing the lifecycle, loading, and caching of all assets required by the rendering engine, including textures, cubemaps, meshes, shaders, and models. It abstracts the complexity of asset loading, ensuring that resources are loaded only once and are efficiently reused across different parts of the application.

This component acts as a core service layer within the application architecture. It utilizes various specialized caches, such as [ResourceCache](/core/resources/resource-cache.md), to manage different asset types. It coordinates with a replaceable [ResourceLoader](/core/resources/resource-loader.md) to handle the actual fetching of data, while also managing context-specific resources like [RenderTexture](/core/textures/render-texture.md).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `ResourceManagerStats` | Interface | Defines the structure for reporting statistics across all managed resource types. |
| `ResourceManager.cubemapKey` | Static Method | Generates a unique string key for a cubemap based on its six face URIs. |
| `ResourceManager.getTexture` | Method | Acquires a texture resource by URI, returning a handle to the cached value. |
| `ResourceManager.getCubemap` | Method | Acquires a cubemap resource by its face configuration. |
| `ResourceManager.getRenderTexture` | Method | Retrieves or creates a specific [RenderTexture](/core/textures/render-texture.md) identified by a name. |
| `ResourceManager.getWhiteCubemap` | Method | Returns a promise for a cubemap where all six faces are set to the built-in white texture. |
| `ResourceManager.getMesh` | Method | Acquires a mesh resource by its URI. |
| `ResourceManager.getModel` | Method | Acquires a model resource by its base URI, ensuring it is parsed only once. |
| `ResourceManager.loadBinary` | Method | Loads a binary file from a given URI, falling back to `fetch` if the configured loader lacks binary loading capability. |
| `ResourceManager.getShader` | Method | Acquires a shader source string by its URI. |
| `ResourceManager.peekValue` | Static Method | Releases a resource handle immediately and returns the stored value. |
| `ResourceManager.setLoader` | Method | Replaces the internal `ResourceLoader` instance used for all subsequent loading operations. |
| `ResourceManager.getLoader` | Method | Returns the currently configured `ResourceLoader` instance. |
| `ResourceManager.stats` | Method | Returns a `ResourceManagerStats` object detailing the usage counts for all cached resource types. |
| `ResourceManager.trim` | Method | Iterates over all caches and frees resources that are no longer held by any active handles, returning the count of freed resources. |
| `ResourceManager.dispose` | Method | Clears all caches and explicitly destroys all managed resources, including render textures, typically called when the WebGL context is destroyed. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The constructor initializes five distinct `ResourceCache` instances, one for each major asset type. Loading logic is highly specialized: textures check for render texture URIs or use a fallback mechanism involving a "missing" texture loader upon load failure. Models are parsed based on file format detection (FBX or COLLADA). The `modelImageLoader` acts as a specialized loader to resolve embedded textures within model data.
- **Side Effects:** The component interacts heavily with the network via `fetch` (in `loadBinary`) and relies on the injected `ResourceLoader` for file I/O. It mutates the internal state by managing the `renderTextures` Map and the contents of the five `ResourceCache` instances.
- **Error Handling:** Texture loading includes a `try...catch` block that logs a warning and substitutes the missing texture if the primary load fails. Model loading throws an error if the binary format is neither FBX nor COLLADA.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `fetch`, `TextDecoder`, `Blob`, `ImageBitmap` (Browser APIs).
- **Internal:** [ICubemapSides](/core/resources/interfaces/cubemap.md), [ObjParser](/core/parsers/obj-parser.md), [CubemapTexture](/core/textures/cubemap-texture.md), [Texture](/core/textures/texture.md), [RenderTexture](/core/textures/render-texture.md), [MeshData](/core/mesh/mesh-data.md), [ResourceCache](/core/resources/resource-cache.md), [ResourceLoader](/core/resources/resource-loader.md), [DefaultResourceLoader](/core/resources/resource-loader.md), [BuiltinTextures](/core/resources/builtin-textures.md), [EMBEDDED_SHADERS](/core/shaders/embedded-shaders.ts), [ModelData](/core/model/model-data.md), [ObjParser](/core/parsers/obj-parser.md), [parseFbx](/core/parsers/fbx/fbx-parser.ts), [isCollada](/core/parsers/collada/collada-parser.ts), [parseCollada](/core/parsers/collada/collada-parser.ts), [isFbx](/core/parsers/fbx/fbx-reader.ts), [LoadedImage](/core/resources/resource-loader.ts).