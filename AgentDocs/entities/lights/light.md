## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | Light |
| Source file | light.ts |

The **Light** class serves as the foundational abstraction for all illumination-related entities within the engine. It establishes a standardized interface for light properties, ensuring that any specific light implementationwhether ambient, directional, point, or spotmaintains a consistent set of attributes required by the rendering pipeline.

**Functional Mission**
The primary mission of **Light** is to provide a base template that encapsulates the essential physical properties of light, specifically color and intensity. By extending [SceneEntity](/AgentDocs/entities/entity.md), it integrates into the engine's spatial hierarchy, allowing light sources to possess transforms and participate in the scene graph.

**System Context & Integration**
As a base class, **Light** acts as a contract for downstream light subclasses such as [DirectionalLight](/AgentDocs/entities/lights/directional-light.md), [PointLight](/AgentDocs/entities/lights/point-light.md), and [SpotLight](/AgentDocs/entities/lights/spot-light.md). It provides the necessary data structures (via [Color](/AgentDocs/core/color.md)) that the [RenderPipeline](/AgentDocs/core/render/render-pipeline.md) and associated shaders (e.g., [LitShader](/AgentDocs/shaders/lit-shader.md)) consume to calculate lighting equations. It bridges the gap between the scene hierarchy and the mathematical requirements of the GPU.

- **INTERNAL REFERENCES**: [SceneEntity](/AgentDocs/entities/entity.md), [EntityType](/AgentDocs/enums/entity-type.enum.md), [Color](/AgentDocs/core/color.md), [Transform](/AgentDocs/core/transform.md).

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `_className` (Default: `'Light'`)  Internal identifier for class type reflection.
- `color` (Default: `new Color(0.2, 0.2, 0.2, 1)`)  Default dim grey illumination.
- `entityType` (Default: `EntityType.LIGHT_AMBIENT`)  Default classification for the entity.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `Light` | Class | Base class for all light-emitting entities in the scene. |
| `entityType` | Property | Defines the specific category of light (defaults to Ambient). |
| `color` | Property | Holds the RGB color and alpha-based intensity of the light. |
| `constructor` | Function | Initializes the light with a name and default color/type. |
| `instanciate` | Static Method | Factory method to create new Light instances with optional parameters. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. The `constructor` invokes `super(name)` to initialize the [SceneEntity](/AgentDocs/entities/entity.md) base.
    2. The `color` property is instantiated with a default value of `(0.2, 0.2, 0.2, 1)`.
    3. The `entityType` is explicitly set to `EntityType.LIGHT_AMBIENT`.
- **Data Path**: 
    - **Input**: `name` (string) and optional `transform` (via `instanciate`).
    - **Processing**: The `instanciate` method handles default naming logic (`name || 'Light'`).
    - **Output**: A fully initialized `Light` object instance.
- **Conditional Branching**: 
    - In `instanciate`, a logical OR (`||`) is used to provide a fallback string `'Light'` if no name is provided.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [Color](/AgentDocs/core/color.md)
    - [Transform](/AgentDocs/core/transform.md)
    - [EntityType](/AgentDocs/enums/entity-type.enum.md)
    - [SceneEntity](/AgentDocs/entities/entity.md)
- **External Packages**: None identified.