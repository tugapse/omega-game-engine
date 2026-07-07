import { ShaderUniformsEnum } from "../enums/shader-uniforms.enum";
import { UnlitMaterial } from "../materials/unlit-material";
import { Shader } from "./shader";
import { ShaderSources } from "./shader-sources";

/**
 * A simple shader for rendering objects without lighting calculations.
 * It handles uniforms for a base color, a main texture, and UV transformations (scale/offset).
 * @augments {Shader}
 */
export class UnlitShader extends Shader {

  protected override _className = "UnlitShader"

  /**
   * Creates a new instance of UnlitShader.
   *
   * @override
   * @param gl - The WebGL2 rendering context.
   * @param material - The unlit material associated with this shader.
   * @returns A new `UnlitShader` instance.
   */
  public static override instanciate(gl: WebGL2RenderingContext, material: UnlitMaterial): UnlitShader {
    return new UnlitShader(gl, material);
  }

  /**
   * Creates an instance of UnlitShader.
   * @param gl - The WebGL2 rendering context.
   * @param material - The unlit material.
   */
  constructor(override gl: WebGL2RenderingContext, override material: UnlitMaterial) {
    super(gl, material, ShaderSources.frag.default_unlit, ShaderSources.vertex.default);
  }

  /**
   * Loads the unlit material's properties into the shader's uniforms.
   * This includes the base color, UV scale and offset, and the main texture.
   * @override
   */
  public override async loadDataIntoShader(): Promise<void> {
    if (!this.material) return;
    super.loadDataIntoShader();

    await this.checkAndLoadTextures();
    this.setVec4(ShaderUniformsEnum.U_MAT_COLOR, this.material.color.toVec4());
    this.setVec2(ShaderUniformsEnum.U_UV_SCALE, this.material.uvScale.vector);
    this.setVec2(ShaderUniformsEnum.U_UV_OFFSET, this.material.uvOffset.vector);

    if (this.material.mainTex && this.material.mainTex.isImageLoaded) {
      this.setTexture(ShaderUniformsEnum.U_MAIN_TEX, this.material.mainTex, 0);
      this.material.mainTex.bind(); // Ensure texture is bound after loading
    }
  }

  /**
   * Checks if the main texture is loaded and, if not, loads it.
   * It ensures that a texture is bound before rendering.
   * @private
   */
  protected async checkAndLoadTextures(): Promise<void> {
    if (this.material.mainTex) {
      if (!this.material.mainTex.isImageLoaded) {
        this.material.mainTex.setGL(this.gl);
        await this.material.mainTex.load();
      } else {
        this.setTexture(ShaderUniformsEnum.U_MAIN_TEX, this.material.mainTex, 0);
        this.material.mainTex.bind();
      }
    }
  }

  /**
   * Unbinds the main texture after rendering to free up the texture unit.
   * @override
   */
  override release(): void {
    if(this.material?.mainTex)
      this.material.mainTex.unBind();
  }


}
