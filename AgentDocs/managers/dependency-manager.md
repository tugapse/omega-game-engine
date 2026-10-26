## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | DependencyManager |
| Source file | src/managers/dependency-manager.ts |

The **DependencyManager** serves as the central registry and factory configuration hub for the Omega Engine. Its primary purpose is to bridge the gap between serialized data (such as JSON scene files) and live runtime object instances by mapping string identifiers to specific class constructors or instantiation logic.

**Functional Mission**
The core mission of the **DependencyManager** is to populate the [ObjectInstanciator](/AgentDocs/core/object-instanciator.md) with a comprehensive library of engine components. By registering factory functions alongside rich metadata (type, path, and description), it enables the engine to perform dynamic deserialization and provides the necessary discovery mechanism for editor-side tools to browse available entities, materials, and behaviours.

**System Context & Integration**
This component acts as a bootstrap module that must be executed during the engine's initialization phase. It does not manage the lifecycle of objects itself but rather configures the [ObjectInstanciator](/AgentDocs/core/object-instanciator.md) to act as a universal factory. Once `registerDependencies` is called, downstream modules like the [SceneManager](/AgentDocs/managers/scene-manager.md) can request the creation of complex hierarchies (e.g., a [SceneEntity](/AgentDocs/entities/entity.md) with a [MeshRendererBehaviour](/AgentDocs/behaviours/renderer/mesh-renderer-behaviour.md) and a [LitMaterial](/AgentDocs/materials/lit-material.md)) using only their string-based class names.

- **INTERNAL REFERENCES**: 
    - [ObjectInstanciator](/AgentDocs/core/object-instanciator.md)
    - [ClassType](/AgentDocs/enums/class-type.enum.md)
    - [Shader](/AgentDocs/shaders/shader.md)

## 2. Environment & Configuration
**Environment Lookups:**
- No environment lookups identified.

**Hardcoded Constants:**
- No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `registerDependencies` | Method | Executes the registration of all engine classes, primitives, shaders, and materials into the `ObjectInstanciator`. |

## 4. Execution Logic & Flow
- **Initialization**: The method is invoked once during engine startup. It relies on the `ObjectInstanciator` being available to receive dependency mappings.
- **Data Path**: 
    1. **Registration Phase**: Iterates through categorized groups (Entities, Geometry, Shaders, Behaviours, Materials, etc.).
    2. **Mapping Phase**: For each entry, it passes a unique string key, a factory function (either a direct constructor or a wrapper), and a metadata object containing `ClassType`, `path`, and `description`.
    3. **Shader Pre-fetch**: Finalizes the process by calling `Shader.preFetchFunctionsGlsl()` to prepare GLSL utility functions.
- **Conditional Branching**: No complex branching; the logic is a linear sequence of registration calls.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [EntityBehaviour](/AgentDocs/behaviours/entity-behaviour.md)
    - [MeshRendererBehaviour](/AgentDocs/behaviours/renderer/mesh-renderer-behaviour.md)
    - [RendererBehaviour](/AgentDocs/behaviours/renderer/renderer-behaviour.md)
    - [CameraFlyBehaviour](/AgentDocs/behaviours/camera-fly-behaviour.md)
    - [SkyboxRenderer](/AgentDocs/behaviours/renderer/skybox-renderer.md)
    - [Transform](/AgentDocs/core/transform.md)
    - [Color](/AgentDocs/core/color.md)
    - [MeshData](/AgentDocs/interfaces/meshData.md)
    - [ObjectInstanciator](/AgentDocs/core/object-instanciator.md)
    - [Camera](/AgentDocs/entities/camera.md)
    - [SceneEntity](/AgentDocs/entities/entity.md)
    - [Light](/AgentDocs/entities/lights/light.md)
    - [PointLight](/AgentDocs/entities/lights/point-light.md)
    - [SpotLight](/AgentDocs/entities/lights/spot-light.md)
    - [DirectionalLight](/AgentDocs/entities/lights/directional-light.md)
    - [ColorMaterial](/AgentDocs/materials/color-material.md)
    - [CubemapMaterial](/AgentDocs/materials/cubemap-material.md)
    - [LitMaterial](/AgentDocs/materials/lit-material.md)
    - [UnlitMaterial](/AgentDocs/materials/unlit-material.md)
    - [CubePrimitive](/AgentDocs/primitives/cube-primitive.md)
    - [QuadPrimitive](/AgentDocs/primitives/quad-primitive.md)
    - [SkyboxPrimitive](/AgentDocs/primitives/skybox-primitive.md)
    - [SpherePrimitive](/AgentDocs/primitives/sphere-primitive.md)
    - [TrianglePrimitive](/AgentDocs/primitives/triangle-primitive.md)
    - [LitShader](/AgentDocs/shaders/lit-shader.md)
    - [Shader](/AgentDocs/shaders/shader.md)
    - [SkyboxShader](/AgentDocs/shaders/skybox-shader.md)
    - [UnlitShader](/AgentDocs/shaders/unlit-shader.md)
    - [ClassType](/AgentDocs/enums/class-type.enum.md)
    - [SkyboxMaterial](/AgentDocs/materials/skybox-material.md)
- **External Packages**: None identified.