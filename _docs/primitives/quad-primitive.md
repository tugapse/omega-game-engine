## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| QuadPrimitive | primitives/quad-primitive.md |

This component is responsible for procedurally generating the geometric data required to render a simple square plane, or quad. It encapsulates the necessary vertex positions, surface normals, and texture coordinates (UVs) into a structured format suitable for rendering pipelines. Its primary function is to provide a standardized, reusable mesh primitive for basic geometric representation within the engine.

As a concrete implementation of [MeshData](/core/mesh.md), the `QuadPrimitive` serves as a fundamental building block within the engine's geometry data model. It allows developers to instantiate a basic, flat surface without needing to manually define the vertex buffers, making it a core utility for scene construction and primitive generation.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| QuadPrimitive | Class | Creates a new instance of QuadPrimitive. The constructor generates a single square plane mesh centered at the origin, with a side length determined by the `size` parameter. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The constructor calculates the four corner vertices based on the provided `size`. It then uses the internal `addFace` helper function to populate arrays for vertices, normals, and UVs. A quad is defined by two triangles, and the indices array is constructed to correctly reference these four vertices for rendering.
- **Side Effects:** None. The class constructs and populates internal data arrays based on input parameters.
- **Error Handling:** None. The constructor assumes valid numeric inputs for size.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** gl-matrix
- **Internal:** [MeshData](/core/mesh.md)