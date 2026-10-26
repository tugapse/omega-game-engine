## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | MeshRendererBehaviour |
| Source file | mesh-renderer-behaviour.ts |

The **MeshRendererBehaviour** serves as the high-fidelity rendering bridge between the engine's scene graph and the GPU. It is specifically designed to handle complex geometry that requires physically-based rendering (PBR) features, such as normal mapping, specular/roughness workflows, and advanced light-source interactions.

**Functional Mission**
The primary responsibility of **MeshRendererBehaviour** is to orchestrate the complex data transfer required to render a mesh with advanced lighting and material properties. It solves the problem of managing high-density uniform data (multiple light sources, attenuation, and cone angles) and ensures material completeness by providing fallback textures for missing maps, preventing shader execution errors.

**System Context & Integration**
This component acts as a specialized implementation of [RendererBehaviour](/AgentDocs/behaviours/renderer/renderer-behaviour.md). During the render loop, it intercepts the draw call to inject lighting, shadow, and fog data into the [LitShader](/AgentDocs/shaders/lit-shader.md). It consumes data from [Light](/AgentDocs/entities/lights/light.md) entities, [SceneFog](/AgentDocs/core/scene-fog.md), and [LitMaterial](/AgentDocs/materials/lit-material.md) to populate the GPU state. It is a downstream consumer of the [Scene](/AgentDocs/entities/scene.md) state, specifically pulling shadow maps and light arrays to prepare the [WebGL2RenderingContext](/AgentDocs/core/render/render-pipeline.md) for geometry submission.

## 2. Environment & Configuration
**Environment Lookups:**
- `this.parent.scene.shadowmap.shadowstrength.value` (via `setShaderVariables`)  Retrieves the intensity of shadows from the scene's shadow mapping system.
- `this.fog.enabled` (via `draw`)  Checks if global fog is active to toggle shader uniforms.

**Hardcoded Constants:**
- `MAX_LIGHT_PASS` (Default: `16`)  Limits the number of directional, point, and spot lights processed in a single draw call to prevent uniform buffer overflow.
- `_defaultTextures` (Fallback colors)  `white` ([255, 255, 255, 255]), `black` ([0, 0, 0, 255]), and `normal` ([128, 128, 255, 255]).

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `instanciate` | Static Method | Factory method to create a new instance of the behaviour. |
| `draw` | Method | The main execution entry point; manages shadow, fog, and camera uniform updates before calling the base draw. |
| `initializeShader` | Method | Allocates and initializes GPU buffers for normals, tangents, and bitangents. |
| `setShaderVariables` | Method | Orchestrates the update of lighting and material-specific uniforms. |
| `getNormalMapLocations` | Method | Caches WebGL uniform and attribute locations for performance. |
| `getDefaultTexture` | Method | Generates and caches 1x1 fallback textures (white, black, or flat normal). |
| `bindMap` | Method | Safely binds a texture to a unit, substituting a fallback if the map is missing. |
| `setNormalMapsInformation` | Method | Binds all material texture maps (normal, specular, roughness, AO, emissive). |
| `setLightInformation` | Method | Filters active lights and sets ambient light levels. |
| `createLightObjectInfo` | Method | Categorizes lights by type for specialized loading. |
| `loadSpotLights` | Method | Packs spot light properties (position, direction, attenuation, cones) into typed arrays for the GPU. |
| `loadDirectionalLights` | Method | Packs directional light properties (direction, color) into typed arrays. |
| `loadPointLights` | Method | Packs point light properties (position, color, attenuation) into typed arrays. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. Calls `super.initializeShader()` to set up base buffers.
    2. Creates and allocates WebGL buffers for `normal`, `tangent`, and `bitangent` attributes.
    3. Initializes `drawPrimitiveType` to `GLPrimitiveType.TRIANGLES`.
- **Data Path**: 
    1. **Input**: `Mesh` data, `LitMaterial` textures, `Light` entity properties, and `SceneFog` settings.
    2. **Processing**: 
        - Light properties are normalized and packed into `Float32Array` buffers (e.g., `_spotPositionsBuf`).
        - Missing textures are replaced by 1x1 `_defaultTextures`.
        - Shadow matrices are calculated by multiplying the light's MVP with the object's model matrix.
    3. **Output**: A fully configured WebGL state with bound textures, updated uniform arrays, and active attribute pointers ready for `super.draw()`.
- **Conditional Branching**:
    - **Shadow Check**: If `shadowMapTexture` exists and `receiveShadows` is true, it calculates the `U_LIGHT_MVP_MATRIX` and sets `U_USE_SHADOWS` to 1.
    - **Fog Check**: If `fog.enabled` is true, it uploads density, color, and height falloff parameters; otherwise, it sets `U_FOG_ENABLED` to 0.
    - **Material Map Check**: In `bindMap`, if `mapData.glTexture` is null, it redirects to `getDefaultTexture`.

## 5. Resource Dependencies
- **Standard Libraries**: `gl-matrix` (mat4, vec3)
- **Internal Modules**: 
    - [EngineCache](/AgentDocs/core/engineCache.md)
    - [SceneFog](/AgentDocs/core/scene-fog.md)
    - [Camera](/AgentDocs/entities/camera.md)
    - [DirectionalLight](/AgentDocs/entities/lights/directional-light.md)
    - [Light](/AgentDocs/entities/lights/light.md)
    - [PointLight](/AgentDocs/entities/lights/point-light.md)
    - [SpotLight](/AgentDocs/entities/lights/spot-light.md)
    - [EntityType](/AgentDocs/enums/entity-type.enum.md)
    - [GLPrimitiveType](/AgentDocs/enums/gl-primitive-type.enum.md)
    - [ShaderUniformsEnum](/AgentDocs/enums/shader-uniforms.enum.md)
    - [LitMaterial](/AgentDocs/materials/lit-material.md)
    - [LitShader](/AgentDocs/shaders/lit-shader.md)
    - [RendererBehaviour](/AgentDocs/behaviours/renderer/renderer-behaviour.md)
- **External Packages**: `gl-matrix`