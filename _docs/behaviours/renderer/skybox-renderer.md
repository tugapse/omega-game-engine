## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| SkyboxRenderer | behaviours/renderer/skybox-renderer |

This component is a specialized renderer responsible for drawing a skybox, which simulates a distant background environment using a large cube mesh textured with a cubemap. Its primary responsibility is to ensure this background element is rendered correctlyspecifically, by drawing it behind all other scene geometry while maintaining the illusion of an infinite sky.

The `SkyboxRenderer` acts as a specialized rendering behaviour, extending [MeshRendererBehaviour](/behaviours/renderer/mesh-renderer-behaviour.md). It integrates tightly with the rendering pipeline by setting specific WebGL state (like depth function and face culling) and manipulating camera matrices to ensure the skybox appears correctly relative to the main camera, utilizing resources from [SkyboxMaterial](/materials/skybox-material.md) and [SkyboxShader](/shaders/skybox-shader.md).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| SkyboxRenderer | Class | Specialized renderer for drawing a skybox. |
| SkyboxRenderer.material | Property | Gets the `SkyboxMaterial` associated with this renderer's shader. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The renderer initializes by setting up a large cube primitive and associating it with a `SkyboxShader` and `SkyboxMaterial`. During rendering, it overrides GL settings to cull front faces and use `LEQUAL` depth testing. Crucially, `setCameraMatrices` modifies the standard view matrix by zeroing out translation components, forcing the skybox to follow the camera's rotation without its positional offset, thus keeping it centered in the view.
- **Side Effects:** Mutates global WebGL state (e.g., `gl.cullFace`, `gl.depthFunc`) and interacts with the global state via `EngineCache` to retrieve textures.
- **Error Handling:** Checks for the existence of `this.shader?._shaderProgram` before executing draw or matrix setting logic to prevent runtime errors if the shader program is not yet initialized.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [EngineCache](/core/engine-cache.md), [Camera](/entities/camera.md), [RenderLayer](/enums/render-layer.md), [ShaderUniformsEnum](/enums/shader-uniforms-enum.md), [SkyboxMaterial](/materials/skybox-material.md), [CubePrimitive](/primitives/cube-primitive.md), [SkyboxShader](/shaders/skybox-shader.md), [MeshRendererBehaviour](/behaviours/renderer/mesh-renderer-behaviour.md)