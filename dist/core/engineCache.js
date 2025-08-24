import { ObjParser } from "../parsers/obj-parser";
import { Texture } from "../textures/texture";
export class EngineCache {
    static getTexture2D(uri, gl) {
        let result = EngineCache.__cache.textures[uri];
        if (!result) {
            result = new Texture(gl, uri);
            result.load();
            EngineCache.__cache.textures[uri] = result;
        }
        return result;
    }
    static async getMeshDataFromObj(uri) {
        let result = EngineCache.__cache.meshs[uri];
        if (!result) {
            const obj = await fetch(uri);
            const text = await obj.text();
            result = EngineCache.objPArser.parse(text);
            EngineCache.__cache.meshs[uri] = result;
        }
        return result;
    }
    static async loadShaderSource(uri) {
        let result = EngineCache.__cache.shaderCode[uri];
        if (!result) {
            const response = await fetch(uri);
            if (!response.ok) {
                throw new Error(`Failed to load shader: ${uri}`);
            }
            result = await response.text();
        }
        return result;
    }
}
EngineCache.__cache = {
    shaderCode: {},
    textures: {},
    meshs: {}
};
EngineCache.objPArser = new ObjParser;
