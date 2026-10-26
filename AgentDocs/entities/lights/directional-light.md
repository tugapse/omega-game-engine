## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | DirectionalLight |
| Source file | directional-light.ts |

The **DirectionalLight** component is a specialized light entity designed to simulate infinitely distant light sources, such as sunlight. Unlike point or spot lights, it provides parallel light rays across the entire scene, meaning its position is irrelevant to the light's direction, which is instead derived from the entity's orientation.

**Functional Mission**
The primary responsibility of **DirectionalLight** is to define a global illumination vector used by the rendering pipeline to calculate shading for surfaces. It solves the problem of simulating directional environmental lighting by providing a normalized direction vector and a color/intensity profile, ensuring consistent lighting behavior across all objects in a scene regardless of their spatial coordinates.

**System Context & Integration**
This component functions as a specialized implementation of the [Light](/AgentDocs/entities/lights/light.md) base class. It integrates with the [Transform](/AgentDocs/core/transform.md) system to derive its light vector from spatial rotation. During the rendering pass, the direction provided by this component is typically passed to shaders (such as [LitShader](/AgentDocs/shaders/lit-shader.md)) to compute diffuse and specular reflections. It is categorized under the [EntityType.LIGHT_DIRECTIONAL](/AgentDocs/enums/entity-type.enum.md) to allow the [Scene](/AgentDocs/entities/scene.md) or renderer to distinguish it from other light types during the lighting pass.

- **INTERNAL REFERENCES**: [Light](/AgentDocs/entities/lights/light.md), [Transform](/AgentDocs/core/transform.md), [EntityType](/AgentDocs/enums/entity-type.enum.md), [Color](/AgentDocs/core/color.md).

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `color` (Default: `new Color(1.0, 0.98, 0.95, 0.7)`)  The default warm, slightly desaturated white color representing sunlight.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `DirectionalLight` | Class | Represents a directional light source inheriting from `Light`. |
| `className` | Static Getter | Returns the string identifier `'DirectionalLight'`. |
| `entityType` | Property | Identifies the entity as `EntityType.LIGHT_DIRECTIONAL`. |
| `direction` | Getter | Calculates and returns a normalized `vec3` representing the light's orientation. |
| `invertLightDirection` | Property | Boolean flag to toggle between using the `forward` or `back` vector of the transform. |
| `instanciate` | Static Method | Factory method to create a new `DirectionalLight` instance with optional parameters. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. The `constructor` invokes the `super` class constructor.
    2. Sets `entityType` to `EntityType.LIGHT_DIRECTIONAL`.
    3. Initializes the `color` property with a default sunlight-like value.
- **Data Path (Direction Calculation)**:
    1. **Input**: The current `transform` state (specifically `forward` or `back` vectors).
    2. **Processing**: Checks `invertLightDirection`. If `true`, selects `transform.back`; otherwise, selects `transform.forward`.
    3. **Transformation**: Passes the selected vector to `vec3.normalize` to ensure a unit vector.
    4. **Output**: Returns a normalized `vec3` representing the light direction.
- **Conditional Branching**:
    - The `direction` getter branches based on the `invertLightDirection` boolean to determine which transform axis represents the light's path.

## 5. Resource Dependencies
- **Standard Libraries**: `gl-matrix` (via `vec3`)
- **Internal Modules**: 
    - [Color](/AgentDocs/core/color.md)
    - [Transform](/AgentDocs/core/transform.md)
    - [EntityType](/AgentDocs/enums/entity-type.enum.md)
    - [Light](/AgentDocs/entities/lights/light.md)
- **External Packages**: `gl-matrix`