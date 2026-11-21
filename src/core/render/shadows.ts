import { mat4, vec3 } from "gl-matrix";
import { EntityType } from "../../enums/entity-type.enum";
import { DirectionalLight } from "../../entities/lights/directional-light";
import { Light } from "../../entities/lights/light";
import { PointLight } from "../../entities/lights/point-light";
import { SpotLight } from "../../entities/lights/spot-light";

/**
 * Shadow atlas planning: which lights get a shadow this frame, where their
 * depth views go in the atlas, and the light matrices. No GL here; the
 * ShadowAtlasPass draws the views and the ShadowsUBO uploads the result.
 */

export const SHADOW_ATLAS_SIZE = 4096;
/** Default budget: shadowed lights per frame by type. */
export const SHADOW_BUDGET = { directional: 1, spot: 4, point: 2 } as const;
export const MAX_SHADOW_SLOTS = SHADOW_BUDGET.directional + SHADOW_BUDGET.spot + SHADOW_BUDGET.point;
export const MAX_SHADOW_VIEWS = SHADOW_BUDGET.directional + SHADOW_BUDGET.spot + 6 * SHADOW_BUDGET.point;
/** Point-light faces render a little wider than 90° so the PCF has margin at the edges. */
export const POINT_FACE_FOV_DEGREES = 95;

/** A rectangle in atlas pixels, origin bottom-left (GL viewport convention). */
export interface AtlasRect { x: number; y: number; size: number; }

/**
 * Fixed tile layout for the default budget, in pixels:
 * directional 2048² bottom-left, 4 spot 1024² to its right, 12 point 512²
 * above it; the top-right quadrant is left free (cascades later).
 */
export const ATLAS_TILES = {
  directional: [{ x: 0, y: 0, size: 2048 }] as AtlasRect[],
  spot: [0, 1, 2, 3].map((i) => ({ x: 2048 + (i % 2) * 1024, y: Math.floor(i / 2) * 1024, size: 1024 })),
  point: Array.from({ length: 12 }, (_, i) => ({ x: (i % 4) * 512, y: 2048 + Math.floor(i / 4) * 512, size: 512 })),
};

/** One depth view in the atlas. */
export interface ShadowView {
  light: Light;
  /** World → light clip space. */
  matrix: mat4;
  rect: AtlasRect;
}

/** One shadowed light: its views are views[firstView .. firstView + viewCount). */
export interface ShadowSlot {
  light: Light;
  firstView: number;
  viewCount: number;
  /**
   * World size of one shadow-map texel: constant for an orthographic view, per
   * unit of distance from the light for a perspective one.
   */
  texelSize: number;
  perspective: boolean;
}

export interface ShadowPlan {
  /** Side of the atlas the rectangles are in, in pixels. */
  atlasSize: number;
  slots: ShadowSlot[];
  views: ShadowView[];
  /** Light → slot index, for the LightsBlock w components. */
  slotOf: Map<Light, number>;
}

export interface ShadowPlanOptions {
  /** Half-size of the directional light's orthographic box, in world units. */
  directionalDistance: number;
  /** Side of the atlas in pixels (default 4096); the tiles scale with it. */
  atlasSize?: number;
  /** Shadowed lights per type, capped by SHADOW_BUDGET. */
  budget?: { spot?: number; point?: number };
}

/** The default tile layout scaled to an atlas of `atlasSize` pixels. */
function scaledTile(rect: AtlasRect, atlasSize: number): AtlasRect {
  if (atlasSize === SHADOW_ATLAS_SIZE) return rect;
  const k = atlasSize / SHADOW_ATLAS_SIZE;
  return { x: rect.x * k, y: rect.y * k, size: rect.size * k };
}

/**
 * Picks the shadowed lights (castShadows, active, within budget, the nearest
 * to the camera) and lays their views out in the atlas in scene order.
 */
