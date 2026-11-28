// Plants on a terrain: species scattered per chunk (terrain-scatter.ts) where
// their layers cover the ground, drawn as one merged mesh per part and look on
// each chunk (transient child entities), built again when a chunk's heights,
// painting or the numbers change. Merged meshes work with the lights, shadows
// and fog as they are; with instancing only the drawing here would change.
import { vec2, vec3 } from 'gl-matrix';
import { EntityBehaviour } from '../behaviours/entity-behaviour';
import { MeshRendererBehaviour } from '../behaviours/renderer/mesh-renderer-behaviour';
import { Color } from '../core/color';
import { Mesh, MeshData } from '../core/mesh';
import { SceneEntity } from '../entities/entity';
import { LitMaterial } from '../materials/lit-material';
import { LathePrimitive } from '../primitives/lathe-primitive';
import { SpherePrimitive } from '../primitives/sphere-primitive';
import { LitShader } from '../shaders/lit-shader';
import { TerrainBehaviour } from './terrain-behaviour';
import { TerrainGrid } from './terrain-data';
import { DEFAULT_SCATTER, scatter, ScatterItem, ScatterOptions, ScatterSpecies } from './terrain-scatter';

/** One mesh of a plant (a trunk, a crown) and its material for each look. */
export interface VegetationPart {
  /** In plant units: 1 is the plant's height up y and its radius across x and z. */
  mesh: MeshData;
  /** Picked by the plant's variant (wrapping round). */
  materials: LitMaterial[];
}

export interface VegetationSpecies extends ScatterSpecies {
  name: string;
  /** Metres at scale 1. */
  height: number;
  radius: number;
  /** The trunk's radius (m) at scale 1, for `pushOut`: 0 for plants you walk through. */
  trunk: number;
  parts: VegetationPart[];
}

/** A placement of a mesh: moved, scaled (x, y, z) and turned about y. */
export interface MeshPlacement { at: [number, number, number]; scale: [number, number, number]; turn: number }

/** Copies of a mesh, each placed, merged into one mesh; normals follow the scale. */
export function mergePlaced(part: MeshData, places: MeshPlacement[]): MeshData {
  const v: vec3[] = [], n: vec3[] = [], uv: vec2[] = [], idx: number[] = [];
  for (const { at, scale, turn } of places) {
    const base = v.length, cs = Math.cos(turn), sn = Math.sin(turn);
    part.vertices.forEach((p, i) => {
      const x = p[0] * scale[0], z = p[2] * scale[2];
      v.push([x * cs - z * sn + at[0], p[1] * scale[1] + at[1], x * sn + z * cs + at[2]]);
      const q = part.normals[i] ?? [0, 1, 0];
      const nx = q[0] / scale[0], ny = q[1] / scale[1], nz = q[2] / scale[2], l = Math.hypot(nx, ny, nz) || 1;
      n.push([(nx * cs - nz * sn) / l, ny / l, (nx * sn + nz * cs) / l]);
      uv.push(part.uvs[i] ?? [0, 0]);
    });
    for (const i of part.indices) idx.push(base + i);
  }
  const m = new MeshData(v, n, uv, idx);
  m.providedNormals = true;
  return m;
}

/**
 * Low trees in plant units (height 1, crown radius 1), a trunk and a crown
 * each: a pine (a tiered cone) or a broadleaf (a round crown).
 */
export function treeParts(kind: 'pine' | 'broadleaf'): { trunk: MeshData; crown: MeshData } {
  const trunk = new LathePrimitive([[0.6, 1], [1, 0]], 6);
  if (kind === 'pine') {
    const cone = new LathePrimitive([[0, 1], [0.42, 0.68], [0.26, 0.68], [0.72, 0.38], [0.46, 0.38], [1, 0.04], [0, 0]], 8);
    return {
      trunk: mergePlaced(trunk, [{ at: [0, -0.05, 0], scale: [0.13, 0.35, 0.13], turn: 0 }]),
      crown: mergePlaced(cone, [{ at: [0, 0.16, 0], scale: [1, 0.84, 1], turn: 0 }]),
    };
  }
  return {
    trunk: mergePlaced(trunk, [{ at: [0, -0.05, 0], scale: [0.11, 0.47, 0.11], turn: 0 }]),
    crown: mergePlaced(new SpherePrimitive(1, 8, 6), [{ at: [0, 0.64, 0], scale: [1, 0.36, 1], turn: 0 }]),
  };
}

