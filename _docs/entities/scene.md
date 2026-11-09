## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| Scene | entities/scene.md |

This component defines the `Scene` class, which serves as the primary container and manager for all entities within a 3D environment. Its core responsibility is to orchestrate the lifecycle of the scene, including initialization, updating the state of all contained entities and behaviors, and handling the rendering process via the `RenderPipeline`. It encapsulates the entire world state, managing collections of entities, lights, and scene-specific effects like fog.

Architecturally, the `Scene` acts as a high-level controller or root context within the application's entity-component-system (ECS) pattern. It aggregates and manages instances of `SceneEntity`, `SceneEntityBehaviour`, and the `RenderPipeline`. It provides essential methods for serialization/deserialization (`toJsonObject`, `fromJson`) to persist the entire world state, allowing the scene to be loaded and saved across sessions.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `shadowmap` | Getter | Returns the shadow map associated with the scene's render pipeline. |
| `renderPipeline` | Getter | Returns the active `RenderPipeline` instance managing rendering operations. |
| `sceneFog` | Property | The `SceneFog` instance controlling scene-wide fog effects. |
| `isRunning` | Property | Boolean flag indicating if the scene's update loop is active. |
| `inEditMode` | Property | Boolean flag indicating if the scene is currently being edited within the editor. |
| `clearColor` | Property | The background color used when clearing the rendering buffer. |
| `tag` | Property | The string tag identifying the scene entity. |
| `behaviours` | Property | An array containing all `SceneEntityBehaviour` instances attached to the scene. |
| `entityType` | Property | The numerical type identifier for the Scene entity. |
| `objects` | Getter | Returns a read-only array of all `SceneEntity` instances contained within the scene. |
| `lights` | Getter | Returns a read-only array containing only `Light` entities present in the scene. |
| `addEntity(entity)` | Method | Adds a new `SceneEntity` to the scene, initializing it and linking it to the scene context. |
| `removeEntity(entity)` | Method | Removes a specified `SceneEntity` from the scene, ensuring it is destroyed first. |
| `addBehaviour(behaviour)` | Method | Adds a new `SceneEntityBehaviour` to the scene, initializing it and setting the scene as its parent. |
| `setGlRenderingContext(gl)` | Method | Sets the WebGL2 rendering context for the scene and notifies associated behaviours and the render pipeline. |
| `destroy()` | Method | Cleans up the scene, recursively destroying all contained entities and behaviors. |
| `fromJson(jsonObject)` | Method | Deserializes the scene's state from a provided `JsonSerializedData` object. |
| `toJsonObject()` | Method | Serializes the current state of the scene, including all entities and associated assets, into a `JsonSerializedData` object. |
| `getEntitieByName(name)` | Method | Searches and returns a `SceneEntity` based on its name. |
| `getEntitieClassByName(className)` | Method | Searches and returns a `SceneEntity` based on its class name. |
| `getEntitiesClassByName(className)` | Method | Filters and returns an array of `SceneEntity` instances matching a specific class name. |
| `getEntitieByUuid(uuid)` | Method | Searches and returns a `SceneEntity` based on its unique UUID. |
| `getEntitiesByTag(tag)` | Method | Filters and returns an array of `SceneEntity` instances matching a specific tag. |
| `getEntities<T>(constructor)` | Method | Filters and returns an array of entities matching a specific constructor type. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `update` method manages the scene's state flow: it first updates the main camera, then executes `beforeUpdate` hooks from behaviors. If not running, it handles editor-specific updates. If running, it increments elapsed time and iterates over active entities to call their `update` method, followed by `afterUpdate` hooks from behaviors. The `draw` method delegates rendering entirely to the `RenderPipeline`. Serialization involves traversing all objects to extract mesh and texture data into maps for persistence.

- **Side Effects:** Mutates the internal state (`_objects`, `behaviours`, `ellapsedTime`). It interacts with the global state via `Camera.mainCamera` and relies on the `WebGL2RenderingContext` (`gl`) for rendering operations.

- **Error Handling:** The `update` method includes a check (`if (this.destroyed) return;`) to prevent operations on a destroyed scene. The `draw` method also checks for destruction and the presence of the rendering context/camera before proceeding.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.
- **Internal:** [RendererBehaviour](/entities/renderer/renderer-behaviour.md), [Color](/core.md), [Colors](/core.md), [ObjectInstanciator](/core.md), [SceneFog](/core.md), [RenderPipeline](/core/render.md), [EntityType](/enums/entity-type.enum.md), [JsonSerializedData](/interfaces/json-serialized-data.md), [SceneEntityBehaviour](/interfaces/scene-behaviour.md), [CubemapTexture](/textures/cubemap-texture.md), [Texture](/textures/texture.md), [Camera](/entities/camera.md), [SceneEntity](/entities/entity.md), [Light](/entities/lights/light.md).