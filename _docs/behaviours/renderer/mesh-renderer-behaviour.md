## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| MeshRendererBehaviour | behaviours/renderer/mesh-renderer-behaviour.md |

This component is responsible for rendering mesh-based entities with advanced graphical features, such as Physically Based Rendering (PBR) lighting, normal mapping, and shadow mapping. Its primary responsibility is to manage the complex data pipeline required to pass detailed geometric and material propertiesincluding multiple light sources and texture mapsto the GPU shaders for accurate rendering.

It functions as a specialized renderer within the application's rendering subsystem. It extends the base [RendererBehaviour](/behaviours/renderer/renderer-behaviour.md) to handle the specific requirements of complex 3D geometry, integrating data from the scene's [Camera](/entities/camera.md), [Light](/entities/light.md) types, and [SceneFog](/core/scene-fog.md) configuration.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| MeshRendererBehaviour | Class | A renderer for mesh-based objects that supports advanced lighting, normal maps, and shadow mapping. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `draw()` method orchestrates the rendering process by first setting up shadow map uniforms if applicable. It then configures camera and fog parameters. The `setShaderVariables()` method delegates the complex task of gathering and uploading light data (directional, point, spot) and material texture information to specialized helper methods. Texture binding uses a fallback mechanism (`getDefaultTexture`) to ensure rendering stability even when material maps are missing.
- **Side Effects:** Mutates external state by interacting directly with the WebGL2RenderingContext (`_gl`) to create, bind, and upload textures and buffers to the GPU. It reads global state from `this.parent.scene`.
- **Error Handling:** Implements fallback mechanisms for missing texture maps by generating 1x1 placeholder textures (white, black, or flat normal). It checks for the existence of `this.mesh` and `this.shader` before drawing.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [EngineCache](/core/engine-cache.md), [SceneFog](/core/scene-fog.md), [Camera](/entities/camera.md), [DirectionalLight](/entities/directional-light.md), [Light](/entities/light.md), [PointLight](/entities/point-light.md), [SpotLight](/entities/spot-light.md), [EntityType](/enums/entity-type.md), [GLPrimitiveType](/enums/gl-primitive-type.md), [ShaderUniformsEnum](/enums/shader-uniforms-enum.md), [LitMaterial](/materials/lit-material.md), [LitShader](/shaders/lit-shader.md), [RendererBehaviour](/behaviours/renderer/renderer-behaviour.md)