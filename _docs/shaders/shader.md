## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| Shader | [src/shaders/shader.ts](/src/shaders/shader.ts) |

This component is responsible for managing the lifecycle of WebGL shader programs, handling the compilation, linking, and configuration of vertex and fragment shaders. It abstracts the complex process of shader creation, allowing developers to define rendering pipelines using URI-based loading and preprocessor directives.

The `Shader` class acts as a core rendering resource manager within the engine's graphics subsystem. It integrates with [ColorMaterial](/src/materials/color-material.md) to set material properties and uses [MeshData](/src/core/mesh.md) to manage and upload vertex buffer data to the GPU. It relies on [Resources](/src/core/resources/resources.md) for asset loading and [ShaderSources](/src/shaders/shader-sources.ts) for shader source definitions.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `WebGLBuffers` | Interface | Defines the structure holding references to various WebGLBuffer objects (position, normal, uv, indices, etc.) associated with a mesh. |
| `Shader` | Class | Manages the creation, compilation, and usage of WebGL shader programs. Implements [JsonSerializable](/src/core/json-serializable.md). |
| `Shader.SHADER_FUNCTIONS` | Static Property | A map linking symbolic keys (e.g., `@INCLUDE_FOG_FUNC`) to specific GLSL function source URLs. |
| `Shader.preFetchFunctionsGlsl()` | Static Method | Iterates over all defined shader functions and requests them from the [Resources](/src/core/resources/resources.md) manager for pre-loading. |
| `Shader.instanciate()` | Static Method | Factory method to create a new `Shader` instance, requiring a `WebGL2RenderingContext` and a [ColorMaterial](/src/materials/color-material.md). |
| `shaderProgram` | Getter | Returns the compiled and linked `WebGLProgram` object for the shader. |
| `initialized` | Getter | Returns a boolean indicating whether the shader program has been successfully compiled and initialized. |
| `buffers` | Getter | Returns the `WebGLBuffers` object containing all associated GPU buffer handles. |
| `initialize()` | Method | Asynchronously compiles the vertex and fragment shaders, substitutes preprocessor directives, and creates the final `WebGLProgram`. |
| `withDefines()` | Static Method | Prepends `#define` directives to a GLSL source string immediately following the `#version` line. |
| `initBuffers()` | Method | Uploads vertex, normal, UV, tangent, bitangent, and index data from a [MeshData](/src/core/mesh.md) object into the appropriate WebGL buffers. |
| `bindBuffers()` | Method | Configures the vertex attribute pointers for all associated buffers (position, normal, UV, etc.) against the active shader program. |
| `bindSkinAttributes()` | Method | Configures the vertex attribute pointers specifically for skinning data (joints and weights) if the mesh is a [SkinnedMeshData](/src/core/model/model-data.md). |
| `use()` | Method | Activates the shader program on the current WebGL context. |
| `loadDataIntoShader()` | Method | Binds material data (specifically color) from the associated [ColorMaterial](/src/materials/color-material.md) to the shader uniforms. |
| `setMat4()` | Method | Sets a uniform matrix4fv in the shader program. |
| `setMat3()` | Method | Sets a uniform matrix3fv in the shader program. |
| `setVec4()` | Method | Sets a uniform vec4fv in the shader program. |
| `setVec3()` | Method | Sets a uniform vec3fv in the shader program. |
| `setVec2()` | Method | Sets a uniform vec2fv in the shader program. |
| `setFloat()` | Method | Sets a uniform float1f in the shader program. |
| `setInt()` | Method | Sets a uniform integer1i in the shader program. |
| `setTexture()` | Method | Binds a specific [Texture](/src/textures/texture.md) to a texture unit and sets the corresponding uniform sampler. |
| `setBuffer()` | Method | Uploads raw vertex data (vec3 array) to a specified `WebGLBuffer` bound to `ARRAY_BUFFER`. |
| `setIndices()` | Method | Uploads index data to the element array buffer. |
| `recompile()` | Method | Resets the initialized state and calls `initialize()` to recompile the shaders. |
| `destroy()` | Method | Releases all associated WebGL resources (buffers and program). |
| `toJsonObject()` | Method | Serializes the shader instance state into a `JsonSerializedData` object. |
| `fromJson()` | Method | Deserializes the shader instance state from a `JsonSerializedData` object. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The initialization process involves fetching source code strings via [Resources](/src/core/resources/resources.md), performing string replacements based on defined function keys, injecting preprocessor definitions (`#define`), and then compiling and linking the resulting GLSL strings into a `WebGLProgram`. Buffer setup involves iterating over mesh data and using `gl.bufferData` to transfer geometry data (positions, normals, indices, etc.) to the GPU. Uniform setting methods abstract the `gl.getUniformLocation` and subsequent `gl.uniform*` calls.
- **Side Effects:** Mutates external state by interacting directly with the `WebGL2RenderingContext` (`gl`), creating and deleting GPU resources (`WebGLBuffer`, `WebGLProgram`), and potentially logging warnings/errors to the console.
- **Error Handling:** Compilation errors are caught by checking `gl.getShaderParameter(shader, gl.COMPILE_STATUS)` and logging detailed information, returning `null` for the shader. Program linking errors are caught by checking `gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)` and logging a trace.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`, `uuid`
- **Internal:** [Resources](/src/core/resources/resources.md), [MeshData](/src/core/mesh.md), [ShaderUniformsEnum](/src/enums/shader-uniforms.enum.md), [JsonSerializable](/src/core/json-serializable.md), [JsonSerializedData](/src/interfaces/json-serialized-data.md), [ColorMaterial](/src/materials/color-material.md), [Texture](/src/textures/texture.md), [ObjectInstanciator](/src/core.md), [ShaderSources](/src/shaders/shader-sources.ts), [SkinnedMeshData](/src/core/model/model-data.md)