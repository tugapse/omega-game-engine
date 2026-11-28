## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **SceneEntity** | [src/entities/entity.ts](/src/entities/entity.ts) |

This component defines `SceneEntity`, the fundamental base class for all objects existing within the engine's scene graph. Its primary responsibility is to encapsulate an entity's core properties—such as its name, transform, active state, and rendering visibility—and to manage the lifecycle of attached behaviors. It provides mechanisms for initialization, updating, drawing, and destruction, ensuring entities behave predictably within the simulation loop.

Architecturally, `SceneEntity` serves as a core data model component within the engine's scene management system. It inherits from [JsonSerializable](/core/json-serializable.md) to facilitate persistence, allowing entities to be serialized to and deserialized from JSON data. It integrates with [Transform](/core/transform.md) for spatial representation and manages collections of [EntityBehaviour](/behaviours/entity-behaviour.md) instances, effectively acting as the container for entity logic.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `SceneEntity.instanciate` | Static Method | Creates a new `SceneEntity` instance, optionally providing a `Transform`. Defaults to creating a new `Transform` if none is supplied. |
| `SceneEntity.className` | Static Property | Returns the string identifier 'SceneEntity' for the class. |
| `SceneEntity.type` | Getter | Returns the name of the class as a string, identifying the entity type. |
| `SceneEntity.addBehaviour` | Method | Attaches a new `EntityBehaviour` to the entity, initializing it and adding it to the internal collection. |
| `SceneEntity.removeBehaviour` | Method | Removes a specified `EntityBehaviour` from the entity, ensuring the behaviour is destroyed upon removal. |
| `SceneEntity.getBehaviours` | Method | Filters the entity's behaviours to return an array of behaviours matching the provided constructor type. |
| `SceneEntity.getBehaviour` | Method | Finds and returns the first behaviour matching the provided constructor type, or `undefined` if none is found. |
| `SceneEntity.fromJson` | Method | Deserializes the entity's state from a `JsonSerializedData` object, overriding the base class method. |
| `SceneEntity.toJsonObject` | Method | Serializes the entity's current state into a `JsonSerializedData` object, including serialized behaviours. |
| `SceneEntity.clone` | Method | Creates a deep copy of the current `SceneEntity` instance by serializing and deserializing its state. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The entity lifecycle is managed through `initialize()`, which triggers initialization on all attached behaviours. The `update(ellapsed)` method iterates over active behaviours, calling their respective `update` methods after updating the entity's `Transform` matrices. Serialization (`toJsonObject`) recursively maps behaviours to their serializable forms.
- **Side Effects:** The `toJsonObject` method calls `console.debug` when serializing behaviours.
- **Error Handling:** The `removeBehaviour` method safely handles removal by checking if the index is valid before splicing and calling `destroy()` on the removed behaviour.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [EntityBehaviour](/behaviours/entity-behaviour.md), [JsonSerializable](/core/json-serializable.md), [Transform](/core/transform.md), [EntityType](/enums/entity-type.enum.md), [JsonSerializedData](/interfaces/json-serialized-data.md)