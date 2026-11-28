import { bindInstances, INSTANCE_FLOATS, instanceBounds, unbindInstances } from '../../core/render/instancing';
import { localBoundingSphere, Sphere, transformSphere, createSphere } from '../../core/render/culling';
import { MeshRendererBehaviour } from './mesh-renderer-behaviour';

/**
 * A mesh drawn many times in one call: each instance has a place, a turn
 * about y, width and height scales, a tint and a phase (`packInstance`).
 * Set them with `setInstances`; `drawCount` draws only the first ones (put
 * the instances in a random order and fewer of them thin out evenly).
 * `wind` sways the mesh by the square of its uv's v (0 at the foot, 1 at the
 * top), and `tipShade` darkens it towards the foot (grass). Both are fixed
 * once the renderer is initialised.
 */
export class InstancedMeshRendererBehaviour extends MeshRendererBehaviour {
  protected override _className = 'InstancedMeshRendererBehaviour';

  /** Direction (x, z), strength (m at the top) and speed, or null for none. */
  wind: [number, number, number, number] | null = null;
  /** 0 to 1: how much darker the foot is than the top; 0 for none. */
  tipShade = 0;
  /** With `tipShade`: a colour the top turns towards (r, g, b, how much 0 to 1), or null. */
  tipColor: [number, number, number, number] | null = null;
  /** How many instances to draw (all when null). */
  drawCount: number | null = null;

  private data: Float32Array = new Float32Array(0);
  private total = 0;
  private buffer: WebGLBuffer | null = null;
  private uploaded = -1;
  private version = 0;
  private readonly localBounds = createSphere();
  private hasBounds = false;

  constructor(gl: WebGL2RenderingContext) {
    super(gl);
    this._serializationIgnoreKeys.push('data', 'buffer', 'uploaded', 'localBounds');
  }

  /** The instances, `INSTANCE_FLOATS` (8) floats each; kept, not copied. */
  setInstances(data: Float32Array, count = Math.floor(data.length / INSTANCE_FLOATS)): void {
    this.data = data;
    this.total = Math.min(count, Math.floor(data.length / INSTANCE_FLOATS));
    this.version++;
    const mesh = localBoundingSphere(this.mesh?.meshData);
    this.hasBounds = !!mesh && instanceBounds(this.localBounds, data, this.total, mesh);
  }

  get instanceTotal(): number { return this.total; }

  /** How many are drawn now. */
  get instancesDrawn(): number { return Math.max(0, Math.min(this.drawCount ?? this.total, this.total)); }

  override get deformationVersion(): number { return this.version; }

  /** The buffer and how many instances to draw, for passes that draw it themselves (shadows). */
  override get instancing(): { buffer: WebGLBuffer; count: number } | null {
    const buffer = this.upload();
    return buffer ? { buffer, count: this.instancesDrawn } : null;
  }

  override worldBounds(out: Sphere): boolean {
    if (!this.hasBounds || !this.parent) return false;
    transformSphere(out, this.localBounds, this.parent.transform.modelMatrix);
    return true;
  }

  protected override initializeShader(): void {
    if (this.shader) {
      const add = (d: string) => { if (!this.shader!.defines.includes(d)) this.shader!.defines.push(d); };
      add('INSTANCED');
      if (this.wind) add('WIND');
      if (this.tipShade > 0) add('GRASS');
    }
    super.initializeShader();
  }

  protected override issueDraw(): void {
    const shader = this.shader, count = this.instancesDrawn, buffer = this.upload(), program = shader?._shaderProgram;
    if (!shader || !count || !buffer || !program) return;
    if (this.wind) shader.setVec4('u_wind', this.wind);
    if (this.tipShade > 0) {
      shader.setFloat('u_tipShade', this.tipShade);
      shader.setVec4('u_tipColor', this.tipColor ?? [0, 0, 0, 0]);
    }
    const locations = bindInstances(this._gl, program, buffer);
    this._gl.drawElementsInstanced(this.drawPrimitiveType, this.indexCount, shader.indexType, 0, count);
    unbindInstances(this._gl, locations);
  }

  override destroy(): void {
    if (this.buffer) this._gl.deleteBuffer(this.buffer);
    this.buffer = null;
    super.destroy();
  }

  /** Sends the instances to the GPU when they changed; the buffer, or null with none. */
  private upload(): WebGLBuffer | null {
    if (!this.total) return null;
    const gl = this._gl;
    if (!this.buffer) this.buffer = gl.createBuffer();
    if (this.uploaded !== this.version) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.data.subarray(0, this.total * INSTANCE_FLOATS) as Float32Array<ArrayBuffer>, gl.DYNAMIC_DRAW);
      this.uploaded = this.version;
    }
    return this.buffer;
  }
}
