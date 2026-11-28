## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| TrianglePrimitive | [src/primitives/triangle-primitive.ts](/src/primitives/triangle-primitive.ts) |

This component defines the `TrianglePrimitive`, a concrete implementation of a basic geometric shape—a 2D triangle. Its primary responsibility is to encapsulate all necessary vertex data (positions, normals, texture coordinates) and connectivity information (indices) required to render a single, standardized triangle geometry.

This class serves as a fundamental data model within the rendering pipeline. By extending `MeshData`, it provides a standardized structure for primitive geometry, allowing the core rendering system to process and draw various shapes uniformly, such as those defined in [../core/mesh.md](/../core/mesh.md).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| TrianglePrimitive | Class | Represents a simple, procedurally generated 2D triangle primitive, extending MeshData. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The constructor initializes the triangle by defining three vertices, their corresponding normals (all pointing along the Z-axis, indicating outward facing on the XY plane), and texture coordinates. It then constructs the index buffer using the indices [0, 1, 2] to define the single triangle face.
- **Side Effects:** None.
- **Error Handling:** None.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [../core/mesh.md](/../core/mesh.md)