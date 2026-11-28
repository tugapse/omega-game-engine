## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| CameraUBO | [src/core/camera-ubo.ts](/src/core/camera-ubo.ts) |

This component manages the Uniform Buffer Object (UBO) used to pass camera transformation data (view and projection matrices) from the CPU to the GPU. Its primary responsibility is to encapsulate the necessary WebGL resources—the buffer and the data array—and provide a standardized mechanism for updating this data efficiently between frames.

It serves as a critical data service layer within the rendering pipeline. By centralizing camera parameters into a single, globally bound UBO (at binding point 0), it allows all shaders to access the camera state uniformly without needing individual uniform setters, promoting performance and simplifying shader code across the application, potentially interacting with rendering systems like those found in [Renderer](/path/to/renderer.md).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| CameraUBO | Class | Manages the WebGL buffer for camera matrices. Requires a `WebGL2RenderingContext` upon instantiation. |
| update | Method | Updates the internal data buffer with the provided `viewMatrix` and `projectionMatrix`, pushing the changes to the GPU. Must be called once per frame. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The constructor initializes a `Float32Array` of size 32 (to hold two 4x4 matrices) and sets up the WebGL buffer, binding it to the global binding point 0. The `update` method uses `Float32Array.set()` to pack the two matrices into the data array, followed by `gl.bufferSubData()` to efficiently upload the modified data to the GPU buffer.
- **Side Effects:** Interacts heavily with the WebGL context (`gl`), creating, binding, and updating GPU buffers (`WebGLBuffer`).
- **Error Handling:** No explicit error handling is present; the code relies on the underlying WebGL context to manage resource creation and buffer operations.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** None