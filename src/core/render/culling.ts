import { mat4, vec3 } from "gl-matrix";
import { MeshData } from "../mesh";

/** A bounding sphere in world (or local) space. */
export interface Sphere {
  center: vec3;
  radius: number;
}

export function createSphere(): Sphere {
  return { center: vec3.create(), radius: 0 };
}

/**
 * The six planes (left, right, bottom, top, near, far) of a view-projection
 * matrix, each as a, b, c, d with a unit normal pointing inside
 * (Gribb & Hartmann). Works for perspective and orthographic matrices.
 */
export function frustumPlanes(m: mat4, out = new Float32Array(24)): Float32Array {
  // gl-matrix is column-major: row r of the matrix is m[r], m[4 + r], m[8 + r], m[12 + r].
  const row = (r: number, k: number) => m[k * 4 + r];
  for (let p = 0; p < 6; p++) {
    const r = p >> 1;
    const sign = p & 1 ? -1 : 1;
    let a = row(3, 0) + sign * row(r, 0);
    let b = row(3, 1) + sign * row(r, 1);
    let c = row(3, 2) + sign * row(r, 2);
    let d = row(3, 3) + sign * row(r, 3);
    const len = Math.hypot(a, b, c) || 1;
    out[p * 4] = a / len;
    out[p * 4 + 1] = b / len;
    out[p * 4 + 2] = c / len;
    out[p * 4 + 3] = d / len;
  }
  return out;
}

/** False only when the sphere is wholly outside one of the planes. */
export function sphereInFrustum(planes: Float32Array, center: vec3, radius: number): boolean {
  for (let p = 0; p < 24; p += 4) {
    if (planes[p] * center[0] + planes[p + 1] * center[1] + planes[p + 2] * center[2] + planes[p + 3] < -radius) return false;
  }
  return true;
}

const localSpheres = new WeakMap<vec3[], Sphere>();

/**
 * The bounding sphere of a mesh in its own space (centre of its box, radius to
 * the farthest vertex), computed once per vertex array. Null when it has no vertices.
 */
export function localBoundingSphere(meshData: MeshData | undefined): Sphere | null {
  const vertices = meshData?.vertices;
  if (!vertices?.length) return null;
  const cached = localSpheres.get(vertices);
  if (cached) return cached;
  const min = vec3.fromValues(Infinity, Infinity, Infinity);
  const max = vec3.fromValues(-Infinity, -Infinity, -Infinity);
  for (const v of vertices) {
    vec3.min(min, min, v);
    vec3.max(max, max, v);
  }
  const center = vec3.lerp(vec3.create(), min, max, 0.5);
  let r2 = 0;
  for (const v of vertices) r2 = Math.max(r2, vec3.squaredDistance(center, v));
  const sphere = { center, radius: Math.sqrt(r2) };
  localSpheres.set(vertices, sphere);
  return sphere;
}

/** The largest scale of a matrix's axes (to grow a radius into world space). */
export function maxScale(m: mat4): number {
  return Math.sqrt(Math.max(
    m[0] * m[0] + m[1] * m[1] + m[2] * m[2],
    m[4] * m[4] + m[5] * m[5] + m[6] * m[6],
    m[8] * m[8] + m[9] * m[9] + m[10] * m[10],
  ));
}

/** `local` moved by `m` into `out`. */
export function transformSphere(out: Sphere, local: Sphere, m: mat4): Sphere {
  vec3.transformMat4(out.center, local.center, m);
  out.radius = local.radius * maxScale(m);
  return out;
}
