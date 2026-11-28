## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| ClearMask | [enums/gl/clear-mask.enum.ts](/enums/gl/clear-mask.enum.ts) |

This component defines an enumeration, `ClearMask`, which encapsulates bit flags used to specify which buffers should be cleared during a rendering cycle in a WebGL context. It provides named constants corresponding to the standard buffer bits available in WebGL2, such as color, depth, and stencil.

This enum serves as a configuration utility within the rendering pipeline, specifically for managing the state of the rendering surface before drawing new frames. It is utilized by rendering systems that interact with the low-level graphics context, such as those found in the core rendering service.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `ClearMask` | Enum | Defines bitmasks for clearing various rendering buffers (Color, Depth, Stencil). |

## 3. Implementation Details & Side Effects
- **Core Logic:** The enum members are directly assigned values derived from constants provided by `WebGL2RenderingContext`. Combinations are achieved using the bitwise OR operator (`|`).
- **Side Effects:** None.
- **Error Handling:** None.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `WebGL2RenderingContext` (Implied global context/API dependency).
- **Internal:** None.