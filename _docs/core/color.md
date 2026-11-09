## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| Color | /core/color.md |

This component defines the `Color` class, which encapsulates color information using RGBA values represented by a `gl-matrix` `vec4`. Its primary responsibility is to provide a robust, mathematically sound representation of color, allowing for standard manipulation operations like linear interpolation (`lerp`) and component access/modification. It ensures that color values are consistently managed as floating-point numbers between 0.0 and 1.0.

The `Color` class serves as a core data model within the application's rendering and asset pipeline. It implements `JsonSerializable` to allow colors to be persisted and loaded from external data sources, fitting into the application's serialization layer alongside other data structures like [JsonSerializedData](/interfaces/json-serialized-data.md). It is heavily utilized by systems that require color definitions, such as material properties or lighting calculations.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| Color | Class | Represents an RGBA color, backed by a `vec4`. Supports serialization and mathematical operations. |
| Color.className | Static Property | Returns the string identifier "Color" for serialization purposes. |
| Color.createFromJsonData | Static Method | Constructs a new `Color` instance by deserializing data from a `JsonSerializedData` object. |
| r | Getter/Setter | Accessor for the red component (0.0 to 1.0). |
| g | Getter/Setter | Accessor for the green component (0.0 to 1.0). |
| b | Getter/Setter | Accessor for the blue component (0.0 to 1.0). |
| a | Getter/Setter | Accessor for the alpha component (0.0 to 1.0). |
| constructor | Constructor | Initializes a new `Color` instance with optional RGBA values, defaulting to white opaque. |
| toJsonObject | Method | Serializes the current color state into a `JsonSerializedData` object. |
| fromJson | Method | Deserializes the color state from a provided `JsonSerializedData` object. |
| toVec3 | Method | Converts the color to a `gl-matrix` `vec3`, discarding the alpha channel. |
| toVec4 | Method | Returns the underlying `gl-matrix` `vec4` containing the RGBA components. |
| clone | Method | Creates and returns a deep copy of the current `Color` instance. |
| set | Method | Mutates the color by setting all RGBA components to specified values. |
| lerp | Static Method | Linearly interpolates between two `Color` instances using a factor $t$. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The class manages color state internally using a `vec4` from `gl-matrix`. Component accessors (`r`, `g`, `b`, `a`) provide direct read/write access to the underlying vector elements. Serialization relies on mapping the four components to a standard JSON structure. The `lerp` function utilizes `vec4.lerp` from `gl-matrix` to perform linear interpolation across all four components simultaneously.

- **Side Effects:** None. The class is self-contained and operates purely on its internal state (`this.vector`).

- **Error Handling:** None explicitly implemented; standard JavaScript/TypeScript type checking handles invalid inputs during construction or setting.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [JsonSerializable](/core/json-serializable.md), [JsonSerializedData](/interfaces/json-serialized-data.md)