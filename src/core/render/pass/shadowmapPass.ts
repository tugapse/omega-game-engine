import { mat4 } from "gl-matrix";
import { RendererBehaviour } from "../../../behaviours";
import { ShaderUniformsEnum } from "../../../enums";
import { JsonSerializedData } from "../../../interfaces";
import { Shader, ShaderSources } from "../../../shaders";
import { Texture } from "../../../textures";
import { JsonSerializable } from "../../json-serializable";
import { NumberRange } from "../../range";
import { Scene, Camera } from "../../../entities";
import { DirectionalLight } from "../../../entities/lights";
import { IRenderPass } from "../render-pass.interface";

/**
 * A render pass dedicated to generating a shadow map from the perspective of a directional light.
 *
 * @remarks
 * This pass renders the scene's geometry into a high-resolution depth texture.
 * The rendering is done from the viewpoint of the primary directional light source.
 * The resulting depth texture (the "shadow map") can then be sampled by other shaders
 * (e.g., `LitShader`) to determine if a fragment is in shadow.
 */
export class ShadowMapPass extends JsonSerializable implements IRenderPass {
  private gl: WebGL2RenderingContext;
  private depthShader: Shader;
  private framebuffer!: WebGLFramebuffer | null;

  /** A configurable range to control the final strength or darkness of the shadows. */
  public shadowstrength: NumberRange = new NumberRange(0.4, 0.0, 1.0, 0.0001);
  /** The depth texture that stores the shadow map. */
  public shadowmapTexture: Texture;
  /** The resolution (width and height) of the shadow map texture. Higher values produce sharper shadows at a performance cost. */
  public static shadowMapSize = 4096;
  /** A flag to enable or disable this pass. If disabled, no shadows will be rendered. */
  public enabled = true;

