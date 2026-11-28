## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **TerrainBehaviour** | [src/terrain/terrain-behaviour.ts](/src/terrain/terrain-behaviour.ts) |

This component manages the entire state, rendering, and interaction logic for a terrain surface within the application. Its primary responsibility is to maintain a grid of terrain chunks, handle the procedural generation and modification of heightmaps and splat maps, and manage the associated rendering entities in the scene. It acts as the central authority for terrain geometry and material properties.

It functions as a core service within the application's data model, inheriting from [EntityBehaviour](/src/behaviours/entity-behaviour.ts). It coordinates between the terrain data structure ([TerrainGrid](/src/terrain/terrain-data.ts)), the rendering pipeline ([TerrainChunkRenderer](/src/terrain/terrain-chunk-renderer.ts)), physics simulation ([PhysicsWorld](/src/physics/physics-world.ts)), and user interaction tools ([SculptTool](/src/terrain/terrain-brush.ts) and [BrushSettings](/src/terrain/terrain-brush.ts)).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `SavedTerrainChunk` | Interface | Defines the structure for saving a single terrain chunk, including its coordinates, height data (base64), and optional splat maps. |
| `TerrainBehaviour` | Class | Manages terrain state, rendering, and editing operations. |
| `TerrainBehaviour.settings` | Getter | Returns the current `TerrainSettings` object used by the terrain grid. |
| `TerrainBehaviour.grid` | Property | The active `TerrainGrid` instance holding all chunk data. |
| `TerrainBehaviour.material` | Property | The `TerrainMaterial` instance defining rendering layers and blending. |
| `TerrainBehaviour.lodDistances` | Property | An array defining the distances at which Level of Detail transitions occur. |
| `TerrainBehaviour.lodBias` | Property | A multiplier applied to the LOD distances. |
| `TerrainBehaviour.castShadows` | Property | Boolean indicating if chunks should cast shadows. |
| `TerrainBehaviour.colliders` | Property | Boolean indicating if heightfield colliders should be generated for chunks. |
| `TerrainBehaviour.friction` | Property | The friction value applied to ground colliders. |
| `TerrainBehaviour.history` | Property | The `TerrainHistory` instance managing undo/redo operations for terrain edits. |
| `TerrainBehaviour.addChunk` | Method | Adds a new chunk to the grid at specified coordinates, updating internal state. |
| `TerrainBehaviour.removeChunk` | Method | Removes a chunk from the grid at specified coordinates. |
| `TerrainBehaviour.rendererOf` | Method | Retrieves the `TerrainChunkRenderer` instance associated with a specific chunk coordinate. |
| `TerrainBehaviour.refreshAll` | Method | Forces all existing chunk renderers to refresh their geometry. |
| `TerrainBehaviour.toLocal` | Method | Transforms a world-space point into the terrain's local coordinate system using the model matrix. |
| `TerrainBehaviour.heightAt` | Method | Calculates the world height of the ground at a given world (x, z) coordinate. |
| `TerrainBehaviour.normalAt` | Method | Calculates the world normal vector of the ground at a given world (x, z) coordinate. |
| `TerrainBehaviour.raycast` | Method | Performs a raycast against the terrain surface to find the first intersection point. |
| `TerrainBehaviour.beginStroke` | Method | Initiates a new brush stroke, recording the intent ('heights' or 'splat') in the history. |
| `TerrainBehaviour.endStroke` | Method | Finalizes the current brush stroke, committing changes to the history. |
| `TerrainBehaviour.sculptAt` | Method | Applies a sculpting operation at a world point, modifying heights based on the tool and brush settings. |
| `TerrainBehaviour.paintAt` | Method | Applies a painting operation (layer modification) at a world point. |
| `TerrainBehaviour.undo` | Method | Reverts the terrain state to the previous recorded state. |
| `TerrainBehaviour.redo` | Method | Reapplies the last undone terrain state. |
| `TerrainBehaviour.bakeRules` | Method | Applies procedural rules (like slope-based weighting) to the splat maps, recording the operation. |
| `TerrainBehaviour.clearPainting` | Method | Clears all splat map data, reverting to the state defined by terrain rules. |
| `TerrainBehaviour.showBrush` | Method | Updates the material to display a visual brush indicator at a specific world point. |
| `TerrainBehaviour.saveChunks` | Method | Serializes the current state of all terrain chunks into an array of `SavedTerrainChunk`. |
| `TerrainBehaviour.loadChunks` | Method | Deserializes terrain chunks from a list of `SavedTerrainChunk` data, replacing the current grid state. |
| `TerrainBehaviour.toJsonObject` | Method | Serializes the entire terrain behaviour state into a JSON structure. |
| `TerrainBehaviour.fromJson` | Method | Loads the terrain behaviour state from a provided JSON structure. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component manages state synchronization between the internal `TerrainGrid` and the visible `SceneEntity`s. Updates involve iterating over the grid to create/destroy `SceneEntity`s and their associated `TerrainChunkRenderer`s during `sync()`. Editing operations (`sculptAt`, `paintAt`) modify the underlying `TerrainGrid` and are tracked by `TerrainHistory`. World-space queries (`heightAt`, `normalAt`, `raycast`) involve transforming world coordinates into the terrain's local space using the entity's transformation matrix. Saving/Loading uses Base64 encoding/decoding for height and splat data.
- **Side Effects:** Mutates the scene graph by adding or removing `SceneEntity`s in `sync()`. It interacts with the `PhysicsWorld` to create/update `ColliderBehaviour`s in `refreshColliders()`. It modifies the state of `TerrainMaterial` and `TerrainGrid`.
- **Error Handling:** The `raycast` method implements iterative refinement (binary search) to find the exact intersection point, handling cases where the ray misses or intersects outside the defined `maxDistance`. `refreshColliders` checks for the existence of `PhysicsWorld.main` before attempting collider generation.

## 4. Dependencies & Configuration
**Environment & Configuration:**
- No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [EntityBehaviour](/src/behaviours/entity-behaviour.ts), [SceneEntity](/src/entities/entity.ts), [JsonSerializedData](/src/interfaces/json-serialized-data.ts), [ColliderBehaviour](/src/physics/collider-behaviour.ts), [PhysicsWorld](/src/physics/physics-world.ts), [Shader](/src/shaders/shader.ts), [TerrainGrid](/src/terrain/terrain-data.ts), [TerrainSettings](/src/terrain/terrain-data.ts), [BrushSettings](/src/terrain/terrain-brush.ts), [clearSplat](/src/terrain/terrain-brush.ts), [fillSplat](/src/terrain/terrain-brush.ts), [paint](/src/terrain/terrain-brush.ts), [sculpt](/src/terrain/terrain-brush.ts), [SculptTool](/src/terrain/terrain-brush.ts), [TerrainHistory](/src/terrain/terrain-brush.ts), [TerrainChunkRenderer](/src/terrain/terrain-chunk-renderer.ts), [ruleNoise](/src/terrain/terrain-rules.ts), [terrainAutoWeights](/src/terrain/terrain-rules.ts), [TerrainMaterial](/src/terrain/terrain-material.ts), [TerrainShader](/src/terrain/terrain-shader.ts).