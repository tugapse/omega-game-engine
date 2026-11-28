## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| FbxParser | [src/parsers/fbx/fbx-parser.ts](/src/parsers/fbx/fbx-parser.ts) |

This component is responsible for parsing complex FBX file formats, specifically those exported by tools like Mixamo, Blender, or Maya. Its primary responsibility is to ingest raw binary or ASCII FBX data and transform it into a structured, engine-ready `ModelData` object. This process handles the extraction of the entire scene graph, including node hierarchies, geometric mesh data, skinning information, material properties, embedded textures, and animation clips.

Architecturally, `FbxParser` acts as a high-level data ingestion service. It orchestrates the reading process by utilizing `fbx-reader` to get raw node data, then employs the `FbxConverter` class to traverse the FBX structure, mapping FBX-specific concepts (like `FbxNode` and `FbxObject`) into the engine's canonical data models, such as [ModelData](/src/core/model/model-data.md) and [ModelMaterial](/src/core/model/model-data.md).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `FbxParseOptions` | Interface | Configuration options for the parsing process, primarily controlling animation resampling FPS. |
| `parseFbx` | Function | Asynchronously reads an `ArrayBuffer` containing FBX data and returns a fully constructed `ModelData` object based on the provided options. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The parsing flow is managed by `FbxConverter`. It first reads global settings (like `UnitScaleFactor` and `UpAxis`). It then iterates through objects to build the object map and connection list. Hierarchy is built via a depth-first traversal (`readNodes`), followed by specialized reads for geometry (`readMeshes`), materials (`readMaterial`), and animations (`readAnimations`). Mesh construction involves complex vertex deduplication based on normal and UV data (`buildMesh`). Animation reading involves sampling curves at fixed time intervals derived from the FBX file's start and end times, converting Euler angles to quaternions, and generating `AnimationChannel` data.
- **Side Effects:** The component uses `console.warn` during settings reading and mesh processing when certain FBX features (like ignored pivots or missing skin weights) are encountered.
- **Error Handling:** Fallbacks are implemented for missing properties (e.g., defaulting to `[0.8, 0.8, 0.8]` for diffuse color) and for missing animation data, returning `null` if no animation data is found for a stack.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [../../animation/animation-clip.md](/src/animation/animation-clip.md), [../../core/mesh.md](/src/core/mesh.md), [../../core/model/model-data.md](/src/core/model/model-data.md), [./fbx-reader.md](/src/parsers/fbx/fbx-reader.md)