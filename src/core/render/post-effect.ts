import { ShaderSources } from "../../shaders/shader-sources";
import { FullscreenProgram } from "./fullscreen-program";
import { RenderContext } from "./render-pass.interface";

/**
 * A full-screen effect in the post-processing stack: reads `ctx.source`'s
 * colour (sampler `u_screenTexture`) and writes every pixel of `ctx.target`.
 * Subclasses name their fragment shader and set their own uniforms.
 */
export abstract class PostEffect {
  public enabled = true;
  private program: FullscreenProgram | null = null;

  abstract readonly name: string;
  protected abstract readonly fragUri: string;
  protected setUniforms(_program: FullscreenProgram, _ctx: RenderContext): void {}

  render(ctx: RenderContext): void {
    if (!ctx.source) return;
    const gl = ctx.gl;
    this.program ??= new FullscreenProgram(gl, this.fragUri);
    ctx.target.bind();
    this.program.use();
    this.program.bindTexture("u_screenTexture", ctx.source.colorTexture, 0);
    this.setUniforms(this.program, ctx);
    this.program.draw();
  }

  dispose(): void {
    this.program?.dispose();
    this.program = null;
  }
}

/** CRT look: barrel distortion, chromatic aberration and scanlines. */
export class RetroEffect extends PostEffect {
  readonly name = "Retro";
  protected readonly fragUri = ShaderSources.frag.retro;
  public distortion = 0.15;
  public aberration = 0.008;

  protected override setUniforms(program: FullscreenProgram, ctx: RenderContext): void {
    ctx.gl.uniform1f(program.uniform("u_time"), ctx.frame.time);
    ctx.gl.uniform1f(program.uniform("u_distortionStrength"), this.distortion);
    ctx.gl.uniform1f(program.uniform("u_aberrationSpread"), this.aberration);
  }
}
