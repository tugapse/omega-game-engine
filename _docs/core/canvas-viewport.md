## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| CanvasViewport | core/canvas-viewport.md |

This component serves as a centralized, static registry for tracking the current dimensions of the rendering surface, whether it is the main canvas or a specific viewport within the engine. Its primary responsibility is to provide a consistent, globally accessible source of truth for the width and height used during rendering operations across various parts of the application.

It functions as a core utility service within the engine's rendering pipeline. By centralizing viewport dimensions, it decouples rendering logic from the specific canvas element instance, allowing other systemssuch as camera controllers or UI layout managersto query the current rendering bounds without needing direct references to the underlying DOM or graphics context.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| CanvasViewport.rendererWidth | Static Property | The current width of the renderer viewport. Updated upon canvas resize events. |
| CanvasViewport.rendererHeight | Static Property | The current height of the renderer viewport. Updated upon canvas resize events. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The class itself is a simple container holding two static numeric properties. The logic relies on external code (not present in this file) to mutate these properties when a resize event occurs.
- **Side Effects:** Mutates global/static state (`rendererWidth` and `rendererHeight`).
- **Error Handling:** None.

## 4. Dependencies & Configuration
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.

- **Internal:** None.