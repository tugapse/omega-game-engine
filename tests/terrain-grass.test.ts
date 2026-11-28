/** Grass: the tuft, the tiles of tufts and how they thin out with distance. */
import { describe, expect, it, vi } from 'vitest';

// The GL enums read WebGL2RenderingContext constants when imported; Node has none.
vi.hoisted(() => {
  (globalThis as any).WebGL2RenderingContext ??= new Proxy({}, { get: () => 0 });
});
import { grassFalloff, grassTile, grassTuft, INSTANCE_FLOATS, TerrainGrid } from '../src';

const grass = (_x: number, _z: number, out: Float32Array) => { out.fill(0); out[0] = 1; return out; };

function flat(height = 2): TerrainGrid {
  const g = new TerrainGrid();
  g.add(0, 0);
  g.get(0, 0)!.heights.fill(height);
  return g;
}

describe('the tuft', () => {
  it('is blades from the ground to about 1 high, uv v from foot to tip', () => {
    const m = grassTuft(5, 3);
    expect(m.vertices.length).toBe(5 * 7);
    expect(m.indices.length).toBe(5 * (2 * 6 + 3));
    const ys = m.vertices.map((v) => v[1]);
    expect(Math.min(...ys)).toBe(0);
    expect(Math.max(...ys)).toBeLessThanOrEqual(1);
    m.vertices.forEach((v, i) => expect(m.uvs[i][1]).toBeCloseTo(v[1] / Math.max(...m.vertices.filter((_, k) => Math.floor(k / 7) === Math.floor(i / 7)).map((q) => q[1])), 5));
    for (const n of m.normals) expect(n[1]).toBeGreaterThan(0.9);
  });
});

describe('a tile of grass', () => {
  it('has about density tufts a square metre, on the ground, the same each time', () => {
    const g = flat();
    const a = grassTile(g, 1, 1, 16, grass, { density: 2 }), b = grassTile(g, 1, 1, 16, grass, { density: 2 });
    expect(a.count).toBeGreaterThan(16 * 16 * 2 * 0.85);
    expect(a.count).toBeLessThanOrEqual(16 * 16 * 2 * 1.1);
    expect(Array.from(a.data.subarray(0, a.count * INSTANCE_FLOATS))).toEqual(Array.from(b.data.subarray(0, b.count * INSTANCE_FLOATS)));
    for (let i = 0; i < a.count; i++) {
      const k = i * INSTANCE_FLOATS;
      expect(a.data[k]).toBeGreaterThanOrEqual(16);
      expect(a.data[k]).toBeLessThan(32);
      expect(a.data[k + 1]).toBeCloseTo(2 - 0.03, 5);
    }
  });

  it('none where its layers are not, off the terrain, or under the water', () => {
    const g = flat();
    const rock = (_x: number, _z: number, out: Float32Array) => { out.fill(0); out[2] = 1; return out; };
    expect(grassTile(g, 0, 0, 16, rock).count).toBe(0);
    expect(grassTile(g, -1, 0, 16, grass).count).toBe(0);
    expect(grassTile(g, 0, 0, 16, grass, { water: 5 }).count).toBe(0);
  });

  it('is in a random order, so its first tufts cover the whole tile', () => {
    const g = flat();
    const { data, count } = grassTile(g, 0, 0, 16, grass, { density: 3 });
    const first = Math.floor(count / 8);
    let left = 0;
    for (let i = 0; i < first; i++) if (data[i * INSTANCE_FLOATS] < 8) left++;
    expect(left / first).toBeGreaterThan(0.35);
    expect(left / first).toBeLessThan(0.65);
  });
});

describe('falloff', () => {
  it('draws all near, thins towards the edge, none beyond', () => {
    expect(grassFalloff(0, 60)).toBe(1);
    expect(grassFalloff(20, 60)).toBe(1);
    expect(grassFalloff(45, 60)).toBeLessThan(1);
    expect(grassFalloff(59.9, 60)).toBeCloseTo(0.15, 2);
    expect(grassFalloff(60, 60)).toBe(0);
  });
});
