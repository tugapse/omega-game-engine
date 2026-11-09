## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| DirectionalLight | entities/lights/directional-light.md |

This component defines the `DirectionalLight` class, which models a light source originating from a very distant point, such as the sun. Its primary responsibility is to calculate and expose the direction vector of this light, which is crucial for realistic shading and rendering calculations within the scene. It inherits from the base `Light` class, ensuring it adheres to the core lighting entity structure.

Architecturally, `DirectionalLight` functions as a specific implementation of the lighting data model within the engine. It is responsible for holding light properties like color and direction, and it integrates with the scene's transformation system via the `Transform` object to derive its orientation. It interacts with the core entity system via `EntityType` and relies on the base `Light` class for fundamental entity management.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| DirectionalLight | Class | Represents a directional light source. |
| DirectionalLight.direction | Getter | Returns the normalized direction vector of the light, potentially inverted based on `invertLightDirection`. |
| DirectionalLight.invertLightDirection | Property | A boolean flag that determines whether the light direction should be inverted when calculated. |
| DirectionalLight.instanciate | Static Method | Factory method to create a new `DirectionalLight` instance, optionally providing a name and transform. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `direction` getter calculates the light's direction by taking either the forward or back vector from the light's `transform`, depending on the `invertLightDirection` flag, and then normalizing the resulting vector using `vec3.normalize`. The constructor initializes default color properties.

- **Side Effects:** None.

- **Error Handling:** None.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** gl-matrix
- **Internal:** [core](/core.md), [enums](/enums.md)