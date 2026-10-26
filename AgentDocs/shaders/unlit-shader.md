## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | UnlitShader |
| Source file | unlit-shader.ts |

The **UnlitShader** is a specialized implementation of the base shader class designed for high-performance rendering of objects that do not require complex lighting calculations. It serves as a lightweight alternative to lit shaders, making it ideal for UI elements, skyboxes, or stylized effects where only base color and texture data are necessary.

**Functional Mission**
The primary responsibility of **UnlitShader** is to manage the lifecycle and data synchronization between an [UnlitMaterial](/AgentDocs/materials/unlit-material.md) and the GPU via WebGL2. It solves the problem of mapping material propertiesspecifically base color, UV transformations (scale/offset), and texturesinto the appropriate shader uniform locations for unlit rendering.

**System Context & Integration**
This component acts as the bridge between the material system and the rendering pipeline. It consumes data from [UnlitMaterial](/AgentDocs/materials/unlit-material.md) and utilizes [ShaderSources](/AgentDocs/shaders/shader-sources.md) to compile its programs. During the render loop, it is responsible for ensuring that textures are fully loaded and bound to the correct texture units before the draw call occurs. It integrates with the broader shader hierarchy by extending [Shader](/AgentDocs/shaders/shader.md) and utilizes [ShaderUniformsEnum](/AgentDocs/enums/shader-uniforms.enum.md) to maintain strict naming conventions for GPU communication.

## 2. Environment & Configuration
**Environment Lookups:**
- `gl` (via `constructor`)  The `WebGL2RenderingContext` used for all GPU operations and resource management.

**Hardcoded Constants:**
- `_className` (Default: `"UnlitShader"`)  Internal identifier for class-based debugging or reflection.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `instanciate` | Static Method | Factory method to create a new `UnlitShader` instance with a specific WebGL context and material. |
| `constructor` | Constructor | Initializes the shader with specific vertex and fragment sources from [ShaderSources](/AgentDocs/shaders/shader-sources.md). |
| `loadDataIntoShader` | Async Method | Orchestrates the transfer of material properties (color, UV, texture) to GPU uniforms. |
| `checkAndLoadTextures` | Async Method | Validates texture readiness; triggers loading if the image is not yet resident in GPU memory. |
| `release` | Method | Performs cleanup by unbinding the material's main texture to prevent state leakage. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. Receives `WebGL2RenderingContext` and `UnlitMaterial`.
    2. Calls `super` to initialize the base [Shader](/AgentDocs/shaders/shader.md) with `ShaderSources.frag.default_unlit` and `ShaderSources.vertex.default`.
- **Data Path**: 
    1. **Input**: Properties from `UnlitMaterial` (color, `uvScale`, `uvOffset`, `mainTex`).
    2. **Processing**: 
        - `checkAndLoadTextures` ensures `mainTex` is loaded via `material.mainTex.load()`.
        - `setVec4`, `setVec2`, and `setTexture` map these values to `ShaderUniformsEnum` locations.
    3. **Output**: Updated GPU uniform states and bound texture units ready for the rasterizer.
- **Conditional Branching**:
    - **Texture Readiness**: If `material.mainTex` exists, the logic branches based on `isImageLoaded`. If false, it awaits the `load()` process; if true, it proceeds directly to binding.
    - **Material Presence**: `loadDataIntoShader` exits early if `this.material` is null.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [ShaderUniformsEnum](/AgentDocs/enums/shader-uniforms.enum.md)
    - [UnlitMaterial](/AgentDocs/materials/unlit-material.md)
    - [Shader](/AgentDocs/shaders/shader.md)
    - [ShaderSources](/AgentDocs/shaders/shader-sources.md)
- **External Packages**: None identified.