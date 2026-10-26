## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | ShaderUniformsEnum |
| Source file | shader-uniforms.enum.ts |

The **ShaderUniformsEnum** serves as the centralized source of truth for all string identifiers used to map CPU-side data to GPU-side uniform variables within GLSL shaders. By providing a strictly typed enumeration, it eliminates the risk of runtime errors caused by typographical inconsistencies when binding data to shader programs.

**Functional Mission**
The primary responsibility of **ShaderUniformsEnum** is to provide a standardized dictionary of uniform names. It solves the problem of "magic strings" in the rendering pipeline, ensuring that when a developer or a system component (such as a material or a light manager) attempts to update a shader property, the key used matches the expected identifier in the shader source code.

**System Context & Integration**
This component acts as a bridge between the high-level engine logic and the low-level shader execution. It is heavily utilized by rendering behaviors and material systems to facilitate data transfer. For instance, [Mesh Renderer Behaviour](/AgentDocs/behaviours/renderer/mesh-renderer-behaviour.md) or [Lit Material](/AgentDocs/materials/lit-material.md) would reference these enum members to locate specific uniform locations (like `U_MVP_MATRIX` or `U_MAIN_TEX`) during the draw call preparation phase. It also provides the necessary keys for complex array indexing used in lighting calculations, such as `U_DIRECTIONAL_LIGHT_DIRECTIONS`.

## 2. Environment & Configuration
**Environment Lookups:**
No environment lookups identified.

