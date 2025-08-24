import { Mesh } from "../../core/mesh";
import { JsonSerializedData } from "../../interfaces/json-serialized-data";
import { Shader } from "../../shaders/shader";
import { EntityBehaviour } from "../entity-behaviour";
export declare class RendererBehaviour extends EntityBehaviour {
    gl: WebGL2RenderingContext;
    mesh: Mesh;
    shader: Shader;
    protected time: number;
    protected worldMatrixUniformLocation: WebGLUniformLocation | null;
    protected worldInverseTransposeMatrixUniformLocation: WebGLUniformLocation | null;
    constructor(gl: WebGL2RenderingContext);
    initialize(): boolean;
    protected setGlSettings(): void;
    protected initializeShader(): void;
    protected setCameraMatrices(): void;
    protected setModelWorldMatrices(): void;
    protected setShaderVariables(): void;
    toJsonObject(): JsonSerializedData;
    fromJson(jsonObject: JsonSerializedData): void;
    update(ellapsed: number): void;
}
