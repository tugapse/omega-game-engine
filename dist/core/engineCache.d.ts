import { Texture } from "../textures/texture";
import { MeshData } from "./mesh";
export declare abstract class EngineCache {
    private static __cache;
    private static objPArser;
    static getTexture2D(uri: string, gl: WebGL2RenderingContext | WebGL2RenderingContext): Texture;
    static getMeshDataFromObj(uri: string): Promise<MeshData>;
    static loadShaderSource(uri: string): Promise<string>;
}
