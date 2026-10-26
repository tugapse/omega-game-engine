## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | CanvasViewport |
| Source file | canvas-viewport.ts |

The **CanvasViewport** class serves as a centralized, static repository for the current dimensions of the rendering surface. It acts as a single source of truth for the viewport's spatial extent, ensuring that all engine subsystems have immediate access to the current width and height of the canvas without requiring complex dependency injection or event-driven polling for every read operation.

**Functional Mission**
The primary responsibility of **CanvasViewport** is to provide a globally accessible state for the renderer's dimensions. It solves the problem of dimension synchronization across disparate engine modules, providing a lightweight mechanism to store and retrieve the `rendererWidth` and `rendererHeight` as they change during window resizing or canvas scaling events.

**System Context & Integration**
This component sits at the intersection of the windowing system and the rendering pipeline. While it does not manage the resize events itself, it is designed to be updated by a manager or a renderer behavior (such as [Renderer Behaviour](/AgentDocs/behaviours/renderer/renderer-behaviour.md)) whenever a resize occurs. Downstream modules, such as the [Camera UBO](/AgentDocs/core/camera-ubo.md) or various [Render Passes](/AgentDocs/core/render/pass/index.md), rely on these static values to calculate projection matrices, aspect ratios, and viewport scissor tests.

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `rendererWidth` (Default: `0`)  Initial width of the viewport.
- `rendererHeight` (Default: `0`)  Initial height of the viewport.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `CanvasViewport` | Class | Static container for viewport dimension state. |
| `rendererWidth` | static number | Holds the current horizontal dimension of the rendering surface. |
| `rendererHeight` | static number | Holds the current vertical dimension of the rendering surface. |

## 4. Execution Logic & Flow
- **Initialization**: The class is initialized with `rendererWidth` and `rendererHeight` set to `0`. As a static class, it requires no instantiation.
- **Data Path**: Direct exports or structural definitions only; no internal logic flow.
- **Conditional Branching**: Direct exports or structural definitions only; no internal logic flow.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - None identified.
- **External Packages**: None identified.