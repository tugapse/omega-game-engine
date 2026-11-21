import { vec3 } from "gl-matrix";
import { RendererBehaviour } from "../../behaviours";
import { Camera, Scene, SceneEntity } from "../../entities";
import { Light } from "../../entities/lights/light";
import { RenderLayer } from "../../enums";
import { createSphere, frustumPlanes, sphereInFrustum } from "./culling";
import { mat4 } from "gl-matrix";

/**
 * What one frame draws, worked out once and shared by every pass: the camera,
 * the visible entities by layer (already sorted) and the lights.
 */
export interface FrameData {
  camera: Camera;
  /** Opaque entities, nearest first (less overdraw). */
  opaque: SceneEntity[];
  skybox: SceneEntity[];
  /** Transparent entities, farthest first (correct blending). */
  transparent: SceneEntity[];
  /** Active, shown lights. */
  lights: Light[];
  /** Entities whose renderer casts shadows. */
  shadowCasters: SceneEntity[];
  /** Seconds since the pipeline started, for animated effects. */
  time: number;
}

const viewProjection = mat4.create();
const planes = new Float32Array(24);
const bounds = createSphere();

/**
 * Sorts the scene's visible entities into the frame's lists. With `cull`,
 * opaque and transparent entities outside the camera's frustum are left out
 * (shadow casters are kept: the shadow pass culls them per light view).
 */
export function buildFrameData(scene: Scene, camera: Camera, time: number, cull = true): FrameData {
  const eye = camera.transform.worldPosition;
  mat4.multiply(viewProjection, camera.projectionMatrix, camera.viewMatrix);
  frustumPlanes(viewProjection, planes);
  const visible = scene.objects.filter((o) => o.active && o.show);
  const withRenderer = visible
    .map((entity) => ({ entity, renderer: entity.getBehaviour(RendererBehaviour), distance: vec3.distance(entity.transform.worldPosition, eye) }))
    .filter((e) => !!e.renderer);
  const inView = (e: (typeof withRenderer)[number]) =>
    !cull || !e.renderer!.worldBounds(bounds) || sphereInFrustum(planes, bounds.center, bounds.radius);

  const layer = (l: RenderLayer) => withRenderer.filter((e) => e.renderer!.renderLayer === l);
  return {
    camera,
    opaque: layer(RenderLayer.OPAQUE).filter(inView).sort((a, b) => a.distance - b.distance).map((e) => e.entity),
    skybox: layer(RenderLayer.SKYBOX).map((e) => e.entity),
    transparent: layer(RenderLayer.TRANSPARENT).filter(inView).sort((a, b) => b.distance - a.distance).map((e) => e.entity),
    lights: scene.lights.filter((l) => l.active && l.show),
    // The skybox surrounds everything: it never casts a shadow.
    shadowCasters: withRenderer
      .filter((e) => e.renderer!.castShadows && e.renderer!.renderLayer !== RenderLayer.SKYBOX)
      .map((e) => e.entity),
    time,
  };
}
