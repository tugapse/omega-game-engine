// A 2D texture array (WebGL2 TEXTURE_2D_ARRAY): layers of the same size in
// one texture, picked by index in the shader. The terrain keeps its layers'
// colours and normals in two of these, so a draw binds two textures however
// many layers there are. Filled from RGBA bytes, repeating, with mipmaps.

export class TextureArray {
  public glTexture: WebGLTexture | null = null;

  constructor(private gl: WebGL2RenderingContext, readonly size: number, readonly layers: number) {
    const tex = gl.createTexture();
    this.glTexture = tex;
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, tex);
    const levels = Math.floor(Math.log2(size)) + 1;
    gl.texStorage3D(gl.TEXTURE_2D_ARRAY, levels, gl.RGBA8, size, size, Math.max(1, layers));
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    const aniso = gl.getExtension('EXT_texture_filter_anisotropic');
    if (aniso) {
      const max = gl.getParameter(aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT) as number;
      gl.texParameterf(gl.TEXTURE_2D_ARRAY, aniso.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(8, max));
    }
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, null);
  }

  /** Writes one layer (size² RGBA bytes). Call `generateMipmaps` after the last one. */
  setLayer(layer: number, rgba: Uint8Array | Uint8ClampedArray): void {
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.glTexture);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, layer, this.size, this.size, 1, gl.RGBA, gl.UNSIGNED_BYTE,
      rgba instanceof Uint8ClampedArray ? new Uint8Array(rgba.buffer, rgba.byteOffset, rgba.byteLength) : rgba);
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, null);
  }

  generateMipmaps(): void {
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.glTexture);
    gl.generateMipmap(gl.TEXTURE_2D_ARRAY);
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, null);
  }

  bind(unit: number): void {
    this.gl.activeTexture(this.gl.TEXTURE0 + unit);
    this.gl.bindTexture(this.gl.TEXTURE_2D_ARRAY, this.glTexture);
  }

  destroy(): void {
    if (this.glTexture) this.gl.deleteTexture(this.glTexture);
    this.glTexture = null;
  }
}