**Hardcoded Constants:**
- `U_TIME` (Default: `"u_time"`)  Global time uniform.
- `U_SCREEN_RESOLUTION` (Default: `"u_screenResolution"`)  Viewport dimensions.
- `U_MVP_MATRIX` (Default: `"u_mvpMatrix"`)  Model-View-Projection matrix.
- `U_VIEW_MATRIX` (Default: `"u_viewMatrix"`)  View transformation matrix.
- `U_MODEL_MATRIX` (Default: `"u_modelMatrix"`)  Model transformation matrix.
- `U_NORMAL_MATRIX` (Default: `"u_normalMatrix"`)  Normal transformation matrix.
- `U_WORLD_MATRIX` (Default: `"u_worldMatrix"`)  World transformation matrix.
- `U_WORLD_INVERSE_TRANSPOSE_MATRIX` (Default: `"u_worldInverseTransposeMatrix"`)  Inverse transpose of world matrix.
- `U_MAT_COLOR` (Default: `"u_matColor"`)  Material tint color.
- `U_UV_SCALE` (Default: `"u_uvScale"`)  Texture coordinate scaling.
- `U_UV_OFFSET` (Default: `"u_uvOffset"`)  Texture coordinate offset.
- `U_SPECULAR_STRENGTH` (Default: `"u_specularStrength"`)  Specular intensity.
- `U_ROUGHNESS` (Default: `"u_roughness"`)  Surface roughness.
- `U_MAIN_TEX` (Default: `"u_mainTex"`)  Primary texture sampler.
- `U_NORMAL_TEX` (Default: `"u_normalMap"`)  Normal map sampler.
- `U_NORMAL_MAP_STRENGTH` (Default: `"u_normalMapStrength"`)  Normal map intensity.
- `U_CAMERA_POSITION` (Default: `"u_cameraPosition"`)  Camera world position.
- `A_POSITION` (Default: `"a_position"`)  Vertex position attribute.
- `A_NORMAL` (Default: `"a_normal"`)  Vertex normal attribute.
- `A_UV` (Default: `"a_uv"`)  Vertex UV attribute.
- `A_TANGENT` (Default: `"a_tangent"`)  Vertex tangent attribute.
- `A_BITANGENT` (Default: `"a_bitangent"`)  Vertex bitangent attribute.
- `U_AMBIENT_LIGHT` (Default: `"u_ambientLight"`)  Ambient light color.
- `U_NUM_DIRECTIONAL_LIGHTS` (Default: `"u_numDirectionalLights"`)  Count of directional lights.
- `U_DIRECTIONAL_LIGHT_DIRECTIONS` (Default: `"u_directionalLightDirections[0]"`)  First directional light direction.
- `U_DIRECTIONAL_LIGHT_COLORS` (Default: `"u_directionalLightColors[0]"`)  First directional light color.
- `U_NUM_POINT_LIGHTS` (Default: `"u_numPointLights"`)  Count of point lights.
- `U_POINT_LIGHT_POSITIONS` (Default: `"u_pointLightPositions[0]"`)  First point light position.
- `U_POINT_LIGHT_COLORS` (Default: `"u_pointLightColors[0]"`)  First point light color.
- `U_POINT_LIGHT_CONSTANT_ATTS` (Default: `"u_pointLightConstantAtts[0]"`)  First point light constant attenuation.
- `U_POINT_LIGHT_LINEAR_ATTS` (Default: `"u_pointLightLinearAtts[0]"`)  First point light linear attenuation.
- `U_POINT_LIGHT_QUADRATIC_ATTS` (Default: `"u_pointLightQuadraticAtts[0]"`)  First point light quadratic attenuation.
- `U_NUM_SPOT_LIGHTS` (Default: `"u_numSpotLights"`)  Count of spot lights.
- `U_SPOT_LIGHT_POSITIONS` (Default: `"u_spotLightPositions[0]"`)  First spot light position.
- `U_SPOT_LIGHT_DIRECTIONS` (Default: `"u_spotLightDirections[0]"`)  First spot light direction.
- `U_SPOT_LIGHT_COLORS` (Default: `"u_spotLightColors[0]"`)  First spot light color.
- `U_SPOT_LIGHT_INNER_CONE_COS` (Default: `"u_spotLightInnerConeCos[0]"`)  First spot light inner cone cosine.
- `U_SPOT_LIGHT_OUTER_CONE_COS` (Default: `"u_spotLightOuterConeCos[0]"`)  First spot light outer cone cosine.
- `U_SPOT_LIGHT_CONSTANT_ATTS` (Default: `"u_spotLightConstantAtts[0]"`)  First spot light constant attenuation.
- `U_SPOT_LIGHT_LINEAR_ATTS` (Default: `"u_spotLightLinearAtts[0]"`)  First spot light linear attenuation.
- `U_SPOT_LIGHT_QUADRATIC_ATTS` (Default: `"u_spotLightQuadraticAtts[0]"`)  First spot light quadratic attenuation.
- `U_LIGHT_MVP_MATRIX` (Default: `"u_lightMVPMatrix"`)  Shadow mapping MVP matrix.
- `U_USE_SHADOWS` (Default: `"u_useShadows"`)  Shadow toggle flag.
- `U_SHADOW_MAP` (Default: `"u_shadowMap"`)  Shadow map sampler.
- `U_SHADOW_MAP_SIZE` (Default: `"u_shadowMapSize"`)  Shadow map resolution.
- `U_SHADOW_STRENGTH` (Default: `"u_shadowStrength"`)  Shadow intensity.
- `U_FOG_ENABLED` (Default: `"u_fogEnabled"`)  Fog toggle flag.
- `U_FOG_COLOR` (Default: `"u_FogColor"`)  Fog color.
- `U_FOG_DENSITY` (Default: `"u_FogDensity"`)  Fog density.
- `U_FOG_DISTANCE` (Default: `"u_fogDistance"`)  Fog distance.
- `U_FOG_TYPE` (Default: `"u_fogType"`)  Fog algorithm type.
- `U_FOG_HEIGHT_FALLOFF` (Default: `"u_FogHeightFalloff"`)  Height-based fog falloff.
- `U_FOG_BASE_HEIGHT` (Default: `"u_FogBaseHeight"`)  Fog baseline height.
- `U_SUN_DIRECTION` (Default: `"u_sunDirection"`)  Sun direction vector.
- `U_SUN_COLOR` (Default: `"u_sunColor"`)  Sun disk color.
- `U_SUN_SIZE` (Default: `"u_sunSize"`)  Sun core size.
- `U_SUN_FALLOFF` (Default: `"u_sunFalloff"`)  Sun edge falloff.
- `U_USE_SUN` (Default: `"u_useSun"`)  Sun computation flag.
- `U_SKY_COLOR` (Default: `"u_skyColor"`)  Zenith sky color.
- `U_HORIZON_COLOR` (Default: `"u_horizonColor"`)  Horizon sky color.
- `U_GROUND_COLOR` (Default: `"u_groundColor"`)  Ground color.
- `U_EXPONENT` (Default: `"u_exponent"`)  Gradient transition exponent.
- `U_MOON_DIRECTION` (Default: `"u_moonDirection"`)  Moon direction vector.
- `U_MOON_COLOR` (Default: `"u_moonColor"`)  Moon disk color.
- `U_MOON_SIZE` (Default: `"u_moonSize"`)  Moon core size.
- `U_MOON_FALLOFF` (Default: `"u_moonFalloff"`)  Moon edge falloff.
- `U_MOON_PHASE` (Default: `"u_moonPhase"`)  Moon rotation phase.
- `U_USE_MOON` (Default: `"u_useMoon"`)  Moon computation flag.
- `U_CLOUD_SPEED` (Default: `"u_cloudSpeed"`)  Cloud movement speed.
- `U_CLOUD_SEED` (Default: `"u_cloudSeed"`)  Cloud noise seed.
- `U_USE_CLOUDS` (Default: `"u_useClouds"`)  Cloud computation flag.
- `U_WHEATHER_CONDITION` (Default: `"u_weatherCondition"`)  Weather state.
- `U_CLOUD_TILING` (Default: `"u_cloudTiling"`)  Cloud texture tiling.
- `U_CLOUD_SPARSITY` (Default: `"u_cloudSparsity"`)  Cloud density/sparsity.
- `U_CLOUD_REPETITION` (Default: `"u_cloudRepetition"`)  Cloud repetition factor.
- `U_STAR_INTENSITY` (Default: `"u_starIntensity"`)  Star brightness.
- `U_STAR_SCALE` (Default: `"u_starScale"`)  Star size scale.
- `U_STAR_SPARSITY` (Default: `"u_starSparsity"`)  Star distribution.
- `U_STAR_SPEED` (Default: `"u_starSpeed"`)  Star movement speed.
- `U_MOON_EARTHSHINE` (Default: `"u_moonEarthshine"`)  Moon earthshine effect.
- `U_MOON_TERMINATOR_SOFTNESS` (Default: `"u_moonTerminatorSoftness"`)  Moon terminator softness.
- `U_MOON_ENABLE_ROTATION` (Default: `"u_moonEnableRotation"`)  Moon rotation toggle.
- `U_MOON_ROTATION_SPEED` (Default: `"u_moonRotationSpeed"`)  Moon rotation speed.
- `U_USE_STARS` (Default: `"u_useStars"`)  Star computation flag.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `ShaderUniformsEnum` | Enum | Provides a collection of constant string mappings for shader uniform and attribute locations. |

## 4. Execution Logic & Flow
Direct exports or structural definitions only; no internal logic flow.

## 5. Resource Dependencies
- **Standard Libraries**: None
- **Internal Modules**: None
- **External Packages**: None