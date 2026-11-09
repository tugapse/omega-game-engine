## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| LightAttenuation | entities/lights/light-attenuation.md |

This component defines the `LightAttenuation` class, which encapsulates the mathematical parameters governing how light intensity decreases as the distance from a light source increases. It provides a structured way to manage the three primary components of light falloff: constant, linear, and quadratic attenuation.

This class serves as a core data model within the application's rendering or physics subsystem. It extends `JsonSerializable`, allowing instances of `LightAttenuation` to be seamlessly serialized to and deserialized from JSON data structures, fitting into the overall configuration or entity data flow managed by components like [JsonSerializable](/core/json-serializable.md).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| LightAttenuation | Class | Defines light attenuation properties (constant, linear, quadratic). |
| toJsonObject | Method | Serializes the instance into a `JsonSerializedData` object. |
| fromJson | Method | Deserializes the instance from a `JsonSerializedData` object. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The class holds three numeric properties (`constant`, `linear`, `quadratic`) that define the attenuation curve. The `toJsonObject` and `fromJson` methods leverage inherited serialization logic to manage the state transfer between the object instance and a JSON representation.
- **Side Effects:** None.
- **Error Handling:** None.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.
- **Internal:** [JsonSerializable](/core/json-serializable.md), [JsonSerializedData](/interfaces/json-serialized-data.md).