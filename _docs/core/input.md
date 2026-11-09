## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| Mouse | core/input.ts |

This component provides a centralized, static interface for tracking and querying various forms of user input originating from the mouse device. It maintains the current state of mouse buttons, records the precise cursor position, tracks movement deltas between frames, and manages wheel scroll inputs. Its primary responsibility is to abstract the raw input events into easily consumable, frame-independent state variables for game logic.

This class acts as a core utility service within the application's input handling layer. It is designed to be polled by systems that require real-time input data, such as rendering loops or physics engines. It interacts with the state managed by the [Keyboard](/core/input.md) and provides a mechanism for input cleanup via the [cleanLastFrame](/core/input.md) function, ensuring state integrity across frames.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| Mouse.mouseButtonDown | Property | Map storing the boolean pressed state for each mouse button. |
| Mouse.mouseClickPosition | Property | Stores the {x, y} coordinates where the mouse was last clicked. |
| Mouse.mousePosition | Property | Stores the current {x, y} coordinates of the mouse cursor. |
| Mouse.mouseMovement | Property | Stores the {x, y} delta of mouse movement since the last frame. |
| Mouse.wheelX | Property | Stores the X-axis scroll delta of the mouse wheel since the last frame. |
| Mouse.wheelY | Property | Stores the Y-axis scroll delta of the mouse wheel since the last frame. |
| Mouse.getMousePosition() | Method | Returns a copy of the current mouse position {x, y}. |
| Mouse.getMouseMovement() | Method | Returns a copy of the mouse movement delta {x, y} since the last frame. |
| Mouse.isMouseButtonDown(button: number) | Method | Checks if a specific mouse button (0, 1, or 2) is currently held down. |
| Mouse.getMouseWheelDelta() | Method | Returns a copy of the mouse wheel scroll delta {x, y}. |
| Keyboard.keyDown | Property | Map storing the boolean held-down state for each keyboard key. |
| Keyboard.keyUp | Property | Map storing keys that were released in the current frame (single-frame event). |
| Keyboard.keyPress | Property | Map storing keys that were pressed down in the current frame (single-frame event). |
| Keyboard.isKeyDown(key: string) | Method | Checks if a specified key is currently held down (case-insensitive). |
| Keyboard.isKeyPressed(key: string) | Method | Checks if a specified key was pressed down in the current frame (case-insensitive). |
| Keyboard.isKeyReleased(key: string) | Method | Checks if a specified key was released in the current frame (case-insensitive). |
| GamepadManager.get gamepads | Property | Returns an array containing all currently connected Gamepad objects. |
| GamepadManager.update() | Method | Polls the browser for the latest connected gamepad states and updates the internal list. |
| cleanLastFrame() | Function | Resets all frame-dependent input states (movement deltas, keyUp, keyPress) to zero/empty for the next frame. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The input classes maintain static state maps and properties to track input events. Methods like `getMousePosition()` ensure immutability by returning copies of internal state objects. The `cleanLastFrame` function is crucial for resetting transient states (like single-frame press/release events) after they have been processed by the game loop.
- **Side Effects:** The `GamepadManager.update()` method interacts with the browser's `navigator.getGamepads()` API, which is an external system call. The `cleanLastFrame` function mutates the static state of `Mouse` and `Keyboard` classes.
- **Error Handling:** No explicit exception handling is implemented; state management relies on the caller correctly invoking `cleanLastFrame()` at the end of the frame cycle.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `navigator` (Browser API)
- **Internal:** None