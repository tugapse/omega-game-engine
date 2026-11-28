## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **RenderPipeline** | [src/core/render/render-pipeline.ts](/src/core/render/render-pipeline.ts) |

This component is the core rendering engine responsible for managing the entire frame generation process. It orchestrates the sequence of rendering steps, including shadow map generation, scene rendering into off-screen targets, applying post-processing effects, and finally copying the result to the main canvas. Its primary responsibility is to translate a scene state into a visual output according to defined quality and rendering settings.

The `RenderPipeline` acts as a high-level service within the application architecture, managing the lifecycle of rendering resources like `RenderTarget`s and managing the state of rendering passes. It relies heavily on configuration provided by `RenderPipelineSettings` to adapt its performance characteristics, such as resolution scaling and shadow quality, ensuring it integrates correctly with the overall rendering loop managed by components like [RendererBehaviour](/src/core/behaviours/renderer/renderer-behaviour.md).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `ViewTargets` | Interface | Defines the off-screen targets for a single view, containing the scene render target and an array for post-effect targets. |
| `ToneMapping` | Enum | Defines methods for mapping High Dynamic Range (HDR) color values to the displayable Low Dynamic Range (LDR) space (None, Reinhard, ACES). |
| `ShadowMapSize` | Enum | Defines predefined sizes for the shadow atlas texture (Small, Medium, Large). |
| `RenderQuality` | Enum | Defines preset levels of rendering quality (Low, Medium, High) used to configure performance settings. |
| `RenderPipelineSettings` | Class | Holds all configurable parameters for the rendering pipeline, including shadow distances, tone mapping, and resolution scaling. Implements `JsonSerializable`. |
| `RenderPipeline` | Class | The main rendering orchestrator. Manages the GL context, camera setup, rendering passes, and frame drawing logic. Implements `JsonSerializable`. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `draw()` method drives the frame rendering. It first iterates over all texture cameras to render their specific views, then renders the main camera view to the canvas. The process involves calculating shadow maps via `ShadowAtlasPass`, executing the `GeometryPass` and subsequent custom passes (`IRenderPass`), applying post-effects via a ping-pong buffer system, and finally performing a tone-mapped copy to the output target. Resolution adjustment (`adjustResolution`) dynamically modifies the render scale based on average frame time against a target budget.
- **Side Effects:** The code extensively interacts with the WebGL2 rendering context (`_gl`), performing framebuffer binding, viewport setting, texture binding, and drawing calls. It mutates internal state such as `_views`, `_passes`, and the `_dynamicFactor`.
- **Error Handling:** The `draw()` method includes a `try...finally` block around texture writing to ensure `Camera.setMainCamera(main)` is called even if rendering fails for a specific camera. Fallbacks are used in `suggestedQuality` when `navigator` or `matchMedia` are undefined.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `performance` (for timing).
- **Internal:** [Scene](/src/core/entities.md), [Camera](/src/core/entities.md), [ClassType](/src/core/enums/class-type.enum.md), [JsonSerializedData](/src/core/interfaces.md), [ShaderSources](/src/core/shaders/shader-sources.md), [CameraUBO](/src/core/render/camera-ubo.md), [JsonSerializable](/src/core/render/json-serializable.md), [ObjectInstanciator](/src/core/object-instanciator.md), [NumberRange](/src/core/render/range.md), [buildFrameData](/src/core/render/frame-data.ts), [RendererBehaviour](/src/core/behaviours/renderer/renderer-behaviour.md), [LightsUBO](/src/core/render/lights-ubo.md), [FullscreenProgram](/src/core/render/fullscreen-program.md), [GeometryPass](/src/core/render/pass/geometry-pass.md), [ShadowAtlasPass](/src/core/render/pass/shadow-atlas-pass.md), [planShadows](/src/core/render/shadows.ts), [ShadowFilter](/src/core/render/shadows.ts), [PostEffect](/src/core/render/post-effect.md), [RetroEffect](/src/core/render/post-effect.md), [IRenderPass](/src/core/render/render-pass.interface.md), [RenderContext](/src/core/render/render-pass.interface.md), [RenderTarget](/src/core/render/render-target.md), [RenderTargetColor](/src/core/render/render-target.md), [Resources](/src/core/resources/resources.md).