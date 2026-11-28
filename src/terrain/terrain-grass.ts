// Grass on a terrain: tufts of low-poly blades drawn as instances, only near
// the camera. The ground is cut into square tiles; the tiles within `radius`
// get their tufts (where the grass layers cover the ground, as the rules and
// the painting lay them), drawn by one instanced renderer each, and fewer of
// them further out: a tile's tufts are in a random order, so drawing the first
// ones thins it evenly. Tiles are made as the camera comes near and dropped as
// it goes; a tile is made again when its chunk's heights or painting change.
import { vec2, vec3 } from 'gl-matrix';
import { EntityBehaviour } from '../behaviours/entity-behaviour';
import { InstancedMeshRendererBehaviour } from '../behaviours/renderer/instanced-mesh-renderer-behaviour';
import { Color } from '../core/color';
import { Mesh, MeshData } from '../core/mesh';
import { INSTANCE_FLOATS, packInstance } from '../core/render/instancing';
import { Camera } from '../entities/camera';
import { SceneEntity } from '../entities/entity';
import { LitMaterial } from '../materials/lit-material';
import { LitShader } from '../shaders/lit-shader';
import { TerrainBehaviour } from './terrain-behaviour';
import { TerrainGrid } from './terrain-data';
import { Noise2D, seededRandom } from './terrain-noise';

/** The shape of a tuft (all in tuft units: 1 is its height and its reach from the middle). */
export interface GrassTuftOptions {
  /** How many blades. */
  blades?: number;
  /** Pieces a blade is made of (2 to 6): more bend more smoothly. */
  segments?: number;
  seed?: number;
  /** How far from the middle the blades stand (0 all together, 1 spread to the edge). */
  spread?: number;
  /** How far a blade's tip bends out (0 straight up). */
  lean?: number;
  /** How far the tips droop back down (0 none, 1 a lot). */
  droop?: number;
  /** A blade's width at its foot. */
  bladeWidth?: number;
  /** How much shorter some blades are than the tallest (0 all alike). */
  heightVariation?: number;
}

export const DEFAULT_TUFT: Required<GrassTuftOptions> = {
  blades: 5, segments: 3, seed: 3, spread: 0.7, lean: 0.7, droop: 0, bladeWidth: 0.14, heightVariation: 0.35,
};

/**
 * A tuft of blades in tuft units: about 1 high, within 1 of the middle. Each
 * blade tapers to a point and bends outwards (and down again with `droop`);
 * uv v goes from 0 at the foot to 1 at the tip (for the wind and the shading).
 * The normals lean up, so the blades light like the ground they grow on.
 * `grassTuft(blades, segments, seed)` still works.
 */
