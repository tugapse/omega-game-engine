## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | SceneEntity |
| Source file | entity.ts |

The **SceneEntity** class serves as the fundamental building block for all interactive and visual objects within the engine's simulation environment. It acts as a container that unifies spatial data, lifecycle management, and modular logic through a component-based architecture.

**Functional Mission**
The primary responsibility of **SceneEntity** is to provide a unified interface for managing an object's existence within a scene. It solves the problem of object composition by allowing developers to attach various behaviors to a single entity, effectively decoupling specific logic (like physics or rendering) from the core identity of the object.

**System Context & Integration**
As a core component of the entity system, **SceneEntity** integrates deeply with the [Transform](/AgentDocs/core/transform.md) for spatial positioning and the [Scene](/AgentDocs/entities/scene.md) for lifecycle and hierarchy management. It acts as a host for [EntityBehaviour](/AgentDocs/behaviours/entity-behaviour.md) instances, which drive the entity's specific functionality during the `update` and `draw` loops. Furthermore, it implements [JsonSerializable](/AgentDocs/core/json-serializable.md) to facilitate state persistence and reconstruction via the engine's serialization pipeline.

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `name` (Default: `'Entity'`)  Default identifier for new entities.
- `tag` (Default: `'Entity'`)  Default grouping identifier.
- `entityType` (Default: `EntityType.STATIC`)  Default physical/logical classification.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `instanciate` | Static Method | Factory method to create a new `SceneEntity` with a guaranteed `Transform`. |
| `initialize` | Method | Triggers the setup phase for the entity and all attached behaviours. |
| `update` | Method | Executes per-frame logic for the entity and its active behaviours. |
| `draw` | Method | Executes per-frame rendering commands for all active behaviours. |
| `destroy` | Method | Performs cleanup by invoking destruction logic on all attached behaviours. |
| `addBehaviour` | Method | Attaches a new [EntityBehaviour](/AgentDocs/behaviours/entity-behaviour.md) and initializes it. |
| `removeBehaviour` | Method | Detaches and destroys a specific behaviour. |
| `getBehaviours` | Generic Method | Filters and returns all behaviours matching a specific constructor. |
| `getBehaviour` | Generic Method | Returns the first behaviour matching a specific constructor. |
| `fromJson` | Method | Overridden to reconstruct entity state from [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md). |
| `toJsonObject` | Method | Overridden to export entity and behaviour state for serialization. |
| `clone` | Method | Creates a deep copy of the entity using serialization/deserialization. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. The `constructor` assigns the name and `Transform`, linking the transform's `parentEntity` back to the entity.
    2. `initialize()` is called, which iterates through the `behaviours` array to call `initialize()` on each, resets the `destroyed` flag, and performs an initial `update(0)`.
- **Data Path (Update/Draw Loop)**:
    1. **Input**: The engine calls `update(ellapsed)` or `draw()`.
    2. **Processing**: 
        - If `active` is false, the process terminates.
        - `update` triggers `transform.updateMatrices()`.
        - The entity filters its `behaviours` array to include only those where `active === true`.
    3. **Output**: Behaviours execute their respective `update` or `draw` logic.
- **Conditional Branching**:
    - **Active Check**: If `this.active` is false, `update` and `draw` operations are bypassed.
    - **Behaviour Filtering**: Logic only applies to behaviours that pass the `b.active` check.
    - **Type Checking**: `instanciate` validates if the provided `transform` is a valid instance of `Transform`.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [EntityBehaviour](/AgentDocs/behaviours/entity-behaviour.md)
    - [JsonSerializable](/AgentDocs/core/json-serializable.md)
    - [Transform](/AgentDocs/core/transform.md)
    - [EntityType](/AgentDocs/enums/entity-type.enum.md)
    - [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md)
- **External Packages**: None identified.