export var TextureWrapMode;
(function (TextureWrapMode) {
    TextureWrapMode[TextureWrapMode["REPEAT"] = 10497] = "REPEAT";
    TextureWrapMode[TextureWrapMode["MIRRORED_REPEAT"] = 33648] = "MIRRORED_REPEAT";
    TextureWrapMode[TextureWrapMode["CLAMP_TO_EDGE"] = 33071] = "CLAMP_TO_EDGE";
})(TextureWrapMode || (TextureWrapMode = {}));
export class Texture {
    constructor(gl, textureUri) {
        this.gl = gl;
        this.textureUri = textureUri;
        this._image = null;
        this._glTexture = null;
        this._isLoaded = false;
        this._isLoading = false;
    }
    static getDefaultWhiteTexture(gl) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        // Create a 1x1 white pixel
        const whitePixel = new Uint8Array([255, 255, 255, 255]);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, whitePixel);
        // Set texture parameters for default behavior
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null); // Unbind
        const result = new Texture(gl);
        result._glTexture = texture;
        result._isLoaded = true;
        return result;
    }
    setTextureUri(textureURi) {
        this.textureUri = textureURi;
    }
    /**
     * Loads an image from the given URL.
     * @param url The URL of the image to load.
     * @returns A Promise that resolves when the image is loaded.
     */
    async load() {
        if (this._isLoading || this.isImageLoaded)
            return;
        this._isLoading = true;
        return new Promise((resolve, reject) => {
            if (!this.textureUri) {
                reject(new Error(`Failed to load image. Please provide a texture url!`));
            }
            this._image = new Image();
            this._image.onload = () => {
                this._isLoaded = true;
                if (this.gl) {
                    this.createGLTexture(this.gl); // Automatically create GL texture if context is available
                }
                this._isLoading = false;
                resolve();
            };
            this._image.onerror = (error) => {
                this._isLoading = true;
                this._isLoaded = false;
                this._image = null;
                reject(new Error(`Failed to load image: ${this.textureUri}. Error: ${error}`));
            };
            this._image.src = this.textureUri;
        });
    }
    /**
     * Creates the WebGLTexture object from the loaded image data.
     * This should be called after the image has loaded and the WebGL context is available.
     * @param gl The WebGL2RenderingContext.
     */
    createGLTexture(gl) {
        if (!this._isLoaded || !this._image) {
            console.warn("Image not loaded or image data is missing. Cannot create WebGL texture.");
            return;
        }
        this._glTexture = gl.createTexture(); // Create a new texture object
        this.setTextureWrapMode(TextureWrapMode.CLAMP_TO_EDGE);
        this.bind();
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._image);
        gl.generateMipmap(gl.TEXTURE_2D);
        this.unBind();
    }
    setTextureWrapMode(wrapMode) {
        this.bind(); // Bind it to the TEXTURE_2D target
        // Set texture parameters:
        // CLAMP_TO_EDGE prevents texture bleeding at the edges.
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, wrapMode);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, wrapMode);
        // LINEAR filtering provides smoother scaling.
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.unBind();
    }
    bind() {
        this.gl.bindTexture(this.gl.TEXTURE_2D, this._glTexture);
    }
    unBind() {
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    }
    /**
     * Returns the WebGLTexture object.
     * @returns The WebGLTexture or null if not yet created.
     */
    get glTexture() {
        return this._glTexture;
    }
    /**
     * Checks if the image data has been loaded.
     */
    get isImageLoaded() {
        return this._isLoaded;
    }
    /**
     * Destroys the WebGL texture to free up GPU memory.
     */
    destroy() {
        if (this.gl && this._glTexture) {
            this.gl.deleteTexture(this._glTexture);
            this._glTexture = null;
        }
        this._image = null; // Also clear the image reference
        this._isLoaded = false;
    }
}
