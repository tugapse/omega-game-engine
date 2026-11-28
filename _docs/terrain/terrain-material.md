## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| TerrainMaterial | [src/terrain/terrain-material.ts](/src/terrain/terrain-material.ts) |

This component defines the `TerrainMaterial`, which encapsulates all visual properties and rendering rules for terrain chunks. Its primary responsibility is to manage the blending of multiple terrain layers, handling texture loading, and preparing necessary shader uniforms and texture arrays for WebGL rendering. It ensures that terrain appearance is consistent across all chunks by centralizing material definitions.

The `TerrainMaterial` acts as a core rendering configuration service within the application's material system. It extends [LitMaterial](/src/materials/lit-material.md) and relies on data structures defined in [TerrainLayer](/src/terrain/terrain-rules.md) and texture utilities like [TextureArray](/src/textures/texture-array.md). It integrates texture generation via [cachedGroundTexture](/src/terrain/terrain-material.ts) and manages state synchronization between material properties and GPU resources.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `cachedGroundTexture` | Function | Generates and caches a `GroundTexture` instance for a specific terrain layer kind and size, ensuring single instantiation. |
| `TerrainMaterial` | Class | Extends `LitMaterial` to hold terrain-specific rendering parameters, manage texture arrays, and provide methods for serialization and uniform generation. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `TerrainMaterial` manages two primary states: `version` (for rule changes) and `textureVersion` (for texture resource changes). The `uniforms()` method caches and returns packed shader data based on the current `version`. The `textures()` method handles the creation or retrieval of `TextureArray` instances for a given `WebGL2RenderingContext`, regenerating them only when `textureVersion` changes. Texture loading for URI-based layers is handled asynchronously by the `loadInto` function.
- **Side Effects:** The code interacts with the browser's DOM (`document`) to create `Image` and `canvas` elements when loading textures from URIs via `loadInto`. It also manages GPU resources by creating and destroying `TextureArray` instances within the `textures` method.
- **Error Handling:** The `loadInto` function includes a `try...catch` block to log a warning (`console.warn`) if an image fails to load or decode from a provided URI.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `Image`, `canvas`, `WebGL2RenderingContext` (Browser APIs).
- **Internal:** [JsonSerializedData](/src/interfaces/json-serialized-data.ts), [LitMaterial](/src/materials/lit-material.md), [TextureArray](/src/textures/texture-array.md), [TerrainLayer](/src/terrain/terrain-rules.md), [GroundTexture](/src/terrain/terrain-textures.ts).