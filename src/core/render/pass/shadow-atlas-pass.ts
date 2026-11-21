import { mat4 } from "gl-matrix";
import { RendererBehaviour } from "../../../behaviours";
import { SceneEntity } from "../../../entities";
import { ShaderUniformsEnum } from "../../../enums";
import { EMBEDDED_SHADERS } from "../../../shaders/embedded-shaders";
import { Shader } from "../../../shaders/shader";
import { ShaderSources } from "../../../shaders/shader-sources";
import { RenderTarget } from "../render-target";
import { MAX_SHADOW_VIEWS, packShadows, SHADOW_ATLAS_SIZE, ShadowFilter, SHADOWS_LAYOUT, ShadowPlan } from "../shadows";
import { createSphere, frustumPlanes, Sphere, sphereInFrustum } from "../culling";
import { Light } from "../../../entities/lights/light";

/** Uniform block binding point of `ShadowsBlock`. */
export const SHADOWS_BINDING_POINT = 2;
/** Texture unit the lit shader samples the atlas from (`u_shadowAtlasMap`). */
export const SHADOW_ATLAS_UNIT = 2;
/** Texture unit of a skinned mesh's joint matrices (`u_jointTexture`). */
export const JOINT_TEXTURE_UNIT = 7;

/** What a caster looked like when the atlas was last drawn. */
interface CasterState {
  matrix: Float32Array;
  version: number;
  buffer: WebGLBuffer | null;
  bounds: Sphere;
  hasBounds: boolean;
  seen: number;
}

/** What one atlas view holds. */
interface CachedView {
  light: Light;
  matrix: Float32Array;
}

/** What the shadow pass did this frame (every camera), for profiling overlays. */
export interface ShadowStats {
  /** Views used, summed over the cameras drawn this frame. */
  views: number;
  /** Views redrawn (the others kept the depth they had). */
  redrawn: number;
  /** Caster draw calls this frame. */
  draws: number;
}

/** A shadow-caster program and its locations. */
interface CasterProgram {
  program: WebGLProgram;
  position: number;
  matrix: WebGLUniformLocation | null;
  jointTexture: WebGLUniformLocation | null;
}

/**
 * Draws the depth of every planned shadow view into one atlas (4096² by
 * default) and uploads the views (matrices, rectangles, biases) to ShadowsBlock.
 *
 * Views are cached: a view is redrawn only when its light matrix changed or a
 * caster inside it moved, posed, appeared or disappeared. Each view draws only
 * the casters whose bounds reach into it.
 */
export class ShadowAtlasPass {
  readonly name = "ShadowAtlasPass";
  /** Strength of all shadows; shared with the pipeline settings (the editor's sun animates it). */
  public enabled = true;

  private atlas: RenderTarget;
  private plain: CasterProgram;
  /** The same program with `SKINNED`, for skinned meshes. */
  private skinned: CasterProgram;
  private ubo: WebGLBuffer;
  private uboData = new Float32Array(SHADOWS_LAYOUT.slots * 4);
  /** PCF taps the lit shader takes per shadow lookup. */
  public filter = ShadowFilter.Softer;
  /** False to redraw every view every frame (no cache). */
  public cacheViews = true;
  public readonly stats: ShadowStats = { views: 0, redrawn: 0, draws: 0 };

  private cache: (CachedView | null)[] = [];
  private casters = new Map<SceneEntity, CasterState>();
  private frame = 0;
  private readonly planes = new Float32Array(24);
  private readonly bounds = createSphere();

  constructor(private gl: WebGL2RenderingContext) {
    this.atlas = this.createAtlas(SHADOW_ATLAS_SIZE);

    this.plain = ShadowAtlasPass.casterProgram(gl, []);
    this.skinned = ShadowAtlasPass.casterProgram(gl, ['SKINNED']);

    this.ubo = gl.createBuffer()!;
    gl.bindBuffer(gl.UNIFORM_BUFFER, this.ubo);
    gl.bufferData(gl.UNIFORM_BUFFER, this.uboData.byteLength, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.UNIFORM_BUFFER, null);
  }

  /** The atlas depth texture (comparison sampler). */
  get atlasTexture(): WebGLTexture | null {
    return this.atlas.depthTexture;
  }

  /** Side of the atlas in pixels. */
  get atlasSize(): number {
    return this.atlas.width;
  }

  /** Zeroes `stats`; the pipeline calls it at the start of each frame. */
  resetStats(): void {
    this.stats.views = this.stats.redrawn = this.stats.draws = 0;
  }

