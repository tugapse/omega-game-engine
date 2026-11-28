# Omega Game Engine

TypeScript WebGL2 game engine used by the Omega editor (`omega-editor`) and by the users' game scripts (compiled by `omega-code-service`). Published to npm as `omega-game-engine`.

## Build and test

```bash
npm install
npm run build        # embeds the GLSL shaders, tsc to dist/, bundles dist/omega-game-engine.d.ts
npm test             # vitest (no GPU needed)
npm run build-js     # rollup browser bundles + api-extractor
npm run build-docs   # typedoc into docs/
```

`npm run build` runs three steps:

1. `embed-shaders` turns `src/shaders/glsl/**` into `src/shaders/embedded-shaders.ts`, so the engine never fetches shaders from the host app.
2. `tsc` writes `dist/` (`index.js` + per-file `.d.ts`).
3. `build:types` writes `dist/omega-game-engine.d.ts`, a single-file typings bundle. The code service wraps it in an ambient module for user scripts and for the code editor.

While developing with the editor, install the local build there with `npm install --no-save ../omega-engine`, then restart `ng serve` and clear `.angular/cache`.

## Main pieces

| Area | Where | What it does |
| :--- | :--- | :--- |
| Engine and scenes | `src/engine.ts`, `src/entities`, `src/managers/scene-manager.ts` | `Engine` runs the loop. A `Scene` holds `SceneEntity` objects with behaviours. `SceneManager.loadScene` restores a scene from JSON, parents included. |
| Resources | `src/core/resources` | `Resources.for(gl)` returns the `ResourceManager` of a WebGL context. It caches textures, cubemaps, OBJ meshes and shader sources, shares in-flight loads and hands out handles (`acquire` / `release`). A `ResourceLoader` decides how files are fetched; the editor plugs one in for `asset://<id>`. A texture that fails to load becomes the magenta `builtin://missing` and keeps its URI. |
| Built-in textures | `builtin-textures.ts` | `builtin://white`, `black`, `normal`, `missing`, generated in memory. |
| Render pipeline | `src/core/render` | Forward pipeline, described below. |
| Lights | `src/entities/lights` | Ambient, directional, point and spot lights. Each light has `castShadows`, `shadowStrength` (0 to 1) and `shadowDepthBias` / `shadowNormalBias` (in shadow-map texels). Point and spot lights also have a `range`, where their light fades to 0. |
| Materials and shaders | `src/materials`, `src/shaders` | `LitMaterial` + `LitShader` (Blinn-Phong, normal/specular/roughness/AO/emissive maps), unlit, skybox. |
| Terrain | `src/terrain` | `TerrainBehaviour`: height chunks joined on a grid, levels of detail, a layered material placed by height and slope rules and by painting, a brush with undo, heightmaps in and out, heightfield colliders. Described below. |
| Physics | `src/physics` | `PhysicsWorld`, `RigidBodyBehaviour`, `ColliderBehaviour` over a swappable backend (`RapierBackend`). |

## Render pipeline

Each frame, `RenderPipeline.draw()`:

1. Builds a `FrameData` once: camera, visible entities by layer (opaque nearest first, skybox, transparent farthest first), lights and shadow casters.
2. Plans the shadows (`planShadows`) and draws their depth into one 4096² atlas (`ShadowAtlasPass`):
   - 1 directional light: a 2048² tile, orthographic, following the camera up to `shadowDistance` and snapped to texels;
   - up to 4 spot lights: one 1024² tile each;
   - up to 2 point lights: six 512² tiles each, one per cube face.
   The nearest shadow-casting lights to the camera get the budget.
3. Uploads three uniform blocks shared by every shader: `CameraBlock` (binding 0), `LightsBlock` (1, `LightsUBO`) and `ShadowsBlock` (2).
4. Draws the scene into an off-screen `RenderTarget` (RGBA16F when `EXT_color_buffer_float` exists, otherwise RGBA8, plus a depth texture), then runs any passes added with `addPass`.
5. Runs the enabled `PostEffect`s, each reading the previous result (ping-pong between two targets). `RetroEffect` is the built-in one.
6. Copies the result to the canvas with exposure, tone mapping (None, Reinhard or ACES), saturation, the sRGB gamma and contrast. Scene shaders write linear, unclamped colour; only this copy encodes it for the screen. It also writes the scene depth. Whatever the host draws afterwards, like the editor's grid and gizmos, is still hidden by the scene's objects.

