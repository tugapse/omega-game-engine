// Growing the terrain: a new chunk beside the others, with the same relief as
// the rest (a height function goes on past the edge), bent near its borders
// so it meets what is there now, which may have been sculpted.
import { TerrainChunkData, TerrainGrid } from './terrain-data';

/**
 * Fills chunk (cx, cz), already added to the grid (and so holding its
 * neighbours' border heights), from `relief` (terrain-space x, z → height).
 * Within `blend` metres of a border it shares, the relief is shifted so it
 * meets that border; the shared vertices keep their heights exactly.
 */
export function fillChunk(grid: TerrainGrid, cx: number, cz: number, relief: (x: number, z: number) => number, blend = 32): TerrainChunkData {
  const c = grid.get(cx, cz);
  if (!c) throw new Error(`no chunk at ${cx},${cz}`);
  const n = grid.settings.resolution, n1 = n + 1, s = c.spacing;
  // The anchors: border vertices another chunk holds, with how far the relief misses them.
  const anchors: { i: number; j: number; off: number }[] = [];
  const shared = new Uint8Array(n1 * n1);
  for (let k = 0; k <= n; k++) {
    for (const [i, j] of [[k, 0], [k, n], [0, k], [n, k]]) {
      if (shared[j * n1 + i] || grid.holders(cx * n + i, cz * n + j).length < 2) continue;
      shared[j * n1 + i] = 1;
      anchors.push({ i, j, off: c.heights[j * n1 + i] - relief(c.originX + i * s, c.originZ + j * s) });
    }
  }
  const reach = blend / s;
  for (let j = 0; j <= n; j++) {
    for (let i = 0; i <= n; i++) {
      if (shared[j * n1 + i]) continue;
      const base = relief(c.originX + i * s, c.originZ + j * s);
      // Inverse distance weights over the anchors within reach, faded out by the nearest.
      let sum = 0, weights = 0, nearest = Infinity;
      for (const a of anchors) {
        const di = a.i - i, dj = a.j - j;
        if (Math.abs(di) > reach || Math.abs(dj) > reach) continue;
        const d2 = di * di + dj * dj;
        const w = 1 / (d2 * d2);
        sum += a.off * w;
        weights += w;
        nearest = Math.min(nearest, d2);
      }
      let h = base;
      if (weights > 0) {
        const t = Math.min(Math.sqrt(nearest) / reach, 1);
        const fade = 1 - t * t * (3 - 2 * t);
        h += (sum / weights) * fade;
      }
      c.heights[j * n1 + i] = h;
    }
  }
  c.heightVersion++;
  return c;
}
