import { Scene } from "../../entities";
import { FrameData } from "./frame-data";
import { RenderTarget } from "./render-target";

/** What a pass gets each frame. */
export interface RenderContext {
  gl: WebGL2RenderingContext;
  frame: FrameData;
  /** Where the pass draws (already bound for scene passes). */
  target: RenderTarget;
  /** What a full-screen pass reads (the previous result), if any. */
  source?: RenderTarget;
}

export interface IRenderPass {
  name: string;
  initialize(gl: WebGL2RenderingContext): void;
  execute(scene: Scene, ctx?: RenderContext): void;
  cleanup(): void;
  resize(width: number, height: number): void;
  setGl(gl: WebGL2RenderingContext): void;
}
