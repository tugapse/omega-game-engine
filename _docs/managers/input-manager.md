## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| InputManager | managers/input-manager.md |

This component is responsible for abstracting and managing all raw input events originating from the browser environment, such as keyboard presses, mouse movements, clicks, and window focus changes. Its primary duty is to capture these low-level DOM events and translate them into standardized, consumable states within the engine's global state managers, specifically updating the `Keyboard` and `Mouse` state classes.

The `InputManager` acts as a critical input service layer within the application architecture. It bridges the gap between the browser's event system and the core engine logic. It relies on the `Engine` instance to track focus status and interacts directly with the `Mouse` and `Keyboard` state classes to maintain the current input state for the rest of the engine to consume.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| InputManager | Class | Manages all browser-level input and focus events for the engine. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The class initializes by attaching numerous event listeners to the canvas and the global `document`/`window`. Event handlers (e.g., `onEngineKeyDown`, `onEngineMouseMove`) capture raw events and update corresponding static state variables within the `Mouse` and `Keyboard` classes. Focus and visibility events update the `Engine` instance's internal focus flags.
- **Side Effects:** Mutates external/global state by directly modifying the static properties of the `Mouse` and `Keyboard` classes, and by setting focus flags (`isFocused`, `isWindowFocused`, `isTabActive`) on the provided `Engine` instance.
- **Error Handling:** No explicit exception handling is implemented; event handlers rely on the browser's native event propagation and default behavior.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [Engine](/engine.md), [Keyboard](/core/keyboard.md), [Mouse](/core/mouse.md)