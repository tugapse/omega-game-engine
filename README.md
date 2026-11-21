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
| Lights | `src/entities/lights` | Ambient, directional, point and spot lights. Each light has `castShadows`, `shadowStrength` (0 to 1) and `shadowBias` / `normalBias` (world units). Point and spot lights also have a `range`. |
| Materials and shaders | `src/materials`, `src/shaders` | `LitMaterial` + `LitShader` (Blinn-Phong, normal/specular/roughness/AO/emissive maps), unlit, skybox. |

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
6. Copies the result to the canvas with exposure, tone mapping (None, Reinhard or ACES) and the sRGB gamma. Scene shaders write linear, unclamped colour; only this copy encodes it for the screen. It also writes the scene depth. Whatever the host draws afterwards, like the editor's grid and gizmos, is still hidden by the scene's objects.

Before the main camera, every other active camera with a `targetTexture` runs the same steps into its render texture (`rendertexture://<name>`, `targetWidth` × `targetHeight`). The copy goes into the texture instead of the canvas. Materials pick it up like any texture: `Resources.for(gl).getTexture('rendertexture://minimap')`. Each render texture keeps two targets and swaps them after each render, so a camera can see an object that shows its own texture (the object shows the previous frame).

A scene saves only `RenderPipelineSettings`: shadows on/off and distance, HDR, tone mapping, exposure and the retro effect. GPU objects are always rebuilt.

`RenderTarget` and `FullscreenProgram` are exported for custom passes and effects.

## Shaders

GLSL sources live in `src/shaders/glsl` and are referenced by `ShaderSources` URIs such as `assets/shaders/frag/default-lit.frag`. Fragment shaders can include `@INCLUDE_LIGHT_FUNC`, `@INCLUDE_FOG_FUNC` and `@INCLUDE_UTIL_FUNC`. After editing a `.glsl`, `.vert` or `.frag` file, run `npm run embed-shaders` (it also runs before `build`).

## Changes

See [CHANGELOG.md](CHANGELOG.md).
