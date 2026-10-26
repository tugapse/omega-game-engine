## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | LitMaterial |
| Source file | lit-material.ts |

The **LitMaterial** class is a specialized material implementation designed to facilitate physically-based rendering properties within the engine. It extends the base unlit functionality to incorporate complex surface interactions, specifically managing how light interacts with a surface through specular highlights, roughness, and normal mapping.

**Functional Mission**
The primary responsibility of **LitMaterial** is to provide a data structure and interface for defining surface properties that respond to scene lighting. It solves the problem of differentiating between simple color-based surfaces and complex surfaces that require depth simulation (via normal maps) and light reflection modulation (via specular and roughness parameters).

**System Context & Integration**
This component acts as a data provider for the rendering pipeline. It integrates with [EngineCache](/AgentDocs/core/engineCache.md) to asynchronously load texture resources and implements serialization patterns via [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md) to allow for scene persistence. It serves as a critical input for shaders (likely [LitShader](/AgentDocs/shaders/lit-shader.md)) which consume these properties to calculate final pixel colors. It inherits core serialization capabilities from [UnlitMaterial](/AgentDocs/materials/unlit-material.md).

## 2. Environment & Configuration
**Environment Lookups:**
- `EngineCache.getTexture2D` (via `fromJson`)  Asynchronously retrieves a [Texture](/AgentDocs/textures/texture.md) instance from the global engine cache using a URL.

**Hardcoded Constants:**
- `specularStrength` (Default: `0.5`)  The base intensity of specular highlights.
- `roughness` (Default: `0.01`)  The base surface roughness affecting highlight spread.
- `normalMapStrength` (Default: `0.1`)  The default intensity of the normal map effect.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `LitMaterial` | Class | Manages lighting-reactive material properties and texture bindings. |
| `toJsonObject` | Method | Serializes material properties and texture metadata into a JSON-compatible format. |
| `fromJson` | Method | Asynchronously reconstructs the material state and fetches textures from the cache. |
| `instanciate` | Static Method | Factory method to create a new instance of `LitMaterial`. |
| `destroy` | Method | Performs manual memory management by cleaning up texture resources. |

## 4. Execution Logic & Flow
- **Initialization**: 
    - Calls `super()` to initialize `UnlitMaterial` properties.
    - Sets default values for `specularStrength` (0.5), `roughness` (0.01), and `normalMapStrength` (0.1).
- **Data Path (Serialization)**: 
    - `toJsonObject` $\rightarrow$ Spreads `UnlitMaterial` data $\rightarrow$ Appends `normalTex` (if exists) $\rightarrow$ Appends lighting scalars $\rightarrow$ Returns `JsonSerializedData`.
- **Data Path (Deserialization)**: 
    - `fromJson(jsonObject)` $\rightarrow$ Calls `super.fromJson` $\rightarrow$ Checks for `normalTex.url` $\rightarrow$ Requests texture from `EngineCache` $\rightarrow$ Applies `fromJson` to the new texture $\rightarrow$ Assigns scalar properties (`roughness`, `normalMapStrength`).
- **Conditional Branching**: 
    - In `fromJson`: If `jsonObject["normalTex"]?.url` is truthy, the engine initiates an asynchronous texture fetch; otherwise, `normalTex` remains undefined.
    - In `destroy`: If `this.normalTex` is present, it invokes the texture's internal `destroy` method to prevent memory leaks.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [EngineCache](/AgentDocs/core/engineCache.md)
    - [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md)
    - [Texture](/AgentDocs/textures/texture.md)
    - [UnlitMaterial](/AgentDocs/materials/unlit-material.md)
- **External Packages**: None identified.