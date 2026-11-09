## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| UnlitShader | shaders/unlit-shader.md |

This component implements the `UnlitShader`, a specialized shader designed for rendering objects where lighting calculations are intentionally omitted. Its primary responsibility is to manage the rendering pipeline for materials that rely solely on intrinsic properties like base color and texture appearance, ensuring that the visual output is consistent regardless of scene lighting conditions.

Architecturally, `UnlitShader` acts as a concrete implementation of the abstract `Shader` class. It integrates the material's visual dataincluding color, UV transformations, and the main textureby loading these properties into the WebGL uniforms during the `loadDataIntoShader` lifecycle method. It relies on the `UnlitMaterial` to hold the necessary rendering data.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| UnlitShader | Class | Manages the rendering logic for unlit materials, inheriting from `Shader`. |
| UnlitShader.instanciate | Static Method | Factory method to create a new `UnlitShader` instance, requiring the WebGL context and associated `UnlitMaterial`. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The shader initializes by setting up the vertex and fragment shader sources. The `loadDataIntoShader` method asynchronously loads material properties, setting uniforms for color, UV scale, and UV offset. It also handles the loading and binding of the main texture if it is not already loaded. The `checkAndLoadTextures` method ensures the texture is loaded before it is used in rendering.
- **Side Effects:** Mutates external state by interacting with the WebGL2 rendering context (`gl`) to set uniforms and bind textures. It also performs asynchronous loading operations on the texture assets.
- **Error Handling:** The `loadDataIntoShader` method includes a check (`if (!this.material) return;`) to prevent execution if the material reference is missing.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [ShaderUniformsEnum](/enums/shader-uniforms.enum.md) [UnlitMaterial](/materials/unlit-material.md) [Shader](/shaders/shader.md) [ShaderSources](/shaders/shader-sources.md)