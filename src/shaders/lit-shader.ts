import { EngineCache } from "../core/engineCache";
import { Camera } from "../entities/camera";
import { ShaderUniformsEnum } from "../enums/shader-uniforms.enum";
import { JsonSerializedData } from "../interfaces";
import { LitMaterial } from "../materials/lit-material";
import { Texture } from "../textures/texture";
import { Shader } from "./shader";
import { ShaderSources } from "./shader-sources";

/**
 * A shader for rendering objects with physically-based lighting.
 * It supports multiple light sources, normal mapping, and various material texture maps
 * (specular, roughness, ambient occlusion, emissive) for a PBR-like workflow.
 *
 * @augments {Shader}
 */
export class LitShader extends Shader {

  protected override _className = "LitShader"

  protected _emissiveMapUniformLocation: WebGLUniformLocation | null = null;
  protected _tangentAttributeLocation: GLint = -1;
  protected _bitangentAttributeLocation: GLint = -1;

  // Add this property to cache our generated 1x1 textures
  private _defaultTextures: { [key: string]: WebGLTexture } = {};

  /**
   * Creates a new instance of LitShader.
   *
   * @override
   * @param gl - The WebGL2 rendering context.
   * @param material - The lit material associated with this shader.
   * @returns A new `LitShader` instance.
   */
  public static override instanciate(gl: WebGL2RenderingContext, material: LitMaterial): LitShader {
    return new LitShader(gl, material);
  }

  /**
   * Creates an instance of LitShader.
   * @param gl - The WebGL2 rendering context.
   * @param material - The `LitMaterial` containing properties for this shader.
   */
  constructor(override gl: WebGL2RenderingContext, override material: LitMaterial) {
    super(
      gl,
      material,
      ShaderSources.frag.default_lit,
      ShaderSources.vertex.default
    );
  }

  /**
   * Loads the lit material's properties into the shader's uniforms.
   * This includes PBR properties like specular strength and roughness, as well as texture maps.
   * @override
   */
  public override loadDataIntoShader(): void {
    if (!this.material) return;

    this.checkAndLoadTextures();
    
    super.loadDataIntoShader();
    this.setVec4(ShaderUniformsEnum.U_MAT_COLOR, this.material.color.toVec4());
    this.setVec2(ShaderUniformsEnum.U_UV_SCALE, this.material.uvScale.vector);
    this.setVec2(ShaderUniformsEnum.U_UV_OFFSET, this.material.uvOffset.vector);

    this.setFloat(ShaderUniformsEnum.U_SPECULAR_STRENGTH, this.material.specularStrength);
    this.setFloat(ShaderUniformsEnum.U_ROUGHNESS, Math.max(this.material.roughness, 0.01));
    this.setFloat(ShaderUniformsEnum.U_NORMAL_MAP_STRENGTH, this.material.normalMapStrength);

    this.setVec3(ShaderUniformsEnum.U_CAMERA_POSITION, Camera.mainCamera.transform.worldPosition);
  }

  /**
   * Asynchronously checks and loads all necessary PBR textures (main, normal, specular, etc.).
   * If a texture is not yet loaded, it binds a fallback texture for the current frame while
   * the actual texture loads in the background.
   * @protected
   */
  protected async checkAndLoadTextures(): Promise<void> {
    const bindMap = async (
      tex: Texture | undefined | null,
      uniformName: string | ShaderUniformsEnum,
      unit: number,
      defaultGetter: (gl: WebGL2RenderingContext) => Promise<Texture> | Texture
    ) => {
      let activeTex = tex;

      if (!activeTex || !activeTex.isImageLoaded) {
        if (activeTex && !activeTex.isImageLoaded) {
          activeTex.setGL(this.gl);
          activeTex.load(); // Start loading, but use fallback for this frame
        }
        activeTex = await defaultGetter(this.gl);
      }

      // Explicitly secure the WebGL state to prevent texture unit collisions
      if (this._shaderProgram && activeTex) {
        const location = this.gl.getUniformLocation(this._shaderProgram, uniformName as string);
        if (location !== null) {
          this.gl.activeTexture(this.gl.TEXTURE0 + unit);
          
          if ((activeTex as any).glTexture) {
            this.gl.bindTexture(this.gl.TEXTURE_2D, (activeTex as any).glTexture);
          } else {
            activeTex.bind(); 
          }
          
          this.gl.uniform1i(location, unit);
        }
      }
      return activeTex;
    };
    
    this.material.mainTex = await bindMap(this.material.mainTex, ShaderUniformsEnum.U_MAIN_TEX, 0, EngineCache.getWhiteTexture);
    this.material.normalTex = await bindMap(this.material.normalTex, ShaderUniformsEnum.U_NORMAL_TEX, 1, EngineCache.getNormalTexture);
    this.material.specularTex = await bindMap(this.material.specularTex, "u_specularMap", 3, EngineCache.getWhiteTexture);
    this.material.roughnessTex = await bindMap(this.material.roughnessTex, "u_roughnessMap", 4, EngineCache.getWhiteTexture);
    this.material.aoTex = await bindMap(this.material.aoTex, "u_aoMap", 5, EngineCache.getWhiteTexture);
    this.material.emissiveTex = await bindMap(this.material.emissiveTex, "u_emissiveMap", 6, EngineCache.getBlackTexture);
  }

  /**
   * Unbinds all material textures after rendering to free up texture units.
   * @override
   */
  override release(): void {
    super.release();
    if (this.material.mainTex) this.material.mainTex.unBind();
    if (this.material.normalTex) this.material.normalTex.unBind();
    if (this.material.specularTex) this.material.specularTex.unBind();
    if (this.material.roughnessTex) this.material.roughnessTex.unBind();
    if (this.material.aoTex) this.material.aoTex.unBind();
    if (this.material.emissiveTex) this.material.emissiveTex.unBind();
  }

  /**
   * Serializes the shader and its material properties to a JSON object.
   * @override
   * @returns The serialized JSON data.
   */
  override toJsonObject(): JsonSerializedData {
    return {
      ...super.toJsonObject(),
      mainTex: this.material.mainTex?.toJsonObject(),
      normalTex: this.material.normalTex?.toJsonObject(),
      specularTex: this.material.specularTex?.toJsonObject(),
      roughnessTex: this.material.roughnessTex?.toJsonObject(),
      aoTex: this.material.aoTex?.toJsonObject(),
      emissiveTex: this.material.emissiveTex?.toJsonObject(),
    }
  }

  /**
   * Deserializes the shader's state from a JSON object.
   * @override
   * @param jsonObject - The JSON data to deserialize from.
   */
  override async fromJson(jsonObject: JsonSerializedData): Promise<void> {
    await super.fromJson(jsonObject);
    this.material.fromJson(jsonObject['material']);
  }

  /**
   * Deletes and cleans up all WebGL resources associated with this shader and its textures.
   * @override
   */
  public override destroy(): void {
    super.destroy();
    if (this.material.mainTex) this.material.mainTex.destroy();
    if (this.material.normalTex) this.material.normalTex.destroy(); 
    if (this.material.specularTex) this.material.specularTex.destroy();
    if (this.material.roughnessTex) this.material.roughnessTex.destroy();
    if (this.material.aoTex) this.material.aoTex.destroy();
    if (this.material.emissiveTex) this.material.emissiveTex.destroy();
  }
}