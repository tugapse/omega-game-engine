## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | SceneEntityBehaviour |
| Source file | scene-behaviour.ts |

The **SceneEntityBehaviour** interface serves as a specialized contract for entity logic that requires precise synchronization with the engine's main execution loop. While standard entity behaviours may only require a basic update, this interface extends that capability by providing hooks that wrap the core engine cycles, allowing for logic to be executed specifically before or after updates and draw calls.

**Functional Mission**
The primary responsibility of **SceneEntityBehaviour** is to provide a structured lifecycle for complex entity behaviors that must interact with the temporal and visual stages of the engine. It solves the problem of execution ordering, ensuring that state changes (updates) and visual preparations (draws) occur in a deterministic sequence relative to the main engine loop.

**System Context & Integration**
This component acts as a bridge between the core engine loop and individual entity logic. It extends the base [EntityBehaviour](/AgentDocs/behaviours/entity-behaviour.md) to allow for more granular control. Downstream, the engine's scene management or rendering systems can query for this interface to trigger specialized lifecycle methods, ensuring that "pre-update" logic (like input processing or physics preparation) and "post-draw" logic (like cleanup or debug overlays) are executed at the correct architectural moment.

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `SceneEntityBehaviour` | Interface | Defines the extended lifecycle contract for scene-aware entities. |
| `beforeUpdate` | Method | Executes logic immediately before the main update loop; receives elapsed time. |
| `afterUpdate` | Method | Executes logic immediately after the main update loop completes. |
| `beforeDraw` | Method | Executes logic immediately before the main draw call is issued. |
| `afterDraw` | Method | Executes logic immediately after the main draw call completes. |

## 4. Execution Logic & Flow
Direct exports or structural definitions only; no internal logic flow.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [EntityBehaviour](/AgentDocs/behaviours/entity-behaviour.md)
- **External Packages**: None identified.