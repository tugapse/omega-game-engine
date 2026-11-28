## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| PlanePrimitive | [src/primitives/plane-primitive.ts](/src/primitives/plane-primitive.ts) |

This component defines the `PlanePrimitive` class, which is responsible for procedurally generating the geometric data for a flat, square plane mesh. It constructs the necessary vertices, normals, UV coordinates, and triangle indices based on a specified resolution, allowing for customizable mesh density.

This class inherits from [MeshData](/core/mesh.md) and serves as a concrete implementation of a geometric primitive within the engine's data model. It is instantiated either directly or via its static factory method, `instanciate`, typically when loading configuration data from external sources.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `PlanePrimitive.instanciate()` | Static Method | Factory method used by `ObjectInstanciator` to create a `PlanePrimitive` instance, accepting optional pre-loaded mesh data. |
| `PlanePrimitive` | Class | Represents a procedurally generated plane primitive, initialized with a resolution parameter to define its grid size. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The constructor iterates through a grid defined by the `resolution`. It calculates the world coordinates (X, Z) for each vertex, sets the normal to point along the Y-axis (0, 1, 0) since the plane lies on the XZ-plane, and calculates corresponding UV coordinates. It then populates the `indices` array by defining two triangles for every quad segment in the grid.
- **Side Effects:** None.
- **Error Handling:** The constructor enforces a minimum resolution of 1 by using `Math.max(1, Math.floor(resolution))`, ensuring the generation process does not fail due to zero or negative input.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [MeshData](/core/mesh.md)