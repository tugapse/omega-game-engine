import { JsonSerializedData } from "../interfaces/json-serialized-data";
import { CubemapMaterial } from "../materials/cubemap-material";
import { CubeMapTexture } from "../textures/cubemap-texture";
import { Shader } from "./shader";
export declare class SkyboxShader extends Shader {
    static instanciate(gl: WebGL2RenderingContext, material: CubemapMaterial): SkyboxShader;
    material: CubemapMaterial;
    initialize(): Promise<void>;
    loadDataIntoShader(): void;
    setTexture(name: string, texture: CubeMapTexture, textureIndex: number): void;
    fromJson(jsonObject: JsonSerializedData): void;
}
