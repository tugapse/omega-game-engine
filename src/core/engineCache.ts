import { ICubemapSides } from '../interfaces/cubemap';
import { CubemapTexture } from '../textures';
import { Texture } from '../textures/texture';
import { MeshData } from './mesh';
import { BuiltinTextures } from './resources/builtin-textures';
import { ResourceManager, ResourceManagerStats } from './resources/resource-manager';
import { ResourceLoader, UriResolver } from './resources/resource-loader';
import { Resources } from './resources/resources';

export type { UriResolver } from './resources/resource-loader';

/**
 * @deprecated Since the resources rework; removed in 4.0. Use
 * {@link Resources} (`Resources.for(gl)` returns the context's
 * {@link ResourceManager}). Every method here delegates to it.
 */
export abstract class EngineCache {
  /** @deprecated Use `Resources.defaultLoader`. */
  static get defaultLoader(): ResourceLoader {
    return Resources.defaultLoader;
  }

  /** @deprecated Use `Resources.setUriResolver`. */
  public static setUriResolver(resolver: UriResolver | null): void {
    Resources.setUriResolver(resolver);
  }

  /** @deprecated Use `Resources.resolveUri`. */
  public static resolveUri(uri: string): Promise<string> {
    return Resources.resolveUri(uri);
  }

  /** @deprecated Use `Resources.setLoader`. */
  public static setLoader(loader: ResourceLoader | null): void {
    Resources.setLoader(loader);
  }

  /** @deprecated Use `Resources.for`. */
  public static managerFor(gl?: WebGL2RenderingContext | null): ResourceManager {
    return Resources.for(gl);
  }

  /** @deprecated Use `Resources.releaseContext`. */
  public static releaseContext(gl: WebGL2RenderingContext): void {
    Resources.releaseContext(gl);
  }

  /** @deprecated Use `Resources.for(gl).getTexture(uri)` or `.textures.acquire(uri)`. */
  public static getTexture2D(uri: string, gl?: WebGL2RenderingContext): Promise<Texture> {
    return Resources.for(gl).getTexture(uri);
  }

  /** @deprecated Use `Resources.for(gl).getCubemap(sides)` or `.cubemaps.acquire(key)`. */
  public static getTextureCube(uris: ICubemapSides, gl?: WebGL2RenderingContext): Promise<CubemapTexture> {
    return Resources.for(gl).getCubemap(uris);
  }

  /** @deprecated Use `Resources.for(gl).getWhiteCubemap()`. */
  public static getWhiteTextureCube(gl?: WebGL2RenderingContext): Promise<CubemapTexture> {
    return Resources.for(gl).getWhiteCubemap();
  }

  /** @deprecated Use `Resources.for(gl).getTexture(BuiltinTextures.white)`. */
  public static getWhiteTexture(gl: WebGL2RenderingContext): Promise<Texture> {
    return Resources.for(gl).getTexture(BuiltinTextures.white);
  }

  /** @deprecated Use `Resources.for(gl).getTexture(BuiltinTextures.black)`. */
  public static getBlackTexture(gl: WebGL2RenderingContext): Promise<Texture> {
    return Resources.for(gl).getTexture(BuiltinTextures.black);
  }

  /** @deprecated Use `Resources.for(gl).getTexture(BuiltinTextures.normal)`. */
  public static getNormalTexture(gl: WebGL2RenderingContext): Promise<Texture> {
    return Resources.for(gl).getTexture(BuiltinTextures.normal);
  }

  /** @deprecated Use `Resources.for(gl).getTexture(BuiltinTextures.missing)`. */
  public static getMissingTexture(gl: WebGL2RenderingContext): Promise<Texture> {
    return Resources.for(gl).getTexture(BuiltinTextures.missing);
  }

  /** @deprecated Hold a handle from `textures.acquire()` and `release()` it instead. */
  public static releaseTexture(texture: Texture): void {
    Resources.forgetTexture(texture);
    texture.destroy();
  }

  /** @deprecated Use `Resources.forgetTexture`. */
  public static forgetTexture(texture: Texture): void {
    Resources.forgetTexture(texture);
  }

  /** @deprecated Use `Resources.for().getMesh(uri)`. */
  public static getMeshDataFromObj(uri: string): Promise<MeshData> {
    return Resources.for().getMesh(uri);
  }

  /** @deprecated Use `Resources.for().getShader(uri)`. */
  public static loadShaderSource(uri: string): Promise<string> {
    return Resources.for().getShader(uri);
  }

  /** @deprecated Use `Resources.trim`. */
  public static trim(): number {
    return Resources.trim();
  }

  /** @deprecated Use `Resources.stats`. */
  public static stats(): ResourceManagerStats[] {
    return Resources.stats();
  }

  /** @deprecated Use `Resources.clear`. */
  public static clear(): void {
    Resources.clear();
  }
}
