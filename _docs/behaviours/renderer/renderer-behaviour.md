## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **RendererBehaviour** | [src/behaviours/renderer/renderer-behaviour.ts](/src/behaviours/renderer/renderer-behaviour.ts) |

This component serves as the core rendering engine implementation for an entity within the application. Its primary responsibility is managing the entire rendering pipeline, which includes setting up WebGL states (culling, depth testing, blending), managing shaders, and executing draw calls for meshes. It abstracts the complexities of WebGL context management, allowing entities to render their visual representation through a standardized interface.

Architecturally, `RendererBehaviour` acts as a specialized service layer attached to an entity, inheriting from [EntityBehaviour](/src/behaviours/entity-behaviour.ts). It implements the [IRendererBehaviour](/src/interfaces/renderer-behaviour.ts) interface, providing methods for rendering, state serialization, and handling rendering passes (like off-screen rendering via `setRenderTarget`). It relies heavily on core rendering utilities like [Mesh](/src/core/mesh.ts) and [Shader](/src/shaders/shader.ts).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `RendererBehaviour` | Class | The base class for all renderer behaviours, responsible for drawing meshes to the canvas. |
| `instanciate` | Static Method | Factory method to create a new instance of `RendererBehaviour` given a WebGL2RenderingContext. |
| `drawPrimitiveType` | Property | Defines the GLPrimitiveType used for drawing (e.g., LINES, POINTS). |
| `mesh` | Property | The [Mesh](/src/core/mesh.ts) data structure to be rendered. |
| `shader` | Property | The [Shader](/src/shaders/shader.ts) program used for rendering. |
| `enableCullFace` | Property | Boolean flag to enable or disable face culling. |
| `enableDephTest` | Property | Boolean flag to enable or disable depth testing. |
| `enableBlend` | Property | Boolean flag to enable or disable blending. |
| `writeToDephBuffer` | Property | Boolean flag determining if writing to the depth buffer is active. |
| `cullFace` | Property | The specific [CullFace](/src/enums/gl/cull-face.enum.ts) mode used for culling. |
| `dephMode` | Property | The specific [DephFunction](/src/enums/gl/deph-function.enum.ts) mode for depth testing. |
| `faceWinding` | Property | The winding order used to determine front/back faces. |
| `blendMode` | Property | Configuration object defining the source and destination factors for blending. |
| `renderLayer` | Property | The [RenderLayer](/src/enums/renderer-layer.enum.ts) this renderer belongs to. |
| `castShadows` | Property | Flag indicating if the renderer should cast shadows. |
| `setRenderTarget` | Method | Configures the WebGL context to render to a specific texture, creating or reusing the necessary Framebuffer Object (FBO). |
| `clearRenderTarget` | Method | Unbinds the current render target and restores the viewport to the main canvas dimensions. |
| `startPass` | Method | Initiates a new rendering pass to an off-screen texture, setting up the target and clearing buffers. |
| `endPass` | Method | Finalizes the current rendering pass by switching back to the default framebuffer. |
| `toJsonObject` | Method | Serializes the renderer's current state, including shader and mesh data, into a [JsonSerializedData](/src/interfaces/json-serialized-data.ts) object. |
| `fromJson` | Method | Deserializes the renderer's state from a [JsonSerializedData](/src/interfaces/json-serialized-data.ts) object. |
| `drawPoint` | Method | Draws a single point at specified coordinates using the current shader, temporarily setting the primitive type to POINTS. |
| `drawLine` | Method | Draws a line segment between two specified 3D points using the current shader, temporarily setting the primitive type to LINES. |
| `draw` | Method | Executes the primary rendering draw call for the bound mesh using the configured primitive type. |
| `indexCount` | Getter | Returns the total number of indices available in the mesh's index buffer. |
| `beforeRender` | Method | Hook called before rendering passes, used for updates like skinned joint matrix calculations. |
| `worldBounds` | Method | Calculates and returns the world-space bounding sphere of the rendered mesh for frustum culling. |
| `deformationVersion` | Getter | Returns a version number indicating changes in the mesh shape that require re-rendering. |
| `serializesMesh` | Getter | Indicates whether the mesh data is saved within the scene state. |
| `jointTexture` | Getter | Provides access to the texture holding joint matrices for skinned renderers. |
| `update` | Method | Updates the renderer's internal time counter based on elapsed time. |
| `setGl` | Method | Sets the underlying WebGL2RenderingContext for the behaviour. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `RendererBehaviour` manages the rendering lifecycle. Initialization involves setting up WebGL states based on public properties (`setGlSettings`). Rendering involves setting camera and model matrices (`setCameraMatrices`, `setModelWorldMatrices`), binding buffers, and calling `drawElements` or specialized methods like `drawPoint`/`drawLine`. Off-screen rendering is handled by creating and binding a Framebuffer Object (`setRenderTarget`). State persistence is managed via `toJsonObject` and `fromJson`, which utilize `ObjectInstanciator` to reconstruct complex objects like `Shader` and `Material`.
- **Side Effects:** Mutates the global WebGL state (binding buffers, enabling/disabling features like `DEPTH_TEST`, `CULL_FACE`). It also interacts with the external `CanvasViewport` to determine screen resolution and relies on the `WebGL2RenderingContext` (`_gl`) provided during construction.
- **Error Handling:** Checks for null contexts (`!this._gl`) before executing WebGL calls. It checks the framebuffer status (`checkFramebufferStatus`) during `setRenderTarget` and logs an error if the framebuffer is incomplete. Warnings are logged if drawing methods are called before full initialization.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix` (for `mat3`, `mat4`), `WebGL2RenderingContext`, `WebGLTexture`, `WebGLFramebuffer`, `WebGLRenderbuffer`.
- **Internal:** [Vector3](/src/core/vector3.ts), [CanvasViewport](/src/core/canvas-viewport.ts), [Mesh](/src/core/mesh.ts), [ObjectInstanciator](/src/core/object-instanciator.ts), [Camera](/src/entities/camera.ts), [FaceWinding](/src/enums/face-winding.enum.ts), [RenderLayer](/src/enums/renderer-layer.enum.ts), [GLPrimitiveType](/src/enums/gl-primitive-type.enum.ts), [BlendingDestinationFactor](/src/enums/gl/blend.enum.ts), [BlendingSourceFactor](/src/enums/gl/blend.enum.ts), [CullFace](/src/enums/gl/cull-face.enum.ts), [DephFunction](/src/enums/gl/deph-function.enum.ts), [ShaderUniformsEnum](/src/enums/shader-uniforms.enum.ts), [BlendingMode](/src/interfaces/blend-mode.ts), [JsonSerializedData](/src/interfaces/json-serialized-data.ts), [IRendererBehaviour](/src/interfaces/renderer-behaviour.ts), [ColorMaterial](/src/materials/color-material.ts), [Shader](/src/shaders/shader.ts), [localBoundingSphere](/src/core/render/culling/culling.ts), [Sphere](/src/core/render/culling/culling.ts), [transformSphere](/src/core/render/culling/culling.ts), [EntityBehaviour](/src/behaviours/entity-behaviour.ts).