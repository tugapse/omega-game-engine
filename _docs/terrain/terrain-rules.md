## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **terrain-rules.ts** | [src/terrain/terrain-rules.ts](/src/terrain/terrain-rules.ts) |

This component defines the data structures and procedural logic for determining terrain characteristics based on environmental factors like height and slope. Its primary responsibility is to encapsulate the rules—such as which layer (grass, rock, snow) should appear where—and provide functions to calculate the weights for these layers at any given world coordinate.

This file serves as a core data model and calculation service within the terrain generation pipeline. It relies on definitions from [./terrain-textures](/src/terrain/terrain-textures.md) for ground types and [./terrain-data](/src/terrain/terrain-data.md) for configuration limits, allowing the rules to be tested in Node environments before being baked into shaders.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `TerrainLayer` | Interface | Defines the properties of a single terrain layer, including texture references, tiling, blending parameters, and placement rules (height, slope). |
| `makeLayer` | Function | Constructs a new `TerrainLayer` object, applying sensible defaults and allowing overrides via a partial configuration object. |
| `defaultLayers` | Function | Returns a predefined array of `TerrainLayer` objects representing the standard terrain composition (grass, dirt, rock, snow). |
| `noise3D` | Function | Implements a 3D Perlin-like noise function using hashing to generate continuous, pseudo-random values based on spatial coordinates. |
| `ruleNoise` | Function | Calculates a specific noise value used by the terrain rules, combining two different frequency noise calls and normalizing the result. |
| `terrainAutoWeights` | Function | Calculates the weight contribution of every defined terrain layer at a specific point $(x, y, z)$ based on height, slope, and noise, returning an array of weights summing towards 1. |
| `packLayerUniforms` | Function | Converts an array of `TerrainLayer` objects into four packed `Float32Array` uniforms (tiling, height, slope, tint) suitable for direct consumption by a shader program. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component implements several mathematical utilities: `fract` for fractional parts, `hash3D` for deterministic pseudo-randomness, and `smoothstep` for smooth transitions. The core logic revolves around `terrainAutoWeights`, which iteratively calculates layer weights. For each layer, it checks if the input height and slope fall within the layer's defined ranges, modulated by noise, using the `band` function to create smooth falloffs. The weights are then adjusted multiplicatively based on the layers already processed.
- **Side Effects:** None. The functions perform pure mathematical calculations and array manipulations based on input parameters.
- **Error Handling:** The `band` function includes a minor safeguard by ensuring the blend factor `b` is never less than $0.0001$ to prevent division by zero or extreme behavior during smoothing.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `Math` object (standard JavaScript math functions).
- **Internal:** [./terrain-textures](/src/terrain/terrain-textures.md), [./terrain-data](/src/terrain/terrain-data.md).