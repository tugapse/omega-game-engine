## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| InputManager | [src/managers/input-manager.ts](/src/managers/input-manager.ts) |

This component is responsible for capturing and translating all user input events—keyboard presses, mouse movements, clicks, scrolling, and window focus changes—into a standardized format consumable by the application engine. It acts as the primary interface between the operating system's input stream and the core game logic.

It functions as a crucial service layer within the application architecture. It receives raw events from the `HTMLCanvasElement` and `window` objects, processes them, and updates the state managed by the `Engine` instance and the global `Keybord` and `Mouse` state objects, allowing other parts of the application to react to user interaction.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `InputManager` | Class | Manages the subscription to various browser and canvas events to capture user input. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `initialize` method sets up numerous event listeners on the canvas and the global document/window objects. Event handlers then read event properties (e.g., `event.key`, `event.clientX`, `event.movementX`) and update corresponding state variables within the `Keybord` and `Mouse` objects, or set flags on the `Engine` instance.
- **Side Effects:** Mutates external/global state by:
    - Setting properties on the `Engine` instance (`engine.isFocused`, `engine.isTabActive`, `engine.isWindowFocused`).
    - Mutating the global state objects `Keybord` and `Mouse` (e.g., `Keybord.keyDown`, `Mouse.mousePosition.x`).
    - Calling `event.preventDefault()` on specific events like contextmenu or mousedown if the engine is focused.
- **Error Handling:** No explicit exception handling is implemented; event handlers rely on the browser's event system to manage input flow.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `HTMLCanvasElement`, `MouseEvent`, `KeyboardEvent`, `WheelEvent`, `document`, `window`.
- **Internal:** [Engine](/src/engine.ts), [Keybord](/src/core.ts), [Mouse](/src/core.ts).