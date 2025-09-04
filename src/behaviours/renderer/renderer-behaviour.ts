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
import { ColorMaterial as Material } from "../../materials";
import { BlendingMode } from "../../interfaces/blend-mode";
import { BlendingDestinationFactor, BlendingSourceFactor } from "../../enums/gl/blend";
import { DephFunction } from "../../enums/gl/deph-function";
import { CullFace } from "../../enums/gl/cull-face";
import { FaceWinding } from "../../enums";

/**
  The base class for all renderer behaviours, responsible for drawing meshes to the canvas.
 * @augments {EntityBehaviour}
 */
export class RendererBehaviour extends EntityBehaviour implements IRendererBehaviour {

  static override instanciate(gl: WebGL2RenderingContext) {
    return new RendererBehaviour(gl);
  }

  protected override _className = "RendererBehaviour"

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
  protected _time = 0;

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

  public enableCullFace = true;
  public enableDephTest = true;
  public enableBlend = true;
  public writeToDephBuffer = true;

  public cullFace: CullFace = CullFace.BACK;
  public blendMode: BlendingMode = {
    sourcefactor: BlendingSourceFactor.SRC_ALPHA,
    destfactor: BlendingDestinationFactor.ONE_MINUS_SRC_ALPHA
  };
  public dephMode: DephFunction = DephFunction.Less;
  public faceWinding: FaceWinding = FaceWinding.CounterClockwise;

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

    if (this.enableDephTest) {
      this._gl.enable(this._gl.DEPTH_TEST);
      this._gl.depthFunc(this.dephMode);
    }
    else this._gl.disable(this._gl.DEPTH_TEST);

    if (this.enableBlend) {
      this._gl.enable(this._gl.BLEND);
      this._gl.blendFunc(this.blendMode.sourcefactor, this.blendMode.destfactor);
    } else this._gl.disable(this._gl.BLEND);

    if (this.enableCullFace) {
      this._gl.enable(this._gl.CULL_FACE);
      this._gl.cullFace(this.cullFace);
    } else this._gl.disable(this._gl.CULL_FACE);

    this._gl.depthMask(this.writeToDephBuffer);
    this._gl.frontFace(this.faceWinding);
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
      this.shader.setFloat(ShaderUniformsEnum.U_TIME, this._time);
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
    const material = ObjectInstanciator.instanciateObjectFromJsonData<Material>(materialData.className);
    material!.fromJson(materialData);
    this.shader = ObjectInstanciator.instanciateObjectFromJsonData(jsonObject.shader.className, [this._gl, material]);
    this.shader?.fromJson(jsonObject.shader);
    this.mesh.fromJson(jsonObject.mesh);
  }

  /**
    Updates the renderer's internal state.
   * @override
   * @param {number} ellapsed - The time elapsed since the last update in milliseconds.
   */
  override update(ellapsed: number): void {
    super.update(ellapsed);
    this._time += ellapsed;
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