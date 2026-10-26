## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | ClearMask |
| Source file | clear-mask.enum.ts |

The **ClearMask** enum serves as a type-safe abstraction layer for WebGL2 buffer clearing operations. It provides a semantic interface for developers to specify which components of the graphics pipeline (color, depth, or stencil) should be reset during a frame's clearing phase, preventing the use of raw bitwise integer constants throughout the engine.

**Functional Mission**
The primary responsibility of **ClearMask** is to encapsulate the bitwise flags required by the WebGL2 API for buffer clearing operations. By providing named members like `Color`, `Depth`, and `Stencil`, it solves the problem of magic numbers and provides a clear, human-readable way to manage the state of the GPU's framebuffers.

**System Context & Integration**
This component acts as a low-level configuration utility within the rendering subsystem. It is intended to be consumed by high-level rendering logic, such as [Render Pipeline](/AgentDocs/core/render/render-pipeline.md) or specific [Render Pass](/AgentDocs/core/render/pass/index.md) implementations, to instruct the GPU which buffers to wipe before drawing new geometry. It facilitates the transition from high-level engine commands to specific WebGL2 state changes.

- **INTERNAL REFERENCES**: [Render Pipeline](/AgentDocs/core/render/render-pipeline.md), [Render Pass](/AgentDocs/core/render/pass/index.md).

## 2. Environment & Configuration
**Environment Lookups:**
- `WebGL2RenderingContext.COLOR_BUFFER_BIT` (via `ClearMask.Color`)  WebGL2 constant for the color buffer bitmask.
- `WebGL2RenderingContext.DEPTH_BUFFER_BIT` (via `ClearMask.Depth`)  WebGL2 constant for the depth buffer bitmask.
- `WebGL2RenderingContext.STENCIL_BUFFER_BIT` (via `ClearMask.Stencil`)  WebGL2 constant for the stencil buffer bitmask.

**Hardcoded Constants:**
- `ColorAndDepth` (Default: `COLOR_BUFFER_BIT | DEPTH_BUFFER_BIT`)  A pre-combined bitmask for simultaneous color and depth clearing.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `ClearMask` | Enum | Provides semantic bitwise flags for WebGL2 buffer clearing operations. |

## 4. Execution Logic & Flow
Direct exports or structural definitions only; no internal logic flow.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: None identified.
- **External Packages**: `WebGL2RenderingContext` (Browser/Web API).