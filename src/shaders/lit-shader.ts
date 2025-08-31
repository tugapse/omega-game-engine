import { EngineCache } from "../core/engineCache";
import { Camera } from "../entities/camera";
import { ShaderUniformsEnum } from "../enums/shader-uniforms.enum";
import { LitMaterial } from "../materials/lit-material";
import { Texture } from "../textures/texture";
import { Shader } from "./shader";

/**
  A shader designed for rendering objects with lighting and normal mapping, implementing the Phong lighting model.
 * @augments {Shader}
 */
export class LitShader extends Shader {

  public get className(): string { return "LitShader" }

  /**
    Creates a new instance of LitShader.
    
   * @override
   * @param {WebGL2RenderingContext} gl - The WebGL2 rendering context.
   * @param {LitMaterial} material - The lit material associated with this shader.
   * @returns {LitShader} - A new LitShader instance.
   */
  public static override instanciate(gl: WebGL2RenderingContext, material: LitMaterial): LitShader {
    return new LitShader(gl, material);
  }

  /**
    Creates an instance of LitShader.
   * @param {WebGL2RenderingContext} gl - The WebGL2 rendering context.
   * @param {LitMaterial} material - The lit material.
   */
  constructor(override gl: WebGL2RenderingContext, override material: LitMaterial) {
    super(
      gl,
      material,
      "assets/shaders/frag/phong.frag",
      "assets/shaders/vertex/vertex.vert"
    );
  }

  /**
    Loads the lit material's properties into the shader's uniforms.
   * This includes color, textures, and lighting-related properties.
   * @override
   * @returns {void}
   */
  public override loadDataIntoShader(): void {
    if (!this.material) return;

    this.checkAndLoadTextures();
    this.setVec4(ShaderUniformsEnum.U_MAT_COLOR, this.material.color.toVec4());
    this.setVec2(ShaderUniformsEnum.U_UV_SCALE, this.material.uvScale);
    this.setVec2(ShaderUniformsEnum.U_UV_OFFSET, this.material.uvOffset);

    this.setFloat(ShaderUniformsEnum.U_SPECULAR_STRENGTH, this.material.specularStrength);
    this.setFloat(ShaderUniformsEnum.U_ROUGHNESS, Math.max(this.material.roughness, 0.01));
    this.setFloat(ShaderUniformsEnum.U_NORMAL_MAP_STRENGTH, this.material.normalMapStrength);

    this.setVec3(ShaderUniformsEnum.U_CAMERA_POSITION, Camera.mainCamera.transform.position);

    if (this.material.mainTex && this.material.mainTex.isImageLoaded) {
      this.setTexture(ShaderUniformsEnum.U_MAIN_TEX, this.material.mainTex, 0);
    }
    super.loadDataIntoShader();
  }

  /**
    Checks if textures are loaded and retrieves them from the cache. If not found or if the URL is not provided, it uses a default white texture.
   * @private
   * @returns {void}
   */
  private checkAndLoadTextures(): void {
    if (!this.material.mainTex && this.material.mainTexUrl) {
      this.material.mainTex = EngineCache.getTexture2D(this.material.mainTexUrl, this.gl);
    } else if (!this.material.mainTex && !this.material.mainTexUrl) {
      this.material.mainTex = Texture.getDefaultWhiteTexture(this.gl);
    }

    if (!this.material.normalTex && this.material.normalTexUrl) {
      this.material.normalTex = EngineCache.getTexture2D(this.material.normalTexUrl, this.gl);
    } else if (!this.material.normalTex && !this.material.normalTexUrl) {
      this.material.normalTex = Texture.getDefaultWhiteTexture(this.gl);
    }
  }
}