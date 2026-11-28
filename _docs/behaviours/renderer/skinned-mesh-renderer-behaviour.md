## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| SkinnedMeshRendererBehaviour | [src/behaviours/renderer/skinned-mesh-renderer-behaviour.ts](/src/behaviours/renderer/skinned-mesh-renderer-behaviour.ts) |

This component is responsible for rendering 3D meshes that are deformed by a skeletal structure, utilizing linear blend skinning performed on the GPU. It manages the loading of mesh data from a model URI and associated skin data (which contains bone information and bind poses) from a separate URI. Its primary function is to prepare and render the mesh geometry while dynamically updating the joint transformation data necessary for the skinning shader.

Architecturally, `SkinnedMeshRendererBehaviour` extends [MeshRendererBehaviour](/src/behaviours/renderer/mesh-renderer-behaviour.ts) and acts as a specialized renderer. It integrates model data via [ModelData](/src/core/model/model-data.ts) and utilizes bone entities from the scene hierarchy to calculate the necessary joint matrices, which are then uploaded to a GPU texture for consumption by the rendering pipeline.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| SkinnedMeshRendererBehaviour | Class | Draws a mesh deformed by a skeleton. Manages loading mesh and skin data, and updating joint matrices for GPU rendering. |
| meshUri | Property | The model part URI identifying the mesh geometry. |
| skinUri | Property | The model part URI identifying the skin data (bones and bind pose). |
| boneIds | Property | An array of UUIDs referencing the bone entities in joint order. |
| jointTexture | Getter | Returns the WebGLTexture containing the current frame's joint matrices, or null if not loaded. |
| serializesMesh | Getter | Returns `false`, indicating the mesh data is loaded from the model file, not serialized within the scene. |
| whenLoaded | Method | Returns a Promise that resolves when the mesh and skin data have been successfully loaded. |
| deformationVersion | Getter | Returns the current version number of the deformation data, used for rendering synchronization. |
| toJsonObject | Method | Serializes the behaviour's state, including URIs and bone IDs, into a `JsonSerializedData` object. |
| fromJson | Method | Deserializes the behaviour's state from a `JsonSerializedData` object. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component loads mesh and skin data asynchronously. It calculates the `jointReach` based on vertex weights and bind poses. In `beforeRender`, it resolves the actual bone transforms from the scene hierarchy, calculates the required joint matrices ($\text{inverse}(\text{meshWorld}) \times \text{boneWorld} \times \text{inverseBind}$), and updates the `jointData` buffer, which is then uploaded to the `_jointTexture` using `texSubImage2D` if the pose has changed. The `worldBounds` method calculates the bounding sphere by considering the translation of each bone plus its calculated reach, scaled by the parent's model matrix.
- **Side Effects:** Interacts heavily with the WebGL context (`_gl`) to create, bind, and update `WebGLTexture`s. It reads data from the `Resources` system to load model assets. It mutates the internal state (`loaded`, `_deformationVersion`, `jointData`).
- **Error Handling:** Catches errors during the loading process (`load()`) and logs them to the console via `console.error`. It throws errors if `meshUri` or `skinUri` do not conform to the expected model part URI structure.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix` (for `mat4`, `vec3`).
- **Internal:**
    - [../../core/render/culling/maxScale](/src/core/render/culling/maxScale.ts)
    - [../../core/render/culling/Sphere](/src/core/render/culling/Sphere.ts)
    - [../../core/transform/Transform](/src/core/transform/Transform.ts)
    - [../../core/resources/resources/Resources](/src/core/resources/resources.ts)
    - [../../core/model/model-data/ModelData](/src/core/model/model-data.ts)
    - [../../core/model/model-data/SkinnedMeshData](/src/core/model/model-data.ts)
    - [../../enums/shader-uniforms.enum/ShaderUniformsEnum](/src/enums/shader-uniforms.enum.ts)
    - [../../interfaces/json-serialized-data/JsonSerializedData](/src/interfaces/json-serialized-data.ts)
    - [../../core/render/pass/shadow-atlas-pass/ShadowAtlasPass](/src/core/render/pass/shadow-atlas-pass/ShadowAtlasPass.ts)
    - [./mesh-renderer-behaviour/MeshRendererBehaviour](/src/behaviours/renderer/mesh-renderer-behaviour.ts)