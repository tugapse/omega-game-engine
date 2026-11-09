## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| TrianglePrimitive | primitives/triangle-primitive.md |

This component defines the `TrianglePrimitive` class, which serves as a concrete implementation of a basic geometric primitivea 2D triangle. Its primary responsibility is to encapsulate all the necessary vertex, normal, UV, and index data required to render a standardized triangle shape centered at the origin on the XY-plane.

This class functions as a fundamental data model within the rendering pipeline. It inherits from `MeshData` and provides a pre-configured, ready-to-use geometric asset, allowing other systems, such as a scene graph or renderer, to instantiate and draw a canonical triangle without needing to manually construct the underlying buffer data.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| TrianglePrimitive | Class | Represents a simple, procedurally generated 2D triangle primitive. Instantiates with fixed vertex, normal, UV, and index data. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The constructor initializes the primitive by defining three vertices, three corresponding normals (all pointing along the Z-axis), three texture coordinates (UVs), and a single index array defining the triangle's connectivity (0, 1, 2). These arrays are passed up to the parent `MeshData` constructor.

- **Side Effects:** None.

- **Error Handling:** None.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [core/mesh](/core/mesh.md)