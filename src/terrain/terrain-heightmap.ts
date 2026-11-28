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

/** The box around every chunk in terrain space (one chunk's box when there are none). */
export function gridArea(grid: TerrainGrid): { x0: number; z0: number; x1: number; z1: number } {
  const b = gridBounds(grid), s = grid.settings.size;
  if (!b) return { x0: 0, z0: 0, x1: s, z1: s };
  return { x0: b.cx0 * s, z0: b.cz0 * s, x1: (b.cx1 + 1) * s, z1: (b.cz1 + 1) * s };
}

/**
 * A height function sampled on a size × size grid over a terrain-space box
 * (row by row along z, the corners included), with its lowest and highest
 * values: for previews and maps of a relief before it is written.
 */
export function sampleField(height: (x: number, z: number) => number, area: { x0: number; z0: number; x1: number; z1: number }, size: number): { heights: Float32Array; size: number; min: number; max: number } {
  const heights = new Float32Array(size * size);
  let min = Infinity, max = -Infinity;
  const sx = (area.x1 - area.x0) / (size - 1), sz = (area.z1 - area.z0) / (size - 1);
  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      const h = height(area.x0 + i * sx, area.z0 + j * sz);
      heights[j * size + i] = h;
      if (h < min) min = h;
      if (h > max) max = h;
    }
  }
  return { heights, size, min, max };
}

/**
 * A box blur `r` pixels each way, run twice (nearly a Gaussian), for 8-bit
 * images: their 256 greys are steps of a metre or so, which show as terraces.
 */
export function smoothHeightmap(map: Heightmap, r = 2): Heightmap {
  const { width: w, height: h } = map;
  const src = Float32Array.from(map.data);
  const tmp = new Float32Array(w * h);
  const pass = (from: Float32Array, to: Float32Array, horizontal: boolean) => {
    const lines = horizontal ? h : w, len = horizontal ? w : h;
    for (let l = 0; l < lines; l++) {
      for (let k = 0; k < len; k++) {
        let sum = 0;
        for (let d = -r; d <= r; d++) {
          const q = Math.min(Math.max(k + d, 0), len - 1);
          sum += from[horizontal ? l * w + q : q * w + l];
        }
        to[horizontal ? l * w + k : k * w + l] = sum / (2 * r + 1);
      }
    }
  };
  for (let n = 0; n < 2; n++) { pass(src, tmp, true); pass(tmp, src, false); }
  const data = new Uint16Array(w * h);
  for (let i = 0; i < data.length; i++) data[i] = Math.round(src[i]);
  return { width: w, height: h, data };
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
