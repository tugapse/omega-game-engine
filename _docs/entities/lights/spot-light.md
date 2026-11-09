## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| SpotLight | entities/lights/spot-light.md |

This component defines the `SpotLight` class, which models a light source that emits light within a defined conical shape. Its primary responsibility is to encapsulate the specific properties of a spotlight, such as its cone angles and attenuation characteristics, extending the base `Light` functionality.

Architecturally, `SpotLight` serves as a concrete implementation within the engine's rendering and entity system. It inherits from [Light](/entities/lights/light.md) and manages its state through serialization methods (`toJsonObject`, `fromJson`), allowing it to be persisted and reconstructed within the application's data model.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| SpotLight | Class | Represents a spot light source, inheriting from Light. |
| toLightDirection | Getter | Returns the direction vector of the light, derived from the transform's forward vector. |
| constructor | Method | Creates a new SpotLight instance, setting default color properties. |
| toJsonObject | Method | Serializes the SpotLight instance into a JSON-compatible data structure. |
| fromJson | Method | Deserializes the SpotLight instance from a provided JSON data structure. |
| instanciate | Static Method | Factory method to create a new SpotLight instance, optionally accepting a name and transform. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The class extends the base `Light` functionality by adding specific properties like `coneAngles` and `attenuation`. It overrides serialization methods to ensure that these specific properties are correctly captured and restored during data persistence. The `toLightDirection` getter provides a derived property based on the entity's current transformation state.

- **Side Effects:** None. The class primarily manages internal state and data serialization/deserialization.

- **Error Handling:** None explicitly documented; relies on the base class implementation for general error handling during serialization/deserialization.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [Color](/core/color.md), [Transform](/core/transform.md), [EntityType](/enums/entity-type.md), [JsonSerializedData](/interfaces/json-serialized-data.md), [Light](/entities/lights/light.md), [LightAttenuation](/entities/lights/light-attenuation.md), [LightConeAngles](/entities/lights/light-cone.md)