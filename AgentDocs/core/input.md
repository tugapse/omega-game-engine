## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | Input Management System |
| Source file | input.ts |

The **Input Management System** serves as the centralized state repository for all user interaction hardware within the engine. It abstracts raw browser-level events into a structured, queryable format that allows other engine modules to check the status of peripherals without direct event listener attachment.

**Functional Mission**
The primary responsibility of **input.ts** is to provide a high-performance, static interface for tracking the real-time state of mouse, keyboard, and gamepad devices. It solves the problem of asynchronous event handling by buffering input states into a synchronous format that can be polled during the engine's update loop, ensuring deterministic behavior across frames.

**System Context & Integration**
This component acts as a data provider for downstream logic, such as [Entity Behaviours](/AgentDocs/behaviours/index.md) and [Camera Fly Behaviours](/AgentDocs/behaviours/camera-fly-behaviour.md), which rely on polling `isKeyDown` or `getMouseMovement` to drive transformations. It is designed to be updated by an external driver (likely an input manager) and must be synchronized with the engine's frame lifecycle via the `cleanLastFrame` function to prevent "sticky" inputs.

- **INTERNAL REFERENCES**: [Keyboard](/AgentDocs/core/input.md), [Mouse](/AgentDocs/core/input.md), [GamepadManager](/AgentDocs/core/input.md).

## 2. Environment & Configuration
**Environment Lookups:**
- `navigator.getGamepads()` (via `GamepadManager.update`)  Accesses the browser's Gamepad API to poll connected controllers.

**Hardcoded Constants:**
- No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `Mouse` | Class | Static container for mouse position, movement deltas, wheel deltas, and button states. |
| `Keyboard` | Class | Static container for keyboard states, distinguishing between held (`keyDown`), newly pressed (`keyPress`), and released (`keyUp`) keys. |
| `GamepadManager` | Class | Manages the polling and retrieval of connected `Gamepad` objects. |
| `cleanLastFrame` | Func | Resets transient, single-frame input states (movement deltas, wheel deltas, and key press/release maps). |

## 4. Execution Logic & Flow
- **Initialization**: 
    - `Mouse` properties are initialized with zeroed coordinates and empty button maps.
    - `Keyboard` maps are initialized as empty objects.
    - `GamepadManager` starts with an empty array of gamepad references.
- **Data Path**: 
    - **Input Capture** (External): Browser events (keydown, mousedown, etc.) update the static properties of `Mouse` and `Keyboard`.
    - **Processing**: `GamepadManager.update()` polls the `navigator` API to refresh the gamepad list.
    - **Consumption**: Downstream systems call `isKeyDown()`, `getMousePosition()`, or `isMouseButtonDown()` to retrieve the current state.
    - **Cleanup**: `cleanLastFrame()` is invoked at the end of the engine loop to wipe `keyPress`, `keyUp`, and movement deltas, preparing the system for the next frame.
- **Conditional Branching**:
    - `isMouseButtonDown`, `isKeyDown`, `isKeyPressed`, and `isKeyReleased` use strict boolean checks (`=== true`) against the internal maps to handle undefined keys gracefully.

## 5. Resource Dependencies
- **Standard Libraries**: None.
- **Internal Modules**: 
    - No internal modules imported within this file.
- **External Packages**: 
    - `Gamepad` (Web API)