Before the main camera, every other active camera with a `targetTexture` runs the same steps into its render texture (`rendertexture://<name>`, `targetWidth` × `targetHeight`). The copy goes into the texture instead of the canvas. Materials pick it up like any texture: `Resources.for(gl).getTexture('rendertexture://minimap')`. Each render texture keeps two targets and swaps them after each render, so a camera can see an object that shows its own texture (the object shows the previous frame).

A scene saves only `RenderPipelineSettings`: shadows on/off and distance, HDR, tone mapping, exposure, saturation, contrast and the retro effect. GPU objects are always rebuilt.

`RenderTarget` and `FullscreenProgram` are exported for custom passes and effects.

## Terrain

A terrain is an entity with a `TerrainBehaviour`. Its `grid` (`TerrainGrid`) holds square chunks on a sparse grid, each (N+1)² heights in metres (N a power of two, 128 by default, over 128 m). Neighbours share their border row and every write goes to all the copies, so chunks never part; `addChunk(cx, cz)` copies the borders already there. Each chunk is drawn by a child entity (`transient`: not saved, not listed in the editor) with a `TerrainChunkRenderer`, which writes its vertex buffers from the heights and picks one of four levels of detail by the camera's distance; skirts hide the cracks between levels.

`TerrainMaterial` has up to 8 layers (`TerrainLayer`): a ground texture (made in code: grass, dirt, rock, snow, sand, gravel; or images), tiling, tint, and rules on height and slope with noisy edges. Each layer covers those before it where its rules hold; the painted splat (two RGBA textures per chunk) goes on top, its weights summing to how much it covers. The layers blend by the height of their textures, with triplanar mapping on steep slopes (`triplanar`) and a large-scale variation against tiling. All in `terrain.frag`; `terrain-rules.ts` has the same sums in TypeScript.

Editing, in world space: `sculptAt` (raise, lower, smooth, flatten, noise), `terraceAt` (flat steps), `erodeAt` (droplet erosion: gullies and filled hollows), `paintAt` (a layer, or erasing back to the rules), `beginStroke` / `endStroke` with `undo` / `redo`; `rampAt` (a straight slope between two points) and `stampAt` (a hill, crater, plateau or volcano) are one undo step each, or join the stroke that is open; `bakeRules` (the rules written into the painting, to touch up by hand). The same tools in terrain space are plain functions (`terrain-shapes.ts`, `terrain-erosion.ts`), testable in Node.

Relief: `heightField` makes a height function from the fractal relief (`ReliefFieldOptions`: scale, octaves, roughness, ridges, flat valleys, plus `warp` to twist it and `island` to sink the edges of an area) or from a grey image; `generateFrom` writes any height function into every chunk, `generateRelief` the plain relief; `sampleField` samples one for a preview. `growChunk(cx, cz, height)` adds a chunk filled from a height function and bent to meet the ground it touches. Heightmaps: `exportHeightmap` / `importHeightmap` (16-bit, .r16 or 8-bit PNG, `smoothHeightmap` for the steps of 8-bit images). Reading: `heightAt`, `normalAt`, `raycast`, `layerWeightsAt` (what the ground is at a point: the painting over the rules).

Vegetation: a `TerrainVegetationBehaviour` beside the terrain scatters species (`defaultTrees()`: pines and broadleaves) on every chunk where their layers cover the ground, by the rules and the painting, in woods and clearings, off the water. The same seed and numbers always give the same plants. A chunk is built again when its heights or painting change (not during a stroke); each chunk's plants are one merged mesh per part and look, which works with the lights, shadows and fog (instancing would replace only that). `pushOut` keeps a walker out of the trunks. With a `PhysicsWorld`, every chunk gets a heightfield collider, made again when a stroke ends. The scene saves the settings, the material and each chunk's heights (16-bit) and painting (only when painted).

## Shaders

GLSL sources live in `src/shaders/glsl` and are referenced by `ShaderSources` URIs such as `assets/shaders/frag/default-lit.frag`. Fragment shaders can include `@INCLUDE_LIGHT_FUNC`, `@INCLUDE_FOG_FUNC` and `@INCLUDE_UTIL_FUNC`. After editing a `.glsl`, `.vert` or `.frag` file, run `npm run embed-shaders` (it also runs before `build`).

## Changes

See [CHANGELOG.md](CHANGELOG.md).
