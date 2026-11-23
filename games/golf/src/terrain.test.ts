import { describe, expect, it } from 'vitest';
import { downhill, HeightField } from './terrain';

describe('terrain', () => {
  it('samples heights between grid points and says which way the ground falls', () => {
    const g = new HeightField(-10, -10, 2, 11, 11).shape((x, z) => 0.02 * x - 0.01 * z);
    expect(g.height(1, 1)).toBeCloseTo(0.01);
    const d = downhill(g, 0, 0);
    expect(d.x).toBeLessThan(-0.8); // falls towards -x
    expect(d.z).toBeGreaterThan(0.3); // and towards +z
    expect(d.slope).toBeCloseTo(Math.hypot(0.02, 0.01), 3);
  });
  it('is out of bounds outside its area', () => {
    const g = new HeightField(0, 0, 1, 5, 5).paint(() => 'green');
    expect(g.surface(2, 2)).toBe('green');
    expect(g.surface(-1, 2)).toBe('out');
  });
});
