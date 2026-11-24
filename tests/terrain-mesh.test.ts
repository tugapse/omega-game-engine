/** Terrain chunk meshes: the grid, the skirt, the levels of detail. */
import { describe, expect, it } from 'vitest';
import { TerrainGrid } from '../src/terrain/terrain-data';
import { chooseLod, chunkIndices, chunkVertexCount, fillChunkVertices, skirtSource, TERRAIN_LODS } from '../src/terrain/terrain-mesh';
import { generateRelief } from '../src/terrain/terrain-noise';

describe('chunk mesh', () => {
  it('each level of detail has a quarter of the triangles of the one before (plus its skirt)', () => {
    const n = 16;
    for (let l = 0; l < TERRAIN_LODS; l++) {
      const cells = n >> l;
      expect(chunkIndices(n, l).length).toBe(cells * cells * 6 + 4 * cells * 12);
    }
  });

  it('every index is a vertex of the chunk', () => {
    const n = 8, count = chunkVertexCount(n);
    for (let l = 0; l < TERRAIN_LODS; l++) for (const i of chunkIndices(n, l)) expect(i).toBeLessThan(count);
  });

  it('the grid triangles face up', () => {
    const n = 4;
    const g = new TerrainGrid({ resolution: n, size: 4, heightRange: [0, 1], splatResolution: 4 });
    const c = g.add(0, 0);
    const count = chunkVertexCount(n);
    const p = new Float32Array(count * 3), nr = new Float32Array(count * 3), uv = new Float32Array(count * 2);
    fillChunkVertices(g, c, 1, p, nr, uv);
    const idx = chunkIndices(n, 0);
    for (let t = 0; t < n * n * 2; t++) {
      const [a, b, d] = [idx[t * 3], idx[t * 3 + 1], idx[t * 3 + 2]];
      const e1 = [p[b * 3] - p[a * 3], p[b * 3 + 2] - p[a * 3 + 2]];
      const e2 = [p[d * 3] - p[a * 3], p[d * 3 + 2] - p[a * 3 + 2]];
      // y of cross(e1, e2) with y = 0 edges: e1.z·e2.x − e1.x·e2.z
      expect(e1[1] * e2[0] - e1[0] * e2[1]).toBeGreaterThan(0);
    }
  });

  it('writes heights, the skirt below the border, and UVs over the chunk', () => {
    const n = 8;
    const g = new TerrainGrid({ resolution: n, size: 16, heightRange: [-10, 50], splatResolution: 8 });
    const c = g.add(1, 2);
    generateRelief(g, { seed: 2, scale: 8, amplitude: 6 });
    const count = chunkVertexCount(n);
    const p = new Float32Array(count * 3), nr = new Float32Array(count * 3), uv = new Float32Array(count * 2);
    fillChunkVertices(g, c, 3, p, nr, uv);
    const v = 3 * (n + 1) + 5;
    expect(p[v * 3]).toBeCloseTo(10);
    expect(p[v * 3 + 1]).toBeCloseTo(c.vertex(5, 3));
    expect(p[v * 3 + 2]).toBeCloseTo(6);
    expect(uv[v * 2]).toBeCloseTo(5 / 8);
    const [i, j] = skirtSource(n, 1, 4);
    const s = (n + 1) * (n + 1) + 1 * (n + 1) + 4;
    expect(p[s * 3 + 1]).toBeCloseTo(c.vertex(i, j) - 3);
    expect(p[s * 3]).toBeCloseTo(p[(j * (n + 1) + i) * 3]);
  });

  it('picks the level of detail by distance', () => {
    const d = [100, 200, 400];
    expect(chooseLod(50, d)).toBe(0);
    expect(chooseLod(150, d)).toBe(1);
    expect(chooseLod(300, d)).toBe(2);
    expect(chooseLod(900, d)).toBe(3);
  });
});