export function grassTuft(options: GrassTuftOptions | number = {}, segmentsArg?: number, seedArg?: number): MeshData {
  const o = typeof options === 'number'
    ? { ...DEFAULT_TUFT, blades: options, segments: segmentsArg ?? DEFAULT_TUFT.segments, seed: seedArg ?? DEFAULT_TUFT.seed }
    : { ...DEFAULT_TUFT, ...options };
  const blades = Math.max(1, Math.round(o.blades)), segments = Math.min(6, Math.max(2, Math.round(o.segments)));
  const random = seededRandom(o.seed);
  const v: vec3[] = [], n: vec3[] = [], uv: vec2[] = [], idx: number[] = [];
  for (let b = 0; b < blades; b++) {
    const a = (b / blades) * Math.PI * 2 + random() * 0.8;
    const r = o.spread * (0.214 + random() * 0.786);
    const ox = Math.cos(a) * r, oz = Math.sin(a) * r;
    const facing = a + Math.PI / 2 + (random() - 0.5) * 1.2;
    const fx = Math.cos(facing), fz = Math.sin(facing);
    const lean = o.lean * (0.357 + random() * 0.643);
    const height = 1 - o.heightVariation + random() * o.heightVariation;
    const width = o.bladeWidth * (0.643 + random() * 0.357);
    const nx = -fz * 0.35, nz = fx * 0.35;
    const base = v.length;
    for (let k = 0; k <= segments; k++) {
      const t = k / segments;
      // The blade curves outwards more towards its tip, and droops back down.
      const out = lean * t * t * (1 + o.droop * 0.6);
      const cx = ox + Math.cos(a) * out, cz = oz + Math.sin(a) * out;
      const y = height * t * (1 - o.droop * 0.5 * t * t);
      const w = width * (1 - t);
      if (k < segments) {
        v.push([cx - fx * w, y, cz - fz * w], [cx + fx * w, y, cz + fz * w]);
        uv.push([0, t], [1, t]);
        n.push([nx, 1, nz], [nx, 1, nz]);
      } else {
        v.push([cx, y, cz]);
        uv.push([0.5, 1]);
        n.push([nx, 1, nz]);
      }
    }
    for (let k = 0; k < segments - 1; k++) {
      const i = base + k * 2;
      idx.push(i, i + 1, i + 3, i, i + 3, i + 2);
    }
    const last = base + (segments - 1) * 2;
    idx.push(last, last + 1, last + 2);
  }
  const m = new MeshData(v, n.map((q) => { const l = Math.hypot(q[0], q[1], q[2]); return [q[0] / l, q[1] / l, q[2] / l] as vec3; }), uv, idx);
  m.providedNormals = true;
  return m;
}

/** A kind of grass: its tuft's shape, its size, its colours and its share where kinds mix. */
export interface GrassKind {
  name: string;
  tuft: GrassTuftOptions;
  /** A tuft's height and width (m). */
  height: number;
  width: number;
  /** The blades' colour (0 to 1). */
  color: [number, number, number];
  /** How much darker the foot is (0 to 1). */
  tipShade: number;
  /** A colour the tips turn towards, and how much (0 none). */
  tipColor: [number, number, number];
  tipAmount: number;
  /** Its share beside the other kinds (any positive number). */
  weight: number;
}

/** Ready-made kinds. */
export const GRASS_PRESETS: GrassKind[] = [
  { name: 'Prado', tuft: { ...DEFAULT_TUFT }, height: 0.45, width: 0.3, color: [0.36, 0.56, 0.2], tipShade: 0.55, tipColor: [0.75, 0.85, 0.4], tipAmount: 0.15, weight: 1 },
  { name: 'Seca', tuft: { ...DEFAULT_TUFT, blades: 7, lean: 0.5, droop: 0.35, bladeWidth: 0.09 }, height: 0.6, width: 0.32, color: [0.55, 0.52, 0.25], tipShade: 0.45, tipColor: [0.92, 0.82, 0.5], tipAmount: 0.6, weight: 1 },
  { name: 'Musgo', tuft: { ...DEFAULT_TUFT, blades: 9, spread: 1, lean: 0.9, bladeWidth: 0.22, heightVariation: 0.6, segments: 2 }, height: 0.12, width: 0.35, color: [0.2, 0.38, 0.14], tipShade: 0.4, tipColor: [0.45, 0.6, 0.2], tipAmount: 0.3, weight: 1 },
  { name: 'Juncos', tuft: { ...DEFAULT_TUFT, blades: 4, spread: 0.3, lean: 0.15, bladeWidth: 0.07, heightVariation: 0.2, segments: 4 }, height: 1.1, width: 0.25, color: [0.27, 0.45, 0.2], tipShade: 0.5, tipColor: [0.6, 0.5, 0.3], tipAmount: 0.4, weight: 1 },
  { name: 'Outono', tuft: { ...DEFAULT_TUFT, blades: 6, droop: 0.5, lean: 0.8 }, height: 0.4, width: 0.32, color: [0.62, 0.4, 0.16], tipShade: 0.5, tipColor: [0.85, 0.3, 0.12], tipAmount: 0.5, weight: 1 },
];

