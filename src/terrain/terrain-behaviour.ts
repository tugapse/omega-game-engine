// A terrain on an entity: the grid of chunks, a child entity drawing each one
// (made at run time, never saved), heights and normals in world space, and
// the settings and chunks saved with the scene.
import { mat4, vec3 } from 'gl-matrix';
import { EntityBehaviour } from '../behaviours/entity-behaviour';
import { SceneEntity } from '../entities/entity';
import { JsonSerializedData } from '../interfaces/json-serialized-data';
import { ColliderBehaviour } from '../physics/collider-behaviour';
import { PhysicsWorld } from '../physics/physics-world';
import { Shader } from '../shaders/shader';
import { decodeHeights, DEFAULT_TERRAIN_SETTINGS, encodeHeights, TerrainChunkData, TerrainGrid, TerrainSettings } from './terrain-data';
import { BrushSettings, clearSplat, fillSplat, paint, sculpt, SculptTool, TerrainHistory, touchAround } from './terrain-brush';
import { TerrainChunkRenderer } from './terrain-chunk-renderer';
import { erode, EROSION } from './terrain-erosion';
import { fillChunk } from './terrain-grow';
import { ramp, stamp, StampShape, terrace } from './terrain-shapes';
import { ruleNoise, terrainAutoWeights } from './terrain-rules';
import { TerrainMaterial } from './terrain-material';
import { TerrainShader } from './terrain-shader';

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
  /** The material every chunk is drawn with: its layers, rules and blending. */
  public material: TerrainMaterial;
  /** Distances (m) at which chunks drop to levels of detail 1, 2 and 3, as multiples of a chunk's size. */
  public lodDistances: number[] = [1, 2, 4];
  /** Multiplies the level-of-detail distances (lower on slow devices). */
  public lodBias = 1;
  /** Whether the chunks cast shadows. */
  public castShadows = true;
  /**
   * Gives each chunk a heightfield collider in PhysicsWorld.main (when there
   * is one), made again once a stroke ends.
   */
  public colliders = true;
  /** Friction of the ground's colliders. */
  public friction = 0.8;

  /** Undo and redo of brush strokes. */
  public readonly history = new TerrainHistory();

  private readonly chunkEntities = new Map<string, SceneEntity>();
  private readonly colliderVersions = new Map<SceneEntity, number>();
  private pending: SavedTerrainChunk[] | null = null;

  constructor(public gl: WebGL2RenderingContext, settings: TerrainSettings = { ...DEFAULT_TERRAIN_SETTINGS }) {
    super();
    this.grid = new TerrainGrid(settings);
    this.material = new TerrainMaterial();
    this._serializationIgnoreKeys.push('gl', 'grid', 'material', 'chunkEntities', 'pending', 'history', 'colliderVersions');
  }

  get settings(): TerrainSettings {
    return this.grid.settings;
  }

  override initialize(): boolean {
    // A new terrain (not loaded) starts with one flat chunk.
    if (!this.pending && this.grid.count === 0) this.grid.add(0, 0);
    const ok = super.initialize();
    this.sync();
    return ok;
  }

  override update(elapsed: number): void {
    super.update(elapsed);
    this.sync();
    this.refreshColliders();
  }

  /**
   * Makes each chunk's collider again if its heights changed (not during a
   * stroke: once it ends). Called every update; call it yourself after
   * changing heights when the terrain is not updated.
   */
  refreshColliders(force = false): void {
    const world = PhysicsWorld.main;
    if (!this.colliders || !world || (this.history.isOpen && !force)) return;
    const n = this.settings.resolution, size = this.settings.size;
    for (const [key, e] of this.chunkEntities) {
      const [cx, cz] = key.split(',').map(Number);
      const c = this.grid.get(cx, cz);
      if (!c || (!force && this.colliderVersions.get(e) === c.heightVersion)) continue;
      const old = e.getBehaviour(ColliderBehaviour);
      if (old) e.removeBehaviour(old);
      const col = new ColliderBehaviour({ type: 'heightfield', rows: n, cols: n, heights: c.heights.slice(), size: [size, size] });
      col.offset = [size / 2, 0, size / 2];
      col.friction = this.friction;
      e.addBehaviour(col);
      this.colliderVersions.set(e, c.heightVersion);
    }
  }

  /** Makes the shader for one chunk. */
  protected createShader(chunk: TerrainChunkData): Shader {
    return new TerrainShader(this.gl, this.material, chunk);
  }

  /**
   * Compiles the chunks' shaders again, after changing `material.triplanar`.
   */
  recompile(): void {
    for (const e of this.chunkEntities.values()) e.getBehaviour(TerrainChunkRenderer)?.shader?.recompile();
  }

  /** Adds a chunk at a grid cell (joined to its neighbours) and its entity. */
  addChunk(cx: number, cz: number, height = 0): TerrainChunkData {
    const c = this.grid.add(cx, cz, height);
    this.sync();
    return c;
  }

  /**
   * Adds a chunk at a free cell and fills it from `height` (terrain-space x, z
   * → height, such as a `heightField`), bent within `blend` metres of the
   * borders it shares so it meets the ground there exactly. Not undone.
   */
  growChunk(cx: number, cz: number, height: (x: number, z: number) => number, blend = 32): TerrainChunkData {
    if (this.grid.get(cx, cz)) throw new Error(`there is a chunk at ${cx},${cz} already`);
    this.grid.add(cx, cz);
    const c = fillChunk(this.grid, cx, cz, height, blend);
    const n = this.settings.resolution;
    touchAround(this.grid, { i0: cx * n, j0: cz * n, i1: (cx + 1) * n, j1: (cz + 1) * n });
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

  // ---- Editing (world space) ----

  /** Starts a brush stroke (one undo step): 'heights' to sculpt, 'splat' to paint. */
  beginStroke(kind: 'heights' | 'splat'): void {
    this.history.begin(kind);
  }

  endStroke(): void {
    this.history.end();
  }

  /** One step of a sculpting tool at a world point. `target` is the world height `flatten` pulls to. */
  sculptAt(tool: SculptTool, point: vec3, brush: BrushSettings, dt: number, target?: number): boolean {
    const local = this.toLocal(point);
    const scale = this.transform.worldScale?.[0] || 1;
    const b = { ...brush, radius: brush.radius / scale };
    this.history.saveAround(this.grid, local[0], local[2], b.radius);
    const t = target === undefined ? 0 : this.toLocal(vec3.fromValues(point[0], target, point[2]))[1];
    return !!sculpt(this.grid, tool, local[0], local[2], b, dt, t);
  }

  /** One step of painting a layer (or erasing the painting) at a world point. */
  paintAt(layer: number, point: vec3, brush: BrushSettings, dt: number, erase = false): boolean {
    const local = this.toLocal(point);
    const scale = this.transform.worldScale?.[0] || 1;
    const b = { ...brush, radius: brush.radius / scale };
    this.history.saveAround(this.grid, local[0], local[2], b.radius);
    return paint(this.grid, layer, local[0], local[2], b, dt, erase).length > 0;
  }

  /** One step of the terrace brush at a world point: flat steps `step` metres apart (world). */
  terraceAt(point: vec3, brush: BrushSettings, dt: number, step: number): boolean {
    const local = this.toLocal(point);
    const scale = this.transform.worldScale?.[0] || 1;
    const b = { ...brush, radius: brush.radius / scale };
    this.history.saveAround(this.grid, local[0], local[2], b.radius);
    return !!terrace(this.grid, local[0], local[2], b, dt, step / (this.transform.worldScale?.[1] || 1));
  }

  /**
   * One step of erosion at a world point: about `EROSION.rate` drops a second
   * for a 14 m brush (as many more as its area is larger), at most
   * `EROSION.maxDrops` a step. `random` gives 0 to 1 (seeded for tests).
   */
  erodeAt(point: vec3, brush: BrushSettings, dt: number, random: () => number = Math.random): boolean {
    const local = this.toLocal(point);
    const scale = this.transform.worldScale?.[0] || 1;
    const b = { ...brush, radius: brush.radius / scale };
    // Drops run up to 1.5 radii out: the chunks there are saved too.
    this.history.saveAround(this.grid, local[0], local[2], b.radius * 1.6);
    const drops = Math.min(EROSION.maxDrops, Math.round(EROSION.rate * dt * (brush.radius / 14) ** 2));
    return !!erode(this.grid, local[0], local[2], b, drops, random);
  }

  /**
   * A stamp of `radius` and `height` (negative digs it in) at a world point,
   * as one undo step (or within the stroke already open).
   */
  stampAt(shape: StampShape, point: vec3, radius: number, height: number): boolean {
    const local = this.toLocal(point);
    const r = radius / (this.transform.worldScale?.[0] || 1);
    return this.oneStep(() => {
      this.history.saveAround(this.grid, local[0], local[2], r);
      return !!stamp(this.grid, shape, local[0], local[2], r, height / (this.transform.worldScale?.[1] || 1));
    });
  }

  /**
   * A straight ramp between two world points, each at its own height: `width`
   * (world) either side of the line, its edges as soft as `hardness` leaves
   * them, as one undo step (or within the stroke already open).
   */
  rampAt(from: vec3, to: vec3, width: number, hardness: number): boolean {
    const a = this.toLocal(from), b = this.toLocal(to);
    const w = width / (this.transform.worldScale?.[0] || 1);
    const size = this.settings.size, pad = w + size / this.settings.resolution;
    return this.oneStep(() => {
      for (const c of this.grid.all()) {
        if (Math.max(a[0], b[0]) + pad < c.originX || Math.min(a[0], b[0]) - pad > c.originX + size) continue;
        if (Math.max(a[2], b[2]) + pad < c.originZ || Math.min(a[2], b[2]) - pad > c.originZ + size) continue;
        this.history.save(c);
      }
      return !!ramp(this.grid, { x: a[0], z: a[2], h: a[1] }, { x: b[0], z: b[2], h: b[1] }, w, hardness);
    });
  }

  /** Runs an edit as its own undo step, or inside the stroke already open. */
  private oneStep(edit: () => boolean): boolean {
    if (this.history.isOpen) return edit();
    this.history.begin('heights');
    const done = edit();
    this.history.end();
    return done;
  }

  undo(): boolean { return this.history.undo(this.grid); }
  redo(): boolean { return this.history.redo(this.grid); }

  /**
   * "Apply the rules": writes what the rules give into the painting, so it
   * can be touched up by hand from there (one undo step).
   */
  bakeRules(): void {
    const m = this.transform.modelMatrix;
    const layers = this.material.layers;
    const nrm = vec3.create(), world = vec3.create();
    this.history.begin('splat');
    for (const c of this.grid.all()) this.history.save(c);
    fillSplat(this.grid, (x, z, out) => {
      const h = this.grid.heightAt(x, z) ?? 0;
      this.grid.normalAt(x, z, nrm);
      const slope = Math.acos(Math.min(Math.max(nrm[1], 0), 1)) * 180 / Math.PI;
      vec3.transformMat4(world, vec3.fromValues(x, h, z), m);
      return terrainAutoWeights(layers, world[1] - m[13], slope, ruleNoise(world[0], world[1], world[2]), out);
    });
    this.history.end();
  }

  /** Clears the painting, back to the rules (one undo step). */
  clearPainting(): void {
    this.history.begin('splat');
    for (const c of this.grid.all()) this.history.save(c);
    clearSplat(this.grid);
    this.history.end();
  }

  /** Shows the brush on the ground at a world point (or hides it with null). */
  showBrush(point: vec3 | null, radius = 0): void {
    this.material.brush = point ? [point[0], point[2], radius, 1] : [0, 0, 0, 0];
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
      r.shader = this.createShader(c);
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
      this.colliderVersions.delete(e);
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
    this.colliderVersions.clear();
    super.destroy();
  }

  // ---- Saving ----

  /** The chunks as saved data. */
  saveChunks(): SavedTerrainChunk[] {
    return this.grid.all().map((c) => ({
      cx: c.cx,
      cz: c.cz,
      heights: toBase64(new Uint8Array(encodeHeights(c.heights, this.settings.heightRange).buffer)),
      // Unpainted chunks (most) keep no splat.
      splat: c.splat[0].some((v) => v) || c.splat[1].some((v) => v) ? [toBase64(c.splat[0]), toBase64(c.splat[1])] : undefined,
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
    if (material) void this.material.fromJson(material);
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
