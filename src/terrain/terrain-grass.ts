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
import { seededRandom } from './terrain-noise';

/**
 * A tuft of `blades` blades in tuft units: 1 high, within 1 of the middle.
 * Each blade tapers to a point in `segments` pieces and bends outwards; uv v
 * goes from 0 at the foot to 1 at the tip (for the wind and the shading).
 * The normals lean up, so the blades light like the ground they grow on.
 */
export function grassTuft(blades = 5, segments = 3, seed = 3): MeshData {
  const random = seededRandom(seed);
  const v: vec3[] = [], n: vec3[] = [], uv: vec2[] = [], idx: number[] = [];
  for (let b = 0; b < blades; b++) {
    const a = (b / blades) * Math.PI * 2 + random() * 0.8;
    const r = 0.15 + random() * 0.55;
    const ox = Math.cos(a) * r, oz = Math.sin(a) * r;
    const facing = a + Math.PI / 2 + (random() - 0.5) * 1.2;
    const fx = Math.cos(facing), fz = Math.sin(facing);
    const lean = 0.25 + random() * 0.45, height = 0.65 + random() * 0.35, width = 0.09 + random() * 0.05;
    const nx = -fz * 0.35, nz = fx * 0.35;
    const base = v.length;
    for (let k = 0; k <= segments; k++) {
      const t = k / segments;
      // The blade curves outwards more towards its tip.
      const cx = ox + Math.cos(a) * lean * t * t, cz = oz + Math.sin(a) * lean * t * t, y = height * t;
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

interface GrassTile { key: string; entity: SceneEntity; renderer: InstancedMeshRendererBehaviour; count: number; cx: number; cz: number }

/**
 * Put it on the entity with the TerrainBehaviour. Grass within `radius` of
 * the camera (or of `center`, in world space, when set), swaying in `wind`.
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
  /** Waits for a stroke to end before making the tiles it changed. */
  holdDuringStrokes = true;
  /** Where the grass is centred (world space); the main camera when null. */
  center: vec3 | null = null;
  material: LitMaterial;
  mesh: MeshData;

  private readonly tiles = new Map<string, GrassTile>();
  private readonly cover = new Float32Array(8);
  private version = 0;

  constructor(public gl: WebGL2RenderingContext) {
    super();
    this.material = new LitMaterial();
    this.material.color = new Color(0.36, 0.56, 0.2, 1);
    this.material.specularStrength = 0.05;
    this.material.roughness = 0.9;
    this.mesh = grassTuft();
    this._serializationIgnoreKeys.push('gl', 'tiles', 'cover', 'version', 'material', 'mesh', 'center');
  }

  get terrain(): TerrainBehaviour | undefined {
    return this.parent?.getBehaviour(TerrainBehaviour) ?? undefined;
  }

  /** Tufts drawn now. */
  get drawn(): number {
    let n = 0;
    for (const t of this.tiles.values()) n += t.renderer.instancesDrawn;
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
    const local = terrain.toLocal(eye);
    const ground = terrain.grid.heightAt(local[0], local[2]) ?? local[1];
    // From high above, the grass is out of reach horizontally too.
    const above = Math.max(0, local[1] - ground);
    const reach = Math.sqrt(Math.max(0, this.radius * this.radius - above * above));
    const size = this.tile, hold = this.holdDuringStrokes && terrain.history.isOpen;
    const numbers = `${this.seed}:${this.density}:${this.layers.join(',')}:${this.height}:${this.width}:${this.water}:${this.version}`;
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
          tile = this.make(terrain, tx, tz, key, cx, cz);
          this.tiles.set(id, tile);
        }
        if (tile) tile.renderer.drawCount = Math.round(tile.count * grassFalloff(Math.hypot(d, above), this.radius));
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

  private make(terrain: TerrainBehaviour, tx: number, tz: number, key: string, cx: number, cz: number): GrassTile {
    const { data, count } = grassTile(terrain.grid, tx, tz, this.tile, (x, z, out) => terrain.layerWeightsAt(x, z, out), {
      seed: this.seed, density: this.density, layers: this.layers, height: this.height, width: this.width, water: this.water,
    });
    const e = new SceneEntity(`Grass ${tx},${tz}`);
    e.transient = true;
    e.transform.setParent(this.transform);
    const r = new InstancedMeshRendererBehaviour(this.gl);
    r.mesh = new Mesh();
    r.mesh.meshData = this.mesh;
    r.shader = new LitShader(this.gl, this.material);
    r.wind = this.wind;
    r.tipShade = this.tipShade;
    r.castShadows = false;
    r.enableCullFace = false;
    r.setInstances(data, count);
    e.addBehaviour(r);
    this.parent!.scene!.addEntity(e);
    return { key, entity: e, renderer: r, count, cx, cz };
  }

  private drop(t: GrassTile): void {
    this.parent?.scene?.removeEntity(t.entity);
    t.entity.transform.setParent(null);
  }
}
