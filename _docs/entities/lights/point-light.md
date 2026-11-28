## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **PointLight** | [src/entities/lights/point-light.ts](/src/entities/lights/point-light.ts) |

This component defines the `PointLight` class, which models a light source that emits light uniformly in all directions from a single point in the 3D scene. It extends the base `Light` class, inheriting core lighting properties while specializing its behavior and data structure to represent a point source.

Architecturally, `PointLight` serves as a concrete implementation within the application's entity system. It manages its specific light properties, such as `range` and `attenuation`, and provides serialization/deserialization methods to interact with data persistence layers, fitting within the broader data model managed by entities like [Light](/src/entities/lights/light.md).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `PointLight` | Class | Represents a point light source. It inherits from [Light](/src/entities/lights/light.md) and defines specific light properties. |
| `PointLight.className` | Static Property | Returns the string identifier 'PointLight' for serialization and type identification. |
| `PointLight.entityType` | Property | Defines the entity type as `EntityType.LIGHT_POINT`. |
| `PointLight.attenuation` | Property | Holds the `LightAttenuation` properties governing how light intensity diminishes over distance. |
| `PointLight.range` | Property | Defines the maximum distance the light reaches in world units. |
| `PointLight.constructor(name: string)` | Constructor | Creates a new `PointLight` instance, initializing default color and attenuation settings. |
| `PointLight.toJsonObject(): JsonSerializedData` | Method | Serializes the current state of the `PointLight` instance into a `JsonSerializedData` object. |
| `PointLight.fromJson(jsonObject: JsonSerializedData)` | Method | Deserializes the `PointLight` instance state from a provided `JsonSerializedData` object. |
| `PointLight.instanciate(name?: string, transform?: Transform): PointLight` | Static Method | Factory method to create and return a new `PointLight` instance, optionally accepting a name and transform. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The class overrides base methods to enforce its specific type (`EntityType.LIGHT_POINT`) and initializes default physical properties (e.g., incandescent color, default attenuation). It utilizes `serializeAutomatically()` and `deserializeAutomatically()` from its base class for data handling.
- **Side Effects:** None.
- **Error Handling:** None explicitly documented; relies on base class error handling during serialization/deserialization.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.
- **Internal:** [Color](/src/core/color.ts), [Transform](/src/core/transform.ts), [EntityType](/src/enums/entity-type.ts), [JsonSerializedData](/src/interfaces/json-serialized-data.ts), [Light](/src/entities/lights/light.ts), [LightAttenuation](/src/entities/lights/light-attenuation.ts).