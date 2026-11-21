import { mat4 } from "gl-matrix";
import { RendererBehaviour } from "../../../behaviours";
import { SceneEntity } from "../../../entities";
import { ShaderUniformsEnum } from "../../../enums";
import { EMBEDDED_SHADERS } from "../../../shaders/embedded-shaders";
import { Shader } from "../../../shaders/shader";
import { ShaderSources } from "../../../shaders/shader-sources";
import { RenderTarget } from "../render-target";
import { MAX_SHADOW_VIEWS, packShadows, SHADOW_ATLAS_SIZE, SHADOWS_LAYOUT, ShadowPlan } from "../shadows";

/** Uniform block binding point of `ShadowsBlock`. */
export const SHADOWS_BINDING_POINT = 2;
/** Texture unit the lit shader samples the atlas from (`u_shadowAtlasMap`). */
export const SHADOW_ATLAS_UNIT = 2;
/** Texture unit of a skinned mesh's joint matrices (`u_jointTexture`). */
export const JOINT_TEXTURE_UNIT = 7;

/** A shadow-caster program and its locations. */
interface CasterProgram {
  program: WebGLProgram;
  position: number;
  matrix: WebGLUniformLocation | null;
  jointTexture: WebGLUniformLocation | null;
}

/**
 * Draws the depth of every planned shadow view into one 4096² atlas and
 * uploads the views (matrices, rectangles, biases) to ShadowsBlock.
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

  constructor(private gl: WebGL2RenderingContext) {
    this.atlas = new RenderTarget(gl, SHADOW_ATLAS_SIZE, SHADOW_ATLAS_SIZE, { color: null, depth: "texture" });
    // Hardware 2×2 PCF: sampler2DShadow with comparison and linear filtering.
    gl.bindTexture(gl.TEXTURE_2D, this.atlas.depthTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_FUNC, gl.LEQUAL);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.bindTexture(gl.TEXTURE_2D, null);

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

  /** Renders the plan's views and uploads ShadowsBlock. */
  render(plan: ShadowPlan, casters: SceneEntity[]): void {
    const gl = this.gl;
    const views = this.enabled ? plan.views.slice(0, MAX_SHADOW_VIEWS) : [];

    if (views.length) {
      const cull = gl.isEnabled(gl.CULL_FACE);
      const cullMode = gl.getParameter(gl.CULL_FACE_MODE) as number;
      this.atlas.bind();
      gl.enable(gl.SCISSOR_TEST);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LESS);
      gl.depthMask(true);
      gl.enable(gl.CULL_FACE);
      gl.cullFace(gl.FRONT); // back faces in the map: less acne on lit faces

      for (const view of views) {
        const { x, y, size } = view.rect;
        gl.viewport(x, y, size, size);
        gl.scissor(x, y, size, size);
        gl.clear(gl.DEPTH_BUFFER_BIT);
        for (const entity of casters) this.drawDepth(entity, view.matrix);
      }

      gl.disable(gl.SCISSOR_TEST);
      for (const p of [this.plain, this.skinned]) if (p.position >= 0) gl.disableVertexAttribArray(p.position);
      gl.cullFace(cullMode);
      if (!cull) gl.disable(gl.CULL_FACE);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    packShadows({ ...plan, views }, this.enabled, this.uboData);
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
