## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **Scene** | [src/entities/scene.ts](/src/entities/scene.ts) |

The `Scene` class serves as the primary container and manager for all elements within a 3D environment. Its core responsibility is to aggregate `SceneEntity` instances, manage the rendering pipeline via `RenderPipeline`, and orchestrate the lifecycle (initialization, updating, drawing) of all contained objects. It encapsulates the state of the entire world instance, including scene-specific properties like `clearColor` and `sceneFog`.

Architecturally, the `Scene` acts as a high-level controller or root service within the application's entity-component system. It utilizes `SceneEntity` as its base, managing collections of entities (`_objects`) and scene-specific behaviors (`behaviours`). It interfaces heavily with rendering systems, specifically holding and managing the `RenderPipeline` and providing access to the `WebGL2RenderingContext` via `setGlRenderingContext`.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `shadowmap` | Getter | Returns the shadow map associated with the scene's render pipeline. |
| `renderPipeline` | Getter | Returns the active `RenderPipeline` instance for the scene. |
| `sceneFog` | Property | Holds the `SceneFog` configuration for the scene. |
| `isRunning` | Property | Boolean flag indicating if the scene's update loop is currently active. |
| `inEditMode` | Property | Boolean flag indicating if the scene is currently being edited within the editor. |
| `clearColor` | Property | The background color used when clearing the scene buffer. |
| `tag` | Property | The string tag identifying the scene entity. |
| `behaviours` | Property | An array containing all `SceneEntityBehaviour` instances attached to the scene. |
| `entityType` | Property | The numerical type identifier for the scene entity (`EntityType.SCENE`). |
| `objects` | Getter | Provides read-only access to the array of all `SceneEntity` objects in the scene. |
| `lights` | Getter | Filters and returns an array containing only `Light` entities present in the scene. |
| `addEntity(entity: SceneEntity)` | Method | Adds a new `SceneEntity` to the scene, initializing it and linking it to the scene context. |
| `removeEntity(entity: SceneEntity)` | Method | Removes a specified `SceneEntity` from the scene, ensuring it is destroyed first. |
| `addBehaviour(behaviour: SceneEntityBehaviour)` | Method | Attaches a new `SceneEntityBehaviour` to the scene, initializing it and setting its parent. |
| `setGlRenderingContext(gl: WebGL2RenderingContext)` | Method | Sets the WebGL2 rendering context for the scene and notifies associated behaviours and the render pipeline. |
| `holdResource(handle: ResourceHandle<unknown>)` | Method | Registers a resource handle to prevent its release while the scene is active. |
| `destroy()` | Method | Cleans up the scene, destroying all contained entities and releasing held resources. |
| `fromJson(jsonObject: JsonSerializedData)` | Method | Reconstructs the scene state from a serialized JSON object, including entities and the render pipeline. |
| `toJsonObject()` | Method | Serializes the current state of the scene, including all entities and associated mesh/texture data, into a `JsonSerializedData` object. |
| `getEntitieByName(name: string)` | Method | Searches the scene for an entity matching the provided name. |
| `getEntitieClassByName(className: string)` | Method | Searches the scene for an entity matching the provided class name. |
| `getEntitiesClassByName(className: string)` | Method | Filters and returns all entities matching the specified class name. |
| `getEntitieByUuid(uuid: string)` | Method | Searches the scene for an entity matching the provided UUID. |
| `getEntitiesByTag(tag: string)` | Method | Filters and returns all entities possessing a specific tag. |
| `getEntities<T extends SceneEntity>(constructor: new (...args: any[]) => T)` | Method | Filters and returns all entities matching a given constructor type. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `update` method implements conditional logic based on `isRunning` and `inEditMode` to determine whether to run the full simulation loop or a specialized editor update loop. The `draw` method delegates rendering entirely to the `_renderPipeline`. Serialization (`toJsonObject`) involves iterating over renderers to extract and map complex assets like textures and meshes into separate maps for external storage.
- **Side Effects:** Mutates the internal state of the scene by adding/removing entities and behaviours. It calls `destroy()` on children during cleanup. It interacts with external systems by calling `Camera.mainCamera.update()` and rendering via `_renderPipeline.draw()`.
- **Error Handling:** The `destroy` method ensures that all child entities and the render pipeline are explicitly destroyed before the scene itself is destroyed. Fallbacks are present during JSON deserialization to instantiate a default `RenderPipeline` if the serialized data is missing.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:**
- [ResourceHandle](/src/core/resources/resource-cache.ts)
- [RendererBehaviour](/src/behaviours/renderer/renderer-behaviour.ts)
- [Color](/src/core/color.ts)
- [Colors](/src/core/colors.ts)
- [ObjectInstanciator](/src/core/object-instanciator.ts)
- [SceneFog](/src/core/scene-fog.ts)
- [RenderPipeline](/src/core/render.ts)
- [EntityType](/src/enums/entity-type.enum.ts)
- [JsonSerializedData](/src/interfaces/json-serialized-data.ts)
- [SceneEntityBehaviour](/src/interfaces/scene-behaviour.ts)
- [CubemapTexture](/src/textures/cubemap-texture.ts)
- [Texture](/src/textures/texture.ts)
- [Camera](/src/entities/scene/camera.ts)
- [SceneEntity](/src/entities/scene/entity.ts)
- [Light](/src/entities/scene/lights/light.ts)