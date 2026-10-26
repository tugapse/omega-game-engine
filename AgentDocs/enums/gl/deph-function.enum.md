## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | DephFunction |
| Source file | deph-function.enum.ts |

The **DephFunction** enum serves as a type-safe abstraction layer for WebGL depth testing comparison functions. It maps high-level, human-readable enumeration members to the underlying integer constants required by the WebGL API, ensuring that depth testing logic remains consistent and readable throughout the engine's rendering pipeline.

**Functional Mission**
The primary responsibility of **DephFunction** is to provide a standardized set of depth comparison operators. It solves the problem of using "magic numbers" or direct WebGL constants within the engine's high-level logic, providing a clear semantic interface for configuring how fragments are tested against the existing depth buffer.

**System Context & Integration**
This component is a low-level utility used primarily by rendering modules to configure the GPU's depth state. It is highly relevant to [Render Pipeline](/AgentDocs/core/render/render-pipeline.md) configurations and specific [Render Pass](/AgentDocs/core/render/pass/index.md) implementations, where determining whether a fragment should be drawn based on its distance from the camera is critical. It acts as a bridge between the engine's intent and the [WebGL2RenderingContext](/AgentDocs/enums/gl/index.md) state machine.

## 2. Environment & Configuration
**Environment Lookups:**
- `WebGL2RenderingContext.LESS` (via `DephFunction.Less`)  Maps to the WebGL constant for depth comparison where the incoming value is less than the stored value.
- `WebGL2RenderingContext.LEQUAL` (via `DephFunction.LessOrEqual`)  Maps to the WebGL constant for depth comparison where the incoming value is less than or equal to the stored value.
- `WebGL2RenderingContext.GREATER` (via `DephFunction.Greater`)  Maps to the WebGL constant for depth comparison where the incoming value is greater than the stored value.
- `WebGL2RenderingContext.GEQUAL` (via `DephFunction.GreaterOrEqual`)  Maps to the WebGL constant for depth comparison where the incoming value is greater than or equal to the stored value.
- `WebGL2RenderingContext.EQUAL` (via `DephFunction.Equal`)  Maps to the WebGL constant for depth comparison where the incoming value is equal to the stored value.
- `WebGL2RenderingContext.ALWAYS` (via `DephFunction.Always`)  Maps to the WebGL constant where the depth test always passes.
- `WebGL2RenderingContext.NEVER` (via `DephFunction.Never`)  Maps to the WebGL constant where the depth test always fails.

**Hardcoded Constants:**
- No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `DephFunction` | Enum | Provides a set of semantic mappings to `WebGL2RenderingContext` depth comparison constants. |

## 4. Execution Logic & Flow
Direct exports or structural definitions only; no internal logic flow.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: None identified.
- **External Packages**: `WebGL2RenderingContext` (Browser/Web API).