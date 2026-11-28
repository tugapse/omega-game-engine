/** The shaping tools: ramps, terraces, stamps, and their world-space versions on the behaviour. */
import { describe, expect, it, vi } from 'vitest';

// The GL enums read WebGL2RenderingContext constants when imported; Node has none.
vi.hoisted(() => {
  (globalThis as any).WebGL2RenderingContext ??= new Proxy({}, { get: () => 0 });
});
import { vec3 } from 'gl-matrix';
import { ramp, SceneEntity, stamp, stampProfile, TerrainBehaviour, TerrainGrid, terrace, terraceHeight } from '../src';

const brush = { radius: 20, strength: 1, hardness: 0.5 };

function grid(...cells: [number, number][]): TerrainGrid {
  const g = new TerrainGrid();
  for (const [x, z] of cells) g.add(x, z);
  return g;
}

/** A tilted plane: height = x / 4. */
function slope(g: TerrainGrid): void {
  const n = g.settings.resolution;
  for (const c of g.all()) for (let j = 0; j <= n; j++) for (let i = 0; i <= n; i++) c.heights[j * (n + 1) + i] = (c.originX + i * c.spacing) / 4;
}

describe('ramp', () => {
  it('slopes straight from one end to the other', () => {
    const g = grid([0, 0], [1, 0]);
    expect(ramp(g, { x: 40, z: 64, h: 0 }, { x: 200, z: 64, h: 32 }, 10, 0.5)).not.toBeNull();
    expect(g.heightAt(40, 64)).toBeCloseTo(0, 3);
    expect(g.heightAt(120, 64)).toBeCloseTo(16, 3);
    expect(g.heightAt(200, 64)).toBeCloseTo(32, 3);
  });

  it('crosses the border between chunks without a step', () => {
    const g = grid([0, 0], [1, 0]);
    ramp(g, { x: 40, z: 64, h: 0 }, { x: 200, z: 64, h: 32 }, 10, 0.5);
    expect(g.heightAt(127.5, 64)! - g.heightAt(128.5, 64)!).toBeCloseTo(-0.2, 2);
  });

  it('fades out across its width and leaves the rest alone', () => {
    const g = grid([0, 0], [1, 0]);
    ramp(g, { x: 40, z: 64, h: 0 }, { x: 200, z: 64, h: 32 }, 10, 0.5);
    const middle = g.heightAt(120, 64)!, edge = g.heightAt(120, 72)!;
    expect(edge).toBeGreaterThan(0);
    expect(edge).toBeLessThan(middle);
    expect(g.heightAt(120, 80)).toBe(0);
    expect(g.heightAt(230, 64)).toBe(0);
  });

  it('does nothing outside the terrain', () => {
    expect(ramp(grid([0, 0]), { x: -100, z: -100, h: 0 }, { x: -60, z: -100, h: 10 }, 5, 0.5)).toBeNull();
  });
});

describe('terraces', () => {
  it('has flat steps with risers between them', () => {
    expect(terraceHeight(10.5, 5)).toBe(10);
    expect(terraceHeight(14.5, 5)).toBe(15);
    expect(terraceHeight(12.5, 5)).toBeCloseTo(12.5, 6);
  });

  it('pulls a slope into steps under the brush only', () => {
    const g = grid([0, 0]);
    slope(g);
    for (let k = 0; k < 60; k++) terrace(g, 64, 64, brush, 1 / 30, 5);
    expect(g.heightAt(61, 64)).toBeCloseTo(15, 1);
    expect(g.heightAt(64, 64)).toBeCloseTo(15, 1);
    expect(g.heightAt(120, 64)).toBe(30);
  });
});

describe('stamps', () => {
  it('fades to nothing at the edge', () => {
    for (const shape of ['hill', 'crater', 'plateau', 'volcano'] as const) {
      expect(stampProfile(shape, 1)).toBe(0);
      expect(Math.abs(stampProfile(shape, 0.99))).toBeLessThan(0.02);
    }
  });

  it('raises a hill, digs a crater with a rim, tops a volcano with a hollow', () => {
    expect(stampProfile('hill', 0)).toBe(1);
    expect(stampProfile('crater', 0)).toBeLessThan(0);
    expect(stampProfile('crater', 0.72)).toBeGreaterThan(0.3);
    expect(stampProfile('volcano', 0)).toBeLessThan(stampProfile('volcano', 0.25));
    expect(stampProfile('plateau', 0.4)).toBe(1);
  });

  it('adds its height on the ground', () => {
    const g = grid([0, 0]);
    stamp(g, 'hill', 64, 64, 30, 20);
    expect(g.heightAt(64, 64)).toBeCloseTo(20, 4);
    expect(g.heightAt(64, 100)).toBe(0);
  });
});

describe('the behaviour, in world space', () => {
  /** A terrain on an entity not in a scene: its transform is the identity. */
  function terrain(): TerrainBehaviour {
    const t = new TerrainBehaviour({} as WebGL2RenderingContext);
    t.grid.add(0, 0);
    t.grid.add(1, 0);
    new SceneEntity('Terrain').addBehaviour(t);
    return t;
  }

  it('a ramp and a stamp are one undo step each', () => {
    const t = terrain();
    expect(t.rampAt(vec3.fromValues(40, 0, 64), vec3.fromValues(200, 32, 64), 10, 0.5)).toBe(true);
    expect(t.stampAt('hill', vec3.fromValues(64, 0, 20), 15, 10)).toBe(true);
    expect(t.grid.heightAt(120, 64)).toBeCloseTo(16, 3);
    t.undo();
    expect(t.grid.heightAt(64, 20)).toBe(0);
    expect(t.grid.heightAt(120, 64)).toBeCloseTo(16, 3);
    t.undo();
    expect(t.grid.heightAt(120, 64)).toBe(0);
    expect(t.history.canUndo).toBe(false);
  });

  it('inside an open stroke a stamp joins it', () => {
    const t = terrain();
    t.beginStroke('heights');
    t.stampAt('hill', vec3.fromValues(64, 0, 64), 15, 10);
    t.stampAt('crater', vec3.fromValues(150, 0, 64), 15, 10);
    t.endStroke();
    t.undo();
    expect(t.grid.heightAt(64, 64)).toBe(0);
    expect(t.history.canUndo).toBe(false);
  });

  it('terraces and erodes in a stroke', () => {
    const t = terrain();
    slope(t.grid);
    t.beginStroke('heights');
    for (let k = 0; k < 30; k++) t.terraceAt(vec3.fromValues(64, 0, 64), brush, 1 / 30, 5);
    let seed = 1;
    const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    expect(t.erodeAt(vec3.fromValues(150, 0, 64), brush, 1 / 10, random)).toBe(true);
    t.endStroke();
    expect(t.grid.heightAt(64, 64)).toBeCloseTo(15, 0);
    t.undo();
    expect(t.grid.heightAt(64, 64)).toBeCloseTo(16, 4);
  });
});
