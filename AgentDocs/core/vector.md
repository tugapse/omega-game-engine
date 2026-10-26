## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | Vector Math Suite |
| Source file | vector.ts |

The **Vector Math Suite** provides a hierarchical set of mathematical primitives used for spatial representation and linear algebra operations within the engine. By wrapping `gl-matrix` types, it provides a high-level, object-oriented interface for manipulating 2D, 3D, and 4D vectors while maintaining the performance benefits of typed arrays.

**Functional Mission**
The primary responsibility of this file is to provide standardized, serializable vector classes (**Vector2**, **Vector3**, and **Vector4**). It solves the problem of bridging the gap between raw, high-performance buffer-backed math operations (via `gl-matrix`) and the engine's requirement for structured, JSON-serializable data objects used in scene descriptions and state persistence.

**System Context & Integration**
This component serves as a fundamental utility layer. It is consumed by higher-level spatial modules such as [Transform](/AgentDocs/core/transform.md), [Bounding Box](/AgentDocs/core/bounding-box.md), and [Camera UBO](/AgentDocs/core/camera-ubo.md). Because these classes implement [JsonSerializable](/AgentDocs/core/json-serializable.md), they facilitate the seamless transition of spatial state from memory to disk/network via [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md).

- **INTERNAL REFERENCES**: [JsonSerializable](/AgentDocs/core/json-serializable.md), [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md).

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `Vector2` | Class | Represents a 2D vector with `x` and `y` components. |
| `Vector3` | Class | Represents a 3D vector with `x`, `y`, and `z` components; extends `Vector2`. |
| `Vector4` | Class | Represents a 4D vector with `x`, `y`, `z`, and `w` components; extends `Vector3`. |
| `vector` | Getter | Returns the underlying `gl-matrix` typed array for direct math operations. |
| `set(x, y, [z, w])` | Method | Updates all components of the vector simultaneously. |
| `toJsonObject()` | Method | Converts the vector state into a [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md) object. |
| `fromJson(json)` | Method | Reconstitutes vector components from a [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md) object. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. The constructor accepts optional numeric arguments for components (defaulting to 0).
    2. `super()` is called to initialize the `JsonSerializable` base.
    3. A `gl-matrix` specific vector (e.g., `vec3.fromValues`) is instantiated and stored in the protected `_vec` property.
- **Data Path (Serialization)**: 
    1. `toJsonObject()` is invoked.
    2. The method gathers component values (`x`, `y`, etc.).
    3. It returns a plain object containing the `className` and component values, compatible with [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md).
- **Data Path (Deserialization)**: 
    1. `fromJson(jsonObject)` is invoked.
    2. `super.fromJson(jsonObject)` is called to handle base class metadata.
    3. Component values are extracted from the `jsonObject` keys and assigned to the vector's properties, which updates the underlying `_vec` buffer.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [JsonSerializable](/AgentDocs/core/json-serializable.md)
    - [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md)
- **External Packages**: 
    - `gl-matrix` (Provides `vec2`, `vec3`, `vec4` implementations)