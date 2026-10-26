## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | FaceWinding |
| Source file | face-winding.enum.ts |

The **FaceWinding** enum serves as a type-safe abstraction for defining the vertex order used to determine the front-facing side of a polygon in a WebGL context. By mapping semantic names to underlying WebGL constants, it provides a readable interface for configuring rasterization states.

**Functional Mission**
The primary responsibility of **FaceWinding** is to standardize the representation of vertex winding orders (Counter-Clockwise vs. Clockwise) within the engine's graphics abstraction layer. It solves the problem of magic numbers in rendering logic by providing explicit, human-readable identifiers that correspond directly to the `WebGL2RenderingContext` specification.

**System Context & Integration**
This component acts as a low-level configuration primitive used by the rendering subsystem. It is intended to be consumed by modules responsible for setting the WebGL state machine, such as those managing face culling or primitive assembly. It ensures that downstream components, such as [Mesh Renderer Behaviour](/AgentDocs/behaviours/renderer/mesh-renderer-behaviour.md) or general rendering passes, can specify polygon orientation without direct dependency on the global `WebGL2RenderingContext` object.

## 2. Environment & Configuration
**Environment Lookups:**
- `WebGL2RenderingContext.CCW` (via `FaceWinding.CounterClockwise`)  Retrieves the WebGL constant for counter-clockwise winding.
- `WebGL2RenderingContext.CW` (via `FaceWinding.Clockwise`)  Retrieves the WebGL constant for clockwise winding.

**Hardcoded Constants:**
- No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `FaceWinding` | Enum | Provides semantic mapping for WebGL vertex winding order constants. |

## 4. Execution Logic & Flow
Direct exports or structural definitions only; no internal logic flow.

## 5. Resource Dependencies
- **Standard Libraries**: None
- **Internal Modules**: None
- **External Packages**: `WebGL2RenderingContext` (Browser API)