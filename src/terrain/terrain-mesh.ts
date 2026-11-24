// A chunk's mesh as plain arrays: the vertices of its height grid, then a
// skirt (a copy of the border vertices hung below it), and index lists for
// each level of detail. No WebGL, so it is tested in Node.
//
// Vertex (i, j) of the grid is number j·(N+1) + i. The skirt follows: side 0
// (j = 0), side 1 (i = N), side 2 (j = N), side 3 (i = 0), N+1 vertices each,
// k along the side, so skirt vertex k of side s is (N+1)² + s·(N+1) + k.
// Chunks drawn at different levels of detail leave cracks along their shared
// border; the skirts hang down into them and hide them.
import { TerrainChunkData, TerrainGrid } from './terrain-data';

/** Levels of detail: level L draws every 2^L-th vertex. */
export const TERRAIN_LODS = 4;

/** Vertices of a chunk mesh: the grid and the skirt. */
export function chunkVertexCount(n: number): number {
  return (n + 1) * (n + 1) + 4 * (n + 1);
}

/** The grid vertex under skirt vertex k of side s. */
export function skirtSource(n: number, side: number, k: number): [number, number] {
  switch (side) {
    case 0: return [k, 0];
    case 1: return [n, k];
    case 2: return [k, n];
    default: return [0, k];
  }
}

/**
 * The triangles of level `lod`: the grid every 2^lod vertices (the same
 * diagonal as heightAt), then the skirt walls, both ways round so they show
 * from either side whatever the culling.
 */
export function chunkIndices(n: number, lod: number): Uint32Array {
  const st = Math.min(1 << lod, n);
  const cells = n / st;
  const w = n + 1;
  const out = new Uint32Array(cells * cells * 6 + 4 * cells * 12);
  let o = 0;
  for (let j = 0; j < n; j += st) {
    for (let i = 0; i < n; i += st) {
      const a = j * w + i, b = (j + st) * w + i, c = (j + st) * w + i + st, d = j * w + i + st;
      out[o++] = a; out[o++] = b; out[o++] = c;
      out[o++] = a; out[o++] = c; out[o++] = d;
    }
  }
  const skirt = w * w;
  for (let side = 0; side < 4; side++) {
    for (let k = 0; k < n; k += st) {
      const [i0, j0] = skirtSource(n, side, k), [i1, j1] = skirtSource(n, side, k + st);
      const g0 = j0 * w + i0, g1 = j1 * w + i1;
      const s0 = skirt + side * w + k, s1 = skirt + side * w + k + st;
      out[o++] = g0; out[o++] = s0; out[o++] = s1;
      out[o++] = g0; out[o++] = s1; out[o++] = g1;
      out[o++] = g0; out[o++] = s1; out[o++] = s0;
      out[o++] = g0; out[o++] = g1; out[o++] = s1;
    }
  }
  return out;
}

/**
 * Writes a chunk's vertices: positions in the chunk's own space (its corner
 * at the origin), smooth normals read across the borders, and UVs 0 to 1 over
 * the chunk (for its splat). The skirt hangs `skirtDepth` m below the border.
 */
export function fillChunkVertices(
  grid: TerrainGrid, c: TerrainChunkData, skirtDepth: number,
  positions: Float32Array, normals: Float32Array, uvs: Float32Array,
): void {
  const n = c.resolution, w = n + 1, s = c.spacing;
  const gi0 = c.cx * n, gj0 = c.cz * n;
  const nrm = new Float32Array(3);
  for (let j = 0; j <= n; j++) {
    for (let i = 0; i <= n; i++) {
      const v = j * w + i;
      positions[v * 3] = i * s;
      positions[v * 3 + 1] = c.heights[v];
      positions[v * 3 + 2] = j * s;
      grid.vertexNormal(gi0 + i, gj0 + j, nrm as any);
      normals[v * 3] = nrm[0]; normals[v * 3 + 1] = nrm[1]; normals[v * 3 + 2] = nrm[2];
      uvs[v * 2] = i / n;
      uvs[v * 2 + 1] = j / n;
    }
  }
  const skirt = w * w;
  for (let side = 0; side < 4; side++) {
    for (let k = 0; k <= n; k++) {
      const [i, j] = skirtSource(n, side, k);
      const g = j * w + i, v = skirt + side * w + k;
      positions[v * 3] = positions[g * 3];
      positions[v * 3 + 1] = positions[g * 3 + 1] - skirtDepth;
      positions[v * 3 + 2] = positions[g * 3 + 2];
      normals[v * 3] = normals[g * 3]; normals[v * 3 + 1] = normals[g * 3 + 1]; normals[v * 3 + 2] = normals[g * 3 + 2];
      uvs[v * 2] = uvs[g * 2];
      uvs[v * 2 + 1] = uvs[g * 2 + 1];
    }
  }
}

/**
 * The level of detail for a chunk `distance` m away (from the camera to the
 * nearest point of its box): level L up to distances[L], the last beyond.
 */
export function chooseLod(distance: number, distances: number[]): number {
  for (let l = 0; l < distances.length; l++) if (distance < distances[l]) return l;
  return Math.min(distances.length, TERRAIN_LODS - 1);
}
