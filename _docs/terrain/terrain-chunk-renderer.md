## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| TerrainChunkRenderer | [src/terrain/terrain-chunk-renderer.ts](/src/terrain/terrain-chunk-renderer.ts) |

This component is responsible for rendering a single terrain chunk by managing its geometry buffers and determining the appropriate Level of Detail (LOD) based on camera distance. It bypasses standard mesh data structures, instead writing vertex buffers directly from the chunk's height data, which is necessary for dynamic terrain rendering. The rendering process is highly dependent on the chunk's height data changing, triggering a buffer rewrite via the `refresh` method.

Architecturally, `TerrainChunkRenderer` inherits from [MeshRendererBehaviour](/src/terrain/behaviours/renderer/mesh-renderer-behaviour.md) and acts as a specialized renderer within the terrain system. It utilizes data from [TerrainChunkData](/src/terrain/terrain-data.md) and [TerrainGrid](/src/terrain/terrain-data.md) to generate geometry, and it interacts with [TerrainShader](/src/terrain/terrain-shader.md) to handle the actual drawing calls.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `lodDistances` | Property | An array of numbers defining the distance thresholds (in meters) for LOD levels 0, 1, and 2. |
| `skirtDepth` | Property | A number defining how far the terrain skirt hangs below the border in meters. |
| `lod` | Property | The current Level of Detail index being used for rendering this frame. |
| `distanceTo(point: vec3 | undefined): number` | Method | Calculates the distance in meters from a given world point to the nearest point on the chunk's bounding box. |
| `worldBounds(out: Sphere): boolean` | Method | Calculates the world-space bounding sphere for the chunk, populating the provided `Sphere` object. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component initializes by setting up vertex, normal, and UV buffers. In `initializeShader`, it pre-calculates and stores index buffers for all defined LOD levels using `chunkIndices`. The `refresh` method checks the chunk's `heightVersion`; if it has changed, it calls `fillChunkVertices` to regenerate the vertex data (positions, normals, UVs) and uploads these new arrays to the GPU buffers. The `beforeRender` hook first calls `refresh`, then determines the current LOD using `chooseLod` based on the camera's position, and updates the shader's index buffer accordingly.
- **Side Effects:** The code interacts heavily with the WebGL context (`this._gl`) by creating, binding, and deleting `WebGLBuffer` objects for geometry and indices. It mutates the internal state (`this.version`, `this.lod`) and modifies the shader's buffer references.
- **Error Handling:** The `refresh` method includes a guard clause to prevent unnecessary recalculations if the chunk's height version matches the last built version, unless `force` is true.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [MeshRendererBehaviour](/src/terrain/behaviours/renderer/mesh-renderer-behaviour.md), [MeshData](/src/core/mesh.md), [Sphere](/src/core/render/culling.md), [Camera](/src/entities/camera.md), [TerrainChunkData](/src/terrain/terrain-data.md), [TerrainGrid](/src/terrain/terrain-data.md), [TerrainShader](/src/terrain/terrain-shader.md)