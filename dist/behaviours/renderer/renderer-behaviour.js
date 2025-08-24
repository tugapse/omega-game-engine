import { mat4 } from "gl-matrix";
import { CanvasViewport } from "../../core/canvas-viewport";
import { Mesh } from "../../core/mesh";
import { Camera } from "../../entities/camera";
import { SceneManager } from "../../entities/scene-manager";
import { ShaderUniformsEnum } from "../../enums/shader-uniforms.enum";
import { EntityBehaviour } from "../entity-behaviour";
import { mat3 } from "gl-matrix";
export class RendererBehaviour extends EntityBehaviour {
    constructor(gl) {
        super();
        this.gl = gl;
        this.time = 0;
        this.worldMatrixUniformLocation = null;
        this.worldInverseTransposeMatrixUniformLocation = null;
        this.mesh = new Mesh();
    }
    initialize() {
        if (this._initialized)
            return false;
        this.setGlSettings();
        this.initializeShader();
        return super.initialize();
    }
    setGlSettings() {
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LESS);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.cullFace(this.gl.BACK);
        this.gl.frontFace(this.gl.CCW);
    }
    initializeShader() {
        this.shader.initialize();
        this.shader.buffers.position = this.gl.createBuffer();
        this.shader.buffers.uv = this.gl.createBuffer();
        this.shader.buffers.indices = this.gl.createBuffer();
    }
    setCameraMatrices() {
        const camera = Camera.mainCamera;
        const mvpMatrix = mat4.create();
        this.parent.transform.updateMatrices();
        mat4.multiply(mvpMatrix, camera.projectionMatrix, camera.viewMatrix);
        mat4.multiply(mvpMatrix, mvpMatrix, this.parent.transform.modelMatrix);
        this.shader.setMat4(ShaderUniformsEnum.U_MVP_MATRIX, mvpMatrix);
    }
    setModelWorldMatrices() {
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
    setShaderVariables() {
        this.setGlSettings();
        this.setCameraMatrices();
        this.setModelWorldMatrices();
        this.shader.setFloat(ShaderUniformsEnum.U_TIME, this.time);
        this.shader.setVec2(ShaderUniformsEnum.U_SCREEN_RESOLUTION, [CanvasViewport.rendererWidth, CanvasViewport.rendererHeight]);
        this.shader.loadDataIntoShader();
    }
    toJsonObject() {
        return {
            ...super.toJsonObject(),
            shader: this.shader.toJsonObject(),
            mesh: this.mesh.toJsonObject()
        };
    }
    fromJson(jsonObject) {
        const materialData = jsonObject['shader']['material'];
        const material = SceneManager.instanciateObjectFromJsonData(materialData.type);
        material.fromJson(materialData);
        this.shader = SceneManager.instanciateObjectFromJsonData(jsonObject['shader']['type'], [this.gl, material]);
        this.mesh.meshData = jsonObject['meshData'];
    }
    update(ellapsed) {
        this.time += ellapsed;
        super.update(ellapsed);
    }
}
