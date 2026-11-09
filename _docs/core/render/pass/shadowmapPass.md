## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| ShadowMapPass | core/render/pass/shadowmapPass |

This component is responsible for executing the shadow mapping rendering pass. Its primary duty is to render the scene's geometry from the specific viewpoint of a directional light source into a high-resolution depth texture, known as the shadow map. This depth map is crucial for subsequent rendering passes to determine if any given point in the scene is obscured by an object, thus calculating realistic shadows.

Architecturally, `ShadowMapPass` functions as a specialized rendering service within the rendering pipeline. It utilizes the `WebGL2RenderingContext` to manage off-screen rendering via a `WebGLFramebuffer`. It relies on entities like [DirectionalLight](/core/entities/lights.md) to determine the light's perspective and interacts with scene objects that possess the `RendererBehaviour` to perform the depth rendering.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `ShadowMapPass` | Class | Manages the shadow map generation process, implementing `IRenderPass`. |
| `shadowstrength` | NumberRange | Configurable range controlling the final shadow darkness/strength. |
| `shadowmapTexture` | Texture | The depth texture storing the resulting shadow map data. |
| `shadowMapSize` | Static Property | Defines the fixed resolution (width/height) of the shadow map texture. |
| `enabled` | Boolean | Flag to toggle the execution of this rendering pass. |
| `setGl(gl)` | Method | Sets the underlying WebGL2 rendering context for the pass. |
| `execute(scene)` | Method | Executes the full shadow map rendering process for the given scene. |
| `clearShadowMap()` | Method | Clears the contents of the shadow map texture, useful when shadows are disabled. |
| `cleanup()` | Method | Releases all associated WebGL resources (texture, shader, framebuffer). |
| `resize(width, height)` | Method | Handles viewport resizing, though this pass maintains a fixed resolution. |
| `toJsonObject()` | Method | Serializes the current state of the pass into a `JsonSerializedData` object. |
| `fromJson(jsonObject)` | Method | Deserializes the pass's state from a `JsonSerializedData` object. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The pass first sets up a dedicated framebuffer attached to the depth texture. It then iterates over all scene objects flagged to cast shadows. For each caster, it sets up the necessary vertex attributes and uniforms, calculates the combined Model-View-Projection matrix from the light's perspective, and draws the object using the depth-only shader. Crucially, it enables front-face culling (`gl.CULL_FACE(gl.FRONT)`) to mitigate shadow acne artifacts.
- **Side Effects:** Mutates external state by binding and unbinding WebGL resources (framebuffers, textures, shaders) and performs rendering operations onto the GPU context.
- **Error Handling:** Checks for framebuffer completeness (`gl.checkFramebufferStatus`) and handles cases where no directional light is found in the scene, falling back to clearing the shadow map.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [RendererBehaviour](/core/render/behaviours.md), [ShaderUniformsEnum](/core/enums/ShaderUniformsEnum.md), [JsonSerializedData](/core/interfaces/JsonSerializedData.md), [Shader](/core/shaders/Shader.md), [Texture](/core/textures/Texture.md), [JsonSerializable](/core/json-serializable.md), [NumberRange](/core/range/NumberRange.md), [Scene](/core/entities/Scene.md), [Camera](/core/entities/Camera.md), [DirectionalLight](/core/entities/lights.md), [IRenderPass](/core/render-pass.interface.md)