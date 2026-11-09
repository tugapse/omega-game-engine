## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| LitMaterial | materials/lit-material.md |

This component defines the `LitMaterial` class, which extends `UnlitMaterial` to introduce physically-based rendering properties necessary for materials that interact with scene lighting. Its primary responsibility is to manage parameters such as `specularStrength`, `roughness`, and `normalMapStrength`, allowing the material to accurately simulate how light reflects off a surface, including detailed surface variations provided by normal maps.

Architecturally, `LitMaterial` serves as a core data model within the rendering pipeline, specifically within the material definition layer. It inherits base functionality from [UnlitMaterial](/materials/unlit-material.md) and provides specialized methods like `toJsonObject` and `fromJson` to ensure its state can be reliably serialized and deserialized, interacting with the [EngineCache](/core/engine-cache.md) for texture loading during deserialization.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| LitMaterial | Class | Represents a material that responds to lighting, including properties for specular highlights and normal mapping. |
| specularStrength | Property | The strength of specular highlights. |
| roughness | Property | The roughness of the material's surface, affecting the size of specular highlights. |
| normalMapStrength | Property | The intensity of the normal map effect. |
| normalTex | Property | The normal map texture object. |
| specularTex | Property | The specular texture object. |
| roughnessTex | Property | The roughness texture object. |
| aoTex | Property | The ambient occlusion texture object. |
| emissiveTex | Property | The emissive texture object. |
| toJsonObject | Method | Serializes the material's state to a JSON object. |
| fromJson | Method | Deserializes the material's state from a JSON object. |
| instanciate | Static Method | Creates a new instance of LitMaterial. |
| destroy | Method | Cleans up associated resources, such as textures. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The material manages its state through properties and implements serialization/deserialization logic. `toJsonObject` aggregates base material data with specific lighting parameters. `fromJson` reconstructs the material state, asynchronously fetching textures from the [EngineCache](/core/engine-cache.md) if texture URLs are present in the input JSON.
- **Side Effects:** The `fromJson` method performs asynchronous operations by calling `EngineCache.getTexture2D`, which involves interaction with the engine's resource management system. The `destroy` method explicitly calls `destroy()` on associated textures, managing external resource cleanup.
- **Error Handling:** The `fromJson` method relies on the structure of the input `JsonSerializedData`. If texture URLs are present, it attempts to fetch and deserialize them; otherwise, it proceeds with property assignment.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [EngineCache](/core/engine-cache.md), [JsonSerializedData](/interfaces/json-serialized-data.md), [Texture](/textures/texture.md), [UnlitMaterial](/materials/unlit-material.md)