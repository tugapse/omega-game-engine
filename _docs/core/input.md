## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| Mouse, Keybord, GamepadManager | /core/input.ts |

This component provides static managers for tracking and querying the state of various user inputs: mouse, keyboard, and gamepad. It centralizes the raw input data—such as button presses, cursor coordinates, and key states—allowing other parts of the application to query the current state without needing direct access to the underlying input event listeners.

These managers function as global state repositories for input handling. They are foundational utilities that feed into the main game loop or application logic, allowing systems to react to user actions. They interact with the system environment (via `navigator.getGamepads()` in `GamepadManager`) and maintain state that is cleared periodically via the `cleanLastFrame` function.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| Mouse | Class | Manages mouse input state, including button presses, cursor position, and movement deltas. |
| Mouse.mouseButtonDown | Property | A map storing the pressed state of each mouse button. |
| Mouse.mouseClickPosition | Property | The position of the mouse cursor when a button was last pressed. |
| Mouse.mousePosition | Property | The current position of the mouse cursor relative to the viewport. |
| Mouse.mouseMovement | Property | The movement delta of the mouse since the last frame. |
| Mouse.wheelX | Property | The movement delta of the mouse wheel x since the last frame. |
| Mouse.wheelY | Property | The movement delta of the mouse wheel y since the last frame. |
| Mouse.getMousePosition() | Method | Gets the current mouse position relative to the canvas, returning a copy. |
| Mouse.getMouseMovement() | Method | Gets the mouse movement delta since the last frame, returning a copy. |
| Mouse.isMouseButtonDown(button: number) | Method | Checks if a specific mouse button is currently held down. |
| Mouse.getMouseWheelDelta() | Method | Gets the mouse wheel scroll delta since the last frame. |
| Keybord | Class | Manages keyboard input state, tracking pressed, down, and up states for keys. |
| Keybord.keyDown | Property | A map storing which keys are currently held down. |
| Keybord.keyUp | Property | A map storing which keys were released in the last frame. |
| Keybord.keyPress | Property | A map storing which keys were pressed in the last frame. |
| Keybord.isKeyDown(key: string) | Method | Checks if a key is currently held down. |
| Keybord.isKeyPressed(key: string) | Method | Checks if a key was pressed down in the current frame. |
| Keybord.isKeyReleased(key: string) | Method | Checks if a key was released in the current frame. |
| GamepadManager | Class | Manages gamepad input, providing access to connected controllers. |
| GamepadManager.get gamepads | Property | Returns an array of connected Gamepad objects or nulls. |
| GamepadManager.update() | Method | Refreshes the internal list of connected gamepads by querying the browser API. |
| cleanLastFrame() | Function | Resets frame-specific input deltas (mouse movement, wheel delta) and clears transient key state maps. |

## 3. Implementation Details & Side Effects
- **Core Logic:** Input states are maintained via static properties within `Mouse` and `Keybord`. Methods like `getMousePosition` ensure immutability by returning copies of the internal state. `GamepadManager.update()` relies on `navigator.getGamepads()` to synchronize the internal state with the browser's current hardware state. `cleanLastFrame` resets delta accumulators and transient state maps (`keyUp`, `keyPress`) to zero/empty for the next frame.
- **Side Effects:** Mutates global/static state across all classes (`Mouse`, `Keybord`, `GamepadManager`). `GamepadManager.update()` interacts with the browser's global `navigator` object.
- **Error Handling:** No explicit error handling (try/catch blocks) is present in the provided code.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `navigator` (Browser API)
- **Internal:** None