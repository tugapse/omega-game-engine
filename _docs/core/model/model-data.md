## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| SkinnedMeshData, ModelNode, ModelSkin, ModelMaterial, ModelImage, ModelData, ModelPartKind, parseModelPartUri, modelPartUri | [src/core/model/model-data.ts](/src/core/model/model-data.ts) |

This component defines the core data structures necessary for representing complex 3D models loaded from external formats like FBX or glTF. It encompasses structures for nodes, meshes (including skinned meshes), materials, animations, and associated images, providing a unified, engine-agnostic representation of imported assets.

This file serves as the primary data model layer for asset loading within the engine. It dictates how raw model data is structured before being consumed by rendering or animation systems, allowing different parts of the application to reference shared model components via indices within the [ModelData](/src/core/model/model-data.ts) structure.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `SkinnedMeshData` | Class | Extends `MeshData` to hold joint indices and weights required for skeletal animation skinning. |
| `ModelNode` | Interface | Represents a single transformable node within a model hierarchy, containing transformation data and optional references to mesh, skin, or material data. |
| `ModelSkin` | Interface | Defines the skeletal structure of a skinned mesh, listing bone indices and their corresponding inverse bind matrices. |
| `ModelMaterial` | Interface | Describes the surface properties of a mesh, including color and references to texture maps (albedo, normal, etc.). |
| `ModelImage` | Interface | Represents an image asset, capable of holding embedded binary data or referencing an external file path. |
| `ModelData` | Interface | The root container structure holding all parsed components of a single model asset: nodes, meshes, skins, clips, materials, and images. |
| `ModelPartKind` | Type | A union type enumerating the possible types of components referenced by URI fragments ('mesh', 'skin', 'anim', 'image'). |
| `parseModelPartUri` | Function | Parses a URI string (e.g., `asset://id#mesh/0`) into its constituent parts: the model URI, the part kind, and the index. |
| `modelPartUri` | Function | Constructs a full URI string from a base model URI, a specified part kind, and an index. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The file primarily defines data structures (interfaces and classes) and utility functions for URI parsing. `parseModelPartUri` uses regular expressions to deconstruct URI fragments, while `modelPartUri` performs string interpolation to construct them.
- **Side Effects:** None. The component is purely declarative, defining data structures and stateless parsing utilities.
- **Error Handling:** `parseModelPartUri` returns `null` if the input URI does not contain a hash or if the fragment does not match the expected pattern (`kind/index`).

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix` (for `mat4`, `quat`, `vec3`).
- **Internal:** [MeshData](/src/core/mesh/mesh-data.ts), [AnimationClip](/src/core/animation/animation-clip.ts)