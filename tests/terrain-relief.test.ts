/** Reliefs as height functions (twist, island, images), previews, smoothing, and growing a chunk. */
import { describe, expect, it, vi } from 'vitest';

// The GL enums read WebGL2RenderingContext constants when imported; Node has none.
vi.hoisted(() => {
  (globalThis as any).WebGL2RenderingContext ??= new Proxy({}, { get: () => 0 });
});
import {
  DEFAULT_RELIEF, fillChunk, generateFrom, generateRelief, gridArea, heightField, Noise2D, relief, sampleField,
  SceneEntity, smoothHeightmap, TerrainBehaviour, TerrainGrid,
} from '../src';

const AREA = { x0: 0, z0: 0, x1: 384, z1: 384 };

function grid(...cells: [number, number][]): TerrainGrid {
  const g = new TerrainGrid();
  for (const [x, z] of cells) g.add(x, z);
  return g;
}

describe('heightField', () => {
  it('is the plain relief without twist or island, so generateRelief gives what it gave before', () => {
    const o = { seed: 4, scale: 300, amplitude: 80, octaves: 5, persistence: 0.45, ridges: 0.3, sharpness: 1.4, base: 6 };
    const g = grid([0, 0], [1, 0]);
    generateRelief(g, o);
    const noise = new Noise2D(4), full = { ...DEFAULT_RELIEF, ...o };
    const c = g.get(1, 0)!, n = g.settings.resolution;
    for (const [i, j] of [[0, 0], [17, 90], [128, 128]]) {
      expect(c.heights[j * (n + 1) + i]).toBe(Math.fround(relief(noise, c.originX + i * c.spacing, c.originZ + j * c.spacing, full)));
    }
  });

  it('gives the same relief for the same numbers, another for another seed', () => {
    const a = heightField({ seed: 7 }, AREA), b = heightField({ seed: 7 }, AREA), c = heightField({ seed: 8 }, AREA);
    expect(a(100, 200)).toBe(b(100, 200));
    expect(a(100, 200)).not.toBe(c(100, 200));
  });

  it('sinks the edges for an island and keeps the middle', () => {
    const island = heightField({ amplitude: 0, base: 20, island: 1 }, AREA);
    expect(island(192, 192)).toBeCloseTo(20, 4);
    expect(island(2, 2)).toBeCloseTo(14, 1); // base − amplitude/2 − 6
    expect(heightField({ amplitude: 0, base: 20, island: 1 })(2, 2)).toBe(20); // no area, no island
  });

  it('twisting moves the relief but not its range much', () => {
    const p0 = sampleField(heightField({ seed: 3, scale: 200, amplitude: 60 }, AREA), AREA, 64);
    const p1 = sampleField(heightField({ seed: 3, scale: 200, amplitude: 60, warp: 0.6 }, AREA), AREA, 64);
    expect(Array.from(p1.heights)).not.toEqual(Array.from(p0.heights));
    expect(Math.abs((p1.max - p1.min) - (p0.max - p0.min))).toBeLessThan(30);
  });

  it('reads heights from a grey image stretched over the area', () => {
    const image = { width: 2, height: 1, data: new Uint16Array([0, 65535]) };
    const h = heightField({ amplitude: 100, base: 10 }, AREA, image);
    expect(h(0, 0)).toBeCloseTo(-40, 4);
    expect(h(384, 0)).toBeCloseTo(60, 4);
    expect(h(192, 100)).toBeCloseTo(10, 4);
  });

  it('generateFrom writes every chunk so shared borders match', () => {
    const g = grid([0, 0], [1, 0], [0, 1]);
    generateFrom(g, heightField({ warp: 0.4, island: 0.5 }, gridArea(g)));
    const n = g.settings.resolution, a = g.get(0, 0)!, b = g.get(1, 0)!;
    for (let j = 0; j <= n; j += 16) expect(a.heights[j * (n + 1) + n]).toBe(b.heights[j * (n + 1)]);
    expect(gridArea(g)).toEqual({ x0: 0, z0: 0, x1: 256, z1: 256 });
  });
});

describe('sampling and smoothing', () => {
  it('samples a field corner to corner with its range', () => {
    const f = sampleField((x, z) => x + z, { x0: 0, z0: 0, x1: 10, z1: 10 }, 11);
    expect(f.heights[0]).toBe(0);
    expect(f.heights[120]).toBe(20);
    expect([f.min, f.max]).toEqual([0, 20]);
  });

  it('smooths the steps of an 8-bit image and keeps flat ground flat', () => {
    const w = 32, data = new Uint16Array(w * w);
    for (let j = 0; j < w; j++) for (let i = 0; i < w; i++) data[j * w + i] = (i < 16 ? 0 : 255) * 257;
    const s = smoothHeightmap({ width: w, height: w, data });
    expect(s.data[5 * w + 2]).toBe(0);
    expect(s.data[5 * w + 30]).toBe(65535);
    expect(s.data[5 * w + 16]).toBeGreaterThan(0);
    expect(s.data[5 * w + 16]).toBeLessThan(65535);
  });
});

describe('growing', () => {
  it('meets a sculpted neighbour exactly and is the relief further in', () => {
    const g = grid([0, 0]);
    const n = g.settings.resolution;
    g.get(0, 0)!.heights.fill(50);
    g.add(1, 0);
    fillChunk(g, 1, 0, (x) => x / 10, 32);
    const c = g.get(1, 0)!;
    for (let j = 0; j <= n; j++) expect(c.heights[j * (n + 1)]).toBe(50);
    expect(g.heightAt(129, 64)).toBeGreaterThan(40);
    expect(g.heightAt(200, 64)).toBeCloseTo(20, 5);
  });

  it('meets a chunk that only touches it at a corner', () => {
    const g = grid([0, 0]);
    g.get(0, 0)!.heights.fill(30);
    g.add(1, 1);
    fillChunk(g, 1, 1, () => 0, 32);
    expect(g.heightAt(128, 128)).toBe(30);
    expect(g.heightAt(131, 131)).toBeGreaterThan(5);
    expect(g.heightAt(200, 200)).toBe(0);
  });

  it('TerrainBehaviour.growChunk adds and fills a chunk, and refuses a taken cell', () => {
    const t = new TerrainBehaviour({} as WebGL2RenderingContext);
    t.grid.add(0, 0);
    t.grid.get(0, 0)!.heights.fill(12);
    new SceneEntity('Terrain').addBehaviour(t);
    t.growChunk(0, 1, () => 0);
    expect(t.grid.count).toBe(2);
    expect(t.grid.heightAt(64, 128)).toBe(12);
    expect(t.grid.heightAt(64, 250)).toBe(0);
    expect(() => t.growChunk(0, 0, () => 0)).toThrow();
  });
});
