import { mat4 } from "gl-matrix";
import { EngineCache } from "../../core";
import { Camera } from "../../entities";
import { RenderLayer, ShaderUniformsEnum } from "../../enums";
import { SkyboxMaterial } from "../../materials";
import { CubePrimitive } from "../../primitives";
import { SkyboxShader } from "../../shaders";
import { MeshRendererBehaviour } from "./mesh-renderer-behaviour";


/**
 * A specialized renderer for drawing a skybox.
 * This class extends {@link MeshRendererBehaviour} and is responsible for rendering a large cube with a cubemap texture,
 * creating the illusion of a sky and distant background. It is typically rendered last with depth testing enabled but depth writing disabled.
 *
 * @augments {MeshRendererBehaviour}
 */
export class SkyboxRenderer extends MeshRendererBehaviour {
  /**
   * Creates a new instance of the SkyboxRenderer.
   * @param gl - The WebGL2 rendering context.
   * @override
   */
  static override instanciate(gl: WebGL2RenderingContext): SkyboxRenderer {
    return new SkyboxRenderer(gl);
  }

  /**
   * Creates an instance of SkyboxRenderer.
   * @param gl - The WebGL2 rendering context.
   */
  constructor(gl:WebGL2RenderingContext){
    super(gl);
    this._className = "SkyboxRenderer";
    this.createDefaultSkybox();
  }
  
  /**
   * Asynchronously creates and assigns a default skybox setup.
   * This includes a cube mesh, a `SkyboxMaterial`, a `SkyboxShader`, and a default white cubemap texture.
   * @protected
   */
  protected async createDefaultSkybox(): Promise<void> {
    this.mesh.meshData = new CubePrimitive();
    const material = new SkyboxMaterial();
    this.shader = new SkyboxShader(this._gl, material);
    this.renderLayer = RenderLayer.SKYBOX;
    material.mainTex = await EngineCache.getWhiteTextureCube(this._gl);
  }

  /**
   * Initializes the skybox renderer.
   * This method sets the initial transform of the skybox to be large enough to encompass the entire scene
   * and ensures it is centered at the origin.
   * @override
   */
  override initialize(): boolean {
    if(this.transform){
      this.transform.setLocalPosition(0, 0, 0);
      this.transform.setLocalScale(1000, 1000, 1000);
    }
    return super.initialize()
  }
  
  /**
   * Gets the `SkyboxMaterial` associated with this renderer's shader.
   * @returns The skybox material instance.
   */
  public get material():SkyboxMaterial {
    return this.shader?.material as SkyboxMaterial;
  }

  /**
   * Sets the specific WebGL settings for rendering the skybox.
   * This method ensures that the skybox is rendered correctly by culling the front faces (since the camera is inside the cube)
   * and using the `LEQUAL` depth function to ensure it is drawn behind all other objects.
   * @protected
   * @override
   */
  protected override setGlSettings(): void {
    this._gl.cullFace(this._gl.FRONT);
    this._gl.depthFunc(this._gl.LEQUAL);
  }


  /**
   * Sets the camera matrices for the skybox, ensuring the skybox remains centered on the camera.
   * This is achieved by using a view matrix that has had its translation component removed, effectively
   * making the skybox follow the camera's rotation but not its position.
   * @override
   */
  override setCameraMatrices(): void {
    if (!this.shader?._shaderProgram) {
      return;
    }

    const camera = Camera.mainCamera;

    // Create a view matrix without translation to keep the skybox centered
    const viewMatrixNoTranslation = mat4.clone(camera.viewMatrix);
    viewMatrixNoTranslation[12] = 0;
    viewMatrixNoTranslation[13] = 0;
    viewMatrixNoTranslation[14] = 0;

    const mvpMatrix = mat4.create();
    this.transform.updateMatrices();
    mat4.multiply(mvpMatrix, camera.projectionMatrix, viewMatrixNoTranslation);
    mat4.multiply(mvpMatrix, mvpMatrix, this.parent.transform.modelMatrix);
    this.shader.setMat4(ShaderUniformsEnum.U_MVP_MATRIX, mvpMatrix);
  }

  /**
   * Overrides the default draw call to apply skybox-specific GL settings and shader variables.
   * @override
   */
  override draw(): void {
    if (!this.shader?._shaderProgram) {
      return;
    }
    this.setGlSettings();
    this.setCameraMatrices();
    this.setShaderVariables();
    super.draw();
    this.shader?.release();
  }

  /**
   * Sets all shader variables required for rendering the skybox.
   * This method orchestrates setting the GL state and camera matrices before passing control to the base class.
   * @override
   */
  override setShaderVariables(): void {
    if (!this.shader?._shaderProgram) {
      return;
    }

    super.setShaderVariables();
    this.setGlSettings();
    this.setCameraMatrices();
  }

}
