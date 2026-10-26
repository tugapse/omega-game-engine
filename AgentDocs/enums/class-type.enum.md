## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | ClassType |
| Source file | class-type.enum.ts |

The **ClassType** enum serves as a foundational type-definition layer within the Omega Engine. It provides a standardized set of string-based identifiers used to categorize the various functional components that inhabit the engine's ecosystem, ranging from core structural elements to specialized rendering assets.

**Functional Mission**
The primary responsibility of **ClassType** is to provide a strictly typed taxonomy for object classification. By defining a fixed set of valid types, it solves the problem of type ambiguity during object instantiation, serialization, and runtime identification, ensuring that the engine can reliably distinguish between different architectural primitives.

**System Context & Integration**
This component acts as a metadata anchor for the engine's object management systems. It is utilized by the [Object Instanciator](/AgentDocs/core/object-instanciator.md) to tag newly created objects and by the [Dependency Manager](/AgentDocs/managers/dependency-manager.md) to facilitate type-based lookups. It provides the necessary semantic context for downstream modules such as the [Scene Manager](/AgentDocs/managers/scene-manager.md) and the [Render Pipeline](/AgentDocs/core/render/render-pipeline.md) to determine how specific entities should be processed, updated, or drawn.

- **INTERNAL REFERENCES**: 
    - [Object Instanciator](/AgentDocs/core/object-instanciator.md)
    - [Dependency Manager](/AgentDocs/managers/dependency-manager.md)
    - [Scene Manager](/AgentDocs/managers/scene-manager.md)
    - [Render Pipeline](/AgentDocs/core/render/render-pipeline.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `EntityBehaviour` (Default: `"EntityBehaviour"`)  Identifier for logic-driven entity components.
- `RenderBehaviour` (Default: `"RenderBehaviour"`)  Identifier for rendering-specific logic components.
- `RenderPipeline` (Default: `"RenderPipeline"`)  Identifier for the rendering orchestration structure.
- `Material` (Default: `"Material"`)  Identifier for surface property definitions.
- `Shader` (Default: `"Shader"`)  Identifier for GPU program definitions.
- `Light` (Default: `"Light"`)  Identifier for illumination sources.
- `Entity` (Default: `"Entity"`)  Identifier for base scene objects.
- `Scene` (Default: `"Scene"`)  Identifier for world containers.
- `Transform` (Default: `"Transform"`)  Identifier for spatial positioning data.
- `Mesh` (Default: `"Mesh"`)  Identifier for geometric data structures.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `ClassType` | Enum | Provides a set of unique string constants for categorizing engine components. |

## 4. Execution Logic & Flow
Direct exports or structural definitions only; no internal logic flow.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: None identified.
- **External Packages**: None identified.