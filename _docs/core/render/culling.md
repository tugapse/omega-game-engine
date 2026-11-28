## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **Culling Logic** | [core/render/culling.ts](/core/render/culling.ts) |

This component provides mathematical utilities essential for visibility determination, specifically implementing frustum culling and sphere-based bounding volume checks. Its primary responsibility is to efficiently determine if geometric objects, represented by bounding spheres, lie within the viewing frustum defined by the camera's projection matrix.

This code functions as a core utility service within the rendering pipeline. It relies on geometric primitives and matrix transformations to perform spatial queries, allowing the engine to discard objects that are guaranteed to be off-screen before expensive rendering operations occur. It interacts with data structures like [MeshData](/core/mesh.md) to calculate object bounds.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `Sphere` | Interface | Defines a bounding sphere structure containing a center vector and a radius. |
| `createSphere()` | Function | Constructs and returns a new, zero-initialized `Sphere` instance. |
| `frustumPlanes(m: mat4, out: Float32Array): Float32Array` | Function | Calculates the six planes defining the view-projection frustum from a given transformation matrix `m`. |
| `sphereInFrustum(planes: Float32Array, center: vec3, radius: number): boolean` | Function | Checks if a sphere is entirely contained within the volume defined by the provided frustum planes. |
| `localBoundingSphere(meshData: MeshData | undefined): Sphere | null` | Function | Computes the smallest bounding sphere for a mesh based on its vertices, utilizing a cache via `WeakMap`. |
| `maxScale(m: mat4): number` | Function | Calculates the maximum scaling factor applied along the axes of a transformation matrix `m`. |
| `transformSphere(out: Sphere, local: Sphere, m: mat4): Sphere` | Function | Transforms a sphere from local space to world space using a transformation matrix `m`, adjusting the radius by the matrix's scale. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `frustumPlanes` function derives the six clipping planes from the columns of the view-projection matrix. `sphereInFrustum` tests the distance of the sphere's center to each plane against the sphere's radius. `localBoundingSphere` iterates over all vertices of a mesh to find the minimum bounding box, calculates the center, and then determines the maximum distance from the center to any vertex to define the radius. `transformSphere` applies the matrix transformation to the center and scales the radius by the matrix's maximum scale factor.
- **Side Effects:** The `localBoundingSphere` function mutates the internal `localSpheres` `WeakMap` to cache computed spheres based on the vertex array reference.
- **Error Handling:** `localBoundingSphere` returns `null` if the input `MeshData` is undefined or contains no vertices. The `frustumPlanes` function handles the case where the calculated length of the plane normal is zero by defaulting the divisor to 1.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix` (for `mat4`, `vec3`)
- **Internal:** [MeshData](/core/mesh.md)