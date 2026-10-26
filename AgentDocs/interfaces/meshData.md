## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | IMeshData |
| Source file | meshData.ts |

The **IMeshData** interface serves as the fundamental structural blueprint for geometric data within the engine. It defines the contract for how raw vertex informationincluding positions, normals, texture coordinates, and indicesmust be organized to be compatible with the engine's rendering pipeline and geometric processing utilities.

**Functional Mission**
The primary responsibility of **IMeshData** is to provide a standardized, serializable schema for mesh geometry. It solves the problem of data consistency by ensuring that any object representing a 3D mesh provides the necessary buffers (vertices, normals, UVs, indices) and optional tangent space data required for advanced shading techniques like normal mapping.

**System Context & Integration**
This interface acts as a data transfer object (DTO) between geometry parsers (such as those found in `/AgentDocs/parsers/index.md`) and the rendering system. It is a critical dependency for components that handle mesh-based entities, such as [Mesh Renderer Behaviour](/AgentDocs/behaviours/renderer/mesh-renderer-behaviour.md), and provides the structural requirements for any class implementing [JsonSerializable](/AgentDocs/core/json-serializable.md) to ensure geometry can be persisted or transmitted.

- **INTERNAL REFERENCES**: [JsonSerializable](/AgentDocs/core/json-serializable.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `vertices` | vec3[] | Stores the spatial coordinates of each vertex. |
| `normals` | vec3[] | Stores the direction vectors perpendicular to the surface at each vertex. |
| `uvs` | vec2[] | Stores the 2D texture mapping coordinates. |
| `indices` | number[] | Stores the order of vertices used to form primitives (triangles). |
| `tangents` | vec3[] | Optional: Stores tangent vectors for normal mapping. |
| `bitangents` | vec3[] | Optional: Stores bitangent vectors for normal mapping. |
| `uuid` | string | Provides a unique identifier for the mesh instance. |
| `calculateNormals` | Method | Mandates logic to compute smooth vertex normals based on face geometry. |
| `invertNormals` | Method | Mandates logic to flip the direction of all normal vectors. |
| `calculateTangentsAndBitangents` | Method | Mandates logic to compute the tangent space basis. |

## 4. Execution Logic & Flow
Direct structural definitions only; no internal logic flow.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [JsonSerializable](/AgentDocs/core/json-serializable.md)
- **External Packages**: 
    - `gl-matrix` (provides `vec2`, `vec3`)