## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| LightConeAngles | entities/lights/light-cone.md |

This component defines the `LightConeAngles` class, which encapsulates the geometric parameters defining the beam spread of a spotlight. Its primary responsibility is to hold and manage the inner and outer cone angles, which dictate how light intensity falls off from the center of the beam.

This class serves as a data model within the application's entity system, specifically related to lighting components. It implements serialization logic via `JsonSerializable` to ensure that these angle properties can be reliably persisted and loaded from external data sources, fitting into the core data structure layer of the application.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| LightConeAngles | Class | Defines the cone angles for a spotlight, managing inner and outer beam spread. |
| inner | number | The inner cone angle in degrees. |
| outer | number | The outer cone angle in degrees. |
| toJsonObject() | Method | Serializes the instance data into a `JsonSerializedData` object. |
| fromJson() | Method | Deserializes the instance data from a `JsonSerializedData` object. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The class initializes with default values for `inner` (20.0) and `outer` (30.0). It leverages automatic serialization/deserialization methods provided by its base class to handle the conversion between the object state and the `JsonSerializedData` structure.

- **Side Effects:** None.

- **Error Handling:** None explicitly implemented; relies on base class serialization/deserialization mechanisms.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.

- **Internal:** [JsonSerializable](/core/json-serializable.md) [JsonSerializedData](/interfaces/json-serialized-data.md)