  /** Forgets every cached view: the next frame redraws them all. */
  invalidate(): void {
    this.cache = [];
  }

  /** Renders the plan's views that changed and uploads ShadowsBlock. */
  render(plan: ShadowPlan, casters: SceneEntity[]): void {
    const gl = this.gl;
    const views = this.enabled ? plan.views.slice(0, MAX_SHADOW_VIEWS) : [];
    this.stats.views += views.length;
    if ((plan.atlasSize ?? SHADOW_ATLAS_SIZE) !== this.atlas.width) {
      this.atlas.dispose();
      this.atlas = this.createAtlas(plan.atlasSize);
      this.invalidate();
    }
    if (!this.enabled || !this.cacheViews) this.invalidate();

    const changes = this.casterChanges(casters);
    const dirty = views.map((view, i) => this.isDirty(i, view.light, view.matrix, changes));

    if (dirty.some((d) => d)) {
      const cull = gl.isEnabled(gl.CULL_FACE);
      const cullMode = gl.getParameter(gl.CULL_FACE_MODE) as number;
      this.atlas.bind();
      gl.enable(gl.SCISSOR_TEST);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LESS);
      gl.depthMask(true);
      gl.enable(gl.CULL_FACE);
      gl.cullFace(gl.FRONT); // back faces in the map: less acne on lit faces

      views.forEach((view, i) => {
        if (!dirty[i]) return;
        const { x, y, size } = view.rect;
        gl.viewport(x, y, size, size);
        gl.scissor(x, y, size, size);
        gl.clear(gl.DEPTH_BUFFER_BIT);
        frustumPlanes(view.matrix, this.planes);
        for (const entity of casters) {
          const state = this.casters.get(entity);
          if (state?.hasBounds && !sphereInFrustum(this.planes, state.bounds.center, state.bounds.radius)) continue;
          this.drawDepth(entity, view.matrix);
          this.stats.draws++;
        }
        this.cache[i] = { light: view.light, matrix: Float32Array.from(view.matrix) };
        this.stats.redrawn++;
      });
      this.cache.length = views.length;

      gl.disable(gl.SCISSOR_TEST);
      for (const p of [this.plain, this.skinned]) if (p.position >= 0) gl.disableVertexAttribArray(p.position);
      gl.cullFace(cullMode);
      if (!cull) gl.disable(gl.CULL_FACE);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    packShadows({ ...plan, views }, this.enabled, this.uboData, this.filter);
    gl.bindBuffer(gl.UNIFORM_BUFFER, this.ubo);
    gl.bufferSubData(gl.UNIFORM_BUFFER, 0, this.uboData);
    gl.bindBuffer(gl.UNIFORM_BUFFER, null);
    gl.bindBufferBase(gl.UNIFORM_BUFFER, SHADOWS_BINDING_POINT, this.ubo);
  }

