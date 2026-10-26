## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | CameraUBO |
| Source file | camera-ubo.ts |

The **CameraUBO** class serves as a specialized memory management utility designed to optimize the transfer of camera-related transformation data to the GPU. By utilizing a WebGL2 Uniform Buffer Object (UBO), it centralizes the storage of view and projection matrices, ensuring that these high-frequency updates are handled efficiently through a single memory block.

**Functional Mission**
The primary responsibility of **CameraUBO** is to mitigate the performance overhead associated with updating individual uniform variables across multiple shader programs. Its core mission is to provide a single, authoritative source of camera state (view and projection matrices) that can be bound to a global GPU binding point, allowing any shader within the engine to access the current camera context without redundant CPU-to-GPU data transfers.

**System Context & Integration**
This component acts as a bridge between the high-level camera logic (likely managed by [Camera](/AgentDocs/entities/camera.md)) and the low-level rendering pipeline. During the frame lifecycle, the camera's matrices are passed to this class, which synchronizes the local `Float32Array` with the GPU buffer. Once updated, the data is available to various render passes, such as those defined in [/AgentDocs/core/render/pass/index.md], provided their shaders are configured to read from the designated binding point.

- **INTERNAL REFERENCES**: [Camera](/AgentDocs/entities/camera.md), [/AgentDocs/core/render/render-pipeline.md](/AgentDocs/core/render/render-pipeline.md)

## 2. Environment & Configuration
**Environment Lookups:**
- `gl` (via `constructor`)  The `WebGL2RenderingContext` required for buffer allocation and GPU communication.

**Hardcoded Constants:**
- `BINDING_POINT` (Default: `0`)  The global index used to bind the uniform buffer, ensuring all shaders look at the same memory slot.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `CameraUBO` | Class | Manages the lifecycle, allocation, and synchronization of the camera Uniform Buffer Object. |
| `BINDING_POINT` | Property (readonly) | Provides the constant index for the UBO binding point. |
| `update` | Method | Synchronizes the GPU buffer with new `viewMatrix` and `projectionMatrix` data. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. Receives `WebGL2RenderingContext`.
    2. Creates a new `WebGLBuffer`.
    3. Allocates a `Float32Array` of 32 elements (16 for view, 16 for projection).
    4. Initializes the GPU buffer using `gl.bufferData` with `DYNAMIC_DRAW` usage.
    5. Binds the buffer to the global `BINDING_POINT` using `gl.bindBufferBase`.
- **Data Path**: 
    1. **Input**: Two `mat4` objects (view and projection).
    2. **Processing**: The `viewMatrix` is copied to index 0 of the `data` array; the `projectionMatrix` is copied to index 16.
    3. **Output**: The updated `Float32Array` is uploaded to the GPU via `gl.bufferSubData`.
- **Conditional Branching**: No conditional branching logic is present in this component.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - None identified.
- **External Packages**: 
    - `gl-matrix` (for `mat4` type definitions).