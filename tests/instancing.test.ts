/** Instances: packing them, and the sphere around them for culling. */
import { describe, expect, it } from 'vitest';
import { createSphere } from '../src/core/render/culling';
import { INSTANCE_FLOATS, instanceBounds, packInstance } from '../src/core/render/instancing';

describe('instancing', () => {
  it('packs an instance into 8 floats', () => {
    const data = new Float32Array(2 * INSTANCE_FLOATS);
    packInstance(data, 1, 1, 2, 3, 0.5, 2, 3, 0.25, 4);
    expect(Array.from(data.subarray(8))).toEqual([1, 2, 3, 0.5, 2, 3, 0.25, 4]);
    packInstance(data, 0, 5, 6, 7);
    expect(Array.from(data.subarray(0, 8))).toEqual([5, 6, 7, 0, 1, 1, 0.5, 0]);
  });

  it('bounds every instance with the mesh scaled up', () => {
    const data = new Float32Array(3 * INSTANCE_FLOATS);
    packInstance(data, 0, 0, 0, 0, 0, 1, 1);
    packInstance(data, 1, 10, 0, 0, 0, 1, 2);
    packInstance(data, 2, 0, 0, 10, 0, 1, 1);
    const s = createSphere();
    expect(instanceBounds(s, data, 3, { center: new Float32Array([0, 0.5, 0]), radius: 0.5 })).toBe(true);
    expect(Array.from(s.center)).toEqual([5, 0, 5]);
    // Half the box's diagonal plus the mesh's reach (1) at the largest scale (2).
    expect(s.radius).toBeCloseTo(Math.hypot(10, 0, 10) / 2 + 2, 5);
    for (const [x, z] of [[0, 0], [10, 0], [0, 10]]) expect(Math.hypot(x - 5, z - 5) + 2).toBeLessThanOrEqual(s.radius + 1e-6);
    expect(instanceBounds(s, data, 0, { center: new Float32Array(3), radius: 1 })).toBe(false);
  });
});
