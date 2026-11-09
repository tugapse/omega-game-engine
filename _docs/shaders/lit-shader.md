## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| LitShader | /shaders/lit-shader.md |

This component implements the `LitShader`, a specialized shader designed for rendering objects using physically-based rendering (PBR) principles. Its primary responsibility is to manage the complex interaction between material properties (such as color, roughness, specular strength, and various texture maps like normal, roughness, and AO) and the rendering pipeline, ensuring physically accurate lighting simulation.

The `LitShader` acts as a core rendering component within the engine's material system. It inherits from the base `Shader` class and relies heavily on the `LitMaterial` to hold rendering data. It integrates with the `Camera` for view-dependent calculations and utilizes `EngineCache` to handle asynchronous loading and binding of necessary texture resources during the rendering process.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| LitShader | Class | A shader for rendering objects with physically-based lighting. |
| LitShader.instanciate | Static Method | Creates a new instance of LitShader, requiring the GL context and associated LitMaterial. |
| LitShader.constructor | Constructor | Initializes the shader with the WebGL2 context and the associated LitMaterial. |
| LitShader.loadDataIntoShader | Method | Loads all PBR material properties and texture references into the shader's uniform variables. |
| LitShader.checkAndLoadTextures | Method | Asynchronously loads and binds all required PBR textures, using fallbacks if textures are not yet loaded. |
| LitShader.release | Method | Unbinds all material textures from the active texture units after rendering. |
| LitShader.toJsonObject | Method | Serializes the shader and its associated material texture data into a `JsonSerializedData` object. |
| LitShader.fromJson | Method | Deserializes the shader's state, including material properties, from a `JsonSerializedData` object. |
| LitShader.destroy | Method | Cleans up and destroys all associated WebGL resources and textures. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The shader's core logic revolves around the `loadDataIntoShader` method, which maps material properties (like `specularStrength` and `roughness`) to shader uniforms. The `checkAndLoadTextures` method manages the asynchronous loading pipeline: it checks if a texture is loaded; if not, it initiates loading while binding a cached fallback texture to prevent rendering stalls. Texture binding is managed by explicitly setting the active texture unit and binding the texture ID.
- **Side Effects:** Mutates external state by interacting directly with the WebGL2 rendering context (`this.gl`) to bind textures and set uniforms. It also manages the lifecycle of `Texture` objects, calling `load()` and `destroy()` methods on them.
- **Error Handling:** Fallback mechanisms are implemented in `checkAndLoadTextures`. If a texture is not loaded, the system attempts to load it asynchronously while immediately using a cached fallback texture (e.g., `EngineCache.getWhiteTexture`) for the current frame to maintain rendering continuity.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [EngineCache](/core/engineCache.md), [Camera](/entities/camera.md), [ShaderUniformsEnum](/enums/shader-uniforms.enum.md), [JsonSerializedData](/interfaces/json-serialized-data.md), [LitMaterial](/materials/lit-material.md), [Texture](/textures/texture.md), [Shader](/shaders/shader.md), [ShaderSources](/shaders/shader-sources.md)