## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | UnlitMaterial |
| Source file | unlit-material.ts |

The **UnlitMaterial** class serves as a specialized material definition within the rendering engine, designed for surfaces that do not respond to light calculations. By extending the base color properties, it provides a streamlined way to render objects using a single diffuse color and a primary texture, making it ideal for UI elements, sprites, or stylized non-lit environments.

**Functional Mission**
The primary responsibility of **UnlitMaterial** is to manage the state and data required for unlit shading, specifically handling texture mapping via UV scaling and offsetting. It solves the problem of providing a lightweight alternative to complex lit materials by decoupling the visual appearance from the scene's lighting environment.

**System Context & Integration**
This component acts as a data provider for the rendering pipeline. It integrates with the [EngineCache](/AgentDocs/core/engineCache.md) to asynchronously resolve texture assets during deserialization. It extends the functionality of [ColorMaterial](/AgentDocs/materials/color-material.md), ensuring that color data is inherited while adding specific texture transformation properties (`uvScale`, `uvOffset`) and a reference to a [Texture](/AgentDocs/textures/texture.md). During the serialization lifecycle, it contributes to the overall scene state by converting its complex properties into a [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md) format.

## 2. Environment & Configuration
**Environment Lookups:**
- `mainTex.url` (via `fromJson`)  Used to fetch the texture resource from the `EngineCache`.

**Hardcoded Constants:**
- `uvScale` (Default: `[1, 1]`)  Initial UV scaling factor.
- `uvOffset` (Default: `[0, 0]`)  Initial UV translation offset.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `UnlitMaterial` | Class | Manages unlit shading properties including color, texture, and UV transformations. |
| `uvScale` | Vector2 | Defines the tiling/scaling factor for the `mainTex` coordinates. |
| `uvOffset` | Vector2 | Defines the translation/offset for the `mainTex` coordinates. |
| `mainTex` | Texture | The primary texture applied to the geometry. |
| `toJsonObject` | Method | Serializes the material state (color, texture, UVs) into a JSON-compatible object. |
| `fromJson` | Method | Asynchronously reconstructs the material state from a JSON object, including texture loading. |
| `instanciate` | Method | Static factory method to create a new instance of the material. |
| `destroy` | Method | Performs manual memory management by destroying the associated `mainTex`. |

## 4. Execution Logic & Flow
- **Initialization**: 
    - Sets `_className` to `"UnlitMaterial"`.
    - Initializes `uvScale` to a unit vector `(1, 1)`.
    - Initializes `uvOffset` to a zero vector `(0, 0)`.
- **Data Path (Serialization)**: 
    - `toJsonObject` is called $\rightarrow$ calls `super.toJsonObject()` for color data $\rightarrow$ spreads `uvScale` and `uvOffset` into arrays $\rightarrow$ calls `mainTex.toJsonObject()` $\rightarrow$ returns `JsonSerializedData`.
- **Data Path (Deserialization)**: 
    - `fromJson` is called $\rightarrow$ calls `super.fromJson()` $\rightarrow$ checks for `mainTex.url` $\rightarrow$ awaits `EngineCache.getTexture2D()` $\rightarrow$ applies `uvScale` and `uvOffset` via `.set()`.
- **Conditional Branching**:
    - `fromJson`: Only attempts texture loading if `jsonObject["mainTex"]?.url` exists.
    - `fromJson`: Only updates UV properties if the corresponding keys exist in the JSON object.
    - `destroy`: Only calls `mainTex.destroy()` if `mainTex` is currently assigned.

## 5. Resource Dependencies
- **Standard Libraries**: `gl-matrix` (via `vec2`)
- **Internal Modules**: 
    - [EngineCache](/AgentDocs/core/engineCache.md)
    - [Vector2](/AgentDocs/core/vector.md)
    - [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md)
    - [Texture](/AgentDocs/textures/texture.md)
    - [ColorMaterial](/AgentDocs/materials/color-material.md)
- **External Packages**: `gl-matrix`