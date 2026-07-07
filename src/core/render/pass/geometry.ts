  import { JsonSerializable } from "../../json-serializable";
import { CameraUBO } from "../../camera-ubo";
import { RendererBehaviour } from "../../../behaviours";
import { Scene, Camera } from "../../../entities";
import { RenderLayer } from "../../../enums";
import { JsonSerializedData } from "../../../interfaces";
import { vec3 } from "gl-matrix";
import { IRenderPass } from "../render-pass.interface";

/**
 * Responsible for rendering the main scene geometry.
 * This pass sorts objects by their render layer and distance from the camera to handle transparency correctly.
 *
 * @remarks
 * The rendering order is strictly: Opaque -> Skybox -> Transparent. Transparent objects are sorted back-to-front.
 */
export class GeometryPass extends JsonSerializable implements IRenderPass {
  private gl: WebGL2RenderingContext;
  private ubo!: CameraUBO;

  // Optionally bind to an off-screen FBO texture, or leave null to render directly to the backbuffer (screen)
  // public targetFramebuffer: WebGLFramebuffer | null = null;

  /**
   * Creates an instance of GeometryPass.
   * @param gl - The WebGL2 rendering context.
   */
  constructor(gl: WebGL2RenderingContext) {
    super("GeometryPass");
    this.gl = gl;
    this.ubo = new CameraUBO(gl);
  }

  /**
   * Initializes the render pass. This is called by the `RenderPipeline`.
   * @param gl - The WebGL2 rendering context.
   */
  public initialize(): void {}

  /**
   * Executes the geometry rendering pass.
   * It sorts all visible objects and draws them in the correct order to handle layering and transparency.
   * @param scene - The scene containing the objects to render.
   */
  public execute(scene: Scene): void {
    const camera = Camera.mainCamera;
    this.ubo.update(camera.viewMatrix, camera.projectionMatrix);

    // // Bind target buffer (null = default screen canvas)
    // this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    // this.gl.viewport(
    //   0,
    //   0,
    //   CanvasViewport.rendererWidth,
    //   CanvasViewport.rendererHeight,
    // );

    // 1. Fetch all active and visible objects from the scene.
    const activeObjects = scene.objects.filter((o) => o.active && o.show);

    // Sort transparent objects back-to-front
    const sortedObjects = [...activeObjects].sort((a, b) => {
      const aD = vec3.distance(
        a.transform.worldPosition,
        Camera.mainCamera.transform.worldPosition,
      );
      const bD = vec3.distance(
        b.transform.worldPosition,
        Camera.mainCamera.transform.worldPosition,
      );
      return bD - aD;
    });

    // 2. Separate objects into different render layers.
    const opaque = sortedObjects.filter(
      (e) =>
        e.getBehaviour(RendererBehaviour)?.renderLayer === RenderLayer.OPAQUE,
    );
    const skybox = sortedObjects.filter(
      (e) =>
        e.getBehaviour(RendererBehaviour)?.renderLayer === RenderLayer.SKYBOX,
    );
    const transparent = sortedObjects.filter(
      (e) =>
        e.getBehaviour(RendererBehaviour)?.renderLayer ===
        RenderLayer.TRANSPARENT,
    );

    // 3. Draw opaque objects first (order doesn't matter as much due to depth testing).
    for (const obj of opaque) {
      obj.draw();
    }

    // 4. Draw the skybox after opaque objects.
    for (const obj of skybox) {
      obj.draw();
    }

    // 5. Draw transparent objects last, in back-to-front order.
    for (const obj of transparent) {
      obj.draw();
    }

    // // Unbind framebuffer if it was an off-screen pass
    // if (this.targetFramebuffer) {
    //   this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    // }
  }

  /**
   * Cleans up any resources used by the pass.
   */
  public cleanup(): void {}

  /**
   * Called when the viewport resizes.
   * @param width - The new width.
   * @param height - The new height.
   */
  public resize(width: number, height: number): void {}

  /**
   * Sets the WebGL rendering context.
   * @param gl - The WebGL2 rendering context.
   */
  setGl(gl: WebGL2RenderingContext): void {
    this.gl = gl;
  }

  /**
   * Serializes the pass's state to a JSON object.
   * @returns The serialized JSON data.
   */
  public override toJsonObject(): JsonSerializedData {
    return this.serializeAutomatically();
  }

  /**
   * Deserializes the pass's state from a JSON object.
   * @param jsonObject - The JSON data to deserialize from.
   */
  public override fromJson(jsonObject: JsonSerializedData): void {
    super.fromJson(jsonObject);
    this.deserializeAutomatically(jsonObject);
  }
}
