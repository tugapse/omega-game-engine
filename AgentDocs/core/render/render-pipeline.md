## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | RenderPipeline |
| Source file | render-pipeline.ts |

The **RenderPipeline** serves as the central orchestration engine for the graphics rendering lifecycle. It is responsible for managing the sequential execution of various rendering passes, ensuring that data flows correctly from shadow map generation to geometry rendering and finally to screen blitting. By managing intermediate framebuffers and textures, it abstracts the complexity of multi-pass rendering from the rest of the engine.

**Functional Mission**
The primary mission of the **RenderPipeline** is to provide a modular and extensible framework for executing a sequence of `IRenderPass` implementations. It solves the problem of complex frame synchronization and resource management (like depth buffers and color textures) by providing a unified interface to trigger the rendering of a `Scene` through a controlled pipeline of specialized passes.

**System Context & Integration**
This component acts as the bridge between the high-level `Scene` and the low-level WebGL2 API. It consumes a `Scene` and a `Camera` to update global state via a `CameraUBO`. It orchestrates the transition of data by passing textures between passesfor example, providing the `sceneTexture` to a post-processing pass. It integrates deeply with the `CanvasViewport` to synchronize internal buffer dimensions with the display resolution and uses the `ObjectInstanciator` to register itself within the engine's dependency injection system.

- **INTERNAL REFERENCES**: 
    - [Scene](/AgentDocs/entities/scene.md)
    - [Camera](/AgentDocs/entities/camera.md)
    - [CameraUBO](/AgentDocs/core/camera-ubo.md)
    - [ShadowMapPass](/AgentDocs/core/render/pass/shadowmapPass.md)
    - [GeometryPass](/AgentDocs/core/render/pass/geometry.md)
    - [PostProcessingPass](/AgentDocs/core/render/pass/index.md)
    - [IRenderPass](/AgentDocs/core/render/render-pass.interface.md)
    - [CanvasViewport](/AgentDocs/core/canvas-viewport.md)
    - [JsonSerializable](/AgentDocs/core/json-serializable.md)
    - [ObjectInstanciator](/AgentDocs/core/object-instanciator.md)
    - [Texture](/AgentDocs/textures/texture.md)

## 2. Environment & Configuration
**Environment Lookups:**
- `CanvasViewport.rendererWidth`  Used to determine the initial width of the internal rendering buffers.
- `CanvasViewport.rendererHeight`  Used to determine the initial height of the internal rendering buffers.

**Hardcoded Constants:**
- `name` (Default: `'Render Pipeline'`)  The descriptive identifier for the pipeline instance.
- `type` (Default: `'RenderPipeline'`)  The identifier used for JSON serialization.
- `width` (Default: `1024`)  Fallback width if `CanvasViewport` dimensions are unavailable.
- `height` (Default: `768`)  Fallback height if `CanvasViewport` dimensions are unavailable.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `instanciate` | Static Method | Factory method to create a new `RenderPipeline` instance. |
| `shadowMap` | Getter | Provides access to the internal `ShadowMapPass` instance. |
| `sceneTexture` | Getter | Returns the `Texture` containing the rendered scene before post-processing. |
| `framebuffer` | Getter | Returns the active `WebGLFramebuffer` used for off-screen rendering. |
| `setGlRenderingContext` | Method | Injects the WebGL2 context and initializes default passes and buffers. |
| `initialize` | Method | Binds a specific `Scene` to the pipeline for rendering. |
| `addPass` | Method | Appends a new `IRenderPass` to the execution sequence. |
| `recreateSingleBuffer` | Method | Allocates/reallocates the off-screen framebuffer, color texture, and depth buffer. |
| `draw` | Method | The main execution loop that iterates through and executes all registered passes. |
| `resize` | Method | Resizes internal buffers and propagates new dimensions to all passes. |
| `cleanupSingleBuffer` | Method | Deletes WebGL resources associated with the off-screen buffer to prevent leaks. |
| `fromJson` | Method | Deserializes pipeline state from a JSON object. |
| `toJsonObject` | Method | Serializes pipeline state into a JSON object. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. The pipeline is instantiated via `instanciate()`.
    2. `setGlRenderingContext(gl)` is called, which creates a `CameraUBO`, initializes `ShadowMapPass` and `GeometryPass`, and triggers `recreateSingleBuffer`.
    3. `initialize(scene)` is called to set the target `Scene`.
- **Data Path**: 
    1. **Input**: `Scene` data and `Camera` matrices.
    2. **Processing**: 
        - `ShadowMapPass` renders depth information from light perspectives.
        - `CameraUBO` updates with current view/projection matrices.
        - `GeometryPass` renders scene objects into the `_framebuffer` (using `_colorTexture`).
        - `ScreenBlitPass` (if present) takes `_colorTexture` as input and renders it to the null framebuffer (the canvas).
    3. **Output**: Final pixels rendered to the WebGL canvas.
- **Conditional Branching**:
    - **Pass Type Check**: Inside `draw()`, the loop checks `pass.name`. 
        - If `ShadowMapPass`, it executes without updating UBO or binding the main framebuffer.
        - If `ScreenBlitPass`, it attempts to inject `_colorTexture` via `setInputTexture` and targets the canvas (null framebuffer).
        - Otherwise, it proceeds with standard UBO updates and off-screen buffer binding.
    - **Resource Check**: `recreateSingleBuffer` and `cleanupSingleBuffer` check for the existence of `_gl` before performing operations.

## 5. Resource Dependencies
- **Standard Libraries**: `WebGL2RenderingContext`, `WebGLFramebuffer`, `WebGLRenderbuffer`
- **Internal Modules**: 
    - [Scene](/AgentDocs/entities/scene.md)
    - [Camera](/AgentDocs/entities/camera.md)
    - [ClassType](/AgentDocs/enums/class-type.enum.md)
    - [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md)
    - [Texture](/AgentDocs/textures/texture.md)
    - [CameraUBO](/AgentDocs/core/camera-ubo.md)
    - [CanvasViewport](/AgentDocs/core/canvas-viewport.md)
    - [JsonSerializable](/AgentDocs/core/json-serializable.md)
    - [ObjectInstanciator](/AgentDocs/core/object-instanciator.md)
    - [ShadowMapPass](/AgentDocs/core/render/pass/shadowmapPass.md)
    - [GeometryPass](/AgentDocs/core/render/pass/geometry.md)
    - [PostProcessingPass](/AgentDocs/core/render/pass/index.md)
    - [IRenderPass](/AgentDocs/core/render/render-pass.interface.md)
- **External Packages**: None identified.