## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **MeshRendererBehaviour** | [behaviours/renderer/mesh-renderer-behaviour.ts](/behaviours/renderer/mesh-renderer-behaviour.ts) |

This component is responsible for rendering mesh-based objects within the scene, providing advanced rendering capabilities such as support for normal maps, specular maps, roughness maps, ambient occlusion (AO), and emissive maps. It extends the base [RendererBehaviour](/behaviours/renderer/renderer-behaviour.md) to manage the complex state required for physically-based rendering (PBR) features on a per-object basis.

It functions as a specialized rendering service within the engine's rendering pipeline. It integrates with scene-level data like [SceneFog](/core/scene-fog.md) and relies on the camera state provided by the [Camera](/entities/camera.md) entity to correctly transform and shade the geometry during the `draw()` cycle.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `MeshRendererBehaviour` | Class | A renderer for mesh-based objects that supports normal maps, lighting, and shadow mapping. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `draw()` method orchestrates the rendering process by first checking for necessary components (`mesh` and `shader`). If the shader is an instance of [LitShader](/shaders/lit-shader.md), it sets uniforms related to shadow reception and the shadow atlas. It then sets view and fog uniforms based on the current scene state. The `initializeShader()` method sets up necessary vertex buffers for tangents, bitangents, and normals. The `setNormalMapsInformation()` method retrieves uniform locations and binds texture maps (normal, specular, roughness, AO, emissive) to specific texture units, using cached 1x1 fallback textures if map data is missing.
- **Side Effects:** Mutates the state of the underlying WebGL context by creating buffers, binding textures, and setting uniforms. It reads from the `this.parent.scene` to access `SceneFog`.
- **Error Handling:** The `draw()` method includes an early exit if `this.mesh` or `this.shader?._shaderProgram` is not available. The `getNormalMapLocations()` method checks for the existence of `this.shader?._shaderProgram` before querying uniform and attribute locations. Fallback textures are generated and cached in `getDefaultTexture` if a material map is null or missing.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `WebGL2RenderingContext`, `WebGLUniformLocation`, `GLint`, `Uint8Array`, `WebGLTexture` (Implicitly from WebGL API).
- **Internal:** [SceneFog](/core/scene-fog.md), [Camera](/entities/camera.md), [GLPrimitiveType](/enums/gl-primitive-type.md), [ShaderUniformsEnum](/enums/shader-uniforms-enum.md), [LitMaterial](/materials/lit-material.md), [LitShader](/shaders/lit-shader.md), [RendererBehaviour](/behaviours/renderer/renderer-behaviour.md), [SHADOW_ATLAS_UNIT](/core/render/pass/shadow-atlas-pass.md).