## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **instantiateModel** | [src/model/model-instantiator.ts](/src/model/model-instantiator.ts) |

This component is responsible for taking a raw model asset (defined by a URI) and transforming it into a fully structured, runnable scene graph within the application. It parses the model data, instantiates the necessary hierarchy of `SceneEntity` objects, and attaches appropriate rendering and animation behaviors to represent the 3D structure.

It serves as a critical service layer within the engine's asset pipeline. It bridges the gap between static asset data (`ModelData`) and the dynamic runtime representation (`SceneEntity`), ensuring that the scene graph is correctly populated with visual components like `MeshRendererBehaviour` or `SkinnedMeshRendererBehaviour`, and animated components like `Animator`.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `InstantiateModelOptions` | Interface | Defines optional parameters for model instantiation, including setting a root name, linking to a target scene, and providing a custom texture resolution function. |
| `instantiateModel` | Function | Asynchronously loads a model from a URI, constructs the entity tree, attaches behaviors, and returns the root entity and all created entities. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The function first retrieves the `ModelData` using the `Resources` service. It then constructs the entity hierarchy by mapping model nodes to `SceneEntity` instances, setting their local transforms. Materials are created concurrently using `createMaterial`, which handles texture loading via `Resources`. Finally, it iterates over the nodes, attaching either a `MeshRendererBehaviour` or a `SkinnedMeshRendererBehaviour` based on the node's properties, and adds an `Animator` if clips are present.
- **Side Effects:** Reads model data from the resource system (which may involve file I/O or network requests depending on `Resources` implementation). Mutates the provided `Scene` object if `options.scene` is present by calling `options.scene.addEntity(e)`.
- **Error Handling:** The `createMaterial` function includes a warning mechanism (`console.warn`) if a specified texture path cannot be resolved via the `resolveImage` callback. The main function relies on `await` for resource loading, implying failures in `resources.getModel` would propagate as rejected promises.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.
- **Internal:**
- [../animation/animator](/src/model/model-instantiator.ts) (via `Animator`)
- [../behaviours/renderer/mesh-renderer-behaviour](/src/model/model-instantiator.ts) (via `MeshRendererBehaviour`)
- [../behaviours/renderer/skinned-mesh-renderer-behaviour](/src/model/model-instantiator.ts) (via `SkinnedMeshRendererBehaviour`)
- [../core/color](/src/model/model-instantiator.ts) (via `Color`)
- [../core/mesh](/src/model/model-instantiator.ts) (via `Mesh`)
- [../core/resources/builtin-textures](/src/model/model-instantiator.ts) (via `BuiltinTextures`)
- [../core/resources/resources](/src/model/model-instantiator.ts) (via `Resources`)
- [../core/model/model-data](/src/model/model-instantiator.ts) (via `ModelData`, `ModelImage`, `ModelMaterial`, `modelPartUri`)
- [../entities/entity](/src/model/model-instantiator.ts) (via `SceneEntity`)
- [../entities/scene](/src/model/model-instantiator.ts) (via `Scene`)
- [../materials/lit-material](/src/model/model-instantiator.ts) (via `LitMaterial`)
- [../shaders/lit-shader](/src/model/model-instantiator.ts) (via `LitShader`)