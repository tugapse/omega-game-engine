## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | CullFace |
| Source file | cull-face.enum.ts |

The **CullFace** enum serves as a type-safe abstraction for WebGL face culling states. It provides a standardized way to define which polygons of a primitive should be discarded during the rasterization stage of the graphics pipeline based on their winding order.

**Functional Mission**
The primary responsibility of **CullFace** is to map high-level engine intent to the underlying `WebGL2RenderingContext` constants. It solves the problem of magic numbers and string-based configuration by providing a strictly typed interface for controlling back-face, front-face, or no culling, which is essential for optimizing rendering performance by not processing invisible geometry.

**System Context & Integration**
This component acts as a low-level configuration primitive within the graphics subsystem. It is intended to be consumed by rendering logic, likely within [Mesh Renderer Behaviour](/AgentDocs/behaviours/renderer/mesh-renderer-behaviour.md) or [Render Pipeline](/AgentDocs/core/render/render-pipeline.md) implementations, to set the appropriate state on the WebGL context. It ensures that the engine's high-level rendering commands are translated into valid, predictable WebGL state changes.

## 2. Environment & Configuration
**Environment Lookups:**
- `WebGL2RenderingContext.FRONT`  Maps to the WebGL constant for front-face culling.
- `WebGL2RenderingContext.BACK`  Maps to the WebGL constant for back-face culling.
- `WebGL2RenderingContext.NONE`  Maps to the WebGL constant for disabling culling.

**Hardcoded Constants:**
- No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `CullFace` | Enum | Provides a set of valid constants for face culling operations. |

## 4. Execution Logic & Flow
Direct exports or structural definitions only; no internal logic flow.

## 5. Resource Dependencies
- **Standard Libraries**: None
- **Internal Modules**: None
- **External Packages**: `WebGL2RenderingContext` (Browser WebGL API)