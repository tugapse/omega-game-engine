## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | GLPrimitiveType |
| Source file | gl-primitive-type.enum.ts |

The **GLPrimitiveType** enumeration serves as a low-level abstraction layer for WebGL draw calls. It maps human-readable identifiers to the specific hexadecimal constants required by the WebGL API to define how vertex data is interpreted by the GPU.

**Functional Mission**
The primary responsibility of **GLPrimitiveType** is to provide a type-safe set of constants that dictate the topology of rendered geometry. By encapsulating these values, the component ensures that downstream rendering logic uses valid WebGL primitive modes, preventing runtime errors during draw command execution.

**System Context & Integration**
This component acts as a foundational data contract used extensively by the rendering subsystem. It is a critical dependency for modules responsible for geometry processing and draw call dispatching, such as [Mesh Renderer Behaviour](/AgentDocs/behaviours/renderer/mesh-renderer-behaviour.md) and [Geometry Pass](/AgentDocs/core/render/pass/geometry.md). When a mesh is processed, its primitive topology is passed through the pipeline using these enum values to instruct the GPU whether to render points, lines, or triangles.

- **INTERNAL REFERENCES**: [GLPrimitiveType](/AgentDocs/enums/gl-primitive-type.enum.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `POINTS` (0x0000)  WebGL constant for rendering disconnected points.
- `LINES` (0x0001)  WebGL constant for rendering disconnected line segments.
- `LINE_STRIP` (0x0002)  WebGL constant for rendering connected line segments.
- `LINE_LOOP` (0x0003)  WebGL constant for rendering connected line segments in a loop.
- `TRIANGLES` (0x0004)  WebGL constant for rendering disconnected triangles.
- `TRIANGLE_STRIP` (0x0005)  WebGL constant for rendering connected triangle strips.
- `TRIANGLE_FAN` (0x0006)  WebGL constant for rendering connected triangle fans.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `GLPrimitiveType` | Enum | Provides a mapping of WebGL primitive topology constants. |

## 4. Execution Logic & Flow
Direct exports or structural definitions only; no internal logic flow.

## 5. Resource Dependencies
- **Standard Libraries**: None
- **Internal Modules**: 
    - None
- **External Packages**: None