function plainMaterial(r: number, g: number, b: number): LitMaterial {
  const m = new LitMaterial();
  m.color = new Color(r, g, b, 1);
  m.specularStrength = 0.04;
  m.roughness = 0.95;
  return m;
}

/**
 * Pines and broadleaves on layer `grass` (0, the first, by default):
 * broadleaves (in two greens) low down, pines higher up, meeting around 14 m.
 */
export function defaultTrees(grass = 0): VegetationSpecies[] {
  const bark = plainMaterial(0.36, 0.25, 0.16);
  const pine = treeParts('pine'), broad = treeParts('broadleaf');
  return [
    {
      name: 'Pinheiro', layers: [grass], heights: [14, 100000], fade: 10, height: 10, radius: 2.3, trunk: 0.3,
      parts: [{ mesh: pine.trunk, materials: [bark] }, { mesh: pine.crown, materials: [plainMaterial(0.11, 0.27, 0.15)] }],
    },
    {
      name: 'Folhosa', layers: [grass], heights: [-100000, 14], fade: 10, variants: 2, height: 7.5, radius: 3, trunk: 0.33,
      parts: [{ mesh: broad.trunk, materials: [bark] }, { mesh: broad.crown, materials: [plainMaterial(0.24, 0.44, 0.15), plainMaterial(0.33, 0.5, 0.17)] }],
    },
  ];
}

interface ChunkPlants { key: string; items: ScatterItem[]; entities: SceneEntity[] }

/**
 * Put it on the entity with the TerrainBehaviour. It scatters `species` on
 * every chunk and keeps them up to date: a chunk is built again (at most
 * `perFrame` a frame) once its heights or painting change, and not during a
 * stroke unless `holdDuringStrokes` is false.
 */
export class TerrainVegetationBehaviour extends EntityBehaviour {
  protected override _className = 'TerrainVegetationBehaviour';

  static override instanciate(gl: WebGL2RenderingContext): TerrainVegetationBehaviour {
    return new TerrainVegetationBehaviour(gl);
  }

  species: VegetationSpecies[];
  seed = DEFAULT_SCATTER.seed;
  /** 0 none to 1 the most. */
  density = DEFAULT_SCATTER.density;
  /** Metres between candidates. */
  cell = DEFAULT_SCATTER.cell;
  /** The water's level (terrain space) or null: nothing grows under it. */
  water: number | null = null;
  woods = DEFAULT_SCATTER.woods;
  open = DEFAULT_SCATTER.open;
  /** Chunks built a frame (each takes some milliseconds). */
  perFrame = 1;
  /** Waits for a stroke to end before building the chunks it changed. */
  holdDuringStrokes = true;
  castShadows = true;

  private readonly chunks = new Map<string, ChunkPlants>();
  private speciesVersion = 0;
  private readonly cover = new Float32Array(8);

  constructor(public gl: WebGL2RenderingContext, species?: VegetationSpecies[]) {
    super();
    this.species = species ?? defaultTrees();
    this._serializationIgnoreKeys.push('gl', 'species', 'chunks', 'speciesVersion', 'cover');
  }

  /** The terrain beside it. */
  get terrain(): TerrainBehaviour | undefined {
    return this.parent?.getBehaviour(TerrainBehaviour) ?? undefined;
  }

  /** How many plants there are now. */
  get count(): number {
    let n = 0;
    for (const c of this.chunks.values()) n += c.items.length;
    return n;
  }

  /** The plants of a chunk, in terrain space (empty until it is built). */
  itemsOf(cx: number, cz: number): readonly ScatterItem[] {
    return this.chunks.get(TerrainGrid.key(cx, cz))?.items ?? [];
  }

  /** Builds every chunk again on the next frames (after changing the species). */
  rebuild(): void {
    this.speciesVersion++;
  }

  override update(elapsed: number): void {
    super.update(elapsed);
    this.refresh();
  }

