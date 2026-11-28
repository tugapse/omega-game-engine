/** Hydraulic erosion under a brush. */
import { describe, expect, it } from 'vitest';
import { TerrainGrid } from '../src/terrain/terrain-data';
import { erode } from '../src/terrain/terrain-erosion';
import { stamp } from '../src/terrain/terrain-shapes';
import { seededRandom } from '../src/terrain/terrain-noise';

const brush = { radius: 20, strength: 1, hardness: 0.5 };

function hill(): TerrainGrid {
  const g = new TerrainGrid();
  g.add(0, 0);
  const n = g.settings.resolution, c = g.get(0, 0)!;
  for (let j = 0; j <= n; j++) for (let i = 0; i <= n; i++) c.heights[j * (n + 1) + i] = (i * c.spacing) / 4;
  stamp(g, 'hill', 64, 64, 40, 25);
  return g;
}

describe('erosion', () => {
  it('moves earth down a slope without making or losing much of it', () => {
    const g = hill();
    const total = () => g.all()[0].heights.reduce((a, b) => a + b, 0);
    const before = total(), top = g.heightAt(64, 64)!;
    expect(erode(g, 64, 64, brush, 400, seededRandom(3))).not.toBeNull();
    expect(g.heightAt(64, 64)).not.toBe(top);
    expect(Math.abs(total() - before) / before).toBeLessThan(0.01);
  });

  it('leaves the ground outside its reach alone', () => {
    const g = hill();
    const far = [[64, 90], [100, 64], [30, 30]].map(([x, z]) => g.heightAt(x, z));
    erode(g, 64, 64, { ...brush, radius: 10 }, 300, seededRandom(5));
    expect([[64, 90], [100, 64], [30, 30]].map(([x, z]) => g.heightAt(x, z))).toEqual(far);
  });

  it('gives the same result for the same drops', () => {
    const a = hill(), b = hill();
    erode(a, 64, 64, brush, 200, seededRandom(9));
    erode(b, 64, 64, brush, 200, seededRandom(9));
    expect(Array.from(a.get(0, 0)!.heights)).toEqual(Array.from(b.get(0, 0)!.heights));
  });
});