export function planShadows(lights: Light[], eye: vec3, options: ShadowPlanOptions): ShadowPlan {
  const casters = lights.filter((l) => l.castShadows);
  const nearest = <T extends Light>(type: EntityType, n: number) =>
    (casters.filter((l) => l.entityType === type) as T[])
      .map((l) => ({ l, d: vec3.distance(l.transform.worldPosition, eye) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, n)
      // Tiles go in scene order, not distance order: cameras at different
      // places then share the same layout and the shadow cache stays valid.
      .sort((a, b) => lights.indexOf(a.l) - lights.indexOf(b.l))
      .map((e) => e.l);

  const atlasSize = options.atlasSize ?? SHADOW_ATLAS_SIZE;
  const spotBudget = Math.min(SHADOW_BUDGET.spot, Math.max(0, options.budget?.spot ?? SHADOW_BUDGET.spot));
  const pointBudget = Math.min(SHADOW_BUDGET.point, Math.max(0, options.budget?.point ?? SHADOW_BUDGET.point));
  const tile = (rect: AtlasRect) => scaledTile(rect, atlasSize);
  const plan: ShadowPlan = { atlasSize, slots: [], views: [], slotOf: new Map() };
  const addSlot = (light: Light, views: { matrix: mat4; rect: AtlasRect }[], texelSize: number, perspective: boolean) => {
    plan.slotOf.set(light, plan.slots.length);
    plan.slots.push({ light, firstView: plan.views.length, viewCount: views.length, texelSize, perspective });
    for (const v of views) plan.views.push({ light, ...v });
  };

  nearest<DirectionalLight>(EntityType.LIGHT_DIRECTIONAL, SHADOW_BUDGET.directional).forEach((l, i) => {
    const rect = tile(ATLAS_TILES.directional[i]);
    const matrix = directionalMatrix(l.direction, eye, options.directionalDistance, rect.size);
    addSlot(l, [{ rect, matrix }], (2 * options.directionalDistance) / rect.size, false);
  });
  nearest<SpotLight>(EntityType.LIGHT_SPOT, spotBudget).forEach((l, i) => {
    const rect = tile(ATLAS_TILES.spot[i]);
    addSlot(l, [{ rect, matrix: spotMatrix(l) }], (2 * Math.tan(spotFov(l) / 2)) / rect.size, true);
  });
  nearest<PointLight>(EntityType.LIGHT_POINT, pointBudget).forEach((l, i) => {
    const size = tile(ATLAS_TILES.point[i * 6]).size;
    const texel = (2 * Math.tan((POINT_FACE_FOV_DEGREES * Math.PI) / 360)) / size;
    addSlot(l, pointMatrices(l).map((matrix, face) => ({ matrix, rect: tile(ATLAS_TILES.point[i * 6 + face]) })), texel, true);
  });
  return plan;
}

/**
 * Orthographic light matrix centred on the camera, `distance` units each way,
 * snapped to whole texels so shadow edges don't shimmer as the camera moves.
 */
export function directionalMatrix(direction: vec3, eye: vec3, distance: number, tileSize: number): mat4 {
  const dir = vec3.normalize(vec3.create(), direction);
  const up = Math.abs(dir[1]) > 0.999 ? vec3.fromValues(0, 0, 1) : vec3.fromValues(0, 1, 0);
  const position = vec3.scaleAndAdd(vec3.create(), eye, dir, -distance);
  const view = mat4.lookAt(mat4.create(), position, eye, up);
  const proj = mat4.ortho(mat4.create(), -distance, distance, -distance, distance, 0.1, directionalDepthRange(distance));
  const m = mat4.multiply(mat4.create(), proj, view);

  // Snap: move the projection so the world origin lands on a texel corner.
  const origin = vec3.transformMat4(vec3.create(), [0, 0, 0], m);
  const half = tileSize / 2;
  const dx = (Math.round(origin[0] * half) - origin[0] * half) / half;
  const dy = (Math.round(origin[1] * half) - origin[1] * half) / half;
  return mat4.multiply(mat4.create(), mat4.fromTranslation(mat4.create(), [dx, dy, 0]), m);
}

/** Far plane of the directional light's box: the light sits `distance` behind the camera. */
export function directionalDepthRange(distance: number): number {
  return distance * 3;
}

/** Field of view (radians) of the spot light's shadow view: its outer cone plus a margin. */
export function spotFov(light: SpotLight): number {
  return Math.min(170, light.coneAngles.outer * 2 + 2) * (Math.PI / 180);
}

/** Perspective matrix from the spot light, covering its outer cone out to its range. */
export function spotMatrix(light: SpotLight): mat4 {
  const position = light.transform.worldPosition;
  const dir = vec3.normalize(vec3.create(), light.toLightDirection);
  const up = Math.abs(dir[1]) > 0.999 ? vec3.fromValues(0, 0, 1) : vec3.fromValues(0, 1, 0);
  const target = vec3.add(vec3.create(), position, dir);
  const proj = mat4.perspective(mat4.create(), spotFov(light), 1, 0.05, Math.max(0.1, light.range));
  return mat4.multiply(mat4.create(), proj, mat4.lookAt(mat4.create(), position, target, up));
}

/** Cube faces in the order the shader picks them: +X, -X, +Y, -Y, +Z, -Z. */
export const CUBE_FACES: { dir: vec3; up: vec3 }[] = [
  { dir: [1, 0, 0], up: [0, -1, 0] },
  { dir: [-1, 0, 0], up: [0, -1, 0] },
  { dir: [0, 1, 0], up: [0, 0, 1] },
  { dir: [0, -1, 0], up: [0, 0, -1] },
  { dir: [0, 0, 1], up: [0, -1, 0] },
  { dir: [0, 0, -1], up: [0, -1, 0] },
];

/** The face the shader samples for a direction from the light (same rule as light.frag). */
export function cubeFaceFor(v: vec3): number {
  const [ax, ay, az] = [Math.abs(v[0]), Math.abs(v[1]), Math.abs(v[2])];
  if (ax >= ay && ax >= az) return v[0] > 0 ? 0 : 1;
  if (ay >= az) return v[1] > 0 ? 2 : 3;
  return v[2] > 0 ? 4 : 5;
}

/** Six perspective matrices from the point light, one per cube face. */
export function pointMatrices(light: PointLight): mat4[] {
  const position = light.transform.worldPosition;
  const proj = mat4.perspective(mat4.create(), POINT_FACE_FOV_DEGREES * (Math.PI / 180), 1, 0.05, Math.max(0.1, light.range));
  return CUBE_FACES.map(({ dir, up }) => {
    const target = vec3.add(vec3.create(), position, dir);
    return mat4.multiply(mat4.create(), proj, mat4.lookAt(mat4.create(), position, target, up));
  });
}

/** std140 layout of ShadowsBlock (functions/light.frag), in vec4 slots. */
export const SHADOWS_LAYOUT = {
  matrices: 0, // MAX_SHADOW_VIEWS mat4 (4 slots each)
  rects: 4 * MAX_SHADOW_VIEWS, // atlas uv: x, y, size, size
  params: 5 * MAX_SHADOW_VIEWS, // per slot: texel size, perspective (1/0), 0, first view
  extra: 5 * MAX_SHADOW_VIEWS + MAX_SHADOW_SLOTS, // per slot: strength, depth bias, normal bias (texels), 0
  atlas: 5 * MAX_SHADOW_VIEWS + 2 * MAX_SHADOW_SLOTS, // 1/size, filter taps, enabled, 0
  slots: 5 * MAX_SHADOW_VIEWS + 2 * MAX_SHADOW_SLOTS + 1,
};

/** Shadow filter: taps of the PCF in the lit shader (each tap is a hardware 2×2 comparison). */
export enum ShadowFilter {
  Hard = 1,
  Soft = 4,
  Softer = 16,
}

/** Packs a plan into the std140 floats of ShadowsBlock. */
export function packShadows(plan: ShadowPlan, enabled: boolean, out?: Float32Array, filter = ShadowFilter.Softer): Float32Array {
  const atlasSize = plan.atlasSize ?? SHADOW_ATLAS_SIZE;
  const S = SHADOWS_LAYOUT;
  const data = out ?? new Float32Array(S.slots * 4);
  data.fill(0);
  plan.views.forEach((v, i) => {
    data.set(v.matrix as Float32Array, (S.matrices + i * 4) * 4);
    const k = 1 / atlasSize;
    data.set([v.rect.x * k, v.rect.y * k, v.rect.size * k, v.rect.size * k], (S.rects + i) * 4);
  });
  // The biases are in texels: the shader turns them into world units with the
  // texel size (times the distance to the light for a perspective view), so
  // they stay as small as the shadow map allows at any distance.
  plan.slots.forEach((s, i) => {
    data.set([s.texelSize, s.perspective ? 1 : 0, 0, s.firstView], (S.params + i) * 4);
    const strength = Math.min(1, Math.max(0, s.light.shadowStrength ?? 1));
    data.set([strength, Math.max(0, s.light.shadowDepthBias), Math.max(0, s.light.shadowNormalBias), 0], (S.extra + i) * 4);
  });
  data.set([1 / atlasSize, filter, enabled ? 1 : 0, 0], S.atlas * 4);
  return data;
}
