import { ICubemapSides } from '../../interfaces/cubemap';
import { ObjParser } from '../../parsers/obj-parser';
import { CubemapTexture } from '../../textures';
import { Texture } from '../../textures/texture';
import { MeshData } from '../mesh';
import { ResourceCache, ResourceCacheStats } from './resource-cache';
import { DefaultResourceLoader, ResourceLoader } from './resource-loader';
import { BuiltinTextures, builtinTextureUrl } from './builtin-textures';
import { EMBEDDED_SHADERS } from '../../shaders/embedded-shaders';

export interface ResourceManagerStats {
  textures: ResourceCacheStats;
  cubemaps: ResourceCacheStats;
  meshes: ResourceCacheStats;
  shaders: ResourceCacheStats;
}

/**
 * The resources of one WebGL context: textures, cubemaps, OBJ meshes and
 * shader sources, each in its own ResourceCache.
 *
 * GL objects belong to the context that created them, so each context has
 * its own manager (see `Resources.for`). Everything is loaded
 * through one replaceable ResourceLoader.
 */
export class ResourceManager {
  readonly textures: ResourceCache<Texture>;
  readonly cubemaps: ResourceCache<CubemapTexture>;
  readonly meshes: ResourceCache<MeshData>;
  readonly shaders: ResourceCache<string>;

  private readonly objParser = new ObjParser();
  /** Serves built-in textures from their data URLs, whatever the host loader. */
  private readonly builtinLoader = new DefaultResourceLoader(async (uri) => builtinTextureUrl(uri) ?? uri);
  /** Loads the magenta "missing" image whatever the URI. */
  private readonly missingLoader = new DefaultResourceLoader(async () => builtinTextureUrl(BuiltinTextures.missing)!);

  constructor(
    readonly gl: WebGL2RenderingContext | null,
    private loader: ResourceLoader,
  ) {
    this.textures = new ResourceCache<Texture>({
      load: async (uri) => {
        const texture = new Texture(this.requireGl(uri), uri);
        texture.loader = builtinTextureUrl(uri) ? this.builtinLoader : this.loader;
        try {
          await texture.load();
        } catch (error) {
          // Like Unity: show magenta instead of failing the whole scene. The
          // texture keeps its URI, so saving the scene keeps the reference.
          console.warn(`Texture ${uri} could not be loaded; using the missing texture.`, error);
          texture.loader = this.missingLoader;
          await texture.load();
        }
        return texture;
      },
      dispose: (texture) => texture.destroy(),
    });
    this.cubemaps = new ResourceCache<CubemapTexture>({
      load: async (key) => {
        const texture = new CubemapTexture(this.requireGl(key), key.split('|'));
        await texture.load();
        return texture;
      },
      dispose: (texture) => texture.destroy(),
    });
    this.meshes = new ResourceCache<MeshData>({
      load: async (uri) => this.objParser.parse(await this.loader.loadText(uri)) as MeshData,
    });
    this.shaders = new ResourceCache<string>({
      // The engine's own shaders are embedded; anything else is loaded.
      load: async (uri) => EMBEDDED_SHADERS[uri] ?? this.loader.loadText(uri),
    });
  }

  /** The cache key of a cubemap: its six face URIs. */
  static cubemapKey(sides: ICubemapSides): string {
    const { right, left, up, bottom, front, back } = sides;
    return [right, left, up, bottom, front, back].join('|');
  }

  /**
   * Shortcuts that load (or reuse) a resource without holding it: it stays
   * shared and cached until `trim()`/`dispose()`. Hold a handle from the
   * caches (`textures.acquire`) when you own a resource.
   */
  async getTexture(uri: string): Promise<Texture> {
    return ResourceManager.peekValue(await this.textures.acquire(uri));
  }

  async getCubemap(sides: ICubemapSides): Promise<CubemapTexture> {
    return ResourceManager.peekValue(await this.cubemaps.acquire(ResourceManager.cubemapKey(sides)));
  }

  /** A cubemap with the built-in white texture on all six faces. */
  getWhiteCubemap(): Promise<CubemapTexture> {
    const w = BuiltinTextures.white;
    return this.getCubemap({ right: w, left: w, up: w, bottom: w, front: w, back: w });
  }

  async getMesh(uri: string): Promise<MeshData> {
    return ResourceManager.peekValue(await this.meshes.acquire(uri));
  }

  async getShader(uri: string): Promise<string> {
    return ResourceManager.peekValue(await this.shaders.acquire(uri));
  }

  private static peekValue<V>(handle: { value: V; release(): void }): V {
    handle.release();
    return handle.value;
  }

  /** Replaces the loader for resources loaded from now on. */
  setLoader(loader: ResourceLoader): void {
    this.loader = loader;
  }

  getLoader(): ResourceLoader {
    return this.loader;
  }

  stats(): ResourceManagerStats {
    return {
      textures: this.textures.stats(),
      cubemaps: this.cubemaps.stats(),
      meshes: this.meshes.stats(),
      shaders: this.shaders.stats(),
    };
  }

  /** Disposes every resource nobody holds. Returns how many were freed. */
  trim(): number {
    return this.textures.trim() + this.cubemaps.trim() + this.meshes.trim() + this.shaders.trim();
  }

  /** Disposes everything (e.g. when the context goes away). */
  dispose(): void {
    this.textures.clear();
    this.cubemaps.clear();
    this.meshes.clear();
    this.shaders.clear();
  }

  private requireGl(what: string): WebGL2RenderingContext {
    if (!this.gl) {
      throw new Error(`Cannot load ${what}: no WebGL context is known yet.`);
    }
    return this.gl;
  }
}
