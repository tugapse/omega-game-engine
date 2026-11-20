import { Scene, Camera } from "../../entities";
import { ClassType } from "../../enums/class-type.enum";
import { JsonSerializedData } from "../../interfaces";
import { ShaderSources } from "../../shaders/shader-sources";
import { CameraUBO } from "../camera-ubo";
import { JsonSerializable } from "../json-serializable";
import { ObjectInstanciator } from "../object-instanciator";
import { NumberRange } from "../range";
import { buildFrameData } from "./frame-data";
import { LightsUBO } from "./lights-ubo";
import { FullscreenProgram } from "./fullscreen-program";
import { GeometryPass, ShadowAtlasPass } from "./pass";

import { planShadows } from "./shadows";
import { PostEffect, RetroEffect } from "./post-effect";
import { IRenderPass, RenderContext } from "./render-pass.interface";
import { RenderTarget, RenderTargetColor } from "./render-target";
import { Resources } from "../resources/resources";

/** The off-screen targets of one view (the canvas, or one render texture). */
interface ViewTargets {
  scene: RenderTarget;
  /** Colour-only targets the post effects write into, in turn. */
  post: RenderTarget[];
}

/** Key of the canvas view in `_views`. */
const CANVAS_VIEW = "";

/** How the final copy maps HDR colour to the screen. */
export enum ToneMapping {
  /** Clamp to [0, 1]: looks like an LDR pipeline. */
  None = 0,
  Reinhard = 1,
  /** Filmic curve (Narkowicz's ACES fit). */
  ACES = 2,
}

/**
 * What a scene saves about its rendering. GPU objects (targets, textures,
 * shaders) are never saved: they are rebuilt from these settings.
 */
export class RenderPipelineSettings extends JsonSerializable {
  public shadowsEnabled = true;
  public shadowStrength = new NumberRange(0.4, 0.0, 1.0, 0.0001);
  /** How far from the camera the directional light's shadow reaches, in world units. */
  public shadowDistance = new NumberRange(60, 5, 500, 1);
  /** Scene colour in RGBA16F (when the GPU can render to it), so lights can go above 1. */
  public hdr = true;
  public toneMapping = ToneMapping.None;
  public exposure = new NumberRange(1, 0, 8, 0.01);
  /** CRT post effect. */
  public retroEffect = false;

  constructor() {
    super("RenderPipelineSettings");
  }

  public override toJsonObject(): JsonSerializedData {
    return this.serializeAutomatically();
  }

  public override fromJson(jsonObject: JsonSerializedData): void {
    super.fromJson(jsonObject);
    this.deserializeAutomatically(jsonObject);
  }
}

/**
 * Forward render pipeline. Each frame:
 * 1. shadow map (its own depth target),
 * 2. the scene into an off-screen target (colour + depth), cleared with the
 *    host's clear colour, then any passes added with `addPass`,
 * 3. the post effects, each reading the previous result (ping-pong),
 * 4. a tone-mapped copy to the canvas, depth included, so the host can keep
 *    drawing on top (editor grid, gizmos) with correct occlusion.
 */
export class RenderPipeline extends JsonSerializable {
  static instanciate() {
    return new RenderPipeline();
  }

  public settings = new RenderPipelineSettings();

  protected _gl!: WebGL2RenderingContext;
  protected ubo!: CameraUBO;
  protected lightsUbo: LightsUBO | null = null;
  protected scene!: Scene;
  protected _shadowmapPass!: ShadowAtlasPass;
  protected _geometryPass!: GeometryPass;
  /** Targets per view: the canvas (`CANVAS_VIEW`) and each render texture. */
  protected _views = new Map<string, ViewTargets>();
  protected _copy: FullscreenProgram | null = null;
  private _passes: IRenderPass[] = [];
  private _retro = new RetroEffect();
  /** Post effects in order; disabled ones are skipped. */
  public readonly effects: PostEffect[] = [this._retro];
  private _startTime = performance.now();

  constructor(public override name: string = "Render Pipeline") {
    super("RenderPipeline");
    this._serializationIgnoreKeys.push(
      "_gl", "ubo", "lightsUbo", "scene", "_shadowmapPass", "_geometryPass", "_views", "_copy",
      "_passes", "_retro", "effects", "_startTime",
    );
  }

  public get shadowMap(): ShadowAtlasPass {
    return this._shadowmapPass;
  }

  /** The off-screen target the scene is drawn into (colour + depth textures). */
  public get sceneTarget(): RenderTarget | null {
    return this._views.get(CANVAS_VIEW)?.scene ?? null;
  }

