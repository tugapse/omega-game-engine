## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| EngineCache | core/engineCache |

This component serves as a centralized, static repository for managing and caching various critical engine assets, including 2D textures, cubemaps, parsed mesh data from OBJ files, and shader source code strings. Its primary responsibility is to ensure that expensive operationssuch as file I/O, network fetching, and complex parsingare executed only once per unique asset key, significantly improving runtime performance and reducing resource load.

EngineCache functions as a global service layer within the application architecture. It abstracts the loading mechanism away from the consuming systems, allowing components to request assets by URI without needing to know the underlying loading pipeline. It interacts with lower-level components like [ObjParser](/parsers/obj-parser.md) and manages resource lifecycle through methods like [releaseTexture](/core/engineCache.md).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `set` | Function | Stores a generic value in the cache under a specified key. |
| `get` | Function | Retrieves a generic value from the cache using a specified key. |
| `getTexture2D` | Function | Retrieves a 2D texture by URI, loading and caching it if absent. |
| `getTextureCube` | Function | Retrieves a cubemap texture by its face URIs, loading and caching it if absent. |
| `getWhiteTextureCube` | Function | Retrieves a default white cubemap texture, using a predefined key. |
| `getWhiteTexture` | Function | Retrieves a default white 2D texture from a predefined URI. |
| `getBlackTexture` | Function | Retrieves a default black 2D texture from a predefined URI. |
| `getNormalTexture` | Function | Retrieves a default normal map 2D texture from a predefined URI. |
| `releaseTexture` | Function | Decrements the reference count for a texture; destroys and removes it from cache if the count reaches zero. |
| `getMeshDataFromObj` | Function | Retrieves mesh data by OBJ URI, fetching and parsing it if absent. |
| `loadShaderSource` | Function | Retrieves shader source code by URI, fetching and caching it if absent. |
| `clear` | Function | Resets the entire internal cache state, destroying all managed resources. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The cache operates using a static internal state (`__cache`) structured by asset type (textures, meshs, shaderCode). Retrieval methods first check the respective map; if the asset is missing, the appropriate loading/parsing function is called, the result is stored, and the reference counter is initialized. Texture and mesh retrieval methods handle asynchronous loading via `fetch` or `await result.load()`.
- **Side Effects:** The code interacts heavily with the network via `fetch` when loading assets (textures, shaders, OBJ files). It also mutates the static internal state (`EngineCache.__cache`) and calls `texture.destroy()` when resources are released.
- **Error Handling:** `loadShaderSource` explicitly checks `response.ok` during network fetching and throws an `Error` if the fetch fails.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.
- **Internal:** [ICubemapSides](/interfaces/cubemap.md), [ObjParser](/parsers/obj-parser.md), [CubemapTexture](/textures/cubemap-texture.md), [Texture](/textures/texture.md), [MeshData](/core/mesh.md).