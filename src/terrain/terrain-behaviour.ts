// A terrain on an entity: the grid of chunks, a child entity drawing each one
// (made at run time, never saved), heights and normals in world space, and
// the settings and chunks saved with the scene.
import { mat4, vec3 } from 'gl-matrix';
import { EntityBehaviour } from '../behaviours/entity-behaviour';
import { SceneEntity } from '../entities/entity';
import { JsonSerializedData } from '../interfaces/json-serialized-data';
import { ColorMaterial } from '../materials/color-material';
import { LitMaterial } from '../materials/lit-material';
import { LitShader } from '../shaders/lit-shader';
import { Shader } from '../shaders/shader';
import { decodeHeights, DEFAULT_TERRAIN_SETTINGS, encodeHeights, TerrainChunkData, TerrainGrid, TerrainSettings } from './terrain-data';
import { TerrainChunkRenderer } from './terrain-chunk-renderer';

/** A chunk as saved: its cell and its data in base64 (16-bit heights, RGBA splats). */
export interface SavedTerrainChunk {
  cx: number;
  cz: number;
  heights: string;
  splat?: [string, string];
}

export class TerrainBehaviour extends EntityBehaviour {
  protected override _className = 'TerrainBehaviour';

  static override instanciate(gl: WebGL2RenderingContext): TerrainBehaviour {
    return new TerrainBehaviour(gl);
  }

  public grid: TerrainGrid;
  /**
   * The material every chunk is drawn with. Until the terrain material (phase
   * 2) it is a lit colour.
   */
  public material: ColorMaterial;
  /** Distances (m) at which chunks drop to levels of detail 1, 2 and 3, as multiples of a chunk's size. */
  public lodDistances: number[] = [1, 2, 4];
  /** Multiplies the level-of-detail distances (lower on slow devices). */
  public lodBias = 1;
  /** Whether the chunks cast shadows. */
  public castShadows = true;

  private readonly chunkEntities = new Map<string, SceneEntity>();
  private pending: SavedTerrainChunk[] | null = null;

  constructor(public gl: WebGL2RenderingContext, settings: TerrainSettings = { ...DEFAULT_TERRAIN_SETTINGS }) {
    super();
    this.grid = new TerrainGrid(settings);
    const m = new LitMaterial();
    m.specularStrength = 0.05;
    m.roughness = 0.9;
    this.material = m;
    this._serializationIgnoreKeys.push('gl', 'grid', 'material', 'chunkEntities', 'pending');
  }

  get settings(): TerrainSettings {
    return this.grid.settings;
  }

  override initialize(): boolean {
    const ok = super.initialize();
    this.sync();
    return ok;
  }

  override update(elapsed: number): void {
    super.update(elapsed);
    this.sync();
  }

  /** Makes the shader for one chunk (the terrain material overrides this in phase 2). */
  protected createShader(): Shader {
    return new LitShader(this.gl, this.material as LitMaterial);
  }

  /** Adds a chunk at a grid cell (joined to its neighbours) and its entity. */
  addChunk(cx: number, cz: number, height = 0): TerrainChunkData {
    const c = this.grid.add(cx, cz, height);
    this.sync();
    return c;
  }

  removeChunk(cx: number, cz: number): void {
    this.grid.remove(cx, cz);
    this.sync();
  }

  /** The renderer of a chunk, once its entity exists. */
  rendererOf(cx: number, cz: number): TerrainChunkRenderer | undefined {
    return this.chunkEntities.get(TerrainGrid.key(cx, cz))?.getBehaviour(TerrainChunkRenderer);
  }

  /** Redraws every chunk now (after writing heights directly). */
  refreshAll(): void {
    for (const e of this.chunkEntities.values()) e.getBehaviour(TerrainChunkRenderer)?.refresh(true);
  }

  // ---- World space ----

  /** A world point in the terrain's own space. */
  toLocal(point: vec3, out = vec3.create()): vec3 {
    const inv = mat4.invert(mat4.create(), this.transform.modelMatrix);
    return vec3.transformMat4(out, point, inv ?? mat4.create());
  }

  /** The world height of the ground under world (x, z), or undefined off the terrain. */
  heightAt(x: number, z: number): number | undefined {
    const m = this.transform.modelMatrix;
    const local = this.toLocal(vec3.fromValues(x, m[13], z));
    const h = this.grid.heightAt(local[0], local[2]);
    if (h === undefined) return undefined;
    return vec3.transformMat4(vec3.create(), vec3.fromValues(local[0], h, local[2]), m)[1];
  }

  /** The world normal of the ground under world (x, z). */
  normalAt(x: number, z: number, out = vec3.create()): vec3 | undefined {
    const m = this.transform.modelMatrix;
    const local = this.toLocal(vec3.fromValues(x, m[13], z));
    const n = this.grid.normalAt(local[0], local[2], out);
    if (!n) return undefined;
    const normalMatrix = mat4.transpose(mat4.create(), mat4.invert(mat4.create(), m) ?? mat4.create());
    vec3.transformMat4(n, n, mat4.fromValues(
      normalMatrix[0], normalMatrix[1], normalMatrix[2], 0, normalMatrix[4], normalMatrix[5], normalMatrix[6], 0,
      normalMatrix[8], normalMatrix[9], normalMatrix[10], 0, 0, 0, 0, 1));
    return vec3.normalize(n, n);
  }

