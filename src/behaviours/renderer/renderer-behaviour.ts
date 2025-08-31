import { mat3, mat4 } from "gl-matrix";
import { CanvasViewport } from "../../core/canvas-viewport";
import { Mesh } from "../../core/mesh";
import { Camera } from "../../entities/camera";
import { SceneManager } from "../../entities/scene-manager";
import { GLPrimitiveType } from "../../enums/gl-primitive-type.enum";
import { ShaderUniformsEnum } from "../../enums/shader-uniforms.enum";
import { JsonSerializedData } from "../../interfaces/json-serialized-data.interface";
import { IRendererBehaviour } from "../../interfaces/renderer-behaviour.interface";
import { Shader } from "../../shaders/shader";
import { EntityBehaviour } from "../entity-behaviour";
import { ObjectInstanciator } from "../../core/object-instanciator";

/**
  The base class for all renderer behaviours, responsible for drawing meshes to the canvas.
 * @augments {EntityBehaviour}
 */
export class RendererBehaviour extends EntityBehaviour implements IRendererBehaviour {

  public override get className(): string { return "RendererBehaviour" }

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
  protected _worldMatrixUniformLocation: WebGLUniformLocation | null = null;
  /**
    The uniform location for the world inverse transpose matrix.
   * @protected
   * @type {WebGLUniformLocation | null}
   */
  protected _worldInverseTransposeMatrixUniformLocation: WebGLUniformLocation | null = null;

  /**
    Creates an instance of RendererBehaviour.
   * @param {WebGL2RenderingContext} _gl - The WebGL2 rendering context.
   */
  constructor(public _gl: WebGL2RenderingContext) {
    super();
    this.mesh = new Mesh();
  }

  /**
    Initializes the renderer, including its WebGL settings and shader.
   * @override
   * @returns {boolean} - True if initialization is successful, otherwise false.
   */
  override initialize(): boolean {
    if (this._initialized || !this._gl) return false;
    this.setGlSettings();
    this.initializeShader();
    return super.initialize();
  }

  /**
    Sets the default WebGL state for rendering.
   * @protected
   */
  protected setGlSettings(): void {
    if (!this._gl) return;
    this._gl.enable(this._gl.DEPTH_TEST);
    this._gl.depthFunc(this._gl.LESS);
    this._gl.enable(this._gl.BLEND);
    this._gl.blendFunc(this._gl.SRC_ALPHA, this._gl.ONE_MINUS_SRC_ALPHA);
    this._gl.enable(this._gl.CULL_FACE);
    this._gl.cullFace(this._gl.BACK);
    this._gl.frontFace(this._gl.CCW);
  }

  /**
    Initializes the shader and creates the necessary WebGL buffers.
   * @protected
   */
  protected initializeShader(): void {
    if (!this.shader) return;
    this.shader.initialize();
    this.shader.buffers.position = this._gl.createBuffer();
    this.shader.buffers.uv = this._gl.createBuffer();
    this.shader.buffers.indices = this._gl.createBuffer();
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
    if (this._worldMatrixUniformLocation) {
      this._gl.uniformMatrix4fv(this._worldMatrixUniformLocation, false, new Float32Array(this.parent.transform.modelMatrix));
    }
    if (this._worldInverseTransposeMatrixUniformLocation) {
      const worldInverseTransposeMatrix = mat4.create();
      mat4.invert(worldInverseTransposeMatrix, this.parent.transform.modelMatrix);
      mat4.transpose(worldInverseTransposeMatrix, worldInverseTransposeMatrix);

      const normalMatrixAsMat3 = mat3.create();
      mat3.fromMat4(normalMatrixAsMat3, worldInverseTransposeMatrix);

      this._gl.uniformMatrix3fv(this._worldInverseTransposeMatrixUniformLocation, false, new Float32Array(normalMatrixAsMat3));
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
    const material = ObjectInstanciator.instanciateObjectFromJsonData(materialData.type);
    material.fromJson(materialData);
    this.shader = ObjectInstanciator.instanciateObjectFromJsonData(jsonObject["shader"]["type"], [this._gl, material]);
    this.mesh.meshData = jsonObject["meshData"];
  }

  /**
    Updates the renderer's internal state.
   * @override
   * @param {number} ellapsed - The time elapsed since the last update in milliseconds.
   */
  override update(ellapsed: number): void {
    super.update(ellapsed);
    this.time += ellapsed;
  }

  /**
     Sets this object gl instance .
    * @override
    * @param {WebGL2RenderingContext} gl 
    */
  public setGl(gl: WebGL2RenderingContext) {
    this._gl = gl;
  }
}