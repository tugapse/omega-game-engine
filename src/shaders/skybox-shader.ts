import { ShaderUniformsEnum } from "../enums/shader-uniforms.enum";
import { JsonSerializedData } from "../interfaces/json-serialized-data";
import { CubemapMaterial } from "../materials/cubemap-material";
import { CubeMapTexture } from "../textures/cubemap-texture";
import { Shader } from "./shader";

/**
  A shader designed specifically for rendering skyboxes using a cubemap texture.
 * @augments {Shader}
 */
export class SkyboxShader extends Shader {
  /**
    Creates a new instance of SkyboxShader.
    
   * @override
   * @param {WebGL2RenderingContext} gl - The WebGL2 rendering context.
   * @param {CubemapMaterial} material - The cubemap material associated with this shader.
   * @returns {SkyboxShader} - A new SkyboxShader instance.
   */
  public static override instanciate(gl: WebGL2RenderingContext, material: CubemapMaterial): SkyboxShader {
    return new SkyboxShader(gl, material);
  }

  /**
    The cubemap material associated with this shader.
   * @type {CubemapMaterial}
   */
  public declare material: CubemapMaterial;

  /**
    Initializes the shader by setting the correct file paths for the vertex and fragment shaders before calling the parent initialize method.
   * @override
   * @returns {Promise<void>}
   */
  public override initialize(): Promise<void> {
    this.fragUri = "assets/shaders/frag/skybox.frag";
    this.vertexUri = "assets/shaders/vertex/skybox.vert";
    return super.initialize();
  }

  /**
    Loads the cubemap material's properties into the shader's uniforms.
   * This includes the base color and the cubemap texture.
   * @override
   * @returns {void}
   */
  public override loadDataIntoShader(): void {
    if (!this.material) return;

    const { rightSideUri, leftSideUri, topSideUri, bottomSideUri, backSideUri, frontSideUri } = this.material;
    if (!this.material.mainTex) {
      this.material.mainTex = new CubeMapTexture(this.gl, [
        rightSideUri, leftSideUri,
        topSideUri, bottomSideUri,
        frontSideUri, backSideUri
      ]);
      this.material.mainTex.load();
    } else if (!this.material.mainTex.isImageLoaded) {
      this.material.mainTex.load();
    }

    this.setVec4(ShaderUniformsEnum.U_MAT_COLOR, this.material.color.toVec4());

    if (this.material.mainTex && this.material.mainTex.isImageLoaded) {
      this.setTexture(ShaderUniformsEnum.U_MAIN_TEX, this.material.mainTex as CubeMapTexture, 0);
    }
    super.loadDataIntoShader();
  }

  /**
    Binds a cubemap texture to a uniform in the shader.
   * @override
   * @param {string} name - The name of the uniform.
   * @param {CubeMapTexture} texture - The cubemap texture object.
   * @param {number} textureIndex - The texture unit index to bind to.
   * @returns {void}
   */
  public override setTexture(name: string, texture: CubeMapTexture, textureIndex: number): void {
    const location = this.gl.getUniformLocation(this.shaderProgram, name);
    if (location) {
      this.gl.activeTexture(this.gl.TEXTURE0 + textureIndex);
      texture.bind();
      this.gl.uniform1i(location, textureIndex);
    }
  }

  /**
    Deserializes the shader's state from a JSON object.
   * @override
   * @param {JsonSerializedData} jsonObject - The JSON object to deserialize from.
   * @returns {void}
   */
  public override fromJson(jsonObject: JsonSerializedData): void {
    super.fromJson(jsonObject);
    this.material = jsonObject['material'] as CubemapMaterial;
  }
}