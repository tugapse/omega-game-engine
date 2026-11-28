## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **Engine** | [src/engine.ts](/src/engine.ts) |

This component serves as the primary orchestrator and entry point for the entire application engine. Its core responsibility is to manage the lifecycle of the application, from initial setup and dependency resolution to the continuous loop of updating and rendering the active scene. It encapsulates the state necessary for the engine's operation, including focus states and the currently active scene.

Architecturally, the `Engine` acts as the central controller or service layer. It initializes and coordinates critical sub-systems such as the [DependencyManager](/src/managers/dependency-manager.md) and the [EngineEventManager](/src/managers/engine-event-manager.md). It delegates scene-specific logic to the active [Scene](/src/entities/scene.md) instance, ensuring that all core components are properly initialized and integrated before the main loop begins.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `Engine` | Class | The main engine class responsible for initialization, scene management, and lifecycle control. |
| `currentScene` | Getter | Returns the currently loaded [Scene](/src/entities/scene.md) instance. |
| `initialize(canvas: HTMLCanvasElement): void` | Method | Sets up the core engine infrastructure, including the [EngineEventManager](/src/managers/engine-event-manager.md), using the provided HTML canvas context. |
| `registerDependencies(): void` | Method | Triggers the registration of all necessary core dependencies via the [DependencyManager](/src/managers/dependency-manager.md). |
| `loadScene(scene: Scene): void` | Method | Sets the active scene, initializes it, and makes it available for updates and rendering. |
| `update(deltaTime: number): void` | Method | Calls the update method on the current scene, passing the time elapsed since the last frame. |
| `render(): void` | Method | Calls the draw method on the current scene to render the current state to the canvas. |
| `destroy(): void` | Method | Initiates the cleanup process for the currently active scene. |
| `handleFocusChange(isFocused: boolean): void` | Method | Updates the engine's focus state based on external events, adjusting internal flags like `isFocused` and `isTabActive`. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The engine maintains state flags (`isFocused`, `isTabActive`, `isWindowFocused`) which are updated synchronously when `handleFocusChange` is called. Initialization involves instantiating the `DependencyManager` and `EngineEventManager`. The main loop methods (`update`, `render`, `destroy`) rely on optional chaining (`?.`) to safely execute methods on the currently assigned `scene` instance.
- **Side Effects:** The `initialize` method interacts with the external DOM environment by accepting and utilizing an `HTMLCanvasElement`. The `handleFocusChange` method reads the global `document.visibilityState`.
- **Error Handling:** The use of optional chaining (`?.`) in `update`, `render`, and `destroy` provides a fallback mechanism, ensuring that if `this.scene` is null or undefined, the engine methods execute without throwing runtime errors.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [Scene](/src/entities/scene.md), [DependencyManager](/src/managers/dependency-manager.md), [EngineEventManager](/src/managers/engine-event-manager.md), [Resources](/src/core/resources/resources.md), [ResourceManager](/src/core/resources/resource-manager.md)