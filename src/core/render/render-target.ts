/** Colour storage of a render target. `rgba16f` needs EXT_color_buffer_float. */
export type RenderTargetColor = 'rgba8' | 'rgba16f';

export interface RenderTargetOptions {
  /** Colour attachment, or null for a depth-only target (shadow maps). Default `rgba8`. */
  color?: RenderTargetColor | null;
  /**
   * Depth attachment: `texture` when a later pass reads it (e.g. to copy the
   * scene depth to the canvas), `renderbuffer` when only depth testing needs
   * it, or null. Default `texture`.
   */
  depth?: 'texture' | 'renderbuffer' | null;
}

/**
 * An off-screen framebuffer with its attachments: render into it with
 * `bind()`, read its `colorTexture` / `depthTexture` in later passes.
 * Resizing recreates the attachments; nothing is kept between sizes.
 */
export class RenderTarget {
  private _framebuffer: WebGLFramebuffer | null = null;
  private _colorTexture: WebGLTexture | null = null;
  private _depthTexture: WebGLTexture | null = null;
  private _depthRenderbuffer: WebGLRenderbuffer | null = null;
  private _width = 0;
  private _height = 0;
  readonly color: RenderTargetColor | null;
  readonly depth: 'texture' | 'renderbuffer' | null;

  constructor(
    private readonly gl: WebGL2RenderingContext,
    width: number,
    height: number,
    options: RenderTargetOptions = {},
  ) {
    this.color = options.color === undefined ? 'rgba8' : options.color;
    this.depth = options.depth === undefined ? 'texture' : options.depth;
    if (this.color === 'rgba16f' && !RenderTarget.supportsFloatColor(gl)) {
      throw new Error('RenderTarget: rgba16f needs EXT_color_buffer_float.');
    }
    this.resize(width, height);
  }

  /** True when float colour attachments (HDR) can be rendered to. */
  static supportsFloatColor(gl: WebGL2RenderingContext): boolean {
    return !!gl.getExtension('EXT_color_buffer_float');
  }

  get width(): number {
    return this._width;
  }
  get height(): number {
    return this._height;
  }
  get framebuffer(): WebGLFramebuffer | null {
    return this._framebuffer;
  }
  get colorTexture(): WebGLTexture | null {
    return this._colorTexture;
  }
  get depthTexture(): WebGLTexture | null {
    return this._depthTexture;
  }

  /** Recreates the attachments at a new size (no-op when the size is the same). */
  resize(width: number, height: number): void {
    width = Math.max(1, Math.floor(width));
    height = Math.max(1, Math.floor(height));
    if (this._framebuffer && width === this._width && height === this._height) return;

    this.dispose();
    const gl = this.gl;
    this._width = width;
    this._height = height;
    this._framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this._framebuffer);

    if (this.color) {
      const internal = this.color === 'rgba16f' ? gl.RGBA16F : gl.RGBA8;
      const type = this.color === 'rgba16f' ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE;
      this._colorTexture = this.createTexture(internal, gl.RGBA, type, gl.LINEAR);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._colorTexture, 0);
    } else {
      gl.drawBuffers([gl.NONE]);
      gl.readBuffer(gl.NONE);
    }

    if (this.depth === 'texture') {
      this._depthTexture = this.createTexture(gl.DEPTH_COMPONENT24, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, gl.NEAREST);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this._depthTexture, 0);
    } else if (this.depth === 'renderbuffer') {
      this._depthRenderbuffer = gl.createRenderbuffer();
      gl.bindRenderbuffer(gl.RENDERBUFFER, this._depthRenderbuffer);
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT24, width, height);
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this._depthRenderbuffer);
      gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    }

    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    if (status !== gl.FRAMEBUFFER_COMPLETE) {
      throw new Error(`RenderTarget: framebuffer incomplete (0x${status.toString(16)}).`);
    }
  }

  /** Binds the target for drawing and sets the viewport to its size. */
  bind(): void {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._framebuffer);
    this.gl.viewport(0, 0, this._width, this._height);
  }

  /** Clears the bound target's colour (when given) and depth. */
  clear(color?: ArrayLike<number>): void {
    const gl = this.gl;
    let mask = 0;
    if (this.color && color) {
      gl.clearColor(color[0], color[1], color[2], color[3]);
      mask |= gl.COLOR_BUFFER_BIT;
    }
    if (this.depth) {
      gl.depthMask(true);
      mask |= gl.DEPTH_BUFFER_BIT;
    }
    if (mask) gl.clear(mask);
  }

  dispose(): void {
    const gl = this.gl;
    if (this._framebuffer) gl.deleteFramebuffer(this._framebuffer);
    if (this._colorTexture) gl.deleteTexture(this._colorTexture);
    if (this._depthTexture) gl.deleteTexture(this._depthTexture);
    if (this._depthRenderbuffer) gl.deleteRenderbuffer(this._depthRenderbuffer);
    this._framebuffer = this._colorTexture = this._depthTexture = this._depthRenderbuffer = null;
  }

  private createTexture(internal: number, format: number, type: number, filter: number): WebGLTexture {
    const gl = this.gl;
    const texture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, internal, this._width, this._height, 0, format, type, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);
    return texture;
  }
}
