## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **SkyboxShader** | [src/shaders/skybox-shader.ts](/src/shaders/skybox-shader.ts) |

This component implements the `SkyboxShader`, a specialized shader designed to render a skybox using a cubemap texture. Its primary responsibility is to manage the rendering pipeline for the sky environment, incorporating complex atmospheric effects like the sun, moon, clouds, and stars via configurable uniforms.

Architecturally, `SkyboxShader` extends the base `Shader` class, acting as a specialized rendering implementation within the graphics subsystem. It relies heavily on `CubemapMaterial` to supply texture data and configuration parameters, and it interfaces with `ShaderSources` to determine the correct vertex and fragment shader code paths.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `SkyboxShader` | Class | A shader implementation for skybox rendering. Provides static factory method `instanciate` and instance methods for data loading and texture binding. |
| `SkyboxShader.instanciate` | Static Method | Creates a new instance of `SkyboxShader` given a rendering context and a `CubemapMaterial`. |
| `SkyboxShader.material` | Property | The `SkyboxMaterial` associated with this shader instance. |
| `SkyboxShader.sun` | Object | Configuration object for sun properties (direction, color, size, etc.). |
| `SkyboxShader.moon` | Object | Configuration object for moon properties (direction, color, phase, etc.). |
| `SkyboxShader.clouds` | Object | Configuration object for cloud rendering parameters (speed, tiling, etc.). |
| `SkyboxShader.stars` | Object | Configuration object for star rendering parameters (intensity, scale, etc.). |
| `SkyboxShader.initialize` | Method | Overrides the parent method to set specific shader source file URIs (`skybox` variants) before initialization. |
| `SkyboxShader.loadDataIntoShader` | Method | Loads all relevant properties from the associated `CubemapMaterial` and the internal configuration objects (`sun`, `moon`, `clouds`, `stars`) into the shader uniforms. |
| `SkyboxShader.setTexture` | Method | Binds a specific `CubemapTexture` to a named uniform location within the shader program. |
| `SkyboxShader.release` | Method | Unbinds the main texture from the material. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `loadDataIntoShader` method orchestrates the transfer of state. It first checks the `CubemapMaterial` for the main texture, loading it if necessary, and then systematically sets numerous uniforms (vectors, colors, floats, integers) corresponding to the sun, moon, clouds, and stars configurations. The `initialize` method ensures the correct shader source files are loaded before the base initialization occurs.
- **Side Effects:** Mutates external state by calling `this.gl.activeTexture`, `texture.bind()`, and `this.gl.uniform1i`/`this.gl.uniform1f`/`this.gl.uniform3f`/`this.gl.uniform4f` on the provided WebGL2 rendering context (`this.gl`). It also manages texture binding/unbinding.
- **Error Handling:** The `loadDataIntoShader` method includes a check (`if (!this.material) return;`) to prevent execution if the material is not set. Texture loading uses an asynchronous pattern (`await this.material.mainTex.load();`) if the texture is not yet loaded.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** WebGL2RenderingContext (via `gl`), Promise.
- **Internal:** [../core](/../core.md) (for `Vector3`, `Color`), [../enums](/../enums.md) (for `ShaderUniformsEnum`), [../materials](/../materials.md) (for `CubemapMaterial`, `SkyboxMaterial`), [../textures](/../textures.md) (for `CubemapTexture`), [./shader](/./shader.md) (for `Shader`), [./shader-sources](/./shader-sources.md) (for `ShaderSources`).