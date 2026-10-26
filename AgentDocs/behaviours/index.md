## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | Behaviours Index |
| Source file | index.ts |

The **Behaviours Index** serves as the central aggregation point and public API gateway for the behaviours subsystem within the engine. It functions as a barrel file, consolidating various logic modules that define how entities and cameras interact with the engine's simulation and rendering loops.

**Functional Mission**
The primary responsibility of **Behaviours Index** is to provide a unified export interface for all behavioral logic components. It solves the problem of fragmented imports by allowing downstream modules to access the entire suite of entity-driven logicranging from rendering controllers to camera movement systemsthrough a single entry point.

**System Context & Integration**
This component acts as the structural backbone for the behaviours directory. It facilitates the integration of specialized logic such as [Renderer Behaviour](/AgentDocs/behaviours/renderer/renderer-behaviour.md), [Mesh Renderer Behaviour](/AgentDocs/behaviours/renderer/mesh-renderer-behaviour.md), and [Skybox Renderer](/AgentDocs/behaviours/renderer/skybox-renderer.md) into the broader entity system. By exporting [Entity Behaviour](/AgentDocs/behaviours/entity-behaviour.md) and [Camera Fly Behaviour](/AgentDocs/behaviours/camera-fly-behaviour.md), it enables the engine to attach dynamic, stateful logic to [Entity](/AgentDocs/entities/entity.md) objects, bridging the gap between static data structures and active runtime execution.

## 2. Environment & Configuration
**Environment Lookups:**
No environment lookups identified.

**Hardcoded Constants:**
No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `renderer-behaviour` | Export | Provides base rendering logic for entities. |
| `mesh-renderer-behaviour` | Export | Provides mesh-specific rendering logic. |
| `skybox-renderer` | Export | Provides skybox rendering capabilities. |
| `entity-behaviour` | Export | Provides the base class/interface for all entity behaviours. |
| `camera-fly-behaviour` | Export | Provides camera movement and control logic. |

## 4. Execution Logic & Flow
Direct exports or structural definitions only; no internal logic flow.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [Renderer Behaviour](/AgentDocs/behaviours/renderer/renderer-behaviour.md)
    - [Mesh Renderer Behaviour](/AgentDocs/behaviours/renderer/mesh-renderer-behaviour.md)
    - [Skybox Renderer](/AgentDocs/behaviours/renderer/skybox-renderer.md)
    - [Entity Behaviour](/AgentDocs/behaviours/entity-behaviour.md)
    - [Camera Fly Behaviour](/AgentDocs/behaviours/camera-fly-behaviour.md)
- **External Packages**: None identified.