/** Pointer gestures and the lathe primitive (no DOM or GPU needed). */
import { vec3 } from 'gl-matrix';
import { describe, expect, it } from 'vitest';
import { Pointer, PointerState } from '../src/core/pointer';
import { LathePrimitive } from '../src/primitives/lathe-primitive';

describe('Pointer', () => {
  it('tracks a pointer from down to up and measures the release velocity', () => {
    const seen: PointerState[] = [];
    const off = Pointer.onUp((p) => seen.push(p));
    Pointer._down(7, 'touch', 100, 500, 0);
    expect(Pointer.primary?.id).toBe(7);
    for (let t = 10; t <= 300; t += 10) Pointer._move(7, 100 + t * 0.1, 500 - t * 2, t); // 2000 px/s upwards
    Pointer._up(7, 130, -100, 300);
    off();
    expect(Pointer.active.size).toBe(0);
    expect(seen).toHaveLength(1);
    const v = Pointer.velocity(seen[0], 100);
    expect(v.y).toBeCloseTo(-2000);
    expect(v.x).toBeCloseTo(100);
    // The history keeps only the last historyMs.
    expect(seen[0].history[seen[0].history.length - 1].time - seen[0].history[0].time).toBeLessThanOrEqual(Pointer.historyMs);
  });
});

describe('LathePrimitive', () => {
  it('turns the profile around Y with outward normals and v along the length', () => {
    const profile = [[0, 1], [1, 1], [1, 0], [0, 0]]; // a closed cylinder
    const mesh = new LathePrimitive(profile, 8);
    expect(mesh.vertices).toHaveLength(4 * 9);
    expect(mesh.indices).toHaveLength(3 * 6 * 8);
    // A side vertex at angle 0: radius 1, normal mostly +X (smoothed with the caps).
    const i = 1 * 9;
    expect(Array.from(mesh.vertices[i])).toEqual([1, 1, 0]);
    expect(mesh.normals[i][0]).toBeGreaterThan(0.5);
    expect(mesh.uvs[3 * 9][1]).toBeCloseTo(1);
    // Triangles face outwards: the normal of the first side triangle points away from the axis.
    const [a, b, c] = mesh.indices.slice(6 * 8, 6 * 8 + 3).map((k) => mesh.vertices[k]);
    const n = vec3.cross(vec3.create(), vec3.sub(vec3.create(), b, a), vec3.sub(vec3.create(), c, a));
    const mid = vec3.scale(vec3.create(), vec3.add(vec3.create(), vec3.add(vec3.create(), a, b), c), 1 / 3);
    expect(n[0] * mid[0] + n[2] * mid[2]).toBeGreaterThan(0);
  });
});
