// Instances: many copies of one mesh in one draw. Each instance is 8 floats,
// two vec4 attributes read once per instance: a_instanceA = position (x, y, z)
// and a turn about y; a_instanceB = width scale (x and z), height scale (y),
// a tint (0.5 draws the colour as it is, 0 darker, 1 lighter) and a phase (for
// wind). Shaders compiled with INSTANCED read them (default.vert, shadow-caster.vert).
import { vec3 } from 'gl-matrix';
import { Sphere } from './culling';

export const INSTANCE_FLOATS = 8;
export const INSTANCE_ATTRIBUTES = ['a_instanceA', 'a_instanceB'] as const;

/** Writes instance `i` into `out`. */
export function packInstance(
  out: Float32Array, i: number, x: number, y: number, z: number,
  turn = 0, width = 1, height = 1, tint = 0.5, phase = 0,
): void {
  const k = i * INSTANCE_FLOATS;
  out[k] = x; out[k + 1] = y; out[k + 2] = z; out[k + 3] = turn;
  out[k + 4] = width; out[k + 5] = height; out[k + 6] = tint; out[k + 7] = phase;
}

/**
 * The sphere around the first `count` instances of a mesh whose own sphere is
 * `mesh` (in the renderer's space), written to `out`. False with none.
 */
export function instanceBounds(out: Sphere, data: Float32Array, count: number, mesh: Sphere): boolean {
  if (count <= 0) return false;
  let x0 = Infinity, y0 = Infinity, z0 = Infinity, x1 = -Infinity, y1 = -Infinity, z1 = -Infinity, scale = 0;
  const reach = Math.hypot(mesh.center[0], mesh.center[1], mesh.center[2]) + mesh.radius;
  for (let i = 0; i < count; i++) {
    const k = i * INSTANCE_FLOATS;
    x0 = Math.min(x0, data[k]); x1 = Math.max(x1, data[k]);
    y0 = Math.min(y0, data[k + 1]); y1 = Math.max(y1, data[k + 1]);
    z0 = Math.min(z0, data[k + 2]); z1 = Math.max(z1, data[k + 2]);
    scale = Math.max(scale, Math.abs(data[k + 4]), Math.abs(data[k + 5]));
  }
  vec3.set(out.center, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
  out.radius = Math.hypot(x1 - x0, y1 - y0, z1 - z0) / 2 + reach * scale;
  return true;
}

/** Points a program's instance attributes at `buffer` (read once per instance); returns their locations. */
export function bindInstances(gl: WebGL2RenderingContext, program: WebGLProgram, buffer: WebGLBuffer): number[] {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  return INSTANCE_ATTRIBUTES.map((name, n) => {
    const loc = gl.getAttribLocation(program, name);
    if (loc < 0) return loc;
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, INSTANCE_FLOATS * 4, n * 16);
    gl.vertexAttribDivisor(loc, 1);
    return loc;
  });
}

/** Turns them off again, so later draws read those locations per vertex as before. */
export function unbindInstances(gl: WebGL2RenderingContext, locations: number[]): void {
  for (const loc of locations) {
    if (loc < 0) continue;
    gl.vertexAttribDivisor(loc, 0);
    gl.disableVertexAttribArray(loc);
  }
}
