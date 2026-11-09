## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| ClearMask | enums/gl/clear-mask.enum.md |

This component defines a set of constants, encapsulated within the `ClearMask` enum, that represent specific bit flags used when clearing rendering buffers in WebGL. It provides named, readable constants for the color, depth, and stencil buffers, allowing developers to easily specify which buffers should be reset during a rendering cycle.

This enum serves as a low-level configuration utility within the graphics pipeline. It is primarily consumed by rendering systems that manage the state of the WebGL context, ensuring that the correct combination of buffers is cleared before drawing new frames, often in conjunction with other rendering state management components.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| Color | Enum Member | Represents the bit flag for clearing the color buffer. |
| Depth | Enum Member | Represents the bit flag for clearing the depth buffer. |
| Stencil | Enum Member | Represents the bit flag for clearing the stencil buffer. |
| ColorAndDepth | Enum Member | Represents the combined bit flag for clearing both the color and depth buffers. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The enum members are direct mappings to constants provided by `WebGL2RenderingContext`. The `ColorAndDepth` member uses the bitwise OR operator (`|`) to combine the individual color and depth buffer flags into a single mask value.

- **Side Effects:** None.

- **Error Handling:** None.

## 4. Dependencies & Configuration
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** WebGL2RenderingContext (Browser API)

- **Internal:** None