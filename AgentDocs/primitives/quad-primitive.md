## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | QuadPrimitive |
| Source file | quad-primitive.ts |

The **QuadPrimitive** class is a specialized geometric generator designed to produce a single, two-dimensional square plane within a 3D coordinate system. It serves as a fundamental building block for UI elements, particle sprites, or simple flat surfaces within the engine's rendering pipeline.

**Functional Mission**
The primary responsibility of **QuadPrimitive** is to procedurally generate the vertex, normal, UV, and index data required to represent a quad. It solves the problem of manual mesh definition for common geometric shapes by automating the calculation of vertex positions (centered at the origin), surface normals (pointing towards +Z), and texture coordinate mapping.

**System Context & Integration**
This component functions as a concrete implementation of mesh data generation. It extends [MeshData](/AgentDocs/core/mesh.md) to provide structured geometric buffers. The output of this class is intended to be consumed by [MeshRendererBehaviour](/AgentDocs/behaviours/renderer/mesh-renderer-behaviour.md) or similar entities to facilitate drawing via the GPU. By providing standardized UV mapping and normals, it ensures that any material applied to the quad behaves predictably regarding lighting and texture projection.

- **INTERNAL REFERENCES**: [MeshData](/AgentDocs/core/mesh.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `size` (Default: `2.0`)  The side length of the generated square.
- `[0.0, 0.0, 1.0]`  The hardcoded normal vector for the front face (+Z).

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `QuadPrimitive` | Class | Generates and stores quad-based mesh geometry. |
| `constructor` | Function | Initializes the quad, calculates vertex positions, and populates geometry buffers. |

## 4. Execution Logic & Flow
- **Initialization**: The constructor accepts an optional `size` parameter. It calculates `halfSize` to ensure the quad is centered at `(0,0,0)`.
- **Data Path**: 
    1. **Input**: `size` (number).
    2. **Processing**: 
        - An internal helper `addFace` is defined to encapsulate the logic of pushing 4 vertices, 4 normals, and 4 UVs into arrays, while generating 6 indices (two triangles) for the face.
        - The `addFace` function is invoked once to create a single front-facing quad on the XY-plane.
        - Vertices are mapped from `-halfSize` to `halfSize`.
        - UVs are mapped from `[0,0]` to `[1,1]`.
    3. **Output**: Calls `super()` with the populated `vertices`, `normals`, `uvs`, and `indices` arrays to instantiate the [MeshData](/AgentDocs/core/mesh.md) base class.
- **Conditional Branching**: No conditional branching logic is present in the current implementation.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [MeshData](/AgentDocs/core/mesh.md)
- **External Packages**: 
    - `gl-matrix` (for `vec2` and `vec3` type definitions)