## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | SceneManager |
| Source file | src/managers/scene-manager.ts |

The **SceneManager** is a high-level orchestration component responsible for the lifecycle of a scene, specifically focusing on the transformation of static JSON data into a live, interactive scene graph. It serves as the primary deserialization engine, bridging the gap between persistent storage formats and the runtime engine state.

**Functional Mission**
The primary responsibility of the **SceneManager** is to automate the complex process of scene reconstruction. It solves the problem of state hydration by coordinating the instantiation of geometry, the asynchronous loading of textures, the creation of hierarchical entities, and the attachment of logic-driven behaviors, ensuring all components are correctly linked via UUIDs.

**System Context & Integration**
This component acts as the entry point for scene transitions. It interacts heavily with [EngineCache](/AgentDocs/core/engineCache.md) to manage shared resources like textures and meshes, preventing redundant GPU uploads. It utilizes [ObjectInstanciator](/AgentDocs/core/object-instanciator.md) to dynamically create class instances based on JSON metadata. Once the reconstruction is complete, it populates a [Scene](/AgentDocs/entities/scene.md) instance, which then becomes the primary data structure for the rendering pipeline and entity management systems.

- **INTERNAL REFERENCES**: [EngineCache](/AgentDocs/core/engineCache.md), [ObjectInstanciator](/AgentDocs/core/object-instanciator.md), [Scene](/AgentDocs/entities/scene.md), [MeshData](/AgentDocs/interfaces/meshData.md), [Transform](/AgentDocs/core/transform.md), [SceneEntity](/AgentDocs/entities/entity.md), [EntityBehaviour](/AgentDocs/behaviours/entity-behaviour.md), [Texture](/AgentDocs/textures/texture.md), [CubemapTexture](/AgentDocs/textures/cubemap-texture.md), [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md).

## 2. Environment & Configuration
**Environment Lookups:**
- `gl` (via `loadScene`)  The WebGL2 rendering context required for texture and buffer allocation.

**Hardcoded Constants:**
- No hardcoded constants identified.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `loadScene` | static async Func | Orchestrates the full deserialization of a scene from JSON, including meshes, textures, and entities. |
| `instaciateAndLoadSceneTextures` | private async Func | Iterates through texture maps to load 2D textures or Cubemaps into the [EngineCache](/AgentDocs/core/engineCache.md). |
| `instaciateSceneMeshes` | private Func | Converts raw mesh JSON maps into a dictionary of [MeshData](/AgentDocs/interfaces/meshData.md) objects. |
| `instaciateSceneObjects` | private Func | Iterates through entity data to trigger entity and behavior instantiation. |
| `prepareTransforms` | static Func | Reconstructs the scene hierarchy by linking parent-child [Transform](/AgentDocs/core/transform.md) relationships. |
| `creatSceneSnapshot` | static Func | Serializes the current state of a [Scene](/AgentDocs/entities/scene.md) into a JSON-compatible object. |
| `instanciateBehaviours` | private Func | Attaches [EntityBehaviour](/AgentDocs/behaviours/entity-behaviour.md) instances to entities and links mesh data. |
| `instanciateEntity` | private Func | Creates a [SceneEntity](/AgentDocs/entities/entity.md) and registers its [Transform](/AgentDocs/core/transform.md). |

## 4. Execution Logic & Flow
- **Initialization**: 
    - Clears the [EngineCache](/AgentDocs/core/engineCache.md).
    - Initializes a new [Scene](/AgentDocs/entities/scene.md) if one is not provided.
    - Sets the WebGL2 context on the scene.
- **Data Path**: 
    - **Input**: `JsonSerializedData` (containing `meshMaps`, `objects`, and `textureMaps`).
    - **Processing**: 
        1. `instaciateSceneMeshes`: Creates [MeshData](/AgentDocs/interfaces/meshData.md) objects.
        2. `instaciateAndLoadSceneTextures`: Asynchronously fetches textures via [EngineCache](/AgentDocs/core/engineCache.md).
        3. `instaciateSceneObjects`: 
            - `instanciateEntity`: Creates [SceneEntity](/AgentDocs/entities/entity.md) and stores its [Transform](/AgentDocs/core/transform.md).
            - `instanciateBehaviours`: Uses [ObjectInstanciator](/AgentDocs/core/object-instanciator.md) to create behaviors and link them to the entity.
    - **Output**: A fully hydrated [Scene](/AgentDocs/entities/scene.md) instance.
- **Conditional Branching**:
    - **Texture Type Check**: If `textureJsonData.url` exists, it loads a 2D texture; if `uris` exists, it loads a Cubemap.
    - **Behavior Existence**: If `jsonObject['behaviours']` is missing, it logs a debug message and initializes an empty array rather than throwing an error.
    - **Instantiation Success**: Only adds behaviors to the entity if [ObjectInstanciator](/AgentDocs/core/object-instanciator.md) successfully returns a valid instance.

## 5. Resource Dependencies
- **Standard Libraries**: `Promise` (ES6)
- **Internal Modules**: 
    - [EntityBehaviour](/AgentDocs/behaviours/entity-behaviour.md)
    - [EngineCache](/AgentDocs/core/engineCache.md)
    - [JsonSerializable](/AgentDocs/core/json-serializable.md)
    - [MeshData](/AgentDocs/interfaces/meshData.md)
    - [ObjectInstanciator](/AgentDocs/core/object-instanciator.md)
    - [Transform](/AgentDocs/core/transform.md)
    - [JsonSerializedData](/AgentDocs/interfaces/json-serialized-data.md)
    - [CubemapTexture](/AgentDocs/textures/cubemap-texture.md)
    - [Texture](/AgentDocs/textures/texture.md)
    - [SceneEntity](/AgentDocs/entities/entity.md)
    - [Scene](/AgentDocs/entities/scene.md)
- **External Packages**: None identified.