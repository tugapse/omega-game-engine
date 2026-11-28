## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **terrain-textures.ts** | [src/terrain/terrain-textures.ts](/src/terrain/terrain-textures.ts) |

This component is responsible for generating procedural, tileable ground textures based on defined material types. It translates abstract terrain properties—such as height variation and color—into concrete texture data structures (`GroundTexture`). It achieves this by utilizing noise functions to drive the height field and color mixing logic for various ground materials like grass, dirt, and rock.

This module serves as a core data generation utility within the terrain system. It relies on the `Noise2D` implementation found in [src/terrain/terrain-noise.ts](/src/terrain/terrain-noise.ts) to provide the underlying randomness necessary for procedural generation. The resulting `GroundTexture` objects are then consumed by rendering pipelines to define surface appearance.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `GroundKind` | Type | Enumerates the available ground materials: 'grass', 'dirt', 'rock', 'snow', 'sand', 'gravel'. |
| `GROUND_KINDS` | Array | A constant array listing all valid `GroundKind` values. |
| `GroundTexture` | Interface | Defines the structure for a generated texture, containing its `size`, `albedo` (color/height), and `normal` (tangent-space normal/roughness). |
| `groundTexture` | Function | Generates a `GroundTexture` for a specified `kind` and `size`, using a provided `seed` for reproducible results. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `groundTexture` function iterates over a grid defined by `size`. For each texel, it calls the specific `height` and `color` functions defined within the `RECIPES` map corresponding to the requested `GroundKind`. Height values are calculated using noise functions (`f`), and the color is determined by mixing base colors based on height and noise patterns. Normal maps are derived by calculating the difference in height values between adjacent texels and normalizing the resulting vector.
- **Side Effects:** None. The function is purely computational, generating new arrays based on input parameters.
- **Error Handling:** The code relies on the input `kind` being valid within `RECIPES`. If an invalid kind were passed, `RECIPES[kind]` would result in `undefined`, leading to a runtime error during property access.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `Math` (built-in JavaScript functions).
- **Internal:** [src/terrain/terrain-noise.ts](/src/terrain/terrain-noise.ts)