## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| UnlitShader | [src/shaders/unlit-shader.ts](/src/shaders/unlit-shader.ts) |

This component is responsible for encapsulating the rendering logic for objects that utilize an unlit material. Its primary responsibility is to manage the shader program, ensuring that necessary material properties—such as base color, UV transformation parameters, and the main texture—are correctly loaded and passed to the GPU via uniforms. It extends the base [Shader](/src/shaders/shader.md) class to provide specialized functionality for this rendering type.

Architecturally, `UnlitShader` acts as a specialized rendering pipeline component. It consumes an instance of [UnlitMaterial](/src/materials/unlit-material.md) and utilizes shader source definitions from [ShaderSources](/src/shaders/shader-sources.md) to define its rendering behavior. It integrates with the rendering context (`WebGL2RenderingContext`) to execute drawing commands after loading all necessary data.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `UnlitShader.instanciate` | Static Method | Creates a new instance of UnlitShader, requiring the WebGL2 rendering context and the associated UnlitMaterial. |
| `UnlitShader` | Class | Represents the shader implementation for unlit materials, inheriting from Shader. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `loadDataIntoShader` method orchestrates the data transfer. It first calls the parent's loading mechanism, then asynchronously checks and loads the texture via `checkAndLoadTextures`. It then sets uniforms for color (`U_MAT_COLOR`), UV scale (`U_UV_SCALE`), and UV offset (`U_UV_OFFSET`) using values from the associated `UnlitMaterial`. If the main texture is loaded, it is bound and set as a uniform. The `release` method handles cleanup by unbinding the main texture.
- **Side Effects:** Interacts with the rendering context (`gl`) to set uniforms and bind textures. It performs asynchronous loading operations on the texture object (`this.material.mainTex.load()`).
- **Error Handling:** The `loadDataIntoShader` method includes a guard clause (`if (!this.material) return;`) to prevent execution if the material is null. Texture loading relies on the texture object's internal loading mechanism.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [ShaderUniformsEnum](/src/enums/shader-uniforms.enum.md), [UnlitMaterial](/src/materials/unlit-material.md), [Shader](/src/shaders/shader.md), [ShaderSources](/src/shaders/shader-sources.md)