  public setGlRenderingContext(gl: WebGL2RenderingContext): void {
    this._gl = gl;
    this.ubo = new CameraUBO(gl);
    this.lightsUbo?.dispose();
    this.lightsUbo = new LightsUBO(gl);
    this._shadowmapPass?.dispose();
    this._shadowmapPass = new ShadowAtlasPass(gl);
    this._geometryPass ??= new GeometryPass(gl);
    this._geometryPass.setGl(gl);
    this.applySettings();

    this.disposeTargets();
    this._copy?.dispose();
    this._copy = new FullscreenProgram(gl, ShaderSources.frag.copy_with_depth);
    for (const pass of this._passes) pass.initialize(gl);
  }

  public initialize(scene: Scene) {
    this.scene = scene;
  }

  /** Adds a pass that runs after the scene is drawn, into the scene target. */
  public addPass(pass: IRenderPass): void {
    if (this._gl) pass.initialize(this._gl);
    this._passes.push(pass);
  }

  /**
   * Draws the frame: first every camera with a `targetTexture` (other than
   * the main one) into its render texture, then the main camera to the canvas.
   */
  public draw(): void {
    const gl = this._gl;
    const main = Camera.mainCamera;
    if (!this.scene || !gl || !main || !this._copy) return;

    // The host cleared the canvas with its colour; the scene targets use the same.
    const clearColor = Float32Array.from(gl.getParameter(gl.COLOR_CLEAR_VALUE) as Float32Array);
    const time = (performance.now() - this._startTime) / 1000;
    this.applySettings();

    const resources = Resources.for(gl);
    for (const camera of this.textureCameras(main)) {
      const texture = resources.getRenderTexture(camera.targetTexture);
      const width = Math.max(1, camera.targetWidth | 0);
      const height = Math.max(1, camera.targetHeight | 0);
      camera.aspectRatio = width / height;
      camera.refreshMatrices();
      // Shaders and renderers read the camera from Camera.mainCamera.
      Camera.setMainCamera(camera);
      try {
        const output = texture.beginWrite(width, height);
        this.renderView(camera, texture.textureUri!, width, height, clearColor, time, output);
        texture.endWrite();
      } finally {
        Camera.setMainCamera(main);
      }
    }

    this.renderView(main, CANVAS_VIEW, gl.drawingBufferWidth, gl.drawingBufferHeight, clearColor, time, null);
  }

  /** The active cameras of the scene that draw into a texture, main camera excluded. */
  private textureCameras(main: Camera): Camera[] {
    return this.scene.objects.filter(
      (o): o is Camera => o instanceof Camera && o !== main && o.active && !!o.targetTexture,
    );
  }

  /**
   * One view: shadows, the scene into the view's target, passes, post effects
   * and the tone-mapped copy into `output` (null = the canvas).
   */
  private renderView(
    camera: Camera,
    key: string,
    width: number,
    height: number,
    clearColor: Float32Array,
    time: number,
    output: RenderTarget | null,
  ): void {
    const gl = this._gl;
    const view = this.ensureView(key, width, height);
    const target = view.scene;
    const frame = buildFrameData(this.scene, camera, time);
    const ctx: RenderContext = { gl, frame, target };

    // The atlas is shared, so each view redraws it around its own camera.
    const shadows = planShadows(frame.lights, camera.transform.worldPosition, {
      directionalDistance: this.settings.shadowDistance.value,
    });
    this._shadowmapPass.render(shadows, frame.shadowCasters);
    this._shadowmapPass.bindAtlas();

    this.ubo.update(camera.viewMatrix, camera.projectionMatrix);
    this.lightsUbo!.update(frame.lights, shadows.slotOf);
    target.bind();
    target.clear(clearColor);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);
    this._geometryPass.execute(this.scene, ctx);
    for (const pass of this._passes) pass.execute(this.scene, ctx);

    // Post effects ping-pong between two colour targets; the depth stays in
    // the scene target for the final copy.
    let source = target;
    const effects = this.effects.filter((e) => e.enabled);
    if (effects.length) this.withFullscreenState(() => {
      for (const effect of effects) {
        const destination = this.postTarget(view, source === view.post[0] ? 1 : 0);
        effect.render({ ...ctx, source, target: destination });
        source = destination;
      }
    });

