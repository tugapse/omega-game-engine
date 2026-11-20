/** LightsBlock packing: layout, counts, units. No GPU needed. */
import { describe, expect, it } from 'vitest';
import { LIGHTS_LAYOUT as L, MAX_POINT_LIGHTS, packLights } from '../src/core/render/lights-ubo';
import { EntityType } from '../src/enums/entity-type.enum';

const color = (r: number, g: number, b: number, a = 1) => ({ r, g, b, a, toVec4: () => [r, g, b, a] });
const light = (entityType: EntityType, extra: object = {}) =>
  ({ entityType, color: color(1, 0.5, 0.25, 0.5), transform: { worldPosition: [1, 2, 3], forward: [0, 0, -1] }, ...extra }) as any;
const vec4 = (data: Float32Array, slot: number) => Array.from(data.slice(slot * 4, slot * 4 + 4));

describe('packLights', () => {
  it('fits the std140 block the shader declares (172 vec4 = 2752 bytes)', () => {
    expect(L.slots).toBe(172);
    expect(packLights([]).byteLength).toBe(2752);
  });

  it('writes the counts as ints and a dim default ambient', () => {
    const data = packLights([light(EntityType.LIGHT_POINT, { range: 10, attenuation: { constant: 1, linear: 0, quadratic: 0 } })]);
    const ints = new Int32Array(data.buffer);
    expect(Array.from(ints.slice(L.counts * 4, L.counts * 4 + 3))).toEqual([0, 1, 0]);
    expect(vec4(data, L.ambient).map((v) => +v.toFixed(2))).toEqual([0.01, 0.01, 0.01, 1]);
  });

  it('premultiplies colour by intensity and puts range and shadow slot in w', () => {
    const p = light(EntityType.LIGHT_POINT, { range: 12, attenuation: { constant: 1, linear: 0.1, quadratic: 0.01 } });
    const data = packLights([p], new Map([[p, 3]]));
    expect(vec4(data, L.pointPosition)).toEqual([1, 2, 3, 12]);
    expect(vec4(data, L.pointColor)).toEqual([0.5, 0.25, 0.125, 3]);
    expect(vec4(data, L.pointAtten).map((v) => +v.toFixed(3))).toEqual([1, 0.1, 0.01, 0]);
  });

  it('converts spot cone angles from degrees', () => {
    const s = light(EntityType.LIGHT_SPOT, { range: 5, toLightDirection: [0, -1, 0], coneAngles: { inner: 60, outer: 90 }, attenuation: { constant: 1, linear: 0, quadratic: 0 } });
    const [inner, outer] = vec4(packLights([s]), L.spotCone);
    expect(inner).toBeCloseTo(0.5);
    expect(outer).toBeCloseTo(0);
  });

  it('marks lights without a shadow slot with -1 and caps the counts', () => {
    const many = Array.from({ length: MAX_POINT_LIGHTS + 5 }, () => light(EntityType.LIGHT_POINT, { range: 1, attenuation: { constant: 1, linear: 0, quadratic: 0 } }));
    const data = packLights(many);
    expect(new Int32Array(data.buffer)[L.counts * 4 + 1]).toBe(MAX_POINT_LIGHTS);
    expect(vec4(data, L.pointColor)[3]).toBe(-1);
  });
});
