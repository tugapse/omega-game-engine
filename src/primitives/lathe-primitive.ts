import { vec2, vec3 } from 'gl-matrix';
import { MeshData } from '../core/mesh';

/**
 * A surface of revolution: a profile of [radius, height] points turned
 * around the Y axis (a bowling pin, a vase, a bottle, a half pipe with a
 * partial sweep). List the profile from top to bottom; a point with radius 0
 * closes the shape there. Normals are smooth along the profile; UV u goes
 * around, v goes down the profile by length.
 */
export class LathePrimitive extends MeshData {
  public static override instanciate(): LathePrimitive {
    return new LathePrimitive([[0, 1], [1, 0], [0, -1]]);
  }

  /**
   * @param profile [radius, height] points, top to bottom.
   * @param segments Divisions around the axis.
   * @param sweep Angle turned, in radians (2π = closed).
   * @param startAngle Where the sweep starts, in radians from +X towards +Z.
   */
  constructor(profile: ArrayLike<number>[], segments = 24, sweep = Math.PI * 2, startAngle = 0) {
    const vertices: vec3[] = [];
    const normals: vec3[] = [];
    const uvs: vec2[] = [];
    const indices: number[] = [];
    const n = profile.length;
    // v by length along the profile.
    const lengths = [0];
    for (let i = 1; i < n; i++) {
      lengths.push(lengths[i - 1] + Math.hypot(profile[i][0] - profile[i - 1][0], profile[i][1] - profile[i - 1][1]));
    }
    const total = lengths[n - 1] || 1;
    for (let i = 0; i < n; i++) {
      // Profile tangent (going down) from the neighbours; the outward normal is (-dy, dr).
      const a = profile[Math.max(0, i - 1)], b = profile[Math.min(n - 1, i + 1)];
      const dr = b[0] - a[0], dy = b[1] - a[1];
      const len = Math.hypot(dr, dy) || 1;
      const nr = -dy / len, ny = dr / len;
      const [r, y] = [profile[i][0], profile[i][1]];
      for (let j = 0; j <= segments; j++) {
        const u = j / segments;
        const theta = startAngle + u * sweep;
        const c = Math.cos(theta), s = Math.sin(theta);
        vertices.push([r * c, y, r * s]);
        normals.push([nr * c, ny, nr * s]);
        uvs.push([u, lengths[i] / total]);
      }
    }
    // Same layout and winding as SpherePrimitive (top to bottom, counter-clockwise outside).
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < segments; j++) {
        const first = i * (segments + 1) + j;
        const second = first + segments + 1;
        indices.push(first, first + 1, second);
        indices.push(first + 1, second + 1, second);
      }
    }
    super(vertices, normals, uvs, indices);
  }
}