  /** Binds the atlas for the lit shader (texture unit SHADOW_ATLAS_UNIT). */
  bindAtlas(): void {
    this.gl.activeTexture(this.gl.TEXTURE0 + SHADOW_ATLAS_UNIT);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.atlas.depthTexture);
    this.gl.activeTexture(this.gl.TEXTURE0);
  }

  /**
   * Updates the remembered state of every caster and returns the bounds of
   * what changed this frame (old and new place). `null` in the list means a
   * change with unknown bounds: every view is dirty.
   */
  private casterChanges(casters: SceneEntity[]): (Sphere | null)[] {
    const changes: (Sphere | null)[] = [];
    const frame = ++this.frame;
    for (const entity of casters) {
      const renderer = entity.getBehaviour(RendererBehaviour);
      const matrix = entity.transform.modelMatrix;
      const version = renderer?.deformationVersion ?? 0;
      const buffer = renderer?.shader?.buffers?.position ?? null;
      let state = this.casters.get(entity);
      const same = !!state && state.version === version && state.buffer === buffer && equal(state.matrix, matrix);
      if (state && same) { state.seen = frame; continue; }
      if (state) changes.push(state.hasBounds ? { center: Float32Array.from(state.bounds.center), radius: state.bounds.radius } : null);
      state ??= { matrix: new Float32Array(16), version, buffer, bounds: createSphere(), hasBounds: false, seen: frame };
      state.matrix.set(matrix);
      state.version = version;
      state.buffer = buffer;
      state.seen = frame;
      state.hasBounds = !!renderer?.worldBounds(state.bounds);
      changes.push(state.hasBounds ? { center: Float32Array.from(state.bounds.center), radius: state.bounds.radius } : null);
      this.casters.set(entity, state);
    }
    for (const [entity, state] of this.casters) {
      if (state.seen === frame) continue;
      changes.push(state.hasBounds ? state.bounds : null);
      this.casters.delete(entity);
    }
    return changes;
  }

  private isDirty(index: number, light: Light, matrix: mat4, changes: (Sphere | null)[]): boolean {
    const cached = this.cache[index];
    if (!cached || cached.light !== light || !equal(cached.matrix, matrix)) return true;
    if (!changes.length) return false;
    frustumPlanes(matrix, this.planes);
    return changes.some((c) => !c || sphereInFrustum(this.planes, c.center, c.radius));
  }

  private createAtlas(size: number): RenderTarget {
    const gl = this.gl;
    const atlas = new RenderTarget(gl, size, size, { color: null, depth: "texture" });
    // Hardware 2×2 PCF: sampler2DShadow with comparison and linear filtering.
    gl.bindTexture(gl.TEXTURE_2D, atlas.depthTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_FUNC, gl.LEQUAL);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.bindTexture(gl.TEXTURE_2D, null);
    return atlas;
  }

  dispose(): void {
    this.atlas.dispose();
    this.gl.deleteProgram(this.plain.program);
    this.gl.deleteProgram(this.skinned.program);
    this.gl.deleteBuffer(this.ubo);
  }

  private readonly modelLight = mat4.create();

  private drawDepth(entity: SceneEntity, lightMatrix: mat4): void {
    const gl = this.gl;
    const renderer = entity.getBehaviour(RendererBehaviour);
    const shader = renderer?.shader;
    const buffers = shader?.buffers;
    const indices = renderer?.mesh?.meshData?.indices;
    if (!shader || !buffers?.position || !buffers.indices || !indices?.length) return;

    const jointTexture = renderer.jointTexture;
    const caster = jointTexture && buffers.joints ? this.skinned : this.plain;
    gl.useProgram(caster.program);
    mat4.multiply(this.modelLight, lightMatrix, entity.transform.modelMatrix);
    gl.uniformMatrix4fv(caster.matrix, false, this.modelLight as Float32Array);
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.enableVertexAttribArray(caster.position);
    gl.vertexAttribPointer(caster.position, 3, gl.FLOAT, false, 0, 0);
    if (caster === this.skinned) {
      gl.activeTexture(gl.TEXTURE0 + JOINT_TEXTURE_UNIT);
      gl.bindTexture(gl.TEXTURE_2D, jointTexture);
      gl.uniform1i(caster.jointTexture, JOINT_TEXTURE_UNIT);
      gl.activeTexture(gl.TEXTURE0);
      shader.bindSkinAttributes(caster.program);
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
    gl.drawElements(gl.TRIANGLES, indices.length, shader.indexType, 0);
    if (caster === this.skinned) ShadowAtlasPass.disableSkinAttributes(gl, caster.program);
  }

  private static casterProgram(gl: WebGL2RenderingContext, defines: string[]): CasterProgram {
    const program = ShadowAtlasPass.link(
      gl,
      Shader.withDefines(EMBEDDED_SHADERS[ShaderSources.vertex.shadow_caster], defines),
      EMBEDDED_SHADERS[ShaderSources.frag.depth_only],
    );
    return {
      program,
      position: gl.getAttribLocation(program, ShaderUniformsEnum.A_POSITION),
      matrix: gl.getUniformLocation(program, ShaderUniformsEnum.U_MODEL_MATRIX),
      jointTexture: gl.getUniformLocation(program, ShaderUniformsEnum.U_JOINT_TEXTURE),
    };
  }

  /** Turns the skin attribute arrays off again, so later programs don't read them. */
  static disableSkinAttributes(gl: WebGL2RenderingContext, program: WebGLProgram): void {
    for (const name of [ShaderUniformsEnum.A_JOINTS, ShaderUniformsEnum.A_WEIGHTS]) {
      const location = gl.getAttribLocation(program, name);
      if (location >= 0) gl.disableVertexAttribArray(location);
    }
  }

  private static link(gl: WebGL2RenderingContext, vs: string, fs: string): WebGLProgram {
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(`ShadowAtlasPass: ${gl.getShaderInfoLog(s)}`);
      return s;
    };
    const p = gl.createProgram()!;
    gl.attachShader(p, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(`ShadowAtlasPass: ${gl.getProgramInfoLog(p)}`);
    return p;
  }
}

function equal(a: ArrayLike<number>, b: ArrayLike<number>): boolean {
  for (let i = 0; i < 16; i++) if (a[i] !== b[i]) return false;
  return true;
}
