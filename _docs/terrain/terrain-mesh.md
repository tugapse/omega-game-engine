## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **terrain-mesh.ts** | [src/terrain/terrain-mesh.ts](/src/terrain/terrain-mesh.ts) |

This component is responsible for generating the geometric data (vertices and indices) required to render a single terrain chunk. It calculates the mesh structure, including the main height grid and surrounding skirts, which are necessary to prevent visual cracks where adjacent chunks of different Levels of Detail (LOD) meet.

This module functions as a core geometry generation service within the terrain system. It consumes data structures from [TerrainChunkData](/src/terrain/terrain-data.md) and [TerrainGrid](/src/terrain/terrain-data.md) to produce raw vertex and index buffers, which are then passed to rendering pipelines.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `TERRAIN_LODS` | Constant | Defines the maximum number of levels of detail supported for terrain rendering. |
| `chunkVertexCount` | Function | Calculates the total number of vertices required for a chunk mesh, including the grid and the skirt. |
| `skirtSource` | Function | Determines the grid coordinates $(i, j)$ corresponding to a specific skirt vertex position $(k, \text{side})$. |
| `chunkIndices` | Function | Generates the `Uint32Array` containing triangle indices for a chunk at a specific LOD, including both grid and skirt triangles. |
| `fillChunkVertices` | Function | Populates the provided `Float32Array` buffers (positions, normals, UVs) with the vertex data for the chunk, including calculating normals from the [TerrainGrid](/src/terrain/terrain-data.md). |
| `chooseLod` | Function | Selects the appropriate Level of Detail (LOD) for a chunk based on its distance from the camera and a provided distance threshold array. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The module implements geometric calculations for mesh generation. `chunkIndices` calculates triangles by iterating over grid cells and then iterating over the four sides to generate skirt triangles, using `skirtSource` to map skirt positions back to grid coordinates. `fillChunkVertices` populates vertex buffers by mapping grid coordinates to positions, calculating normals via `grid.vertexNormal`, and then extending this to the skirt vertices.
- **Side Effects:** The function `fillChunkVertices` mutates the external `positions`, `normals`, and `uvs` `Float32Array` buffers passed into it.
- **Error Handling:** No explicit exception handling is present in the exported functions; logic relies on input parameters conforming to expected constraints (e.g., `lod` being within bounds).

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.
- **Internal:**
    - [./terrain-data](/src/terrain/terrain-data.md)