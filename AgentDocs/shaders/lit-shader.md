## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | LitShader |
| Source file | lit-shader.ts |

The **LitShader** is a specialized implementation of the base shader class designed to facilitate Physically Based Rendering (PBR) workflows. It serves as the bridge between high-level material properties defined in a [LitMaterial](/AgentDocs/materials/lit-material.md) and the low-level WebGL2 execution environment. Its primary purpose is to manage the complex state required for advanced lighting models, including normal mapping, specular/roughness workflows, and emissive properties.

**Functional Mission**
The core mission of **LitShader** is to orchestrate the binding of multi-texture PBR data and uniform constants to the GPU. It solves the problem of asynchronous texture loading by implementing a fallback mechanism that ensures the rendering pipeline remains uninterrupted while high-resolution assets are fetched from the network or disk.

**System Context & Integration**
This component operates within the rendering pipeline, consuming data from [LitMaterial](/AgentDocs/materials/lit-material.md) and utilizing [EngineCache](/AgentDocs/core/engineCache.md) to provide default textures (white/black) when specific maps are missing. It interacts heavily with the [Camera](/AgentDocs/entities/camera.md) to provide view-space positioning and uses [ShaderUniformsEnum](/AgentDocs/enums/shader-uniforms.enum.md) to ensure type-safe communication with the GLSL programs defined in [ShaderSources](/AgentDocs/shaders/shader-sources.md).

- **INTERNAL REFERENCES**: [LitMaterial](/AgentDocs/materials/lit-material.md), [EngineCache](/AgentDocs/core/engineCache.md), [Camera](/AgentDocs/entities/camera.md), [ShaderUniformsEnum](/AgentDocs/enums/shader-uniforms.enum.md), [ShaderSources](/AgentDocs/shaders/shader-sources.md), [Shader](/AgentDocs/shaders/shader.md), [Texture](/AgentDocs/textures/texture.md), [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md).

## 2. Environment & Configuration
**Environment Lookups:**
- `gl` (via `constructor`)  The WebGL2 rendering context used for all GPU operations.
- `Camera.mainCamera.transform.worldPosition` (via `loadDataIntoShader`)  Retrieves the global position of the primary camera for lighting calculations.

**Hardcoded Constants:**
- `0.01` (via `loadDataIntoShader`)  Minimum roughness floor to prevent division-by-zero or mathematical singularities in PBR equations.
- `TEXTURE0` through `TEXTURE6` (via `checkAndLoadTextures`)  Hardcoded texture unit assignments for specific maps (Main: 0, Normal: 1, Specular: 3, Roughness: 4, AO: 5, Emissive: 6).

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `instanciate` | Static Method | Factory method to create a new `LitShader` instance with a specific material. |
| `constructor` | Constructor | Initializes the shader with default lit fragment and vertex sources. |
| `loadDataIntoShader` | Method | Synchronizes material properties (color, UV, roughness, etc.) and camera position to GPU uniforms. |
| `checkAndLoadTextures` | Method | Asynchronously manages texture binding, implementing fallback logic for non-loaded textures. |
| `release` | Method | Unbinds all material-associated textures from the WebGL state. |
| `toJsonObject` | Method | Serializes the shader and its material state for persistence. |
| `fromJson` | Method | Reconstructs the shader and material state from serialized data. |
| `destroy` | Method | Performs deep cleanup of all WebGL resources and material textures. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. Receives `WebGL2RenderingContext` and `LitMaterial`.
    2. Loads vertex and fragment source code from `ShaderSources`.
    3. Sets internal class name and initializes texture/attribute tracking.
- **Data Path (Rendering Loop)**:
    1. **Texture Check**: `checkAndLoadTextures` is invoked. For each map, it checks `isImageLoaded`. If false, it triggers `texture.load()` and binds a fallback from `EngineCache`.
    2. **Uniform Update**: `loadDataIntoShader` maps `LitMaterial` properties (Vec4 color, Vec2 UV, Floats for roughness/specular) to `ShaderUniformsEnum` locations.
    3. **GPU Execution**: The WebGL context uses the bound textures and uniforms to execute the PBR shader program.
- **Conditional Branching**:
    - **Texture Loading Pivot**: In `bindMap`, if a texture is null or not loaded, the logic branches to await a `defaultGetter` (e.g., `getWhiteTexture`) to prevent rendering errors.
    - **Material Validation**: `loadDataIntoShader` exits early if `this.material` is null.

## 5. Resource Dependencies
- **Standard Libraries**: `Promise` (Asynchronous flow)
- **Internal Modules**: 
    - [EngineCache](/AgentDocs/core/engineCache.md)
    - [Camera](/AgentDocs/entities/camera.md)
    - [ShaderUniformsEnum](/AgentDocs/enums/shader-uniforms.enum.md)
    - [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md)
    - [LitMaterial](/AgentDocs/materials/lit-material.md)
    - [Texture](/AgentDocs/textures/texture.md)
    - [Shader](/AgentDocs/shaders/shader.md)
    - [ShaderSources](/AgentDocs/shaders/shader-sources.md)
- **External Packages**: `WebGL2RenderingContext` (Browser API)