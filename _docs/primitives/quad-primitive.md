## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| QuadPrimitive | [src/primitives/quad-primitive.ts](/src/primitives/quad-primitive.ts) |

This component provides a concrete implementation of a basic geometric primitive: a quad (square plane). Its primary responsibility is to procedurally generate the necessary vertex, normal, UV, and index data required to render a flat, square mesh in a 3D environment. It encapsulates the geometric definition of a quad, allowing it to be instantiated with a specified side length.

The `QuadPrimitive` class extends `MeshData`, positioning it within the core data model responsible for holding renderable geometry. It serves as a foundational building block for more complex scene geometry, allowing developers to easily create standardized planar surfaces without manual buffer construction.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| QuadPrimitive | Class | Creates a new instance of QuadPrimitive. This constructor generates a single square plane mesh, centered at the origin, lying on the XY-plane. Accepts an optional `size` parameter to define the side length. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The constructor initializes arrays for vertices, normals, UVs, and indices. It utilizes a private helper function, `addFace`, which takes the coordinates and attributes of four vertices defining a face. This function populates the geometry arrays, specifically defining the two triangles that constitute the quad. The quad is constructed by explicitly defining the vertices and faces for the front face (+Z direction).
- **Side Effects:** None. The class constructs and populates internal data structures based on input parameters.
- **Error Handling:** None.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [../core/mesh](/../core/mesh.md)