export interface GrassOptions {
  seed: number;
  /** Tufts a square metre where the grass covers the ground fully. */
  density: number;
  /** The layers (indices) grass grows on. */
  layers: number[];
  /** A tuft's height and width (m) at scale 1. */
  height: number;
  width: number;
  /** The water's level (terrain space) or null: no grass under it. */
  water: number | null;
}

export const DEFAULT_GRASS: GrassOptions = { seed: 1, density: 2.5, layers: [0], height: 0.45, width: 0.3, water: null };

/** Each layer's weight (0 to 1) at a terrain-space point. */
export type GrassCover = (x: number, z: number, out: Float32Array) => Float32Array;

/**
 * The tufts of the tile of `size` metres at (tx, tz) (in tiles), packed as
 * instances in a random order, and how many there are. Only where there is a
 * chunk; the same tile and numbers always give the same tufts.
 */
export function grassTile(grid: TerrainGrid, tx: number, tz: number, size: number, cover: GrassCover, options: Partial<GrassOptions> = {}): { data: Float32Array; count: number } {
  const o = { ...DEFAULT_GRASS, ...options };
  const random = seededRandom((o.seed * 2654435761) ^ (tx * 19349663) ^ (tz * 83492791));
  const step = 1 / Math.sqrt(Math.max(o.density, 1e-3));
  const cells = Math.max(1, Math.round(size / step));
  const cell = size / cells;
  const data = new Float32Array(cells * cells * INSTANCE_FLOATS);
  const weights = new Float32Array(8);
  // How much the grass layers cover the ground, sampled every metre or so
  // (the cover is the slow part) and read between the samples.
  const n = Math.max(1, Math.ceil(size / 1.2)), gap = size / n;
  const fits = new Float32Array((n + 1) * (n + 1));
  for (let j = 0; j <= n; j++) {
    for (let i = 0; i <= n; i++) {
      cover(tx * size + i * gap, tz * size + j * gap, weights);
      let f = 0;
      for (const l of o.layers) f += weights[l] ?? 0;
      fits[j * (n + 1) + i] = f;
    }
  }
  const fitAt = (lx: number, lz: number) => {
    const fx = Math.min(lx / gap, n - 1e-6), fz = Math.min(lz / gap, n - 1e-6);
    const i = Math.floor(fx), j = Math.floor(fz), u = fx - i, w = fz - j, k = j * (n + 1) + i;
    const top = fits[k] + (fits[k + 1] - fits[k]) * u, bottom = fits[k + n + 1] + (fits[k + n + 2] - fits[k + n + 1]) * u;
    return top + (bottom - top) * w;
  };
  let count = 0;
  for (let j = 0; j < cells; j++) {
    for (let i = 0; i < cells; i++) {
      const r0 = random(), r1 = random(), r2 = random(), r3 = random(), r4 = random(), r5 = random();
      const x = tx * size + (i + r1) * cell, z = tz * size + (j + r2) * cell;
      const [cx, cz] = grid.cellAt(x, z);
      const c = grid.get(cx, cz);
      if (!c) continue;
      const h = c.heightAtLocal(x - c.originX, z - c.originZ);
      if (o.water !== null && h < o.water + 0.1) continue;
      const fit = fitAt((i + r1) * cell, (j + r2) * cell);
      if (r0 >= fit * 1.15) continue;
      const scale = (0.7 + r3 * 0.6) * (0.6 + 0.4 * Math.min(fit * 1.3, 1));
      packInstance(data, count++, x, h - 0.03, z, r4 * Math.PI * 2, o.width * scale, o.height * scale, 0.35 + r5 * 0.3, r1 * 6.28);
    }
  }
  // A random order, so the first n of them are spread over the whole tile.
  const tmp = new Float32Array(INSTANCE_FLOATS);
  for (let i = count - 1; i > 0; i--) {
    const k = Math.floor(random() * (i + 1));
    tmp.set(data.subarray(i * INSTANCE_FLOATS, (i + 1) * INSTANCE_FLOATS));
    data.copyWithin(i * INSTANCE_FLOATS, k * INSTANCE_FLOATS, (k + 1) * INSTANCE_FLOATS);
    data.set(tmp, k * INSTANCE_FLOATS);
  }
  return { data, count };
}

