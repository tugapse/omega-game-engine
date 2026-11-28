/** Loading chunks into a terrain that is already drawing some. */
import { describe, expect, it, vi } from 'vitest';

// The GL enums read WebGL2RenderingContext constants when imported; Node has none.
vi.hoisted(() => {
  (globalThis as any).WebGL2RenderingContext ??= new Proxy({}, { get: () => 0 });
});
import { Scene, SceneEntity, TerrainBehaviour } from '../src';

describe('loadChunks', () => {
  it('draws the loaded chunks, not the ones they replaced', () => {
    const scene = new Scene();
    // A context that does nothing: no drawing happens here.
    const gl = new Proxy({}, { get: () => () => null }) as unknown as WebGL2RenderingContext;
    const t = new TerrainBehaviour(gl);
    t.createShader = () => new Proxy({}, { get: () => () => true }) as any;
    t.grid.add(0, 0);
    t.grid.add(1, 0);
    const e = new SceneEntity('Terrain');
    e.addBehaviour(t);
    scene.addEntity(e);
    t.sync();
    const before = t.rendererOf(0, 0);
    expect(before).toBeDefined();
    t.grid.get(0, 0)!.heights.fill(9);
    const saved = t.saveChunks();
    t.loadChunks(saved);
    t.sync();
    for (const c of t.grid.all()) expect((t.rendererOf(c.cx, c.cz) as any).chunk === c).toBe(true);
    expect(before && (before as any).chunk === t.grid.get(0, 0)).toBe(false);
    expect(t.grid.heightAt(10, 10)).toBeCloseTo(9, 2);
  });
});
