## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | LightAttenuation |
| Source file | light-attenuation.ts |

**Functional Mission**
The **LightAttenuation** component is responsible for defining the mathematical parameters that govern how light intensity diminishes as it travels away from a light source. It provides the coefficients necessary to calculate light falloff, allowing for various lighting models ranging from stylized non-physical attenuation to strict physical inverse-square law simulations.

**System Context & Integration**
This component serves as a data structure used by light entities, such as [Point Light](/AgentDocs/entities/lights/point-light.md) or [Spot Light](/AgentDocs/entities/lights/spot-light.md), to communicate distance-based decay properties to the rendering pipeline. By implementing [JsonSerializable](/AgentDocs/core/json-serializable.md), it ensures that light properties can be seamlessly serialized for scene persistence and deserialized during engine initialization. The values defined here are typically passed as uniforms to shaders to compute the final fragment color based on the distance between the fragment and the light source.

- **INTERNAL REFERENCES**: [JsonSerializable](/AgentDocs/core/json-serializable.md), [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md).

## 2. Environment & Configuration
**Environment Lookups:**
No environment lookups identified.

**Hardcoded Constants:**
- `constant` (Default: `0.2`)  The constant component of the attenuation formula.
- `linear` (Default: `0.01`)  The linear component of the attenuation formula.
- `quadratic` (Default: `0.001`)  The quadratic component of the attenuation formula.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `LightAttenuation` | Class | Manages attenuation coefficients and handles JSON serialization/deserialization. |
| `toJsonObject` | Method | Converts the attenuation properties into a [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md) format. |
| `fromJson` | Method | Populates the class properties from a [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md) object. |

## 4. Execution Logic & Flow
- **Initialization**: The constructor initializes the instance with the type identifier `'LightAttenuation'` via the [JsonSerializable](/AgentDocs/core/json-serializable.md) superclass and sets default values for `constant` (0.2), `linear` (0.01), and `quadratic` (0.001).
- **Data Path (Serialization)**: `toJsonObject()` is called $\rightarrow$ invokes `serializeAutomatically()` $\rightarrow$ returns a key-value mapping of the public properties.
- **Data Path (Deserialization)**: `fromJson(jsonObject)` is called $\rightarrow$ invokes `super.fromJson(jsonObject)` $\rightarrow$ invokes `deserializeAutomatically(jsonObject)` to map JSON keys back to class properties.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [JsonSerializable](/AgentDocs/core/json-serializable.md)
    - [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md)
- **External Packages**: None identified.