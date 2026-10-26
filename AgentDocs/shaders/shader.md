## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | Shader |
| Source file | shader.ts |

The **Shader** class serves as the foundational abstraction for managing WebGL programmable pipeline stages. It encapsulates the complexities of asynchronous GLSL source acquisition, modular code injection via preprocessor-like directives, and the lifecycle of `WebGLProgram` objects. By providing a unified interface for buffer management and uniform updates, it bridges the gap between high-level material properties and low-level GPU execution.

**Functional Mission**
The primary responsibility of the **Shader** component is to orchestrate the compilation, linking, and state management of GLSL programs. It solves the problem of manual WebGL boilerplate by automating vertex attribute binding, handling modular shader includes (e.g., fog and lighting functions), and providing type-safe helper methods for updating uniform constants.

**System Context & Integration**
The component acts as a critical intermediary in the rendering pipeline. It consumes geometry data from [MeshData](/AgentDocs/interfaces/meshData.md) to populate GPU buffers and retrieves material properties from [ColorMaterial](/AgentDocs/materials/color-material.md) to populate shader uniforms. During the render loop, it is utilized by rendering behaviors to set the active GPU state via `gl.useProgram` and to bind the necessary vertex attribute arrays required for drawing primitives.

- **INTERNAL REFERENCES**: [MeshData](/AgentDocs/interfaces/meshData.md), [ColorMaterial](/AgentDocs/materials/color-material.md), [EngineCache](/AgentDocs/core/engineCache.md), [ShaderSources](/AgentDocs/shaders/shader-sources.md), [ShaderUniformsEnum](/AgentDocs/enums/shader-uniforms.enum.md), [JsonSerializable](/AgentDocs/core/json-serializable.md), [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md), [Texture](/AgentDocs/textures/texture.md), [ObjectInstanciator](/AgentDocs/core/object-instanciator.md).

## 2. Environment & Configuration
**Environment Lookups:**
- `gl` (via `constructor`)  The `WebGL2RenderingContext` used for all GPU operations.

**Hardcoded Constants:**
- `SHADER_FUNCTIONS` (Default: `@INCLUDE_FOG_FUNC`, `@INCLUDE_LIGHT_FUNC`, `@INCLUDE_UTIL_FUNC`)  Maps custom GLSL directives to specific source strings in [ShaderSources](/AgentDocs/shaders/shader-sources.md).

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `Shader` | Class | Base class for managing WebGL programs and vertex buffers. |
| `WebGLBuffers` | Interface | Defines the structure for storing GPU buffer references (position, normal, uv, etc.). |
| `initialize` | Async Func | Loads, preprocesses (includes), compiles, and links the shader program. |
| `initBuffers` | Func | Generates and uploads vertex data (positions, normals, UVs, tangents, indices) to the GPU. |
| `bindBuffers` | Func | Configures WebGL vertex attribute pointers and binds the index buffer. |
| `use` | Func | Activates the compiled `WebGLProgram` in the current WebGL state. |
| `loadDataIntoShader` | Func | Transfers data from the associated [ColorMaterial](/AgentDocs/materials/color-material.md) to shader uniforms. |
| `setMat4` / `setMat3` | Func | Updates matrix-type uniforms. |
| `setVec4` / `setVec3` / `setVec2` | Func | Updates vector-type uniforms. |
| `setFloat` / `setInt` | Func | Updates scalar-type uniforms. |
| `setTexture` | Func | Binds a [Texture](/AgentDocs/textures/texture.md) to a specific texture unit and sampler uniform. |
| `recompile` | Func | Resets initialization state and triggers a full reload/recompile. |
| `destroy` | Func | Deletes all associated WebGL buffers and the shader program to prevent memory leaks. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. Constructor assigns a unique UUID and sets default URIs.
    2. `initialize()` is called:
        - Fetches raw GLSL via [EngineCache](/AgentDocs/core/engineCache.md).
        - Scans fragment source for keys in `SHADER_FUNCTIONS`.
        - Replaces keys with injected source code.
        - Compiles Vertex and Fragment shaders.
        - Links them into a `WebGLProgram`.
        - Configures `CameraBlock` uniform block binding if present.
- **Data Path (Geometry)**: 
    - `MeshData` (Input) $\rightarrow$ `initBuffers()` $\rightarrow$ `Float32Array`/`Uint16Array` conversion $\rightarrow$ `gl.bufferData` (GPU Output).
- **Data Path (Uniforms)**: 
    - `Material` properties $\rightarrow$ `loadDataIntoShader()` $\rightarrow$ `gl.uniform*` (GPU State).
- **Conditional Branching**:
    - **Compilation Check**: If `gl.getShaderParameter(..., gl.COMPILE_STATUS)` fails, the error log is captured, the shader is deleted, and initialization returns `false`.
    - **Link Check**: If `gl.getProgramParameter(..., gl.LINK_STATUS)` fails, the program is discarded.
    - **Attribute Presence**: `bindBuffers()` checks if attribute locations exist (`!== -1`) and if buffers are non-null before attempting to enable vertex arrays.

## 5. Resource Dependencies
- **Standard Libraries**: `gl-matrix` (math operations).
- **Internal Modules**: 
    - [EngineCache](/AgentDocs/core/engineCache.md)
    - [MeshData](/AgentDocs/interfaces/meshData.md)
    - [ShaderUniformsEnum](/AgentDocs/enums/shader-uniforms.enum.md)
    - [JsonSerializable](/AgentDocs/core/json-serializable.md)
    - [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md)
    - [ColorMaterial](/AgentDocs/materials/color-material.md)
    - [Texture](/AgentDocs/textures/texture.md)
    - [ObjectInstanciator](/AgentDocs/core/object-instanciator.md)
    - [ShaderSources](/AgentDocs/shaders/shader-sources.md)
- **External Packages**: `uuid` (unique identifier generation).