## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| SceneManager | /src/managers/scene-manager.ts |

The `SceneManager` is a static utility class designed to handle the entire lifecycle of a scene within the application. Its primary responsibility is to load scene data, which is provided in a serialized JSON format, and reconstruct the entire scene graph, including entities, their components, and associated resources. It manages the complex process of translating raw data structures into active, functional objects within the runtime environment.

This component acts as a high-level service layer responsible for scene persistence and instantiation. It coordinates the loading of various sub-systems, such as [ResourceManager](/src/core/resources/resource-manager.md) for assets and [ObjectInstanciator](/src/core/object-instanciator.md) for creating individual objects. It integrates the resulting scene into the application state, allowing it to be managed by the [Scene](/src/entities/scene.md) entity.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| SceneManager.loadScene | Static Method | Loads a scene from a JSON data object. Takes the rendering context, scene data, and an optional existing scene. Returns the resulting [Scene](/src/entities/scene.md) instance. |
| SceneManager.creatSceneSnapshot | Static Method | Creates a snapshot of the current state of a given [Scene](/src/entities/scene.md) instance, returning it as a [JsonSerializedData](/src/interfaces/json-serialized-data.md) object. |

## 3. Implementation Details & Side Effects
- **Core Logic:** Scene loading involves several sequential steps: initializing the scene, instantiating all necessary [MeshData](/src/core/mesh.md) objects from mesh maps, asynchronously loading and acquiring textures/cubemaps via [Resources](/src/core/resources/resources.md), instantiating all [SceneEntity](/src/entities/entity.md) objects and their associated [EntityBehaviour](/src/behaviours.md), and finally linking parent-child relationships between transforms. Snapshot creation involves calling `scene.toJsonObject()`.
- **Side Effects:** The `loadScene` method interacts with the WebGL2 rendering context (`gl`) to acquire GPU resources (textures/cubemaps) via [ResourceManager](/src/core/resources/resource-manager.md). It mutates the state of the provided or newly created [Scene](/src/entities/scene.md) instance by adding entities and holding resources.
- **Error Handling:** The `loadScene` method handles the creation of a new `Scene` if none is provided. The `instanciateBehaviours` method includes a conditional check (`if (!jsonObject['behaviours'])`) which logs a debug message but does not throw an error if behaviours are missing.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [EntityBehaviour](/src/behaviours.md), [JsonSerializable](/src/core.md), [ResourceManager](/src/core/resources/resource-manager.md), [Resources](/src/core/resources/resources.md), [MeshData](/src/core/mesh.md), [ObjectInstanciator](/src/core/object-instanciator.md), [Transform](/src/core/transform.md), [JsonSerializedData](/src/interfaces/json-serialized-data.md), [CubemapTexture](/src/textures.md), [Texture](/src/textures.md), [SceneEntity](/src/entities/entity.md), [Scene](/src/entities/scene.md)