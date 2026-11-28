## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **SkyboxPrimitive** | [primitives/skybox-primitive.ts](/primitives/skybox-primitive.ts) |

This component defines `SkyboxPrimitive`, a specialized class that inherits from `CubePrimitive`. Its primary responsibility is to represent a cube geometry specifically configured for rendering a skybox. This specialization often implies specific rendering pipeline adjustments, such as disabling backface culling to ensure the skybox is visible from all angles.

Architecturally, `SkyboxPrimitive` functions as a concrete implementation of a geometric primitive within the rendering subsystem. It extends the base geometry definition provided by [CubePrimitive](/primitives/cube-primitive.md), allowing the engine to treat it as a standard cube while enforcing skybox-specific rendering constraints.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `SkyboxPrimitive` | Class | Represents a cube primitive optimized for skybox rendering. |
| `SkyboxPrimitive.instanciate` | Static Method | Creates a new `SkyboxPrimitive` instance, optionally accepting initial geometry data. |
| `SkyboxPrimitive` | Constructor | Creates an instance of `SkyboxPrimitive`, defaulting the cube size to 2.0. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The class extends `CubePrimitive` and overrides the static `instanciate` method. The constructor accepts an optional `size` parameter, which is passed up to the parent `super(size)` constructor, setting the dimensions of the underlying cube geometry.
- **Side Effects:** None.
- **Error Handling:** None.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [CubePrimitive](/primitives/cube-primitive.md)