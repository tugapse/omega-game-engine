## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | CubePrimitive |
| Source file | cube-primitive.ts |

The **CubePrimitive** class serves as a specialized factory for generating standardized 3D cubic geometry. It encapsulates the mathematical logic required to define the vertices, normals, and texture coordinates (UVs) necessary to construct a six-faced cube, ensuring consistent geometric data for rendering.

**Functional Mission**
The primary responsibility of **CubePrimitive** is to provide a procedurally generated mesh representation of a cube. It solves the problem of manual vertex definition by automating the creation of a watertight, six-sided volume with correct face normals and UV mapping, which is essential for lighting and texturing calculations.

**System Context & Integration**
This component acts as a concrete implementation of geometric data structures. It extends [MeshData](/AgentDocs/core/mesh.md) to provide structured arrays that are consumed by the rendering pipeline. The output of this class is typically passed to a [MeshRendererBehaviour](/AgentDocs/behaviours/renderer/mesh-renderer-behaviour.md) or used to populate an entity's visual representation within a [Scene](/AgentDocs/entities/scene.md). By providing pre-calculated normals, it directly enables correct shading when used with [LitMaterial](/AgentDocs/materials/lit-material.md).

- **INTERNAL REFERENCES**: [MeshData](/AgentDocs/core/mesh.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `size` (Default: `2.0`)  The edge length of the cube used during geometric calculation.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `CubePrimitive` | Class | A specialized mesh data provider for cubic geometry. |
| `instanciate` | Static Method | A factory method intended to create instances (currently returns a default new instance). |
| `constructor` | Function | Orchestrates the procedural generation of vertices, normals, UVs, and indices based on a provided size. |

## 4. Execution Logic & Flow
- **Initialization**: The constructor accepts a `size` parameter. It calculates `halfSize` to determine the vertex offsets from the origin $(0,0,0)$.
- **Data Path**: 
    1. **Input**: `size` (number).
    2. **Processing**: 
        - An internal helper `addFace` is defined to handle the repetitive task of pushing 4 vertices, 4 normals, and 4 UVs per face.
        - The `addFace` function calculates the index offsets to ensure the `indices` array correctly forms two triangles per face.
        - Six calls to `addFace` are executed, one for each cardinal direction (+Z, -Z, +Y, -Y, +X, -X).
    3. **Output**: A populated `MeshData` object containing the complete geometric buffers.
- **Conditional Branching**: No conditional branching logic is present in the current implementation.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [MeshData](/AgentDocs/core/mesh.md)
- **External Packages**: 
    - `gl-matrix` (specifically `vec2`, `vec3`)