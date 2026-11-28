## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **DependencyManager** | [src/managers/dependency-manager.ts](/src/managers/dependency-manager.ts) |

This component is responsible for initializing and registering all core classes, behaviors, materials, and primitives required by the engine's runtime system. Its primary function is to populate the `ObjectInstanciator` with factory methods for every essential engine component, ensuring that dependencies can be resolved correctly upon request.

It acts as a central configuration service within the application architecture. By registering dependencies, it dictates the blueprint for how the `SceneManager` and other systems will construct objects, linking concrete implementations like [ColorMaterial](/materials/color-material.md) or [MeshRendererBehaviour](/behaviours/renderers/mesh-renderer-behaviour.md) to their respective types defined in [ClassType.enum](/enums/class-type.enum.md).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `DependencyManager` | Class | Manages the registration of all engine dependencies via the `registerDependencies` method. |
| `registerDependencies()` | Method | Registers all necessary classes and their instantiation methods with the SceneManager's dependency injection system. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `registerDependencies` method iterates through various categories (Entities, Geometry, Shaders, Behaviours, Materials) and calls `ObjectInstanciator.addDependency` for each component. This method maps a string identifier to a constructor function or a pre-defined instantiation method, along with metadata describing the component's type and path. It concludes by calling `Shader.preFetchFunctionsGlsl()` to prepare shader assets.
- **Side Effects:** Mutates the global state of the `ObjectInstanciator` by adding dependency definitions. It also calls `Shader.preFetchFunctionsGlsl()`, which implies an interaction with shader compilation/loading mechanisms.
- **Error Handling:** None explicitly documented; relies on the underlying `ObjectInstanciator` and instantiation methods to handle creation errors.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [TerrainBehaviour](/behaviours/terrain/terrain-behaviour.md), [SkinnedMeshRendererBehaviour](/behaviours/renderers/skinned-mesh-renderer-behaviour.md), [Animator](/behaviours/animation/animator.md), [EntityBehaviour](/behaviours/entity-behaviour.md), [MeshRendererBehaviour](/behaviours/renderers/mesh-renderer-behaviour.md), [RendererBehaviour](/behaviours/renderer-behaviour.md), [CameraFlyBehaviour](/behaviours/camera/camera-fly-behaviour.md), [SunBehaviour](/behaviours/sun-behaviour.md), [RotateBehaviour](/behaviours/rotate-behaviour.md), [SkyboxRenderer](/behaviours/renderers/skybox-renderer.md), [Transform](/core/transform.md), [Color](/core/color.md), [MeshData](/core/mesh.md), [ObjectInstanciator](/core/object-instanciator.md), [Camera](/entities/camera.md), [SceneEntity](/entities/entity.md), [DirectionalLight](/entities/light/directional-light.md), [Light](/entities/light/light.md), [PointLight](/entities/light/point-light.md), [SpotLight](/entities/light/spot-light.md), [ColorMaterial](/materials/color-material.md), [CubemapMaterial](/materials/cubemap-material.md), [LitMaterial](/materials/lit-material.md), [UnlitMaterial](/materials/unlit-material.md), [CubePrimitive](/primitives/cube-primitive.md), [PlanePrimitive](/primitives/plane-primitive.md), [QuadPrimitive](/primitives/quad-primitive.md), [SkyboxPrimitive](/primitives/skybox-primitive.md), [SpherePrimitive](/primitives/sphere-primitive.md), [TrianglePrimitive](/primitives/triangle-primitive.md), [LitShader](/shaders/lit-shader.md), [Shader](/shaders/shader.md), [SkyboxShader](/shaders/skybox-shader.md), [UnlitShader](/shaders/unlit-shader.md), [ClassType.enum](/enums/class-type.enum.md), [SkyboxMaterial](/materials/skybox-material.md)