## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| GeometryPass | /core/render/pass/geometry.ts |

This component, `GeometryPass`, is responsible for executing the primary rendering pass where the scene's geometry is drawn to the target buffer. It manages the drawing order according to rendering requirements: opaque entities are drawn first (nearest first), followed by the skybox, and finally, transparent entities are drawn (farthest first).

This class acts as a concrete implementation of the `IRenderPass` interface, fitting into the rendering pipeline service layer. It utilizes `CameraUBO` to manage camera transformation data and processes the `Scene` data provided within the `RenderContext` to perform the actual drawing operations via entity methods.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `GeometryPass` | Class | Implements `IRenderPass`. Manages the geometry rendering process, holding references to the WebGL context and camera Uniform Buffer Object. |
| `initialize()` | Method | Initializes the pass. |
| `execute(scene: Scene, ctx?: RenderContext)` | Method | Executes the rendering logic by iterating over opaque, skybox, and transparent entities in the provided `RenderContext`. |
| `cleanup()` | Method | Cleans up resources associated with the pass. |
| `resize(width: number, height: number)` | Method | Handles viewport resizing for the pass. |
| `setGl(gl: WebGL2RenderingContext)` | Method | Allows external setting of the underlying WebGL rendering context and reinitializes the UBO. |
| `toJsonObject()` | Method | Serializes the current state of the pass into a `JsonSerializedData` object. |
| `fromJson(jsonObject: JsonSerializedData)` | Method | Deserializes the pass state from a `JsonSerializedData` object. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `execute` method iterates through three distinct lists of entities (`frame.opaque`, `frame.skybox`, `frame.transparent`) provided in the `RenderContext`. Before drawing, it updates the `CameraUBO` with the view and projection matrices from the camera data within the context.
- **Side Effects:** Mutates external state by interacting with the `WebGL2RenderingContext` (`this.gl`) to perform drawing calls (implied by entity.draw() calls) and updates the `CameraUBO` state.
- **Error Handling:** The `execute` method includes a guard clause (`if (!ctx) return;`) to prevent execution if the `RenderContext` is not provided.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [JsonSerializable](/core/render/pass/geometry.ts), [CameraUBO](/core/render/pass/camera-ubo.ts), [Scene](/core/entities/scene.ts), [JsonSerializedData](/core/interfaces/json-serialized-data.ts), [IRenderPass](/core/render/pass/render-pass.interface.ts)