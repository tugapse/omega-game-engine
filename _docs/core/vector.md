## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **Vector2, Vector3, Vector4** | [src/core/vector.ts](/src/core/vector.ts) |

This component provides a set of classes (`Vector2`, `Vector3`, `Vector4`) to represent fixed-dimension mathematical vectors, leveraging the `gl-matrix` library for underlying storage. These classes wrap the native vector types (`vec2`, `vec3`, `vec4`) to provide a typed, object-oriented interface in TypeScript, offering component-wise access (e.g., `.x`, `.y`, `.z`).

These vector classes form a fundamental part of the application's data model, specifically handling spatial or directional data. They implement serialization/deserialization logic via `JsonSerializable`, allowing vector states to be reliably persisted and loaded from JSON structures, integrating them seamlessly with the data persistence layer.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `Vector2` | Class | Represents a 2D vector, inheriting from `JsonSerializable`. Provides getters/setters for `x` and `y`. |
| `Vector2.className` | Static Property | Returns the string identifier "Vector2". |
| `Vector2.vector` | Getter | Returns the underlying `vec2` instance. |
| `Vector2.x` | Getter/Setter | Accessor for the x-component. |
| `Vector2.y` | Getter/Setter | Accessor for the y-component. |
| `Vector2.constructor` | Constructor | Creates a new `Vector2` instance, defaulting to (0, 0). |
| `Vector2.fromJson` | Method | Deserializes the vector state from a `JsonSerializedData` object. |
| `Vector2.toJsonObject` | Method | Serializes the vector state into a `JsonSerializedData` object. |
| `Vector2.set` | Method | Sets both the x and y components of the vector. |
| `Vector3` | Class | Represents a 3D vector, inheriting from `Vector2`. Provides getters/setters for `x`, `y`, and `z`. |
| `Vector3.className` | Static Property | Returns the string identifier "Vector3". |
| `Vector3.vector` | Getter | Returns the underlying `vec3` instance. |
| `Vector3.x` | Getter/Setter | Accessor for the x-component. |
| `Vector3.y` | Getter/Setter | Accessor for the y-component. |
| `Vector3.z` | Getter | Accessor for the z-component. |
| `Vector3.z` | Setter | Mutator for the z-component. |
| `Vector3.constructor` | Constructor | Creates a new `Vector3` instance, defaulting to (0, 0, 0). |
| `Vector3.fromJson` | Method | Deserializes the vector state from a `JsonSerializedData` object. |
| `Vector3.toJsonObject` | Method | Serializes the vector state into a `JsonSerializedData` object. |
| `Vector3.set` | Method | Sets the x, y, and z components of the vector. |
| `Vector4` | Class | Represents a 4D vector, inheriting from `Vector3`. Provides getters/setters for `x`, `y`, `z`, and `w`. |
| `Vector4.className` | Static Property | Returns the string identifier "Vector4". |
| `Vector4.vector` | Getter | Returns the underlying `vec4` instance. |
| `Vector4.x` | Getter/Setter | Accessor for the x-component. |
| `Vector4.y` | Getter/Setter | Accessor for the y-component. |
| `Vector4.z` | Getter/Setter | Accessor for the z-component. |
| `Vector4.w` | Getter/Setter | Accessor for the w-component. |
| `Vector4.constructor` | Constructor | Creates a new `Vector4` instance, defaulting to (0, 0, 0, 0). |
| `Vector4.fromJson` | Method | Deserializes the vector state from a `JsonSerializedData` object. |
| `Vector4.toJsonObject` | Method | Serializes the vector state into a `JsonSerializedData` object. |
| `Vector4.set` | Method | Sets the x, y, z, and w components of the vector. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The classes implement inheritance chains (`Vector2` -> `Vector3` -> `Vector4`) to progressively add dimensions. State is managed internally using `gl-matrix` types (`vec2`, `vec3`, `vec4`) stored in a protected `_vec` property. Component accessors (`x`, `y`, etc.) delegate to the underlying array structure of the `gl-matrix` type. Serialization/deserialization methods handle mapping the object's state to and from the `JsonSerializedData` structure.
- **Side Effects:** None. The operations are purely computational and data transformation based on the internal state.
- **Error Handling:** No explicit error handling (try/catch blocks) is present; operations rely on the input data conforming to the expected structure defined by `JsonSerializedData`.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [../interfaces](/../interfaces.md), [./json-serializable](/./json-serializable.md)