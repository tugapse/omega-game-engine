import { Vector3, Color } from "../core";
import { ShaderUniformsEnum } from "../enums";
import { CubemapMaterial, SkyboxMaterial } from "../materials";
import { CubemapTexture } from "../textures";
import { Shader } from "./shader";
import { ShaderSources } from "./shader-sources";


/**
 * A procedural sky shader designed for rendering dynamic skyboxes.
 * It can generate a sky with a sun, moon, clouds, and stars, and also supports blending with a cubemap texture.
 *
 * @remarks
 * This shader is highly configurable through its public properties, allowing for real-time changes
 * to the time of day, weather conditions, and celestial body positions.
 *
 * @augments {Shader}
 */
export class SkyboxShader extends Shader {

  protected override _className = "SkyboxShader"

  /**
   * Creates a new instance of SkyboxShader.
   *
   * @override
   * @param gl - The WebGL2 rendering context.
   * @param material - The skybox material associated with this shader.
   * @returns A new `SkyboxShader` instance.
   */
  public static override instanciate(gl: WebGL2RenderingContext, material: SkyboxMaterial): SkyboxShader {
    return new SkyboxShader(gl, material);
  }

  /**
   * The skybox material associated with this shader.
   */
  public declare material: SkyboxMaterial;

  /**
   * Configuration for the procedural sun.
   */
  public sun = {
    /** Toggles the rendering of the sun disk. */
    useSun:false,
    /** The direction vector pointing towards the sun. */
    sunDirection: new Vector3(0, 0.3, -10),
    /** The color of the sun disk. */
    sunColor: new Color(1, 1, 1, 1),
    /** The apparent size of the sun disk in the sky. A value closer to 1.0 is smaller. */
    sunSize: 0.999,
    /** The softness of the sun disk's edge. */
    sunFalloff: 0.03,
    
  }

  /**
   * Configuration for the procedural moon.
   */
  public moon = {
    /** Toggles the rendering of the moon disk. */
    useMoon:false,
    /** The direction vector pointing towards the moon. */
    moonDirection: new Vector3(0, -1, 0),
    /** The color of the moon disk. */
    moonColor: new Color(0.8, 0.9, 1.0, 1.0), // Pale bluish-white
    /** The apparent size of the moon disk. */
    moonSize: 0.998,     // Slightly smaller than the sun
    /** The softness of the moon disk's edge. */
    moonFalloff: 0.002,  // Crisper edge than the sun
    /** The current phase of the moon (0.0 to 1.0). */
    moonPhase: 0.0,
    /** The intensity of the earthshine effect on the dark side of the moon. */
    moonEarthshine: 0.02,
    /** The softness of the shadow line (terminator) on the moon's surface. */
    moonTerminatorSoftness: 0.5,
    /** Toggles automatic rotation of the moon. */
    moonEnableRotation: 1,
    /** The speed at which the moon rotates. */
    moonRotationSpeed: 0.05,
  }

  /**
   * Configuration for the procedural clouds.
   */
  clouds = {
    /** Toggles the rendering of clouds. */
    useClouds:false,
    /** The speed at which the clouds move across the sky. */
    cloudSpeed: 0.1,
    /** The number of layers or repetitions for the cloud noise. */
    cloudRepetition: 0,
    /** The tiling factor for the cloud texture/noise. */
    cloudTiling: 0.4,
    /** The seed for the random noise generation, allowing for different cloud patterns. */
    cloudSeed: 10.0,
    /** Controls the density or coverage of the clouds. */
    cloudSparsity: 0.01,
    /** A general value to control the overall weather appearance (e.g., clear vs. overcast). */
    wheatherCondition: 0.4,
  }

  /**
   * Configuration for the procedural stars.
   */
  stars = {
    /** Toggles the rendering of stars. */
    useStars:false,
    /** The overall brightness of the stars. */
    starIntensity: 3.0,
    /** The scale of the star field noise pattern. */
    starScale: 200.0,
    /** Controls the density of the stars in the sky. */
    starSparsity: 34.0,
    /** The speed at which the star field appears to rotate. */
    starSpeed: 0.004,
  }



  /**
   * Initializes the shader by setting the correct file paths for the vertex and fragment shaders
   * before calling the parent's `initialize` method.
   * @override
   * @returns A promise that resolves to `true` if initialization is successful.
   */
  public override initialize(): Promise<boolean> {
    this.fragUri = ShaderSources.frag.skybox;
    this.vertexUri = ShaderSources.vertex.skybox;
    return super.initialize();
  }

