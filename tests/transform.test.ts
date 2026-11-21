/** Transform reads (position, directions, lookAt) without a draw having updated the matrices. */
import { describe, expect, it } from 'vitest';
import { vec3 } from 'gl-matrix';
import { Transform } from '../src/core/transform';

const close = (a: ArrayLike<number>, b: number[]) => b.forEach((v, i) => expect(a[i]).toBeCloseTo(v, 4));

describe('Transform', () => {
  it('reports a new position at once', () => {
    const t = new Transform();
    t.setLocalPosition(1, 2, 3);
    close(t.worldPosition, [1, 2, 3]);
  });

  it('lookAt right after moving aims from the new position', () => {
    const t = new Transform();
    t.setLocalPosition(0, 5, 5);
    t.lookAt(vec3.fromValues(0, 0, 0));
    const expected = vec3.normalize(vec3.create(), vec3.fromValues(0, -5, -5));
    close(t.forward, Array.from(expected));
  });

  it('a child follows its parent without an explicit update', () => {
    const parent = new Transform();
    const child = new Transform();
    child.setParent(parent);
    child.setLocalPosition(1, 0, 0);
    parent.setLocalPosition(0, 10, 0);
    close(child.worldPosition, [1, 10, 0]);
  });

  it('keeps a child change when the parent did not move', () => {
    const parent = new Transform();
    const child = new Transform();
    child.setParent(parent);
    parent.updateMatrices();
    child.setLocalPosition(2, 0, 0);
    parent.updateMatrices();
    close(child.worldPosition, [2, 0, 0]);
  });
});

describe('Transform rotation round trip', () => {
  it('a rotation from lookAt survives toJson/fromJson', () => {
    const t = new Transform();
    t.setLocalPosition(-7, 5.5, 7);
    t.lookAt(vec3.fromValues(0, 1.2, 0));
    const forward = Array.from(t.forward);
    const copy = new Transform();
    copy.fromJson(t.toJsonObject());
    close(copy.forward, forward);
  });
});

describe('Euler angles', () => {
  it('localRotation gives back the same rotation for many orientations', () => {
    const t = new Transform();
    for (const [x, y, z] of [[10, 20, 30], [-80, 45, 170], [0, 179, 0], [45, -30, -120], [89, 10, 5]]) {
      t.setLocalRotation(x, y, z);
      t.rotate(13, -27, 41); // goes through a quaternion
      const before = Array.from(t.forward), up = Array.from(t.up);
      const [ex, ey, ez] = t.localRotation;
      const copy = new Transform();
      copy.setLocalRotation(ex, ey, ez);
      close(copy.forward, before);
      close(copy.up, up);
    }
  });
});
