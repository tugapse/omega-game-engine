## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| TerrainChunkData, TerrainGrid, TerrainSettings | [src/terrain/terrain-data.ts](/src/terrain/terrain-data.ts) |

This component defines the core data structures for representing terrain geometry in a chunked system. It manages height data (`TerrainChunkData`) for localized sections of the world, allowing for efficient storage and retrieval of height values and surface properties like splat textures. The `TerrainGrid` class orchestrates these chunks, managing a sparse collection of chunks across a 2D grid, ensuring that neighboring chunks correctly share border data.

This code serves as the fundamental data model layer for the terrain system. It is responsible for translating between local chunk coordinates, global terrain coordinates (in meters), and discrete vertex/cell indices. It interfaces with external rendering/physics systems by providing methods to query heights and normals at specific points in terrain space, while also managing the complex bookkeeping required for shared borders between adjacent [TerrainChunkData](/src/terrain/terrain-data.ts).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `TerrainSettings` | Interface | Defines configuration parameters for terrain chunks, including resolution, size, and height range. |
| `DEFAULT_TERRAIN_SETTINGS` | Constant | A predefined instance of `TerrainSettings` used as a default configuration. |
| `MAX_TERRAIN_LAYERS` | Constant | The maximum number of texture layers supported by the terrain system. |
| `TerrainChunkData` | Class | Represents a single, localized chunk of terrain data, holding height and splat information. |
| `cellHeight` | Function | Calculates the interpolated height within a single cell based on the heights of its four corners and the relative position within the cell. |
| `encodeHeights` | Function | Converts an array of floating-point heights into a 16-bit unsigned integer array based on a specified height range. |
| `decodeHeights` | Function | Converts a 16-bit unsigned integer array back into an array of floating-point heights using a specified height range. |
| `TerrainGrid` | Class | Manages the collection of `TerrainChunkData` instances, providing spatial querying capabilities across the entire terrain. |

## 3. Implementation Details & Side Effects
- **Core Logic:** `TerrainChunkData` stores heights as a `Float32Array` and splat data as two `Uint8Array`s. Height interpolation (`heightAtLocal`) uses linear interpolation across the two triangles that form a cell. `TerrainGrid` uses a `Map` keyed by coordinate strings to store chunks, implementing logic to ensure border vertices are consistent when adding new chunks (`add`). Global vertex lookups (`holders`, `vertexHeight`) correctly identify which chunks share a specific global vertex coordinate.
- **Side Effects:** None. The component is purely computational and manages in-memory data structures.
- **Error Handling:** The `TerrainGrid` constructor throws an `Error` if the provided resolution is not a power of two or is less than 2.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix` (for `vec3` operations).
- **Internal:** None.