## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **TerrainHeightmap** | [src/terrain/terrain-heightmap.ts](/src/terrain/terrain-heightmap.ts) |

This component provides utilities for converting terrain data, represented internally by a `TerrainGrid`, into standardized heightmap formats. It handles the serialization and deserialization between various representations, including raw 16-bit binary data (`.r16`), floating-point arrays for internal processing, and 8-bit grayscale/RGBA formats suitable for image rendering.

It functions as a critical data serialization layer within the terrain system. It allows the core terrain structure, managed by `TerrainGrid` (which is imported from [src/terrain/terrain-data.ts](/src/terrain/terrain-data.ts)), to be persisted to or loaded from external file formats that rely on heightmap grids.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `Heightmap` | Interface | Defines the structure for a heightmap, containing width, height, and the underlying `Uint16Array` data. |
| `gridBounds` | Function | Calculates the bounding box (minimum and maximum chunk coordinates) that encompasses all chunks within a given `TerrainGrid`. Returns `null` if the grid is empty. |
| `exportHeightmap` | Function | Converts the entire terrain represented by a `TerrainGrid` into a `Heightmap` structure. It calculates the necessary dimensions based on the grid's bounds and uses `encodeHeights` to map raw heights to the 16-bit range. |
| `importHeightmap` | Function | Populates the heights of all chunks in a `TerrainGrid` by sampling values from an input `Heightmap`. It uses bilinear interpolation for smooth data transfer. |
| `heightmapToRaw` | Function | Converts a `Heightmap` structure into a raw `Uint8Array` suitable for `.r16` file storage, handling the 16-bit little-endian byte conversion. |
| `rawToHeightmap` | Function | Parses a raw `Uint8Array` (expected to be a square `.r16` file) and reconstructs it into a `Heightmap` object. |
| `rgbaToHeightmap` | Function | Converts an 8-bit RGBA array (e.g., from a canvas) into a `Heightmap`. It scales the 8-bit color value (0-255) to the 16-bit height range (0-65535). |
| `heightmapToRgba` | Function | Converts a `Heightmap` into an 8-bit RGBA `Uint8ClampedArray`, mapping the 16-bit height value to the green channel of the output color. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The functions implement coordinate transformations, bounding box calculations, and interpolation (specifically bilinear interpolation in `importHeightmap`). Data conversion involves bitwise shifting and scaling factors derived from the terrain's height range.
- **Side Effects:** None. The functions operate purely on input data structures (`TerrainGrid`, `Heightmap`, `Uint8Array`) and return new data structures or modify the internal state of the provided `TerrainGrid` object (e.g., updating chunk heights and `heightVersion` in `importHeightmap`).
- **Error Handling:** `gridBounds` returns `null` if the input `TerrainGrid` contains no chunks, which is subsequently checked by `exportHeightmap` to prevent errors.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.
- **Internal:** [src/terrain/terrain-data.ts](/src/terrain/terrain-data.ts)