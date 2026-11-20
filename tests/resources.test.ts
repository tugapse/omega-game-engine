/**
 * Tests for the Resources entry point and its per-context ResourceManager.
 * P-numbers refer to the problems listed in the resources rework plan.
 *
 * No GPU and no network: textures, the OBJ parser and fetch are fakes.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../src/textures/texture', () => {
  class Texture {
    static created: Texture[] = [];
    load = vi.fn(async () => {});
    destroy = vi.fn();
    constructor(public gl?: unknown, public textureUri?: string) {
      Texture.created.push(this);
    }
  }
  return { Texture };
});

vi.mock('../src/textures', async () => {
  const { Texture } = await import('../src/textures/texture');
  class CubemapTexture {
    load = vi.fn(async () => {});
    destroy = vi.fn();
    constructor(public gl: unknown, public uris: string[]) {}
  }
  return { Texture, CubemapTexture };
});

vi.mock('../src/parsers/obj-parser', () => ({
  ObjParser: class {
    parse(text: string) {
      return { parsedFrom: text };
    }
  },
}));

import { Resources } from '../src/core/resources/resources';
import { BuiltinTextures } from '../src/core/resources/builtin-textures';
import { Texture } from '../src/textures/texture';

const gl = {} as WebGL2RenderingContext;

function okResponse(text: string) {
  return { ok: true, status: 200, text: async () => text };
}

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  Resources.clear();
  Resources.setUriResolver(null);
  (Texture as unknown as { created: unknown[] }).created.length = 0;
  fetchMock = vi.fn(async (url: string) => okResponse(`body of ${url}`));
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('textures', () => {
  it('returns the same loaded texture for the same URI', async () => {
    const a = await Resources.for(gl).getTexture('assets/a.png');
    const b = await Resources.for(gl).getTexture('assets/a.png');
    expect(a).toBe(b);
    expect(a.load).toHaveBeenCalled();
  });

  it('returns different textures for different URIs', async () => {
    const a = await Resources.for(gl).getTexture('assets/a.png');
    const b = await Resources.for(gl).getTexture('assets/b.png');
    expect(a).not.toBe(b);
  });

  it('keys a cubemap by its six faces', async () => {
    const faces = { right: 'r', left: 'l', up: 'u', bottom: 'b', front: 'f', back: 'k' };
    const a = await Resources.for(gl).getCubemap(faces);
    const b = await Resources.for(gl).getCubemap({ ...faces });
    const c = await Resources.for(gl).getCubemap({ ...faces, back: 'other' });
    expect(a).toBe(b);
    expect(a).not.toBe(c);
  });

  it('P4 (fixed): without any known GL context, it rejects and caches nothing', async () => {
    await expect(Resources.for().getTexture('assets/a.png')).rejects.toThrow(/no WebGL context/);
    const withGl = await Resources.for(gl).getTexture('assets/a.png');
    expect(withGl.gl).toBe(gl);
  });

  it('without gl, uses the GL context used most recently', async () => {
    const a = await Resources.for(gl).getTexture('assets/a.png');
    const b = await Resources.for().getTexture('assets/a.png');
    expect(b).toBe(a);
  });

  it('keeps separate textures per GL context (P6)', async () => {
    const other = {} as WebGL2RenderingContext;
    const a = await Resources.for(gl).getTexture('assets/a.png');
    const b = await Resources.for(other).getTexture('assets/a.png');
    expect(b).not.toBe(a);
    expect(b.gl).toBe(other);
  });

  it('P2 (fixed): looking a texture up again does not hold it forever', async () => {
    const owner = await Resources.for(gl).textures.acquire('assets/a.png');
    await Resources.for(gl).getTexture('assets/a.png'); // a lookup, e.g. by LitShader
    owner.release(); // the one real owner lets go
    expect(Resources.trim()).toBe(1);
    expect(owner.value.destroy).toHaveBeenCalled();
  });

  it('a forgotten texture is not handed out again', async () => {
    const t = await Resources.for(gl).getTexture('assets/a.png');
    Resources.forgetTexture(t);
    const again = await Resources.for(gl).getTexture('assets/a.png');
    expect(again).not.toBe(t);
  });
});

describe('shader sources', () => {
  it('fetches a shader once and caches its text', async () => {
    const first = await Resources.for().getShader('assets/shaders/a.frag');
    const second = await Resources.for().getShader('assets/shaders/a.frag');
    expect(first).toBe('body of assets/shaders/a.frag');
    expect(second).toBe(first);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('rejects when the shader cannot be fetched', async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, status: 404, text: async () => '' });
    await expect(Resources.for().getShader('missing.frag')).rejects.toThrow();
  });

  it('P8 (fixed): two requests at the same time share one fetch', async () => {
    await Promise.all([
      Resources.for().getShader('assets/shaders/a.frag'),
      Resources.for().getShader('assets/shaders/a.frag'),
    ]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('meshes', () => {
  it('parses an OBJ once and returns the same mesh data', async () => {
    const a = await Resources.for().getMesh('assets/cube.obj');
    const b = await Resources.for().getMesh('assets/cube.obj');
    expect(a).toBe(b);
    expect(a).toEqual({ parsedFrom: 'body of assets/cube.obj' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('P9 (fixed): a failed OBJ fetch rejects instead of parsing the error page', async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, status: 404, text: async () => '<html>404</html>' });
    await expect(Resources.for().getMesh('missing.obj')).rejects.toThrow();
  });
});

describe('URI resolver', () => {
  it('loads from the resolved URL but caches by the stored URI', async () => {
    Resources.setUriResolver((uri) => uri.replace('asset://', 'blob:resolved/'));
    const a = await Resources.for().getShader('asset://42');
    const b = await Resources.for().getShader('asset://42');
    expect(fetchMock).toHaveBeenCalledWith('blob:resolved/42');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(a).toBe(b);
  });

  it('accepts an async resolver', async () => {
    Resources.setUriResolver(async (uri) => `https://cdn.test/${uri}`);
    await Resources.for().getMesh('cube.obj');
    expect(fetchMock).toHaveBeenCalledWith('https://cdn.test/cube.obj');
  });
});

describe('built-in resources (P7)', () => {
  it('serves the engine shaders without fetching', async () => {
    const src = await Resources.for().getShader('assets/shaders/frag/default-lit.frag');
    expect(src).toContain('void main');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('default textures are built in', async () => {
    const white = await Resources.for(gl).getTexture(BuiltinTextures.white);
    expect(white.textureUri).toBe('builtin://white');
    expect(await Resources.resolveUri('assets/images/default/normal.jpg')).toBe('assets/images/default/normal.jpg');
    expect(await Resources.resolveUri('builtin://missing')).toMatch(/^data:image\/png;base64,/);
  });

  it('built-in textures ignore a custom loader', async () => {
    const custom = { loadText: vi.fn(), loadImage: vi.fn() };
    Resources.setLoader(custom);
    try {
      const white = await Resources.for(gl).getTexture(BuiltinTextures.white);
      const photo = await Resources.for(gl).getTexture('asset://42');
      expect(white.loader).not.toBe(custom);
      expect(photo.loader).toBe(custom);
    } finally {
      Resources.setLoader(null);
    }
  });
});

describe('loader', () => {
  it('a custom loader replaces fetch for text', async () => {
    const loader = {
      loadText: vi.fn(async (uri: string) => `custom ${uri}`),
      loadImage: vi.fn(),
    };
    Resources.setLoader(loader);
    try {
      expect(await Resources.for().getShader('a.frag')).toBe('custom a.frag');
      expect(fetchMock).not.toHaveBeenCalled();
    } finally {
      Resources.setLoader(null);
    }
  });

  it('reports what each manager holds', async () => {
    await Resources.for(gl).getTexture('assets/a.png');
    await Resources.for().getShader('a.frag');
    const [stats] = Resources.stats();
    expect(stats.textures.entries).toBe(1);
    expect(stats.shaders.entries).toBe(1);
  });
});

describe('releaseContext', () => {
  it('frees a context and forgets its manager', async () => {
    const t = await Resources.for(gl).getTexture('assets/a.png');
    Resources.releaseContext(gl);
    expect(t.destroy).toHaveBeenCalled();
    expect(Resources.stats()).toHaveLength(0);
  });
});

describe('trim', () => {
  it('frees what nobody holds and keeps what a holder still uses', async () => {
    const manager = Resources.for(gl);
    const held = await manager.textures.acquire('assets/held.png');
    const loose = await Resources.for(gl).getTexture('assets/loose.png');
    expect(Resources.trim()).toBe(1);
    expect(loose.destroy).toHaveBeenCalled();
    expect(held.value.destroy).not.toHaveBeenCalled();
    held.release();
    expect(Resources.trim()).toBe(1);
  });
});

describe('clear', () => {
  it('forgets cached entries', async () => {
    const a = await Resources.for(gl).getTexture('assets/a.png');
    Resources.clear();
    const b = await Resources.for(gl).getTexture('assets/a.png');
    expect(b).not.toBe(a);
  });

  it('P1 (fixed): clearing frees the GPU textures it forgets', async () => {
    const a = await Resources.for(gl).getTexture('assets/a.png');
    Resources.clear();
    expect(a.destroy).toHaveBeenCalled();
  });
});
