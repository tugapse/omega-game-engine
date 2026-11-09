## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| SceneFog | core/scene-fog.md |

This component defines the `SceneFog` class, which encapsulates the parameters and logic for simulating atmospheric fog within a 3D scene. It manages various fog characteristics such as the fog type (linear, exponential, etc.), the distance at which fog begins, and its density. The primary responsibility is to provide a structured, serializable representation of fog effects that can be loaded and saved across different application states.

The `SceneFog` class functions as a core data model within the rendering pipeline, inheriting from `JsonSerializable`. It allows the fog configuration to be easily persisted to and loaded from JSON structures, integrating seamlessly with the application's serialization framework. It interacts with other core components like `Color` and `Colors` for defining the fog's visual appearance.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| FogType | Enum | Defines the mathematical model used for fog calculation: LINEAR, EXPONENTIAL, or EXPONEMTIAL_SQUARED. |
| SceneFog | Class | Represents the complete fog configuration for a scene, including enabling state, type, distance, density, and color. |
| toJsonObject | Method | Serializes the current state of the `SceneFog` instance into a `JsonSerializedData` object. |
| fromJson | Method | Deserializes the `SceneFog` instance from a provided `JsonSerializedData` object. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The class manages state through properties like `enabled`, `fogType`, `distance`, and `density`. The `toJsonObject` and `fromJson` methods handle the automatic serialization and deserialization of these properties using the base class functionality.
- **Side Effects:** None.
- **Error Handling:** None.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.

- **Internal:** [JsonSerializedData](/interfaces.md) [Color](/color.md) [Colors](/colors.md) [JsonSerializable](/json-serializable.md)