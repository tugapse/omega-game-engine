## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | LightConeAngles |
| Source file | light-cone.ts |

The **LightConeAngles** class serves as a specialized data container designed to define the angular boundaries of a spotlight's illumination volume. It specifically manages the distinction between the inner beam (where light is at full intensity) and the outer beam (where light falls off to zero), providing the mathematical parameters necessary for calculating light attenuation based on angular spread.

**Functional Mission**
The primary responsibility of **LightConeAngles** is to encapsulate the geometric constraints of a light cone. It solves the problem of managing spotlight falloff parameters by providing a structured, serializable object that can be easily passed to shaders or stored in scene configurations.

**System Context & Integration**
This component acts as a configuration sub-module for light entities. It is intended to be utilized by [Spot Light](/AgentDocs/entities/lights/spot-light.md) to define its volumetric shape. Because it extends [Json Serializable](/AgentDocs/core/json-serializable.md), it integrates seamlessly into the engine's serialization pipeline, allowing light properties to be persisted or transmitted via [Json Serialized Data](/AgentDocs/interfaces/json-serialized-data.md) during scene loading or network synchronization.

- **INTERNAL REFERENCES**: [Spot Light](/AgentDocs/entities/lights/spot-light.md), [Json Serializable](/AgentDocs/core/json-serializable.md), [Json Serialized Data](/AgentDocs/interfaces/json-serialized-data.md).

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `inner` (Default: `20.0`)  The default inner cone angle in degrees.
- `outer` (Default: `30.0`)  The default outer cone angle in degrees.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `LightConeAngles` | Class | Manages and serializes the angular properties of a spotlight cone. |
| `inner` | number | Represents the angle of the inner beam in degrees. |
| `outer` | number | Represents the angle of the outer beam in degrees. |
| `toJsonObject` | Method | Converts the instance into a [Json Serialized Data](/AgentDocs/interfaces/json-serialized-data.md) format. |
| `fromJson` | Method | Populates the instance properties from a [Json Serialized Data](/AgentDocs/interfaces/json-serialized-data.md) object. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. The constructor invokes the `super` method of [Json Serializable](/AgentDocs/core/json-serializable.md) with the identifier `'LightConeAngles'`.
    2. Properties `inner` and `outer` are initialized to their default values (20.0 and 30.0 respectively).
- **Data Path (Serialization)**: 
    1. `toJsonObject()` is called.
    2. `serializeAutomatically()` (inherited from [Json Serializable](/AgentDocs/core/json-serializable.md)) scans the class properties.
    3. Returns a `JsonSerializedData` object.
- **Data Path (Deserialization)**: 
    1. `fromJson(jsonObject)` is called.
    2. `super.fromJson(jsonObject)` handles base class logic.
    3. `deserializeAutomatically(jsonObject)` (inherited from [Json Serializable](/AgentDocs/core/json-serializable.md)) maps the JSON keys back to the `inner` and `outer` properties.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [Json Serializable](/AgentDocs/core/json-serializable.md)
    - [Json Serialized Data](/AgentDocs/interfaces/json-serialized-data.md)
- **External Packages**: None identified.