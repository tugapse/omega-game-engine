## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **Shadows Module** | [src/core/render/shadows.ts](/src/core/render/shadows.ts) |

This module is responsible for the planning phase of shadow mapping. Its primary responsibility is to determine which lights in the scene should cast shadows, how many views (depth maps) each light requires, and where these views should be spatially allocated within a fixed-size shadow atlas texture. It calculates the necessary light matrices and defines the geometric layout for rendering the depth passes, without performing any actual rendering operations itself.

This component acts as a critical service within the rendering pipeline, sitting between the scene graph traversal and the actual ShadowAtlasPass. It consumes a list of active lights and camera position data to generate a `ShadowPlan`, which is then passed to the GPU for batch processing via the `ShadowsBlock` structure defined in this file.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `SHADOW_ATLAS_SIZE` | Constant | The fixed pixel size of the shadow atlas texture (4096). |
| `SHADOW_BUDGET` | Constant | Defines the default maximum number of shadowed lights per type (directional, spot, point). |
| `MAX_SHADOW_SLOTS` | Constant | Total maximum number of shadow slots based on `SHADOW_BUDGET`. |
| `MAX_SHADOW_VIEWS` | Constant | Total maximum number of shadow views based on `SHADOW_BUDGET`. |
| `POINT_FACE_FOV_DEGREES` | Constant | The field of view margin used for point light face rendering (95 degrees). |
| `AtlasRect` | Interface | Defines a rectangular region within the atlas using x, y, and size coordinates. |
| `ATLAS_TILES` | Constant | A predefined layout mapping light types to their initial tile coordinates and sizes. |
| `ShadowView` | Interface | Represents a single depth view, containing the light, its projection matrix, and its atlas rectangle. |
| `ShadowSlot` | Interface | Represents a single light's allocation, tracking its light, the start index of its views, view count, and projection parameters. |
| `ShadowPlan` | Interface | The complete output structure containing the atlas size, all allocated slots, and all individual views. |
| `ShadowPlanOptions` | Interface | Configuration options for the shadow planning process, including custom atlas size and budget overrides. |
| `scaledTile` | Function | Scales a base `AtlasRect` based on a target `atlasSize`. |
| `planShadows` | Function | Orchestrates the selection of shadowed lights and allocates their views into a `ShadowPlan` based on scene order and budget. |
| `directionalMatrix` | Function | Calculates the orthographic projection matrix for a directional light, including camera-snapping logic. |
| `directionalDepthRange` | Function | Calculates the far plane depth range for a directional light's projection. |
| `spotFov` | Function | Calculates the effective field of view in radians for a `SpotLight`, including a margin. |
| `spotMatrix` | Function | Generates the combined projection and view matrix for a `SpotLight`. |
| `CUBE_FACES` | Constant | An array defining the six faces of a cube, used for point light rendering order. |
| `cubeFaceFor` | Function | Determines which face index (0-5) corresponds to a given normalized direction vector. |
| `pointMatrices` | Function | Generates the six perspective matrices required for a `PointLight`, one for each cube face. |
| `SHADOWS_LAYOUT` | Constant | Defines the memory layout offsets (in vec4 slots) for the `ShadowsBlock` UBO. |
| `ShadowFilter` | Enum | Defines the filtering modes for Percentage Closer Filtering (PCF): Hard, Soft, Softer. |
| `packShadows` | Function | Serializes a completed `ShadowPlan` into a flat `Float32Array` conforming to the `std140` layout of the `ShadowsBlock`. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `planShadows` function first filters lights based on `castShadows` and then selects the nearest lights for each type, respecting the defined `SHADOW_BUDGET`. It uses the `nearest` helper to sort lights by distance to the camera (`eye`) and then by their original index in the input `lights` array to maintain scene order. For each selected light, it calculates the appropriate projection matrix (orthographic for directional, perspective for spot/point) and determines the required atlas rectangle using `scaledTile`. The `packShadows` function then maps these geometric and light properties into a contiguous `Float32Array` matching the `ShadowsBlock` memory layout.
- **Side Effects:** None. The functions are purely computational, generating data structures and matrices based on input parameters.
- **Error Handling:** The `planShadows` function uses `Math.min` and `Math.max` when applying budget overrides (`options.budget`) to ensure that the requested budget never exceeds the hard-coded `SHADOW_BUDGET` limits.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix` (for `mat4`, `vec3`).
- **Internal:** [../../enums/entity-type.enum](/src/core/enums/entity-type.enum.md) (via `EntityType`), [../../entities/lights/directional-light](/src/core/entities/lights/directional-light.md) (via `DirectionalLight`), [../../entities/lights/light](/src/core/entities/lights/light.md) (via `Light`), [../../entities/lights/point-light](/src/core/entities/lights/point-light.md) (via `PointLight`), [../../entities/lights/spot-light](/src/core/entities/lights/spot-light.md) (via `SpotLight`).