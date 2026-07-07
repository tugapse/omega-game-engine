import { Scene } from "../../../entities";
import { UnlitMaterial } from "../../../materials";
import { Shader, UnlitShader, ShaderSources } from "../../../shaders";
import { Texture } from "../../../textures";
import { JsonSerializable } from "../../json-serializable";
import { IRenderPass } from "../render-pass.interface";

/**
 * A render pass that draws a texture to the entire screen.
 * This is typically the final pass in a pipeline, used to present the result of
 * off-screen rendering (from a framebuffer) to the main canvas.
 *
 * @remarks
 * This pass uses a simple shader that samples from a source texture and draws a
 * full-screen triangle, effectively "blitting" the texture to the output.
 */
export class ScreenBlitPass extends JsonSerializable implements IRenderPass {
  private gl: WebGL2RenderingContext;
  private screenQuadShader: Shader;

  /** The source texture to be drawn to the screen. This is typically the color attachment of a previous pass's framebuffer. */
  public sourceTexture!: Texture;

  /**
   * Creates an instance of ScreenBlitPass.
   * @param gl - The WebGL2 rendering context.
   */
  constructor(gl: WebGL2RenderingContext) {
    super('ScreenBlitPass');
    this.gl = gl;

    // Initialize a dedicated screen quad shader to blit the texture
    this.screenQuadShader = new UnlitShader(gl, new UnlitMaterial());
    this.screenQuadShader.fragUri = ShaderSources.frag.screen_blit;
    this.screenQuadShader.vertexUri = ShaderSources.vertex.fullscreen;
  }

  /**
   * Sets the WebGL rendering context.
   * @param gl - The WebGL2 rendering context.
   */
  setGl(gl: WebGL2RenderingContext): void {
    this.gl = gl;
  }

  /**
   * Initializes the pass by compiling its internal shader.
   * This must be called before `execute` can be used.
   */
  async initialize(): Promise<void> {
    await this.screenQuadShader.initialize();
  }

  /**
   * Executes the render pass.
   * This binds the `sourceTexture` and draws a full-screen quad to the currently bound framebuffer (usually the canvas).
   * @param scene - The scene to render. This parameter is unused in this pass.
   */
  execute(scene: Scene): void {
    if (!this.sourceTexture || !this.screenQuadShader.initialized) {
      return;
    }

    // Ensure we are drawing to the main canvas (or the currently bound framebuffer)
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.disable(this.gl.DEPTH_TEST);

    // Use blit shader, bind sourceTexture, and draw full-screen quad
    this.screenQuadShader.use();

    // Bind texture to unit 0 and assign uniform
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.sourceTexture.glTexture);
    this.screenQuadShader.setInt('u_screenTexture', 0);

    // Draw a single triangle that covers the entire screen.
    // The vertex shader generates the vertices procedurally, so no VAO is needed.
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

    // Cleanup
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    this.screenQuadShader.release();
  }

  /**
   * Cleans up WebGL resources used by this pass.
   */
  cleanup(): void {
    this.screenQuadShader.destroy();
  }

  /**
   * Called when the viewport resizes. This pass does not need to do anything on resize.
   * @param width - The new width.
   * @param height - The new height.
   */
  resize(width: number, height: number): void {}

  /**
   * Sets the input texture that will be drawn to the screen.
   * @param texture - The texture to use as the source.
   */
  public setInputTexture(texture: Texture): void {
    this.sourceTexture = texture;
  }
}
