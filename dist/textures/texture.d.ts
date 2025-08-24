export declare enum TextureWrapMode {
    REPEAT = 10497,
    MIRRORED_REPEAT = 33648,
    CLAMP_TO_EDGE = 33071
}
export declare class Texture {
    protected gl: WebGL2RenderingContext;
    protected textureUri?: string | undefined;
    protected _image: HTMLImageElement | null;
    protected _glTexture: WebGLTexture | null;
    protected _isLoaded: boolean;
    protected _isLoading: boolean;
    constructor(gl: WebGL2RenderingContext, textureUri?: string | undefined);
    static getDefaultWhiteTexture(gl: WebGL2RenderingContext): Texture;
    setTextureUri(textureURi: string): void;
    /**
     * Loads an image from the given URL.
     * @param url The URL of the image to load.
     * @returns A Promise that resolves when the image is loaded.
     */
    load(): Promise<void>;
    /**
     * Creates the WebGLTexture object from the loaded image data.
     * This should be called after the image has loaded and the WebGL context is available.
     * @param gl The WebGL2RenderingContext.
     */
    protected createGLTexture(gl: WebGL2RenderingContext): void;
    setTextureWrapMode(wrapMode: TextureWrapMode): void;
    bind(): void;
    unBind(): void;
    /**
     * Returns the WebGLTexture object.
     * @returns The WebGLTexture or null if not yet created.
     */
    get glTexture(): WebGLTexture | null;
    /**
     * Checks if the image data has been loaded.
     */
    get isImageLoaded(): boolean;
    /**
     * Destroys the WebGL texture to free up GPU memory.
     */
    destroy(): void;
}
