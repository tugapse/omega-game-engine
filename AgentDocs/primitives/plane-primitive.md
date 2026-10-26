## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | PlanePrimitive |
| Source file | plane-primitive.ts |

The **PlanePrimitive** class is a specialized geometric generator designed to produce a flat, grid-based mesh structure. It serves as a fundamental building block for environmental geometry, providing a standardized way to instantiate horizontal surfaces (on the XZ-plane) that can be used for floors, terrains, or boundaries within a 3D scene.

**Functional Mission**
The primary responsibility of **PlanePrimitive** is the procedural generation of vertex, normal, UV, and index data required to represent a square plane. It solves the problem of manual mesh definition by calculating a grid of vertices based on a user-defined resolution, ensuring that the resulting geometry is mathematically consistent and ready for GPU consumption.

**System Context & Integration**
This component functions as a concrete implementation of mesh data generation. It extends [MeshData](/AgentDocs/core/mesh.md) to package raw geometric arrays into a format compatible with the engine's rendering pipeline. The generated data is intended to be consumed by entities and subsequently processed by [MeshRendererBehaviour](/AgentDocs/behaviours/renderer/mesh-renderer-behaviour.md) to be drawn within a [Scene](/AgentDocs/entities/scene.md).

- **INTERNAL REFERENCES**: [MeshData](/AgentDocs/core/mesh.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `segmentSize` (Default: `1.0`)  The distance between adjacent vertices in the grid.
- `y-axis normal` (Default: `0.0, 1.0, 0.0`)  The fixed upward direction for all generated surface normals.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `PlanePrimitive` | Class | Generates and stores a grid-based plane mesh. |
| `constructor(resolution)` | Function | Initializes the mesh by calculating vertex positions, normals, UV coordinates, and triangle indices based on the provided segment count. |

## 4. Execution Logic & Flow
- **Initialization**: 
    - Receives `resolution` parameter.
    - Sanitizes input using `Math.max(1, Math.floor(resolution))` to ensure a valid integer $\ge 1$.
    - Calculates `halfSize` (total span / 2) and `segmentSize` to establish the coordinate bounds.
- **Data Path**:
    - **Vertex/UV/Normal Generation**: A nested loop iterates through the resolution grid. For each point $(i, j)$, it calculates the $X$ and $Z$ coordinates, pushes a constant upward normal, and calculates normalized $U, V$ coordinates $(0.0 \text{ to } 1.0)$.
    - **Index Generation**: A second nested loop iterates through the segments. It calculates a `baseIndex` for the current grid cell and pushes two sets of three indices to form two triangles (counter-clockwise/clockwise winding) per grid square.
    - **Output**: The accumulated arrays are passed to the `super` constructor of [MeshData](/AgentDocs/core/mesh.md).
- **Conditional Branching**:
    - Input validation: If `resolution` is less than 1, it is clamped to 1.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [MeshData](/AgentDocs/core/mesh.md)
- **External Packages**: 
    - `gl-matrix` (for `vec2`, `vec3` math operations)