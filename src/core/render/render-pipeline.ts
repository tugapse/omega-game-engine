import { Scene, Camera } from "../../entities";
import { ClassType } from "../../enums/class-type.enum";
import { JsonSerializedData } from "../../interfaces";
import { Texture } from "../../textures";
import { CameraUBO } from "../camera-ubo";
import { CanvasViewport } from "../canvas-viewport";
import { JsonSerializable } from "../json-serializable";
import { ObjectInstanciator } from "../object-instanciator";
import { ShadowMapPass, GeometryPass, PostProcessingPass } from "./pass";
import { IRenderPass } from "./render-pass.interface";

/**
 * Orchestrates a series of rendering passes to produce the final image.
 * This class manages the execution order of passes like shadow mapping, geometry rendering,
 * and post-processing. It also handles the creation and management of intermediate
 * framebuffers and textures.
 *
 * @augments {JsonSerializable}
 */
export class RenderPipeline extends JsonSerializable {
  /**
   * Creates a new instance of the RenderPipeline.
   * @returns A new RenderPipeline instance.
   */
  static instanciate() {
    return new RenderPipeline();
  }

  /**
   * Gets the shadow map pass instance, which contains the shadow map texture.
   * @returns The {@link ShadowMapPass} used by this pipeline.
   */
  public get shadowMap() {
    return this._shadowmapPass;
  }

  /** The underlying WebGL2 rendering context. */
  protected _gl!: WebGL2RenderingContext;
  /** The Uniform Buffer Object for camera matrices. */
  protected ubo! : CameraUBO;
  /** The scene to be rendered. */
  protected scene!: Scene;
  /** The pass responsible for rendering shadow maps from light sources. */
  protected _shadowmapPass!: ShadowMapPass;
  /** The main pass for rendering scene geometry. */
  protected _geometryPass!: GeometryPass;
  /** A post-processing pass for blitting the final image to the screen. */
  protected _screenBlit!: PostProcessingPass;

  /** The list of render passes to be executed in order. */
  private _passes: IRenderPass[] = [];

  // Single Buffer properties
  /** The main off-screen framebuffer for intermediate rendering. */
  protected _framebuffer: WebGLFramebuffer | null = null;
  /** The color texture attached to the main off-screen framebuffer. */
  protected _colorTexture: Texture | null = null;
  /** The depth buffer attached to the main off-screen framebuffer. */
  protected _depthRenderbuffer: WebGLRenderbuffer | null = null;

  /** The width of the internal rendering buffers. */
  protected _bufferWidth = 0;
  /** The height of the internal rendering buffers. */
  protected _bufferHeight = 0;

  /**
   * Creates an instance of RenderPipeline.
   * @param name - A descriptive name for the pipeline.
   */
  constructor(public override name: string = 'Render Pipeline') {
    super('RenderPipeline');
  }

  /**
   * Gets the final color texture produced by the geometry pass, before post-processing.
   * @returns The main scene color texture, or null if not initialized.
   */
  public get sceneTexture(): Texture | null {
    return this._colorTexture;
  }

  /**
   * Gets the main off-screen framebuffer used for rendering passes.
   * @returns The main WebGLFramebuffer, or null if not initialized.
   */
  public get framebuffer(): WebGLFramebuffer | null {
    return this._framebuffer;
  }

  /**
   * Sets the WebGL rendering context and initializes default passes and buffers.
   * This must be called before the pipeline can be used.
   * @param gl - The WebGL2 rendering context.
   */
  public setGlRenderingContext(gl: WebGL2RenderingContext): void {
    this._gl = gl;
    this.ubo = new CameraUBO(this._gl);

    // Initialize default passes if they don't exist.
    if (!this._shadowmapPass) {
      this._shadowmapPass = new ShadowMapPass(this._gl);
      this.addPass(this._shadowmapPass);
    }
    if (!this._geometryPass) {
      this._geometryPass = new GeometryPass(this._gl);
      this.addPass(this._geometryPass);
    }

    // Example of how post-processing passes could be added.
    // if (!this._retropass) {
    //   this._retropass = new PostProcessingPass(this._gl);
    //   this._retropass.setInputTexture(this.sceneTexture)
    //   this.addPass(this._retropass);
    // }
    // if (!this._screenBlit) {
    //   this._screenBlit = new PostProcessingPass(this._gl);
    //   this.addPass(this._screenBlit);
    // }

    // Propagate the GL context to all existing passes.
    this._passes.forEach((pass) => {
      if (typeof (pass as any).setGl === 'function') {
        (pass as any).setGl(gl);
      }
    });

    const width = CanvasViewport.rendererWidth || 1024;
    const height = CanvasViewport.rendererHeight || 768;
    this.recreateSingleBuffer(width, height);
  }

