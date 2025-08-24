import { Texture } from "./texture";
export declare class CubeMapTexture extends Texture {
    protected gl: WebGL2RenderingContext;
    protected textureUris?: string[] | undefined;
    protected imagesData: HTMLImageElement[];
    private loadedImages;
    constructor(gl: WebGL2RenderingContext, textureUris?: string[] | undefined);
    /**
   * Loads images from the given URL.
   * @param url The URL of the image to load.
   * @returns A Promise that resolves when the image is loaded.
   */
    load(): Promise<void>;
    protected allImagesFetchedAndLoaded(): boolean;
    protected allImagesFetched(): boolean;
    setLoadedImage(imageIndex: number, wasLoaded: boolean): void;
    bind(): void;
    protected createGLTexture(gl: WebGL2RenderingContext): void;
    setTextureUris(uris: string[]): void;
}
