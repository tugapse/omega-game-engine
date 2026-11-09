## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| SkyboxPrimitive | primitives/skybox-primitive |

This component provides a specialized implementation of a cube primitive designed specifically for rendering skyboxes. Its primary responsibility is to encapsulate the geometry and rendering logic for a cube that wraps around a scene, ensuring that the rendering pipeline treats it as a background element rather than a standard solid object.

It functions as a specialized geometry component within the rendering subsystem. By extending the base [CubePrimitive](/primitives/cube-primitive.md), it inherits core geometric capabilities while overriding instantiation methods to enforce skybox-specific initialization, such as setting default sizes.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| SkyboxPrimitive | Class | Represents a cube primitive specifically used for a skybox. Extends CubePrimitive. |
| SkyboxPrimitive.instanciate | Static Method | Creates a new SkyboxPrimitive instance, overriding the base instantiation logic. |
| SkyboxPrimitive | Constructor | Creates an instance of SkyboxPrimitive, defaulting the cube size to 2.0. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The class extends `CubePrimitive` and overrides the static `instanciate` method to ensure a new instance is created correctly. The constructor accepts an optional `size` parameter, which is passed up to the parent class for initialization.
- **Side Effects:** None.
- **Error Handling:** None.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** gl-matrix
- **Internal:** [CubePrimitive](/primitives/cube-primitive.md)