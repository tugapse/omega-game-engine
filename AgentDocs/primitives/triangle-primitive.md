## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | TrianglePrimitive |
| Source file | triangle-primitive.ts |

The **TrianglePrimitive** class serves as a specialized implementation of a geometric primitive, specifically designed to generate a single, procedurally defined 2D triangle. It functions as a data provider that encapsulates the raw geometric attributes required to construct a triangular mesh within the engine's rendering pipeline.

**Functional Mission**
The primary responsibility of **TrianglePrimitive** is to provide a standardized, hardcoded set of vertex data (positions, normals, and UV coordinates) for a single triangle centered on the XY-plane. It solves the problem of needing a lightweight, predictable geometric shape for testing, UI elements, or basic procedural geometry without the overhead of external file parsing.

**System Context & Integration**
This component acts as a concrete implementation of [MeshData](/AgentDocs/core/mesh.md). It is intended to be consumed by higher-level entities or mesh renderers that require raw buffer data. By extending [MeshData](/AgentDocs/core/mesh.md), it ensures that the generated geometry is compatible with the engine's standard vertex attribute layouts, facilitating seamless integration with [MeshRendererBehaviour](/AgentDocs/behaviours/renderer/mesh-renderer-behaviour.md) and subsequent GPU buffer uploads.

## 2. Environment & Configuration
**Environment Lookups:**
No environment lookups identified.

**Hardcoded Constants:**
- `vertices` (Default: `[[0.0, 1.0, 0.0], [-1.0, -1.0, 0.0], [1.0, -1.0, 0.0]]`)  Defines the 3D spatial coordinates of the triangle vertices.
- `normals` (Default: `[[0.0, 0.0, 1.0], [0.0, 0.0, 1.0], [0.0, 0.0, 1.0]]`)  Defines the surface direction (pointing towards positive Z).
- `uvs` (Default: `[[0.5, 1.0], [0.0, 0.0], [1.0, 0.0]]`)  Defines texture coordinate mapping for the vertices.
- `indices` (Default: `[0, 1, 2]`)  Defines the winding order for the triangle primitive.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `TrianglePrimitive` | Class | Provides a pre-configured mesh containing a single triangle's geometric data. |

## 4. Execution Logic & Flow
- **Initialization**: Upon instantiation via the `constructor`, the class defines three local arrays: `vertices` (vec3), `normals` (vec3), and `uvs` (vec2), alongside a numeric `indices` array.
- **Data Path**: 
    1. **Input**: Hardcoded geometric constants are defined within the constructor scope.
    2. **Processing**: The data is structured into specific typed arrays compatible with the expected `MeshData` signature.
    3. **Output**: The `super()` call passes these arrays to the [MeshData](/AgentDocs/core/mesh.md) base class, finalizing the object state.
- **Conditional Branching**: No conditional branching identified.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [MeshData](/AgentDocs/core/mesh.md)
- **External Packages**: 
    - `gl-matrix` (for `vec2`, `vec3` types)