## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| SkyboxShader | /shaders/skybox-shader.md |

This component is responsible for managing and executing a procedural sky shader, allowing for the rendering of dynamic skyboxes. Its primary responsibility is to encapsulate the logic for generating complex atmospheric effects, including procedural sun, moon, clouds, and star fields, while also supporting the blending of these procedural elements with a static cubemap texture.

Architecturally, `SkyboxShader` acts as a specialized rendering component that inherits from the base [Shader](/shaders/shader.md). It integrates configuration data from the [SkyboxMaterial](/materials/skybox-material.md) and exposes numerous public properties (`sun`, `moon`, `clouds`, `stars`) that allow external systems to control the visual parameters of the sky in real-time.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| SkyboxShader | Class | Manages the procedural sky rendering pipeline, handling initialization and data loading for sky effects. |
| SkyboxShader.instanciate | Static Method | Creates a new instance of `SkyboxShader` using the provided WebGL2 context and material. |
| SkyboxShader.material | Property | The associated `SkyboxMaterial` instance holding base color and texture data. |
| SkyboxShader.sun | Property | Configuration object for procedural sun rendering parameters. |
| SkyboxShader.moon | Property | Configuration object for procedural moon rendering parameters. |
| SkyboxShader.clouds | Property | Configuration object for procedural cloud rendering parameters. |
| SkyboxShader.stars | Property | Configuration object for procedural star field rendering parameters. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The shader initializes by setting specific vertex and fragment shader URIs. The `loadDataIntoShader` method is the core data pipeline, which first handles the asynchronous loading and binding of the main cubemap texture if present. It then systematically maps all public configuration properties (sun, moon, clouds, stars, and material colors) into the corresponding shader uniforms using helper methods like `setVec3` and `setInt`.
- **Side Effects:** Mutates external state by interacting directly with the WebGL2 rendering context (`this.gl`) to set uniforms and bind textures. It also performs asynchronous operations (`await this.material.mainTex.load()`).
- **Error Handling:** The `loadDataIntoShader` method includes a check (`if (!this.material) return;`) to prevent execution if the necessary material is missing.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [Vector3](/core/vector3.md), [Color](/core/color.md), [ShaderUniformsEnum](/enums/shader-uniforms-enum.md), [CubemapMaterial](/materials/cubemap-material.md), [SkyboxMaterial](/materials/skybox-material.md), [CubemapTexture](/textures/cubemap-texture.md), [Shader](/shaders/shader.md), [ShaderSources](/shaders/shader-sources.md)