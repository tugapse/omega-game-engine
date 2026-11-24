/** The terrain brush: sculpting, painting, undo, baking the rules. */
import { describe, expect, it } from 'vitest';
import { TerrainGrid } from '../src/terrain/terrain-data';
import { brushFalloff, fillSplat, paint, sculpt, TerrainHistory } from '../src/terrain/terrain-brush';

const grid = () => {
  const g = new TerrainGrid({ resolution: 16, size: 16, heightRange: [-50, 50], splatResolution: 16 });
  for (const [x, z] of [[0, 0], [1, 0], [0, 1], [1, 1]]) g.add(x, z);
  return g;
};
const brush = { radius: 4, strength: 0.5, hardness: 0.3 };

describe('brush falloff', () => {
  it('is full inside the hard part and fades to nothing at the edge', () => {
    expect(brushFalloff(0.1, 0.3)).toBe(1);
    expect(brushFalloff(0.65, 0.3)).toBeGreaterThan(0.3);
    expect(brushFalloff(0.65, 0.3)).toBeLessThan(0.7);
    expect(brushFalloff(1, 0.3)).toBe(0);
  });
});

describe('sculpt', () => {
  it('raises the ground under the brush, most in the middle, across a chunk corner', () => {
    const g = grid();
    sculpt(g, 'raise', 16, 16, brush, 0.5);
    const mid = g.heightAt(16, 16)!, side = g.heightAt(19, 16)!;
    expect(mid).toBeGreaterThan(1);
    expect(side).toBeGreaterThan(0);
    expect(side).toBeLessThan(mid);
    expect(g.heightAt(25, 25)).toBe(0);
    // The shared corner moved in all four chunks.
    expect(g.get(0, 0)!.vertex(16, 16)).toBe(g.get(1, 1)!.vertex(0, 0));
  });

  it('lowers, flattens towards a height and smooths a spike', () => {
    const g = grid();
    sculpt(g, 'lower', 8, 8, brush, 0.2);
    expect(g.heightAt(8, 8)!).toBeLessThan(0);
    for (let k = 0; k < 30; k++) sculpt(g, 'flatten', 8, 8, brush, 0.1, 3);
    expect(g.heightAt(8, 8)!).toBeCloseTo(3, 0);
    g.setVertexHeight(24, 24, 10);
    sculpt(g, 'smooth', 24, 24, { ...brush, strength: 0.9 }, 0.5);
    expect(g.vertexHeight(24, 24)!).toBeLessThan(5);
  });

  it('marks the neighbours of a changed border as changed', () => {
    const g = grid();
    const before = g.get(1, 0)!.heightVersion;
    sculpt(g, 'raise', 14, 4, { ...brush, radius: 1 }, 0.1); // inside chunk 0,0, a vertex from the border
    expect(g.get(1, 0)!.heightVersion).toBeGreaterThan(before);
  });
});

describe('paint', () => {
  it('grows the layer painted and shrinks the others, never past full', () => {
    const g = grid();
    for (let k = 0; k < 40; k++) paint(g, 2, 8, 8, brush, 0.1);
    const c = g.get(0, 0)!;
    const t = (8 * 16 + 8) * 4;
    expect(c.splat[0][t + 2]).toBe(255);
    paint(g, 5, 8, 8, brush, 0.3);
    const w2 = c.splat[0][t + 2], w5 = c.splat[1][t + 1];
    expect(w5).toBeGreaterThan(0);
    expect(w2).toBeLessThan(255);
    expect(w2 + w5).toBeLessThanOrEqual(256);
  });

  it('erasing fades the painting back to nothing', () => {
    const g = grid();
    for (let k = 0; k < 20; k++) paint(g, 1, 8, 8, brush, 0.1);
    for (let k = 0; k < 60; k++) paint(g, 0, 8, 8, brush, 0.1, true);
    const t = (8 * 16 + 8) * 4;
    expect(g.get(0, 0)!.splat[0][t + 1]).toBe(0);
  });
});

describe('bake and history', () => {
  it('fillSplat writes weights that sum to 255', () => {
    const g = grid();
    fillSplat(g, (x, _z, out) => { out.fill(0); out[0] = 0.3; out[3] = 0.7 * (x > 16 ? 1 : 0.5); out[6] = x > 16 ? 0 : 0.35; return out; });
    for (const c of g.all()) {
      for (let t = 0; t < 16 * 16 * 4; t += 4 * 37) {
        const s = c.splat[0][t] + c.splat[0][t + 1] + c.splat[0][t + 2] + c.splat[0][t + 3] + c.splat[1][t] + c.splat[1][t + 1] + c.splat[1][t + 2] + c.splat[1][t + 3];
        expect(s).toBe(255);
      }
    }
  });

  it('undo and redo a whole stroke', () => {
    const g = grid();
    const h = new TerrainHistory();
    h.begin('heights');
    for (let k = 0; k < 5; k++) { h.saveAround(g, 16, 16, 4); sculpt(g, 'raise', 16, 16, brush, 0.1); }
    h.end();
    const raised = g.heightAt(16, 16)!;
    expect(raised).toBeGreaterThan(0);
    expect(h.undo(g)).toBe(true);
    expect(g.heightAt(16, 16)).toBe(0);
    expect(h.redo(g)).toBe(true);
    expect(g.heightAt(16, 16)).toBeCloseTo(raised);
    expect(h.redo(g)).toBe(false);
  });
});
