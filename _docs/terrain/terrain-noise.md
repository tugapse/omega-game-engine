## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **TerrainNoise** | [src/terrain/terrain-noise.ts](/src/terrain/terrain-noise.ts) |

This component is responsible for generating procedural terrain heightmaps using seeded 2D gradient noise and fractal summation (often referred to as Perlin or Simplex noise variations). It provides the mathematical infrastructure necessary to create natural-looking, repeatable terrain features like hills and ridges based on a provided seed.

It functions as a core utility service within the terrain generation pipeline. It takes configuration parameters, such as scale, octaves, and persistence, to control the complexity and appearance of the noise, and then applies this noise function to populate the height data within a [TerrainGrid](/src/terrain/terrain-data.md).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `seededRandom(seed: number): () => number` | Function | Creates and returns a seeded pseudo-random number generator function. The returned function yields a float between 0 and 1. |
| `Noise2D` | Class | Implements 2D gradient noise generation. The constructor initializes permutation tables based on a seed. The `get(x, z, period)` method returns the noise value at coordinates (x, z). |
| `ReliefOptions` | Interface | Defines the configuration structure for terrain relief generation, including parameters like `scale`, `octaves`, `amplitude`, and `ridges`. |
| `relief(noise: Noise2D, x: number, z: number, o: Required<ReliefOptions>): number` | Function | Calculates the final height value at a specific point (x, z) by summing multiple octaves of noise, applying persistence, and scaling the result according to `ReliefOptions`. |
| `DEFAULT_RELIEF` | Constant | A predefined, required configuration object containing default values for `ReliefOptions`. |
| `generateRelief(grid: TerrainGrid, options: ReliefOptions = {}): void` | Function | Iterates over every chunk in the provided [TerrainGrid](/src/terrain/terrain-data.md) and calculates the height for every point within that chunk using the `relief` function, updating the grid's height data. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The noise generation relies on a seeded random number generator (`seededRandom`) to initialize permutation tables within `Noise2D`. The `get` method calculates noise by interpolating between gradient vectors at surrounding grid points using a smooth cubic function. The `relief` function implements fractal noise summation: it iteratively calls `noise.get` with increasing frequency and decreasing amplitude (controlled by `persistence`) across a set number of `octaves`, summing the results to create complex detail.
- **Side Effects:** The `generateRelief` function mutates the state of the input `TerrainGrid` by writing calculated height values into its internal data structures and incrementing the `heightVersion` of each chunk.
- **Error Handling:** No explicit error handling (try/catch blocks) is present in the provided code. The functions rely on the input parameters conforming to the expected types defined by the interfaces.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `Math` object (used for trigonometric and power functions).
- **Internal:** [TerrainGrid](/src/terrain/terrain-data.md)