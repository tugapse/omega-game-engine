import { mat4 } from "gl-matrix";
import { Camera } from "../../entities/camera";
import { ShaderUniformsEnum } from "../../enums/shader-uniforms.enum";
import { JsonSerializedData } from "../../interfaces/json-serialized-data.interface";
import { RenderMeshBehaviour } from "./render-mesh-behaviour";

/**
  A specialized renderer for drawing a skybox.
 * @augments {RenderMeshBehaviour}
 */
export class SkyboxRenderer extends RenderMeshBehaviour {
  /**
    Creates a new instance of the SkyboxRenderer.
   * @param {WebGL2RenderingContext} gl - The WebGL2 rendering context.
   * @override
    
   * @returns {SkyboxRenderer}
   */
  static override instanciate(gl: WebGL2RenderingContext): SkyboxRenderer {
    return new SkyboxRenderer(gl);
  }

  constructor(gl:WebGL2RenderingContext){
    super(gl);
    this._className = "SkyboxRenderer";
  }
  /**
    Initializes the skybox renderer.
   * @override
   * @returns {boolean} - True if initialization is successful, otherwise false.
   */
  override initialize(): boolean {
    if (super.initialize()) {
      this.transform.setPosition(0, 0, 0);
      this.transform.setScale(1000, 1000, 1000);
      return true;
    }
    return false;
  }

  /**
    Sets the specific WebGL settings for rendering the skybox.
   * @protected
   * @override
   */
  protected override setGlSettings(): void {
    this._gl.cullFace(this._gl.FRONT);
    this._gl.depthFunc(this._gl.LEQUAL);
  }

  /**
    Draws the skybox mesh.
   * @override
   */
  override draw(): void {
    if (!this.shader?._shaderProgram || !this.mesh) {
      return;
    }

    this.shader.bindBuffers();
    this.shader.use();
    this.setShaderVariables();
    this._gl.drawElements(
      this._gl.TRIANGLES,
      this.mesh.meshData.indices.length,
      this._gl.UNSIGNED_SHORT,
      0,
    );
  }

  /**
    Sets the camera matrices for the skybox, ensuring the skybox remains centered on the camera.
   * @override
   */
  override setCameraMatrices(): void {
    if (!this.shader?._shaderProgram) {
      return;
    }

    const camera = Camera.mainCamera;

    // Create a view matrix without translation to keep the skybox centered
    const viewMatrixNoTranslation = mat4.clone(camera.viewMatrix);
    viewMatrixNoTranslation[12] = 0;
    viewMatrixNoTranslation[13] = 0;
    viewMatrixNoTranslation[14] = 0;

    const mvpMatrix = mat4.create();
    this.transform.updateMatrices();
    mat4.multiply(mvpMatrix, camera.projectionMatrix, viewMatrixNoTranslation);
    mat4.multiply(mvpMatrix, mvpMatrix, this.parent.transform.modelMatrix);
    this.shader.setMat4(ShaderUniformsEnum.U_MVP_MATRIX, mvpMatrix);
  }

  /**
    Sets all shader variables required for rendering the skybox.
   * @override
   */
  override setShaderVariables(): void {
    if (!this.shader?._shaderProgram) {

      return;
    }

    this.setGlSettings();
    this.setCameraMatrices();
    this.shader.loadDataIntoShader();
  }

  /**
    Populates the renderer's properties from a JSON object.
   * @param {JsonSerializedData} jsonObject - The JSON object containing the data.
   * @override
   */
  override fromJson(jsonObject: JsonSerializedData): void {
    super.fromJson(jsonObject);
  }
}