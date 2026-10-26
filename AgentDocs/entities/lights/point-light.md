## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | PointLight |
| Source file | point-light.ts |

The **PointLight** component is a specialized light source entity designed to simulate omnidirectional illumination. It functions by emitting light from a single coordinate in 3D space, expanding outward in all directions, which is essential for simulating localized light sources such as light bulbs, candles, or magical effects within a scene.

**Functional Mission**
The primary responsibility of **PointLight** is to encapsulate the properties required for omnidirectional light calculation, specifically managing color data and light attenuation. It solves the problem of defining how light intensity diminishes over distance, providing a structured way to pass these parameters to the rendering pipeline.

**System Context & Integration**
As a subclass of [Light](/AgentDocs/entities/lights/light.md), **PointLight** integrates into the entity hierarchy managed by the engine. It utilizes [Color](/AgentDocs/core/color.md) for chromatic properties and [LightAttenuation](/AgentDocs/entities/lights/light-attenuation.md) to define the falloff physics. During the rendering phase, the data contained within this component is typically consumed by shaders to calculate the contribution of this light source to the final pixel color of surfaces within the [Scene](/AgentDocs/entities/scene.md).

- **INTERNAL REFERENCES**: [Light](/AgentDocs/entities/lights/light.md), [LightAttenuation](/AgentDocs/entities/lights/light-attenuation.md), [Color](/AgentDocs/core/color.md), [EntityType](/AgentDocs/enums/entity-type.enum.md), [Transform](/AgentDocs/core/transform.md), [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md).

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `this.color` (Default: `new Color(1.0, 0.85, 0.57, 1.0)`)  Sets a default incandescent light bulb color (approx 2800K).
- `this.entityType` (Default: `EntityType.LIGHT_POINT`)  Hardcoded classification for the entity type.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `PointLight` | Class | Represents an omnidirectional light source entity. |
| `className` | Static Getter | Returns the string identifier `'PointLight'`. |
| `entityType` | Property | Identifies the entity as `EntityType.LIGHT_POINT`. |
| `attenuation` | Property | Holds the [LightAttenuation](/AgentDocs/entities/lights/light-attenuation.md) configuration. |
| `constructor` | Function | Initializes the light with a name, default incandescent color, and attenuation object. |
| `toJsonObject` | Method | Serializes the component state into [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md). |
| `fromJson` | Method | Reconstructs the component state from [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md). |
| `instanciate` | Static Method | Factory method to create a new `PointLight` instance with optional parameters. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. The `constructor` is invoked with a `name`.
    2. `super(name)` is called to initialize base `Light` properties.
    3. `entityType` is explicitly set to `EntityType.LIGHT_POINT`.
    4. `color` is initialized to a warm incandescent tone.
    5. `attenuation` is instantiated as a new `LightAttenuation` object.
- **Data Path (Serialization)**: 
    `PointLight Instance` $\rightarrow$ `serializeAutomatically()` $\rightarrow$ `JsonObject` (via `toJsonObject`).
- **Data Path (Deserialization)**: 
    `JsonObject` $\rightarrow$ `super.fromJson()` $\rightarrow$ `deserializeAutomatically()` $\rightarrow$ `PointLight Instance` (via `fromJson`).

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [Color](/AgentDocs/core/color.md)
    - [Transform](/AgentDocs/core/transform.md)
    - [EntityType](/AgentDocs/enums/entity-type.enum.md)
    - [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md)
    - [Light](/AgentDocs/entities/lights/light.md)
    - [LightAttenuation](/AgentDocs/entities/lights/light-attenuation.md)
- **External Packages**: None identified.