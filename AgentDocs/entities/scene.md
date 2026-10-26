## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | Scene |
| Source file | src/entities/scene.ts |

The **Scene** class serves as the primary orchestrator and container for the 3D world environment. It acts as the root organizational unit that manages the lifecycle, spatial hierarchy, and execution flow of all entities, lights, and specialized behaviors within a specific simulation context.

**Functional Mission**
The primary responsibility of **Scene** is to manage the high-level game loop operationsspecifically the `update` and `draw` cycleswhile maintaining a collection of `SceneEntity` objects. It solves the problem of centralized state management by providing a unified interface for entity lifecycle control (addition, removal, destruction), spatial querying, and the coordination of the rendering pipeline.

**System Context & Integration**
The component sits at the center of the engine's execution flow. It receives delta time from the main engine loop to drive its `update` method, which in turn propagates updates to all active `SceneEntity` objects and `SceneEntityBehaviour` instances. It integrates deeply with the [RenderPipeline](/AgentDocs/core/render/render-pipeline.md) to execute drawing commands and utilizes the [SceneFog](/AgentDocs/core/scene-fog.md) to define environmental atmospheric properties. During serialization, it acts as a data aggregator, collecting mesh and texture information from [RendererBehaviour](/AgentDocs/behaviours/renderer/renderer-behaviour.md) components to produce a complete scene snapshot.

- **INTERNAL REFERENCES**: 
    - [SceneEntity](/AgentDocs/entities/entity.md)
    - [RenderPipeline](/AgentDocs/core/render/render-pipeline.md)
    - [SceneFog](/AgentDocs/core/scene-fog.md)
    - [Light](/AgentDocs/entities/lights/light.md)
    - [Camera](/AgentDocs/entities/camera.md)
    - [SceneEntityBehaviour](/AgentDocs/interfaces/scene-behaviour.md)
    - [EntityType](/AgentDocs/enums/entity-type.enum.md)
    - [ObjectInstanciator](/AgentDocs/core/object-instanciator.md)
    - [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md)
    - [CubemapTexture](/AgentDocs/textures/cubemap-texture.md)
    - [Texture](/AgentDocs/textures/texture.md)

## 2. Environment & Configuration
**Environment Lookups:**
- `gl` (via `setGlRenderingContext`)  The WebGL2 rendering context used for all GPU-bound operations within the scene.

**Hardcoded Constants:**
- `tag` (Default: `'Scene'`)  The default identifier for the scene entity.
- `entityType` (Default: `EntityType.SCENE`)  The enum value identifying this object as a scene.
- `clearColor` (Default: `Colors.aliceBlue`)  The default background color used when clearing the frame buffer.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `shadowmap` | Getter | Accesses the shadow map property of the internal `RenderPipeline`. |
| `renderPipeline` | Getter | Accesses the internal `RenderPipeline` instance. |
| `objects` | Getter | Returns the array of all `SceneEntity` objects currently in the scene. |
| `lights` | Getter | Filters and returns all entities that are instances of `Light`. |
| `update(ellapsed: number)` | Method | Drives the logic loop: updates camera, runs behaviors, and updates active entities. |
| `draw()` | Method | Triggers the `RenderPipeline` to execute the draw calls. |
| `addEntity(entity)` | Method | Registers a new entity, sets its scene reference, and initializes it. |
| `removeEntity(entity)` | Method | Removes an entity from the collection and triggers its destruction. |
| `addBehaviour(behaviour)` | Method | Attaches a `SceneEntityBehaviour` to the scene. |
| `setGlRenderingContext(gl)` | Method | Distributes the WebGL2 context to the pipeline and all scene behaviors. |
| `destroy()` | Method | Recursively destroys all child entities and clears the object collection. |
| `fromJson(jsonObject)` | Method | Reconstructs the scene state, pipeline, fog, and entities from JSON. |
| `toJsonObject()` | Method | Serializes the scene, including complex mappings for meshes and textures. |
| `getEntitieByName(name)` | Method | Finds a single entity by its string name. |
| `getEntitieClassByName(className)` | Method | Finds a single entity by its class name string. |
| `getEntitiesClassByName(className)` | Method | Returns all entities matching a specific class name. |
| `getEntitieByUuid(uuid)` | Method | Finds a single entity by its unique identifier. |
| `getEntitiesByTag(tag)` | Method | Returns all entities associated with a specific tag. |
| `getEntities<T>(constructor)` | Method | Returns a filtered array of entities of a specific type `T`. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. Calls `super('Scene')` to initialize base entity properties.
    2. Initializes empty collections for `_objects` and `behaviours`.
    3. Instantiates `SceneFog` and `RenderPipeline`.
    4. Triggers `_renderPipeline.initialize(this)` to link the pipeline to the scene.
- **Data Path (Update Loop)**: 
    1. **Input**: `ellapsed` time (seconds).
    2. **Pre-Update**: Updates `Camera.mainCamera` and executes `beforeUpdate` on all scene behaviors.
    3. **Editor Mode Branch**: If `!isRunning` and `inEditMode`, updates only entities marked with `updateInEditor`.
    4. **Runtime Update**: If `isRunning`, increments `ellapsedTime`, iterates through `active` entities to call `update(ellapsed)`, and executes `afterUpdate` on behaviors.
- **Data Path (Serialization)**:
    1. **Input**: Current scene state.
    2. **Processing**: Iterates through all objects to find `RendererBehaviour` components. Extracts `meshData` UUIDs and maps `Texture`/`CubemapTexture` URIs to prevent duplication.
    3. **Output**: A `JsonSerializedData` object containing base info, pipeline state, fog state, entity list, and resource maps.
- **Conditional Branching**:
    - `if (this.destroyed)`: Aborts `update`, `draw`, `addEntity`, and `removeEntity` to prevent operations on a defunct scene.
    - `if (!this.isRunning)`: Diverts logic between "Editor Mode" updates and "Runtime" updates.
    - `if (!this.gl || !Camera.mainCamera)`: Prevents `draw()` execution if the rendering context or camera is unavailable.

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [RendererBehaviour](/AgentDocs/behaviours/renderer/renderer-behaviour.md)
    - [Color](/AgentDocs/core/color.md)
    - [Colors](/AgentDocs/core/colors.md)
    - [ObjectInstanciator](/AgentDocs/core/object-instanciator.md)
    - [SceneFog](/AgentDocs/core/scene-fog.md)
    - [RenderPipeline](/AgentDocs/core/render/render-pipeline.md)
    - [EntityType](/AgentDocs/enums/entity-type.enum.md)
    - [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md)
    - [SceneEntityBehaviour](/AgentDocs/interfaces/scene-behaviour.md)
    - [CubemapTexture](/AgentDocs/textures/cubemap-texture.md)
    - [Texture](/AgentDocs/textures/texture.md)
    - [Camera](/AgentDocs/entities/camera.md)
    - [SceneEntity](/AgentDocs/entities/entity.md)
    - [Light](/AgentDocs/entities/lights/light.md)
- **External Packages**: None identified.