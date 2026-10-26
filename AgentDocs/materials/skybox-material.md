## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | SkyboxMaterial |
| Source file | skybox-material.ts |

The **SkyboxMaterial** class is a specialized material implementation designed to facilitate procedural sky rendering. It extends the functionality of a cubemap-based material by adding specific parameters that control the gradient and atmospheric appearance of a sky environment, such as color transitions and exponent-based blending.

**Functional Mission**
The primary responsibility of **SkyboxMaterial** is to provide a data structure and interface for defining the visual properties of a procedural sky. It solves the problem of representing atmospheric gradients (sky, horizon, and ground) within the engine's material system, allowing for dynamic sky adjustments without requiring static textures.

**System Context & Integration**
This component sits within the material hierarchy, inheriting from [CubemapMaterial](/AgentDocs/materials/cubemap-material.md). It serves as a data provider for shaders, specifically intended to be consumed by a [SkyboxShader](/AgentDocs/shaders/skybox-shader.md) via a renderer like the [SkyboxRenderer](/AgentDocs/behaviours/renderer/skybox-renderer.md). It integrates with the serialization system through [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md), ensuring that procedural sky states can be persisted and reconstructed.

- **INTERNAL REFERENCES**: [CubemapMaterial](/AgentDocs/materials/cubemap-material.md), [Color](/AgentDocs/core/color.md), [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md).

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `skyColor` (Default: `new Color(0.35, 0.53, 0.7, 1.0)`)  The primary color of the upper atmosphere.
- `horizonColor` (Default: `new Color(0.7, 0.75, 0.8, 1.0)`)  The color at the transition point between sky and ground.
- `groundColor` (Default: `new Color(0.2, 0.2, 0.2, 1.0)`)  The color of the lower atmosphere/ground area.
- `exponent` (Default: `0.6`)  Controls the mathematical curve of the color gradient transition.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `SkyboxMaterial` | Class | Manages procedural sky properties and extends cubemap material capabilities. |
| `toJsonObject` | Method | Serializes the material and its procedural properties into a JSON-compatible object. |
| `fromJson` | Method | Reconstructs the material state from a provided JSON object. |

## 4. Execution Logic & Flow
- **Initialization**: The class initializes with default procedural colors (`skyColor`, `horizonColor`, `groundColor`) and a default `exponent` value. It inherits base cubemap properties from its parent.
- **Data Path (Serialization)**: 
    1. `toJsonObject()` is called.
    2. Calls `super.toJsonObject()` to gather base cubemap data.
    3. Spreads base data and appends serialized `Color` objects for sky, horizon, and ground.
    4. Appends the `exponent` primitive.
    5. Returns the merged object.
- **Data Path (Deserialization)**:
    1. `fromJson(jsonObject)` is called.
    2. Calls `super.fromJson(jsonObject)` to restore base cubemap properties.
    3. Uses `Color.createFromJsonData` to reconstruct the three specific `Color` instances from the JSON payload.
    4. Assigns the `exponent` value, defaulting to the current value if the key is missing.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [Color](/AgentDocs/core/color.md)
    - [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md)
    - [CubemapMaterial](/AgentDocs/materials/cubemap-material.md)
- **External Packages**: None identified.