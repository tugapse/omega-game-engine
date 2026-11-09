## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| EntityBehaviour | behaviours/entity-behaviour.md |

This component defines the abstract base class for all entity behaviors within the engine. Its primary responsibility is to provide a standardized, extensible framework for attaching custom logic (scripts) to `SceneEntity` objects. It enforces a lifecycle structureincluding `initialize`, `update`, and `destroy`and manages serialization, ensuring that entity logic can be saved and loaded reliably.

Architecturally, `EntityBehaviour` acts as a core behavioral component within the entity-component-system (ECS) pattern. It integrates with the entity's `Transform` component for spatial awareness and adheres to the `JsonSerializable` interface, allowing it to be managed by the engine's persistence layer alongside other data structures like `SceneEntity`.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| EntityBehaviour | Class | Base class for entity behaviors, providing lifecycle management and serialization hooks. |
| EntityBehaviour.instanciate | Static Method | Factory method to create a new instance of the behaviour. |
| EntityBehaviour.active | Property | Boolean flag indicating if the behaviour should be processed during updates. |
| EntityBehaviour.renderLayer | Property | Defines the rendering order for the behaviour's associated entity. |
| EntityBehaviour.parent | Property | Reference to the `SceneEntity` this behaviour is attached to. |
| EntityBehaviour.transform | Getter | Provides read-only access to the parent entity's `Transform` component. |
| EntityBehaviour.initialize | Method | Called once upon attachment to set up the behaviour. |
| EntityBehaviour.update | Method | Called every frame for active behaviours, accepting elapsed time. |
| EntityBehaviour.updateEditor | Method | Called every frame specifically when the engine is in editor mode. |
| EntityBehaviour.draw | Method | Hook for drawing debugging visualizations associated with the behaviour. |
| EntityBehaviour.destroy | Method | Called when the behaviour is removed or the entity is destroyed to clean up resources. |
| EntityBehaviour.toJsonObject | Method | Serializes the current state of the behaviour into a `JsonSerializedData` object. |
| EntityBehaviour.fromJson | Method | Deserializes the behaviour's state from a `JsonSerializedData` object. |
| EntityBehaviour.clone | Method | Creates a deep copy of the behaviour instance, allowing for state duplication. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The class manages state transitions through lifecycle methods. Initialization sets the `_initialized` flag. Updates are conditionally executed based on the `active` flag. Serialization relies on `super.toJsonObject()` and `super.fromJson()` to handle base class data, while overriding methods explicitly manage `active` and `uuid`.
- **Side Effects:** Mutates internal state (`active`, `_initialized`, `_uuid`) and relies on the `parent` entity's state (e.g., accessing `parent?.transform`).
- **Error Handling:** No explicit exception handling is implemented; methods rely on the caller or the underlying framework to manage errors during initialization or deserialization.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `uuid`
- **Internal:** [Transform](/core/transform.md), [SceneEntity](/entities/entity.md), [JsonSerializable](/core/json-serializable.md), [JsonSerializedData](/interfaces/json-serialized-data.md), [RenderLayer](/enums/render-layer.md)