## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| LathePrimitive | /primitives/lathe-primitive.ts |

This component is responsible for generating the geometric data (vertices, normals, UVs, indices) required to render a surface of revolution, commonly known as a lathe shape. It takes a profile defined by a series of [radius, height] points and sweeps this profile around the Y-axis over a specified angle. The resulting mesh represents shapes like vases, bottles, or bowling pins.

It serves as a concrete implementation of the `MeshData` abstract concept within the rendering pipeline. By inheriting from [MeshData](/core/mesh.md), it provides a standardized way to define complex, mathematically derived geometry that can then be consumed by the engine's rendering system.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| LathePrimitive | Class | Represents a surface of revolution mesh. Instantiated via `instanciate()` or the constructor. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The constructor calculates the mesh geometry by iterating over the input profile points. For each profile point, it generates a set of vertices, normals, and UV coordinates corresponding to the specified number of angular segments (`segments`) and sweep angle (`sweep`). The vertices are calculated using polar coordinates derived from the profile's radius and the sweep angle. Indices are then constructed to form triangular faces connecting the points generated along the profile segments.
- **Side Effects:** None. The class constructs and returns a `MeshData` object containing raw geometric arrays.
- **Error Handling:** The code includes fallback logic using `|| 1` when calculating lengths (`len` and `total`) to prevent division by zero if segments or profile changes are zero, ensuring deterministic behavior.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [MeshData](/core/mesh.md)