  /**
   * Creates an instance of ShadowMapPass.
   * @param gl - The WebGL2 rendering context.
   */
  constructor(gl: WebGL2RenderingContext) {
    super('ShadowMapPass');
    this.gl = gl;

    // Initialize a self-contained depth texture. This texture will store depth values
    // from the light's point of view.
    this.shadowmapTexture = Texture.createDepthTexture(
      this.gl,
      ShadowMapPass.shadowMapSize,
      ShadowMapPass.shadowMapSize,
    );
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.shadowmapTexture.glTexture);
    this.gl.texParameteri(
      // Enable hardware comparison mode for the depth texture. This allows shaders
      // to perform a depth comparison directly on the texture lookup (PCF).
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_COMPARE_MODE,
      this.gl.COMPARE_REF_TO_TEXTURE,
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_COMPARE_FUNC,
      this.gl.LEQUAL,
    );
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);

    // A dedicated, lightweight shader that only writes depth information.
    this.depthShader = new Shader(
      gl,
      null as any,
      ShaderSources.frag.depth_only,
      ShaderSources.vertex.shadow_caster,
    );
    this.depthShader.initialize();
  }

  /**
   * Sets the WebGL rendering context for the pass.
   * @param gl - The WebGL2 rendering context.
   */
  setGl(gl: WebGL2RenderingContext): void {
    this.gl = gl;
  }

  /**
   * Lazily creates and returns the framebuffer object for off-screen rendering.
   * @private
   */
  private getOrCreateFramebuffer(): WebGLFramebuffer {
    if (!this.framebuffer) {
      this.framebuffer = this.gl.createFramebuffer();
    }
    return this.framebuffer!;
  }

  /**
   * Initializes the render pass by creating the necessary framebuffer.
   */
  public initialize(): void {
    if (!this.framebuffer) {
      this.framebuffer = this.gl.createFramebuffer();
    }
  }

  /**
   * Executes the shadow map rendering pass.
   * It renders all shadow-casting objects from the perspective of the main directional light
   * into the depth texture.
   * @param scene - The scene containing the objects and lights to render.
   */
  public execute(scene: Scene): void {
    if (
      !this.enabled ||
      !this.shadowmapTexture.glTexture ||
      !this.depthShader._shaderProgram
    ) {
      this.clearShadowMap();
      return;
    }

    const lightEntity = scene.lights.find(
      (obj) =>
        obj.entityType === 1 /* EntityType.LIGHT_DIRECTIONAL */ &&
        obj.active &&
        obj.show,
    ) as DirectionalLight | undefined;

    if (!lightEntity) {
      this.clearShadowMap();
      return;
    }

    // 1. Bind the framebuffer and attach the depth texture as the render target.
    const fb = this.getOrCreateFramebuffer();
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fb);
    this.gl.framebufferTexture2D(
      this.gl.FRAMEBUFFER,
      this.gl.DEPTH_ATTACHMENT,
      this.gl.TEXTURE_2D,
      this.shadowmapTexture.glTexture,
      0,
    );
    // We don't need to write to a color buffer, only the depth buffer.
    this.gl.drawBuffers([this.gl.NONE]);

    const status = this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER);
    if (status !== this.gl.FRAMEBUFFER_COMPLETE) {
      console.error('ShadowMapPass: Framebuffer incomplete, status:', status);
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
      return;
    }

    // 2. Set the viewport to the size of the shadow map and clear the depth buffer.
    this.gl.viewport(
      0,
      0,
      this.shadowmapTexture.width,
      this.shadowmapTexture.height,
    );
    this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LESS);

    this.depthShader.use();

    // 3. Find all objects in the scene that are flagged to cast shadows.
    const shadowCasters = scene.objects.filter(
      (obj) =>
        obj.active &&
        obj.show &&
        obj.getBehaviour(RendererBehaviour)?.castShadows,
    );

    // 4. Render each shadow caster into the depth map.
    for (const entity of shadowCasters) {
      const renderer = entity.getBehaviour(RendererBehaviour);
      if (!renderer || !renderer.shader) continue;

      // Use front-face culling to prevent "shadow acne" by creating a small bias.
      this.gl.enable(this.gl.CULL_FACE);
      this.gl.cullFace(this.gl.FRONT);

      const posLoc = this.gl.getAttribLocation(
        this.depthShader._shaderProgram,
        ShaderUniformsEnum.A_POSITION,
      );
      if (posLoc !== -1 && renderer.shader.buffers.position) {
        this.gl.bindBuffer(
          this.gl.ARRAY_BUFFER,
          renderer.shader.buffers.position,
        );
        this.gl.vertexAttribPointer(posLoc, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(posLoc);
      }

      this.gl.bindBuffer(
        this.gl.ELEMENT_ARRAY_BUFFER,
        renderer.shader.buffers.indices,
      );

      // Calculate the Model-View-Projection matrix from the light's perspective for this object.
      const { lightMvpMatrix } = renderer.createLightMatrices(
        Camera.mainCamera.transform,
        lightEntity,
      );
      
      const modelLightMvpMatrix = mat4.create();
      mat4.multiply(
        modelLightMvpMatrix,
        lightMvpMatrix,
        entity.transform.modelMatrix,
      );

      this.depthShader.setMat4(
        ShaderUniformsEnum.U_MODEL_MATRIX,
        modelLightMvpMatrix,
      );
      this.depthShader.loadDataIntoShader();

      this.gl.drawElements(
        WebGL2RenderingContext.TRIANGLES,
        renderer.mesh.meshData.indices.length,
        this.gl.UNSIGNED_SHORT,
        0,
      );

      if (posLoc !== -1) this.gl.disableVertexAttribArray(posLoc);
    }

    // 5. Unbind the framebuffer, returning rendering to the default canvas or next pass target.
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    this.depthShader.release();
  }

  /**
   * Clears the shadow map texture. This is useful if shadows are disabled to ensure old data isn't used.
   */
  public clearShadowMap(): void {
    const fb = this.getOrCreateFramebuffer();
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fb);
    this.gl.framebufferTexture2D(
      this.gl.FRAMEBUFFER,
      this.gl.DEPTH_ATTACHMENT,
      this.gl.TEXTURE_2D,
      this.shadowmapTexture.glTexture,
      0,
    );
    this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
  }

  /**
   * Cleans up and deletes the WebGL resources (texture, shader, framebuffer) used by this pass.
   */
  public cleanup(): void {
    this.shadowmapTexture.destroy();
    this.depthShader.destroy();
    if (this.framebuffer) this.gl.deleteFramebuffer(this.framebuffer);
  }

  /**
   * Called when the viewport resizes. This pass is not affected by screen size, as the shadow map
   * has a fixed resolution.
   * @param width - The new viewport width.
   * @param height - The new viewport height.
   */
  public resize(width: number, height: number): void {}

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