  /**
   * Associates a scene with the render pipeline.
   * @param scene - The scene to be rendered.
   */
  public initialize(scene: Scene) {
    this.scene = scene;
  }

  /**
   * Adds a render pass to the end of the pipeline.
   * @param pass - The render pass to add.
   */
  public addPass(pass: IRenderPass): void {
    if (this._gl) {
      pass.initialize(this._gl);
    }
    this._passes.push(pass);
  }

  /**
   * Creates or recreates the main off-screen framebuffer and its attachments (color and depth).
   * @param width - The new width of the buffer.
   * @param height - The new height of the buffer.
   * @protected
   */
  protected recreateSingleBuffer(width: number, height: number): void {
    if (!this._gl) return;

    this._bufferWidth = width;
    this._bufferHeight = height;

    this.cleanupSingleBuffer();

    // Allocate single off-screen framebuffer target
    this._framebuffer = this._gl.createFramebuffer();
    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._framebuffer);

    this._colorTexture = Texture.create(this._gl, width, height);
    this._gl.framebufferTexture2D(
      this._gl.FRAMEBUFFER,
      this._gl.COLOR_ATTACHMENT0,
      this._gl.TEXTURE_2D,
      this._colorTexture!.glTexture,
      0,
    );

    this._depthRenderbuffer = this._gl.createRenderbuffer();
    this._gl.bindRenderbuffer(this._gl.RENDERBUFFER, this._depthRenderbuffer);
    this._gl.renderbufferStorage(
      this._gl.RENDERBUFFER,
      this._gl.DEPTH_COMPONENT16,
      width,
      height,
    );
    this._gl.framebufferRenderbuffer(
      this._gl.FRAMEBUFFER,
      this._gl.DEPTH_ATTACHMENT,
      this._gl.RENDERBUFFER,
      this._depthRenderbuffer,
    );

    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
  }

  /**
   * Executes all render passes in sequence for a single frame.
   * This is the main rendering loop entry point.
   */
  public draw() {
    if (!this.scene) {
      console.error('No scene defined for this render pipeline');
      return;
    }
    const camera =Camera.mainCamera;

    
    for (let i = 0; i < this._passes.length; i++) {
      const pass = this._passes[i];
      
      // Specialty passes (e.g., ShadowMap) manage their own binding scopes
      if (pass.name === 'ShadowMapPass') {
        pass.execute(this.scene);
        continue;
      }
      
      this.ubo.update(camera.viewMatrix,camera.projectionMatrix);
      this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
      this._gl.viewport(0, 0, this._gl.canvas.width, this._gl.canvas.height);

      // Final screen output pass reads off-screen color texture and draws to canvas (null)
      if (pass.name === 'ScreenBlitPass') {
        // this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
        // this._gl.viewport(0, 0, this._gl.canvas.width, this._gl.canvas.height);

        if ('setInputTexture' in pass) {
          (pass as any).setInputTexture(this._colorTexture);
        }

        pass.execute(this.scene);
        continue;
      }

      // Route all intermediate render passes (e.g., GeometryPass) to the single off-screen buffer
      // this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._framebuffer);
      // this._gl.viewport(0, 0, this._bufferWidth, this._bufferHeight);

      pass.execute(this.scene);
    }

    // Unbind buffer cleanly at the end of frame execution
    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);

  }

  /**
   * Resizes all internal buffers and notifies all passes of the new dimensions.
   * @param width - The new rendering width.
   * @param height - The new rendering height.
   */
  public resize(width: number, height: number): void {
    this.recreateSingleBuffer(width, height);
    for (const pass of this._passes) {
      pass.resize(width, height);
    }
  }

  /**
   * Deletes and cleans up the WebGL resources for the main off-screen buffer.
   * @protected
   */
  protected cleanupSingleBuffer(): void {
    if (!this._gl) return;
    if (this._framebuffer) this._gl.deleteFramebuffer(this._framebuffer);
    if (this._colorTexture) this._colorTexture!.destroy();
    if (this._depthRenderbuffer)
      this._gl.deleteRenderbuffer(this._depthRenderbuffer);
  }

  /**
   * Deserializes the pipeline's state from a JSON object.
   * @param jsonObject - The JSON data to deserialize from.
   */
  public override fromJson(jsonObject: JsonSerializedData): void {
    super.fromJson(jsonObject);
    this.deserializeAutomatically(jsonObject);
  }

  /**
   * Serializes the pipeline's state to a JSON object.
   * @returns The serialized JSON data.
   */
  public override toJsonObject(): JsonSerializedData {
    return this.serializeAutomatically();
  }
}

ObjectInstanciator.addDependency('RenderPipeline', RenderPipeline.instanciate, {
  name: 'RenderPipeline',
  type: ClassType.RenderBehaviour,
  path: 'Renderers/RenderPipeline',
  description:
    'Modular Render Pipeline supporting injected passes with internal single buffering functionality.',
});
