## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| **SunBehaviour** | [behaviours/sun-behaviour.ts](/behaviours/sun-behaviour.ts) |

This component is responsible for simulating the celestial mechanics of a sun and managing the dynamic day/night cycle within the rendering environment. Its primary responsibility is to control the position, color, and visual properties of the primary directional light (the sun) and optionally, a secondary moon light, based on an internal time-of-day progression. It also manages the visual state of environmental elements like clouds and stars.

This behaviour acts as a central controller within the scene's entity system. It extends [EntityBehaviour](/behaviours/entity-behaviour.md) and interacts heavily with rendering components like [SkyboxRenderer](/behaviours/renderer/skybox-renderer.md) and light entities like [DirectionalLight](/entities/lights/directional-light.md). It dictates the state of the scene's ambient properties by updating the scene's clear color and fog based on the current time.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `SunBehaviour` | Class | Controls the sun's position, color, and the day/night cycle in the scene. |
| `SunBehaviour.dayCycleSettings` | Object | Settings related to the passage of time in the day/night cycle, containing `speed` and `timeOfDay`. |
| `SunBehaviour.hours` | Object | Key time points in the 24-hour day cycle (sunrise, noon, sunset, night). |
| `SunBehaviour.lighColor` | Object | Color palette for the day/night cycle, defining colors for sun and night. |
| `SunBehaviour.dayPhaseColors` | Object | Color palette defining sky and horizon colors for different phases of the day. |
| `SunBehaviour.sun` | Object | Settings for the sun's appearance and path, including `show`, `sunHeight`, `sunSize`, and `sunFalloff`. |
| `SunBehaviour.moon` | Object | Settings for the moon's appearance and cycle, including `show`, `phaseSpeed`, and `phase`. |
| `SunBehaviour.shadows` | Object | Settings for shadow appearance during the day/night cycle, including `nightStrength` and `dayStrength`. |
| `SunBehaviour.clouds` | Object | Settings for cloud visibility and movement, including `speed` and `tiling`. |
| `SunBehaviour.stars` | Object | Settings for starfield visibility and intensity, including `intensity` and `scale`. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The component advances time using `elapsed` time, which drives the `timeOfDay` and `moon.phase`. The `updateSunPosition` method calculates the sun's 3D position based on the time of day and a configured tilt angle. The `getInterpolationData` method determines the correct color and delta factor by mapping the current time to specific segments (sunrise-to-noon, noon-to-sunset, etc.). The `updateLightColor` method uses linear interpolation (`Color.lerp`) based on the delta to smoothly transition light colors and alpha values for both the sun and moon. Finally, `updateSkybox` passes these interpolated values to the [SkyboxShader](/shaders/skybox-shader.md) uniforms.
- **Side Effects:** Mutates external state by modifying the `transform` of the scene's directional light entities. It also mutates the state of the scene itself by setting `scene.clearColor` and `scene.sceneFog.color` via `updateSceneColors`. It creates and adds a `DirectionalLight` entity (`MoonLight`) to the scene if `moon.useDirectionalLight` is true.
- **Error Handling:** The `initialize` method checks for the existence of the scene and the `SkyboxRenderer` before proceeding. The `update` loop includes checks (`if (!this.parent?.scene) return;`) to prevent runtime errors if the parent scene context is unavailable.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `gl-matrix`
- **Internal:** [EntityBehaviour](/behaviours/entity-behaviour.md), [SkyboxRenderer](/behaviours/renderer/skybox-renderer.md), [DirectionalLight](/entities/lights/directional-light.md), [NumberRange](/core/range.md), [Color](/core/color.md), [SceneEntity](/entities/entity.md), [EntityType](/enums/entity-type.enum.md), [Vector3](/core/vector.md), [SkyboxShader](/shaders/skybox-shader.md), [Light](/entities/lights/light.md), [JsonSerializedData](/interfaces/json-serialized-data.md).