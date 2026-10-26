## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | Mesh & MeshData |
| Source file | mesh.ts |

The **MeshData** and **Mesh** classes serve as the fundamental geometric data containers within the engine. **MeshData** acts as a low-level data structure that encapsulates raw vertex attributespositions, normals, UV coordinates, and indiceswhile providing the mathematical utility to derive essential surface properties like tangents, bitangents, and bounding volumes.

**Mesh** functions as a high-level architectural wrapper designed for resource optimization. By decoupling the heavy geometric data (**MeshData**) from the component-like **Mesh** instance, the system enables a flyweight pattern where multiple entities or renderers can reference a single shared geometry, significantly reducing memory overhead and improving cache locality during the rendering pipeline.

**Functional Mission**
The primary mission of this component is to manage, transform, and serialize 3D geometric data. It solves the problem of raw vertex buffer management by providing automated calculation of surface vectors (normals/tangents) and spatial bounds (AABB/Bounding Spheres) required for lighting, normal mapping, and collision detection.

**System Context & Integration**
This component sits at the intersection of data parsing and the rendering pipeline. It is typically populated by parsers (e.g., `obj-parser.md`) and consumed by [Mesh Renderer Behaviour](/AgentDocs/behaviours/renderer/mesh-renderer-behaviour.md) to feed vertex data into the GPU. The calculated bounding volumes are critical for downstream culling systems and spatial partitioning, while the serialization methods ensure that complex geometric states can be persisted via [Json Serialized Data](/AgentDocs/interfaces/json-serialized-data.md).

- **INTERNAL REFERENCES**: [MeshData](/AgentDocs/core/mesh.md), [Mesh](/AgentDocs/core/mesh.md), [BoundingBox](/AgentDocs/core/bounding-box.md), [BoundingSphere](/AgentDocs/core/bounding-box.md), [JsonSerializable](/AgentDocs/core/json-serializable.md), [IMeshData](/AgentDocs/interfaces/meshData.md).

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `EPSILON` (Default: `0.000001`)  Used in tangent calculation to prevent division by zero when UV coordinates are degenerate.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `MeshData.instanciate` | Static Func | Factory method for creating new `MeshData` instances with optional parameters. |
| `MeshData.calculateNormals` | Method | Computes smooth vertex normals by averaging face normals across shared vertices. |
| `MeshData.getBoundingBox` | Static Func | Computes an Axis-Aligned Bounding Box (AABB) from a vertex array. |
| `MeshData.getBoundingSphere` | Static Func | Computes a bounding sphere based on the mesh centroid and maximum vertex distance. |
| `MeshData.invertNormals` | Method | Negates all existing normal vectors to flip face orientation. |
| `MeshData.calculateTangentsAndBitangents` | Method | Derives tangent and bitangent vectors required for normal mapping using UV and position data. |
| `MeshData.toJsonObject` | Method | Serializes geometric data into a JSON-compatible format. |
| `MeshData.fromJson` | Method | Reconstructs `MeshData` from a JSON object. |
| `Mesh.toJsonObject` | Method | Serializes the mesh component and its nested `MeshData`. |
| `Mesh.fromJson` | Method | Reconstructs the mesh component and initializes its `MeshData`. |

## 4. Execution Logic & Flow
- **Initialization**: 
    - `MeshData` is initialized with arrays for `vertices`, `normals`, `uvs`, and `indices`.
    - `Mesh` is initialized as a shell that requires a `meshData` assignment.
- **Data Path (Normal Calculation)**: 
    - Input: `vertices` and `indices`.
    - Processing: Iterates through triangles $\rightarrow$ calculates face normal via cross product $\rightarrow$ accumulates face normals into `vertexNormalSums` $\rightarrow$ averages and normalizes per vertex.
    - Output: Populated `this.normals` array.
- **Data Path (Tangent Calculation)**:
    - Input: `vertices`, `uvs`, `normals`, and `indices`.
    - Processing: Calculates edge vectors and UV deltas $\rightarrow$ solves for tangent/bitangent via matrix inversion $\rightarrow$ accumulates per vertex $\rightarrow$ performs Gram-Schmidt orthogonalization against the normal.
    - Output: Populated `this.tangents` and `this.bitangents`.
- **Conditional Branching**:
    - `calculateNormals`: Checks if `vertices.length === 0` to prevent processing empty data.
    - `calculateTangentsAndBitangents`: Validates presence of `indices`, `uvs`, and `normals` before proceeding.
    - `getBoundingBox`/`Sphere`: Returns `null` if the vertex array is empty.

## 5. Resource Dependencies
- **Standard Libraries**: `uuid` (via `v4`)
- **Internal Modules**: 
    - [JsonSerializable](/AgentDocs/core/json-serializable.md)
    - [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md)
    - [IMeshData](/AgentDocs/interfaces/meshData.md)
    - [BoundingBox](/AgentDocs/core/bounding-box.md)
    - [BoundingSphere](/AgentDocs/core/bounding-box.md)
- **External Packages**: `gl-matrix` (for `vec2`, `vec3` operations), `uuid`