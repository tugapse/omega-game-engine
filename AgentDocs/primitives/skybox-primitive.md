## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | SkyboxPrimitive |
| Source file | skybox-primitive.ts |

The **SkyboxPrimitive** serves as a specialized geometric foundation designed to represent the infinite background environment of a 3D scene. By extending the standard cube geometry, it provides a dedicated primitive type that is optimized for skybox rendering, where the geometry is typically rendered from the inside out.

**Functional Mission**
The primary responsibility of **SkyboxPrimitive** is to provide a specialized implementation of a cube geometry specifically tailored for skybox applications. It solves the problem of differentiating standard volumetric or solid cubes from the specialized "environment shell" used to display skybox textures, allowing the engine to apply specific rendering statessuch as back-face culling or depth testing adjustmentsto the background.

**System Context & Integration**
This component acts as a structural bridge between raw geometry and high-level rendering behaviors. It is intended to be utilized by specialized renderers, such as [Skybox Renderer](/AgentDocs/behaviours/renderer/skybox-renderer.md), and paired with specific materials like [Skybox Material](/AgentDocs/materials/skybox-material.md) or [Cubemap Material](/AgentDocs/materials/cubemap-material.md). While it inherits the vertex and index generation logic from [Cube Primitive](/AgentDocs/primitives/cube-primitive.md), its distinct type allows the engine to distinguish background geometry from scene objects during the render pass execution.

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- `size` (Default: `2.0`)  The initial scale/dimension of the skybox cube.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `SkyboxPrimitive` | Class | A specialized cube primitive optimized for skybox rendering. |
| `instanciate` | Static Method | Factory method to create a new instance of `SkyboxPrimitive` (overrides base behavior). |
| `constructor` | Function | Initializes the skybox with a specific scale/size. |

## 4. Execution Logic & Flow
- **Initialization**: The constructor accepts a `size` parameter (defaulting to `2.0`), which is passed to the `super` call of [Cube Primitive](/AgentDocs/primitives/cube-primitive.md) to define the geometric bounds of the skybox.
- **Data Path**: 
    - **Input**: `size` (number) $\rightarrow$ **Processing**: `super(size)` $\rightarrow$ **Output**: Initialized `SkyboxPrimitive` instance.
- **Conditional Branching**: The `instanciate` method provides a static entry point that bypasses standard parameter passing to return a new instance, fulfilling the interface requirements of the primitive hierarchy.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [Cube Primitive](/AgentDocs/primitives/cube-primitive.md)
- **External Packages**: 
    - `gl-matrix` (for `vec2`, `vec3` type definitions)