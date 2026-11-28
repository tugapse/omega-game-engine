## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **MeshData** | [src/core/mesh.ts](/src/core/mesh.ts) |

This component defines the `MeshData` class, which serves as the core data structure for representing geometric meshes in the system. It encapsulates fundamental mesh attributes such as vertex positions (`vec3[]`), vertex normals (`vec3[]`), texture coordinates (`vec2[]`), and connectivity information via indices (`number[]`). It also supports optional storage for tangent and bitangent vectors, crucial for advanced rendering techniques like normal mapping.

The `MeshData` class implements `IMeshData` and `JsonSerializable`, positioning it as a primary data model within the engine's asset pipeline. It works alongside the `Mesh` class, which acts as a container or reference wrapper around the raw `MeshData`, facilitating serialization and sharing of mesh data across different parts of the application architecture.

| Component | Source File |
| :--- | :--- |
| **Mesh** | [src/core/mesh.ts](/src/core/mesh.ts) |

The `Mesh` class acts as a high-level reference wrapper for `MeshData`. Its primary responsibility is to manage and provide access to a shared instance of `MeshData`, allowing multiple parts of the engine to reference the same geometric data efficiently. It handles the serialization and deserialization of the contained `MeshData` object, ensuring data integrity when moving mesh definitions between runtime memory and persistent storage.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `MeshData.instanciate()` | Static Method | Creates a new `MeshData` instance, optionally accepting arrays for vertices, normals, UVs, and indices. |
| `MeshData` | Class | Base class for geometric mesh data, implementing `IMeshData` and `JsonSerializable`. |
| `MeshData.calculateNormals()` | Method | Computes smooth vertex normals by averaging face normals derived from the mesh indices and vertices, updating `this.normals`. |
| `MeshData.getBoundingBox()` | Static Method | Calculates and returns a `BoundingBox` object encompassing all provided vertices. |
| `MeshData.getBoundingSphere()` | Static Method | Calculates and returns a `BoundingSphere` object whose center is the mesh centroid and radius is the maximum distance to any vertex. |
| `MeshData.invertNormals()` | Method | Multiplies all stored normal vectors by -1, effectively flipping the orientation of all faces. |
| `MeshData.calculateTangentsAndBitangents()` | Method | Computes tangent and bitangent vectors for every vertex based on vertex positions, normals, and UV coordinates, populating `this.tangents` and `this.bitangents`. |
| `MeshData.toJsonObject()` | Method | Serializes the mesh data, including all attributes, into a `JsonSerializedData` object. |
| `MeshData.fromJson()` | Method | Deserializes the mesh data from a `JsonSerializedData` object, populating instance properties. |
| `Mesh` | Class | Container class that holds a reference to a `MeshData` instance. |
| `Mesh.toJsonObject()` | Method | Serializes the `Mesh` object, including the serialized data from its contained `meshData`. |
| `Mesh.fromJson()` | Method | Deserializes the `Mesh` object, reconstructing the `meshData` instance from the provided `JsonSerializedData`. |

## 3. Implementation Details & Side Effects
- **Core Logic:**
    - `MeshData.calculateNormals()` uses triangle iteration over indices to compute face normals via the cross product of edge vectors. These face normals are then summed and averaged per vertex to produce smooth vertex normals.
    - `MeshData.calculateTangentsAndBitangents()` calculates tangents and bitangents per triangle using the relationship between edge vectors and the change in UV coordinates ($\Delta U, \Delta V$). These per-triangle results are accumulated and then refined using the vertex normal to ensure orthogonality.
    - Bounding calculations utilize iterative min/max tracking for the box and centroid calculation followed by maximum distance finding for the sphere.
- **Side Effects:**
    - `console.warn` and `console.log` calls are present for reporting warnings during calculation failures and successful operations.
- **Error Handling:**
    - `MeshData.calculateNormals()` checks for empty vertex arrays and validates indices against vertex count, issuing warnings for invalid triangles.
    - `MeshData.calculateTangentsAndBitangents()` checks for the presence of indices, UVs, and normals, issuing warnings if any required data is missing. It also handles division by zero during tangent calculation by checking the denominator against an `EPSILON`.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`, `uuid`
- **Internal:** [./json-serializable](/src/core/json-serializable.md), [../interfaces/json-serialized-data](/src/interfaces/json-serialized-data.md), [../interfaces/meshData](/src/interfaces/meshData.md), [./bounding-box](/src/core/bounding-box.md)