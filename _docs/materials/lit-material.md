## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| LitMaterial | [src/materials/lit-material.ts](/src/materials/lit-material.ts) |

This component defines the `LitMaterial` class, which represents a material capable of responding to lighting effects, such as specular highlights and normal mapping. It extends `UnlitMaterial` to inherit base material properties while adding specific parameters necessary for physically-based rendering (PBR) lighting calculations.

It functions as a core data model within the rendering pipeline, specifically within the material definition layer. It manages the state of lighting properties (like `roughness` and `specularStrength`) and holds references to texture assets (`normalTex`, `specularTex`, etc.), allowing it to be serialized and deserialized via the `JsonSerializedData` interface for persistence.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `LitMaterial` | Class | Represents a material that responds to lighting, including properties for specular highlights and normal mapping. |
| `specularStrength` | Property | The strength of specular highlights. |
| `roughness` | Property | The roughness of the material's surface, affecting the size of specular highlights. |
| `normalMapStrength` | Property | The intensity of the normal map effect. |
| `normalTex` | Property | The normal map texture object. |
| `specularTex` | Property | The specular texture object. |
| `roughnessTex` | Property | The roughness texture object. |
| `aoTex` | Property | The ambient occlusion texture object. |
| `emissiveTex` | Property | The emissive texture object. |
| `toJsonObject()` | Method | Serializes the material's state to a JSON object. |
| `fromJson(jsonObject)` | Method | Deserializes the material's state from a JSON object. |
| `instanciate()` | Static Method | Creates a new instance of LitMaterial. |
| `destroy()` | Method | Cleans up resources associated with the material, including textures. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The class overrides serialization and deserialization methods to incorporate lighting-specific properties (`specularStrength`, `roughness`, `normalMapStrength`) and texture references into the `JsonSerializedData`. Deserialization asynchronously fetches textures from the `Resources` service using texture URLs found in the JSON object.
- **Side Effects:** The `fromJson` method interacts with the `Resources` service to asynchronously load textures, which constitutes an external resource access side effect. The `destroy` method explicitly calls `destroy()` on associated `Texture` objects.
- **Error Handling:** The `fromJson` method checks for the existence of `jsonObject["normalTex"]?.url` before attempting to load and process the texture, providing a basic guard against missing texture data.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [../core/resources/resources](/src/core/resources/resources.md), [../interfaces/json-serialized-data](/src/interfaces/json-serialized-data.md), [../textures/texture](/src/textures/texture.md), [./unlit-material](/src/materials/unlit-material.md)