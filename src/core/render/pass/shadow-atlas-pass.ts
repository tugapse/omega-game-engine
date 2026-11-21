import { mat4 } from "gl-matrix";
import { RendererBehaviour } from "../../../behaviours";
import { SceneEntity } from "../../../entities";
import { ShaderUniformsEnum } from "../../../enums";
import { EMBEDDED_SHADERS } from "../../../shaders/embedded-shaders";
import { ShaderSources } from "../../../shaders/shader-sources";
import { RenderTarget } from "../render-target";
import { MAX_SHADOW_VIEWS, packShadows, SHADOW_ATLAS_SIZE, SHADOWS_LAYOUT, ShadowPlan } from "../shadows";

/** Uniform block binding point of `ShadowsBlock`. */
export const SHADOWS_BINDING_POINT = 2;
/** Texture unit the lit shader samples the atlas from (`u_shadowAtlasMap`). */
export const SHADOW_ATLAS_UNIT = 2;

/**
 * Draws the depth of every planned shadow view into one 4096² atlas and
 * uploads the views (matrices, rectangles, biases) to ShadowsBlock.
 */
export class ShadowAtlasPass {
  readonly name = "ShadowAtlasPass";
  /** Strength of all shadows; shared with the pipeline settings (the editor's sun animates it). */
  public enabled = true;

  private atlas: RenderTarget;
  private program: WebGLProgram;
  private positionLocation: number;
  private matrixLocation: WebGLUniformLocation | null;
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

    this.program = ShadowAtlasPass.link(
      gl,
      EMBEDDED_SHADERS[ShaderSources.vertex.shadow_caster],
      EMBEDDED_SHADERS[ShaderSources.frag.depth_only],
    );
    this.positionLocation = gl.getAttribLocation(this.program, ShaderUniformsEnum.A_POSITION);
    this.matrixLocation = gl.getUniformLocation(this.program, ShaderUniformsEnum.U_MODEL_MATRIX);

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
      gl.useProgram(this.program);

      for (const view of views) {
        const { x, y, size } = view.rect;
        gl.viewport(x, y, size, size);
        gl.scissor(x, y, size, size);
        gl.clear(gl.DEPTH_BUFFER_BIT);
        for (const entity of casters) this.drawDepth(entity, view.matrix);
      }

      gl.disable(gl.SCISSOR_TEST);
      if (this.positionLocation >= 0) gl.disableVertexAttribArray(this.positionLocation);
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
    this.gl.deleteProgram(this.program);
    this.gl.deleteBuffer(this.ubo);
  }

  private readonly modelLight = mat4.create();

  private drawDepth(entity: SceneEntity, lightMatrix: mat4): void {
    const gl = this.gl;
    const renderer = entity.getBehaviour(RendererBehaviour);
    const buffers = renderer?.shader?.buffers;
    const indices = renderer?.mesh?.meshData?.indices;
    if (!buffers?.position || !buffers.indices || !indices?.length) return;

    mat4.multiply(this.modelLight, lightMatrix, entity.transform.modelMatrix);
    gl.uniformMatrix4fv(this.matrixLocation, false, this.modelLight as Float32Array);
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.enableVertexAttribArray(this.positionLocation);
    gl.vertexAttribPointer(this.positionLocation, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
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
