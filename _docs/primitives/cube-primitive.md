## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| CubePrimitive | [src/primitives/cube-primitive.ts](/src/primitives/cube-primitive.ts) |

This component defines the `CubePrimitive` class, which serves as a concrete implementation of geometric mesh data representing a standard cube. Its primary responsibility is to procedurally generate the necessary vertex, normal, UV, and index data required to render a cube in a 3D environment, based on a specified size.

The `CubePrimitive` acts as a specialized data model within the rendering pipeline. By extending `MeshData`, it provides a concrete, ready-to-use geometry object that can be passed to rendering systems, fitting into the core data structure layer alongside other primitives like spheres or planes.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `CubePrimitive.instanciate()` | Static Method | Creates a new `CubePrimitive` instance, optionally accepting initial geometry data. |
| `CubePrimitive` | Class | Represents a procedurally generated cube primitive, inheriting from `MeshData`. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The constructor calculates the geometry for a cube of a given `size`. It utilizes a private helper function, `addFace`, to systematically build the geometry by defining the 6 faces. Each face is represented by two triangles, and the function populates arrays for vertices, normals, UVs, and indices, ensuring proper indexing for the final mesh data.
- **Side Effects:** None. The class performs internal data construction and initialization.
- **Error Handling:** None.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [../core/mesh](/../core/mesh.md)