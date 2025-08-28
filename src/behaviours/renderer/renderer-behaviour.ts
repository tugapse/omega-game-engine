
import { mat4 } from "gl-matrix";
import { CanvasViewport } from "../../core/canvas-viewport";
import { Mesh } from "../../core/mesh";
import { Camera } from "../../entities/camera";
import { SceneManager } from "../../entities/scene-manager";
import { ShaderUniformsEnum } from "../../enums/shader-uniforms.enum";
import { JsonSerializedData } from "../../interfaces/json-serialized-data";
import { Shader } from "../../shaders/shader";
import { EntityBehaviour } from "../entity-behaviour";
import { mat3 } from "gl-matrix";
import { GLPrimitiveType } from "../../enums/gl-primitive-type.enum";

export class RendererBehaviour extends EntityBehaviour {
  public drawPrimitiveType = GLPrimitiveType.LINES;
  public mesh!: Mesh;
  public shader?: Shader;
  protected time = 0;

  protected worldMatrixUniformLocation: WebGLUniformLocation | null = null;
  protected worldInverseTransposeMatrixUniformLocation: WebGLUniformLocation | null = null;


  constructor(public gl: WebGL2RenderingContext) {
    super();
    this.mesh = new Mesh();
  }

  override initialize(): boolean {
    if (this._initialized || !this.gl) return false;
    this.setGlSettings();
    this.initializeShader();
    return super.initialize();

  }

  protected setGlSettings() {
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LESS);

    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.cullFace(this.gl.BACK);
    this.gl.frontFace(this.gl.CCW);
  }

  protected initializeShader() {
    if (!this.shader) return;
    this.shader.initialize();
    this.shader.buffers.position = this.gl.createBuffer();
    this.shader.buffers.uv = this.gl.createBuffer();
    this.shader.buffers.indices = this.gl.createBuffer();


  }


  protected setCameraMatrices() {
    if (this.shader) {
      const camera = Camera.mainCamera;
      const mvpMatrix = mat4.create();
      this.parent.transform.updateMatrices();
      mat4.multiply(mvpMatrix, camera.projectionMatrix, camera.viewMatrix);
      mat4.multiply(mvpMatrix, mvpMatrix, this.parent.transform.modelMatrix);
      this.shader.setMat4(ShaderUniformsEnum.U_MVP_MATRIX, mvpMatrix);
    }
  }

  protected setModelWorldMatrices() {

    if (this.worldMatrixUniformLocation) {
      this.gl.uniformMatrix4fv(this.worldMatrixUniformLocation, false, Float32Array.from(this.parent.transform.modelMatrix));
    }
    if (this.worldInverseTransposeMatrixUniformLocation) {
      const worldInverseTransposeMatrix = mat4.create(); // Start with a mat4
      mat4.invert(worldInverseTransposeMatrix, this.parent.transform.modelMatrix);
      mat4.transpose(worldInverseTransposeMatrix, worldInverseTransposeMatrix);

      // Extract the 3x3 part for the mat3 uniform
      const normalMatrixAsMat3 = mat3.create();
      mat3.fromMat4(normalMatrixAsMat3, worldInverseTransposeMatrix);

      this.gl.uniformMatrix3fv(this.worldInverseTransposeMatrixUniformLocation, false, Float32Array.from(normalMatrixAsMat3));
    }
  }

  protected setShaderVariables() {
    this.setGlSettings();
    this.setCameraMatrices();
    this.setModelWorldMatrices();
    if (this.shader) {
      this.shader.setFloat(ShaderUniformsEnum.U_TIME, this.time);
      this.shader.setVec2(ShaderUniformsEnum.U_SCREEN_RESOLUTION, [CanvasViewport.rendererWidth, CanvasViewport.rendererHeight]);
      this.shader.loadDataIntoShader();
    }
  }

  override toJsonObject(): JsonSerializedData {
    return {
      ...super.toJsonObject(),
      shader: this.shader?.toJsonObject(),
      mesh: this.mesh.toJsonObject()
    }
  }

  public override fromJson(jsonObject: JsonSerializedData): void {
    const materialData = jsonObject['shader']['material'];
    const material = SceneManager.instanciateObjectFromJsonData(materialData.type);
    material.fromJson(materialData);
    this.shader = SceneManager.instanciateObjectFromJsonData(jsonObject['shader']['type'], [this.gl, material]);
    this.mesh.meshData = jsonObject['meshData'];
  }

  override update(ellapsed: number): void {
    this.time += ellapsed;
    super.update(ellapsed);
  }
}
