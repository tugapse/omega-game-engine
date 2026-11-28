## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **SceneFog** | [src/core/scene-fog.ts](/src/core/scene-fog.ts) |

This component defines the `SceneFog` class, which encapsulates the parameters necessary to simulate atmospheric fog within a rendering scene. It manages various aspects of the fog effect, including its type (linear, exponential, etc.), density, distance falloff, and color, allowing for customizable visual atmospheric effects.

As part of the application's data model, `SceneFog` implements `JsonSerializable`, making it capable of being persisted to and loaded from serialized data structures. It serves as a configuration object that dictates how the scene's rendering pipeline should apply volumetric fog effects.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `FogType` | Enum | Defines the mathematical model used for fog calculation: `LINEAR`, `EXPONENTIAL`, or `EXPONEMTIAL_SQUARED`. |
| `SceneFog` | Class | Represents the fog configuration object. It provides methods to serialize (`toJsonObject`) and deserialize (`fromJson`) its state. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The class manages state via properties like `distance`, `density`, and `color`. Serialization and deserialization are handled by overriding methods inherited from `JsonSerializable`, leveraging automatic serialization/deserialization helpers.
- **Side Effects:** None.
- **Error Handling:** None.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.
- **Internal:** [../interfaces](/src/core/interfaces.md), [./color](/src/core/color.md), [./colors](/src/core/colors.md), [./json-serializable](/src/core/json-serializable.md).