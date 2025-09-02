import { JsonSerializable, JsonSerializedData } from "../interfaces";

/**
  An enumeration of texture wrapping modes. These values correspond to WebGL constants for `TEXTURE_WRAP_S` and `TEXTURE_WRAP_T`.
 */
export enum TextureWrapMode {
  /**
    The texture will repeat itself.
   */
  REPEAT = 10497,
  /**
    The texture will repeat itself, but each successive repeat is mirrored.
   */
  MIRRORED_REPEAT = 33648,
  /**
    The texture will be clamped to the edge pixels.
   */
  CLAMP_TO_EDGE = 33071,
}

/**
  A class to manage the loading, creation, and binding of 2D textures for use in WebGL.
 */
export class Texture extends JsonSerializable {

  /**
    The HTML image element that contains the texture data.
   * @protected
   * @type {HTMLImageElement | null}
   */
  protected _image: HTMLImageElement | null = null;
  /**
    The WebGL texture object.
   * @protected
   * @type {WebGLTexture | null}
   */
  protected _glTexture: WebGLTexture | null = null;
  /**
    Indicates whether the image data has been loaded.
   * @protected
   * @type {boolean}
   */
  protected _isLoaded: boolean = false;
  /**
    Indicates whether the texture is currently in the process of loading.
   * @protected
   * @type {boolean}
   */
  protected _isLoading: boolean = false;

  /**
    Creates an instance of Texture.
   * @param {WebGL2RenderingContext} gl - The WebGL2 rendering context.
   * @param {string} [textureUri] - The URI of the image to load.
   */
  constructor(protected gl?: WebGL2RenderingContext, protected textureUri?: string) {
    super("Texture");
  }

  public setGL(gl: WebGL2RenderingContext) {
    this.gl = gl;
  }

  /**
    Creates and returns a default 1x1 white texture.
   * This is useful as a fallback texture for materials that don't have one specified.
    
   * @param {WebGL2RenderingContext} gl - The WebGL2 rendering context.
   * @returns {Texture} - A new Texture instance with a 1x1 white pixel.
   */
  public static getDefaultWhiteTexture(gl: WebGL2RenderingContext): Texture {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    const whitePixel = new Uint8Array([255, 255, 255, 255]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, whitePixel);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.bindTexture(gl.TEXTURE_2D, null);
    const result = new Texture(gl);
    result._glTexture = texture;
    result._isLoaded = true;
    return result;
  }

  public static createTexture(gl: WebGL2RenderingContext, width: number, height: number): Texture {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    const colors = [];
    for (let i = 0; i < width * height; i++) {
      colors.push(255, 255, 255, 255);
    }
    const whitePixels = new Uint8Array(colors);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, whitePixels);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.bindTexture(gl.TEXTURE_2D, null);
    const result = new Texture(gl);
    result._glTexture = texture;
    result._isLoaded = true;
    return result;
  }

  /**
    Sets the URI for the texture's image.
   * @param {string} textureURi - The new URI for the texture.
   * @returns {void}
   */
  public setTextureUri(textureURi: string): void {
    this.textureUri = textureURi;
  }

  /**
    Loads an image from the provided URI and creates the WebGL texture.
   * @returns {Promise<void>} - A Promise that resolves when the image is fully loaded and the WebGL texture is created.
   */
  public async load(): Promise<void> {
    if (this._isLoading || this.isImageLoaded) return;
    this._isLoading = true;
    return new Promise((resolve, reject) => {
      if (!this.textureUri) {
        reject(new Error("Failed to load image. Please provide a texture URL!"));
      }

      this._image = new Image();
      this._image.onload = () => {
        this._isLoaded = true;
        if (this.gl) {
          this.createGLTexture(this.gl);
        }
        this._isLoading = false;
        resolve();
      };
      this._image.onerror = (error) => {
        this._isLoading = false;
        this._isLoaded = false;
        this._image = null;
        reject(new Error(`Failed to load image: ${this.textureUri!}. Error: ${error}`));
      };
      this._image.src = this.textureUri!;
    });
  }

  /**
    Creates the WebGLTexture object from the loaded image data.
   * @protected
   * @param {WebGL2RenderingContext} gl - The WebGL2 rendering context.
   * @returns {void}
   */
  protected createGLTexture(gl: WebGL2RenderingContext): void {
    if (!this._isLoaded || !this._image) {
      console.warn("Image not loaded or image data is missing. Cannot create WebGL texture.");
      return;
    }

    this._glTexture = gl.createTexture();
    this.setTextureWrapMode(TextureWrapMode.CLAMP_TO_EDGE);

    this.bind();
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._image);
    gl.generateMipmap(gl.TEXTURE_2D);
    this.unBind();
  }

  /**
    Sets the texture wrapping mode for the S and T axes.
   * @param {TextureWrapMode} wrapMode - The wrapping mode to apply.
   * @returns {void}
   */
  public setTextureWrapMode(wrapMode: TextureWrapMode): void {
    if(!this.gl) return;
    this.bind();

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, wrapMode);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, wrapMode);

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

    this.unBind();
  }

  /**
    Binds the texture to the `TEXTURE_2D` target.
   * @returns {void}
   */
  public bind(): void {
    if(!this.gl) return;

    this.gl.bindTexture(this.gl.TEXTURE_2D, this._glTexture);
  }

  /**
    Unbinds the texture from the `TEXTURE_2D` target.
   * @returns {void}
   */
  public unBind(): void {
    if(!this.gl) return;

    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  }

  /**
    Gets the WebGLTexture object.
   * @readonly
   * @type {WebGLTexture | null}
   */
  public get glTexture(): WebGLTexture | null {
    return this._glTexture;
  }

  /**
    Checks if the image data has been successfully loaded into the HTMLImageElement.
   * @readonly
   * @type {boolean}
   */
  public get isImageLoaded(): boolean {
    return this._isLoaded;
  }

  /**
    Destroys the WebGL texture to free up GPU memory.
   * @returns {void}
   */
  public destroy(): void {
    if (this.gl && this._glTexture) {
      this.gl.deleteTexture(this._glTexture);
      this._glTexture = null;
    }
    this._image = null;
    this._isLoaded = false;
  }

  public override toJsonObject(): JsonSerializedData {
    return {
      ...super.toJsonObject(),
      url: this.textureUri,
    }
  }
  override fromJson(jsonObject: JsonSerializedData): void {
    this.textureUri = jsonObject.url;
  }
}