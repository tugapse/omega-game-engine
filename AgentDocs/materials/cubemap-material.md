## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | CubemapMaterial |
| Source file | cubemap-material.ts |

The **CubemapMaterial** class is a specialized material implementation designed to handle environmental textures, specifically cube maps. It extends the base color material functionality to support complex spherical or environmental mapping, which is essential for rendering skyboxes, ambient reflections, and environmental lighting effects within the engine.

**Functional Mission**
The primary responsibility of **CubemapMaterial** is to manage the lifecycle, serialization, and texture binding of a `CubemapTexture`. It solves the problem of mapping six distinct texture faces (right, left, up, bottom, front, back) to a single material unit, allowing the renderer to simulate 360-degree environments or high-fidelity reflections on geometry.

**System Context & Integration**
This component acts as a bridge between the material system and the texture management system. It integrates with [EngineCache](/AgentDocs/core/engineCache.md) to asynchronously retrieve and cache cubemap resources during deserialization. It is a downstream consumer of [CubemapTexture](/AgentDocs/textures/cubemap-texture.md) and inherits core color properties from [ColorMaterial](/AgentDocs/materials/color-material.md). When the rendering pipeline processes an entity with this material, it provides the necessary texture data to shaders (likely via [SkyboxShader](/AgentDocs/shaders/skybox-shader.md) or similar) to perform environmental sampling.

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `CubemapMaterial` | Class | Manages cubemap-specific material properties and lifecycle. |
| `mainTex` | Property | Holds the reference to the active [CubemapTexture](/AgentDocs/textures/cubemap-texture.md). |
| `fromJson` | Method | Asynchronously reconstructs the material state and fetches textures from [EngineCache](/AgentDocs/core/engineCache.md). |
| `toJsonObject` | Method | Serializes the material and its texture state into a [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md) format. |
| `instanciate` | Method | Static factory method to create a new instance of the class. |

## 4. Execution Logic & Flow
- **Initialization**: The class is instantiated via `instanciate()`. It inherits base properties from [ColorMaterial](/AgentDocs/materials/color-material.md). The `mainTex` property is initially undefined.
- **Data Path (Deserialization)**: 
    1. `fromJson(jsonObject)` is called.
    2. `super.fromJson(jsonObject)` is executed to handle base color properties.
    3. The logic checks for the existence of `mainTex.uris` within the JSON.
    4. If present, it extracts an array of 6 URIs.
    5. It invokes `EngineCache.getTextureCube` with the mapped faces (right, left, up, bottom, front, back).
    6. The resulting promise resolves to a [CubemapTexture](/AgentDocs/textures/cubemap-texture.md) which is assigned to `mainTex`.
- **Data Path (Serialization)**:
    1. `toJsonObject()` is called.
    2. `super.toJsonObject()` is called to retrieve base material data.
    3. The `mainTex` property is serialized via its own `toJsonObject()` method and merged into the resulting object.
- **Conditional Branching**:
    - In `fromJson`, the texture loading logic only executes if `jsonObject["mainTex"]?.uris` evaluates to truthy, preventing errors on materials without assigned textures.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [EngineCache](/AgentDocs/core/engineCache.md)
    - [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md)
    - [CubemapTexture](/AgentDocs/textures/cubemap-texture.md)
    - [ColorMaterial](/AgentDocs/materials/color-material.md)
- **External Packages**: None identified.