/** How much of a tile's grass to draw at a distance: all near, thinning to `far` at the edge, none beyond. */
export function grassFalloff(distance: number, radius: number, far = 0.15): number {
  if (distance >= radius) return 0;
  const t = Math.max(0, (distance - radius * 0.35) / (radius * 0.65));
  return 1 - (1 - far) * t * t * (3 - 2 * t);
}

/**
 * Splits a tile's tufts (packed with height and width 1) among kinds: each
 * tuft picks one by the kinds' weights, in patches as large noises say
 * (`patches` 0 for an even mix, 1 for clear patches), and is scaled to its
 * kind's size. The tufts keep their random order within each kind.
 */
export function splitGrass(data: Float32Array, count: number, kinds: { weight: number; height: number; width: number }[], seed = 1, patches = 0.7): { data: Float32Array; count: number }[] {
  const out = kinds.map(() => ({ data: new Float32Array(count * INSTANCE_FLOATS), count: 0 }));
  if (!kinds.length) return out;
  const noises = kinds.map((_, k) => new Noise2D(seed * 31 + k * 977 + 7));
  const shares = new Float32Array(kinds.length);
  for (let i = 0; i < count; i++) {
    const k0 = i * INSTANCE_FLOATS, x = data[k0], z = data[k0 + 2];
    let total = 0;
    for (let k = 0; k < kinds.length; k++) {
      const patch = Math.min(Math.max(0.5 + noises[k].get(x / 14, z / 14) * 1.6, 0), 1);
      shares[k] = Math.max(0, kinds[k].weight) * (1 - patches + patches * patch * 2);
      total += shares[k];
    }
    // A number from the tuft's place, so it keeps its kind.
    let pick = (((Math.sin(x * 12.9898 + z * 78.233) * 43758.5453) % 1) + 1) % 1 * total, k = 0;
    if (total <= 0) { k = 0; } else for (; k < kinds.length - 1; k++) { pick -= shares[k]; if (pick < 0) break; }
    const o = out[k], k1 = o.count * INSTANCE_FLOATS;
    o.data.set(data.subarray(k0, k0 + INSTANCE_FLOATS), k1);
    o.data[k1 + 4] *= kinds[k].width;
    o.data[k1 + 5] *= kinds[k].height;
    o.count++;
  }
  return out;
}

interface GrassTile { key: string; parts: { entity: SceneEntity; renderer: InstancedMeshRendererBehaviour; count: number }[] }

/** A kind ready to draw. */
interface DrawnKind { mesh: MeshData; material: LitMaterial; height: number; width: number; tipShade: number; tipColor: [number, number, number, number]; weight: number }

/**
 * Put it on the entity with the TerrainBehaviour. Grass within `radius` of
 * the camera (or of `center`, in world space, when set), swaying in `wind`.
 * Set `kinds` for several kinds of grass mixed in patches; without them it is
 * one kind from `mesh`, `material`, `height`, `width` and `tipShade`.
 */
export class TerrainGrassBehaviour extends EntityBehaviour {
  protected override _className = 'TerrainGrassBehaviour';

  static override instanciate(gl: WebGL2RenderingContext): TerrainGrassBehaviour {
    return new TerrainGrassBehaviour(gl);
  }

