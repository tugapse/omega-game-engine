## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| IMeshData | /interfaces/meshData.md |

This interface defines the complete data structure required to represent a geometric mesh within the application. It encapsulates all necessary components for rendering, including vertex positions, surface normals, texture coordinates (UVs), and the connectivity information provided by indices. Furthermore, it supports optional tangent and bitangent vectors, which are crucial for advanced rendering techniques like normal mapping.

This component serves as a core data model within the application's rendering pipeline. It acts as a contract for any object that needs to hold mesh geometry, ensuring consistency across systems that consume or generate mesh data, such as those interacting with the [JsonSerializable](/core/json-serializable.md) system or the rendering engine itself.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| IMeshData | Interface | Defines the structure for geometric mesh data, including methods for calculation and manipulation. |
| calculateNormals | Method | Calculates smooth normals for the mesh based on its vertices and indices. |
| invertNormals | Method | Inverts the direction of all normal vectors in the mesh. |
| calculateTangentsAndBitangents | Method | Calculates tangents and bitangents for the mesh. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The interface defines methods that implement geometric calculations. `calculateNormals` computes smooth normals by averaging vertex normals across shared faces. `calculateTangentsAndBitangents` performs the necessary vector math to derive tangent and bitangent vectors from vertex positions, normals, and UV coordinates.
- **Side Effects:** None. The methods operate by mutating the internal state of the object instance they are called upon.
- **Error Handling:** None specified in the interface definition.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** gl-matrix
- **Internal:** [JsonSerializable](/core/json-serializable.md)