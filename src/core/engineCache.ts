import { ObjParser } from "../parsers/obj-parser";
import { Texture } from "../textures/texture";
import { MeshData } from "./mesh";

/**
  The structure for storing cached assets.
 * @interface StorageSpaces
 */
interface StorageSpaces {
  /**
    A map for caching shader source code strings.
   * @type {{ [key: string]: string }}
   */
  shaderCode: { [key: string]: string };
  /**
    A map for caching textures.
   * @type {{ [key: string]: Texture }}
   */
  textures: { [key: string]: Texture };
  /**
    A map for caching parsed mesh data.
   * @type {{ [key: string]: MeshData }}
   */
  meshs: { [key: string]: MeshData };
}

/**
  A static class that manages the caching of various engine assets such as textures, meshes, and shader code.
 * @abstract
 */
export abstract class EngineCache {
  /**
    The private cache instance.
   * @private
    
   * @type {StorageSpaces}
   */
  private static __cache: StorageSpaces = {
    shaderCode: {},
    textures: {},
    meshs: {},
  };
  /**
    An instance of the OBJ parser used for loading mesh data.
   * @private
    
   * @type {ObjParser}
   */
  private static objPArser: ObjParser = new ObjParser();

  /**
    Retrieves a 2D texture from the cache or loads and caches it if not present.
    
   * @param {string} uri - The URI of the texture.
   * @param {WebGL2RenderingContext} gl - The WebGL2 rendering context.
   * @returns {Texture} - The cached or newly loaded Texture instance.
   */
  public static getTexture2D(uri: string, gl: WebGL2RenderingContext): Texture {
    let result = EngineCache.__cache.textures[uri];
    if (!result) {
      result = new Texture(gl, uri);
      result.load();
      EngineCache.__cache.textures[uri] = result;
    }
    return result;
  }

  /**
    Retrieves mesh data parsed from an OBJ file from the cache or loads, parses, and caches it if not present.
    
    
   * @param {string} uri - The URI of the OBJ file.
   * @returns {Promise<MeshData>} - A promise that resolves with the mesh data.
   */
  public static async getMeshDataFromObj(uri: string): Promise<MeshData> {
    let result = EngineCache.__cache.meshs[uri];
    if (!result) {
      const obj = await fetch(uri);
      const text = await obj.text();
      result = EngineCache.objPArser.parse(text) as MeshData;
      EngineCache.__cache.meshs[uri] = result;
    }
    return result;
  }

  /**
    Retrieves shader source code from the cache or loads and caches it if not present.
    
    
   * @param {string} uri - The URI of the shader source file.
   * @returns {Promise<string>} - A promise that resolves with the shader source code as a string.
   */
  public static async loadShaderSource(uri: string): Promise<string> {
    let result = EngineCache.__cache.shaderCode[uri];
    if (!result) {
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error(`Failed to load shader: ${uri}`);
      }
      result = await response.text();
      EngineCache.__cache.shaderCode[uri] = result;
    }
    return result;
  }
}