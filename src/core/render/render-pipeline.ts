import { Scene, Camera } from "../../entities";
import { ClassType } from "../../enums/class-type.enum";
import { JsonSerializedData } from "../../interfaces";
import { ShaderSources } from "../../shaders/shader-sources";
import { CameraUBO } from "../camera-ubo";
import { JsonSerializable } from "../json-serializable";
import { ObjectInstanciator } from "../object-instanciator";
import { NumberRange } from "../range";
import { buildFrameData } from "./frame-data";
import { FullscreenProgram } from "./fullscreen-program";
import { ShadowMapPass, GeometryPass } from "./pass";
import { PostEffect, RetroEffect } from "./post-effect";
import { IRenderPass, RenderContext } from "./render-pass.interface";
import { RenderTarget, RenderTargetColor } from "./render-target";

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
  protected scene!: Scene;
  protected _shadowmapPass!: ShadowMapPass;
  protected _geometryPass!: GeometryPass;
  protected _sceneTarget: RenderTarget | null = null;
  /** Colour-only targets the post effects write into, in turn. */
  protected _postTargets: RenderTarget[] = [];
  protected _copy: FullscreenProgram | null = null;
  private _passes: IRenderPass[] = [];
  private _retro = new RetroEffect();
  /** Post effects in order; disabled ones are skipped. */
  public readonly effects: PostEffect[] = [this._retro];
  private _startTime = performance.now();

  constructor(public override name: string = "Render Pipeline") {
    super("RenderPipeline");
    this._serializationIgnoreKeys.push(
      "_gl", "ubo", "scene", "_shadowmapPass", "_geometryPass", "_sceneTarget", "_postTargets", "_copy",
      "_passes", "_retro", "effects", "_startTime",
    );
  }

  public get shadowMap(): ShadowMapPass {
    return this._shadowmapPass;
  }

  /** The off-screen target the scene is drawn into (colour + depth textures). */
  public get sceneTarget(): RenderTarget | null {
    return this._sceneTarget;
  }

  public setGlRenderingContext(gl: WebGL2RenderingContext): void {
    this._gl = gl;
    this.ubo = new CameraUBO(gl);
    this._shadowmapPass ??= new ShadowMapPass(gl);
    this._geometryPass ??= new GeometryPass(gl);
    this._shadowmapPass.setGl(gl);
    this._geometryPass.setGl(gl);
    this.applySettings();

    this.disposeTargets();
    this._sceneTarget = new RenderTarget(gl, gl.drawingBufferWidth, gl.drawingBufferHeight, {
      color: this.colorFormat(),
      depth: "texture",
    });
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

  public draw(): void {
    const gl = this._gl;
    const camera = Camera.mainCamera;
    if (!this.scene || !gl || !camera || !this._sceneTarget || !this._copy) return;

    // The host cleared the canvas with its colour; the scene target uses the same.
    const clearColor = gl.getParameter(gl.COLOR_CLEAR_VALUE) as Float32Array;
    this.applySettings();
    const target = this.ensureSceneTarget(gl.drawingBufferWidth, gl.drawingBufferHeight);
    const frame = buildFrameData(this.scene, camera, (performance.now() - this._startTime) / 1000);
    const ctx: RenderContext = { gl, frame, target };

    this._shadowmapPass.execute(this.scene, ctx);

    this.ubo.update(camera.viewMatrix, camera.projectionMatrix);
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
        const destination = this.postTarget(source === this._postTargets[0] ? 1 : 0, target);
        effect.render({ ...ctx, source, target: destination });
        source = destination;
      }
    });

    this.copyToCanvas(source, target);
  }

  public resize(width: number, height: number): void {
    this._sceneTarget?.resize(width, height);
    for (const t of this._postTargets) t.resize(width, height);
    for (const pass of this._passes) pass.resize(width, height);
  }

  public destroy(): void {
    this.disposeTargets();
    this._copy?.dispose();
    for (const effect of this.effects) effect.dispose();
    this._shadowmapPass?.cleanup();
    for (const pass of this._passes) pass.cleanup();
    this._sceneTarget = null;
    this._copy = null;
  }

  /** Writes `color`'s colour (tone mapped) and `depth`'s depth to the canvas. */
  private copyToCanvas(color: RenderTarget, depth: RenderTarget): void {
    const gl = this._gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
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

  /** The scene target at this size and in the colour format the settings ask for. */
  private ensureSceneTarget(width: number, height: number): RenderTarget {
    if (this._sceneTarget!.color !== this.colorFormat()) {
      this.disposeTargets();
      this._sceneTarget = new RenderTarget(this._gl, width, height, { color: this.colorFormat(), depth: "texture" });
    }
    this._sceneTarget!.resize(width, height);
    return this._sceneTarget!;
  }

  /** Post target `i` (0 or 1), created on first use like the scene target, without depth. */
  private postTarget(i: number, like: RenderTarget): RenderTarget {
    let t = this._postTargets[i];
    if (!t || t.color !== like.color) {
      t?.dispose();
      t = this._postTargets[i] = new RenderTarget(this._gl, like.width, like.height, { color: like.color, depth: null });
    }
    t.resize(like.width, like.height);
    return t;
  }

  private disposeTargets(): void {
    this._sceneTarget?.dispose();
    this._sceneTarget = null;
    for (const t of this._postTargets) t.dispose();
    this._postTargets = [];
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
