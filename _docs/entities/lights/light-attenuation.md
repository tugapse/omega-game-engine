## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| LightAttenuation | [src/entities/lights/light-attenuation.ts](/src/entities/lights/light-attenuation.ts) |

This component defines the `LightAttenuation` class, which encapsulates the physical parameters governing how light intensity decreases as the distance from a light source increases. It manages three distinct attenuation factors: constant, linear, and quadratic, allowing for flexible modeling of light falloff behavior in simulations or rendering contexts.

This class serves as a core data model within the application's entity system. By extending `JsonSerializable`, it ensures that instances of `LightAttenuation` can be reliably serialized to and deserialized from structured data formats, integrating seamlessly with persistence layers that utilize [JsonSerializedData](/interfaces/interfaces.md).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| LightAttenuation | Class | Defines light attenuation properties. Implements `JsonSerializable` for serialization/deserialization. |
| toJsonObject() | Method | Serializes the current state of the `LightAttenuation` instance into a `JsonSerializedData` object. |
| fromJson() | Method | Deserializes the instance state from a provided `JsonSerializedData` object. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The class initializes with default values for constant (0.2), linear (0.01), and quadratic (0.001) attenuation components. The `toJsonObject` method delegates serialization to `serializeAutomatically()`, while `fromJson` first calls the parent's `fromJson` and then delegates deserialization to `deserializeAutomatically()`.
- **Side Effects:** None.
- **Error Handling:** None.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.
- **Internal:** [JsonSerializable](/core/core.md), [JsonSerializedData](/interfaces/interfaces.md).