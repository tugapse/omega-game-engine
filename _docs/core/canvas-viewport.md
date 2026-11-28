## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **CanvasViewport** | [src/core/canvas-viewport.ts](/src/core/canvas-viewport.ts) |

This component serves as a static registry for maintaining the current dimensions of the rendering surface, referred to as the canvas or viewport. Its primary responsibility is to provide a centralized, easily accessible point of reference for the width and height of the rendering area across the entire application.

It functions as a global utility state holder within the engine architecture. By centralizing these dimensions, other subsystems—such as rendering pipelines or UI layout managers—can query the current viewport size without needing to pass dimension parameters through multiple layers of function calls, promoting loose coupling.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `CanvasViewport.rendererWidth` | Static Property | The current width of the renderer viewport. Updated upon canvas resizing. |
| `CanvasViewport.rendererHeight` | Static Property | The current height of the renderer viewport. Updated upon canvas resizing. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The class defines two public static properties, `rendererWidth` and `rendererHeight`, initialized to 0. These properties are designed to be mutated externally (presumably by a resize event handler) to reflect the actual dimensions of the rendering surface.
- **Side Effects:** Mutates global/static state (`rendererWidth` and `rendererHeight`).
- **Error Handling:** None.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.
- **Internal:** None.