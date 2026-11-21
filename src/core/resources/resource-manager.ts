import { ICubemapSides } from '../../interfaces/cubemap';
import { ObjParser } from '../../parsers/obj-parser';
import { CubemapTexture } from '../../textures';
import { Texture } from '../../textures/texture';
import { RenderTexture, isRenderTextureUri, renderTextureUri } from '../../textures/render-texture';
import { MeshData } from '../mesh';
import { ResourceCache, ResourceCacheStats } from './resource-cache';
import { DefaultResourceLoader, ResourceLoader } from './resource-loader';
import { BuiltinTextures, builtinTextureUrl } from './builtin-textures';
import { EMBEDDED_SHADERS } from '../../shaders/embedded-shaders';
import { ModelData, parseModelPartUri } from '../model/model-data';
import { parseFbx } from '../../parsers/fbx/fbx-parser';
import { isFbx } from '../../parsers/fbx/fbx-reader';
import type { LoadedImage } from './resource-loader';

export interface ResourceManagerStats {
  textures: ResourceCacheStats;
  cubemaps: ResourceCacheStats;
  meshes: ResourceCacheStats;
  shaders: ResourceCacheStats;
  models: ResourceCacheStats;
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
  /** Imported model files (FBX), parsed once and shared by every copy placed. */
  readonly models: ResourceCache<ModelData>;

  private readonly objParser = new ObjParser();
  /** Textures cameras render into, by URI. They live until `dispose()`. */
  private readonly renderTextures = new Map<string, RenderTexture>();
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
        if (isRenderTextureUri(uri)) return this.getRenderTexture(uri);
        const texture = new Texture(this.requireGl(uri), uri);
        texture.loader = builtinTextureUrl(uri) ? this.builtinLoader
          : parseModelPartUri(uri)?.kind === 'image' ? this.modelImageLoader
          : this.loader;
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
      // Render textures belong to `renderTextures`, not to the cache.
      dispose: (texture) => { if (!(texture instanceof RenderTexture)) texture.destroy(); },
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
    this.models = new ResourceCache<ModelData>({
      load: async (uri) => {
        const buffer = await this.loadBinary(uri);
        if (isFbx(buffer)) return parseFbx(buffer);
        throw new Error(`${uri} is not a model format the engine reads (FBX 7.x).`);
      },
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

  /**
   * The render texture called `name` (or with that `rendertexture://` URI),
   * created empty the first time. Cameras render into it; materials load it
   * like any texture.
   */
  getRenderTexture(name: string): RenderTexture {
    const uri = renderTextureUri(name);
    let texture = this.renderTextures.get(uri);
    if (!texture) {
      texture = new RenderTexture(this.requireGl(uri), uri);
      this.renderTextures.set(uri, texture);
    }
    return texture;
  }

  /** A cubemap with the built-in white texture on all six faces. */
  getWhiteCubemap(): Promise<CubemapTexture> {
    const w = BuiltinTextures.white;
    return this.getCubemap({ right: w, left: w, up: w, bottom: w, front: w, back: w });
  }

  async getMesh(uri: string): Promise<MeshData> {
    return ResourceManager.peekValue(await this.meshes.acquire(uri));
  }

  /** The model file at `uri` (without a `#part` fragment), loaded and parsed once. */
  async getModel(uri: string): Promise<ModelData> {
    return ResourceManager.peekValue(await this.models.acquire(uri.split('#')[0]));
  }

  /** Loads a binary file through the loader (or `fetch` when the loader has no `loadBinary`). */
  async loadBinary(uri: string): Promise<ArrayBuffer> {
    if (this.loader.loadBinary) return this.loader.loadBinary(uri);
    const response = await fetch(uri);
    if (!response.ok) throw new Error(`Failed to load ${uri} (HTTP ${response.status})`);
    return response.arrayBuffer();
  }

  /** Serves `<model>#image/N` textures from the images embedded in a model file. */
  private readonly modelImageLoader: ResourceLoader = {
    loadText: (uri) => this.loader.loadText(uri),
    loadImage: async (uri): Promise<LoadedImage> => {
      const part = parseModelPartUri(uri)!;
      const image = (await this.getModel(part.modelUri)).images[part.index];
      if (!image) throw new Error(`${uri}: the model has no image ${part.index}.`);
      return createImageBitmap(new Blob([image.data as BlobPart], { type: image.mimeType }));
    },
  };

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
      models: this.models.stats(),
    };
  }

  /** Disposes every resource nobody holds. Returns how many were freed. */
  trim(): number {
    return this.textures.trim() + this.cubemaps.trim() + this.meshes.trim() + this.shaders.trim() + this.models.trim();
  }

  /** Disposes everything (e.g. when the context goes away). */
  dispose(): void {
    this.textures.clear();
    this.cubemaps.clear();
    this.meshes.clear();
    this.shaders.clear();
    this.models.clear();
    for (const texture of this.renderTextures.values()) texture.destroy();
    this.renderTextures.clear();
  }

  private requireGl(what: string): WebGL2RenderingContext {
    if (!this.gl) {
      throw new Error(`Cannot load ${what}: no WebGL context is known yet.`);
    }
    return this.gl;
  }
}
