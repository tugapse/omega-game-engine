## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | EngineEventManager |
| Source file | engine-event-manager.ts |

The **EngineEventManager** serves as the primary bridge between the browser's low-level DOM event system and the engine's internal state management. It acts as a centralized listener that intercepts hardware-level inputsincluding mouse, keyboard, gamepad, and window focus eventsand translates them into a structured format that the engine can consume during its update cycle.

By decoupling raw browser events from the game logic, this component ensures that input state is synchronized with the engine's frame rate. It manages the lifecycle of input data, handling the transition from asynchronous browser events to synchronous per-frame state updates, thereby preventing race conditions and ensuring consistent input polling for downstream systems.

**Functional Mission**
The primary responsibility of the **EngineEventManager** is to capture, normalize, and store user input and window state. It solves the problem of asynchronous event timing by buffering input changes and providing a clean, polled interface for the rest of the engine to query.

**System Context & Integration**
This component integrates directly with the [Engine](/AgentDocs/engine.md) to update global state flags such as `isFocused`, `isTabActive`, and `isWindowFocused`. It acts as a data provider for the [Mouse](/AgentDocs/core/input.md), [Keyboard](/AgentDocs/core/input.md), and [GamepadManager](/AgentDocs/managers/input-manager.md) modules, populating their static properties with real-time data. During the engine's update loop, the `update()` method is called to reset transient per-frame data (like movement deltas and key presses), ensuring that input states do not "leak" across frames.

- **INTERNAL REFERENCES**: [Engine](/AgentDocs/engine.md), [Mouse](/AgentDocs/core/input.md), [Keyboard](/AgentDocs/core/input.md), [GamepadManager](/AgentDocs/managers/input-manager.md).

## 2. Environment & Configuration
**Environment Lookups:**
- `this.engine.isFocused` (via `onEngineFocus`/`onEngineBlur`)  Tracks if the canvas element has focus.
- `this.engine.isTabActive` (via `onEngineVisibilityChange`)  Tracks if the browser tab is currently visible.
- `this.engine.isWindowFocused` (via `onEngineWindowFocus`/`onEngineWindowBlur`)  Tracks if the browser window has focus.

**Hardcoded Constants:**
- No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `constructor` | Function | Initializes the manager with a reference to the [Engine](/AgentDocs/engine.md) and the target `HTMLCanvasElement`. |
| `initialize` | Method | Attaches DOM event listeners to the canvas and window objects. |
| `update` | Method | Resets per-frame input deltas (mouse movement, wheel, key presses) and triggers [GamepadManager](/AgentDocs/managers/input-manager.md) polling. |
| `onEngineContextMenu` | Private Method | Prevents the default browser context menu on the canvas. |
| `onEngineKeyDown` | Private Method | Updates the `Keyboard.keyDown` state. |
| `onEngineKeyUp` | Private Method | Updates `Keyboard.keyUp`, `Keyboard.keyPress`, and `Keyboard.keyDown` states. |
| `onEngineMouseMove` | Private Method | Calculates and updates `Mouse.mousePosition` and `Mouse.mouseMovement` deltas. |
| `onEngineMouseDown` | Private Method | Sets the state for specific mouse buttons. |
| `onEngineMouseUp` | Private Method | Clears the state for specific mouse buttons. |
| `onEngineMouseLeave` | Private Method | Resets all mouse button states to prevent "stuck" buttons when the cursor leaves the canvas. |
| `onEngineMouseScroll` | Private Method | Captures `WheelEvent` data for `Mouse.wheelX` and `Mouse.wheelY`. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. Sets `canvas.tabIndex = 0` to ensure the canvas can receive keyboard focus.
    2. Attaches event listeners for mouse (move, down, up, leave, wheel, contextmenu), keyboard (down, up), canvas focus (focus, blur), and global window/document state (visibilitychange, window focus/blur).
- **Data Path**: 
    1. **Input**: Browser triggers a DOM event (e.g., `keydown`).
    2. **Processing**: The corresponding private handler (e.g., `onEngineKeyDown`) intercepts the event and updates the static state in [Keyboard](/AgentDocs/core/input.md).
    3. **Output**: During the next engine tick, the `update()` method clears transient data, and the engine's logic queries the updated [Mouse](/AgentDocs/core/input.md) or [Keyboard](/AgentDocs/core/input.md) states.
- **Conditional Branching**:
    - `onEngineMouseDown`: Only prevents default browser behavior if `engine.isFocused` is true.
    - `onEngineMouseScroll`: Only updates scroll deltas if `engine.isFocused` is true.
    - `onEngineKeyUp`: Only marks a key as `keyUp` and `keyPress` if it was previously recorded in `keyDown`.

## 5. Resource Dependencies
- **Standard Libraries**: `HTMLCanvasElement`, `MouseEvent`, `KeyboardEvent`, `WheelEvent`, `document`, `window`.
- **Internal Modules**: 
    - [Mouse](/AgentDocs/core/input.md)
    - [Keyboard](/AgentDocs/core/input.md)
    - [GamepadManager](/AgentDocs/managers/input-manager.md)
    - [Engine](/AgentDocs/engine.md)
- **External Packages**: None identified.