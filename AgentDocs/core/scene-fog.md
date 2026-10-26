## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | SceneFog |
| Source file | scene-fog.ts |

**SceneFog** serves as a data container and configuration object for atmospheric fog effects within the rendering engine. Its primary purpose is to define the mathematical parameters and visual properties (color, density, type) that dictate how light is attenuated by the atmosphere over distance or height, providing a unified way to manage environmental depth perception.

**Functional Mission**
The **SceneFog** component's mission is to encapsulate all state required to simulate volumetric or distance-based fog. It provides a structured schema for fog algorithms (Linear, Exponential, or Exponential Squared) to consume during the rendering pass, ensuring that atmospheric effects can be serialized, deserialized, and applied consistently across different scenes.

**System Context & Integration**
This component acts as a configuration provider for the rendering pipeline. While it does not perform the actual GPU calculations, its properties are intended to be passed to shaders (likely via uniform buffers) during the execution of a [Render Pipeline](/AgentDocs/core/render/render-pipeline.md). It integrates with the serialization system via [JsonSerializable](/AgentDocs/core/json-serializable.md), allowing scene states containing fog configurations to be saved and loaded. It relies on [Color](/AgentDocs/core/color.md) and [Colors](/AgentDocs/core/colors.md) to define the visual tint of the fog.

- **INTERNAL REFERENCES**: [JsonSerializable](/AgentDocs/core/json-serializable.md), [Color](/AgentDocs/core/color.md), [Colors](/AgentDocs/core/colors.md), [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md).

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `FogType.LINEAR` (Default: `0`)  Defines the first fog algorithm type.
- `FogType.EXPONENTIAL` (Default: `1`)  Defines the second fog algorithm type.
- `FogType.EXPONEMTIAL_SQUARED` (Default: `2`)  Defines the third fog algorithm type.
- `enabled` (Default: `true`)  Toggles fog application.
- `distance` (Default: `0.01`)  Base distance parameter for fog calculations.
- `density` (Default: `0.001`)  Thickness of the fog.
- `heightFalloff` (Default: `0.0`)  Rate of fog density change relative to height.
- `baseHeight` (Default: `0.0`)  The altitude at which height fog begins.
- `color` (Default: `Colors.grey`)  The color of the fog particles.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `FogType` | Enum | Defines the mathematical models available for fog calculation (Linear, Exponential, Exponential Squared). |
| `SceneFog` | Class | Manages the state, configuration, and serialization of atmospheric fog settings. |
| `toJsonObject` | Method | Converts the current fog configuration into a [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md) object. |
| `fromJson` | Method | Populates the class properties from a [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md) object. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. The constructor initializes the class with a default name ('Scene Fog').
    2. The `super('SceneFog')` call registers the component type within the [JsonSerializable](/AgentDocs/core/json-serializable.md) framework.
    3. Default properties are assigned: `enabled` is true, `fogType` is `LINEAR`, `distance` is `0.01`, `density` is `0.001`, `heightFalloff` is `0.0`, `baseHeight` is `0.0`, and `color` is set to `Colors.grey`.
- **Data Path (Serialization)**: 
    `SceneFog Instance` $\rightarrow$ `toJsonObject()` $\rightarrow$ `serializeAutomatically()` $\rightarrow$ `JsonSerializedData`.
- **Data Path (Deserialization)**: 
    `JsonSerializedData` $\rightarrow$ `fromJson()` $\rightarrow$ `super.fromJson()` $\rightarrow$ `deserializeAutomatically()` $\rightarrow$ `SceneFog Property Update`.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md)
    - [Color](/AgentDocs/core/color.md)
    - [Colors](/AgentDocs/core/colors.md)
    - [JsonSerializable](/AgentDocs/core/json-serializable.md)
- **External Packages**: None identified.