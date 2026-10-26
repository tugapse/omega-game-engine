## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | EngineCache |
| Source file | engineCache.ts |

The **EngineCache** serves as the centralized, static repository for all heavy-weight assets within the engine. It is designed to prevent redundant network requests and expensive re-parsing operations by maintaining in-memory instances of textures, mesh data, and shader source code. By implementing a reference-counting mechanism for textures, it ensures efficient memory management and lifecycle control.

**Functional Mission**
The primary responsibility of **EngineCache** is to act as a singleton-patterned resource manager that optimizes engine performance through asset reuse. It solves the problem of resource duplication and high latency by providing asynchronous accessors that check for existing assets before initiating new loads or parses.

**System Context & Integration**
This component sits at the base of the resource loading pipeline. It is utilized by various engine modules to retrieve necessary data for rendering and entity construction. For instance, it provides [MeshData](/AgentDocs/interfaces/meshData.md) via the [ObjParser](/AgentDocs/parsers/obj-parser.md) and manages the lifecycle of [Texture](/AgentDocs/textures/texture.md) and [CubemapTexture](/AgentDocs/textures/cubemap-texture.md) objects. It acts as a bridge between raw external assets (URIs) and the high-level engine objects used by [MeshRendererBehaviour](/AgentDocs/behaviours/renderer/mesh-renderer-behaviour.md) and other rendering components.

- **INTERNAL REFERENCES**: [MeshData](/AgentDocs/interfaces/meshData.md), [ObjParser](/AgentDocs/parsers/obj-parser.md), [Texture](/AgentDocs/textures/texture.md), [CubemapTexture](/AgentDocs/textures/cubemap-texture.md), [ICubemapSides](/AgentDocs/interfaces/cubemap.md).

## 2. Environment & Configuration
**Environment Lookups:**
- `gl` (via `getTexture2D`, `getTextureCube`, `getWhiteTextureCube`, `getWhiteTexture`, `getBlackTexture`, `getNormalTexture`)  The `WebGL2RenderingContext` required for GPU resource allocation.

**Hardcoded Constants:**
- `assets/images/default/white.jpg` (Default: `white.jpg`)  URI for the default white texture.
- `assets/images/default/black.jpg` (Default: `black.jpg`)  URI for the default black texture.
- `assets/images/default/normal.jpg` (Default: `normal.jpg`)  URI for the default normal map texture.
- `assets/images/default/white.jpg` (Default: `white.jpg`)  URI used within `getWhiteTextureCube` for all six faces.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `set` | Func | Stores a value in the `generic` cache space with a warning for reserved keys. |
| `get` | Func | Retrieves a value from the `generic` cache space using a generic type `T`. |
| `getTexture2D` | Func | Asynchronously retrieves or creates a 2D [Texture](/AgentDocs/textures/texture.md). |
| `getTextureCube` | Func | Asynchronously retrieves or creates a [CubemapTexture](/AgentDocs/textures/cubemap-texture.md) using a set of URIs. |
| `getWhiteTextureCube` | Func | Returns a cached cubemap where all faces point to the default white texture. |
| `getWhiteTexture` | Func | Returns the default white 2D texture. |
| `getBlackTexture` | Func | Returns the default black 2D texture. |
| `getNormalTexture` | Func | Returns the default normal map 2D texture. |
| `releaseTexture` | Func | Decrements the reference counter for a texture and destroys it if the count reaches zero. |
| `getMeshDataFromObj` | Func | Fetches and parses an OBJ file into [MeshData](/AgentDocs/interfaces/meshData.md). |
| `loadShaderSource` | Func | Fetches and caches raw shader source code strings. |
| `clear` | Func | Resets all internal cache storage objects. |

## 4. Execution Logic & Flow
- **Initialization**: The `__cache` object is initialized with empty maps for `shaderCode`, `textures`, `meshs`, `textureCounter`, and `generic`. An instance of `ObjParser` is instantiated.
- **Data Path (Texture Loading)**: 
    1. Input: `uri` and `gl`.
    2. Check `__cache.textures[uri]`.
    3. If missing: Create `new Texture(gl, uri)`, add to `textures`, set `textureCounter[uri] = 1`.
    4. If present: Increment `textureCounter[uri]`.
    5. Execution: `await result.load()`.
    6. Output: `Texture` instance.
- **Data Path (Mesh Loading)**:
    1. Input: `uri`.
    2. Check `__cache.meshs[uri]`.
    3. If missing: `fetch(uri)` $\rightarrow$ `text()` $\rightarrow$ `objParser.parse(text)` $\rightarrow$ Store in `meshs`.
    4. Output: `MeshData`.
- **Conditional Branching (Texture Release)**:
    1. Check if `textureCounter[uri]` exists.
    2. Decrement counter.
    3. If counter $== 0$: Call `texture.destroy()`, delete from `textures` and `textureCounter`.

## 5. Resource Dependencies
- **Standard Libraries**: `fetch` (Web API)
- **Internal Modules**: 
    - [ICubemapSides](/AgentDocs/interfaces/cubemap.md)
    - [ObjParser](/AgentDocs/parsers/obj-parser.md)
    - [CubemapTexture](/AgentDocs/textures/cubemap-texture.md)
    - [Texture](/AgentDocs/textures/texture.md)
    - [MeshData](/AgentDocs/interfaces/meshData.md)
- **External Packages**: None identified.