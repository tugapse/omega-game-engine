// Heightmaps in and out: the whole terrain as one grid of 16-bit heights
// (raw, like the .r16 files other tools use) or 8-bit grey (a PNG through a
// canvas). The map covers the box around every chunk, a sample per vertex;
// where there is no chunk it holds the bottom of the range.
import { encodeHeights, TerrainGrid } from './terrain-data';

export interface Heightmap {
  width: number;
  height: number;
  /** Row by row along z, 0 to 65535 over the grid's height range. */
  data: Uint16Array;
}

/** The chunk cells' box: lowest and highest cx, cz. */
export function gridBounds(grid: TerrainGrid): { cx0: number; cz0: number; cx1: number; cz1: number } | null {
  const all = grid.all();
  if (!all.length) return null;
  return {
    cx0: Math.min(...all.map((c) => c.cx)), cz0: Math.min(...all.map((c) => c.cz)),
    cx1: Math.max(...all.map((c) => c.cx)), cz1: Math.max(...all.map((c) => c.cz)),
  };
}

/** The terrain as one heightmap. */
export function exportHeightmap(grid: TerrainGrid): Heightmap | null {
  const b = gridBounds(grid);
  if (!b) return null;
  const n = grid.settings.resolution;
  const width = (b.cx1 - b.cx0 + 1) * n + 1, height = (b.cz1 - b.cz0 + 1) * n + 1;
  const heights = new Float32Array(width * height).fill(grid.settings.heightRange[0]);
  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      const h = grid.vertexHeight(b.cx0 * n + i, b.cz0 * n + j);
      if (h !== undefined) heights[j * width + i] = h;
    }
  }
  return { width, height, data: encodeHeights(heights, grid.settings.heightRange) };
}

/** Writes a heightmap over the whole terrain's box, stretched to fit (bilinear). */
export function importHeightmap(grid: TerrainGrid, map: Heightmap): void {
  const b = gridBounds(grid);
  if (!b) return;
  const n = grid.settings.resolution;
  const [lo, hi] = grid.settings.heightRange;
  const k = (hi - lo) / 65535;
  const width = (b.cx1 - b.cx0 + 1) * n, height = (b.cz1 - b.cz0 + 1) * n;
  const sample = (x: number, y: number) => {
    const fx = (x / width) * (map.width - 1), fy = (y / height) * (map.height - 1);
    const x0 = Math.floor(fx), y0 = Math.floor(fy);
    const x1 = Math.min(x0 + 1, map.width - 1), y1 = Math.min(y0 + 1, map.height - 1);
    const tx = fx - x0, ty = fy - y0;
    const at = (xx: number, yy: number) => map.data[yy * map.width + xx];
    const top = at(x0, y0) + (at(x1, y0) - at(x0, y0)) * tx;
    const bottom = at(x0, y1) + (at(x1, y1) - at(x0, y1)) * tx;
    return lo + (top + (bottom - top) * ty) * k;
  };
  for (const c of grid.all()) {
    for (let j = 0; j <= n; j++) {
      for (let i = 0; i <= n; i++) {
        c.heights[j * (n + 1) + i] = sample((c.cx - b.cx0) * n + i, (c.cz - b.cz0) * n + j);
      }
    }
    c.heightVersion++;
  }
}

/** 16-bit little-endian bytes (.r16) and back. */
export function heightmapToRaw(map: Heightmap): Uint8Array {
  const out = new Uint8Array(map.data.length * 2);
  const view = new DataView(out.buffer);
  map.data.forEach((v, i) => view.setUint16(i * 2, v, true));
  return out;
}

/** A square .r16 file (its side is the square root of its samples). */
export function rawToHeightmap(bytes: Uint8Array): Heightmap {
  const count = Math.floor(bytes.length / 2);
  const side = Math.round(Math.sqrt(count));
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const data = new Uint16Array(side * side);
  for (let i = 0; i < data.length; i++) data[i] = view.getUint16(i * 2, true);
  return { width: side, height: side, data };
}

/** 8-bit grey pixels (RGBA, from a canvas) to a heightmap and back. */
export function rgbaToHeightmap(rgba: Uint8ClampedArray | Uint8Array, width: number, height: number): Heightmap {
  const data = new Uint16Array(width * height);
  for (let i = 0; i < data.length; i++) data[i] = rgba[i * 4] * 257;
  return { width, height, data };
}

export function heightmapToRgba(map: Heightmap): Uint8ClampedArray {
  const out = new Uint8ClampedArray(map.width * map.height * 4);
  for (let i = 0; i < map.data.length; i++) {
    const g = map.data[i] >> 8;
    out[i * 4] = out[i * 4 + 1] = out[i * 4 + 2] = g;
    out[i * 4 + 3] = 255;
  }
  return out;
}
