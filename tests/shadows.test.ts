/** Shadow atlas planning: budget, tile layout, cube faces, packing. No GPU. */
import { vec3 } from 'gl-matrix';
import { describe, expect, it } from 'vitest';
import {
  ATLAS_TILES, CUBE_FACES, MAX_SHADOW_SLOTS, MAX_SHADOW_VIEWS, SHADOW_ATLAS_SIZE, SHADOWS_LAYOUT,
  cubeFaceFor, directionalMatrix, packShadows, planShadows,
} from '../src/core/render/shadows';
import { EntityType } from '../src/enums/entity-type.enum';

const light = (entityType: EntityType, position: number[], extra: object = {}) => ({
  entityType, castShadows: true, shadowBias: 0.1, normalBias: 0.05, range: 10,
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
  it('turns world-space bias into depth units for the directional light and into a light offset for others', () => {
    const sun = light(EntityType.LIGHT_DIRECTIONAL, [0, 50, 0]);
    const spot = light(EntityType.LIGHT_SPOT, [0, 5, 0]);
    const plan = planShadows([sun, spot], vec3.create(), { directionalDistance: 60 });
    const data = packShadows(plan, 0.4, true);
    const params = (slot: number) => Array.from(data.slice((SHADOWS_LAYOUT.params + slot) * 4, (SHADOWS_LAYOUT.params + slot) * 4 + 4));
    expect(params(0)[0]).toBeCloseTo(0.1 / 180);
    expect(params(0)[2]).toBe(0);
    expect(params(1)[0]).toBe(0);
    expect(params(1)[2]).toBeCloseTo(0.1);
    expect(params(1)[3]).toBe(1); // first view of the spot
    expect(data.length / 4).toBe(SHADOWS_LAYOUT.slots);
    expect(SHADOWS_LAYOUT.slots).toBe(4 * MAX_SHADOW_VIEWS + MAX_SHADOW_VIEWS + MAX_SHADOW_SLOTS + 1);
  });
});
