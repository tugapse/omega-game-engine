## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| UnlitMaterial | [src/materials/unlit-material.ts](/src/materials/unlit-material.ts) |

This component defines the `UnlitMaterial`, a specialized material class designed for rendering surfaces that do not require complex lighting calculations. Its primary responsibility is to manage the visual properties of an object using a base color and an optional main texture, providing a simplified rendering pipeline suitable for UI elements or flat surfaces.

This class extends [ColorMaterial](/src/materials/color-material.md) and serves as a concrete implementation within the engine's material system. It integrates texture handling via the [Texture](/src/textures/texture.md) component and manages serialization/deserialization of its state using the [JsonSerializedData](/src/interfaces/json-serialized-data.md) interface, allowing materials to be persisted and loaded correctly.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| UnlitMaterial | Class | Represents a simple, unlit material that uses a color and a main texture. Augments [ColorMaterial](/src/materials/color-material.md). |
| uvScale | Vector2 | The UV scaling factor for the main texture. |
| uvOffset | Vector2 | The UV offset for the main texture. |
| mainTex | Texture | The main texture object associated with the material. |
| toJsonObject() | Method | Serializes the material's state to a [JsonSerializedData](/src/interfaces/json-serialized-data.md) object. |
| fromJson(jsonObject) | Method | Deserializes the material's state from a [JsonSerializedData](/src/interfaces/json-serialized-data.md) object. |
| instanciate() | Static Method | Creates a new instance of UnlitMaterial. |
| destroy() | Method | Cleans up resources, specifically destroying the associated main texture if it exists. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The material manages texture mapping parameters (`uvScale`, `uvOffset`) and holds a reference to the `mainTex`. Serialization (`toJsonObject`) recursively captures the state, including texture data. Deserialization (`fromJson`) uses the [Resources](/src/core/resources/resources.md) system to asynchronously fetch textures based on stored URLs and then updates the material's state.
- **Side Effects:** Mutates external state by calling `this.mainTex.destroy()` in the `destroy()` method, releasing GPU resources. It also interacts with the resource loading system via `Resources.for().getTexture()`.
- **Error Handling:** The `fromJson` method checks for the existence of `jsonObject["mainTex"]?.url` before attempting to load the texture, preventing errors if the texture reference is missing during deserialization.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [Resources](/src/core/resources/resources.md), [Vector2](/src/core/vector2.md), [JsonSerializedData](/src/interfaces/json-serialized-data.md), [Texture](/src/textures/texture.md), [ColorMaterial](/src/materials/color-material.md)