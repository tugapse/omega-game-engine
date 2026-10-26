## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | Shader Index |
| Source file | index.ts |

The **Shader Index** serves as the centralized aggregation point for the shader subsystem within the omega-engine. It functions as a barrel export module, consolidating various shader implementations and raw source definitions into a single, unified entry point for the rest of the engine.

**Functional Mission**
The primary responsibility of **Shader Index** is to provide a clean, organized interface for accessing all shader-related logic. By re-exporting specific shader classes and source strings, it abstracts the internal file structure of the shaders directory, allowing downstream modules to import all necessary shader components from a single location.

**System Context & Integration**
This component acts as the gateway for the rendering pipeline to access programmable GPU logic. It facilitates the integration between high-level material definitions and low-level GLSL code. Downstream modules, such as [Lit Material](/AgentDocs/materials/lit-material.md) or [Unlit Material](/AgentDocs/materials/unlit-material.md), rely on this index to resolve the specific shader implementations required to execute their respective rendering logic.

- **INTERNAL REFERENCES**: 
    - [Shader](/AgentDocs/shaders/shader.md)
    - [Unlit Shader](/AgentDocs/shaders/unlit-shader.md)
    - [Lit Shader](/AgentDocs/shaders/lit-shader.md)
    - [Skybox Shader](/AgentDocs/shaders/skybox-shader.md)
    - [Shader Sources](/AgentDocs/shaders/shader-sources.md)

## 2. Environment & Configuration
**Environment Lookups:**
No environment lookups identified.

**Hardcoded Constants:**
No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `*` | Export | Aggregates and exposes `Shader`, `UnlitShader`, `LitShader`, `SkyboxShader`, and `ShaderSources`. |

## 4. Execution Logic & Flow
Direct exports or structural definitions only; no internal logic flow.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [Shader](/AgentDocs/shaders/shader.md)
    - [Unlit Shader](/AgentDocs/shaders/unlit-shader.md)
    - [Lit Shader](/AgentDocs/shaders/lit-shader.md)
    - [Skybox Shader](/AgentDocs/shaders/skybox-shader.md)
    - [Shader Sources](/AgentDocs/shaders/shader-sources.md)
- **External Packages**: None identified.