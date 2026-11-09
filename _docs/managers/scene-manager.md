## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| SceneManager | managers/scene-manager.md |

This component is a static manager responsible for the entire lifecycle of scene data, handling the loading, instantiation, and serialization of complex scene graphs from a structured JSON format. Its primary responsibility is to act as the bridge between static scene definitions (JSON) and the live, interactive runtime state of the application, ensuring all necessary assets like meshes and textures are correctly prepared before scene construction.

Architecturally, `SceneManager` functions as a high-level service layer within the engine. It orchestrates interactions between various core systems, such as utilizing [EngineCache](/core/engine-cache.md) for asset management, [ObjectInstanciator](/core/object-instanciator.md) for object creation, and [Scene](/entities/scene.md) for holding the final graph structure. It manages the complex flow of deserialization, from raw data to fully linked, interactive entities.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| SceneManager.loadScene | Static Method | Asynchronously loads a scene from JSON data, creating or populating an existing [Scene](/entities/scene.md) instance. Returns a Promise resolving to the loaded Scene. |
| SceneManager.creatSceneSnapshot | Static Method | Creates a snapshot of the current state of a given [Scene](/entities/scene.md) instance into a serializable JSON format. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `loadScene` method follows a strict pipeline: clearing the engine cache, instantiating all required meshes, asynchronously loading all textures via `instaciateAndLoadSceneTextures`, instantiating all entities and their behaviors via `instaciateSceneObjects`, and finally applying the scene structure using `scene.fromJson()`. Hierarchy reconstruction is handled separately by `prepareTransforms` after entity instantiation.
- **Side Effects:** Mutates the global state via `EngineCache.clear()` and populates the `EngineCache` by loading textures. It also interacts with the rendering context (`gl`) to perform WebGL operations.
- **Error Handling:** The `instanciateBehaviours` method includes a debug log for missing behaviours but does not explicitly throw an error in the provided logic path.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.
- **Internal:** [EntityBehaviour](/behaviours/entity-behaviour.md), [EngineCache](/core/engine-cache.md), [JsonSerializable](/interfaces/json-serialized-data.md), [CubemapTexture](/textures/cubemap-texture.md), [Texture](/textures/texture.md), [SceneEntity](/entities/entity.md), [Scene](/entities/scene.md), [MeshData](/core/mesh.md), [ObjectInstanciator](/core/object-instanciator.md), [Transform](/core/transform.md).