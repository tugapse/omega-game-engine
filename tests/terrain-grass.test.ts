/** Grass: the tuft, the tiles of tufts and how they thin out with distance. */
import { describe, expect, it, vi } from 'vitest';

// The GL enums read WebGL2RenderingContext constants when imported; Node has none.
vi.hoisted(() => {
  (globalThis as any).WebGL2RenderingContext ??= new Proxy({}, { get: () => 0 });
});
import { GRASS_PRESETS, grassFalloff, grassTile, grassTuft, INSTANCE_FLOATS, packInstance, splitGrass, TerrainGrid } from '../src';

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

describe('kinds of grass', () => {
  it('a tuft takes its shape from the options, and the old arguments still work', () => {
    expect(grassTuft(5, 3, 3).vertices).toEqual(grassTuft().vertices);
    expect(grassTuft({ blades: 9 }).vertices.length).toBe(9 * 7);
    expect(grassTuft({ segments: 5 }).vertices.length).toBe(5 * 11);
    const reach = (o: object) => Math.max(...grassTuft(o).vertices.map((v) => Math.hypot(v[0], v[2])));
    expect(reach({ spread: 0.1, lean: 0 })).toBeLessThan(reach({ spread: 1, lean: 0 }));
    expect(reach({ lean: 1 })).toBeGreaterThan(reach({ lean: 0 }));
    const top = (o: object) => Math.max(...grassTuft(o).vertices.map((v) => v[1]));
    expect(top({ droop: 1 })).toBeLessThan(top({ droop: 0 }));
  });

  it('splits tufts among kinds by weight, scaled to each, keeping every tuft', () => {
    const n = 2000, data = new Float32Array(n * INSTANCE_FLOATS);
    for (let i = 0; i < n; i++) packInstance(data, i, (i % 50) * 0.7, 0, Math.floor(i / 50) * 0.7, 0, 1, 1);
    const parts = splitGrass(data, n, [{ weight: 3, height: 0.5, width: 0.3 }, { weight: 1, height: 1.2, width: 0.2 }], 1, 0);
    expect(parts[0].count + parts[1].count).toBe(n);
    expect(parts[0].count / n).toBeGreaterThan(0.65);
    expect(parts[0].count / n).toBeLessThan(0.85);
    expect(parts[1].data[5]).toBeCloseTo(1.2, 5);
    expect(parts[0].data[4]).toBeCloseTo(0.3, 5);
    expect(splitGrass(data, n, [{ weight: 0, height: 1, width: 1 }, { weight: 1, height: 1, width: 1 }], 1, 0.7)[1].count).toBe(n);
  });

  it('in patches, neighbours mostly share a kind', () => {
    const n = 2500, data = new Float32Array(n * INSTANCE_FLOATS);
    for (let i = 0; i < n; i++) packInstance(data, i, (i % 50) * 2, 0, Math.floor(i / 50) * 2, 0, 1, 1);
    const kindAt = (patches: number) => {
      const parts = splitGrass(data, n, [{ weight: 1, height: 1, width: 1 }, { weight: 1, height: 2, width: 1 }], 4, patches);
      const map = new Map<string, number>();
      parts.forEach((p, k) => { for (let i = 0; i < p.count; i++) map.set(`${p.data[i * 8]},${p.data[i * 8 + 2]}`, k); });
      let same = 0;
      for (let i = 0; i < n - 1; i++) if (i % 50 !== 49 && map.get(`${(i % 50) * 2},${Math.floor(i / 50) * 2}`) === map.get(`${(i % 50 + 1) * 2},${Math.floor(i / 50) * 2}`)) same++;
      return same / (n - 50);
    };
    expect(kindAt(1)).toBeGreaterThan(kindAt(0) + 0.1);
  });

  it('every preset makes a tuft', () => {
    for (const k of GRASS_PRESETS) expect(grassTuft(k.tuft).indices.length, k.name).toBeGreaterThan(0);
  });
});
