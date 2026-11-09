## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| MeshData | /core/mesh.md |

This component defines `MeshData`, a core data structure responsible for holding all raw geometric information of a 3D model, including vertex positions, normals, texture coordinates (UVs), and triangle indices. It encapsulates complex mathematical operations necessary for rendering, such as calculating smooth normals, tangents, bitangents, and determining bounding volumes (AABB and Bounding Sphere).

`MeshData` serves as the fundamental geometric data model within the application's data layer. It is utilized by the higher-level `Mesh` component, which acts as a reference wrapper, allowing multiple rendering behaviors to share the same geometry instance for efficiency. Serialization and deserialization methods ensure that this complex geometric data can be persisted and loaded correctly via the [JsonSerializable](/core/json-serializable.md) interface.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `MeshData` | Class | Stores raw geometric data for a 3D model, including vertices, normals, UVs, and indices. |
| `MeshData.instanciate` | Static Method | Creates a new `MeshData` instance, optionally providing initial geometry arrays. |
| `MeshData.getBoundingBox` | Static Method | Calculates an Axis-Aligned Bounding Box (AABB) for the given set of vertices. |
| `MeshData.getBoundingSphere` | Static Method | Calculates a bounding sphere for the given set of vertices, centered at the centroid. |
| `MeshData.invertNormals` | Method | Inverts the direction of all normal vectors stored in the mesh data. |
| `MeshData.calculateTangentsAndBitangents` | Method | Computes tangent and bitangent vectors required for advanced rendering techniques like normal mapping. |
| `Mesh` | Class | A component wrapper that holds a reference to a shared `MeshData` instance, optimizing memory usage. |

## 3. Implementation Details & Side Effects
- **Core Logic:** `MeshData` calculates normals by averaging face normals derived from triangle cross products. Tangents and bitangents are calculated using the relationship between vertex positions, UV coordinates, and normals, involving solving a system of linear equations derived from the edge vectors and UV deltas. Bounding volumes are calculated by iterating over all vertices to find minimum/maximum extents or by finding the maximum distance from the centroid.
- **Side Effects:** The `calculateNormals` and `calculateTangentsAndBitangents` methods log warnings to the console upon encountering invalid data (e.g., missing indices or vertices).
- **Error Handling:** Methods check for empty arrays (e.g., `vertices.length === 0`) before performing calculations, returning `null` or issuing warnings instead of throwing runtime errors.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`, `uuid`
- **Internal:** [JsonSerializable](/core/json-serializable.md), [JsonSerializedData](/interfaces/json-serialized-data.md), [IMeshData](/interfaces/meshData.md), [BoundingBox](/core/bounding-box.md), [BoundingSphere](/core/bounding-box.md)