  /** Builds the chunks that changed (call it yourself when the entity is not updated). */
  refresh(limit = this.perFrame): void {
    const terrain = this.terrain, scene = this.parent?.scene;
    if (!terrain || !scene) return;
    if (this.holdDuringStrokes && terrain.history.isOpen) return;
    const options: Partial<ScatterOptions> = { seed: this.seed, density: this.density, cell: this.cell, water: this.water, woods: this.woods, open: this.open };
    const numbers = `${this.seed}:${this.density}:${this.cell}:${this.water}:${this.woods}:${this.open}:${this.speciesVersion}`;
    const present = new Set<string>();
    let built = 0;
    for (const c of terrain.grid.all()) {
      const id = TerrainGrid.key(c.cx, c.cz);
      present.add(id);
      const key = `${c.heightVersion}:${c.splatVersion}:${numbers}`;
      const old = this.chunks.get(id);
      if (old?.key === key || built >= limit) continue;
      built++;
      old?.entities.forEach((e) => this.drop(e));
      const items = scatter(terrain.grid, c, this.species, (x, z, out) => terrain.layerWeightsAt(x, z, out), options);
      this.chunks.set(id, { key, items, entities: this.buildMeshes(items, id) });
    }
    for (const [id, c] of this.chunks) {
      if (present.has(id)) continue;
      c.entities.forEach((e) => this.drop(e));
      this.chunks.delete(id);
    }
  }

  /**
   * Pushes a world point out of any trunk it is within `radius` of (for
   * walking among trees). Returns whether it moved.
   */
  pushOut(point: vec3, radius: number): boolean {
    const terrain = this.terrain;
    if (!terrain) return false;
    const local = terrain.toLocal(point);
    const size = terrain.settings.size;
    let moved = false;
    for (let dz = -1; dz <= 1; dz++) {
      for (let dx = -1; dx <= 1; dx++) {
        for (const it of this.itemsOf(Math.floor(local[0] / size) + dx, Math.floor(local[2] / size) + dz)) {
          const trunk = this.species[it.species]?.trunk ?? 0;
          if (trunk <= 0) continue;
          const ox = local[0] - it.x, oz = local[2] - it.z, min = trunk * it.scale + radius;
          const d = Math.hypot(ox, oz);
          if (d >= min || d === 0) continue;
          local[0] += (ox / d) * (min - d);
          local[2] += (oz / d) * (min - d);
          moved = true;
        }
      }
    }
    if (moved) {
      const m = terrain.transform.modelMatrix;
      point[0] = m[0] * local[0] + m[4] * local[1] + m[8] * local[2] + m[12];
      point[2] = m[2] * local[0] + m[6] * local[1] + m[10] * local[2] + m[14];
    }
    return moved;
  }

  override destroy(): void {
    for (const c of this.chunks.values()) c.entities.forEach((e) => this.drop(e));
    this.chunks.clear();
    super.destroy();
  }

  /** One entity per part and look that has plants, children of the terrain's entity. */
  private buildMeshes(items: ScatterItem[], id: string): SceneEntity[] {
    const scene = this.parent?.scene;
    if (!scene || !items.length) return [];
    const groups = new Map<string, { mesh: MeshData; material: LitMaterial; places: MeshPlacement[] }>();
    for (const it of items) {
      const s = this.species[it.species];
      const w = s.radius * it.scale, h = s.height * it.scale;
      s.parts.forEach((p, k) => {
        const material = p.materials[it.variant % p.materials.length];
        const key = `${it.species}:${k}:${p.materials.indexOf(material)}`;
        let g = groups.get(key);
        if (!g) groups.set(key, (g = { mesh: p.mesh, material, places: [] }));
        g.places.push({ at: [it.x, it.y, it.z], scale: [w, h, w], turn: it.turn });
      });
    }
    const entities: SceneEntity[] = [];
    for (const g of groups.values()) {
      const e = new SceneEntity(`Plants ${id}`);
      e.transient = true;
      e.transform.setParent(this.transform);
      const r = new MeshRendererBehaviour(this.gl);
      r.mesh = new Mesh();
      r.mesh.meshData = mergePlaced(g.mesh, g.places);
      r.shader = new LitShader(this.gl, g.material);
      r.castShadows = this.castShadows;
      e.addBehaviour(r);
      scene.addEntity(e);
      entities.push(e);
    }
    return entities;
  }

  private drop(e: SceneEntity): void {
    this.parent?.scene?.removeEntity(e);
    e.transform.setParent(null);
  }
}
