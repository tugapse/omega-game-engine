## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | ShaderSources |
| Source file | shader-sources.ts |

The **ShaderSources** component serves as a centralized, static registry for all GLSL shader file paths within the engine. It acts as a single source of truth for the asset pipeline, mapping logical shader identifiers to their physical locations within the `assets/shaders/` directory structure.

**Functional Mission**
The primary responsibility of **ShaderSources** is to provide a structured lookup mechanism for fragment and vertex shader assets. By decoupling the logical name of a shader (e.g., `default_lit`) from its filesystem path, it allows the rendering engine to request shaders by key, facilitating easier asset management and preventing hardcoded string duplication across the codebase.

**System Context & Integration**
This component is a foundational utility used by the rendering subsystem to resolve shader assets during material instantiation or pipeline configuration. It is heavily utilized by [Shader](/AgentDocs/shaders/shader.md), [Lit Material](/AgentDocs/materials/lit-material.md), and various [Render Passes](/AgentDocs/core/render/pass/index.md) to locate the necessary GLSL source code required for GPU program compilation. It bridges the gap between the high-level engine logic and the raw filesystem assets.

## 2. Environment & Configuration
**Environment Lookups:**
No environment lookups identified.

**Hardcoded Constants:**
- `ShaderSources.frag` (Object)  A collection of mapping keys to fragment shader asset paths.
- `ShaderSources.vertex` (Object)  A collection of mapping keys to vertex shader asset paths.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `ShaderSources` | Class | Provides static, read-only access to shader asset path mappings. |
| `ShaderSources.frag` | Static Property | Contains the registry of fragment shader file paths. |
| `ShaderSources.vertex` | Static Property | Contains the registry of vertex shader file paths. |

## 4. Execution Logic & Flow
Direct exports or structural definitions only; no internal logic flow.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - None identified.
- **External Packages**: None identified.