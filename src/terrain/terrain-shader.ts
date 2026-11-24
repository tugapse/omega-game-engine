// The shader of one terrain chunk: terrain.frag over the default vertex
// shader. Every chunk has its own (a shader holds its mesh's buffers), but
// they share one compiled program per context and set of defines. It binds
// the material's texture arrays and the chunk's own splat textures.
import { Camera } from '../entities/camera';
import { ShaderUniformsEnum } from '../enums/shader-uniforms.enum';
import { LitShader } from '../shaders/lit-shader';
import { Shader } from '../shaders/shader';
import { ShaderSources } from '../shaders/shader-sources';
import { TerrainChunkData } from './terrain-data';
import { TerrainMaterial } from './terrain-material';

/** Texture units: the layers' colours and normals, then the two splats. */
export const TERRAIN_UNITS = { albedo: 7, normal: 8, splat0: 9, splat1: 10 };

const programs = new Map<WebGL2RenderingContext, Map<string, Promise<WebGLProgram | null>>>();

export class TerrainShader extends LitShader {
  protected override _className = 'TerrainShader';

  /** World height of the terrain's origin (the height rules count from it). */
  public baseY = 0;

  private splatTextures: [WebGLTexture | null, WebGLTexture | null] = [null, null];
  private splatVersion = -1;

  constructor(gl: WebGL2RenderingContext, public override material: TerrainMaterial, public chunk?: TerrainChunkData) {
    super(gl, material);
    this.fragUri = ShaderSources.frag.terrain;
    this.vertexUri = ShaderSources.vertex.default;
  }

  override async initialize(): Promise<boolean> {
    if (this._initialized) return true;
    this.defines = this.material.triplanar ? ['TRIPLANAR'] : [];
    const key = this.defines.join(',');
    let byKey = programs.get(this.gl);
    if (!byKey) { byKey = new Map(); programs.set(this.gl, byKey); }
    let pending = byKey.get(key);
    if (!pending) {
      pending = super.initialize().then((ok) => (ok ? this._shaderProgram : null));
      byKey.set(key, pending);
      return !!(await pending);
    }
    const program = await pending;
    if (!program) return false;
    this._shaderProgram = program;
    this._initialized = true;
    return true;
  }

  /** Compiles again (after changing `material.triplanar`). */
  override recompile(): void {
    this._initialized = false;
    void this.initialize();
  }

  override loadDataIntoShader(): void {
    if (!this.material || !this._shaderProgram) return;
    Shader.prototype.loadDataIntoShader.call(this);
    const gl = this.gl;
    const m = this.material;
    const prog = this._shaderProgram;
    const loc = (name: string) => gl.getUniformLocation(prog, name);

    const u = m.uniforms();
    gl.uniform1i(loc('u_layerCount'), Math.min(m.layers.length, 8));
    gl.uniform4fv(loc('u_layerTiling'), u.tiling);
    gl.uniform4fv(loc('u_layerHeight'), u.height);
    gl.uniform4fv(loc('u_layerSlope'), u.slope);
    gl.uniform4fv(loc('u_layerTint'), u.tint);
    gl.uniform1f(loc('u_heightBlend'), m.heightBlend);
    gl.uniform1f(loc('u_macroVariation'), m.macroVariation);
    gl.uniform1f(loc('u_terrainBaseY'), this.baseY);
    gl.uniform4fv(loc('u_brush'), m.brush);
    this.setVec3(ShaderUniformsEnum.U_CAMERA_POSITION, Camera.mainCamera.transform.worldPosition);

    const arrays = m.textures(gl);
    arrays.albedo.bind(TERRAIN_UNITS.albedo);
    gl.uniform1i(loc('u_layerAlbedo'), TERRAIN_UNITS.albedo);
    arrays.normal.bind(TERRAIN_UNITS.normal);
    gl.uniform1i(loc('u_layerNormal'), TERRAIN_UNITS.normal);

    this.updateSplat();
    gl.activeTexture(gl.TEXTURE0 + TERRAIN_UNITS.splat0);
    gl.bindTexture(gl.TEXTURE_2D, this.splatTextures[0]);
    gl.uniform1i(loc('u_splat0'), TERRAIN_UNITS.splat0);
    gl.activeTexture(gl.TEXTURE0 + TERRAIN_UNITS.splat1);
    gl.bindTexture(gl.TEXTURE_2D, this.splatTextures[1]);
    gl.uniform1i(loc('u_splat1'), TERRAIN_UNITS.splat1);
  }

  /** Uploads the chunk's splat if it changed (a blank one without a chunk). */
  private updateSplat(): void {
    const gl = this.gl;
    const size = this.chunk?.settings.splatResolution ?? 1;
    if (!this.splatTextures[0]) {
      for (let k = 0; k < 2; k++) {
        const t = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, size, size);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        this.splatTextures[k] = t;
      }
      this.splatVersion = -1;
    }
    const version = this.chunk?.splatVersion ?? 0;
    if (version === this.splatVersion) return;
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    for (let k = 0; k < 2; k++) {
      gl.bindTexture(gl.TEXTURE_2D, this.splatTextures[k]);
      const data = this.chunk ? this.chunk.splat[k] : new Uint8Array(4);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, size, size, gl.RGBA, gl.UNSIGNED_BYTE, data);
    }
    this.splatVersion = version;
  }

  override release(): void {}

  override destroy(): void {
    for (const t of this.splatTextures) if (t) this.gl.deleteTexture(t);
    this.splatTextures = [null, null];
    // The program is shared: only the buffers go.
    this._shaderProgram = undefined as unknown as WebGLProgram;
    super.destroy();
  }
}
