import { Scene, Camera } from "../../entities";
import { ClassType } from "../../enums/class-type.enum";
import { JsonSerializedData } from "../../interfaces";
import { ShaderSources } from "../../shaders/shader-sources";
import { CameraUBO } from "../camera-ubo";
import { JsonSerializable } from "../json-serializable";
import { ObjectInstanciator } from "../object-instanciator";
import { NumberRange } from "../range";
import { FullscreenProgram } from "./fullscreen-program";
import { ShadowMapPass, GeometryPass } from "./pass";
import { IRenderPass } from "./render-pass.interface";
import { RenderTarget } from "./render-target";

/**
 * What a scene saves about its rendering. GPU objects (targets, textures,
 * shaders) are never saved: they are rebuilt from these settings.
 */
export class RenderPipelineSettings extends JsonSerializable {
  public shadowsEnabled = true;
  public shadowStrength = new NumberRange(0.4, 0.0, 1.0, 0.0001);

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
 * 3. a copy of that target to the canvas, depth included, so the host can keep
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
  protected _copy: FullscreenProgram | null = null;
  private _passes: IRenderPass[] = [];

  constructor(public override name: string = "Render Pipeline") {
    super("RenderPipeline");
    this._serializationIgnoreKeys.push(
      "_gl", "ubo", "scene", "_shadowmapPass", "_geometryPass", "_sceneTarget", "_copy", "_passes",
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

    this._sceneTarget?.dispose();
    this._sceneTarget = new RenderTarget(gl, gl.drawingBufferWidth, gl.drawingBufferHeight, {
      color: "rgba8",
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
    const target = this._sceneTarget;
    target.resize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    this.applySettings();
    this._shadowmapPass.execute(this.scene);

    this.ubo.update(camera.viewMatrix, camera.projectionMatrix);
    target.bind();
    target.clear(clearColor);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);
    this._geometryPass.execute(this.scene);
    for (const pass of this._passes) pass.execute(this.scene);

    this.copyToCanvas(target);
  }

  public resize(width: number, height: number): void {
    this._sceneTarget?.resize(width, height);
    for (const pass of this._passes) pass.resize(width, height);
  }

  public destroy(): void {
    this._sceneTarget?.dispose();
    this._copy?.dispose();
    this._shadowmapPass?.cleanup();
    for (const pass of this._passes) pass.cleanup();
    this._sceneTarget = null;
    this._copy = null;
  }

  /** Writes the target's colour and depth to the canvas, replacing what is there. */
  private copyToCanvas(target: RenderTarget): void {
    const gl = this._gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    // Passes leave state behind (the shadow pass culls front faces): the copy
    // owns blend and culling while it draws, then puts them back.
    const blend = gl.isEnabled(gl.BLEND);
    const cull = gl.isEnabled(gl.CULL_FACE);
    gl.disable(gl.BLEND);
    gl.disable(gl.CULL_FACE);
    gl.depthFunc(gl.ALWAYS);
    gl.depthMask(true);

    this._copy!.use();
    this._copy!.bindTexture("u_color", target.colorTexture, 0);
    this._copy!.bindTexture("u_depth", target.depthTexture, 1);
    this._copy!.draw();

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.activeTexture(gl.TEXTURE0);
    gl.depthFunc(gl.LESS);
    if (blend) gl.enable(gl.BLEND);
    if (cull) gl.enable(gl.CULL_FACE);
  }

  private applySettings(): void {
    if (!this._shadowmapPass) return;
    this._shadowmapPass.enabled = this.settings.shadowsEnabled;
    this._shadowmapPass.shadowstrength = this.settings.shadowStrength;
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
