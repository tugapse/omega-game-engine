# Changelog

## Unreleased

### Added

- Render to texture: a camera with `targetTexture` set (plus `targetWidth` / `targetHeight`, 512² by default) draws into the render texture `rendertexture://<name>` every frame, before the main camera draws to the canvas. Materials use it like any texture (a minimap, a mirror, a security camera). The main camera always draws to the canvas.
- `RenderTexture` (two colour targets swapped after each render, so an object showing the texture inside that camera's own view never reads the target being drawn), `ResourceManager.getRenderTexture(name)`, `renderTextureUri` / `isRenderTextureUri`, `Camera.refreshMatrices()`.

### Fixed

- `Transform` getters (`worldPosition`, `forward`, `right`, `up`, `modelMatrix`, …) recompute a changed transform first. Entities that are never drawn, like cameras and lights in edit mode, reported stale positions and directions, and `lookAt` right after moving aimed from the old position.
- `Transform.localRotation` (the saved angles) now matches the rotation after `lookAt`, `rotate` or any quaternion change. Before, a saved scene could reload with cameras, lights or rotated objects facing elsewhere. `toEuler` now uses the same order as `quat.fromEuler`, and `rotate` derives the angles from the quaternion instead of adding them.
- A child transform's own change was lost when its parent updated without moving.
- `CameraFlyBehaviour` takes its start yaw and pitch from the view direction, since one rotation has several Euler forms.

### Changed

- The scene is drawn in linear colour, unclamped: the lit, unlit and skybox shaders no longer gamma-encode or clamp each object. The final copy applies exposure, tone mapping and then the sRGB gamma once. Before, ACES and Reinhard worked on colours that were already gamma-encoded and clipped at 1, which washed scenes out and made HDR useless. Scenes with tone mapping `None` look the same as before.
- `shadowStrength` defaults to 0.75 (was 0.4, too faint).
- `RenderPipeline` draws each view (the canvas and each render texture) with its own scene and post targets. The shadow atlas is redrawn around each view's camera.

## 4.0.0 (2026-11-20)

### Breaking changes

- `EngineCache` is gone. Use `Resources.for(gl)` (a `ResourceManager` per WebGL context): `getTexture`, `getCubemap`, `getMesh`, `getShader`, or `textures.acquire()` for a handle you `release()`.
- The `assets/images/default/*.jpg` texture paths are gone. Use `BuiltinTextures` (`builtin://white|black|normal|missing`).
- `ShadowMapPass`, `ScreenBlitPass`, `PostProcessingPass` and `RendererBehaviour.createLightMatrices` are removed. They are replaced by `ShadowAtlasPass`, the pipeline's final copy and `PostEffect`.
- `IRenderPass.execute(scene, ctx?)` receives a `RenderContext` (frame data, target, source).
- The lit shader reads lights from `LightsBlock` and shadows from `ShadowsBlock` (uniform blocks at bindings 1 and 2). The old per-light uniforms (`u_numPointLights`, `u_pointLightPositions`, …), `u_lightMVPMatrix`, `u_shadowMap` and `v_lightSpacePosition` no longer exist.
- `RenderPipeline` saves only `settings` (`RenderPipelineSettings`) in the scene.
- `Light.shadowBias` and `normalBias` are in world units.

### Added

- Resources: shared in-flight loads, handles with reference counts, `trim()`, per-context stats, and a pluggable `ResourceLoader` (the editor's loads `asset://<id>`).
- Shaders are embedded in the package (`npm run embed-shaders`); the engine no longer fetches them from the host app.
- `RenderTarget`, `FullscreenProgram`, `FrameData`, `PostEffect` and `RetroEffect`.
- The scene renders into an off-screen target and is copied to the canvas with its depth. Hosts can keep drawing on top with correct occlusion.
- HDR scene colour (RGBA16F when available), tone mapping (None, Reinhard, ACES) and exposure.
- Shadows for spot and point lights in one 4096² atlas: 1 directional, 4 spot, 2 point (6 faces). The directional shadow follows the camera up to `shadowDistance` and snaps to texels.
- Lights get `castShadows`, `shadowBias`, `normalBias`; point and spot lights get `range`.
- `dist/omega-game-engine.d.ts`, a single-file typings bundle (`npm run build:types`).
- Tests with vitest (`npm test`).

### Fixed

- A texture that fails to load shows the magenta missing texture instead of aborting the scene, and keeps its URI.
- Scenes restore the parent/child hierarchy on load.
- `PlanePrimitive` is registered for scene loading.
- Spot light cone angles were used as radians; they are degrees.
- `Texture.create` no longer generates mipmaps for empty textures (`glGenerateMipmap: zero-size texture`).
- The retro post effect output solid red.
