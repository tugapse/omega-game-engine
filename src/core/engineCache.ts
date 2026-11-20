import { ICubemapSides } from '../interfaces/cubemap';
import { CubemapTexture } from '../textures';
import { Texture } from '../textures/texture';
import { MeshData } from './mesh';
import { ResourceManager, ResourceManagerStats } from './resources/resource-manager';
import {
  DefaultResourceLoader,
  ResourceLoader,
  UriResolver,
} from './resources/resource-loader';

export type { UriResolver } from './resources/resource-loader';

/**
 * Static entry point to the engine's resources, kept for compatibility.
 *
 * Each WebGL context has its own {@link ResourceManager}; this class finds
 * the right one and loads through it. New code should take a manager from
 * {@link EngineCache.managerFor} and hold handles (`acquire`/`release`).
 *
 * The static helpers hold no references: what they load stays cached until
 * the manager is trimmed or the cache is cleared.
 */
export abstract class EngineCache {
  private static managers = new Map<WebGL2RenderingContext | null, ResourceManager>();
  /** The context most recently used, for callers that pass no `gl`. */
  private static currentGl: WebGL2RenderingContext | null = null;

  private static uriResolver: UriResolver | null = null;
  private static customLoader: ResourceLoader | null = null;

  /** The engine's own loader: fetch and <img>, through the URI resolver. */
  static readonly defaultLoader: ResourceLoader = new DefaultResourceLoader((uri) =>
    EngineCache.resolveUri(uri),
  );

  /**
   * Registers (or clears, with `null`) the resolver applied to every URI
   * before the default loader fetches it, e.g. to serve `asset://<id>`.
   */
  public static setUriResolver(resolver: UriResolver | null): void {
    EngineCache.uriResolver = resolver;
  }

  /** The URL to load for a URI: the resolver's result, or the URI itself. */
  public static async resolveUri(uri: string): Promise<string> {
    return EngineCache.uriResolver ? await EngineCache.uriResolver(uri) : uri;
  }

  /**
   * Replaces how every manager loads files (or restores the default loader,
   * with `null`), e.g. to fetch with an Authorization header.
   */
  public static setLoader(loader: ResourceLoader | null): void {
    EngineCache.customLoader = loader;
    for (const manager of EngineCache.managers.values()) {
      manager.setLoader(EngineCache.loader);
    }
  }

  private static get loader(): ResourceLoader {
    return EngineCache.customLoader ?? EngineCache.defaultLoader;
  }

  /**
   * The resource manager of a WebGL context, created on first use. Without
   * `gl`, the context used most recently (textures need one; shaders and
   * meshes do not).
   */
  public static managerFor(gl?: WebGL2RenderingContext | null): ResourceManager {
    const key = gl ?? EngineCache.currentGl;
    if (gl) EngineCache.currentGl = gl;
    let manager = EngineCache.managers.get(key);
    if (!manager) {
      manager = new ResourceManager(key, EngineCache.loader);
      EngineCache.managers.set(key, manager);
    }
    return manager;
  }

  /** Loads (or reuses) a 2D texture. */
  public static async getTexture2D(uri: string, gl?: WebGL2RenderingContext): Promise<Texture> {
    const handle = await EngineCache.managerFor(gl).textures.acquire(uri);
    handle.release();
    return handle.value;
  }

  /** Loads (or reuses) a cubemap, keyed by its six faces. */
  public static async getTextureCube(
    uris: ICubemapSides,
    gl?: WebGL2RenderingContext,
  ): Promise<CubemapTexture> {
    const key = ResourceManager.cubemapKey(uris);
    const handle = await EngineCache.managerFor(gl).cubemaps.acquire(key);
    handle.release();
    return handle.value;
  }

  public static async getWhiteTextureCube(gl?: WebGL2RenderingContext): Promise<CubemapTexture> {
    const white = 'assets/images/default/white.jpg';
    return EngineCache.getTextureCube(
      { right: white, left: white, up: white, bottom: white, front: white, back: white },
      gl,
    );
  }

  public static async getWhiteTexture(gl: WebGL2RenderingContext): Promise<Texture> {
    return EngineCache.getTexture2D('assets/images/default/white.jpg', gl);
  }

  public static async getBlackTexture(gl: WebGL2RenderingContext): Promise<Texture> {
    return EngineCache.getTexture2D('assets/images/default/black.jpg', gl);
  }

  public static async getNormalTexture(gl: WebGL2RenderingContext): Promise<Texture> {
    return EngineCache.getTexture2D('assets/images/default/normal.jpg', gl);
  }

  /** The owner of a texture is done with it: remove it from the cache and free it. */
  public static releaseTexture(texture: Texture): void {
    EngineCache.forgetTexture(texture);
    texture.destroy();
  }

  /** Removes a texture from its manager's cache without freeing it. */
  public static forgetTexture(texture: Texture): void {
    const uri = texture.textureUri;
    if (!uri) return;
    for (const manager of EngineCache.managers.values()) {
      if (manager.textures.remove(uri, texture)) return;
    }
  }

  /** Loads (or reuses) mesh data parsed from an OBJ file. */
  public static async getMeshDataFromObj(uri: string): Promise<MeshData> {
    const handle = await EngineCache.managerFor().meshes.acquire(uri);
    handle.release();
    return handle.value;
  }

  /** Loads (or reuses) a shader's source code. */
  public static async loadShaderSource(uri: string): Promise<string> {
    const handle = await EngineCache.managerFor().shaders.acquire(uri);
    handle.release();
    return handle.value;
  }

  /** What every manager holds, by WebGL context (the `null` key = no context). */
  public static stats(): ResourceManagerStats[] {
    return [...EngineCache.managers.values()].map((m) => m.stats());
  }

  /**
   * Forgets every cached resource, without freeing GPU memory (as before).
   * Freeing on clear comes with the scene lifecycle change (plan phase 5).
   */
  public static clear(): void {
    EngineCache.managers.clear();
    EngineCache.currentGl = null;
  }
}
