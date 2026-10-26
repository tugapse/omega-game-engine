## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | Lights Index |
| Source file | index.ts |

The **Lights Index** serves as the centralized aggregation point for the lighting subsystem within the engine. It functions as a barrel export module, consolidating all lighting-related entities, mathematical models for light behavior, and specific light implementations into a single, unified entry point.

**Functional Mission**
The primary responsibility of **Lights Index** is to provide a clean, organized API surface for the rest of the engine to consume lighting components. By acting as a gateway, it abstracts the internal file structure of the `lights` directory, allowing downstream modules to import all necessary lighting primitivesranging from base classes to specific light typesvia a single module resolution.

**System Context & Integration**
This component sits at the intersection of the entity system and the rendering pipeline. It facilitates the availability of various light types such as [Directional Light](/AgentDocs/entities/lights/directional-light.md), [Point Light](/AgentDocs/entities/lights/point-light.md), and [Spot Light](/AgentDocs/entities/lights/spot-light.md) to the [Scene](/AgentDocs/entities/scene.md). These entities are subsequently utilized by the [Render Pipeline](/AgentDocs/core/render/render-pipeline.md) and [Lit Shader](/AgentDocs/shaders/lit-shader.md) to calculate illumination, shadows, and attenuation effects across the rendered scene.

## 2. Environment & Configuration
**Environment Lookups:**
No environment lookups identified.

**Hardcoded Constants:**
No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `directional-light` | Export | Provides global, parallel light source implementation. |
| `light-attenuation` | Export | Provides mathematical models for light intensity decay over distance. |
| `light-cone` | Export | Provides geometric definitions for light emission cones. |
| `light` | Export | Provides the base abstraction/interface for all light entities. |
| `point-light` | Export | Provides omnidirectional light source implementation. |
| `spot-light` | Export | Provides directional, cone-constrained light source implementation. |

## 4. Execution Logic & Flow
Direct exports or structural definitions only; no internal logic flow.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [Directional Light](/AgentDocs/entities/lights/directional-light.md)
    - [Light Attenuation](/AgentDocs/entities/lights/light-attenuation.md)
    - [Light Cone](/AgentDocs/entities/lights/light-cone.md)
    - [Light](/AgentDocs/entities/lights/light.md)
    - [Point Light](/AgentDocs/entities/lights/point-light.md)
    - [Spot Light](/AgentDocs/entities/lights/spot-light.md)
- **External Packages**: None identified.