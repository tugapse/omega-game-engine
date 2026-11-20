import { JsonSerializable } from "../../json-serializable";
import { CameraUBO } from "../../camera-ubo";
import { Scene } from "../../../entities";
import { JsonSerializedData } from "../../../interfaces";
import { IRenderPass, RenderContext } from "../render-pass.interface";

/**
 * Draws the frame's entities into the bound target: opaque (nearest first),
 * then the skybox, then transparent (farthest first). The lists come sorted
 * in the FrameData.
 */
export class GeometryPass extends JsonSerializable implements IRenderPass {
  private gl: WebGL2RenderingContext;
  private ubo: CameraUBO;

  constructor(gl: WebGL2RenderingContext) {
    super("GeometryPass");
    this.gl = gl;
    this.ubo = new CameraUBO(gl);
  }

  public initialize(): void {}

  public execute(_scene: Scene, ctx?: RenderContext): void {
    if (!ctx) return;
    const { frame } = ctx;
    this.ubo.update(frame.camera.viewMatrix, frame.camera.projectionMatrix);
    for (const entity of frame.opaque) entity.draw();
    for (const entity of frame.skybox) entity.draw();
    for (const entity of frame.transparent) entity.draw();
  }

  public cleanup(): void {}

  public resize(_width: number, _height: number): void {}

  setGl(gl: WebGL2RenderingContext): void {
    this.gl = gl;
    this.ubo = new CameraUBO(gl);
  }

  public override toJsonObject(): JsonSerializedData {
    return this.getBaseJsonInfo();
  }

  public override fromJson(jsonObject: JsonSerializedData): void {
    super.fromJson(jsonObject);
  }
}
