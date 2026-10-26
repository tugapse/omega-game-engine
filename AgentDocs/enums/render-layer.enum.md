## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | RenderLayer |
| Source file | render-layer.enum.ts |

The **RenderLayer** enum serves as a fundamental structural definition within the engine's rendering pipeline. It establishes a standardized, integer-based hierarchy for categorizing draw calls and managing the depth-sorting and execution order of different visual elements within a frame.

**Functional Mission**
The primary responsibility of **RenderLayer** is to provide a type-safe enumeration that dictates the sequence in which various scene components are processed by the renderer. By assigning discrete integer values to specific stages (such as opaque geometry vs. post-processing effects), it solves the problem of visual ordering, ensuring that elements like the skybox or transparent objects are rendered in the correct logical sequence to maintain visual integrity and correct alpha blending.

**System Context & Integration**
This component acts as a shared contract between the scene graph and the rendering subsystem. It is utilized by [Render Pipeline](/AgentDocs/core/render/render-pipeline.md) to sort objects before submission to the GPU and by [Render Pass](/AgentDocs/core/render/render-pass.interface.md) implementations to determine which layer a specific pass targets. It also informs the behavior of [Mesh Renderer Behaviour](/AgentDocs/behaviours/renderer/mesh-renderer-behaviour.md) and [Skybox Renderer](/AgentDocs/behaviours/renderer/skybox-renderer.md) regarding where their respective geometry should be injected into the frame lifecycle.

## 2. Environment & Configuration
**Environment Lookups:**
No environment lookups identified.

**Hardcoded Constants:**
- `PRE_SCENE` (Default: `1`)  Reserved for operations occurring before the main scene geometry is processed.
- `OPAQUE` (Default: `2`)  Standard layer for non-transparent geometry.
- `TRANSPARENT` (Default: `3`)  Layer for objects requiring alpha blending and depth sorting.
- `POST_SCENE` (Default: `4`)  Layer for full-screen effects and post-processing.
- `SKYBOX` (Default: `5`)  Layer specifically for background environment rendering.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `RenderLayer` | Enum | Provides a set of constant integer identifiers for rendering stage categorization. |

## 4. Execution Logic & Flow
Direct exports or structural definitions only; no internal logic flow.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: None identified.
- **External Packages**: None identified.