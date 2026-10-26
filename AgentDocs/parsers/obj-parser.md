## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | ObjParser |
| Source file | obj-parser.ts |

The **ObjParser** serves as a specialized data ingestion component designed to translate human-readable Wavefront .obj file strings into optimized, GPU-ready geometric structures. It acts as a bridge between external 3D asset files and the engine's internal representation of geometry, ensuring that raw vertex, normal, and texture coordinate data are correctly interpreted and structured for WebGL consumption.

**Functional Mission**
The primary responsibility of **ObjParser** is to parse, triangulate, and consolidate raw OBJ data. It solves the problem of non-indexed geometry and N-gon faces by converting them into a unified, indexed buffer format. Its core mission is to transform disparate arrays of positions, UVs, and normals into a single, cohesive [MeshData](/AgentDocs/interfaces/meshData.md) object where each unique combination of attributes is mapped to a single vertex index.

**System Context & Integration**
This component sits within the parsing layer of the engine. It consumes raw string data (typically loaded via file I/O) and produces [MeshData](/AgentDocs/interfaces/meshData.md). This output is critical for downstream modules such as [MeshRendererBehaviour](/AgentDocs/behaviours/renderer/mesh-renderer-behaviour.md) and the core rendering pipeline, as it provides the exact buffer layouts required to populate WebGL vertex buffer objects (VBOs) and element buffer objects (EBOs).

- **INTERNAL REFERENCES**: [MeshData](/AgentDocs/interfaces/meshData.md), [ObjFace](/AgentDocs/parsers/interfaces.md).

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `0.0` (Default: `0.0`)  Used as fallback values for UVs and Normals when data is missing in the OBJ file.
- `-1` (Default: `-1`)  Used as a sentinel value to indicate missing indices in the temporary face data.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `parse` | Public Method | Orchestrates the full parsing lifecycle: reset, line-by-line iteration, triangulation, and consolidation. |
| `resetParser` | Private Method | Clears all internal state and temporary buffers to ensure idempotency between parse calls. |
| `parseVertex` | Private Method | Extracts and stores 3D position coordinates from 'v' lines. |
| `parseUV` | Private Method | Extracts and stores 2D texture coordinates from 'vt' lines. |
| `parseNormal` | Private Method | Extracts and stores 3D normal vectors from 'vn' lines. |
| `parseFace` | Private Method | Parses 'f' lines, handles index offsets (1-based to 0-based), and performs triangulation for N-gons. |
| `consolidateMeshData` | Private Method | Performs vertex deduplication using a string-key map to create optimized indexed buffers. |

## 4. Execution Logic & Flow
- **Initialization**: The `parse` method triggers `resetParser`, which clears `tempVertices`, `tempNormals`, `tempUVs`, `tempFaces`, and all `output` arrays to prevent data leakage from previous operations.
- **Data Path**: 
    1. **Input**: A raw string containing OBJ formatted text.
    2. **Tokenization**: The string is split by newlines and then by whitespace.
    3. **Parsing**: A `switch` block routes lines to specific handlers (`parseVertex`, `parseUV`, `parseNormal`, `parseFace`) based on the prefix.
    4. **Triangulation**: Inside `parseFace`, if a face has $>3$ vertices, it is decomposed into a fan of triangles.
    5. **Consolidation**: `consolidateMeshData` iterates through all triangles. It generates a unique key `${posIdx}/${uvIdx}/${normIdx}`. If the key is new, it pushes the actual attribute values to the output arrays; otherwise, it simply references the existing index.
    6. **Output**: A new [MeshData](/AgentDocs/interfaces/meshData.md) instance is returned containing the consolidated arrays.
- **Conditional Branching**:
    - **Missing Attributes**: If a face definition lacks UVs or Normals, the parser injects `-1` into the temporary arrays, which is later converted to `0.0` or `(0,0,0)` during consolidation.
    - **N-gon Handling**: The logic checks `face.positions.length` to determine if triangulation is required.

## 5. Resource Dependencies
- **Standard Libraries**: None.
- **Internal Modules**: 
    - [MeshData](/AgentDocs/interfaces/meshData.md)
    - [ObjFace](/AgentDocs/parsers/interfaces.md)
- **External Packages**: 
    - `gl-matrix` (for `vec2`, `vec3` math utilities)