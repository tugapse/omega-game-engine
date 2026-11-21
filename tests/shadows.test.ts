/** Shadow atlas planning: budget, tile layout, cube faces, packing. No GPU. */
import { vec3 } from 'gl-matrix';
import { describe, expect, it } from 'vitest';
import {
  ATLAS_TILES, CUBE_FACES, MAX_SHADOW_SLOTS, MAX_SHADOW_VIEWS, SHADOW_ATLAS_SIZE, SHADOWS_LAYOUT,
  cubeFaceFor, directionalMatrix, packShadows, planShadows, ShadowFilter,
} from '../src/core/render/shadows';
import { EntityType } from '../src/enums/entity-type.enum';

const light = (entityType: EntityType, position: number[], extra: object = {}) => ({
  entityType, castShadows: true, shadowDepthBias: 0.5, shadowNormalBias: 1, range: 10,
  transform: { worldPosition: vec3.fromValues(position[0], position[1], position[2]) },
  direction: vec3.fromValues(0, -1, 0.2), toLightDirection: vec3.fromValues(0, -1, 0),
  coneAngles: { inner: 20, outer: 30 }, ...extra,
}) as any;

describe('atlas layout', () => {
  it('fits the default budget in the 4096² atlas without overlaps', () => {
    const tiles = [...ATLAS_TILES.directional, ...ATLAS_TILES.spot, ...ATLAS_TILES.point];
    expect(tiles).toHaveLength(MAX_SHADOW_VIEWS);
    for (const t of tiles) {
      expect(t.x + t.size).toBeLessThanOrEqual(SHADOW_ATLAS_SIZE);
      expect(t.y + t.size).toBeLessThanOrEqual(SHADOW_ATLAS_SIZE);
    }
    for (let i = 0; i < tiles.length; i++) for (let j = i + 1; j < tiles.length; j++) {
      const a = tiles[i], b = tiles[j];
      const overlap = a.x < b.x + b.size && b.x < a.x + a.size && a.y < b.y + b.size && b.y < a.y + a.size;
      expect(overlap, `tiles ${i} and ${j}`).toBe(false);
    }
  });
});

describe('planShadows', () => {
  it('keeps the budget, nearest lights first, and skips lights that do not cast', () => {
    const eye = vec3.fromValues(0, 0, 0);
    const spots = [9, 1, 5, 3, 7].map((d) => light(EntityType.LIGHT_SPOT, [d, 0, 0]));
    const quiet = light(EntityType.LIGHT_POINT, [0, 0, 0], { castShadows: false });
    const point = light(EntityType.LIGHT_POINT, [2, 0, 0]);
    const sun = light(EntityType.LIGHT_DIRECTIONAL, [0, 50, 0]);
    const plan = planShadows([...spots, quiet, point, sun], eye, { directionalDistance: 60 });

    expect(plan.slots).toHaveLength(1 + 4 + 1);
    expect(plan.views).toHaveLength(1 + 4 + 6);
    expect(plan.slotOf.has(spots[0])).toBe(false); // the farthest spot is left out
    expect(plan.slotOf.has(quiet)).toBe(false);
    const pointSlot = plan.slots[plan.slotOf.get(point)!];
    expect(pointSlot.viewCount).toBe(6);
    expect(plan.views[pointSlot.firstView].rect).toEqual(ATLAS_TILES.point[0]);
  });

  it('lays the tiles out in scene order, so two cameras share the layout', () => {
    const a = light(EntityType.LIGHT_POINT, [-5, 0, 0]);
    const b = light(EntityType.LIGHT_POINT, [5, 0, 0]);
    const fromLeft = planShadows([a, b], vec3.fromValues(-9, 0, 0), { directionalDistance: 60 });
    const fromRight = planShadows([a, b], vec3.fromValues(9, 0, 0), { directionalDistance: 60 });
    expect(fromLeft.slotOf.get(a)).toBe(0);
    expect(fromRight.slotOf.get(a)).toBe(0);
  });
});

describe('cube faces', () => {
  it('each face direction maps back to its own face', () => {
    CUBE_FACES.forEach((f, i) => expect(cubeFaceFor(f.dir)).toBe(i));
    expect(cubeFaceFor(vec3.fromValues(0.2, -3, 1))).toBe(3);
  });
});

