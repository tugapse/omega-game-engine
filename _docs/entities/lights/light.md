## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **Light** | [src/entities/lights/light.ts](/src/entities/lights/light.ts) |

This component defines the `Light` class, which serves as the foundational representation for all light sources within the rendering engine. Its primary responsibility is to encapsulate the physical and rendering properties of a light, such as its color, intensity, and shadow casting behavior. It extends `SceneEntity`, inheriting core entity management capabilities.

The `Light` class functions as a core data model within the engine's scene graph architecture. It interacts with fundamental types like [Color](/core/color.md) and [Transform](/core/transform.md) to define its spatial presence and visual characteristics. It is instantiated via the static method `instanciate` for controlled object creation.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `Light` | Class | The base class for all light types, inheriting from `SceneEntity`. |
| `Light.instanciate` | Static Method | Creates a new `Light` instance, optionally accepting a name and a `Transform`. |
| `color` | Property | Defines the color and intensity of the light, typed as [Color](/core/color.md). |
| `castShadows` | Property | Boolean flag indicating if the light source should cast shadows. |
| `shadowDepthBias` | Property | Controls the bias applied during shadow map lookups to mitigate shadow acne. |
| `shadowNormalBias` | Property | Defines the offset along the surface normal used for shadow mapping calculations. |
| `shadowStrength` | Property | A multiplier determining the darkness of the light's shadow effect. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The constructor initializes the light with a default color (`Color(0.2, 0.2, 0.2, 1)`) and sets the `entityType` to `EntityType.LIGHT_AMBIENT`. The static `instanciate` method provides a factory pattern wrapper around the constructor.
- **Side Effects:** None. The class manages internal state and properties but does not perform I/O or external system calls.
- **Error Handling:** None explicitly implemented; relies on base class (`SceneEntity`) and constructor logic for initialization.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.
- **Internal:** [Color](/core/color.md), [Transform](/core/transform.md), [EntityType](/enums/entity-type.enum.md), [SceneEntity](/entities/entity.md).