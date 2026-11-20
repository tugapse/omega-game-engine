import { ICubemapSides } from '../../interfaces/cubemap';
import { ObjParser } from '../../parsers/obj-parser';
import { CubemapTexture } from '../../textures';
import { Texture } from '../../textures/texture';
import { MeshData } from '../mesh';
import { ResourceCache, ResourceCacheStats } from './resource-cache';
import { DefaultResourceLoader, ResourceLoader } from './resource-loader';
import { builtinTextureUrl } from './builtin-textures';
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
 * its own manager (see `EngineCache.managerFor`). Everything is loaded
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

  constructor(
    readonly gl: WebGL2RenderingContext | null,
    private loader: ResourceLoader,
  ) {
    this.textures = new ResourceCache<Texture>({
      load: async (uri) => {
        const texture = new Texture(this.requireGl(uri), uri);
        texture.loader = builtinTextureUrl(uri) ? this.builtinLoader : this.loader;
        await texture.load();
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
