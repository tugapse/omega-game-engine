## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| RenderPipeline | core/render/render-pipeline.md |

This component is the central orchestrator for the entire rendering process within the application. Its primary responsibility is to manage the sequential execution of various rendering stages, such as shadow map generation, primary geometry rendering, and final post-processing effects. It abstracts the complexity of WebGL state management, framebuffer creation, and pass ordering into a cohesive, manageable pipeline structure.

Architecturally, the `RenderPipeline` acts as a high-level service layer responsible for the visual output of the scene. It depends on concrete implementations of rendering stages, such as [ShadowMapPass](/core/render/pass/shadow-map-pass.md) and [GeometryPass](/core/render/pass/geometry-pass.md), which are added via the `addPass` method. It manages the lifecycle of intermediate rendering targets, like the main off-screen framebuffer, ensuring data flows correctly between passes before the final output to the screen.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `instanciate()` | Static Method | Creates and returns a new instance of the `RenderPipeline`. |
| `shadowMap` | Getter | Returns the configured `ShadowMapPass` instance. |
| `sceneTexture` | Getter | Returns the main color texture produced by the geometry pass. |
| `framebuffer` | Getter | Returns the main off-screen `WebGLFramebuffer` used for rendering. |
| `setGlRenderingContext(gl)` | Method | Initializes the pipeline by setting the WebGL context and setting up default passes and buffers. |
| `initialize(scene)` | Method | Associates a specific [Scene](/core/entities/scene.md) with the pipeline for rendering. |
| `addPass(pass)` | Method | Adds a new `IRenderPass` to the execution queue, initializing it with the GL context if available. |
| `draw()` | Method | Executes all registered render passes in sequence to render a single frame. |
| `resize(width, height)` | Method | Recreates all internal rendering buffers and notifies all registered passes of the new dimensions. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The pipeline executes passes sequentially. It manages two primary rendering modes: specialized passes (like `ShadowMapPass`) that handle their own binding scopes, and intermediate passes (like `GeometryPass`) that render into the pipeline's main off-screen framebuffer (`_framebuffer`). The `draw()` method handles the necessary state changes, such as binding the correct framebuffer and setting the viewport, before calling `execute()` on each pass.
- **Side Effects:** Mutates external/global state by interacting directly with the `WebGL2RenderingContext` (`_gl`) to create, bind, and delete WebGL resources (framebuffers, textures, renderbuffers). It also mutates the internal state of the pipeline by adding passes and updating buffer dimensions.
- **Error Handling:** It checks if `this.scene` is defined before calling `draw()`, logging an error if it is missing. It uses `console.error` for initialization failures.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.
- **Internal:** [Scene](/core/entities/scene.md), [Camera](/core/entities/camera.md), [ClassType](/core/enums/class-type.enum.md), [JsonSerializedData](/core/interfaces/json-serialized-data.md), [Texture](/core/textures/texture.md), [CameraUBO](/core/render/camera-ubo.md), [CanvasViewport](/core/render/canvas-viewport.md), [JsonSerializable](/core/render/json-serializable.md), [ObjectInstanciator](/core/render/object-instanciator.md), [ShadowMapPass](/core/render/pass/shadow-map-pass.md), [GeometryPass](/core/render/pass/geometry-pass.md), [PostProcessingPass](/core/render/pass/post-processing-pass.md), [IRenderPass](/core/render/render-pass.interface.md).