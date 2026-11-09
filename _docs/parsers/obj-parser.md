## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| ObjParser | parsers/obj-parser.md |

This component is responsible for parsing the raw text content of Wavefront .obj files. Its primary responsibility is to ingest geometric dataincluding vertex positions (`v`), texture coordinates (`vt`), and vertex normals (`vn`)and transform this unstructured file data into a structured, WebGL-ready format encapsulated within a `MeshData` object.

The `ObjParser` acts as a specialized data ingestion service within the application's asset pipeline. It sits between the raw file system I/O and the core rendering engine components, specifically preparing data structures that will be consumed by the rendering system, such as those defined in [core/mesh.md].

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| ObjParser | Class | Provides methods to parse and consolidate OBJ file content into `MeshData`. |
| parse | Method | Parses the entire content string of an OBJ file, returning a fully processed `MeshData` object. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The parser first iterates over lines in the input string, dispatching parsing based on prefixes ('v', 'vt', 'vn', 'f'). Face parsing (`parseFace`) handles N-gon triangulation. The critical step is `consolidateMeshData`, which uses a `Map` keyed by the combination of position, UV, and normal indices to ensure that only unique combinations are stored in the final output buffers, effectively de-duplicating geometry for efficient WebGL rendering.
- **Side Effects:** None. The component operates purely on the input string and mutates its internal state arrays before returning a new, immutable `MeshData` instance.
- **Error Handling:** The parser handles missing or invalid index components in face definitions by assigning a sentinel value of `-1` for UVs or Normals, which are then mapped to default values (0.0 or 0.0, 0.0) during consolidation.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [core/mesh.md]
- **Internal:** [parsers/interfaces.md]