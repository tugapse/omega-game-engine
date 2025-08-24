import { Texture } from "./texture";
export class CubeMapTexture extends Texture {
    constructor(gl, textureUris) {
        super(gl);
        this.gl = gl;
        this.textureUris = textureUris;
        this.imagesData = [];
        this.loadedImages = [null, null, null, null, null, null];
    }
    /**
   * Loads images from the given URL.
   * @param url The URL of the image to load.
   * @returns A Promise that resolves when the image is loaded.
   */
    async load() {
        if (this._isLoading || this.isImageLoaded)
            return;
        this._isLoading = true;
        return new Promise((resolve, reject) => {
            for (let i = 0; i < this.textureUris.length; i++) {
                this.loadedImages[i] = null;
                const _image = new Image();
                _image.onload = () => {
                    this.setLoadedImage(i, true);
                };
                _image.onerror = (error) => {
                    this._isLoading = true;
                    this._isLoaded = false;
                    this.setLoadedImage(i, false);
                    reject(new Error(`Failed to load image: ${this.textureUris[i]}. Error: ${error}`));
                };
                _image.src = this.textureUris[i];
                this.imagesData[i] = _image;
            }
        });
    }
    allImagesFetchedAndLoaded() {
        var _a;
        return this.loadedImages.filter(e => e === true).length == ((_a = this.textureUris) === null || _a === void 0 ? void 0 : _a.length);
    }
    allImagesFetched() {
        return this.loadedImages.filter(e => e == null).length == 0;
    }
    setLoadedImage(imageIndex, wasLoaded) {
        this.loadedImages[imageIndex] = wasLoaded;
        if (this.allImagesFetchedAndLoaded() && !this.isImageLoaded) {
            this.createGLTexture(this.gl);
            this._isLoaded = true;
            this._isLoading = false;
        }
        else if (this.allImagesFetched()) {
            console.error("Was not possible to get all images!");
        }
    }
    bind() {
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this._glTexture);
    }
    createGLTexture(gl) {
        this._glTexture = gl.createTexture();
        if (!this._glTexture) {
            console.error("Failed to create WebGL texture for cubemap.");
            return;
        }
        this.bind();
        // Set texture parameters
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
        // Define the order of cube map faces and their corresponding image objects
        const faces = [
            { target: gl.TEXTURE_CUBE_MAP_POSITIVE_X, image: this.imagesData[0] }, // Right
            { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, image: this.imagesData[1] }, // Left
            { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, image: this.imagesData[2] }, // Top
            { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, image: this.imagesData[3] }, // Bottom
            { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, image: this.imagesData[4] }, // Front
            { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, image: this.imagesData[5] }, // Back
        ];
        const level = 0;
        const internalFormat = gl.RGBA;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        faces.forEach((faceInfo) => {
            gl.texImage2D(faceInfo.target, level, internalFormat, srcFormat, srcType, faceInfo.image);
        });
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        this.unBind();
    }
    setTextureUris(uris) {
        if ((uris === null || uris === void 0 ? void 0 : uris.length) != 6) {
            console.error(`Incorrect number of uris 6 were expected ${uris.length} given!`);
        }
        this.textureUris = uris;
    }
}
