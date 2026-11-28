## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| EngineEventManager | [src/managers/engine-event-manager.ts](/src/managers/engine-event-manager.ts) |

This component is responsible for centralizing and managing all input events originating from the user interface, including mouse, keyboard, gamepad, and pointer interactions. Its primary responsibility is to capture these raw browser events and translate them into a standardized, engine-consumable state that other parts of the application can read during the update cycle.

It acts as a critical service layer within the application architecture, bridging the gap between the browser's DOM event system and the core game loop logic. It relies heavily on state management provided by [Engine](/src/engine.ts) and exposes input states via components like [Mouse](/src/core.ts), [Keybord](/src/core.ts), and [GamepadManager](/src/core.ts).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| EngineEventManager | Class | Manages the initialization and lifecycle of event listeners for the engine canvas and window. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `initialize` method sets up numerous event listeners on the `HTMLCanvasElement` and the global `document`/`window`. The `update` method resets transient input states (like movement deltas and key press flags) and calls `GamepadManager.update()`. Pointer events are handled by capturing pointer IDs and calling internal `Pointer._down`, `Pointer._move`, and `Pointer._up` methods.
- **Side Effects:** Mutates external/global state by setting properties on `Mouse`, `Keybord`, and `Engine` instances (e.g., `Mouse.mousePosition.x`, `Engine.isFocused`). It also directly interacts with the browser DOM via `addEventListener` and `document.addEventListener`.
- **Error Handling:** The `onPointerMove` method includes a check (`if (!Pointer.active.has(event.pointerId)) return;`) to prevent processing events for inactive pointers.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [Mouse](/src/core.ts), [Keybord](/src/core.ts), [GamepadManager](/src/core.ts), [Pointer](/src/core.ts), [Engine](/src/engine.ts)