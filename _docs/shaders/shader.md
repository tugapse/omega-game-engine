## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| Shader | /src/shaders/shader.md |

This component provides the core abstraction for managing and utilizing WebGL shaders within the rendering pipeline. Its primary responsibility is to handle the entire lifecycle of a shader: asynchronously loading GLSL source code (including support for modular includes via `Shader.SHADER_FUNCTIONS`), compiling the vertex and fragment shaders, and linking them into a usable `WebGLProgram`. It also manages the creation and binding of associated vertex buffers (`WebGLBuffers`) derived from `MeshData`.

Architecturally, `Shader` acts as a critical service layer component responsible for GPU resource management. It interfaces heavily with the rendering context (`WebGL2RenderingContext`) and relies on `ColorMaterial` to load material-specific uniform data. It integrates with the engine's caching system via `EngineCache` to optimize asset loading, positioning it as a core rendering utility that bridges high-level material properties with low-level GPU operations.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `WebGLBuffers` | Interface | Defines the structure for WebGL buffers (position, normal, uv, etc.) associated with mesh geometry. |
| `Shader` | Class | Base class for managing shader compilation, linking, and rendering state. |
| `Shader.SHADER_FUNCTIONS` | Static Property | A map linking include directives (e.g., `@INCLUDE_FOG_FUNC`) to their corresponding GLSL source file URIs. |
| `Shader.preFetchFunctionsGlsl()` | Static Method | Pre-fetches all registered shader function files into the `EngineCache` to reduce runtime latency. |
| `Shader.instanciate()` | Static Method | Factory method to create a new `Shader` instance, requiring a `WebGL2RenderingContext` and `ColorMaterial`. |
| `shaderProgram` | Getter | Returns the underlying compiled `WebGLProgram`. |
| `initialized` | Getter | Returns a boolean indicating if the shader has been successfully compiled and linked. |
| `buffers` | Getter | Returns the `WebGLBuffers` structure containing the geometry buffers. |
| `initialize()` | Method | Asynchronously loads, preprocesses (handles includes), compiles, and links the shader program. |
| `initBuffers()` | Method | Creates and populates all necessary WebGL buffers (position, normal, UV, etc.) based on provided `MeshData`. |
| `bindBuffers()` | Method | Binds all vertex attribute buffers and the index buffer to prepare the GPU state for drawing. |
| `use()` | Method | Activates this shader program using `gl.useProgram()`. |
| `release()` | Method | Placeholder for cleanup logic after a draw call. |
| `loadDataIntoShader()` | Method | Loads properties from the associated `ColorMaterial` into the shader's uniforms. |
| `setMat4()` | Method | Sets a `mat4` uniform value in the shader. |
| `setMat3()` | Method | Sets a `mat3` uniform value in the shader. |
| `setVec4()` | Method | Sets a `vec4` uniform value in the shader. |
| `setVec3()` | Method | Sets a `vec3` uniform value in the shader. |
| `setVec2()` | Method | Sets a `vec2` uniform value in the shader. |
| `setFloat()` | Method | Sets a `float` uniform value in the shader. |
| `setInt()` | Method | Sets an `int` uniform value in the shader. |
| `setTexture()` | Method | Binds a 2D texture to a specific sampler uniform slot. |
| `setBuffer()` | Method | Populates a specific `WebGLBuffer` with vertex data. |
| `setIndices()` | Method | Populates the index buffer with new index data. |
| `recompile()` | Method | Forces the shader to re-initialize by resetting the initialized state and calling `initialize()`. |
| `destroy()` | Method | Deletes all associated WebGL resources (program and buffers). |
| `toJsonObject()` | Method | Serializes the shader's current state into a `JsonSerializedData` object. |
| `fromJson()` | Method | Deserializes the shader's state from a `JsonSerializedData` object. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The initialization process involves fetching vertex and fragment source code, iterating over defined include directives (`SHADER_FUNCTIONS`) to substitute placeholders in the main source, and then calling `compileShader` and `createProgram`. Buffer initialization (`initBuffers`) involves iterating over mesh data arrays and using `gl.bufferData` to upload geometry data to the GPU. Uniform setting methods abstract the `gl.getUniformLocation` and subsequent `gl.uniform*` calls.
- **Side Effects:** Interacts heavily with the WebGL rendering context (`gl`), performing resource creation (`gl.createShader`, `gl.createProgram`, `gl.createBuffer`), state mutation (`gl.useProgram`, `gl.bindBuffer`), and data transfer to the GPU.
- **Error Handling:** Compilation errors are caught within `compileShader`, logging detailed information (info log, source preview) and returning `null` to prevent program creation. Program linking errors are caught in `createProgram`, logging the program info log and returning `null`.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`, `uuid`
- **Internal:** [EngineCache](/src/core/engineCache.md), [MeshData](/src/core/mesh.md), [ShaderUniformsEnum](/src/enums/shader-uniforms.enum.md), [JsonSerializable](/src/core/json-serializable.md), [JsonSerializedData](/src/interfaces/json-serialized-data.md), [ColorMaterial](/src/materials/color-material.md), [Texture](/src/textures/texture.md), [ObjectInstanciator](/src/core/object-instanciator.md), [ShaderSources](/src/shaders/shader-sources.md)