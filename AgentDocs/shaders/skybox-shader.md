## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | SkyboxShader |
| Source file | skybox-shader.ts |

The **SkyboxShader** is a specialized procedural rendering component designed to simulate complex atmospheric environments. It serves as the visual foundation for the scene's background, capable of synthesizing celestial bodies (sun, moon), atmospheric phenomena (clouds), and stellar fields (stars) through mathematical noise and geometric calculations within the GPU.

Its primary mission is to bridge high-level environmental configurationssuch as time of day, weather, and celestial positioningwith low-level WebGL uniform updates. By supporting both procedural generation and cubemap texture blending, it provides a versatile solution for dynamic sky rendering that can transition from a static captured environment to a fully animated, living atmosphere.

**Functional Mission**
The **SkyboxShader** is responsible for managing the lifecycle and uniform state of the skybox rendering process. It solves the problem of real-time environmental animation by providing a structured interface to manipulate complex shader parameters (sun direction, moon phase, cloud density) without requiring manual GLSL manipulation by the user.

**System Context & Integration**
This component operates as a specialized implementation of the [Shader](/AgentDocs/shaders/shader.md) base class. It is tightly coupled with [SkyboxMaterial](/AgentDocs/materials/skybox-material.md) to retrieve environmental properties and [CubemapTexture](/AgentDocs/textures/cubemap-texture.md) for texture-based sky backgrounds. During the rendering loop, it is typically utilized by a [SkyboxRenderer](/AgentDocs/behaviours/renderer/skybox-renderer.md) to apply these visual parameters to the skybox primitive. It acts as a data translator, converting high-level TypeScript objects (like `sun` and `moon` configurations) into the specific uniform inputs required by the fragment shader defined in [ShaderSources](/AgentDocs/shaders/shader-sources.md).

- **INTERNAL REFERENCES**: [Shader](/AgentDocs/shaders/shader.md), [SkyboxMaterial](/AgentDocs/materials/skybox-material.md), [CubemapTexture](/AgentDocs/textures/cubemap-texture.md), [ShaderUniformsEnum](/AgentDocs/enums/shader-uniforms.enum.md), [ShaderSources](/AgentDocs/shaders/shader-sources.md), [Vector3](/AgentDocs/core/vector.md), [Color](/AgentDocs/core/color.md).

## 2. Environment & Configuration
**Environment Lookups:**
- `gl` (via `instanciate`/`setTexture`)  The WebGL2 rendering context used for all GPU operations.

**Hardcoded Constants:**
- `sun.sunSize` (Default: `0.999`)  Apparent size of the sun disk.
- `sun.sunFalloff` (Default: `0.03`)  Softness of the sun disk's edge.
- `moon.moonSize` (Default: `0.998`)  Apparent size of the moon disk.
- `moon.moonFalloff` (Default: `0.002`)  Softness of the moon disk's edge.
- `moon.moonEarthshine` (Default: `0.02`)  Intensity of earthshine on the moon.
- `moon.moonTerminatorSoftness` (Default: `0.5`)  Softness of the moon's shadow line.
- `moon.moonEnableRotation` (Default: `1`)  Boolean flag for automatic moon rotation.
- `moon.moonRotationSpeed` (Default: `0.05`)  Speed of moon rotation.
- `cloud.cloudSpeed` (Default: `0.1`)  Movement speed of clouds.
- `cloud.cloudTiling` (Default: `0.4`)  Tiling factor for cloud noise.
- `cloud.cloudSeed` (Default: `10.0`)  Random seed for cloud patterns.
- `cloud.cloudSparsity` (Default: `0.01`)  Density of clouds.
- `cloud.wheatherCondition` (Default: `0.4`)  General weather appearance control.
- `star.starIntensity` (Default: `3.0`)  Brightness of stars.
- `star.starScale` (Default: `200.0`)  Scale of star field noise.
- `star.starSparsity` (Default: `34.0`)  Density of stars.
- `star.starSpeed` (Default: `0.004`)  Rotation speed of star field.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `instanciate` | Static Method | Factory method to create a new `SkyboxShader` instance with a specific `SkyboxMaterial`. |
| `initialize` | Method | Sets the URI paths for vertex and fragment shader sources from `ShaderSources`. |
| `loadDataIntoShader` | Async Method | Synchronizes all procedural (sun, moon, clouds, stars) and material properties to GPU uniforms. |
| `setTexture` | Method | Binds a `CubemapTexture` to a specific sampler uniform and texture unit. |
| `release` | Method | Performs cleanup by unbinding the material's main texture. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. `initialize()` is called, mapping `this.fragUri` and `this.vertexUri` to the specific skybox sources in `ShaderSources`.
    2. The parent `Shader.initialize()` is invoked to compile and link the program.
- **Data Path**:
    1. **Input**: High-level configuration objects (`sun`, `moon`, `clouds`, `stars`) and `SkyboxMaterial` properties.
    2. **Processing**: `loadDataIntoShader()` iterates through these objects, converting `Vector3` and `Color` types into raw arrays/vectors compatible with WebGL.
    3. **Texture Handling**: If `material.mainTex` exists, the shader checks if it is loaded; if not, it triggers the load process. If loaded, it binds the texture to the specified unit.
    4. **Output**: Uniform values are uploaded to the GPU via `gl.uniform*` calls, defining the visual state of the sky.
- **Conditional Branching**:
    - **Texture Loading**: Checks `material.mainTex.isImageLoaded` to decide between an asynchronous load or an immediate texture bind.
    - **Feature Toggles**: Uses ternary operators (e.g., `this.sun.useSun ? 1 : 0`) to pass boolean flags as integers to the GLSL shader to enable/disable specific procedural effects (Sun, Moon, Clouds, Stars).

## 5. Resource Dependencies
- **Standard Libraries**: None identified.
- **Internal Modules**: 
    - [Vector3](/AgentDocs/core/vector.md)
    - [Color](/AgentDocs/core/color.md)
    - [ShaderUniformsEnum](/AgentDocs/enums/shader-uniforms.enum.md)
    - [SkyboxMaterial](/AgentDocs/materials/skybox-material.md)
    - [CubemapTexture](/AgentDocs/textures/cubemap-texture.md)
    - [Shader](/AgentDocs/shaders/shader.md)
    - [ShaderSources](/AgentDocs/shaders/shader-sources.md)
- **External Packages**: None identified.