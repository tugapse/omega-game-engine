## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| DependencyManager | managers/dependency-manager.md |

This component is responsible for centralizing the registration of every core class, entity, material, primitive, and shader within the engine's dependency system. Its primary function is to populate the `ObjectInstanciator` with factory functions and metadata, enabling the engine to dynamically instantiate complex objects from serialized data formats like scene files.

Architecturally, the `DependencyManager` acts as a critical bootstrapping service. It bridges the gap between serialized data (which only contains names) and live runtime objects. By registering dependencies, it ensures that when the engine deserializes a scene, it knows exactly how to construct a [SceneEntity](/entities/entity.md), a [LitMaterial](/materials/lit-material.md), or a [CubePrimitive](/primitives/cube-primitive.md) using the correct constructors and metadata.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| DependencyManager | Class | Manages the registration of all engine classes with the `ObjectInstanciator`. |
| registerDependencies | Method | Registers all core engine classes with the `ObjectInstanciator`. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `registerDependencies` method iterates through various categories (Entities, Geometry, Shaders, Behaviours, Materials) and calls `ObjectInstanciator.addDependency` for each class. For each registration, it provides a factory function (either a direct constructor call or a static `instanciate` method) and a metadata object detailing the class's name, type, and path. It concludes by calling `Shader.preFetchFunctionsGlsl()` to prepare shader resources.

- **Side Effects:** Mutates the global state of the `ObjectInstanciator` by adding new dependency mappings. It also triggers a pre-fetching operation on the `Shader` class.

- **Error Handling:** None explicitly documented; relies on the underlying `ObjectInstanciator` and class constructors to handle instantiation errors.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.

- **Internal:** [EntityBehaviour](/behaviours/entity-behaviour.md), [MeshRendererBehaviour](/behaviours/mesh-renderer-behaviour.md), [RendererBehaviour](/behaviours/renderer-behaviour.md), [CameraFlyBehaviour](/behaviours/camera-fly-behaviour.md), [SkyboxRenderer](/behaviours/renderer/skybox-renderer.md), [SceneEntity](/entities/entity.md), [Camera](/entities/camera.md), [Light](/entities/lights.md), [PointLight](/entities/lights.md), [SpotLight](/entities/lights.md), [DirectionalLight](/entities/lights.md), [Transform](/core/transform.md), [Color](/core/color.md), [MeshData](/core/mesh.md), [ObjectInstanciator](/core/object-instanciator.md), [CubePrimitive](/primitives/cube-primitive.md), [QuadPrimitive](/primitives/quad-primitive.md), [SpherePrimitive](/primitives/sphere-primitive.md), [SkyboxPrimitive](/primitives/skybox-primitive.md), [TrianglePrimitive](/primitives/triangle-primitive.md), [Shader](/shaders/shader.md), [SkyboxShader](/shaders/skybox-shader.md), [UnlitShader](/shaders/unlit-shader.md), [LitShader](/shaders/lit-shader.md), [ColorMaterial](/materials/color-material.md), [CubemapMaterial](/materials/cubemap-material.md), [LitMaterial](/materials/lit-material.md), [UnlitMaterial](/materials/unlit-material.md), [SkyboxMaterial](/materials/skybox-material.md)