import { mat4, mat3, vec4, vec3, vec2 } from "gl-matrix";
import { MeshData } from "../core/mesh";
import { JsonSerializable } from "../interfaces/json-serializable";
import { JsonSerializedData } from "../interfaces/json-serialized-data";
import { ColorMaterial } from "../materials/color-material";
import { Texture } from "../textures/texture";
export interface WebGLBuffers {
    position: WebGLBuffer | null;
    normal: WebGLBuffer | null;
    uv: WebGLBuffer | null;
    tangent: WebGLBuffer | null;
    bitangent: WebGLBuffer | null;
    indices: WebGLBuffer | null;
}
export declare class Shader extends JsonSerializable {
    protected gl: WebGL2RenderingContext;
    material: ColorMaterial;
    fragUri: string;
    vertexUri: string;
    static SHADER_FUNCTIONS: {
        [key: string]: string;
    };
    static preFetchFunctionsGlsl(): void;
    static instanciate(gl: WebGL2RenderingContext, material: ColorMaterial): Shader;
    get uuid(): string;
    shaderProgram: WebGLProgram;
    private initialized;
    protected _uuid: string;
    buffers: WebGLBuffers;
    constructor(gl: WebGL2RenderingContext, material: ColorMaterial, fragUri?: string, vertexUri?: string);
    initialize(): Promise<void>;
    private addShaderImports;
    initBuffers(gl: WebGL2RenderingContext, mesh: MeshData): void;
    bindBuffers(): void;
    use(): void;
    loadDataIntoShader(): void;
    setMat4(name: string, value: mat4): void;
    setMat3(name: string, value: mat3): void;
    setVec4(name: string, vec: vec4): void;
    setVec3(name: string, vec: vec3): void;
    setVec2(name: string, vec: vec2): void;
    setFloat(name: string, num: number): void;
    setTexture(name: string, texture: Texture, textureIndex: number): void;
    setBuffer(buffer: WebGLBuffer, values: vec3[]): void;
    setIndices(values: number[]): void;
    private compileShader;
    private createProgram;
    recompile(): void;
    destroy(): void;
    toJsonObject(): JsonSerializedData;
    fromJson(jsonObject: JsonSerializedData): void;
}
