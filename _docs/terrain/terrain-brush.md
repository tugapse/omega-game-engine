## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| TerrainBrush | [src/terrain/terrain-brush.ts](/src/terrain/terrain-brush.ts) |

This component provides the core logic for manipulating terrain data, allowing users to sculpt heightmaps or paint material layers across a [TerrainGrid](/src/terrain/terrain-data.md). It implements various sculpting tools—such as raising, lowering, smoothing, flattening, and noise application—by applying localized modifications based on a brush's defined radius and strength.

It functions as a critical service layer within the terrain system, operating purely on the data structures provided by [TerrainGrid](/src/terrain/terrain-data.md). It is designed to be deterministic, allowing height modifications to be tested in environments like Node.js, while also supporting dynamic changes in a running game context.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `SculptTool` | Type | Defines the available modes for terrain modification: 'raise', 'lower', 'smooth', 'flatten', or 'noise'. |
| `BrushSettings` | Interface | Defines the parameters for a sculpting operation, including `radius` (in meters), `strength` (modification intensity), and `hardness` (edge sharpness). |
| `DEFAULT_BRUSH` | Constant | A predefined set of `BrushSettings` used as a default configuration. |
| `brushFalloff` | Function | Calculates the brush's weight (0 to 1) at a given normalized distance `t` and `hardness`. |
| `VertexRect` | Interface | Defines a bounding box of global vertices affected by a stroke, using inclusive coordinates. |
| `sculpt` | Function | Executes one step of a sculpting tool on the grid at a specific world coordinate, returning the affected vertex rectangle or null if no changes occurred. |
| `touchAround` | Function | Iterates over all chunks in the grid and increments their `heightVersion` if they overlap the area defined by `VertexRect`, ensuring boundary normals are recalculated. |
| `paint` | Function | Applies or erases material layers onto the terrain chunks based on a brush stroke, returning an array of chunks that were modified. |
| `fillSplat` | Function | Iterates over all chunks, calling a provided callback function to determine weights at every splat texel, and then bakes these weights into the chunk's splat data, ensuring weights sum correctly. |
| `clearSplat` | Function | Resets all material layer weights across every chunk in the grid to zero. |
| `TerrainHistory` | Class | Manages the undo/redo stack for terrain modifications, allowing strokes to be saved, restored, and reverted based on either height or splat data. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `sculpt` function reads all initial heights before modification to prevent cascading changes during smoothing. The `paint` function uses a falloff calculation to determine how much the brush affects individual texels, applying blending or fading based on the `erase` flag. `TerrainHistory` uses `Map` structures to store deep copies of chunk data (`ChunkCopy`) before modifications begin.
- **Side Effects:** The code mutates the state of the `TerrainGrid` by calling `grid.setVertexHeight()` in `sculpt`, and by modifying `c.splat` arrays in `paint`, `fillSplat`, and `clearSplat`. `touchAround` mutates the `heightVersion` property of `TerrainChunkData`.
- **Error Handling:** `sculpt` returns `null` if the calculated bounding box is invalid or if no height changes occur within the brush area. `TerrainHistory` handles stack overflow by enforcing a `limit` on the undo stack.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `Math` object (built-in).
- **Internal:** [./terrain-data](/src/terrain/terrain-data.md), [./terrain-noise](/src/terrain/terrain-noise.md).