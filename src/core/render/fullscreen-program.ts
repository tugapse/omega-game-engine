import { EMBEDDED_SHADERS } from '../../shaders/embedded-shaders';
import { ShaderSources } from '../../shaders/shader-sources';

/**
 * A full-screen triangle program built synchronously from the embedded
 * shaders (vertex: ShaderSources.vertex.fullscreen). Used by passes that read
 * a texture and write every pixel: copies, tone mapping, post effects.
 */
export class FullscreenProgram {
  readonly program: WebGLProgram;
  private readonly vao: WebGLVertexArrayObject;
  private readonly locations = new Map<string, WebGLUniformLocation | null>();

  constructor(private readonly gl: WebGL2RenderingContext, fragUri: string) {
    const vertexSource = EMBEDDED_SHADERS[ShaderSources.vertex.fullscreen];
    const fragmentSource = EMBEDDED_SHADERS[fragUri];
    if (!vertexSource || !fragmentSource) {
      throw new Error(`FullscreenProgram: shader not embedded: ${fragmentSource ? ShaderSources.vertex.fullscreen : fragUri}`);
    }
    this.program = FullscreenProgram.link(gl, vertexSource, fragmentSource);
    // WebGL2 needs a bound VAO to draw, even with no attributes.
    this.vao = gl.createVertexArray()!;
  }

  use(): void {
    this.gl.useProgram(this.program);
  }

  uniform(name: string): WebGLUniformLocation | null {
    if (!this.locations.has(name)) {
      this.locations.set(name, this.gl.getUniformLocation(this.program, name));
    }
    return this.locations.get(name)!;
  }

  /** Binds `texture` to `unit` and points the sampler uniform at it. */
  bindTexture(name: string, texture: WebGLTexture | null, unit: number): void {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(this.uniform(name), unit);
  }

  /** Draws the full-screen triangle (3 vertices from gl_VertexID). */
  draw(): void {
    this.gl.bindVertexArray(this.vao);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
    this.gl.bindVertexArray(null);
  }

  dispose(): void {
    this.gl.deleteProgram(this.program);
    this.gl.deleteVertexArray(this.vao);
  }

  private static link(gl: WebGL2RenderingContext, vs: string, fs: string): WebGLProgram {
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const log = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error(`FullscreenProgram: compile failed: ${log}`);
      }
      return shader;
    };
    const program = gl.createProgram()!;
    const v = compile(gl.VERTEX_SHADER, vs);
    const f = compile(gl.FRAGMENT_SHADER, fs);
    gl.attachShader(program, v);
    gl.attachShader(program, f);
    gl.linkProgram(program);
    gl.deleteShader(v);
    gl.deleteShader(f);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(`FullscreenProgram: link failed: ${gl.getProgramInfoLog(program)}`);
    }
    return program;
  }
}
