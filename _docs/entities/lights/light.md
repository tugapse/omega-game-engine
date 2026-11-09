## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| Light | entities/lights/light.md |

This component defines the base `Light` class, serving as the foundational blueprint for all light sources within the rendering engine. Its primary responsibility is to encapsulate common properties shared by various light types, such as color and intensity, ensuring a consistent structure for light entities across the system.

The `Light` class functions as a core data model entity within the engine's scene graph architecture. It inherits from [SceneEntity](/entities/entity.md) and provides a standardized way to manage light properties, allowing specialized subclasses (like `DirectionalLight` or `PointLight`) to extend this base functionality while maintaining architectural consistency.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| Light | Class | The base class for all light types. Manages common light properties. |
| Light.instanciate | Static Method | Creates a new Light instance, allowing optional naming and transform assignment. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The class initializes with a default color and sets the default entity type to `EntityType.LIGHT_AMBIENT`. The constructor sets up the base properties, while the static `instanciate` method provides a controlled factory pattern for instantiation.
- **Side Effects:** None.
- **Error Handling:** None.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.

- **Internal:** [Color](/core/color.md), [Transform](/core/transform.md), [EntityType](/enums/entity-type.enum.md), [SceneEntity](/entities/entity.md)