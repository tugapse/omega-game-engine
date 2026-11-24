/** Terrain layers: the rules, the textures made in code, the material saved. */
import { describe, expect, it, vi } from 'vitest';

// The GL enums read WebGL2RenderingContext constants when imported; Node has none.
vi.hoisted(() => {
  (globalThis as any).WebGL2RenderingContext ??= new Proxy({}, { get: () => 0 });
});
import { defaultLayers, makeLayer, packLayerUniforms, terrainAutoWeights } from '../src/terrain/terrain-rules';
import { groundTexture, GROUND_KINDS } from '../src/terrain/terrain-textures';
import { TerrainMaterial } from '../src/terrain/terrain-material';

const sum = (w: Float32Array) => w.reduce((a, b) => a + b, 0);

describe('terrain rules', () => {
  const layers = defaultLayers(); // grass, dirt (slope > 20), rock (slope > 34), snow (height > 55, slope < 42)

  it('put grass on low flat ground, rock on cliffs, snow high up', () => {
    expect(terrainAutoWeights(layers, 5, 2, 0)[0]).toBeCloseTo(1);
    expect(terrainAutoWeights(layers, 5, 60, 0)[2]).toBeCloseTo(1);
    expect(terrainAutoWeights(layers, 90, 10, 0)[3]).toBeCloseTo(1);
    expect(terrainAutoWeights(layers, 20, 27, 0)[1]).toBeGreaterThan(0.9);
  });

  it('always sum to one, the later layers covering the earlier', () => {
    for (const [h, s, n] of [[0, 0, 0], [56, 21, 0.3], [30, 34, -0.4], [200, 89, 0.5]]) {
      expect(sum(terrainAutoWeights(layers, h, s, n))).toBeCloseTo(1, 5);
    }
  });

  it('a layer off the rules is only painted', () => {
    const l = [makeLayer('a', 'grass'), makeLayer('b', 'sand', { auto: false })];
    expect(terrainAutoWeights(l, 0, 0, 0)[1]).toBe(0);
  });

  it('pack eight vec4 per uniform', () => {
    const u = packLayerUniforms(layers);
    expect(u.tiling.length).toBe(32);
    expect(Array.from(u.slope.slice(8, 11))).toEqual([34, 90, 4]);
    expect(u.tiling[4 * 3 + 3]).toBe(1);
  });
});

describe('ground textures', () => {
  it('tile: across the wrap the texels change no more than between neighbours', () => {
    for (const kind of GROUND_KINDS) {
      const t = groundTexture(kind, 64);
      const h = (x: number, y: number) => t.albedo[(y * 64 + x) * 4 + 3];
      const step = (a: number, b: number) => { let d = 0; for (let y = 0; y < 64; y++) d += Math.abs(h(a, y) - h(b, y)); return d / 64; };
      let inside = 0;
      for (let x = 0; x < 63; x++) inside += step(x, x + 1);
      expect(step(63, 0), kind).toBeLessThan((inside / 63) * 2 + 2);
    }
  });

  it('have normals that point out of the surface', () => {
    const t = groundTexture('rock', 64);
    for (let i = 0; i < 64 * 64; i += 97) expect(t.normal[i * 4 + 2]).toBeGreaterThan(128);
  });
});

describe('TerrainMaterial', () => {
  it('saves and loads its layers', async () => {
    const m = new TerrainMaterial();
    m.layers[1].slope = [25, 80];
    m.heightBlend = 0.5;
    const back = new TerrainMaterial();
    await back.fromJson(JSON.parse(JSON.stringify(m.toJsonObject())));
    expect(back.layers.map((l) => l.ground)).toEqual(['grass', 'dirt', 'rock', 'snow']);
    expect(back.layers[1].slope).toEqual([25, 80]);
    expect(back.heightBlend).toBe(0.5);
  });
});
