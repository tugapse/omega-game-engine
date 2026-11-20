/** An image the GPU can upload: what `texImage2D` accepts, with its size. */
export type LoadedImage = (HTMLImageElement | ImageBitmap) & { width: number; height: number };

/**
 * How the engine fetches resource files. The host can replace it, e.g. to
 * add an Authorization header or to map `asset://<id>` to its own API.
 */
export interface ResourceLoader {
  /** Text files: shaders, OBJ meshes. Rejects on a failed request. */
  loadText(uri: string): Promise<string>;
  /** Images for textures. Rejects when the image cannot be loaded. */
  loadImage(uri: string): Promise<LoadedImage>;
}

/**
 * Turns a stored URI into a URL to load (see `Resources.setUriResolver`).
 * Kept for hosts that only need to rewrite URLs; a custom ResourceLoader
 * replaces it entirely.
 */
export type UriResolver = (uri: string) => string | Promise<string>;

/**
 * The default loader: `fetch` for text and an `<img>` for images, both
 * through an optional URI resolver. Behaves like the engine always did.
 */
export class DefaultResourceLoader implements ResourceLoader {
  constructor(private readonly resolve: (uri: string) => Promise<string>) {}

  async loadText(uri: string): Promise<string> {
    const response = await fetch(await this.resolve(uri));
    if (!response.ok) {
      throw new Error(`Failed to load ${uri} (HTTP ${response.status})`);
    }
    return response.text();
  }

  async loadImage(uri: string): Promise<LoadedImage> {
    const url = await this.resolve(uri);
    return new Promise<LoadedImage>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error(`Failed to load image: ${uri}`));
      image.src = url;
    });
  }
}
