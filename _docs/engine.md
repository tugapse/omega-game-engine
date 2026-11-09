## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| Engine | src/engine.md |

This component serves as the central orchestrator for the entire application lifecycle. Its primary responsibility is to manage the initialization, state transitions, and execution loop of the game or application, ensuring that all core systems are correctly set up and communicating. It acts as the primary interface through which external systems interact with the running engine instance.

Architecturally, the `Engine` acts as the main service layer or controller. It aggregates and manages critical sub-systems such as the [DependencyManager](/src/managers/dependency-manager.md) and the [EngineEventManager](/src/managers/engine-event-manager.md). It is responsible for loading and managing the active [Scene](/src/entities/scene.md), driving the main update and render cycles, and handling global state changes like focus events.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| Engine | Class | The main engine controller. Manages initialization, scene lifecycle, and core loop execution. |
| currentScene | Getter | Returns the currently active [Scene](/src/entities/scene.md). |
| initialize | Method | Sets up the engine by instantiating and initializing the [EngineEventManager](/src/managers/engine-event-manager.md) and its event listeners, requiring an HTMLCanvasElement. |
| registerDependencies | Method | Triggers the [DependencyManager](/src/managers/dependency-manager.md) to register all necessary internal services and components. |
| loadScene | Method | Replaces the current active scene with a new instance of [Scene](/src/entities/scene.md) and initializes it. |
| update | Method | Executes the update logic for the current scene, passing the time elapsed since the last frame. |
| render | Method | Executes the drawing logic for the current scene. |
| destroy | Method | Initiates the cleanup process for the currently active scene. |
| handleFocusChange | Method | Updates the engine's focus state based on external events, affecting `isFocused`, `isTabActive`, and `isWindowFocused`. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The engine maintains a state machine implicitly through its methods (`initialize`, `loadScene`, `update`, `render`). Initialization involves setting up the event manager and dependency resolution. The core loop relies on external calls to `update` and `render`, which delegate execution to the currently loaded `Scene`. Focus handling synchronizes internal state flags with browser visibility APIs.

- **Side Effects:** Mutates global state via `document.visibilityState` when `handleFocusChange` is called. It also interacts with the provided `HTMLCanvasElement` during initialization via the `EngineEventManager`.

- **Error Handling:** No explicit exception handling is shown; methods like `update` and `render` use optional chaining (`?.`) to safely handle cases where `this.scene` might be null or undefined.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [Scene](/src/entities/scene.md), [DependencyManager](/src/managers/dependency-manager.md), [EngineEventManager](/src/managers/engine-event-manager.md)