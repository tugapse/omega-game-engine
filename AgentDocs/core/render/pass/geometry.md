## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | GeometryPass |
| Source file | geometry.ts |

The **GeometryPass** is a specialized rendering stage responsible for the visual representation of the primary scene geometry. It acts as a high-level orchestrator that manages the complexity of depth-sorting and layer-based rendering to ensure visual fidelity, particularly regarding transparency and background elements.

**Functional Mission**
The primary mission of **GeometryPass** is to execute the main draw calls for a scene by organizing objects into a specific rendering order: Opaque objects first, followed by the Skybox, and finally Transparent objects. It solves the fundamental problem of alpha-blending artifacts by implementing a back-to-front sorting algorithm for transparent entities, ensuring that light passes through layers in the correct sequence.

**System Context & Integration**
This component functions as a concrete implementation of the [IRenderPass](/AgentDocs/core/render/render-pass.interface.md) interface, typically invoked by the [RenderPipeline](/AgentDocs/core/render/render-pipeline.md). It consumes data from the [Scene](/AgentDocs/entities/scene.md) and utilizes the [CameraUBO](/AgentDocs/core/camera-ubo.md) to synchronize global transformation matrices (view and projection) with the GPU. The pass relies on the [RendererBehaviour](/AgentDocs/behaviours/renderer/renderer-behaviour.md) attached to entities to determine their [RenderLayer](/AgentDocs/enums/render-layer.enum.md) and dictates the final composition of the geometry buffer.

## 2. Environment & Configuration
**Environment Lookups:**
- `gl` (via `constructor`)  The WebGL2 rendering context used for all GPU commands.

**Hardcoded Constants:**
- No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `constructor` | Function | Initializes the WebGL2 context and instantiates the [CameraUBO](/AgentDocs/core/camera-ubo.md). |
| `initialize` | Method | Placeholder for pass-specific setup, required by [IRenderPass](/AgentDocs/core/render/render-pass.interface.md). |
| `execute` | Method | The core logic loop: updates UBOs, filters/sorts scene objects, and executes draw calls by layer. |
| `cleanup` | Method | Placeholder for resource deallocation. |
| `resize` | Method | Placeholder for viewport adjustment logic. |
| `setGl` | Method | Updates the internal WebGL2 context reference. |
| `toJsonObject` | Method | Serializes the pass state via [JsonSerializable](/AgentDocs/core/json-serializable.md) logic. |
| `fromJson` | Method | Deserializes the pass state from a [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md) object. |

## 4. Execution Logic & Flow
- **Initialization**: The pass is instantiated with a `WebGL2RenderingContext`. It creates a new [CameraUBO](/AgentDocs/core/camera-ubo.md) to manage camera-related uniform data.
- **Data Path**: 
    1. **Input**: Receives a [Scene](/AgentDocs/entities/scene.md) object containing multiple entities.
    2. **Transformation (UBO Update)**: Extracts the view and projection matrices from the `Camera.mainCamera` and updates the [CameraUBO](/AgentDocs/core/camera-ubo.md).
    3. **Transformation (Filtering & Sorting)**: 
        - Filters `active` and `show` objects.
        - Performs a distance-based sort (back-to-front) using `vec3.distance` relative to the camera position.
        - Segregates objects into three arrays based on their [RenderLayer](/AgentDocs/enums/render-layer.enum.md): `OPAQUE`, `SKYBOX`, and `TRANSPARENT`.
    4. **Output**: Iteratively calls `.draw()` on the sorted object groups in the strict order: Opaque $\rightarrow$ Skybox $\rightarrow$ Transparent.
- **Conditional Branching**: The sorting logic is applied globally to the `activeObjects` list, but the subsequent rendering loop branches based on the `RenderLayer` enum value retrieved from the entity's [RendererBehaviour](/AgentDocs/behaviours/renderer/renderer-behaviour.md).

## 5. Resource Dependencies
- **Standard Libraries**: `gl-matrix` (vec3)
- **Internal Modules**: 
    - [JsonSerializable](/AgentDocs/core/json-serializable.md)
    - [CameraUBO](/AgentDocs/core/camera-ubo.md)
    - [RendererBehaviour](/AgentDocs/behaviours/renderer/renderer-behaviour.md)
    - [Scene](/AgentDocs/entities/scene.md)
    - [Camera](/AgentDocs/entities/camera.md)
    - [RenderLayer](/AgentDocs/enums/render-layer.enum.md)
    - [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md)
    - [IRenderPass](/AgentDocs/core/render/render-pass.interface.md)
- **External Packages**: `gl-matrix`