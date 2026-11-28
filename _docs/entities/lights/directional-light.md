## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **DirectionalLight** | [src/entities/lights/directional-light.ts](/src/entities/lights/directional-light.ts) |

This component defines the `DirectionalLight` class, which models a light source originating from a very distant point, such as the sun. Its primary responsibility is to encapsulate the properties and behavior of such a light, allowing it to influence rendering calculations based on a constant directional vector.

This class extends the base [Light](/src/entities/lights/light.ts.md) entity. It serves as a concrete implementation within the application's entity system, specifically categorized by the [EntityType](/src/enums/enums.md) enum as `LIGHT_DIRECTIONAL`. It manages light color, shadow casting, and calculates its direction vector based on its associated [Transform](/src/core/transform.md) component.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `DirectionalLight` | Class | Represents a directional light source. |
| `DirectionalLight.className` | Static Property | Returns the string identifier 'DirectionalLight'. |
| `DirectionalLight._className` | Protected Property | Internal identifier for the class. |
| `DirectionalLight.entityType` | Property | The type of the entity, fixed to `EntityType.LIGHT_DIRECTIONAL`. |
| `DirectionalLight.direction` | Getter | Returns the normalized direction vector of the light, potentially inverted based on `invertLightDirection`. |
| `DirectionalLight.invertLightDirection` | Property | Boolean flag to control whether the light direction is inverted. |
| `DirectionalLight` | Constructor | Creates a new instance of DirectionalLight, initializing default color and shadow properties. |
| `DirectionalLight.instanciate` | Static Method | Factory method to create a new DirectionalLight instance, allowing optional name and transform parameters. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `direction` getter calculates the light's direction by taking either the `transform.back` or `transform.forward` vector from the associated `Transform` object, depending on the `invertLightDirection` flag, and then normalizing the resulting vector using `vec3.normalize`. The constructor initializes default properties like color and sets `castShadows` to true.
- **Side Effects:** None. The class operates purely on its internal state and properties derived from its `Transform` dependency.
- **Error Handling:** None.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [Color](/src/core/color.md), [Transform](/src/core/transform.md), [EntityType](/src/enums/enums.md), [Light](/src/entities/lights/light.ts.md)