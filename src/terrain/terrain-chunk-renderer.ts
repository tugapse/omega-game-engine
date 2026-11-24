// Draws one terrain chunk. Its vertex buffers are written straight from the
// chunk's heights (no MeshData), again whenever the heights change, and it has
// one index buffer per level of detail, picked before each frame by the
// camera's distance. The shadow pass draws the same buffers and count.
import { vec3 } from 'gl-matrix';
import { MeshRendererBehaviour } from '../behaviours/renderer/mesh-renderer-behaviour';
import { MeshData } from '../core/mesh';
import { Sphere } from '../core/render/culling';
import { Camera } from '../entities/camera';
import { TerrainChunkData, TerrainGrid } from './terrain-data';
import { chooseLod, chunkIndices, chunkVertexCount, fillChunkVertices, TERRAIN_LODS } from './terrain-mesh';

export class TerrainChunkRenderer extends MeshRendererBehaviour {
  protected override _className = 'TerrainChunkRenderer';

  /** Distances (m) up to which levels 0, 1, 2 are drawn; level 3 beyond. */
  public lodDistances: number[] = [128, 256, 512];
  /** How far the skirt hangs below the border (m). */
  public skirtDepth = 4;
  /** The level of detail drawn this frame. */
  public lod = 0;

  private positions: Float32Array;
  private normals: Float32Array;
  private uvs: Float32Array;
  private lodBuffers: (WebGLBuffer | null)[] = [];
  private lodCounts: number[] = [];
  private builtVersion = -1;
  private version = 0;
  private bounds: [number, number] = [0, 0];

  constructor(gl: WebGL2RenderingContext, public readonly grid: TerrainGrid, public readonly chunk: TerrainChunkData) {
    super(gl);
    const count = chunkVertexCount(chunk.resolution);
    this.positions = new Float32Array(count * 3);
    this.normals = new Float32Array(count * 3);
    this.uvs = new Float32Array(count * 2);
    // Only the index list's length is read from the mesh data (not saved).
    this.mesh.meshData = new MeshData([], [], [], []);
  }

  override get serializesMesh(): boolean {
    return false;
  }

  override get indexCount(): number {
    return this.lodCounts[this.lod] ?? 0;
  }

  override get deformationVersion(): number {
    return this.version;
  }

  protected override initializeShader(): void {
    if (!this.shader) return;
    const gl = this._gl;
    void this.shader.initialize();
    const b = this.shader.buffers;
    b.position = gl.createBuffer();
    b.normal = gl.createBuffer();
    b.uv = gl.createBuffer();
    b.tangent = null;
    b.bitangent = null;
    this.lodBuffers = [];
    this.lodCounts = [];
    for (let l = 0; l < TERRAIN_LODS; l++) {
      const idx = chunkIndices(this.chunk.resolution, l);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buf);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);
      this.lodBuffers.push(buf);
      this.lodCounts.push(idx.length);
    }
    b.indices = this.lodBuffers[0];
    this.shader.indexType = gl.UNSIGNED_INT;
    this.builtVersion = -1;
    this.refresh();
  }

  /** Rewrites the vertex buffers if the chunk's heights changed since the last time. */
  public refresh(force = false): void {
    if (!this.shader || (!force && this.builtVersion === this.chunk.heightVersion)) return;
    const gl = this._gl;
    fillChunkVertices(this.grid, this.chunk, this.skirtDepth, this.positions, this.normals, this.uvs);
    const b = this.shader.buffers;
    const upload = (buf: WebGLBuffer | null, data: Float32Array) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
    };
    upload(b.position, this.positions);
    upload(b.normal, this.normals);
    upload(b.uv, this.uvs);
    this.bounds = this.chunk.heightBounds();
    this.builtVersion = this.chunk.heightVersion;
    this.version++;
  }

  override beforeRender(): void {
    this.refresh();
    if (!this.shader || !this.parent) return;
    const lod = chooseLod(this.distanceTo(Camera.mainCamera?.transform.worldPosition), this.lodDistances);
    if (lod !== this.lod) {
      this.lod = lod;
      this.version++;
    }
    this.shader.buffers.indices = this.lodBuffers[this.lod] ?? null;
  }

  /** Metres from a world point to the nearest point of the chunk's box. */
  public distanceTo(point: vec3 | undefined): number {
    if (!point || !this.parent) return 0;
    const m = this.parent.transform.modelMatrix;
    const size = this.chunk.size;
    // The box in world space, assuming the terrain is not rotated (scale and
    // translation only): good enough to pick a level of detail.
    const x0 = m[12], y0 = m[13] + this.bounds[0] * m[5], z0 = m[14];
    const x1 = x0 + size * m[0], y1 = m[13] + this.bounds[1] * m[5], z1 = z0 + size * m[10];
    const dx = Math.max(Math.min(x0, x1) - point[0], 0, point[0] - Math.max(x0, x1));
    const dy = Math.max(Math.min(y0, y1) - point[1], 0, point[1] - Math.max(y0, y1));
    const dz = Math.max(Math.min(z0, z1) - point[2], 0, point[2] - Math.max(z0, z1));
    return Math.hypot(dx, dy, dz);
  }

  override worldBounds(out: Sphere): boolean {
    if (!this.parent) return false;
    const [lo, hi] = this.bounds;
    const half = this.chunk.size / 2;
    const local = vec3.fromValues(half, (lo + hi) / 2, half);
    const m = this.parent.transform.modelMatrix;
    vec3.transformMat4(out.center, local, m);
    const scale = Math.max(Math.hypot(m[0], m[1], m[2]), Math.hypot(m[4], m[5], m[6]), Math.hypot(m[8], m[9], m[10]));
    out.radius = Math.hypot(half, (hi - lo) / 2 + this.skirtDepth, half) * scale;
    return true;
  }

  override destroy(): void {
    super.destroy();
    for (const b of this.lodBuffers) if (b) this._gl.deleteBuffer(b);
    if (this.shader) {
      const b = this.shader.buffers;
      for (const buf of [b.position, b.normal, b.uv]) if (buf) this._gl.deleteBuffer(buf);
      b.position = b.normal = b.uv = b.indices = null;
    }
    this.lodBuffers = [];
  }
}
