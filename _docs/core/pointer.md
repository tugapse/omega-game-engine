## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| Pointer | /core/pointer.ts |

This component manages the state and tracking of input devices (mouse, touch, pen) interacting with a canvas surface. Its primary responsibility is to maintain a record of where each active pointer is located, along with a short history of its positions, allowing for gesture detection and velocity calculation.

It serves as a centralized input service within the application architecture. It acts as a facade, receiving raw input events from an external `InputManager` and broadcasting these events to registered listeners via `onDown`, `onMove`, and `onUp` methods.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `PointerSample` | Interface | Defines a single recorded position of a pointer, including its X, Y coordinates, and the time of the sample in milliseconds. |
| `PointerState` | Interface | Represents the complete state of a single active pointer, including its ID, type, current coordinates, start coordinates, start time, and a history of `PointerSample`s. |
| `PointerListener` | Type | A function signature used as a callback for pointer events, accepting a `PointerState` object. |
| `Pointer.historyMs` | Static Property | A constant defining the duration (in ms) that the history buffer for each pointer will retain samples. |
| `Pointer.active` | Static Property | A read-only Map storing all currently active pointers, keyed by their unique ID. |
| `Pointer.primary` | Static Getter | Returns the `PointerState` of the first active pointer found, or `undefined` if none are active. |
| `Pointer.onDown(listener)` | Static Method | Registers a callback function to be executed when any pointer begins tracking on the canvas. Returns an unsubscribe function. |
| `Pointer.onMove(listener)` | Static Method | Registers a callback function to be executed when any tracked pointer moves. Returns an unsubscribe function. |
| `Pointer.onUp(listener)` | Static Method | Registers a callback function to be executed when a pointer is lifted or cancelled. Returns an unsubscribe function. |
| `Pointer.velocity(pointer, windowMs)` | Static Method | Calculates the velocity (in pixels per second) of a given pointer over a specified time window. Returns an object `{ x: number; y: number }`. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The class maintains state using a static `Map` (`active`) to track pointers by ID. Event listeners are managed using static `Set`s. When an event occurs (`_down`, `_move`, `_up`), the corresponding state is updated, and all registered listeners are synchronously invoked with the current `PointerState`. The `velocity` method iterates over the pointer's history to calculate the average rate of change between two points over a defined time interval.
- **Side Effects:** Mutates the static state (`active`, `downListeners`, `moveListeners`, `upListeners`). It invokes external callback functions (`PointerListener`) registered by consumers.
- **Error Handling:** The `velocity` method includes checks to return `{ x: 0, y: 0 }` if fewer than two samples exist or if the time difference (`dt`) is zero or negative, preventing division-by-zero errors.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** None