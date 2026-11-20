import { vec3 } from "gl-matrix";
import { RendererBehaviour } from "../../behaviours";
import { Camera, Scene, SceneEntity } from "../../entities";
import { Light } from "../../entities/lights/light";
import { RenderLayer } from "../../enums";

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

export function buildFrameData(scene: Scene, camera: Camera, time: number): FrameData {
  const eye = camera.transform.worldPosition;
  const visible = scene.objects.filter((o) => o.active && o.show);
  const withRenderer = visible
    .map((entity) => ({ entity, renderer: entity.getBehaviour(RendererBehaviour), distance: vec3.distance(entity.transform.worldPosition, eye) }))
    .filter((e) => !!e.renderer);

  const layer = (l: RenderLayer) => withRenderer.filter((e) => e.renderer!.renderLayer === l);
  return {
    camera,
    opaque: layer(RenderLayer.OPAQUE).sort((a, b) => a.distance - b.distance).map((e) => e.entity),
    skybox: layer(RenderLayer.SKYBOX).map((e) => e.entity),
    transparent: layer(RenderLayer.TRANSPARENT).sort((a, b) => b.distance - a.distance).map((e) => e.entity),
    lights: scene.lights.filter((l) => l.active && l.show),
    shadowCasters: withRenderer.filter((e) => e.renderer!.castShadows).map((e) => e.entity),
    time,
  };
}
