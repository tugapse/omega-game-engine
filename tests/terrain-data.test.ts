/** Terrain data: chunks, shared borders, heights and normals, relief. */
import { describe, expect, it } from 'vitest';
import { cellHeight, decodeHeights, encodeHeights, TerrainGrid } from '../src/terrain/terrain-data';
import { generateRelief, Noise2D } from '../src/terrain/terrain-noise';

const small = () => new TerrainGrid({ resolution: 8, size: 16, heightRange: [-10, 50], splatResolution: 8 });

describe('TerrainGrid', () => {
  it('refuses a resolution that is not a power of two', () => {
    expect(() => new TerrainGrid({ resolution: 10, size: 16, heightRange: [0, 1], splatResolution: 8 })).toThrow();
  });

  it('a new chunk copies the borders of its neighbours', () => {
    const g = small();
    const a = g.add(0, 0);
    a.heights.forEach((_, k) => (a.heights[k] = k * 0.1));
    const b = g.add(1, 0);
    for (let j = 0; j <= 8; j++) expect(b.vertex(0, j)).toBeCloseTo(a.vertex(8, j));
    expect(b.vertex(4, 4)).toBe(0);
  });

  it('a write on a border or corner reaches every chunk that holds it', () => {
    const g = small();
    for (const [x, z] of [[0, 0], [1, 0], [0, 1], [1, 1]]) g.add(x, z);
    g.setVertexHeight(8, 8, 5); // the shared corner
    expect(g.holders(8, 8)).toHaveLength(4);
    expect(g.get(0, 0)!.vertex(8, 8)).toBe(5);
    expect(g.get(1, 0)!.vertex(0, 8)).toBe(5);
    expect(g.get(0, 1)!.vertex(8, 0)).toBe(5);
    expect(g.get(1, 1)!.vertex(0, 0)).toBe(5);
    g.setVertexHeight(8, 3, 2); // a shared edge
    expect(g.get(0, 0)!.vertex(8, 3)).toBe(2);
    expect(g.get(1, 0)!.vertex(0, 3)).toBe(2);
  });

  it('heightAt follows the two triangles of each cell', () => {
    expect(cellHeight(0, 1, 0, 1, 0.5, 0.5)).toBeCloseTo(0.5);
    // Above the diagonal the (1,0) corner does not count.
    expect(cellHeight(0, 10, 0, 0, 0.2, 0.6)).toBeCloseTo(0);
    expect(cellHeight(0, 10, 0, 0, 0.6, 0.2)).toBeCloseTo(4);
    const g = small();
    const c = g.add(0, 0);
    c.heights.fill(3);
    expect(g.heightAt(5, 7)).toBeCloseTo(3);
    expect(g.heightAt(-1, 5)).toBeUndefined();
  });

  it('heightAt and normalAt agree on both sides of a border', () => {
    const g = small();
    g.add(0, 0); g.add(1, 0);
    generateRelief(g, { seed: 4, scale: 10, amplitude: 8 });
    const x = 16;
    for (const z of [1.3, 6.1, 11.7]) {
      const left = g.get(0, 0)!.heightAtLocal(16, z);
      const right = g.get(1, 0)!.heightAtLocal(0, z);
      expect(left).toBeCloseTo(right, 5);
      const na = g.normalAt(x - 1e-6, z)!, nb = g.normalAt(x + 1e-6, z)!;
      for (let k = 0; k < 3; k++) expect(na[k]).toBeCloseTo(nb[k], 3);
    }
  });

  it('normals point up on flat ground and lean away from a slope', () => {
    const g = small();
    const c = g.add(0, 0);
    expect(Array.from(g.normalAt(4, 4)!)).toEqual([0, 1, 0]);
    // Rising towards +x: the normal leans towards -x.
    for (let j = 0; j <= 8; j++) for (let i = 0; i <= 8; i++) c.heights[j * 9 + i] = i * 2;
    const n = g.normalAt(8, 8)!;
    expect(n[0]).toBeLessThan(0);
    expect(n[1]).toBeGreaterThan(0);
    expect(n[2]).toBeCloseTo(0);
  });

  it('lists the free cells around the chunks', () => {
    const g = small();
    g.add(0, 0); g.add(1, 0);
    const free = g.freeNeighbours().map(([x, z]) => `${x},${z}`).sort();
    expect(free).toEqual(['-1,0', '0,-1', '0,1', '1,-1', '1,1', '2,0']);
  });
});

describe('heights in 16 bits', () => {
  it('keep their value to within the step of the range', () => {
    const h = new Float32Array([-10, 0, 12.345, 50]);
    const back = decodeHeights(encodeHeights(h, [-10, 50]), [-10, 50]);
    h.forEach((v, i) => expect(Math.abs(back[i] - v)).toBeLessThan(60 / 65535));
  });
});

describe('relief', () => {
  it('the same seed gives the same heights, another seed others', () => {
    const a = new Noise2D(3), b = new Noise2D(3), c = new Noise2D(4);
    expect(a.get(1.7, -3.2)).toBe(b.get(1.7, -3.2));
    expect(a.get(1.7, -3.2)).not.toBe(c.get(1.7, -3.2));
  });

  it('stays inside its amplitude', () => {
    const g = small();
    g.add(0, 0);
    generateRelief(g, { seed: 9, scale: 8, amplitude: 20, base: 5 });
    const [lo, hi] = g.get(0, 0)!.heightBounds();
    expect(lo).toBeGreaterThanOrEqual(-5);
    expect(hi).toBeLessThanOrEqual(15);
    expect(hi - lo).toBeGreaterThan(1);
  });
});
