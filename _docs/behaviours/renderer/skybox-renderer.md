## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **SkyboxRenderer** | [src/behaviours/renderer/skybox-renderer.ts](/src/behaviours/renderer/skybox-renderer.ts) |

This component is a specialized renderer responsible for drawing a skybox, which is typically implemented as a large cube textured with a cubemap. Its primary function is to create the illusion of a vast, distant background environment surrounding the scene. It extends `MeshRendererBehaviour` to inherit rendering capabilities while overriding specific methods to handle skybox-specific rendering requirements.

Architecturally, `SkyboxRenderer` functions as a specialized rendering entity within the engine's behaviour system. It utilizes `CubePrimitive` for geometry, `SkyboxMaterial` and `SkyboxShader` for appearance, and integrates with the scene's camera via `Camera.mainCamera` to correctly position and project the skybox relative to the view.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `SkyboxRenderer` | Class | Specialized renderer for drawing a skybox. |
| `SkyboxRenderer.instanciate` | Static Method | Creates a new instance of `SkyboxRenderer` using the provided WebGL2 rendering context. |
| `SkyboxRenderer.material` | Getter | Returns the `SkyboxMaterial` associated with the renderer's shader. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The renderer initializes by setting up a `CubePrimitive` mesh and loading a white cubemap into the `SkyboxMaterial`. The `initialize` method scales the skybox transform to a large value (1000, 1000, 1000) to encompass the scene. The `setCameraMatrices` method specifically modifies the camera's view matrix by zeroing out its translation components before calculating the MVP matrix, ensuring the skybox remains centered relative to the camera's orientation. The `setGlSettings` method enforces rendering constraints by culling the front faces (`_gl.FRONT`) and setting the depth function to `LEQUAL`.
- **Side Effects:** Mutates external state by interacting directly with the WebGL2 context (`this._gl`) for setting face culling and depth functions. It also reads global state from `Camera.mainCamera`.
- **Error Handling:** The `draw` and `setShaderVariables` methods include checks (`if (!this.shader?._shaderProgram)`) to safely return early if the shader program has not been successfully initialized.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [../../core/resources/resources](/../../core/resources/resources.md), [../../entities](/../../entities.md), [../../enums](/../../enums.md), [../../materials](/../../materials.md), [../../primitives](/../../primitives.md), [../../shaders](/../../shaders.md), [./mesh-renderer-behaviour](/./mesh-renderer-behaviour.md)