  seed = DEFAULT_GRASS.seed;
  /** Tufts a square metre where grass covers the ground fully (0 for none). */
  density = DEFAULT_GRASS.density;
  layers = [...DEFAULT_GRASS.layers];
  height = DEFAULT_GRASS.height;
  width = DEFAULT_GRASS.width;
  water: number | null = null;
  /** Metres from the camera with grass; it thins out towards it. */
  radius = 60;
  /** A tile's side (m). */
  tile = 16;
  /** Tiles made a frame. */
  perFrame = 1;
  /** Direction (x, z), strength (m at the tip) and speed. Set before the first tiles are made. */
  wind: [number, number, number, number] = [0.8, 0.6, 0.12, 1.6];
  /** How much darker the foot of a blade is than its tip. */
  tipShade = 0.55;
  /** Kinds of grass mixed in patches (copied when the tiles are made: change it and the tiles follow). */
  kinds: GrassKind[] = [];
  /** 0 an even mix of the kinds, 1 clear patches of each. */
  patches = 0.7;
  /** Waits for a stroke to end before making the tiles it changed. */
  holdDuringStrokes = true;
  /** Where the grass is centred (world space); the main camera when null. */
  center: vec3 | null = null;
  material: LitMaterial;
  mesh: MeshData;

  private readonly tiles = new Map<string, GrassTile>();
  private version = 0;
  private drawnKinds: DrawnKind[] = [];
  private kindsKey = '';

  constructor(public gl: WebGL2RenderingContext) {
    super();
    this.material = new LitMaterial();
    this.material.color = new Color(0.36, 0.56, 0.2, 1);
    this.material.specularStrength = 0.05;
    this.material.roughness = 0.9;
    this.mesh = grassTuft();
    this._serializationIgnoreKeys.push('gl', 'tiles', 'version', 'material', 'mesh', 'center', 'drawnKinds', 'kindsKey');
  }

  get terrain(): TerrainBehaviour | undefined {
    return this.parent?.getBehaviour(TerrainBehaviour) ?? undefined;
  }

  /** Tufts drawn now. */
  get drawn(): number {
    let n = 0;
    for (const t of this.tiles.values()) for (const p of t.parts) n += p.renderer.instancesDrawn;
    return n;
  }

  /** Makes every tile again (after changing the mesh, the material or the wind). */
  rebuild(): void {
    for (const t of this.tiles.values()) this.drop(t);
    this.tiles.clear();
    this.version++;
  }

  override update(elapsed: number): void {
    super.update(elapsed);
    this.refresh();
  }

  /** Makes, thins and drops tiles around the camera (call it yourself when the entity is not updated). */
  refresh(): void {
    const terrain = this.terrain, scene = this.parent?.scene;
    if (!terrain || !scene) return;
    const eye = this.center ?? Camera.mainCamera?.transform.worldPosition;
    if (!eye) return;
    this.resolveKinds();
    const local = terrain.toLocal(eye);
    const ground = terrain.grid.heightAt(local[0], local[2]) ?? local[1];
    // From high above, the grass is out of reach horizontally too.
    const above = Math.max(0, local[1] - ground);
    const reach = Math.sqrt(Math.max(0, this.radius * this.radius - above * above));
    const size = this.tile, hold = this.holdDuringStrokes && terrain.history.isOpen;
    const numbers = `${this.seed}:${this.density}:${this.layers.join(',')}:${this.height}:${this.width}:${this.water}:${this.version}:${this.kindsKey}`;
    const want = new Set<string>();
    let made = 0;
    if (this.density > 0 && reach > 0) {
      const t0x = Math.floor((local[0] - reach) / size), t1x = Math.floor((local[0] + reach) / size);
      const t0z = Math.floor((local[2] - reach) / size), t1z = Math.floor((local[2] + reach) / size);
      // Nearest tiles first.
      const order: [number, number, number][] = [];
      for (let tz = t0z; tz <= t1z; tz++) {
        for (let tx = t0x; tx <= t1x; tx++) {
          const d = Math.hypot((tx + 0.5) * size - local[0], (tz + 0.5) * size - local[2]) - size * 0.7071;
          if (d < reach) order.push([tx, tz, Math.max(0, d)]);
        }
      }
      order.sort((a, b) => a[2] - b[2]);
      for (const [tx, tz, d] of order) {
        const id = `${tx},${tz}`;
        const [cx, cz] = terrain.grid.cellAt((tx + 0.5) * size, (tz + 0.5) * size);
        const chunk = terrain.grid.get(cx, cz);
        if (!chunk) continue;
        want.add(id);
        const key = `${chunk.heightVersion}:${chunk.splatVersion}:${numbers}`;
        let tile = this.tiles.get(id);
        if ((!tile || tile.key !== key) && !hold && made < this.perFrame) {
          made++;
          if (tile) this.drop(tile);
          tile = this.make(terrain, tx, tz, key);
          this.tiles.set(id, tile);
        }
        if (tile) {
          const f = grassFalloff(Math.hypot(d, above), this.radius);
          for (const p of tile.parts) p.renderer.drawCount = Math.round(p.count * f);
        }
      }
    }
    for (const [id, t] of this.tiles) {
      if (want.has(id)) continue;
      this.drop(t);
      this.tiles.delete(id);
    }
  }