  /**
   * Loads all material and procedural properties (sky colors, sun, moon, etc.) into the shader's uniforms.
   * @override
   */
  public override async loadDataIntoShader(): Promise<void> {
    if (!this.material) return; // Material must be present
    this.use()
    // Await texture loading
    if (this.material.mainTex) {
      if (!this.material.mainTex.isImageLoaded) {
        this.material.mainTex.setGL(this.gl);
        await this.material.mainTex.load();
      }else{
        this.setTexture(ShaderUniformsEnum.U_MAIN_TEX, this.material.mainTex as CubemapTexture, 0);
        this.material.mainTex.bind();
      }

    }

    super.loadDataIntoShader();

    // Set sun uniforms from the shader's properties
    this.setVec3(ShaderUniformsEnum.U_SUN_DIRECTION, this.sun.sunDirection.vector);
    this.setVec4(ShaderUniformsEnum.U_SUN_COLOR, this.sun.sunColor.toVec4());
    this.setFloat(ShaderUniformsEnum.U_SUN_SIZE, this.sun.sunSize);
    this.setFloat(ShaderUniformsEnum.U_SUN_FALLOFF, this.sun.sunFalloff);
    this.setInt(ShaderUniformsEnum.U_USE_SUN, this.sun.useSun ? 1 : 0);

    this.setVec3(ShaderUniformsEnum.U_MOON_DIRECTION, this.moon.moonDirection.vector);
    this.setVec4(ShaderUniformsEnum.U_MOON_COLOR, this.moon.moonColor.toVec4());
    this.setFloat(ShaderUniformsEnum.U_MOON_SIZE, this.moon.moonSize);
    this.setFloat(ShaderUniformsEnum.U_MOON_FALLOFF, this.moon.moonFalloff);
    this.setFloat(ShaderUniformsEnum.U_MOON_PHASE, this.moon.moonPhase);
    this.setFloat(ShaderUniformsEnum.U_MOON_EARTHSHINE, this.moon.moonEarthshine);
    this.setFloat(ShaderUniformsEnum.U_MOON_TERMINATOR_SOFTNESS, this.moon.moonTerminatorSoftness);
    this.setInt(ShaderUniformsEnum.U_MOON_ENABLE_ROTATION, this.moon.moonEnableRotation);
    this.setFloat(ShaderUniformsEnum.U_MOON_ROTATION_SPEED, this.moon.moonRotationSpeed);
    this.setInt(ShaderUniformsEnum.U_USE_MOON, this.moon.useMoon ? 1 : 0);
    
    this.setVec4(ShaderUniformsEnum.U_SKY_COLOR, this.material.skyColor.toVec4());
    this.setVec4(ShaderUniformsEnum.U_HORIZON_COLOR, this.material.horizonColor.toVec4());
    this.setVec4(ShaderUniformsEnum.U_GROUND_COLOR, this.material.groundColor.toVec4());
    this.setFloat(ShaderUniformsEnum.U_EXPONENT, this.material.exponent);
    
    this.setInt(ShaderUniformsEnum.U_CLOUD_REPETITION, this.clouds.cloudRepetition);
    this.setFloat(ShaderUniformsEnum.U_CLOUD_SPEED, this.clouds.cloudSpeed);
    this.setFloat(ShaderUniformsEnum.U_CLOUD_TILING, this.clouds.cloudTiling);
    this.setFloat(ShaderUniformsEnum.U_CLOUD_SEED, this.clouds.cloudSeed);
    this.setInt(ShaderUniformsEnum.U_USE_CLOUDS, this.clouds.useClouds ? 1 : 0);
    this.setFloat(ShaderUniformsEnum.U_WHEATHER_CONDITION, this.clouds.wheatherCondition);
    this.setFloat(ShaderUniformsEnum.U_CLOUD_SPARSITY, this.clouds.cloudSparsity);

    this.setInt(ShaderUniformsEnum.U_USE_STARS, this.stars.useStars ? 1 : 0);
    this.setFloat(ShaderUniformsEnum.U_STAR_INTENSITY, this.stars.starIntensity);
    this.setFloat(ShaderUniformsEnum.U_STAR_SCALE, this.stars.starScale);
    this.setFloat(ShaderUniformsEnum.U_STAR_SPARSITY, this.stars.starSparsity);
    this.setFloat(ShaderUniformsEnum.U_STAR_SPEED, this.stars.starSpeed);
    this.release();
  }


  /**
   * Binds a cubemap texture to a sampler uniform in the shader.
   * @override
   * @param name - The name of the uniform.
   * @param texture - The cubemap texture object.
   * @param textureIndex - The texture unit index to bind to.
   */
  public override setTexture(name: string, texture: CubemapTexture, textureIndex: number): void {
    const location = this.gl.getUniformLocation(this._shaderProgram, name);
    if (location) {
      this.gl.activeTexture(this.gl.TEXTURE0 + textureIndex);
      texture.bind();
      this.gl.uniform1i(location, textureIndex);
    }
  }

  /**
   * Unbinds the main cubemap texture after rendering.
   * @override
   */
  override release(): void {
    this.material.mainTex?.unBind();
  }


}
