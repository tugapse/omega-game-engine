## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| Vector2 | core/vector.md |

This component provides a set of classes (`Vector2`, `Vector3`, `Vector4`) to represent fixed-dimension mathematical vectors, backed by the `gl-matrix` library. Its primary responsibility is to encapsulate vector operations and provide a strongly typed, object-oriented interface over the underlying raw array data, making vector manipulation safer and more intuitive in TypeScript.

These vector classes form a core part of the application's mathematical data model. They inherit from `JsonSerializable`, allowing them to be seamlessly converted to and from JSON structures, which is crucial for persistence and network serialization. They are fundamental building blocks used across various systems that require positional or directional data, such as rendering or physics.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| Vector2 | Class | Represents a 2D vector, supporting x and y components. |
| Vector2.x | Getter/Setter | Accessor for the x-component. |
| Vector2.y | Getter/Setter | Accessor for the y-component. |
| Vector3 | Class | Represents a 3D vector, extending Vector2 and supporting z. |
| Vector3.z | Getter/Setter | Accessor for the z-component. |
| Vector4 | Class | Represents a 4D vector, extending Vector3 and supporting w. |
| Vector4.w | Getter/Setter | Accessor for the w-component. |
| Vector2.set | Method | Sets both x and y components to specified values. |
| Vector3.set | Method | Sets x, y, and z components to specified values. |
| Vector4.set | Method | Sets x, y, z, and w components to specified values. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The classes wrap `gl-matrix` types (`vec2`, `vec3`, `vec4`). They implement getter/setter properties for individual components (x, y, z, w) which delegate to the underlying `gl-matrix` array. Serialization (`toJsonObject`) and deserialization (`fromJson`) methods manage the conversion between the object state and a standardized JSON structure, ensuring type integrity during data transfer.
- **Side Effects:** None. The operations are purely mathematical and data transformation based.
- **Error Handling:** No explicit error handling is implemented; operations rely on the underlying `gl-matrix` library for mathematical correctness.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** gl-matrix
- **Internal:** [JsonSerializedData](/interfaces.md), [JsonSerializable](/json-serializable.md)