    this.copyTo(output, source, target);
  }

  public resize(width: number, height: number): void {
    const canvas = this._views.get(CANVAS_VIEW);
    canvas?.scene.resize(width, height);
    for (const t of canvas?.post ?? []) t.resize(width, height);
    for (const pass of this._passes) pass.resize(width, height);
  }

  public destroy(): void {
    this.disposeTargets();
    this._copy?.dispose();
    this.lightsUbo?.dispose();
    for (const effect of this.effects) effect.dispose();
    this._shadowmapPass?.dispose();
    for (const pass of this._passes) pass.cleanup();
    this._copy = null;
  }

  /**
   * Writes `color`'s colour (tone mapped) and `depth`'s depth into `output`,
   * or into the canvas when it is null. Render textures have no depth, so
   * only the colour lands there.
   */
  private copyTo(output: RenderTarget | null, color: RenderTarget, depth: RenderTarget): void {
    const gl = this._gl;
    if (output) {
      output.bind();
    } else {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }
    this.withFullscreenState(() => {
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.ALWAYS);
      gl.depthMask(true);
      const copy = this._copy!;
      copy.use();
      copy.bindTexture("u_color", color.colorTexture, 0);
      copy.bindTexture("u_depth", depth.depthTexture, 1);
      gl.uniform1i(copy.uniform("u_toneMapping"), this.settings.toneMapping);
      gl.uniform1f(copy.uniform("u_exposure"), this.settings.exposure.value);
      copy.draw();
      gl.depthFunc(gl.LESS);
    });
  }

  /**
   * Runs full-screen draws with blending, culling and depth testing off, then
   * restores them. Passes leave state behind (the shadow pass culls front
   * faces, which would cull the full-screen triangle).
   */
  private withFullscreenState(draw: () => void): void {
    const gl = this._gl;
    const blend = gl.isEnabled(gl.BLEND);
    const cull = gl.isEnabled(gl.CULL_FACE);
    const depthTest = gl.isEnabled(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
    gl.disable(gl.CULL_FACE);
    gl.disable(gl.DEPTH_TEST);
    draw();
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.activeTexture(gl.TEXTURE0);
    if (blend) gl.enable(gl.BLEND);
    if (cull) gl.enable(gl.CULL_FACE);
    if (depthTest) gl.enable(gl.DEPTH_TEST); else gl.disable(gl.DEPTH_TEST);
  }

  private colorFormat(): RenderTargetColor {
    return this.settings.hdr && RenderTarget.supportsFloatColor(this._gl) ? "rgba16f" : "rgba8";
  }

  /** The targets of view `key` at this size and in the colour format the settings ask for. */
  private ensureView(key: string, width: number, height: number): ViewTargets {
    let view = this._views.get(key);
    if (view && view.scene.color !== this.colorFormat()) {
      this.disposeView(view);
      view = undefined;
    }
    if (!view) {
      view = {
        scene: new RenderTarget(this._gl, width, height, { color: this.colorFormat(), depth: "texture" }),
        post: [],
      };
      this._views.set(key, view);
    }
    view.scene.resize(width, height);
    return view;
  }

  /** Post target `i` (0 or 1) of a view, created on first use like its scene target, without depth. */
  private postTarget(view: ViewTargets, i: number): RenderTarget {
    const like = view.scene;
    let t = view.post[i];
    if (!t || t.color !== like.color) {
      t?.dispose();
      t = view.post[i] = new RenderTarget(this._gl, like.width, like.height, { color: like.color, depth: null });
    }
    t.resize(like.width, like.height);
    return t;
  }

  private disposeView(view: ViewTargets): void {
    view.scene.dispose();
    for (const t of view.post) t.dispose();
  }

  private disposeTargets(): void {
    for (const view of this._views.values()) this.disposeView(view);
    this._views.clear();
  }

  private applySettings(): void {
    if (!this._shadowmapPass) return;
    this._shadowmapPass.enabled = this.settings.shadowsEnabled;
    this._shadowmapPass.shadowstrength = this.settings.shadowStrength;
    this._retro.enabled = this.settings.retroEffect;
  }

  public override fromJson(jsonObject: JsonSerializedData): void {
    super.fromJson(jsonObject);
    if (jsonObject["settings"]) this.settings.fromJson(jsonObject["settings"]);
    this.applySettings();
  }

  public override toJsonObject(): JsonSerializedData {
    return { ...this.getBaseJsonInfo(), settings: this.settings.toJsonObject() };
  }
}

ObjectInstanciator.addDependency("RenderPipeline", RenderPipeline.instanciate, {
  name: "RenderPipeline",
  type: ClassType.RenderBehaviour,
  path: "Renderers/RenderPipeline",
  description: "Forward render pipeline: shadow map, scene into an off-screen target, copy to the canvas.",
});
