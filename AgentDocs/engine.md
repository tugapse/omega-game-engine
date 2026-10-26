## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | Engine |
| Source file | engine.ts |

The **Engine** class serves as the central orchestrator and primary entry point for the entire omega-engine ecosystem. It is responsible for the lifecycle management of core subsystems, including dependency injection, event handling, and scene orchestration. By acting as the high-level controller, it abstracts the complexities of the underlying managers and provides a unified interface for the application to drive the simulation loop.

**Functional Mission**
The primary responsibility of the **Engine** is to manage the execution lifecycle of the engine, specifically handling initialization, the main update/render loop, and state transitions between scenes. It solves the problem of component synchronization by providing a single authority that coordinates the [DependencyManager](/AgentDocs/managers/dependency-manager.md), [EngineEventManager](/AgentDocs/managers/engine-event-manager.md), and the active [Scene](/AgentDocs/entities/scene.md).

**System Context & Integration**
The component sits at the top of the architectural hierarchy. It receives a `HTMLCanvasElement` during initialization to bootstrap the [EngineEventManager](/AgentDocs/managers/engine-event-manager.md), which in turn manages low-level input and window events. During the execution phase, the engine drives the `update` and `render` calls down to the current [Scene](/AgentDocs/entities/scene.md). It also monitors browser-level state changes (focus and visibility) to adjust the engine's internal operational state via `handleFocusChange`.

- **INTERNAL REFERENCES**: [DependencyManager](/AgentDocs/managers/dependency-manager.md), [EngineEventManager](/AgentDocs/managers/engine-event-manager.md), [Scene](/AgentDocs/entities/scene.md).

## 2. Environment & Configuration
**Environment Lookups:**
- `document.visibilityState` (via `handleFocusChange`)  Used to determine if the browser tab is active.

**Hardcoded Constants:**
- No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `Engine` | Class | The central controller for engine lifecycle and subsystem coordination. |
| `initialize` | Method | Bootstraps the [EngineEventManager](/AgentDocs/managers/engine-event-manager.md) using a provided canvas. |
| `registerDependencies` | Method | Triggers the registration process within the [DependencyManager](/AgentDocs/managers/dependency-manager.md). |
| `loadScene` | Method | Sets and initializes a new [Scene](/AgentDocs/entities/scene.md). |
| `update` | Method | Advances the simulation logic of the current [Scene](/AgentDocs/entities/scene.md) by a given `deltaTime`. |
| `render` | Method | Executes the drawing logic of the current [Scene](/AgentDocs/entities/scene.md). |
| `destroy` | Method | Performs cleanup operations on the current [Scene](/AgentDocs/entities/scene.md). |
| `handleFocusChange` | Method | Updates focus and visibility state flags based on window/tab interaction. |
| `currentScene` | Getter | Provides read-only access to the currently active [Scene](/AgentDocs/entities/scene.md). |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. The `constructor` instantiates a new [DependencyManager](/AgentDocs/managers/dependency-manager.md).
    2. `initialize(canvas)` is called, creating an [EngineEventManager](/AgentDocs/managers/engine-event-manager.md) and invoking its internal setup.
    3. `registerDependencies()` is called to populate the dependency container.
- **Data Path**: 
    - **Input**: `deltaTime` (number) passed to `update`.
    - **Processing**: The engine delegates the `deltaTime` to the `scene.update()` method.
    - **Output**: The engine triggers `scene.draw()` via the `render()` method to output visual data to the canvas.
- **Conditional Branching**:
    - **Scene Presence**: The `update`, `render`, and `destroy` methods use optional chaining (`?.`) to ensure logic only executes if a `scene` has been loaded via `loadScene`.
    - **Focus State**: `handleFocusChange` evaluates `document.visibilityState` to toggle `isTabActive`.

## 5. Resource Dependencies
- **Standard Libraries**: `HTMLCanvasElement` (Web API)
- **Internal Modules**: 
    - [Scene](/AgentDocs/entities/scene.md)
    - [DependencyManager](/AgentDocs/managers/dependency-manager.md)
    - [EngineEventManager](/AgentDocs/managers/engine-event-manager.md)
- **External Packages**: None identified.