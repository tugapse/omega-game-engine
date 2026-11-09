## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| EngineEventManager | managers/engine-event-manager |

This component is responsible for centralizing the capture and management of all user input events originating from the browser environment, including mouse movements, keyboard presses, gamepad states, and window focus changes. Its primary duty is to act as the bridge between the low-level browser DOM events and the engine's internal state management system, ensuring that input data is consistently available for game logic processing.

Architecturally, `EngineEventManager` functions as a critical service layer within the engine. It subscribes to global and canvas-specific events and updates the static state classes like [Mouse](/core/mouse.md), [Keyboard](/core/keyboard.md), and [GamepadManager](/core/gamepad-manager.md). It relies on the main [Engine](/engine/engine.md) instance to track focus states and coordinate input handling across the application lifecycle.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| EngineEventManager | Class | Manages all browser-level input and focus events for the engine. |
| initialize | Method | Attaches all necessary event listeners to the canvas and window. |
| update | Method | Called once per frame to update input states, resetting per-frame data and polling gamepad state. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The class initializes by attaching numerous event listeners to the canvas and document. The `update` method is called every frame to reset transient input states (like movement deltas) and poll the [GamepadManager](/core/gamepad-manager.md). Event handlers translate raw browser events (e.g., `mousemove`, `keydown`) into state changes within the static input managers.
- **Side Effects:** Mutates external/global state by directly modifying the static properties of [Mouse](/core/mouse.md), [Keyboard](/core/keyboard.md), and [GamepadManager](/core/gamepad-manager.md). It also mutates the state properties of the passed [Engine](/engine/engine.md) instance (e.g., `isFocused`).
- **Error Handling:** The component relies on the browser's native event handling for error management. Specific logic prevents the default context menu (`event.preventDefault()`) when the engine is focused.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [Mouse](/core/mouse.md), [Keyboard](/core/keyboard.md), [GamepadManager](/core/gamepad-manager.md), [Engine](/engine/engine.md)