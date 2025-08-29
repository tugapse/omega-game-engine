import { mat3, mat4 } from "gl-matrix";
import { CanvasViewport } from "../../core/canvas-viewport";
import { Mesh } from "../../core/mesh";
import { Camera } from "../../entities/camera";
import { SceneManager } from "../../entities/scene-manager";
import { ShaderUniformsEnum } from "../../enums/shader-uniforms.enum";
import { JsonSerializedData } from "../../interfaces/json-serialized-data";
import { Shader } from "../../shaders/shader";
import { EntityBehaviour } from "../entity-behaviour";
import { GLPrimitiveType } from "../../enums/gl-primitive-type.enum";

/**
  The base class for all renderer behaviours, responsible for drawing meshes to the canvas.
 * @augments {EntityBehaviour}
 */
export class RendererBehaviour extends EntityBehaviour {
  /**
    The WebGL primitive type used for drawing the mesh.
   * @type {GLPrimitiveType}
   */
  public drawPrimitiveType: GLPrimitiveType = GLPrimitiveType.LINES;
  /**
    The mesh data to be rendered.
   * @type {Mesh}
   */
  public mesh!: Mesh;
  /**
    The shader program used for rendering.
   * @type {Shader | undefined}
   */
  public shader?: Shader;
  /**
    The elapsed time since the renderer was initialized.
   * @protected
   * @type {number}
   */
  protected time = 0;

  /**
    The uniform location for the world matrix.
   * @protected
   * @type {WebGLUniformLocation | null}
   */
  protected worldMatrixUniformLocation: WebGLUniformLocation | null = null;
  /**
    The uniform location for the world inverse transpose matrix.
   * @protected
   * @type {WebGLUniformLocation | null}
   */
  protected worldInverseTransposeMatrixUniformLocation: WebGLUniformLocation | null = null;

  /**
    Creates an instance of RendererBehaviour.
   * @param {WebGL2RenderingContext} gl - The WebGL2 rendering context.
   */
  constructor(public gl: WebGL2RenderingContext) {
    super();
    this.mesh = new Mesh();
  }

  /**
    Initializes the renderer, including its WebGL settings and shader.
   * @override
   * @returns {boolean} - True if initialization is successful, otherwise false.
   */
  override initialize(): boolean {
    if (this._initialized || !this.gl) return false;
    this.setGlSettings();
    this.initializeShader();
    return super.initialize();
  }

  /**
    Sets the default WebGL state for rendering.
   * @protected
   */
  protected setGlSettings(): void {
    if(!this.gl) return;
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LESS);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.cullFace(this.gl.BACK);
    this.gl.frontFace(this.gl.CCW);
  }

  /**
    Initializes the shader and creates the necessary WebGL buffers.
   * @protected
   */
  protected initializeShader(): void {
    if (!this.shader) return;
    this.shader.initialize();
    this.shader.buffers.position = this.gl.createBuffer();
    this.shader.buffers.uv = this.gl.createBuffer();
    this.shader.buffers.indices = this.gl.createBuffer();
  }

  /**
    Sets the camera matrices (projection, view, and model-view-projection) in the shader.
   * @protected
   */
  protected setCameraMatrices(): void {
    if (this.shader) {
      const camera = Camera.mainCamera;
      const mvpMatrix = mat4.create();
      this.parent.transform.updateMatrices();
      mat4.multiply(mvpMatrix, camera.projectionMatrix, camera.viewMatrix);
      mat4.multiply(mvpMatrix, mvpMatrix, this.parent.transform.modelMatrix);
      this.shader.setMat4(ShaderUniformsEnum.U_MVP_MATRIX, mvpMatrix);
    }
  }

  /**
    Sets the world and world inverse transpose matrices in the shader for lighting calculations.
   * @protected
   */
  protected setModelWorldMatrices(): void {
    if (this.worldMatrixUniformLocation) {
      this.gl.uniformMatrix4fv(this.worldMatrixUniformLocation, false, new Float32Array(this.parent.transform.modelMatrix));
    }
    if (this.worldInverseTransposeMatrixUniformLocation) {
      const worldInverseTransposeMatrix = mat4.create();
      mat4.invert(worldInverseTransposeMatrix, this.parent.transform.modelMatrix);
      mat4.transpose(worldInverseTransposeMatrix, worldInverseTransposeMatrix);

      const normalMatrixAsMat3 = mat3.create();
      mat3.fromMat4(normalMatrixAsMat3, worldInverseTransposeMatrix);

      this.gl.uniformMatrix3fv(this.worldInverseTransposeMatrixUniformLocation, false, new Float32Array(normalMatrixAsMat3));
    }
  }

  /**
    Sets all common shader uniforms, including matrices, time, and screen resolution.
   * @protected
   */
  protected setShaderVariables(): void {
    this.setGlSettings();
    this.setCameraMatrices();
    this.setModelWorldMatrices();
    if (this.shader) {
      this.shader.setFloat(ShaderUniformsEnum.U_TIME, this.time);
      this.shader.setVec2(ShaderUniformsEnum.U_SCREEN_RESOLUTION, [CanvasViewport.rendererWidth, CanvasViewport.rendererHeight]);
      this.shader.loadDataIntoShader();
    }
  }

  /**
    Serializes the renderer's state to a JSON object.
   * @override
   * @returns {JsonSerializedData} - The JSON object representation of the renderer.
   */
  override toJsonObject(): JsonSerializedData {
    return {
      ...super.toJsonObject(),
      shader: this.shader?.toJsonObject(),
      mesh: this.mesh.toJsonObject(),
    };
  }

  /**
    Deserializes the renderer's state from a JSON object.
   * @override
   * @param {JsonSerializedData} jsonObject - The JSON object to deserialize from.
   */
  public override fromJson(jsonObject: JsonSerializedData): void {
    const materialData = jsonObject["shader"]["material"];
    const material = SceneManager.instanciateObjectFromJsonData(materialData.type);
    material.fromJson(materialData);
    this.shader = SceneManager.instanciateObjectFromJsonData(jsonObject["shader"]["type"], [this.gl, material]);
    this.mesh.meshData = jsonObject["meshData"];
  }

  /**
    Updates the renderer's internal state.
   * @override
   * @param {number} ellapsed - The time elapsed since the last update in milliseconds.
   */
  override update(ellapsed: number): void {
    this.time += ellapsed;
    super.update(ellapsed);
  }
}