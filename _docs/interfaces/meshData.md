## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| IMeshData | [src/interfaces/meshData.ts](/src/interfaces/meshData.ts) |

This interface defines the complete structural contract for geometric mesh data within the system. It encapsulates all necessary components for rendering 3D models, including vertex positions (`vertices`), texture coordinates (`uvs`), and connectivity information (`indices`). Furthermore, it provides optional fields for advanced rendering techniques like normal mapping (`tangents`, `bitangents`).

This component serves as a core data model within the application's data layer. By extending [JsonSerializable](/src/core/json-serializable.md), it ensures that mesh data can be reliably serialized and deserialized, fitting into the broader data exchange architecture alongside other structured data types.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| IMeshData | Interface | Defines the structure for geometric mesh data, including vertices, normals, UVs, indices, and optional tangents/bitangents. |
| calculateNormals | Method | Calculates smooth normals for the mesh based on its vertices and indices. |
| invertNormals | Method | Inverts the direction of all normal vectors in the mesh. |
| calculateTangentsAndBitangents | Method | Calculates tangents and bitangents for the mesh. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The interface defines methods that encapsulate geometric calculations. `calculateNormals` computes smooth normals, `invertNormals` performs a vector negation operation across all normals, and `calculateTangentsAndBitangents` derives tangent and bitangent vectors from existing mesh data.
- **Side Effects:** None. The methods operate on the state defined within the `IMeshData` instance.
- **Error Handling:** None explicitly defined in the interface structure.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [JsonSerializable](/src/core/json-serializable.md)