  /**
   * Where a world ray first meets the ground, by stepping along it and then
   * halving the step (for the brush and picking). Undefined if it misses
   * within `maxDistance` m.
   */
  raycast(origin: vec3, direction: vec3, maxDistance = 2000): vec3 | undefined {
    const dir = vec3.normalize(vec3.create(), direction);
    const step = Math.max(this.settings.size / this.settings.resolution, 0.25);
    const p = vec3.create();
    const above = (t: number) => {
      vec3.scaleAndAdd(p, origin, dir, t);
      const h = this.heightAt(p[0], p[2]);
      return h === undefined ? undefined : p[1] - h;
    };
    let prevT = 0;
    let prev = above(0);
    for (let t = step; t <= maxDistance; t += step) {
      const d = above(t);
      if (d !== undefined && prev !== undefined && d <= 0 && prev > 0) {
        let lo = prevT, hi = t;
        for (let k = 0; k < 20; k++) {
          const mid = (lo + hi) / 2;
          const dm = above(mid);
          if (dm !== undefined && dm > 0) lo = mid; else hi = mid;
        }
        return vec3.scaleAndAdd(vec3.create(), origin, dir, hi);
      }
      if (d !== undefined) { prev = d; prevT = t; } else if (prev !== undefined && prev <= 0) prev = undefined;
    }
    return undefined;
  }

  // ---- Chunk entities ----

  /** Makes or removes chunk entities to match the grid, once the terrain is in a scene. */
  sync(): void {
    const scene = this.parent?.scene;
    if (!scene) return;
    if (this.pending) {
      const saved = this.pending;
      this.pending = null;
      this.loadChunks(saved);
    }
    const n = this.settings.size;
    for (const c of this.grid.all()) {
      const key = TerrainGrid.key(c.cx, c.cz);
      if (this.chunkEntities.has(key)) continue;
      const e = new SceneEntity(`Terrain ${key}`);
      e.transient = true;
      e.transform.setParent(this.transform);
      e.transform.setLocalPosition(c.cx * n, 0, c.cz * n);
      const r = new TerrainChunkRenderer(this.gl, this.grid, c);
      r.shader = this.createShader();
      r.castShadows = this.castShadows;
      this.applyLod(r);
      e.addBehaviour(r);
      scene.addEntity(e);
      this.chunkEntities.set(key, e);
    }
    for (const [key, e] of [...this.chunkEntities]) {
      const [cx, cz] = key.split(',').map(Number);
      if (this.grid.get(cx, cz)) continue;
      scene.removeEntity(e);
      e.transform.setParent(null);
      this.chunkEntities.delete(key);
    }
  }

  /** Applies lodDistances × lodBias to every chunk. */
  applyLod(only?: TerrainChunkRenderer): void {
    const d = this.lodDistances.map((k) => k * this.settings.size * this.lodBias);
    const set = (r: TerrainChunkRenderer) => { r.lodDistances = d; };
    if (only) set(only);
    else for (const e of this.chunkEntities.values()) { const r = e.getBehaviour(TerrainChunkRenderer); if (r) set(r); }
  }

  override destroy(): void {
    const scene = this.parent?.scene;
    for (const e of this.chunkEntities.values()) {
      scene?.removeEntity(e);
      e.transform.setParent(null);
    }
    this.chunkEntities.clear();
    super.destroy();
  }

  // ---- Saving ----

  /** The chunks as saved data. */
  saveChunks(): SavedTerrainChunk[] {
    return this.grid.all().map((c) => ({
      cx: c.cx,
      cz: c.cz,
      heights: toBase64(new Uint8Array(encodeHeights(c.heights, this.settings.heightRange).buffer)),
      splat: [toBase64(c.splat[0]), toBase64(c.splat[1])],
    }));
  }

  /** Replaces the grid's chunks with saved ones. */
  loadChunks(saved: SavedTerrainChunk[]): void {
    for (const c of this.grid.all()) this.grid.remove(c.cx, c.cz);
    for (const s of saved) {
      const c = this.grid.add(s.cx, s.cz);
      const bytes = fromBase64(s.heights);
      decodeHeights(new Uint16Array(bytes.buffer, bytes.byteOffset, bytes.byteLength / 2), this.settings.heightRange, c.heights);
      if (s.splat) {
        c.splat[0].set(fromBase64(s.splat[0]).subarray(0, c.splat[0].length));
        c.splat[1].set(fromBase64(s.splat[1]).subarray(0, c.splat[1].length));
      }
      c.heightVersion++;
      c.splatVersion++;
    }
  }

  override toJsonObject(): JsonSerializedData {
    return {
      ...this.serializeAutomatically(),
      settings: { ...this.settings },
      material: this.material.toJsonObject(),
      chunks: this.saveChunks(),
    };
  }

  override fromJson(jsonObject: JsonSerializedData): void {
    super.fromJson(jsonObject);
    const { settings, material, chunks, ...rest } = jsonObject as any;
    this.deserializeAutomatically(rest);
    if (settings) this.grid = new TerrainGrid({ ...DEFAULT_TERRAIN_SETTINGS, ...settings });
    if (material) this.material.fromJson(material);
    if (chunks) this.pending = chunks;
  }
}

function toBase64(bytes: Uint8Array): string {
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}

function fromBase64(text: string): Uint8Array {
  const s = atob(text);
  const out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
  return out;
}
