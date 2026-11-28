## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **LitShader** | [src/shaders/lit-shader.ts](/src/shaders/lit-shader.ts) |

This component implements the core logic for a physically-based rendering (PBR) lighting shader, specifically designed for lit materials. Its primary responsibility is to manage the shader program lifecycle, load necessary material properties (like color, UV scaling, and texture maps), and pass this data to the underlying WebGL context for rendering. It extends the base `Shader` class to provide specialized lighting calculations.

The `LitShader` acts as a specialized rendering pipeline component within the engine's material system. It consumes data from a [LitMaterial](/src/materials/lit-material.md) instance and interacts heavily with resource management via [Resources](/src/core/resources/resources.md) and texture handling via [Texture](/src/textures/texture.md). It bridges the high-level material definition with low-level WebGL operations.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `LitShader.instanciate` | Static Method | Factory method to create a new instance of `LitShader` given a WebGL context and a `LitMaterial`. |
| `LitShader` | Class | Represents the shader implementation for lit materials, inheriting from `Shader`. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The shader initializes by setting up its vertex and fragment shader sources. The `loadDataIntoShader` method populates uniform variables with material properties like color, UV offsets, specular strength, and camera position. The `checkAndLoadTextures` method asynchronously handles texture binding, ensuring that textures are loaded or fall back to built-in textures before binding them to specific texture units in WebGL.
- **Side Effects:** Mutates external state by interacting directly with the `WebGL2RenderingContext` (`this.gl`) to bind textures and set uniforms. It also manages the lifecycle of associated `Texture` objects, calling `bind()`, `unBind()`, `destroy()`, and `load()`.
- **Error Handling:** The `checkAndLoadTextures` method uses a fallback mechanism: if a texture is missing or not loaded, it attempts to load a default texture provided by [Resources](/src/core/resources/resources.md) instead of failing.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.
- **Internal:**
    - [Resources](/src/core/resources/resources.md)
    - [BuiltinTextures](/src/core/resources/builtin-textures.md)
    - [Camera](/src/entities/camera.md)
    - [ShaderUniformsEnum](/src/enums/shader-uniforms.enum.md)
    - [JsonSerializedData](/src/interfaces.md)
    - [LitMaterial](/src/materials/lit-material.md)
    - [Texture](/src/textures/texture.md)
    - [Shader](/src/shaders/shader.md)
    - [ShaderSources](/src/shaders/shader-sources.md)