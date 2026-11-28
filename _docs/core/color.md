## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **Color** | [src/core/color.ts](/src/core/color.ts) |

This component defines the `Color` class, which encapsulates color data using RGBA values stored internally as a `gl-matrix` `vec4`. Its primary responsibility is to provide type-safe accessors (getters/setters) for the individual color components (r, g, b, a) and to offer utility methods for color manipulation, such as interpolation and conversion to other vector types.

The `Color` class serves as a core data model within the application's rendering or graphics pipeline. It inherits from [JsonSerializable](/src/core/json-serializable.md), allowing instances to be easily serialized to and deserialized from JSON data structures, fitting into the application's persistence or network communication layer alongside other data entities like [JsonSerializedData](/src/interfaces/json-serialized-data.md).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `Color` | Class | Represents an RGBA color, inheriting from [JsonSerializable](/src/core/json-serializable.md). |
| `Color.className` | Static Property | Returns the string identifier "Color" for serialization purposes. |
| `Color.createFromJsonData` | Static Method | Constructs a new `Color` instance by deserializing data from a `JsonSerializedData` object. |
| `r` | Getter/Setter | Accessor for the red component (index 0 of the internal vector). |
| `g` | Getter/Setter | Accessor for the green component (index 1 of the internal vector). |
| `b` | Getter/Setter | Accessor for the blue component (index 2 of the internal vector). |
| `a` | Getter/Setter | Accessor for the alpha component (index 3 of the internal vector). |
| `constructor` | Constructor | Initializes a `Color` instance, defaulting to white (1, 1, 1, 1) if no arguments are provided. |
| `toJsonObject` | Method | Serializes the current color state into a `JsonSerializedData` object. |
| `fromJson` | Method | Deserializes the color state from a provided `JsonSerializedData` object. |
| `toVec3` | Method | Converts the RGBA color to a `gl-matrix` `vec3` containing only the RGB components. |
| `toVec4` | Method | Returns the internal `gl-matrix` `vec4` representation of the color. |
| `clone` | Method | Creates and returns a new `Color` instance with identical values to the current instance. |
| `set` | Method | Mutates the color's RGBA values using provided parameters, defaulting to white if none are given. |
| `lerp` | Static Method | Performs linear interpolation between two `Color` instances based on a factor $t$. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The class manages color state using a private `vec4` from `gl-matrix`. Component accessors provide direct read/write access to the underlying vector indices. Serialization involves mapping the internal vector components to named properties (`r`, `g`, `b`, `a`) for JSON representation. Interpolation (`lerp`) utilizes `vec4.lerp` from `gl-matrix` to compute the resulting color vector.
- **Side Effects:** None. The class operates entirely on its internal state and returns new instances or vectors without external I/O.
- **Error Handling:** None explicitly implemented; relies on standard JavaScript/TypeScript runtime behavior for invalid input types during deserialization.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [JsonSerializable](/src/core/json-serializable.md), [JsonSerializedData](/src/interfaces/json-serialized-data.md)