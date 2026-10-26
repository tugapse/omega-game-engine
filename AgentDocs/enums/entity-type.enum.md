## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | EntityType |
| Source file | entity-type.enum.ts |

The **EntityType** enumeration serves as a foundational type-definition layer within the engine's entity-component architecture. It provides a standardized, integer-based classification system that allows the engine to distinguish between different categories of objects within a scene, such as geometry, lighting, cameras, and structural containers.

**Functional Mission**
The primary responsibility of **EntityType** is to provide a unique, serialized identifier for every entity instance. By assigning specific numerical values to different categories, it solves the problem of efficient type-checking and data serialization, ensuring that when an entity is saved or transmitted, its fundamental nature is preserved without relying on string comparisons.

**System Context & Integration**
This component acts as a metadata descriptor used extensively by the [Scene](/AgentDocs/entities/scene.md) and [Entity](/AgentDocs/entities/entity.md) modules. It informs downstream systemssuch as the [Renderer](/AgentDocs/core/render/render-pipeline.md) and [Scene Manager](/AgentDocs/managers/scene-manager.md)how to process a specific object. For instance, an entity flagged as `LIGHT_POINT` will trigger logic within light-specific modules, while a `CAMERA` type will dictate how the view matrix is updated during the render loop.

- **INTERNAL REFERENCES**: [EntityType](/AgentDocs/enums/entity-type.enum.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `EntityType.STATIC` (Default: `-1`)  Represents non-moving level geometry.
- `EntityType.LIGHT_AMBIENT` (Default: `0`)  Represents uniform ambient lighting.
- `EntityType.LIGHT_DIRECTIONAL` (Default: `1`)  Represents distant directional light.
- `EntityType.LIGHT_POINT` (Default: `2`)  Represents omnidirectional point light.
- `EntityType.LIGHT_SPOT` (Default: `3`)  Represents conical spotlight.
- `EntityType.CAMERA` (Default: `4`)  Represents a perspective/viewpoint entity.
- `EntityType.SCENE` (Default: `5`)  Represents the root container entity.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `EntityType` | Enum | Provides a set of constant integer identifiers for entity classification. |

## 4. Execution Logic & Flow
Direct exports or structural definitions only; no internal logic flow.

## 5. Resource Dependencies
- **Standard Libraries**: None
- **Internal Modules**: 
    - None
- **External Packages**: None