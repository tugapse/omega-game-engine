## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| CameraUBO | core/camera-ubo |

This component is responsible for managing a WebGL Uniform Buffer Object (UBO) specifically designed to store and efficiently share the camera's view and projection matrices across multiple rendering passes. By centralizing these critical transformation matrices into a single GPU buffer, it significantly reduces the per-draw call overhead associated with setting individual uniforms, leading to substantial performance gains in rendering pipelines.

Architecturally, `CameraUBO` functions as a core rendering service layer. It acts as a bridge between the CPU-side camera state (represented by `mat4` objects) and the GPU's shader programs. It relies on the WebGL2 context to allocate and manage the buffer, and its `update` method ensures that the latest camera data is synchronized to the GPU before any rendering operations occur, fitting into the core rendering loop managed by the application's main rendering context.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| CameraUBO | Class | Manages the WebGL UBO for camera matrices. |
| BINDING_POINT | Readonly Property | The fixed binding point (0) used to link this UBO to shaders. |
| constructor | Method | Initializes the UBO, allocates the necessary 32-float buffer space, and binds it to the global binding point. |
| update | Method | Synchronizes the provided `viewMatrix` and `projectionMatrix` into the GPU buffer, ensuring the GPU has the latest camera data. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The class initializes a 32-float buffer to hold two 4x4 matrices (view and projection). The `update` method uses `Float32Array.set()` to pack the matrices sequentially into the data array (view at offset 0, projection at offset 16) before using `gl.bufferSubData` to push this updated data to the GPU buffer.

- **Side Effects:** Interacts heavily with the WebGL2 rendering context (`gl`), creating, binding, and updating GPU buffers (`WebGLBuffer`).

- **Error Handling:** No explicit error handling is implemented; it relies on the underlying WebGL context to throw errors if operations fail.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** gl-matrix
- **Internal:** None