## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | IRendererBehaviour |
| Source file | renderer-behaviour.ts |

The **IRendererBehaviour** interface serves as a foundational contract for any component within the engine that requires direct access to the WebGL2 rendering context to perform custom draw calls or state manipulations. It establishes a standardized way for specialized rendering logic to be injected into the engine's execution loop.

**Functional Mission**
The primary responsibility of **IRendererBehaviour** is to enforce a consistent API for managing the lifecycle of a WebGL2 context within a behaviour. It solves the problem of decoupling high-level engine logic from low-level graphics API state by providing a formal mechanism to inject and retrieve the `WebGL2RenderingContext`.

**System Context & Integration**
This interface acts as a structural blueprint for concrete implementations such as [Mesh Renderer Behaviour](/AgentDocs/behaviours/renderer/mesh-renderer-behaviour.md) and [Skybox Renderer](/AgentDocs/behaviours/renderer/skybox-renderer.md). By adhering to this interface, these modules can be treated polymorphically by the rendering pipeline, ensuring that regardless of the specific visual task, the underlying graphics context is correctly provided and accessible.

- **INTERNAL REFERENCES**: [Mesh Renderer Behaviour](/AgentDocs/behaviours/renderer/mesh-renderer-behaviour.md), [Skybox Renderer](/AgentDocs/behaviours/renderer/skybox-renderer.md).

## 2. Environment & Configuration
**Environment Lookups:**
No environment lookups identified.

**Hardcoded Constants:**
No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `IRendererBehaviour` | Interface | Defines the structural requirements for objects requiring WebGL2 context access. |
| `_gl` | Property | Holds the reference to the `WebGL2RenderingContext`. |
| `setGl` | Method | Provides a setter to inject the `WebGL2RenderingContext` into the implementing object. |

## 4. Execution Logic & Flow
Direct exports or structural definitions only; no internal logic flow.

## 5. Resource Dependencies
- **Standard Libraries**: (None)
- **Internal Modules**: 
    - None
- **External Packages**: 
    - `WebGL2RenderingContext` (Browser API)