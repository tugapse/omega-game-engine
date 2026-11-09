## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| CubemapMaterial | materials/cubemap-material.md |

This component defines `CubemapMaterial`, a specialized material class designed to utilize a cube map texture, typically for rendering skyboxes or environment reflections. It extends `ColorMaterial` to inherit base material properties while adding specific logic to handle the loading and serialization of cube map data.

Architecturally, `CubemapMaterial` functions as a rendering asset definition within the engine's material system. It integrates with the `EngineCache` to asynchronously load the required `CubemapTexture` based on URI data found during deserialization, ensuring that the material state can be correctly reconstructed from serialized data structures like `JsonSerializedData`.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| CubemapMaterial | Class | Represents a material that uses a cube map texture for skyboxes or reflections. |
| mainTex | CubemapTexture | The cube map texture assigned to the material. |
| fromJson | Method | Deserializes the material's state from a JSON object, loading the cube map texture if URI data is present. |
| toJsonObject | Method | Serializes the material's current state, including the cube map texture, into a JSON object. |
| instanciate | Static Method | Creates and returns a new instance of `CubemapMaterial`. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `fromJson` method parses the `mainTex` entry in the input JSON. If URIs are found, it calls `EngineCache.getTextureCube` using the six provided URIs (right, left, up, bottom, front, back) to asynchronously construct and assign the `CubemapTexture`. The `toJsonObject` method recursively serializes the material and its associated texture.

- **Side Effects:** Interacts with the `EngineCache` to perform asynchronous texture loading, which implies potential I/O or resource management operations.

- **Error Handling:** The `fromJson` method assumes the structure of `jsonObject["mainTex"]?.uris` is correct; if the structure is invalid, it will likely result in runtime errors during array access.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [EngineCache](/core.md), [JsonSerializedData](/interfaces/json-serialized-data.md), [CubemapTexture](/textures/cubemap-texture.md), [ColorMaterial](/materials/color-material.md)