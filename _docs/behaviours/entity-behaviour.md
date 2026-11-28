## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **EntityBehaviour** | [src/behaviours/entity-behaviour.ts](/src/behaviours/entity-behaviour.ts) |

This component defines the abstract base class for all behavioral components that can be attached to a `SceneEntity`. Its primary responsibility is to provide a standardized lifecycle management system—including `initialize`, `update`, and `destroy`—for custom entity scripts. It enforces serialization capabilities via inheritance from `JsonSerializable`, allowing behaviors to be saved and loaded reliably.

Architecturally, `EntityBehaviour` acts as a core behavioral service layer within the engine. It connects the entity's state (via `SceneEntity` and its `Transform` component) to runtime logic. Subclasses implement specific game logic, while the base class handles boilerplate concerns like UUID generation, activity tracking, and data persistence, fitting into the engine's component-based architecture.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `EntityBehaviour` | Class | Base class for entity behaviors, inheriting from [JsonSerializable](/src/core/json-serializable.md). |
| `EntityBehaviour.instanciate` | Static Method | Factory method to create a new instance of the behaviour. |
| `active` | Property | Boolean indicating if the behaviour is currently active and should receive updates. |
| `renderLayer` | Property | Specifies the rendering order of the entity, using the [RenderLayer](/src/enums.md) enum. |
| `parent` | Property | Reference to the `SceneEntity` this behaviour is attached to. |
| `transform` | Getter | Returns the `Transform` component of the parent entity for positional access. |
| `initialize` | Method | Called once upon attachment to set up the behaviour state. |
| `update` | Method | Called every frame for active behaviours, accepting elapsed time. |
| `updateEditor` | Method | Called every frame specifically when the engine is running in editor mode. |
| `draw` | Method | Provides a hook for drawing debugging visualizations associated with the behaviour. |
| `destroy` | Method | Cleans up all resources held by the behaviour before it is removed. |
| `toJsonObject` | Method | Serializes the current state of the behaviour into a `JsonSerializedData` object. |
| `fromJson` | Method | Deserializes the behaviour's state from a provided `JsonSerializedData` object. |
| `clone` | Method | Creates a deep copy of the behaviour instance, intended for subclass override. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The class manages the lifecycle flow: initialization sets `_initialized` to true; `update` is conditionally executed based on the `active` flag. Serialization relies on merging base class data with specific properties like `active` and `uuid`.
- **Side Effects:** Mutates internal state (`active`, `_initialized`, `_uuid`). The constructor calls `uuidv4()` to generate a unique identifier, which is a form of external state generation.
- **Error Handling:** No explicit exception handling is present; methods rely on the caller to manage state transitions correctly.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `uuid` (for `uuidv4`)
- **Internal:** [Transform](/src/core/transform.md), [SceneEntity](/src/entities/entity.md), [JsonSerializable](/src/core/json-serializable.md), [JsonSerializedData](/src/interfaces/json-serialized-data.md), [RenderLayer](/src/enums.md)