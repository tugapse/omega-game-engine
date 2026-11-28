## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| RenderTarget | /core/render/render-target.ts |

This component defines the `RenderTarget` class, which manages an off-screen framebuffer along with its attached color and depth buffers. Its primary responsibility is to provide a complete rendering surface that can be bound for drawing operations, allowing rendering to occur without affecting the main screen output. It handles the creation, configuration, and destruction of the underlying WebGL resources necessary for off-screen rendering.

The `RenderTarget` serves as a core rendering utility within the graphics pipeline. It abstracts the complexity of WebGL framebuffer setup, allowing other parts of the engine to render scenes or effects into a specific buffer. It interacts with the `WebGL2RenderingContext` provided during construction to manage GPU resources, fitting into the low-level graphics service layer of the application.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `RenderTargetColor` | Type | Defines the supported color attachment formats: `'rgba8'` or `'rgba16f'`. |
| `RenderTargetOptions` | Interface | Configuration object specifying the color and depth attachment types for the render target. |
| `RenderTarget` | Class | Manages the framebuffer and its attachments. Provides methods to bind, clear, and resize the target. |
| `RenderTarget.supportsFloatColor` | Static Method | Checks if the provided `WebGL2RenderingContext` supports float color buffers via the `EXT_color_buffer_float` extension. |
| `width` | Getter | Returns the current width of the render target. |
| `height` | Getter | Returns the current height of the render target. |
| `framebuffer` | Getter | Returns the underlying `WebGLFramebuffer` object. |
| `colorTexture` | Getter | Returns the color attachment `WebGLTexture`, if one is configured. |
| `depthTexture` | Getter | Returns the depth attachment `WebGLTexture`, if configured as a texture. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `resize` method is central, handling the recreation of all attachments when the dimensions change. It checks for support for `rgba16f` before proceeding. The constructor initializes the target based on provided options, defaulting to `'rgba8'` color and `'texture'` depth. The `createTexture` private method encapsulates the boilerplate for setting up texture parameters (filtering, wrapping) for the GPU.
- **Side Effects:** The code heavily interacts with the GPU state via the `WebGL2RenderingContext` (`gl`). It creates, binds, attaches, and deletes `WebGLFramebuffer`, `WebGLTexture`, and `WebGLRenderbuffer` objects, which constitutes significant state mutation on the graphics context.
- **Error Handling:** The constructor throws an error if `rgba16f` is requested but `EXT_color_buffer_float` is unavailable. The `resize` method throws an error if the resulting framebuffer status is not `gl.FRAMEBUFFER_COMPLETE`.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.
- **Internal:** None.