describe('directionalMatrix', () => {
  it('snaps to whole texels, so moving the camera by less than a texel does not move the shadow', () => {
    const dir = vec3.fromValues(0.3, -1, 0.2);
    const a = directionalMatrix(dir, vec3.fromValues(10, 0, 10), 60, 2048);
    const b = directionalMatrix(dir, vec3.fromValues(10.001, 0, 10), 60, 2048);
    const p = vec3.fromValues(3, 0, 4);
    const pa = vec3.transformMat4(vec3.create(), p, a), pb = vec3.transformMat4(vec3.create(), p, b);
    expect(pa[0] * 1024).toBeCloseTo(pb[0] * 1024, 3);
  });
});

describe('packShadows', () => {
  it('packs the texel size (per unit of distance for perspective views) and the biases in texels', () => {
    const sun = light(EntityType.LIGHT_DIRECTIONAL, [0, 50, 0]);
    const spot = light(EntityType.LIGHT_SPOT, [0, 5, 0]);
    const plan = planShadows([sun, spot], vec3.create(), { directionalDistance: 60 });
    const data = packShadows(plan, true);
    const params = (slot: number) => Array.from(data.slice((SHADOWS_LAYOUT.params + slot) * 4, (SHADOWS_LAYOUT.params + slot) * 4 + 4));
    expect(params(0)[0]).toBeCloseTo(120 / 2048); // ortho box 120 units over 2048 texels
    expect(params(0)[1]).toBe(0);
    expect(params(1)[0]).toBeCloseTo((2 * Math.tan((62 * Math.PI) / 360)) / 1024); // fov = outer cone * 2 + 2
    expect(params(1)[1]).toBe(1);
    expect(params(1)[3]).toBe(1); // first view of the spot
    const extra = (slot: number) => Array.from(data.slice((SHADOWS_LAYOUT.extra + slot) * 4, (SHADOWS_LAYOUT.extra + slot) * 4 + 3));
    expect(extra(1)[1]).toBe(0.5);
    expect(extra(1)[2]).toBe(1);
    expect(data.length / 4).toBe(SHADOWS_LAYOUT.slots);
    expect(SHADOWS_LAYOUT.slots).toBe(4 * MAX_SHADOW_VIEWS + MAX_SHADOW_VIEWS + 2 * MAX_SHADOW_SLOTS + 1);
  });

  it("packs each light's own shadow strength", () => {
    const sun = light(EntityType.LIGHT_DIRECTIONAL, [0, 50, 0], { shadowStrength: 0.3 });
    const spot = light(EntityType.LIGHT_SPOT, [0, 5, 0], { shadowStrength: 1.5 });
    const data = packShadows(planShadows([sun, spot], vec3.create(), { directionalDistance: 60 }), true);
    const strength = (slot: number) => data[(SHADOWS_LAYOUT.extra + slot) * 4];
    expect(strength(0)).toBeCloseTo(0.3);
    expect(strength(1)).toBe(1); // clamped
  });
});

describe('quality options', () => {
  it('scales the tiles with a smaller atlas and packs its texel size and the filter', () => {
    const sun = light(EntityType.LIGHT_DIRECTIONAL, [0, 50, 0]);
    const plan = planShadows([sun], vec3.create(), { directionalDistance: 60, atlasSize: 1024 });
    expect(plan.atlasSize).toBe(1024);
    expect(plan.views[0].rect).toEqual({ x: 0, y: 0, size: 512 });
    expect(plan.slots[0].texelSize).toBeCloseTo(120 / 512);
    const data = packShadows(plan, true, undefined, ShadowFilter.Soft);
    expect(data[SHADOWS_LAYOUT.atlas * 4]).toBeCloseTo(1 / 1024);
    expect(data[SHADOWS_LAYOUT.atlas * 4 + 1]).toBe(4);
    expect(data[(SHADOWS_LAYOUT.rects) * 4 + 2]).toBeCloseTo(0.5); // tile is half the atlas
  });

  it('limits spot and point shadows to the budget', () => {
    const spots = [1, 2, 3].map((x) => light(EntityType.LIGHT_SPOT, [x, 0, 0]));
    const points = [1, 2].map((x) => light(EntityType.LIGHT_POINT, [x, 0, 0]));
    const plan = planShadows([...spots, ...points], vec3.create(), { directionalDistance: 60, budget: { spot: 1, point: 0 } });
    expect(plan.slots).toHaveLength(1);
    expect(plan.slots[0].light).toBe(spots[0]); // nearest
    expect(plan.views).toHaveLength(1);
  });
});
