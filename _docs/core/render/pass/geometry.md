## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| GeometryPass | core/render/pass/geometry.md |

This component is responsible for executing the primary rendering pass for the scene geometry. Its core responsibility is to correctly draw all visible objects by managing the rendering order based on their assigned `RenderLayer` and their distance from the camera. This ensures that visual elements like opaque geometry, skyboxes, and transparent objects are drawn in a sequence that produces a visually correct result, especially for overlapping transparent surfaces.

The `GeometryPass` acts as a critical rendering service within the application's rendering pipeline. It consumes the `Scene` entity, utilizes the `CameraUBO` for view and projection matrix transformations, and orchestrates the drawing calls for all relevant entities. It fits into the rendering architecture as a specific stage (`IRenderPass`) that processes scene data before final output to the screen or a target framebuffer.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| GeometryPass | Class | Implements `IRenderPass` to manage the geometry rendering sequence. |
| execute(scene: Scene) | Method | Executes the rendering logic for the scene, sorting and drawing objects by layer. |
| cleanup() | Method | Cleans up any resources held by the pass instance. |
| resize(width: number, height: number) | Method | Handles viewport resizing events for the rendering context. |
| setGl(gl: WebGL2RenderingContext) | Method | Sets the underlying WebGL2 rendering context for the pass. |
| toJsonObject() | Method | Serializes the current state of the pass into a `JsonSerializedData` object. |
| fromJson(jsonObject: JsonSerializedData) | Method | Deserializes the pass's state from a `JsonSerializedData` object. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The pass first fetches all active objects from the scene. It then sorts these objects based on their distance from the main camera, specifically sorting transparent objects back-to-front (farthest to nearest). Objects are subsequently partitioned into three groups: Opaque, Skybox, and Transparent. Drawing occurs in a strict sequence: Opaque $\rightarrow$ Skybox $\rightarrow$ Transparent.
- **Side Effects:** Mutates the state of the underlying WebGL context (`this.gl`) by performing draw calls and setting up rendering states. It reads the state of the `Scene` and its contained entities.
- **Error Handling:** No explicit exception handling is implemented; rendering failures would typically propagate up from the underlying WebGL context calls.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [JsonSerializable](/core/render/pass/json-serializable.md), [CameraUBO](/core/render/camera-ubo.md), [RendererBehaviour](/core/behaviours.md), [Scene](/core/entities.md), [Camera](/core/entities.md), [RenderLayer](/core/enums.md), [JsonSerializedData](/core/interfaces.md), [IRenderPass](/core/render-pass.interface.md)