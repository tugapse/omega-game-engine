## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| ObjParser | [src/parsers/obj-parser.ts](/src/parsers/obj-parser.ts) |

This component is responsible for parsing the textual data contained within Wavefront .obj files. Its primary responsibility is to ingest raw geometric data—including vertices (`v`), texture coordinates (`vt`), normals (`vn`), and face definitions (`f`)—and transform it into a structured, WebGL-ready format encapsulated by the `MeshData` type.

The `ObjParser` acts as a specialized data ingestion service within the application's asset pipeline. It consumes raw string content and produces a fully processed `MeshData` object, which is then utilized by rendering systems, such as those interacting with the [MeshData](/core/mesh.md) structure.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| ObjParser | Class | Provides methods to parse and consolidate OBJ file content into `MeshData`. |
| parse(objContent: string): MeshData | Method | Parses the entire content string of an OBJ file, returning a consolidated `MeshData` object. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The parser iterates over lines of the input string, dispatching parsing based on prefixes ('v', 'vt', 'vn', 'f'). Face data is initially stored with 1-based indices. The `consolidateMeshData` method then maps these raw indices into a unique set of vertices, UVs, and normals based on the combination of (position index, UV index, normal index). This ensures that geometrically identical but separately referenced vertices are merged into a single buffer entry, creating the final indexed structure.
- **Side Effects:** None. The component operates entirely on the input string and mutates its internal state arrays before returning a new `MeshData` instance.
- **Error Handling:** The parser handles missing or invalid index components within face definitions by assigning a sentinel value of -1, which is then mapped to default values (e.g., (0,0,0) for normals, (0.0, 0.0) for UVs) during consolidation.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [../core/mesh.md](/core/mesh.md), [./interfaces.md](/src/parsers/interfaces.md)