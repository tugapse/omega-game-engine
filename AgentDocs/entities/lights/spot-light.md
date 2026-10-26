## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | SpotLight |
| Source file | spot-light.ts |

The **SpotLight** component is a specialized light source entity designed to emit light within a specific conical volume. It extends the base lighting functionality by introducing spatial constraints on light distribution, making it essential for simulating directed light sources such as flashlights, stage spotlights, or street lamps.

**Functional Mission**
The primary responsibility of **SpotLight** is to define the geometric and physical properties of a directional cone-shaped light. It solves the problem of localized, directional illumination by encapsulating cone angles and attenuation parameters, allowing the rendering engine to calculate light intensity based on both distance and angular deviation from the central axis.

**System Context & Integration**
As a specialized subclass of [Light](/AgentDocs/entities/lights/light.md), **SpotLight** integrates into the scene graph as an entity with a specific [EntityType](/AgentDocs/enums/entity-type.enum.md) of `LIGHT_SPOT`. It relies on the [Transform](/AgentDocs/core/transform.md) component to determine its orientation, specifically using the forward vector to derive the `toLightDirection`. This directionality is critical for downstream shaders (such as [LitShader](/AgentDocs/shaders/lit-shader.md)) to calculate the dot product between the light vector and surface normals. The component also facilitates state persistence through [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md) compatibility, allowing light configurations to be saved and restored.

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `this.color` (Default: `new Color(1.0, 0.96, 0.89, 1.0)`)  Sets a default warm white color approximating a 5000K LED/Halogen source.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `SpotLight` | Class | Represents a conical light source entity. |
| `entityType` | Property | Identifies the entity as `EntityType.LIGHT_SPOT`. |
| `coneAngles` | Property | Holds [LightConeAngles](/AgentDocs/entities/lights/light-cone.md) defining the light spread. |
| `attenuation` | Property | Holds [LightAttenuation](/AgentDocs/entities/lights/light-attenuation.md) defining light falloff. |
| `toLightDirection` | Getter | Returns the `vec3` direction vector derived from the transform's forward vector. |
| `toJsonObject` | Method | Serializes the spotlight state into [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md). |
| `fromJson` | Method | Reconstitutes the spotlight state from [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md). |
| `instanciate` | Static Method | Factory method to create a new `SpotLight` instance with optional parameters. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. The `constructor` calls `super(name)` to initialize base [Light](/AgentDocs/entities/lights/light.md) properties.
    2. Sets `entityType` to `EntityType.LIGHT_SPOT`.
    3. Initializes `coneAngles` and `attenuation` with default instances.
    4. Applies a hardcoded warm-white [Color](/AgentDocs/core/color.md).
- **Data Path (Serialization)**: 
    - `toJsonObject` $\rightarrow$ `serializeAutomatically()` $\rightarrow$ `JsonSerializedData`.
- **Data Path (Deserialization)**: 
    - `fromJson(jsonObject)` $\rightarrow$ `super.fromJson(jsonObject)` $\rightarrow$ `deserializeAutomatically(jsonObject)`.

## 5. Resource Dependencies
- **Standard Libraries**: `gl-matrix` (via `vec3`)
- **Internal Modules**: 
    - [Color](/AgentDocs/core/color.md)
    - [Transform](/AgentDocs/core/transform.md)
    - [EntityType](/AgentDocs/enums/entity-type.enum.md)
    - [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md)
    - [Light](/AgentDocs/entities/lights/light.md)
    - [LightAttenuation](/AgentDocs/entities/lights/light-attenuation.md)
    - [LightConeAngles](/AgentDocs/entities/lights/light-cone.md)
- **External Packages**: `gl-matrix`