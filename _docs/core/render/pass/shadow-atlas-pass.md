## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **ShadowAtlasPass** | [src/core/render/pass/shadow-atlas-pass.ts](/src/core/render/pass/shadow-atlas-pass.ts) |

This component is responsible for rendering the depth information of all scene casters into a single, large texture atlas, which is used for shadow mapping in the rendering pipeline. It manages the caching of shadow views to avoid redundant rendering passes, only re-rendering a view if the light source, camera matrix, or any caster within that view has changed state.

It functions as a core rendering service within the engine's rendering subsystem. It consumes a `ShadowPlan` and a list of `SceneEntity` objects to generate the necessary depth data, which is then uploaded to a Uniform Buffer Object (`ShadowsBlock`) for use by the main lit shaders, such as those defined in [src/core/render/pass/shadow-atlas-pass.ts](/src/core/render/pass/shadow-atlas-pass.ts).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `SHADOWS_BINDING_POINT` | Constant | Uniform block binding point for `ShadowsBlock`. |
| `SHADOW_ATLAS_UNIT` | Constant | Texture unit used by the lit shader to sample the shadow atlas. |
| `JOINT_TEXTURE_UNIT` | Constant | Texture unit reserved for skinned mesh joint matrices. |
| `CasterState` | Interface | Holds the state of a caster for caching purposes, including its transformation matrix and bounds. |
| `CachedView` | Interface | Stores the light and matrix associated with a specific cached shadow view. |
| `ShadowStats` | Interface | Provides metrics for profiling the shadow pass, tracking views, redraws, and draw calls. |
| `CasterProgram` | Interface | Describes a specific rendering program used for casting shadows, including its associated WebGL locations. |
| `ShadowAtlasPass` | Class | Manages the entire shadow atlas rendering process, including caching, view generation, and data upload. |
| `ShadowAtlasPass.casterProgram` | Static Method | Creates and configures a `CasterProgram` by linking the necessary shadow caster shaders. |
| `ShadowAtlasPass.disableSkinAttributes` | Static Method | Disables vertex attributes related to skinning for a given program. |
| `ShadowAtlasPass.link` | Static Method | Compiles and links vertex and fragment shaders into a `WebGLProgram`. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `ShadowAtlasPass` maintains a cache of previously rendered shadow views. In the `render` method, it first checks if the atlas size needs updating. It then determines which views are "dirty" by comparing the current caster states (position, version, bounds) against the cached state. For dirty views, it sets up the viewport and scissor test for each view, iterates over all casters, performs frustum culling against the view's planes, and draws the depth using either the plain or skinned caster program. Finally, it packs the view data into the UBO and uploads it to the GPU.
- **Side Effects:** The code heavily interacts with the WebGL2RenderingContext (`this.gl`), performing buffer creation/binding, texture configuration, program linking/usage, viewport/scissor manipulation, and uniform data uploads. It mutates the internal state of `this.casters` and `this.cache`.
- **Error Handling:** The `ShadowAtlasPass.link` static method explicitly throws an `Error` if shader compilation or program linking fails, including the specific info log from the GPU.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:**
    - [src/core/render/behaviours.ts](/src/core/render/behaviours.ts)
    - [src/core/entities/entities.ts](/src/core/entities/entities.ts)
    - [src/core/enums/enums.ts](/src/core/enums/enums.ts)
    - [src/core/shaders/embedded-shaders.ts](/src/core/shaders/embedded-shaders.ts)
    - [src/core/shaders/shader.ts](/src/core/shaders/shader.ts)
    - [src/core/shaders/shader-sources.ts](/src/core/shaders/shader-sources.ts)
    - [src/render-target.ts](/src/render-target.ts)
    - [src/shadows.ts](/src/shadows.ts)
    - [src/culling/culling.ts](/src/culling/culling.ts)
    - [src/core/entities/lights/light.ts](/src/core/entities/lights/light.ts)