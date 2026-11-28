/** Scattering plants by the layers that cover the ground, and the meshes they are drawn with. */
import { describe, expect, it, vi } from 'vitest';

// The GL enums read WebGL2RenderingContext constants when imported; Node has none.
vi.hoisted(() => {
  (globalThis as any).WebGL2RenderingContext ??= new Proxy({}, { get: () => 0 });
});
import {
  defaultTrees, mergePlaced, scatter, SceneEntity, speciesFit, TerrainBehaviour, TerrainGrid, treeParts,
} from '../src';

function flat(height = 5): TerrainGrid {
  const g = new TerrainGrid();
  g.add(0, 0);
  g.get(0, 0)!.heights.fill(height);
  return g;
}

/** Layer 0 everywhere. */
const grass = (_x: number, _z: number, out: Float32Array) => { out.fill(0); out[0] = 1; return out; };
const trees = defaultTrees();

describe('scatter', () => {
  it('gives the same plants for the same chunk and numbers', () => {
    const g = flat();
    const a = scatter(g, g.get(0, 0)!, trees, grass, { density: 1 }), b = scatter(g, g.get(0, 0)!, trees, grass, { density: 1 });
    expect(a.length).toBeGreaterThan(20);
    expect(b).toEqual(a);
  });

  it('a lower density keeps some of the same plants and adds none', () => {
    const g = flat(), c = g.get(0, 0)!;
    const many = scatter(g, c, trees, grass, { density: 1 }), few = scatter(g, c, trees, grass, { density: 0.3 });
    expect(few.length).toBeLessThan(many.length);
    const at = new Set(many.map((t) => `${t.x},${t.z}`));
    for (const t of few) expect(at.has(`${t.x},${t.z}`)).toBe(true);
    expect(scatter(g, c, trees, grass, { density: 0 })).toEqual([]);
  });

  it('grows only where its layers cover the ground, and not under the water', () => {
    const g = flat(), c = g.get(0, 0)!;
    const rock = (_x: number, _z: number, out: Float32Array) => { out.fill(0); out[2] = 1; return out; };
    expect(scatter(g, c, trees, rock, { density: 1 })).toEqual([]);
    expect(scatter(g, c, trees, grass, { density: 1, water: 10 })).toEqual([]);
    const half = (x: number, _z: number, out: Float32Array) => { out.fill(0); out[x < 64 ? 0 : 2] = 1; return out; };
    const items = scatter(g, c, trees, half, { density: 1 });
    expect(items.length).toBeGreaterThan(5);
    for (const t of items) expect(t.x).toBeLessThan(64);
  });

  it('picks pines up high and broadleaves low down, all standing on the ground', () => {
    const low = flat(0), high = flat(30);
    const kinds = (g: TerrainGrid) => scatter(g, g.get(0, 0)!, trees, grass, { density: 1, woods: 0 }).map((t) => t.species);
    expect(kinds(low).every((k) => k === 1)).toBe(true);
    expect(kinds(high).every((k) => k === 0)).toBe(true);
    for (const t of scatter(low, low.get(0, 0)!, trees, grass, { density: 1 })) expect(t.y).toBe(0);
  });

  it('a species fits by its layers, its heights and its slope', () => {
    const cover = new Float32Array(8);
    cover[0] = 0.5; cover[1] = 0.5;
    expect(speciesFit({ layers: [0] }, cover, 0, 0)).toBe(0.5);
    expect(speciesFit({ layers: [0, 1] }, cover, 0, 0)).toBe(1);
    expect(speciesFit({ layers: [0, 1], maxSlope: 30 }, cover, 0, 35)).toBe(0);
    expect(speciesFit({ layers: [0, 1], heights: [10, 20], fade: 2 }, cover, 0, 0)).toBe(0);
    expect(speciesFit({ layers: [0, 1], heights: [10, 20], fade: 2 }, cover, 15, 0)).toBe(1);
  });
});

describe('what the ground is', () => {
  function terrain(): TerrainBehaviour {
    const t = new TerrainBehaviour({} as WebGL2RenderingContext);
    t.grid.add(0, 0);
    new SceneEntity('Terrain').addBehaviour(t);
    return t;
  }

  it('is the rules where nothing is painted, the painting where it is', () => {
    const t = terrain();
    const w = t.layerWeightsAt(64, 64);
    expect(w[0]).toBeCloseTo(1, 5); // flat and low: the first layer (grass)
    const c = t.grid.get(0, 0)!;
    c.splat[0].fill(0);
    for (let k = 0; k < c.splat[0].length; k += 4) c.splat[0][k + 2] = 255; // rock painted all over
    const p = t.layerWeightsAt(64, 64);
    expect(p[2]).toBeCloseTo(1, 5);
    expect(p[0]).toBeCloseTo(0, 5);
    expect(Array.from(t.layerWeightsAt(-10, 64)).every((v) => v === 0)).toBe(true);
  });

  it('turns steep ground to the slope layers, where grass trees stop', () => {
    const t = terrain();
    const c = t.grid.get(0, 0)!, n = t.grid.settings.resolution;
    for (let j = 0; j <= n; j++) for (let i = 0; i <= n; i++) c.heights[j * (n + 1) + i] = i * c.spacing * 1.2; // about 50°
    expect(t.layerWeightsAt(64, 64)[0]).toBeLessThan(0.2);
    const items = scatter(t.grid, c, trees, (x, z, out) => t.layerWeightsAt(x, z, out), { density: 1 });
    expect(items.length).toBeLessThan(10);
  });
});

describe('meshes', () => {
  it('merges placed copies, moved, scaled and turned', () => {
    const { crown } = treeParts('broadleaf');
    const m = mergePlaced(crown, [{ at: [10, 0, 0], scale: [2, 3, 2], turn: 0 }, { at: [0, 0, 10], scale: [1, 1, 1], turn: Math.PI / 2 }]);
    expect(m.vertices.length).toBe(crown.vertices.length * 2);
    expect(m.indices.length).toBe(crown.indices.length * 2);
    const top = Math.max(...m.vertices.slice(0, crown.vertices.length).map((v) => v[1]));
    expect(top).toBeCloseTo(3, 1);
  });

  it('trees are a plant unit high, standing on the ground', () => {
    for (const kind of ['pine', 'broadleaf'] as const) {
      const { trunk, crown } = treeParts(kind);
      const ys = [...trunk.vertices, ...crown.vertices].map((v) => v[1]);
      expect(Math.max(...ys)).toBeCloseTo(1, 2);
      expect(Math.min(...ys)).toBeCloseTo(-0.05, 2);
    }
  });
});
