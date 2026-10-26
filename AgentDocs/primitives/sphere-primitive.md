## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | SpherePrimitive |
| Source file | sphere-primitive.ts |

The **SpherePrimitive** class is a specialized geometric generator designed to produce a spherical mesh structure. It serves as a procedural factory that translates mathematical spherical coordinates (longitude and latitude) into discrete vertex data, including spatial positions, surface normals, and texture coordinates (UVs).

**Functional Mission**
The primary responsibility of **SpherePrimitive** is to automate the creation of complex spherical geometry, solving the problem of manual vertex definition for curved surfaces. Its core mission is to provide a standardized, parameterizable mesh representation that can be consumed by the rendering pipeline for various applications, such as planetary bodies, projectiles, or environmental elements.

**System Context & Integration**
This component functions as a concrete implementation of mesh data generation. It extends [MeshData](/AgentDocs/core/mesh.md) to provide the necessary buffers for the GPU. The generated data is intended to be utilized by downstream modules such as [MeshRendererBehaviour](/AgentDocs/behaviours/renderer/mesh-renderer-behaviour.md) to render the sphere within a 3D scene. By outputting structured arrays of vertices, normals, and UVs, it facilitates the seamless transition from mathematical abstraction to hardware-accelerated geometry.

## 2. Environment & Configuration
**Environment Lookups:**
No environment lookups identified.

**Hardcoded Constants:**
- `radius` (Default: `1.0`)  The scale of the sphere from its center to its surface.
- `slices` (Default: `32`)  The number of vertical segments (longitude lines) determining horizontal resolution.
- `stacks` (Default: `16`)  The number of horizontal segments (latitude lines) determining vertical resolution.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `SpherePrimitive` | Class | Generates and encapsulates spherical mesh data (vertices, normals, UVs, indices). |

## 4. Execution Logic & Flow
- **Initialization**: The constructor accepts `radius`, `slices`, and `stacks` parameters to define the mesh density and scale. It initializes empty arrays for `vertices`, `normals`, `uvs`, and `indices`.
- **Data Path**: 
    1. **Vertex Generation**: Iterates through `stacks` (phi/latitude) and `slices` (theta/longitude).
    2. **Coordinate Calculation**: Uses trigonometric functions (`sin`, `cos`) to map spherical coordinates to Cartesian `(x, y, z)` space.
    3. **Normal Calculation**: Derives the surface normal by normalizing the position vector (since the sphere is centered at origin).
    4. **UV Mapping**: Maps the normalized `u` and `v` ratios to the vertex.
    5. **Index Generation**: Iterates through the grid to create two triangles per quad, ensuring a counter-clockwise winding order for correct face orientation.
    6. **Super Call**: Passes the completed arrays to the [MeshData](/AgentDocs/core/mesh.md) constructor.
- **Conditional Branching**: No explicit conditional branching; the logic follows a deterministic nested loop structure.

## 5. Resource Dependencies
- **Standard Libraries**: `Math`
- **Internal Modules**: 
    - [MeshData](/AgentDocs/core/mesh.md)
- **External Packages**: 
    - `gl-matrix` (specifically `vec2`, `vec3`)