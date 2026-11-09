## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| JsonSerializable | core/json-serializable |

This component provides an abstract base class, `JsonSerializable`, designed to enforce a standardized mechanism for converting complex application objects into a serializable JSON format and back again. Its primary responsibility is to manage the metadata (like `className` and `uuid`) and provide recursive logic to handle various data types, including primitives, plain objects, and custom objects that implement serialization hooks.

This class serves as a foundational data model utility within the application's core architecture. It acts as a contract for any object that needs to persist its state across sessions or network boundaries, integrating deeply with the data persistence layer by leveraging helper methods like `serializeAutomatically` and `deserializeAutomatically` to manage the serialization lifecycle.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| JsonSerializable | Class | Abstract base class for objects capable of JSON serialization/deserialization. |
| className | Getter | Returns the class name of the object instance. |
| uuid | Getter | Returns the unique identifier (UUID) of the object instance. |
| toJsonObject | Method | Creates a base JSON object containing identifying properties. |
| fromJson | Method | Deserializes the object from a JSON data structure, setting name and UUID. |

## 3. Implementation Details & Side Effects
- **Core Logic:** Serialization is handled by `loopAndSaveProperties`, which recursively traverses object properties. It applies specific rules: primitives are passed through, objects with a `toJsonObject` method are called, and plain objects are recursively converted into a structured `JsonSerializedData`. Deserialization uses `populateProperties` to map keys from the source JSON onto the target instance, respecting custom `fromJson` methods on properties.
- **Side Effects:** The constructor generates a new UUID using `uuidV4()`, which is a side effect of object instantiation.
- **Error Handling:** The constructor explicitly throws an `Error` if `className` is not provided.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `uuid`
- **Internal:** [json-serialized-data](/interfaces/json-serialized-data.md)