/** Frustum planes and bounding spheres. No GPU. */
import { mat4, vec3 } from 'gl-matrix';
import { describe, expect, it } from 'vitest';
import { frustumPlanes, localBoundingSphere, maxScale, sphereInFrustum, transformSphere } from '../src/core/render/culling';

describe('frustum culling', () => {
  const view = mat4.lookAt(mat4.create(), [0, 0, 0], [0, 0, -1], [0, 1, 0]);
  const proj = mat4.perspective(mat4.create(), Math.PI / 2, 1, 0.1, 100);
  const planes = frustumPlanes(mat4.multiply(mat4.create(), proj, view));

  it('keeps spheres in front of a perspective camera and drops the rest', () => {
    expect(sphereInFrustum(planes, vec3.fromValues(0, 0, -10), 1)).toBe(true);
    expect(sphereInFrustum(planes, vec3.fromValues(0, 0, 10), 1)).toBe(false); // behind
    expect(sphereInFrustum(planes, vec3.fromValues(0, 0, -200), 1)).toBe(false); // past far
    expect(sphereInFrustum(planes, vec3.fromValues(30, 0, -10), 1)).toBe(false); // right of the 90° cone
    expect(sphereInFrustum(planes, vec3.fromValues(10.5, 0, -10), 1)).toBe(true); // straddles the edge
  });

  it('works with an orthographic box', () => {
    const ortho = frustumPlanes(mat4.ortho(mat4.create(), -5, 5, -5, 5, 0.1, 50));
    expect(sphereInFrustum(ortho, vec3.fromValues(4, -4, -20), 0.5)).toBe(true);
    expect(sphereInFrustum(ortho, vec3.fromValues(7, 0, -20), 1)).toBe(false);
    expect(sphereInFrustum(ortho, vec3.fromValues(5.5, 0, -20), 1)).toBe(true);
  });
});

describe('bounding spheres', () => {
  it('centres the local sphere on the box and reaches the farthest vertex', () => {
    const s = localBoundingSphere({ vertices: [vec3.fromValues(-1, 0, 0), vec3.fromValues(3, 0, 0), vec3.fromValues(1, 1, 0)] } as any)!;
    expect(Array.from(s.center)).toEqual([1, 0.5, 0]);
    expect(s.radius).toBeCloseTo(Math.hypot(2, 0.5));
    expect(localBoundingSphere({ vertices: [] } as any)).toBeNull();
  });

  it('moves and grows the sphere with the model matrix', () => {
    const m = mat4.fromRotationTranslationScale(mat4.create(), [0, 0, 0, 1], [10, 0, 0], [1, 3, 2]);
    expect(maxScale(m)).toBeCloseTo(3);
    const out = transformSphere({ center: vec3.create(), radius: 0 }, { center: vec3.fromValues(1, 1, 0), radius: 2 }, m);
    expect(Array.from(out.center)).toEqual([11, 3, 0]);
    expect(out.radius).toBeCloseTo(6);
  });
});
