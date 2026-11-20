/**
 * Characterisation tests for the current EngineCache (the POC being reworked).
 *
 * `it` = behaviour the rework must keep.
 * `it.fails` = a known problem from the rework plan (P-numbers); the test
 * describes the correct behaviour and is expected to fail today. When a phase
 * fixes it, the test starts passing, vitest reports it, and it becomes `it`.
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

import { EngineCache } from '../src/core/engineCache';
import { Texture } from '../src/textures/texture';

const gl = {} as WebGL2RenderingContext;

function okResponse(text: string) {
  return { ok: true, status: 200, text: async () => text };
}

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  EngineCache.clear();
  EngineCache.setUriResolver(null);
  (Texture as unknown as { created: unknown[] }).created.length = 0;
  fetchMock = vi.fn(async (url: string) => okResponse(`body of ${url}`));
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('textures', () => {
  it('returns the same loaded texture for the same URI', async () => {
    const a = await EngineCache.getTexture2D('assets/a.png', gl);
    const b = await EngineCache.getTexture2D('assets/a.png', gl);
    expect(a).toBe(b);
    expect(a.load).toHaveBeenCalled();
  });

  it('returns different textures for different URIs', async () => {
    const a = await EngineCache.getTexture2D('assets/a.png', gl);
    const b = await EngineCache.getTexture2D('assets/b.png', gl);
    expect(a).not.toBe(b);
  });

  it('keys a cubemap by its six faces', async () => {
    const faces = { right: 'r', left: 'l', up: 'u', bottom: 'b', front: 'f', back: 'k' };
    const a = await EngineCache.getTextureCube(faces, gl);
    const b = await EngineCache.getTextureCube({ ...faces }, gl);
    const c = await EngineCache.getTextureCube({ ...faces, back: 'other' }, gl);
    expect(a).toBe(b);
    expect(a).not.toBe(c);
  });

  it('P4 (fixed): without any known GL context, it rejects and caches nothing', async () => {
    await expect(EngineCache.getTexture2D('assets/a.png')).rejects.toThrow(/no WebGL context/);
    const withGl = await EngineCache.getTexture2D('assets/a.png', gl);
    expect(withGl.gl).toBe(gl);
  });

  it('without gl, uses the GL context used most recently', async () => {
    const a = await EngineCache.getTexture2D('assets/a.png', gl);
    const b = await EngineCache.getTexture2D('assets/a.png');
    expect(b).toBe(a);
  });

  it('keeps separate textures per GL context (P6)', async () => {
    const other = {} as WebGL2RenderingContext;
    const a = await EngineCache.getTexture2D('assets/a.png', gl);
    const b = await EngineCache.getTexture2D('assets/a.png', other);
    expect(b).not.toBe(a);
    expect(b.gl).toBe(other);
  });

  it('P2 (fixed): looking a texture up again does not hold it forever', async () => {
    const t = await EngineCache.getTexture2D('assets/a.png', gl);
    await EngineCache.getTexture2D('assets/a.png', gl); // a lookup, e.g. by LitShader
    EngineCache.releaseTexture(t); // the one real owner lets go
    expect(t.destroy).toHaveBeenCalled();
  });

  it('a released texture is not handed out again', async () => {
    const t = await EngineCache.getTexture2D('assets/a.png', gl);
    EngineCache.releaseTexture(t);
    const again = await EngineCache.getTexture2D('assets/a.png', gl);
    expect(again).not.toBe(t);
  });
});

describe('shader sources', () => {
  it('fetches a shader once and caches its text', async () => {
    const first = await EngineCache.loadShaderSource('assets/shaders/a.frag');
    const second = await EngineCache.loadShaderSource('assets/shaders/a.frag');
    expect(first).toBe('body of assets/shaders/a.frag');
    expect(second).toBe(first);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('rejects when the shader cannot be fetched', async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, status: 404, text: async () => '' });
    await expect(EngineCache.loadShaderSource('missing.frag')).rejects.toThrow();
  });

  it('P8 (fixed): two requests at the same time share one fetch', async () => {
    await Promise.all([
      EngineCache.loadShaderSource('assets/shaders/a.frag'),
      EngineCache.loadShaderSource('assets/shaders/a.frag'),
    ]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('meshes', () => {
  it('parses an OBJ once and returns the same mesh data', async () => {
    const a = await EngineCache.getMeshDataFromObj('assets/cube.obj');
    const b = await EngineCache.getMeshDataFromObj('assets/cube.obj');
    expect(a).toBe(b);
    expect(a).toEqual({ parsedFrom: 'body of assets/cube.obj' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('P9 (fixed): a failed OBJ fetch rejects instead of parsing the error page', async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, status: 404, text: async () => '<html>404</html>' });
    await expect(EngineCache.getMeshDataFromObj('missing.obj')).rejects.toThrow();
  });
});

describe('URI resolver', () => {
  it('loads from the resolved URL but caches by the stored URI', async () => {
    EngineCache.setUriResolver((uri) => uri.replace('asset://', 'blob:resolved/'));
    const a = await EngineCache.loadShaderSource('asset://42');
    const b = await EngineCache.loadShaderSource('asset://42');
    expect(fetchMock).toHaveBeenCalledWith('blob:resolved/42');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(a).toBe(b);
  });

  it('accepts an async resolver', async () => {
    EngineCache.setUriResolver(async (uri) => `https://cdn.test/${uri}`);
    await EngineCache.getMeshDataFromObj('cube.obj');
    expect(fetchMock).toHaveBeenCalledWith('https://cdn.test/cube.obj');
  });
});

describe('built-in resources (P7)', () => {
  it('serves the engine shaders without fetching', async () => {
    const src = await EngineCache.loadShaderSource('assets/shaders/frag/default-lit.frag');
    expect(src).toContain('void main');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('default textures are built in, also under their old asset paths', async () => {
    const white = await EngineCache.getWhiteTexture(gl);
    expect(white.textureUri).toBe('builtin://white');
    expect(await EngineCache.resolveUri('assets/images/default/normal.jpg')).toMatch(/^data:image\/png;base64,/);
    expect(await EngineCache.resolveUri('builtin://missing')).toMatch(/^data:image\/png;base64,/);
  });

  it('built-in textures ignore a custom loader', async () => {
    const custom = { loadText: vi.fn(), loadImage: vi.fn() };
    EngineCache.setLoader(custom);
    try {
      const white = await EngineCache.getWhiteTexture(gl);
      const photo = await EngineCache.getTexture2D('asset://42', gl);
      expect(white.loader).not.toBe(custom);
      expect(photo.loader).toBe(custom);
    } finally {
      EngineCache.setLoader(null);
    }
  });
});

describe('loader', () => {
  it('a custom loader replaces fetch for text', async () => {
    const loader = {
      loadText: vi.fn(async (uri: string) => `custom ${uri}`),
      loadImage: vi.fn(),
    };
    EngineCache.setLoader(loader);
    try {
      expect(await EngineCache.loadShaderSource('a.frag')).toBe('custom a.frag');
      expect(fetchMock).not.toHaveBeenCalled();
    } finally {
      EngineCache.setLoader(null);
    }
  });

  it('reports what each manager holds', async () => {
    await EngineCache.getTexture2D('assets/a.png', gl);
    await EngineCache.loadShaderSource('a.frag');
    const [stats] = EngineCache.stats();
    expect(stats.textures.entries).toBe(1);
    expect(stats.shaders.entries).toBe(1);
  });
});

describe('clear', () => {
  it('forgets cached entries', async () => {
    const a = await EngineCache.getTexture2D('assets/a.png', gl);
    EngineCache.clear();
    const b = await EngineCache.getTexture2D('assets/a.png', gl);
    expect(b).not.toBe(a);
  });

  it.fails('P1: clearing frees the GPU textures it forgets', async () => {
    const a = await EngineCache.getTexture2D('assets/a.png', gl);
    EngineCache.clear();
    expect(a.destroy).toHaveBeenCalled();
  });
});
