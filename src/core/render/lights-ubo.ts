import { vec3 } from "gl-matrix";
import { EntityType } from "../../enums/entity-type.enum";
import { DirectionalLight } from "../../entities/lights/directional-light";
import { Light } from "../../entities/lights/light";
import { PointLight } from "../../entities/lights/point-light";
import { SpotLight } from "../../entities/lights/spot-light";

export const MAX_DIRECTIONAL_LIGHTS = 5;
export const MAX_POINT_LIGHTS = 20;
export const MAX_SPOT_LIGHTS = 20;
/** Uniform block binding point of `LightsBlock` (CameraBlock is 0). */
export const LIGHTS_BINDING_POINT = 1;

/**
 * std140 layout of `LightsBlock` (functions/light.frag), in vec4 slots.
 * Exported for the tests; the shader declares the same order.
 */
export const LIGHTS_LAYOUT = (() => {
  let slot = 0;
  const take = (n: number) => { const at = slot; slot += n; return at; };
  return {
    ambient: take(1),
    counts: take(1), // ivec4: directional, point, spot
    dirDirection: take(MAX_DIRECTIONAL_LIGHTS),
    dirColor: take(MAX_DIRECTIONAL_LIGHTS), // w: shadow slot, -1 none
    pointPosition: take(MAX_POINT_LIGHTS), // w: range
    pointColor: take(MAX_POINT_LIGHTS), // w: shadow slot
    pointAtten: take(MAX_POINT_LIGHTS), // constant, linear, quadratic
    spotPosition: take(MAX_SPOT_LIGHTS), // w: range
    spotDirection: take(MAX_SPOT_LIGHTS),
    spotColor: take(MAX_SPOT_LIGHTS), // w: shadow slot
    spotCone: take(MAX_SPOT_LIGHTS), // cos inner, cos outer
    spotAtten: take(MAX_SPOT_LIGHTS),
    slots: slot,
  };
})();

const DEFAULT_AMBIENT = [0.01, 0.01, 0.01, 1];

/** Packs a frame's lights into the std140 floats of LightsBlock. */
export function packLights(lights: Light[], shadowSlots: Map<Light, number> = new Map(), out?: Float32Array): Float32Array {
  const L = LIGHTS_LAYOUT;
  const data = out ?? new Float32Array(L.slots * 4);
  data.fill(0);
  const ints = new Int32Array(data.buffer, data.byteOffset, data.length);
  const set = (slot: number, x: number, y: number, z: number, w: number) => data.set([x, y, z, w], slot * 4);
  const intensity = (l: Light) => [l.color.r * l.color.a, l.color.g * l.color.a, l.color.b * l.color.a] as const;
  const slotOf = (l: Light) => shadowSlots.get(l) ?? -1;

  const ambient = lights.find((l) => l.entityType === EntityType.LIGHT_AMBIENT);
  data.set(ambient ? ambient.color.toVec4() : DEFAULT_AMBIENT, L.ambient * 4);

  const dirs = lights.filter((l) => l.entityType === EntityType.LIGHT_DIRECTIONAL).slice(0, MAX_DIRECTIONAL_LIGHTS) as DirectionalLight[];
  const points = lights.filter((l) => l.entityType === EntityType.LIGHT_POINT).slice(0, MAX_POINT_LIGHTS) as PointLight[];
  const spots = lights.filter((l) => l.entityType === EntityType.LIGHT_SPOT).slice(0, MAX_SPOT_LIGHTS) as SpotLight[];
  ints.set([dirs.length, points.length, spots.length, 0], L.counts * 4);

  const d = vec3.create();
  dirs.forEach((l, i) => {
    vec3.normalize(d, l.direction);
    set(L.dirDirection + i, d[0], d[1], d[2], 0);
    set(L.dirColor + i, ...intensity(l), slotOf(l));
  });
  points.forEach((l, i) => {
    const p = l.transform.worldPosition;
    set(L.pointPosition + i, p[0], p[1], p[2], l.range);
    set(L.pointColor + i, ...intensity(l), slotOf(l));
    set(L.pointAtten + i, l.attenuation.constant, l.attenuation.linear, l.attenuation.quadratic, 0);
  });
  const rad = Math.PI / 180;
  spots.forEach((l, i) => {
    const p = l.transform.worldPosition;
    vec3.normalize(d, l.toLightDirection);
    set(L.spotPosition + i, p[0], p[1], p[2], l.range);
    set(L.spotDirection + i, d[0], d[1], d[2], 0);
    set(L.spotColor + i, ...intensity(l), slotOf(l));
    // Cone angles are stored in degrees.
    set(L.spotCone + i, Math.cos(l.coneAngles.inner * rad), Math.cos(l.coneAngles.outer * rad), 0, 0);
    set(L.spotAtten + i, l.attenuation.constant, l.attenuation.linear, l.attenuation.quadratic, 0);
  });
  return data;
}

/** The lights of a frame in one uniform buffer, bound at LIGHTS_BINDING_POINT. */
export class LightsUBO {
  private readonly buffer: WebGLBuffer;
  private readonly data = new Float32Array(LIGHTS_LAYOUT.slots * 4);

  constructor(private readonly gl: WebGL2RenderingContext) {
    this.buffer = gl.createBuffer()!;
    gl.bindBuffer(gl.UNIFORM_BUFFER, this.buffer);
    gl.bufferData(gl.UNIFORM_BUFFER, this.data.byteLength, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.UNIFORM_BUFFER, null);
  }

  update(lights: Light[], shadowSlots?: Map<Light, number>): void {
    packLights(lights, shadowSlots, this.data);
    const gl = this.gl;
    gl.bindBuffer(gl.UNIFORM_BUFFER, this.buffer);
    gl.bufferSubData(gl.UNIFORM_BUFFER, 0, this.data);
    gl.bindBuffer(gl.UNIFORM_BUFFER, null);
    gl.bindBufferBase(gl.UNIFORM_BUFFER, LIGHTS_BINDING_POINT, this.buffer);
  }

  dispose(): void {
    this.gl.deleteBuffer(this.buffer);
  }
}
