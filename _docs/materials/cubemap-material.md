## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **CubemapMaterial** | [src/materials/cubemap-material.ts](/src/materials/cubemap-material.ts) |

This component defines `CubemapMaterial`, a specialized material class designed to utilize a cube map texture for rendering purposes, commonly used for skyboxes or environment reflections. It extends `ColorMaterial`, inheriting base material properties while adding specific functionality to manage and render cube map data.

Architecturally, `CubemapMaterial` functions as a rendering asset definition within the engine's material system. It integrates with the resource management system via `Resources` to load and manage the `CubemapTexture`, and it adheres to serialization protocols by implementing `fromJson` and `toJsonObject` to persist its state, linking it to the broader data persistence layer.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `CubemapMaterial` | Class | Represents a material that uses a cube map texture. Extends [ColorMaterial](/src/materials/color-material.ts). |
| `mainTex` | Property | The primary cube map texture associated with this material. Type: `CubemapTexture`. |
| `fromJson(jsonObject: JsonSerializedData): Promise<void>` | Method | Deserializes the material's state from a JSON object, specifically loading the cube map texture if URI data is present. |
| `toJsonObject(): JsonSerializedData` | Method | Serializes the material's current state into a JSON object representation, including the cube map texture's state. |
| `instanciate(): CubemapMaterial` | Static Method | Creates and returns a new instance of `CubemapMaterial`. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `fromJson` method checks for `mainTex` URIs in the input JSON. If found, it uses `Resources.for().getCubemap` to asynchronously load the six faces of the cube map (right, left, up, bottom, front, back) and assigns the resulting `CubemapTexture` to `mainTex`. The `toJsonObject` method recursively serializes the material and its `mainTex`.
- **Side Effects:** Interacts with the resource system (`Resources`) to asynchronously load external assets (cube map textures) during deserialization.
- **Error Handling:** The `fromJson` method includes a conditional check (`if (jsonObject["mainTex"]?.uris)`) to prevent errors if the texture data is missing during loading.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [Resources](/src/core/resources/resources.ts), [JsonSerializedData](/src/interfaces/json-serialized-data.ts), [CubemapTexture](/src/textures/cubemap-texture.ts), [ColorMaterial](/src/materials/color-material.ts)