## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| SceneEntity | entities/entity.md |

This component defines the `SceneEntity` class, which serves as the fundamental building block for all objects within the game engine's scene graph. Its primary responsibility is to encapsulate an entity's identity, its spatial representation via a `Transform`, and its dynamic behavior through a collection of `EntityBehaviour` instances. It manages the lifecycle of these components, handling initialization, updating, and destruction.

Architecturally, `SceneEntity` acts as a core data model and runtime object within the engine's scene management system. It integrates serialization capabilities via `JsonSerializable` to persist entity states, and it relies heavily on the `Transform` component for spatial awareness and the `EntityBehaviour` system for defining entity logic.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| SceneEntity.instanciate | Static Method | Creates a new SceneEntity instance, optionally providing a pre-configured Transform. |
| SceneEntity.className | Static Property | Returns the canonical string name for the SceneEntity class. |
| SceneEntity.type | Getter | Returns the string name of the entity's class. |
| SceneEntity.addBehaviour | Method | Attaches a new `EntityBehaviour` to the entity, initializing it and adding it to the internal list. |
| SceneEntity.removeBehaviour | Method | Removes a specified `EntityBehaviour` from the entity, ensuring it is destroyed upon removal. |
| SceneEntity.getBehaviours | Method | Filters and returns an array of behaviours matching a specified constructor type. |
| SceneEntity.getBehaviour | Method | Finds and returns the first behaviour matching a specified constructor type. |
| SceneEntity.fromJson | Method | Deserializes the entity's state from a `JsonSerializedData` object. |
| SceneEntity.toJsonObject | Method | Serializes the entity's current state into a `JsonSerializedData` object. |
| SceneEntity.clone | Method | Creates a deep copy of the current entity instance, preserving its state. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The entity manages its state through lifecycle methods (`initialize`, `update`, `draw`, `destroy`). The `update` method ensures the entity's `Transform` matrices are updated before iterating over and calling `update` on all active behaviours. Serialization involves recursively calling `toJsonObject` on attached behaviours.
- **Side Effects:** Mutates the internal state of the entity and its attached behaviours. It logs debug information during serialization (`console.debug`).
- **Error Handling:** The `removeBehaviour` method safely handles removal by checking if the behaviour exists in the array before attempting to splice and destroy it.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [EntityBehaviour](/entities/entity-behaviour.md), [JsonSerializable](/core/json-serializable.md), [Transform](/core/transform.md), [EntityType](/enums/entity-type.enum.md), [JsonSerializedData](/interfaces/json-serialized-data.md)