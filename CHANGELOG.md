# Changelog

## Unreleased

### Added

- Physics module (`src/physics`), with Omega's own API and the engine behind it swappable:
  - `PhysicsWorld`: gravity, fixed steps (1/60 s by default, at most 5 per frame) with interpolated drawing, `raycast`, contact events (`onContact`) and contact forces (`onContactForce`), `onBeforeStep` for custom forces on the fixed timestep, `timeScale` for slow motion, `stepOnce()` for tests and replays. Add it to a scene with `scene.addBehaviour(world)` to step it every frame, or call `step(elapsed)`.
  - `RigidBodyBehaviour`: dynamic, kinematic (follows its entity's transform) or fixed; mass, damping, CCD, gravity scale, sleeping; velocities, impulses, forces, `teleport`.
  - `ColliderBehaviour`: sphere, box, capsule, cylinder, convex hull and triangle mesh shapes, scaled by the entity; friction, restitution, density or mass, sensors, per-collider `onContact`. Colliders on child entities join the parent's body (compound bodies); with no body they are fixed.
  - `PhysicsBackend` / `PhysicsBackendWorld`: the interface a physics engine implements. `RapierBackend` wraps Rapier 3D (`@dimforge/rapier3d-compat`, an optional peer dependency): the game passes the module in (`await RapierBackend.load(RAPIER)`), so the engine never loads the WebAssembly itself.
- `Pointer`: touch, pen and mouse input through pointer events (several pointers, a short position history, `velocity()` for swipes, `onDown` / `onMove` / `onUp`). The canvas gets `touch-action: none`.
- `LathePrimitive`: a surface of revolution from a [radius, height] profile (smooth normals, UV v along the profile, optional partial sweep).
- Games: `games/<name>/` holds a game's source and `npm run build:games` bundles it into `docs/games/<name>/` for GitHub Pages. First game: Omega Bowling (a ten-frame game with scoring, a pinsetter sweep and a scoreboard; lane, ball and ten pins on the physics module; swipe to bowl, curve the swipe for a hook that bends on the dry back end, tap the lane to aim; synthesised sounds driven by the contact forces, lounge background music sequenced in code, a cut to the pins at impact and a slow-motion replay of strikes; a bowler built from simple shapes and animated in code with the `Animator`, walking up and releasing the ball; one to four players taking turns, a frame each, with a ranking at the end; an obstacle mode where each player's lane gets posts, bumpers, sliding bars, a turning paddle and wind as they knock pins down, and each level multiplies the points; a spare challenge of ten leaves, one ball each; a computer opponent at three skills, in any mode; a neon interface with a start screen (mode, players and their names, computer, Play), a pause menu (continue, restart, menu, sound, music), an end screen with every player's frames, a loading bar, a swipe trail coloured by the throw's speed with a live speed and spin readout, and the obstacle level with its progress). `build-docs` no longer empties `docs/`.
- Second game: Omega Golf, phase 1 (`games/golf/`): a test hole built from a description in code (relief, fairway, tilted green), the ball's own physics without Rapier (drag, Magnus lift and curve, wind, bounces where backspin bites, rolling down slopes, the cup, water and out of bounds), five clubs with a suggested one, a swing gesture (drag down for power, flick up to hit, a slanted flick curves; a sideways drag aims; space on a keyboard), a landing marker, a camera that chases the ball and a trail of its flight. The bundle is about 300 KB. Phase 2: the course, nine holes of our own (par 36) with bunkers, lakes, a creek, an island green, an uphill hole and seeded trees (trunks bounce the ball back, leaves slow it), a wind per hole shown as an arrow, a drop beside the water with a penalty stroke, slower shots from the rough and sand, and the round's total against par. Phase 3: the green: dashes flowing downhill around the ball (coloured by steepness), a putt's power in metres, a ball too fast over the cup catching the lip and turning away, the pole taken out for short putts, a map view from above, and a fly-in over each hole with its name, par and length. Phase 4: a golfer (the bowler's skeleton) with a club whose shaft and head change with the club, standing at the ball for the aim, its backswing following the power bar and the ball leaving when the club reaches it; a putting stroke; an optional motion swing (`?gyro`). Phase 5: the full game: a start screen (9 or 3 holes, one to four players with names, a computer opponent at three skills that plans its shots with the ball's own simulation), turns hole by hole with a banner, a 10-stroke pick-up, the scorecard after each hole, a pause menu, and an end screen with the ranking and a record per device. Phase 6: two more games, nearest the pin (one shot at each of three greens, the metres left count) and the range (ten balls at three ringed targets, points), and sounds synthesised with plain Web Audio (swing, strike by club, landing, leaves, trunk, splash, the cup, chimes), with a sound toggle in the pause menu. After the first test: background music (a sunny tune of our own, sequenced in code, with a toggle), and an easier, quicker swing: it goes off as the finger turns back up, a slower flick still counts, a slightly crooked one goes straight, and the club reaches the ball 0.15 s after the flick (it took up to a second).
- Third game: Omega Run, phase 1 (`games/platformer/`): a side-on platformer drawn in 3D. Levels written as text (one character per tile), the hero's own physics on the tile grid at a fixed 1/120 s step (walls, landing, head bumps, slipping past corners), a jump whose height follows how long the button is held, with coyote time and a jump buffer, walking and running, a camera that looks ahead and never scrolls back, a test level, keyboard and touch controls (a pad and A/B buttons), Bit the robot in plain shapes, and a bot that finishes the level (in the tests, and with `?auto`). Phase 2: coins (100 give a life), bonus blocks that give a coin and are used up, bricks, blocks bumped from below knocking off the enemy on top, spikes, three enemies of our own (Bolota walks and is squashed; Casco hides in its shell and slides when kicked, knocking out other enemies; Zumbido hovers), stomps in a row scoring more, three lives, a checkpoint, a 300 s clock, a score, a HUD, game over, and a camera that keeps the ground in view on low platforms; the bot now looks before leaping. On a phone held upright the hero keeps at least 3.25 m of view ahead (it never reaches the right edge), the camera climbs at once before a high jump goes under the HUD, and the "turn the phone" hint fades after 4 s.
- A page listing the games (`docs/games/index.html`, from `games/index.html`, with a picture of each from `games/shots/`), copied by `npm run build:games`.

### Fixed

- `Animator`: clips added in code with `addClip` were dropped when the animator initialised again (for example when its entity was added to a scene), since loading `clipUris` replaced the list.

## 5.0.0 (2026-11-21)

### Added

- Render to texture: a camera with `targetTexture` set (plus `targetWidth` / `targetHeight`, 512² by default) draws into the render texture `rendertexture://<name>` every frame, before the main camera draws to the canvas. Materials use it like any texture (a minimap, a mirror, a security camera). The main camera always draws to the canvas.
- `RenderTexture` (two colour targets swapped after each render, so an object showing the texture inside that camera's own view never reads the target being drawn), `ResourceManager.getRenderTexture(name)`, `renderTextureUri` / `isRenderTextureUri`, `Camera.refreshMatrices()`.
- Skinned meshes and animation (first version, see the skinned mesh plan):
  - `parseFbx` reads FBX 7.x files, binary or ASCII (`readAsciiFbx`, embedded textures in base64), as Mixamo exports them: node tree, meshes with up to 4 skin weights per vertex, inverse bind matrices (from `TransformLink` and the BindPose), materials with their embedded textures, and animations resampled at 30 fps. FBX 6.x files are refused with a message.
  - `parseCollada` reads COLLADA 1.4 (.dae) files, as Mixamo exports them: node tree (matrix or translate/rotate/scale), one mesh per primitive list (so per material), skins with bind shape and inverse bind matrices, phong/lambert materials (normal maps from `<bump>` or FCOLLADA `<displacement>`), and baked matrix animations split into translation/rotation/scale. Images are separate files: `ModelImage.path`, resolved by `instantiateModel`'s `resolveImage` option. Comes with a small `parseXml` (no DOM needed).
  - `SkinnedMeshRendererBehaviour` draws a mesh from a model file (`meshUri`, `skinUri`) deformed by bone entities (`boneIds`). The mesh is never saved in the scene. Joint matrices go in an RGBA32F texture, so there is no bone limit; shadows follow the pose.
  - `Animator`: `play`, `crossFade`, `stop`, `speed`, `loop`, `time`, `onFinished` / `onLoop`, `playInEditor`, `inPlace` (the root bone keeps its horizontal position, for Mixamo animations that move the hips). Clips (`clipUris`, `<model>#anim/<n>`) find their bones by name (FBX `mixamorig:Hips` and COLLADA `mixamorig_Hips` count as the same), so a Mixamo animation downloaded "Without Skin" plays on the character.
  - `instantiateModel(gl, uri, { scene })` places a model as an entity tree; `ResourceManager.models` / `getModel`, `ResourceLoader.loadBinary`, textures from `<model>#image/<n>`.
  - `AnimationClip`, `sampleChannel` (STEP, LINEAR, CUBICSPLINE), `Shader.defines` / `Shader.withDefines`, `RendererBehaviour.beforeRender()`, `Transform.children`.
- `SunBehaviour` (day/night cycle driving the skybox: sky colours, clouds, stars, moon, shadow strength) and `RotateBehaviour` moved from the editor into the engine, so games and the demo page load them too. Before, a scene played outside the editor dropped them: no stars or clouds, only the skybox's flat colour.
- Performance settings for phones and weak GPUs (`RenderPipelineSettings`):
  - `renderScale` (0.25 to 2): the scene is drawn at that fraction of the canvas size and stretched in the final copy. `dynamicResolution` with `targetFrameRate` lowers it (down to half) while frames are slow and raises it again when there is room; `RenderPipeline.currentRenderScale` reports it.
  - `shadowMapSize` (`ShadowMapSize`: 1024, 2048, 4096; the atlas tiles scale with it), `shadowFilter` (`ShadowFilter`: 1, 4 or 16 PCF taps), `maxSpotShadows` (0 to 4), `maxPointShadows` (0 to 2: each costs 6 views).
  - `applyQuality(RenderQuality.Low | Medium | High)` sets them all; `RenderPipelineSettings.suggestedQuality(gl?)` picks Low on phones and tablets, also by the GPU's name (`isMobileGpu`: Mali, Adreno, PowerVR, Apple…), so a phone browser asking for the desktop site is still caught.
- Frustum culling: opaque and transparent entities outside the camera are not drawn, and each shadow view draws only the casters whose bounds reach into it. `RendererBehaviour.worldBounds()` (bounding sphere from the mesh; for a skinned mesh, from the posed bones and how far their vertices reach). `frustumPlanes`, `sphereInFrustum`, `localBoundingSphere`.
- Shadow cache (`cacheShadows`, on by default): a shadow view is redrawn only when its light matrix changed or a caster inside it moved, posed (`RendererBehaviour.deformationVersion`), appeared or disappeared. A still scene redraws nothing but the directional light's view when the camera moves. `ShadowAtlasPass.stats` counts views and draws per frame.
- Colour grading in the final copy: `RenderPipelineSettings.saturation` (0 to 2, default 1) after tone mapping, and `contrast` (0.5 to 2, default 1) around mid grey after the gamma.

### Fixed

- The skybox shader uses `highp`: with `mediump` (16-bit on phone GPUs) the stars were drawn as streaks.
- The shader noise hashes no longer use `sin()` ("hash without sine"): phone GPUs compute `sin()` of large arguments with little precision, which drew the clouds with bands and hard straight lines. The cloud seed was moved so the default sky keeps a similar look.
- The skybox no longer draws into the shadow maps.
- Shadow tiles are laid out in scene order: with a second camera (render to texture), lights sorted by distance swapped tiles every frame.
- `Transform` getters (`worldPosition`, `forward`, `right`, `up`, `modelMatrix`, …) recompute a changed transform first. Entities that are never drawn, like cameras and lights in edit mode, reported stale positions and directions, and `lookAt` right after moving aimed from the old position.
- `Transform.localRotation` (the saved angles) now matches the rotation after `lookAt`, `rotate` or any quaternion change. Before, a saved scene could reload with cameras, lights or rotated objects facing elsewhere. `toEuler` now uses the same order as `quat.fromEuler`, and `rotate` derives the angles from the quaternion instead of adding them.
- A child transform's own change was lost when its parent updated without moving.
- Point and spot lights now stop at their `range`: the light fades smoothly to 0 there (Frostbite/UE4 windowing) on top of the attenuation. Before, `range` only sized the shadow map, so every light reached the whole scene and coloured lights blended into each other.
- `CameraFlyBehaviour` takes its start yaw and pitch from the view direction, since one rotation has several Euler forms.

### Changed

- Meshes over 65 535 vertices use 32-bit indices (`Shader.indexType`); the renderer and the shadow pass draw with it.
- Meshes that come with normals (`MeshData.providedNormals`, set by the FBX parser) keep them instead of getting recalculated smooth normals.
- The scene is drawn in linear colour, unclamped: the lit, unlit and skybox shaders no longer gamma-encode or clamp each object. The final copy applies exposure, tone mapping and then the sRGB gamma once. Before, ACES and Reinhard worked on colours that were already gamma-encoded and clipped at 1, which washed scenes out and made HDR useless. Scenes with tone mapping `None` look the same as before.
- Shadow strength is per light: `Light.shadowStrength` (0 to 1, default 0.75). `RenderPipelineSettings.shadowStrength` and `ShadowAtlasPass.shadowstrength` are gone, and `packShadows(plan, enabled)` no longer takes a strength. `ShadowsBlock` has a `u_shadowExtra` array (x: strength) per shadow slot.
- Shadow biases are in shadow-map texels: `Light.shadowDepthBias` (default 0.5) moves the lookup toward the light and `Light.shadowNormalBias` (default 1) along the normal at grazing angles, both scaled by the texel's world size at that point. They replace `shadowBias` / `normalBias` (0.1 / 0.05 world units), which were up to 14 texels for spot lights and a few for point lights, so shadows started away from their objects (peter panning). `ShadowSlot` has `texelSize` and `perspective` instead of `orthoDepthRange`, and `ShadowsBlock`'s params are now texel size, perspective flag and first view; the biases go in `u_shadowExtra` (y, z).
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