  override destroy(): void {
    for (const t of this.tiles.values()) this.drop(t);
    this.tiles.clear();
    super.destroy();
  }

  /** The kinds to draw, their meshes and materials made again only when they changed. */
  private resolveKinds(): void {
    const key = JSON.stringify([this.kinds, this.patches, this.tipShade, this.height, this.width]);
    if (key === this.kindsKey && this.drawnKinds.length) return;
    this.kindsKey = key;
    if (!this.kinds.length) {
      this.drawnKinds = [{ mesh: this.mesh, material: this.material, height: this.height, width: this.width, tipShade: this.tipShade, tipColor: [0, 0, 0, 0], weight: 1 }];
      return;
    }
    this.drawnKinds = this.kinds.map((k) => {
      const m = new LitMaterial();
      m.color = new Color(k.color[0], k.color[1], k.color[2], 1);
      m.specularStrength = 0.05;
      m.roughness = 0.9;
      return {
        mesh: grassTuft(k.tuft), material: m, height: k.height, width: k.width,
        tipShade: Math.max(0.001, k.tipShade), tipColor: [k.tipColor[0], k.tipColor[1], k.tipColor[2], k.tipAmount], weight: k.weight,
      };
    });
  }

  private make(terrain: TerrainBehaviour, tx: number, tz: number, key: string): GrassTile {
    const kinds = this.drawnKinds, single = kinds.length === 1;
    const { data, count } = grassTile(terrain.grid, tx, tz, this.tile, (x, z, out) => terrain.layerWeightsAt(x, z, out), {
      seed: this.seed, density: this.density, layers: this.layers, water: this.water,
      height: single ? kinds[0].height : 1, width: single ? kinds[0].width : 1,
    });
    const groups = single ? [{ data, count }] : splitGrass(data, count, kinds, this.seed, this.patches);
    const parts: GrassTile['parts'] = [];
    groups.forEach((g, k) => {
      if (!g.count) return;
      const kind = kinds[k];
      const e = new SceneEntity(`Grass ${tx},${tz}`);
      e.transient = true;
      e.transform.setParent(this.transform);
      const r = new InstancedMeshRendererBehaviour(this.gl);
      r.mesh = new Mesh();
      r.mesh.meshData = kind.mesh;
      const shader = new LitShader(this.gl, kind.material);
      // Every tile of a kind uses one program: compiled once, not per tile.
      shader.shareProgram = true;
      r.shader = shader;
      r.wind = this.wind;
      r.tipShade = kind.tipShade;
      r.tipColor = kind.tipColor;
      r.castShadows = false;
      r.enableCullFace = false;
      r.setInstances(g.data, g.count);
      e.addBehaviour(r);
      this.parent!.scene!.addEntity(e);
      parts.push({ entity: e, renderer: r, count: g.count });
    });
    return { key, parts };
  }

  private drop(t: GrassTile): void {
    for (const p of t.parts) {
      this.parent?.scene?.removeEntity(p.entity);
      p.entity.transform.setParent(null);
    }
  }
}
