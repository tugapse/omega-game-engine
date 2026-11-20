import { ResourceManager, ResourceManagerStats } from './resource-manager';
import { DefaultResourceLoader, ResourceLoader, UriResolver } from './resource-loader';
import { builtinTextureUrl } from './builtin-textures';
import { Texture } from '../../textures/texture';

/**
 * Entry point to the engine's resources.
 *
 * Each WebGL context has its own {@link ResourceManager} (GL objects belong
 * to the context that made them). `Resources.for(gl)` returns it, creating
 * it on first use; without `gl`, the context used most recently.
 *
 * ```ts
 * const resources = Resources.for(gl);
 * const handle = await resources.textures.acquire('asset://42'); // held
 * handle.release();                                              // let go
 * const white = await resources.getTexture(BuiltinTextures.white); // shared, not held
 * ```
 */
export abstract class Resources {
  private static managers = new Map<WebGL2RenderingContext | null, ResourceManager>();
  private static currentGl: WebGL2RenderingContext | null = null;
  private static uriResolver: UriResolver | null = null;
  private static customLoader: ResourceLoader | null = null;

  /** The engine's own loader: fetch and <img>, through the URI resolver. */
  static readonly defaultLoader: ResourceLoader = new DefaultResourceLoader((uri) =>
    Resources.resolveUri(uri),
  );

  /** The resource manager of a WebGL context (or of the one used most recently). */
  static for(gl?: WebGL2RenderingContext | null): ResourceManager {
    const key = gl ?? Resources.currentGl;
    if (gl) Resources.currentGl = gl;
    let manager = Resources.managers.get(key);
    if (!manager) {
      manager = new ResourceManager(key, Resources.loader);
      Resources.managers.set(key, manager);
    }
    return manager;
  }

  /**
   * Replaces how every manager loads files (`null` restores the default),
   * e.g. to fetch with an Authorization header.
   */
  static setLoader(loader: ResourceLoader | null): void {
    Resources.customLoader = loader;
    for (const manager of Resources.managers.values()) manager.setLoader(Resources.loader);
  }

  /** Rewrites URIs before the default loader fetches them (`null` clears it). */
  static setUriResolver(resolver: UriResolver | null): void {
    Resources.uriResolver = resolver;
  }

  /** The URL to load for a URI: a built-in data URL, the resolver's result, or the URI. */
  static async resolveUri(uri: string): Promise<string> {
    const builtin = builtinTextureUrl(uri);
    if (builtin) return builtin;
    return Resources.uriResolver ? await Resources.uriResolver(uri) : uri;
  }

  /** Frees everything loaded for a WebGL context (e.g. when its canvas goes away). */
  static releaseContext(gl: WebGL2RenderingContext): void {
    const manager = Resources.managers.get(gl);
    if (!manager) return;
    manager.dispose();
    Resources.managers.delete(gl);
    if (Resources.currentGl === gl) Resources.currentGl = null;
  }

  /** Removes a texture from its manager's cache without freeing it. */
  static forgetTexture(texture: Texture): void {
    const uri = texture.textureUri;
    if (!uri) return;
    for (const manager of Resources.managers.values()) {
      if (manager.textures.remove(uri, texture)) return;
    }
  }

  /** Frees every resource nobody holds, in every context. Returns how many. */
  static trim(): number {
    let freed = 0;
    for (const manager of Resources.managers.values()) freed += manager.trim();
    return freed;
  }

  /** What every manager holds (one entry per context; `null` = no context). */
  static stats(): ResourceManagerStats[] {
    return [...Resources.managers.values()].map((m) => m.stats());
  }

  /** Frees everything in every context and forgets all managers. */
  static clear(): void {
    for (const manager of Resources.managers.values()) manager.dispose();
    Resources.managers.clear();
    Resources.currentGl = null;
  }

  private static get loader(): ResourceLoader {
    return Resources.customLoader ?? Resources.defaultLoader;
  }
}
