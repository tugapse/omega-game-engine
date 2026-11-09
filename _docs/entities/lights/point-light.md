## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| PointLight | entities/lights/point-light.md |

This component defines the `PointLight` class, which models a light source that emits light uniformly in all directions from a single, fixed point in 3D space. Its primary responsibility is to encapsulate the physical properties of such a light, including its color, position, and how its intensity diminishes over distance via attenuation.

The `PointLight` serves as a concrete implementation of the abstract `Light` entity within the application's rendering and physics data model. It integrates with core systems by utilizing `Color` and `Transform` for spatial definition, and it manages its specific light decay behavior through the `LightAttenuation` component, allowing it to be serialized and deserialized correctly via `JsonSerializedData`.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| PointLight | Class | Represents a point light source. Provides static factory methods and instance methods for serialization/deserialization. |
| PointLight.instanciate | Static Method | Creates a new `PointLight` instance, optionally accepting a name and a `Transform`. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The class initializes with a default incandescent color and an instance of `LightAttenuation`. It overrides serialization methods (`toJsonObject` and `fromJson`) to ensure that the specific `PointLight` properties are correctly persisted and reconstructed from `JsonSerializedData`.
- **Side Effects:** None. The class operates purely on in-memory state and data structures.
- **Error Handling:** None explicitly implemented; relies on base class error handling for serialization/deserialization failures.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [Color](/core/color.md), [Transform](/core/transform.md), [EntityType](/enums/entity-type.md), [JsonSerializedData](/interfaces/json-serialized-data.md), [Light](/lights/light.md), [LightAttenuation](/lights/light-attenuation.md)