// The terrain's material: its layers (textures and rules) and how they blend.
// One material is shared by every chunk; its textures live in two texture
// arrays (colours and normals), made once per WebGL context.
import { JsonSerializedData } from '../interfaces/json-serialized-data';
import { LitMaterial } from '../materials/lit-material';
import { TextureArray } from '../textures/texture-array';
import { MAX_TERRAIN_LAYERS } from './terrain-data';
import { defaultLayers, packLayerUniforms, TerrainLayer } from './terrain-rules';
import { GroundTexture, groundTexture } from './terrain-textures';

const generated = new Map<string, GroundTexture>();

/** A ground texture made in code, kept so each kind is only made once. */
export function cachedGroundTexture(kind: TerrainLayer['ground'], size: number): GroundTexture {
  const key = `${kind}:${size}`;
  let t = generated.get(key);
  if (!t) { t = groundTexture(kind, size); generated.set(key, t); }
  return t;
}

export class TerrainMaterial extends LitMaterial {
  protected override _className = 'TerrainMaterial';

  static override instanciate(): TerrainMaterial {
    return new TerrainMaterial();
  }

  public layers: TerrainLayer[] = defaultLayers();
  /** How much the texture heights decide the blend between layers (0 a plain mix). */
  public heightBlend = 0.3;
  /** Large patches lighter or darker, against visible tiling (0 to 1). */
  public macroVariation = 0.3;
  /** Projects the textures from the sides on steep slopes (off on slow devices). */
  public triplanar = true;
  /** Texels a side of each layer's textures. */
  public textureSize = 512;

  /** Goes up whenever the layers' textures must be made again (call `changed`). */
  public textureVersion = 0;
  /** Goes up on any change (the packed rules follow it). */
  public version = 0;

  private arrays = new Map<WebGL2RenderingContext, { version: number; albedo: TextureArray; normal: TextureArray }>();
  private packed: { version: number; data: ReturnType<typeof packLayerUniforms> } | null = null;

  constructor() {
    super();
    this._serializationIgnoreKeys.push('arrays', 'packed', 'textureVersion', 'version');
  }

  /** Call after changing the layers: `textures` true when their textures changed too. */
  changed(textures = false): void {
    this.version++;
    if (textures) this.textureVersion++;
  }

  /** The rules packed for the shader. */
  uniforms(): ReturnType<typeof packLayerUniforms> {
    if (!this.packed || this.packed.version !== this.version) this.packed = { version: this.version, data: packLayerUniforms(this.layers) };
    return this.packed.data;
  }

  /** The texture arrays for a context, made (or made again) as needed. */
  textures(gl: WebGL2RenderingContext): { albedo: TextureArray; normal: TextureArray } {
    let t = this.arrays.get(gl);
    if (t && t.version === this.textureVersion) return t;
    t?.albedo.destroy();
    t?.normal.destroy();
    const count = Math.max(1, Math.min(this.layers.length, MAX_TERRAIN_LAYERS));
    const size = this.textureSize;
    const albedo = new TextureArray(gl, size, count);
    const normal = new TextureArray(gl, size, count);
    this.layers.slice(0, count).forEach((layer, i) => {
      const g = cachedGroundTexture(layer.ground, size);
      albedo.setLayer(i, g.albedo);
      normal.setLayer(i, g.normal);
      if (layer.albedoUri) void loadInto(albedo, i, layer.albedoUri);
      if (layer.normalUri) void loadInto(normal, i, layer.normalUri);
    });
    albedo.generateMipmaps();
    normal.generateMipmaps();
    t = { version: this.textureVersion, albedo, normal };
    this.arrays.set(gl, t);
    return t;
  }

  override toJsonObject(): JsonSerializedData {
    return {
      ...super.toJsonObject(),
      layers: this.layers.map((l) => ({ ...l, tint: [...l.tint], height: [...l.height], slope: [...l.slope] })),
      heightBlend: this.heightBlend,
      macroVariation: this.macroVariation,
      triplanar: this.triplanar,
      textureSize: this.textureSize,
    };
  }

  override async fromJson(jsonObject: JsonSerializedData): Promise<void> {
    await super.fromJson(jsonObject);
    const j = jsonObject as any;
    if (Array.isArray(j.layers)) this.layers = j.layers.map((l: TerrainLayer) => ({ ...l }));
    if (typeof j.heightBlend === 'number') this.heightBlend = j.heightBlend;
    if (typeof j.macroVariation === 'number') this.macroVariation = j.macroVariation;
    if (typeof j.triplanar === 'boolean') this.triplanar = j.triplanar;
    if (typeof j.textureSize === 'number') this.textureSize = j.textureSize;
    this.changed(true);
  }
}

/** Loads an image into one layer of an array (resized to it), in the browser. */
async function loadInto(array: TextureArray, layer: number, uri: string): Promise<void> {
  if (typeof document === 'undefined') return;
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = uri;
  try { await img.decode(); } catch { console.warn(`Terrain: could not load ${uri}`); return; }
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = array.size;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, array.size, array.size);
  array.setLayer(layer, ctx.getImageData(0, 0, array.size, array.size).data);
  array.generateMipmaps();
}
