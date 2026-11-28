## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| FrameData Builder | [src/core/render/frame-data.ts](/src/core/render/frame-data.ts) |

This component is responsible for aggregating all necessary rendering information required for a single frame draw call. It takes the current state of the `Scene`, the active `Camera`, and the elapsed `time` to compile a comprehensive `FrameData` structure. This structure encapsulates which entities are visible, how they should be ordered (opaque vs. transparent), and which lights are active for the current rendering pass.

It serves as a critical data preparation service within the rendering pipeline. It sits between the scene graph traversal and the actual rendering passes, ensuring that all subsequent rendering logic—such as depth sorting, culling, and lighting calculations—operates on a pre-filtered and organized dataset derived from the [Scene](/src/core/entities/scene.md) and [Camera](/src/core/entities/camera.md).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `FrameData` | Interface | Defines the structure holding all necessary data for one frame, including camera, sorted entities by layer, active lights, and time. |
| `buildFrameData` | Function | Constructs and returns a `FrameData` object by filtering and sorting all entities in the scene based on visibility, rendering layer, and distance from the camera. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `buildFrameData` function first calculates the view-projection matrix and derives the camera's frustum planes. It then filters scene objects to find active and visible entities. Entities are processed to determine their distance and renderer. Visibility is checked against the frustum (if `cull` is true). Entities are then separated into opaque (sorted nearest first), transparent (sorted farthest first), and shadow casters, based on their assigned `RenderLayer`.
- **Side Effects:** None.
- **Error Handling:** None.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [RendererBehaviour](/src/core/render/behaviours.md), [Camera](/src/core/entities/camera.md), [Scene](/src/core/entities/scene.md), [SceneEntity](/src/core/entities/scene-entity.md), [Light](/src/core/entities/lights/light.md), [RenderLayer](/src/core/enums/render-layer.md), [culling/culling.ts](/src/core/render/culling.ts)