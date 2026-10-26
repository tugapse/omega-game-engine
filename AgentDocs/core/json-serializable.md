## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | JsonSerializable |
| Source file | json-serializable.ts |

The **JsonSerializable** class serves as the foundational abstraction for state persistence and reconstruction within the engine. It provides a standardized mechanism for converting complex object graphs into plain JSON-compatible data structures and, conversely, rehydrating those structures back into live class instances.

**Functional Mission**
The primary responsibility of **JsonSerializable** is to solve the problem of object state volatility. By providing automated serialization and deserialization logic, it ensures that any entity or data object within the engine can be saved to or loaded from a persistent format without requiring manual, error-prone mapping for every individual property.

**System Context & Integration**
This component acts as a middleware layer for data transformation. It is designed to be inherited by nearly all high-level engine objects, such as [Entity](/AgentDocs/entities/entity.md), [Color](/AgentDocs/core/color.md), or [NumberRange](/AgentDocs/core/range.md). During the serialization flow, it traverses object properties, delegating specialized logic to objects that implement their own `toJsonObject` or `fromJson` methods. During deserialization, it facilitates the reconstruction of the object hierarchy, ensuring that metadata like `className` and `uuid` are preserved to maintain identity and type integrity across sessions.

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `_serializationIgnoreKeys` (Default: `['_serializationIgnoreKeys', 'scene', 'parent']`)  Defines internal properties and runtime references that must be excluded from the serialized output to prevent circular dependencies or invalid state.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `className` | Getter | Returns the string identifier used for type reconstruction. |
| `uuid` | Getter | Returns the unique identifier for the specific instance. |
| `toJsonObject` | Method | The public entry point for converting the instance into a `JsonSerializedData` object. |
| `fromJson` | Method | The public entry point for populating the instance from a `JsonSerializedData` object. |
| `serializeAutomatically` | Method | (Protected) Iterates through instance keys to build a serialized object, skipping ignored keys. |
| `deserializeAutomatically` | Method | (Protected) Orchestrates the recursive population of instance properties from JSON data. |
| `loopAndSaveProperties` | Method | (Private) Recursively processes values, handling primitives, custom `toJsonObject` calls, and plain objects. |
| `populateProperties` | Method | (Private) Recursively maps JSON keys to target object properties, respecting `fromJson` interfaces. |

## 4. Execution Logic & Flow
- **Initialization**: 
    - The constructor requires a `className` string.
    - Generates a new `uuid` using `uuidV4`.
    - Initializes the `_serializationIgnoreKeys` list to protect internal engine references.
- **Data Path (Serialization)**:
    1. `toJsonObject()` is called.
    2. `serializeAutomatically()` iterates over all keys in `this`.
    3. For each key, `loopAndSaveProperties(value)` is invoked.
    4. `loopAndSaveProperties` checks:
        - If primitive $\rightarrow$ return value.
        - If object has `toJsonObject` $\rightarrow$ call it.
        - If plain object $\rightarrow$ recurse.
        - Otherwise $\rightarrow$ return `undefined`.
    5. The resulting object is merged with base metadata (`type`, `name`, `className`, `uuid`).
- **Data Path (Deserialization)**:
    1. `fromJson(jsonObject)` is called.
    2. Base properties (`name`, `uuid`) are assigned directly.
    3. Subclasses call `deserializeAutomatically(jsonObject)`.
    4. `deserializeAutomatically` strips base keys and ignored keys from a copy of the data.
    5. `populateProperties(target, source)` is called:
        - If source value is primitive $\rightarrow$ direct assignment.
        - If target property has `fromJson` $\rightarrow$ call `targetProperty.fromJson(sourceValue)`.
        - If target property is a plain object $\rightarrow$ recurse.
        - Else $\rightarrow$ direct assignment (POD fallback).

## 5. Resource Dependencies
- **Standard Libraries**: `uuid`
- **Internal Modules**: 
    - [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md)
- **External Packages**: `uuid`