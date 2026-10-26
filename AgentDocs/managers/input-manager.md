## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | InputManager |
| Source file | input-manager.ts |

The **InputManager** serves as the primary bridge between the browser's low-level DOM event system and the engine's internal state representation. Its strategic position is at the boundary of the hardware/browser environment and the engine's logical execution loop, acting as a translator that converts raw asynchronous browser events into synchronous, queryable state data.

**Functional Mission**
The primary responsibility of **InputManager** is to capture, normalize, and store user input data (keyboard, mouse, and window focus) to ensure the engine has a consistent view of the user's interaction state. It solves the problem of event-driven input volatility by mapping transient events (like `keydown` or `mousedown`) into persistent state objects that can be polled during the engine's update cycle.

**System Context & Integration**
This component integrates deeply with the [Engine](/AgentDocs/engine.md) by updating its focus and visibility properties. It acts as a data provider for the rest of the system by populating the static state containers defined in [Keyboard](/AgentDocs/core/input.md) and [Mouse](/AgentDocs/core/input.md). While it is currently marked as deprecated in favor of [EngineEventManager](/AgentDocs/managers/engine-event-manager.md), it remains a critical junction for translating DOM `MouseEvent`, `KeyboardEvent`, and `WheelEvent` into engine-compatible formats.

- **INTERNAL REFERENCES**: [Engine](/AgentDocs/engine.md), [Keyboard](/AgentDocs/core/input.md), [Mouse](/AgentDocs/core/input.md), [EngineEventManager](/AgentDocs/managers/engine-event-manager.md).

## 2. Environment & Configuration
**Environment Lookups:**
- `engine.isFocused` (via `onEngineFocus`/`onEngineBlur`)  Tracks if the canvas element has focus.
- `engine.isTabActive` (via `onEngineVisibilityChange`)  Tracks if the browser tab is currently visible.
- `engine.isWindowFocused` (via `onEngineWindowFocus`/`onEngineWindowBlur`)  Tracks if the browser window has focus.

**Hardcoded Constants:**
- No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `InputManager` | Class | Orchestrates the attachment of event listeners and manages the lifecycle of input capture. |
| `initialize` | Method | Configures the canvas `tabIndex` and attaches all DOM event listeners to the canvas, window, and document. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. Receives an instance of [Engine](/AgentDocs/engine.md) and an `HTMLCanvasElement`.
    2. Upon calling `initialize()`, sets `canvas.tabIndex = 0` to enable keyboard focus.
    3. Attaches event listeners for mouse (movement, buttons, wheel, context menu), keyboard (down, up), and window/document (focus, blur, visibility) events.
- **Data Path**: 
    1. **Input**: Raw browser events (`KeyboardEvent`, `MouseEvent`, `WheelEvent`, `VisibilityEvent`).
    2. **Processing**: 
        - Keyboard keys are normalized via `.toLowerCase()`.
        - Mouse coordinates are calculated relative to the `canvas.getBoundingClientRect()`.
        - Mouse movement deltas are captured via `event.movementX/Y`.
    3. **Output**: Updates to static state in [Keyboard](/AgentDocs/core/input.md) and [Mouse](/AgentDocs/core/input.md) and property updates in [Engine](/AgentDocs/engine.md).
- **Conditional Branching**:
    - **Mouse Down**: Only calls `event.preventDefault()` if `engine.isFocused` is true.
    - **Mouse Scroll**: Only updates `Mouse.wheelY/X` if `engine.isFocused` is true.
    - **Key Up**: Only updates `keyUp` and `keyPress` states if the key was previously recorded as being in a `keyDown` state.
    - **Mouse Leave**: Iterates through all mouse buttons to reset their state to `false` when the cursor exits the canvas area.

## 5. Resource Dependencies
- **Standard Libraries**: `HTMLCanvasElement`, `MouseEvent`, `KeyboardEvent`, `WheelEvent`, `document`, `window` (Web APIs).
- **Internal Modules**: 
    - [Engine](/AgentDocs/engine.md)
    - [Keyboard](/AgentDocs/core/input.md)
    - [Mouse](/AgentDocs/core/input.md)
- **External Packages**: None identified.