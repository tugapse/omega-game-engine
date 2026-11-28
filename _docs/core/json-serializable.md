## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **JsonSerializable** | [src/core/json-serializable.ts](/src/core/json-serializable.ts) |

This component defines the abstract base class `JsonSerializable`, which provides a standardized contract for any object intended to be converted to and from a JSON representation. Its primary responsibility is managing the metadata (like `className` and `uuid`) and providing the core logic for recursive serialization and deserialization of object properties.

This class serves as a foundational data model layer within the application architecture. It dictates how concrete derived classes interact with persistence layers or network transport mechanisms that rely on JSON structures, ensuring consistency across different types of serializable entities, such as those defined in [../interfaces/json-serialized-data](/src/interfaces/json-serialized-data.md).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `JsonSerializable` | Class | Abstract base class providing serialization/deserialization hooks. |
| `className` | Getter | Returns the string identifier for the object's class name. |
| `uuid` | Getter | Returns the unique identifier assigned to the object instance. |
| `toJsonObject()` | Method | Serializes the current instance into a `JsonSerializedData` structure. |
| `fromJson(jsonObject: JsonSerializedData)` | Method | Deserializes the object's basic properties from a provided `JsonSerializedData` object. |

## 3. Implementation Details & Side Effects
- **Core Logic:** Serialization (`serializeAutomatically`) iterates over object keys, recursively processing values using `loopAndSaveProperties` to handle primitives, objects with `toJsonObject` methods, and plain objects. Deserialization (`populateProperties`) iterates over the JSON structure, applying values directly or invoking a `fromJson` method on target properties if available.
- **Side Effects:** The constructor calls `uuidV4()` from the `uuid` package, which generates a unique identifier, thus mutating the instance state.
- **Error Handling:** The constructor explicitly throws an `Error` if `className` is not provided.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `uuid`
- **Internal:** [../interfaces/json-serialized-data](/src/interfaces/json-serialized-data.md)