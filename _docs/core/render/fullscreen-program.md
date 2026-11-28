## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| FullscreenProgram | /core/render/fullscreen-program.ts |

This component is responsible for creating and managing a specialized WebGL program designed to render a full-screen triangle. This program is specifically intended for rendering passes that operate on every pixel of the screen, such as texture copying, tone mapping, or applying post-processing effects. It encapsulates the necessary WebGL setup to execute these screen-space operations efficiently.

Architecturally, `FullscreenProgram` acts as a rendering utility service within the graphics pipeline. It relies on pre-defined shader sources, accessed via [../../shaders/embedded-shaders](/core/shaders/embedded-shaders.md), to construct its pipeline. It manages the WebGL state required for drawing, integrating directly with the rendering context provided during its instantiation.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| FullscreenProgram | Class | Manages the WebGL program and VAO for full-screen rendering passes. |
| FullscreenProgram.use() | Method | Activates this program for subsequent drawing operations on the context. |
| FullscreenProgram.uniform(name) | Method | Retrieves a bound uniform location by name, caching the result for efficiency. |
| FullscreenProgram.bindTexture(name, texture, unit) | Method | Binds a specific texture to a texture unit and sets the corresponding sampler uniform in the program. |
| FullscreenProgram.draw() | Method | Executes the rendering by drawing a single full-screen triangle using the bound VAO. |
| FullscreenProgram.dispose() | Method | Releases the associated WebGL resources (program and VAO) to prevent memory leaks. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The constructor links the vertex and fragment shaders provided by the embedded shader sources. It initializes a Vertex Array Object (VAO) required by WebGL2. The `draw` method utilizes the VAO to draw three vertices, which implicitly cover the entire screen space when using the built-in `gl_VertexID` mechanism. Uniform locations are cached upon first request via the `uniform` method.
- **Side Effects:** Mutates the state of the provided `WebGL2RenderingContext` (`gl`) by calling `gl.useProgram`, `gl.bindVertexArray`, `gl.activeTexture`, `gl.bindTexture`, and `gl.drawArrays`. It also manages the lifecycle of GPU resources (shaders, programs, VAOs).
- **Error Handling:** Throws an `Error` if the required vertex or fragment shader sources are not found in the embedded shaders map. The static `link` method handles shader compilation and program linking errors, throwing descriptive errors if `gl.COMPILE_STATUS` or `gl.LINK_STATUS` fails.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [../../shaders/embedded-shaders](/core/shaders/embedded-shaders.md), [../../shaders/shader-sources](/core/shaders/shader-sources.md)