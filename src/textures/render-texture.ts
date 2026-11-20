import { RenderTarget } from '../core/render/render-target';
import { Texture } from './texture';

/** URI scheme of the textures cameras render into: `rendertexture://<name>`. */
export const RENDER_TEXTURE_SCHEME = 'rendertexture://';

export function isRenderTextureUri(uri: string | undefined | null): boolean {
  return !!uri && uri.startsWith(RENDER_TEXTURE_SCHEME);
}

/** The URI of the render texture called `name` (a URI is returned unchanged). */
export function renderTextureUri(name: string): string {
  return isRenderTextureUri(name) ? name : RENDER_TEXTURE_SCHEME + name;
}

/**
 * A texture a camera renders into (see `Camera.targetTexture`). Materials use
 * it like any other texture, by its URI `rendertexture://<name>`.
 *
 * It keeps two colour targets and swaps them after each render: what the
 * camera draws goes into one while materials read the other. Otherwise an
 * object showing the texture inside that camera's own view would read the
 * texture being drawn into (a feedback loop WebGL refuses).
 */
export class RenderTexture extends Texture {
  private readonly targets: (RenderTarget | null)[] = [null, null];
  private readIndex = 0;
  private written = false;

  constructor(gl: WebGL2RenderingContext, uri: string) {
    super(gl, renderTextureUri(uri));
    this.isLoaded = true;
    this.name = this.textureName;
  }

  /** The name after `rendertexture://`. */
  get textureName(): string {
    return this.textureUri!.slice(RENDER_TEXTURE_SCHEME.length);
  }

  /**
   * The colour texture materials read: the last finished render, or null
   * before the first one.
   */
  override get glTexture(): WebGLTexture | null {
    return this.written ? this.targets[this.readIndex]?.colorTexture ?? null : null;
  }

  /** The target to render into now, at this size. Call `endWrite()` after. */
  beginWrite(width: number, height: number): RenderTarget {
    const i = 1 - this.readIndex;
    let target = this.targets[i];
    if (!target) target = this.targets[i] = new RenderTarget(this.gl!, width, height, { color: 'rgba8', depth: null });
    target.resize(width, height);
    this._width = target.width;
    this._height = target.height;
    return target;
  }

  /** Makes the render just finished the one materials read. */
  endWrite(): void {
    this.readIndex = 1 - this.readIndex;
    this.written = true;
  }

  /** Nothing to load: the pixels come from the camera. */
  override load(): Promise<void> {
    return Promise.resolve();
  }

  /** The targets use LINEAR filtering and no mipmaps. */
  override setTextureParameters(): void {}

  override bind(): void {
    this.gl?.bindTexture(this.gl.TEXTURE_2D, this.glTexture);
    this._isBound = true;
  }

  override destroy(): void {
    for (const t of this.targets) t?.dispose();
    this.targets[0] = this.targets[1] = null;
    this.written = false;
  }
}
