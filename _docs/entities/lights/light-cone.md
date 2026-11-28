## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| LightConeAngles | [src/entities/lights/light-cone.ts](/src/entities/lights/light-cone.ts) |

This component defines the structure and behavior for managing the angular properties of a spotlight's light cone. It encapsulates the inner and outer cone angles, which are critical parameters for simulating directional light sources in a rendering or simulation environment.

It functions as a core data model within the application's entity system. By extending `JsonSerializable`, it ensures that the light cone angle data can be reliably persisted, loaded, and transmitted across system boundaries, fitting into the broader data serialization architecture alongside components like [JsonSerializable](/core/json-serializable.md).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| LightConeAngles | Class | Defines the cone angles for a spotlight, providing methods to serialize and deserialize its state. |
| toJsonObject() | Method | Converts the instance's state into a `JsonSerializedData` object for serialization. |
| fromJson() | Method | Populates the instance's state from a provided `JsonSerializedData` object. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The class initializes with default inner (20.0) and outer (30.0) cone angles. It implements standard serialization/deserialization patterns by calling `serializeAutomatically()` and `deserializeAutomatically()` respectively, ensuring data integrity during persistence.
- **Side Effects:** None.
- **Error Handling:** None.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.
- **Internal:** [JsonSerializable](/core/json-serializable.md), [JsonSerializedData](/interfaces/json-serialized-data.md).