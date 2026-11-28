## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **TerrainShader** | [src/terrain/terrain-shader.ts](/src/terrain/terrain-shader.ts) |

This component implements the fragment shader logic for rendering a single terrain chunk. Its primary responsibility is to manage the rendering pipeline state, including binding material textures, chunk-specific splat textures, and configuring various shader uniforms based on the terrain's material properties and chunk data. It inherits from [LitShader](/src/shaders/lit-shader.md) to leverage base rendering functionality.

This class acts as a specialized rendering component within the terrain system. It integrates the [TerrainMaterial](/src/terrain/terrain-material.md) to define visual properties and uses [TerrainChunkData](/src/terrain/terrain-data.md) to load chunk-specific data like splat maps. It manages the compilation and caching of WebGL programs based on material defines, ensuring efficient resource reuse across multiple chunks sharing the same material configuration.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `TerrainShader` | Class | Manages the terrain rendering pipeline, handling shader initialization, data loading, and resource cleanup for a terrain chunk. |
| `TERRAIN_UNITS` | Object | Defines the texture unit indices used for terrain layers and splat maps. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `initialize` method handles shader program compilation and caching, keyed by the material's `triplanar` setting. The `loadDataIntoShader` method uploads material uniforms (like tiling, height, and blend factors) and binds texture arrays (albedo, normal) and chunk-specific splat textures to the active shader program. The `updateSplat` method ensures that the chunk's splat data is uploaded to the associated WebGL textures only if the chunk's `splatVersion` has changed.
- **Side Effects:** Mutates global state by interacting with the WebGL context (`this.gl`) to create, bind, and delete textures. It also manages a global `programs` Map to cache compiled `WebGLProgram` objects across different instances.
- **Error Handling:** The `initialize` method returns a `Promise<boolean>`, resolving to `false` if the underlying `super.initialize()` fails to compile the shader program.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:**
    - [Camera](/src/entities/camera.md)
    - [ShaderUniformsEnum](/src/enums/shader-uniforms.enum.md)
    - [LitShader](/src/shaders/lit-shader.md)
    - [Shader](/src/shaders/shader.md)
    - [ShaderSources](/src/shaders/shader-sources.md)
    - [TerrainChunkData](/src/terrain/terrain-data.md)
    - [TerrainMaterial](/src/terrain/terrain-material.md)