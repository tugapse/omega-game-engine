## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **SpotLight** | [src/entities/lights/spot-light.ts](/src/entities/lights/spot-light.ts) |

This component defines the `SpotLight` class, which models a light source that emits light within a defined conical shape. It extends the base `Light` class, inheriting core lighting properties while adding specific attributes necessary for spotlight behavior, such as `coneAngles` and `attenuation`.

Architecturally, `SpotLight` serves as a concrete implementation of a light entity within the engine's data model. It integrates with core systems by utilizing `Transform` for directional data and interfaces with serialization mechanisms via `JsonSerializedData` to ensure persistence and loading capabilities across the application.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `SpotLight` | Class | Represents a spot light source, inheriting from [Light](/src/entities/lights/light.md). |
| `coneAngles` | Property | Defines the angular parameters that shape the light cone. |
| `attenuation` | Property | Holds the properties governing how the light intensity diminishes over distance. |
| `range` | Property | The maximum distance the light travels, used for culling and shadow plane definition. |
| `toLightDirection` | Getter | Returns the direction vector of the light, derived from the entity's `transform.forward`. |
| `constructor` | Method | Creates a new `SpotLight` instance, initializing default color properties. |
| `toJsonObject` | Method | Serializes the current state of the `SpotLight` instance into a `JsonSerializedData` object. |
| `fromJson` | Method | Deserializes the `SpotLight` instance from a provided `JsonSerializedData` object. |
| `instanciate` | Static Method | Factory method to create a new `SpotLight` instance, optionally accepting a name and transform. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The class overrides base methods to enforce `EntityType.LIGHT_SPOT`. It initializes specific properties like `coneAngles` and `attenuation` upon construction. The `toJsonObject` and `fromJson` methods manage the state transfer between the object instance and the serialized data structure.
- **Side Effects:** None. The class operates purely on its internal state and provided inputs.
- **Error Handling:** None explicitly documented; relies on the base `Light` class for underlying error handling during serialization/deserialization.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [Color](/src/core.md), [Transform](/src/core.md), [EntityType](/src/enums.md), [JsonSerializedData](/src/interfaces.md), [Light](/src/entities/lights/light.md), [LightAttenuation](/src/entities/lights/light-attenuation.md), [LightConeAngles](/src/entities/lights/light-cone.md)