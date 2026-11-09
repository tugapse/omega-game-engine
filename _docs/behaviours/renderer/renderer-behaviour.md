## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| RendererBehaviour | behaviours/renderer/renderer-behaviour |

This component serves as the foundational class for all rendering logic within the engine. Its primary responsibility is to manage the entire rendering pipeline for an entity, handling the setup of WebGL states (culling, depth testing, blending), managing shaders, and executing the actual drawing commands for meshes. It abstracts the complexities of the graphics API, allowing other systems to interact with rendering through a standardized interface.

Architecturally, `RendererBehaviour` acts as a core service layer within the entity system. It inherits from [EntityBehaviour](/behaviours/entity-behaviour.md) and implements [IRendererBehaviour](/interfaces/renderer-behaviour.md). It integrates tightly with rendering resources like [Shader](/shaders/shader.md), [Mesh](/core/mesh.md), and the global [CanvasViewport](/core/canvas-viewport.md) to execute drawing passes, including advanced features like render-to-texture via its framebuffer management.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| RendererBehaviour.instanciate | Static Method | Factory method to create a new instance of `RendererBehaviour` using a WebGL2 rendering context. |
| drawPrimitiveType | Property | Defines the primitive type used for rendering (e.g., LINES, POINTS). |
| mesh | Property | The [Mesh](/core/mesh.md) data associated with this renderer. |
| shader | Property | The [Shader](/shaders/shader.md) program used for rendering. |
| enableCullFace | Property | Boolean flag to enable or disable face culling in WebGL. |
| enableDephTest | Property | Boolean flag to enable or disable depth testing in WebGL. |
| enableBlend | Property | Boolean flag to enable or disable blending in WebGL. |
| writeToDephBuffer | Property | Boolean flag controlling whether the depth buffer can be written to. |
| cullFace | Property | Specifies the face culling mode (e.g., BACK). |
| dephMode | Property | Specifies the depth testing function (e.g., Less). |
| faceWinding | Property | Specifies the winding order for front-facing polygons. |
| blendMode | Property | Defines the blending factors (source and destination). |
| renderLayer | Property | Determines the rendering order of the entity (e.g., OPAQUE, TRANSPARENT). |
| castShadows | Property | Boolean flag indicating if the entity should cast shadows. |
| setRenderTarget | Method | Configures the renderer to draw to a specific texture, setting up the FBO and depth buffer. |
| clearRenderTarget | Method | Unbinds the current framebuffer, restoring rendering to the main canvas. |
| startPass | Method | Initiates a rendering pass to a specified texture, clearing the target buffers. |
| endPass | Method | Concludes the current rendering pass by switching back to the default framebuffer. |
| toJsonObject | Method | Serializes the renderer's current state (shader, mesh, etc.) into a JSON structure. |
| fromJson | Method | Deserializes the renderer's state from a provided JSON structure. |
| drawPoint | Method | Draws a single point at specified 3D coordinates using the current shader. |
| drawLine | Method | Draws a line segment between two specified 3D coordinates using the current shader. |
| draw | Method | Executes the primary rendering draw call for the associated mesh. |
| update | Method | Updates the renderer's internal state, primarily tracking elapsed time. |
| setGl | Method | Sets the underlying WebGL2 rendering context for the behaviour. |
| createLightMatrices | Method | Calculates the necessary view and projection matrices for shadow mapping from a light's perspective. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component manages rendering state by first calling `setGlSettings()` to configure WebGL states based on public properties. Drawing is orchestrated via `draw()`, which uses the bound shader and mesh data to issue `gl.drawElements`. Off-screen rendering is managed by `setRenderTarget`, which creates or reuses a `WebGLFramebuffer` and attaches a `WebGLRenderbuffer` for depth testing, allowing subsequent drawing calls to target a texture instead of the screen. Utility methods like `drawPoint` and `drawLine` temporarily override the primitive type and buffer data to perform immediate, non-mesh-based drawing.
- **Side Effects:** Mutates global WebGL state (binding buffers, enabling/disabling features, setting uniforms). It also creates and manages WebGL resources (`WebGLFramebuffer`, `WebGLRenderbuffer`, `WebGLBuffer`).
- **Error Handling:** It checks for the existence of the WebGL context (`this._gl`) and required components (shader, mesh) before executing drawing or initialization routines, logging warnings if prerequisites are missing. Framebuffer completeness is checked during `setRenderTarget`.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [Transform](/core/transform.md), [Vector3](/core/vector3.md), [CanvasViewport](/core/canvas-viewport.md), [Mesh](/core/mesh.md), [ObjectInstanciator](/core/object-instanciator.md), [Camera](/entities/camera.md), [DirectionalLight](/entities/directional-light.md), [Light](/entities/light.md), [EntityType](/enums/entity-type.enum.md), [FaceWinding](/enums/face-winding.enum.md), [RenderLayer](/enums/render-layer.enum.md), [GLPrimitiveType](/enums/gl-primitive-type.enum.md), [BlendingDestinationFactor](/enums/gl/blend.enum.md), [BlendingSourceFactor](/enums/gl/blend.enum.md), [CullFace](/enums/gl/cull-face.enum.md), [DephFunction](/enums/gl/deph-function.enum.md), [ShaderUniformsEnum](/enums/shader-uniforms.enum.md), [BlendingMode](/interfaces/blend-mode.md), [JsonSerializedData](/interfaces/json-serialized-data.md), [IRendererBehaviour](/interfaces/renderer-behaviour.md), [ColorMaterial](/materials/color-material.md), [Shader](/shaders/shader.md), [EntityBehaviour](/behaviours/entity-behaviour.md)