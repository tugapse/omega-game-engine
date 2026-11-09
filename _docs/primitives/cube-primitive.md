## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| CubePrimitive | primitives/cube-primitive.md |

This component is responsible for procedurally generating the geometric data required to render a standard cube primitive. It encapsulates the vertices, normals, UV coordinates, and indices necessary for a 3D rendering pipeline to draw a closed cuboid shape. Its primary function is to abstract the complex mathematical definition of a cube into a reusable, instantiated data structure.

This class serves as a concrete implementation of the `MeshData` interface within the engine's geometry subsystem. It is used by rendering systems to provide the raw mesh data for drawing operations, fitting into the data model layer that feeds into the rendering pipeline, potentially interacting with components like [core/mesh.md] for data storage.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| CubePrimitive.instanciate | Static Method | Creates a new CubePrimitive instance, optionally accepting pre-existing geometry data. |
| CubePrimitive | Class | Represents a procedurally generated cube primitive, initialized with a specified size. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The constructor calculates the geometry for a cube of a given size by defining 6 faces. For each face, it uses the `addFace` helper function to push the 4 vertices, 4 corresponding normals, 4 UV coordinates, and 6 indices (two triangles) into the internal arrays. The faces are defined relative to the cube's center, and the indices are calculated based on the cumulative vertex count.
- **Side Effects:** None. The class constructs and populates internal arrays based on mathematical definitions.
- **Error Handling:** None. The constructor assumes valid input parameters (size) and proceeds with geometry generation.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** gl-matrix
- **Internal:** [core/mesh.md]