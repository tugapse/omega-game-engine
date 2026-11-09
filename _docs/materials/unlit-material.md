## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| UnlitMaterial | materials/unlit-material.md |

This component defines the `UnlitMaterial`, a specialized material class designed for rendering objects without complex lighting calculations. Its primary responsibility is to combine a base color with an optional main texture, allowing for simple, direct visual representation of surfaces. It inherits from `ColorMaterial`, providing a foundation for color-based rendering while adding texture mapping capabilities.

Architecturally, `UnlitMaterial` functions as a concrete implementation within the rendering pipeline's material system. It manages texture resources via `mainTex` and controls texture sampling via `uvScale` and `uvOffset`. It integrates with the serialization system by implementing `toJsonObject` and `fromJson`, enabling the material's state to be persisted and reloaded correctly using `EngineCache` for texture retrieval.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| UnlitMaterial | Class | Represents a simple, unlit material that uses a color and a main texture. |
| uvScale | Property | The UV scaling factor for the main texture. |
| uvOffset | Property | The UV offset for the main texture. |
| mainTex | Property | The main texture object. |
| toJsonObject | Method | Serializes the material's state to a JSON object. |
| fromJson | Method | Deserializes the material's state from a JSON object. |
| instanciate | Static Method | Creates a new instance of UnlitMaterial. |
| destroy | Method | Releases the resources held by the material, specifically the main texture. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The material manages its state through properties like `uvScale` and `uvOffset`. Serialization involves recursively calling `toJsonObject` on the parent class and the `mainTex`, while storing the vector components as arrays. Deserialization reconstructs the state, asynchronously fetching the `mainTex` from `EngineCache` using the provided URL.
- **Side Effects:** Interacts with the external state via `EngineCache` during deserialization (network/cache access) and mutates external state by calling `mainTex.destroy()` during the `destroy` method.
- **Error Handling:** The `fromJson` method checks for the existence of `mainTex` before attempting to load it, preventing errors if the texture data is missing in the JSON payload.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [core](/core.md), [interfaces/json-serialized-data.md)
- **Unmapped Internal Imports:** `Texture`