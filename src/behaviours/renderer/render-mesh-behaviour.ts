import { vec3 } from "gl-matrix";
import { DirectionalLight, Light, PointLight, SpotLight } from "../../entities/light";
import { EntityType } from "../../enums/entity-type";
import { ShaderUniformsEnum } from "../../enums/shader-uniforms.enum";
import { LitMaterial } from "../../materials/lit-material";
import { LitShader } from "../../shaders/lit-shader";
import { RendererBehaviour } from "./renderer-behaviour";
import { GLPrimitiveType } from "../../enums/gl-primitive-type.enum";

/**
  A renderer for mesh-based objects, providing support for normal maps and lighting.
 * @augments {RendererBehaviour}
 */
export class RenderMeshBehaviour extends RendererBehaviour {
  /**
    Creates a new instance of the RenderMeshBehaviour.
   * @override
    
   * @param {WebGL2RenderingContext} gl - The WebGL2 rendering context.
   * @returns {RenderMeshBehaviour}
   */
  static override instanciate(gl: WebGL2RenderingContext): RenderMeshBehaviour {
    return new RenderMeshBehaviour(gl);
  }

  /**
    The uniform location for the normal map texture.
   * @protected
   * @type {WebGLUniformLocation | null}
   */
  protected normalMapUniformLocation: WebGLUniformLocation | null = null;
  /**
    The attribute location for the tangent vector.
   * @protected
   * @type {GLint}
   */
  protected tangentAttributeLocation: GLint = -1;
  /**
    The attribute location for the bitangent vector.
   * @protected
   * @type {GLint}
   */
  protected bitangentAttributeLocation: GLint = -1;
  /**
    A flag to enable or disable normal mapping.
   * @type {boolean}
   */
  public enableNormalmaps = true;
  /**
    A flag to enable or disable lighting calculations.
   * @type {boolean}
   */
  public enableLights = true;

  /**
    Creates an instance of RenderMeshBehaviour.
   * @param {WebGL2RenderingContext} gl - The WebGL2 rendering context.
   */
  constructor(public override gl: WebGL2RenderingContext) {
    super(gl);
    this.drawPrimitiveType = GLPrimitiveType.TRIANGLES;
  }

  /**
    Draws the mesh to the canvas.
   * @override
   */
  override draw(): void {
    if (!this.mesh || !this.shader?.shaderProgram) {
      return;
    }

    this.getNormalMapLocations();
    this.shader.bindBuffers();
    this.shader.use();
    this.setShaderVariables();
    this.gl.drawElements(this.drawPrimitiveType, this.mesh.meshData.indices.length, this.gl.UNSIGNED_SHORT, 0);
  }

  /**
    Initializes the shader and its buffers for the mesh, including normal, tangent, and bitangent data.
   * @protected
   * @override
   */
  protected override initializeShader(): void {
    super.initializeShader();
    if (!this.shader) return;
    this.shader.buffers.normal = this.gl.createBuffer();
    this.shader.buffers.tangent = this.gl.createBuffer();
    this.shader.buffers.bitangent = this.gl.createBuffer();
    this.shader.initBuffers(this.gl, this.mesh.meshData);
  }

  /**
    Sets the shader variables for lighting and normal maps before drawing.
   * @protected
   * @override
   */
  protected override setShaderVariables(): void {
    this.setLightInformation();
    this.setNormalMapsInformation();
    super.setShaderVariables();
  }

  /**
    Retrieves the uniform and attribute locations related to normal maps.
   * @protected
   */
  protected getNormalMapLocations(): void {
    if (this.shader?.shaderProgram && this.enableNormalmaps) {
      this.normalMapUniformLocation = this.gl.getUniformLocation(this.shader.shaderProgram, ShaderUniformsEnum.U_NORMAL_MAP);
      this.worldMatrixUniformLocation = this.gl.getUniformLocation(this.shader.shaderProgram, ShaderUniformsEnum.U_WORLD_MATRIX);
      this.worldInverseTransposeMatrixUniformLocation = this.gl.getUniformLocation(this.shader.shaderProgram, ShaderUniformsEnum.U_WORLD_INVERSE_TRANSPOSE_MATRIX);
      this.tangentAttributeLocation = this.gl.getAttribLocation(this.shader.shaderProgram, ShaderUniformsEnum.A_TANGENT);
      this.bitangentAttributeLocation = this.gl.getAttribLocation(this.shader.shaderProgram, ShaderUniformsEnum.A_BITANGENT);
    }
  }

  /**
    Binds the normal map texture to a texture unit and sets the corresponding uniform.
   * @protected
   */
  protected setNormalMapsInformation(): void {
    if (!this.shader) return;

    const material = this.shader.material as LitMaterial;
    if (material.normalTex && material.normalTex.glTexture && this.normalMapUniformLocation) {
      this.gl.activeTexture(this.gl.TEXTURE1);
      this.gl.bindTexture(this.gl.TEXTURE_2D, material.normalTex.glTexture);
      this.gl.uniform1i(this.normalMapUniformLocation, 1);
    }
  }

  /**
    Gathers and sets lighting information in the shader.
   * @protected
   */
  protected setLightInformation(): void {
    if (this.shader instanceof LitShader && this.enableLights) {
      const lights = this.parent.scene.lights.filter((light) => light.active && light.show);

      const ambientLight = lights.find((l) => l.entityType === EntityType.LIGHT_AMBIENT);
      if (ambientLight) {
        this.shader.setVec4(ShaderUniformsEnum.U_AMBIENT_LIGHT, ambientLight.color.toVec4());
      } else {
        this.shader.setVec4(ShaderUniformsEnum.U_AMBIENT_LIGHT, [0.1, 0.1, 0.1, 1]);
      }

      this.createLightObjectInfo(lights);
    }
  }

  /**
    Separates lights into their respective types and loads their data into the shader.
   * @protected
   * @param {Light[]} sceneLights - An array of all lights in the scene.
   */
  protected createLightObjectInfo(sceneLights: Light[]): void {
    if (this.enableLights === false) return;
    const directionalLights: DirectionalLight[] = sceneLights.filter((e) => e.entityType === EntityType.LIGHT_DIRECTIONAL) as DirectionalLight[];
    const pointLights: PointLight[] = sceneLights.filter((e) => e.entityType === EntityType.LIGHT_POINT) as PointLight[];
    const spotLights: SpotLight[] = sceneLights.filter((e) => e.entityType === EntityType.LIGHT_SPOT) as SpotLight[];

    this.loadDirectionalLights(directionalLights);
    this.loadPointLights(pointLights);
    this.loadSpotLights(spotLights);
  }

  /**
    Loads spot light data into the shader's uniform arrays.
   * @protected
   * @param {SpotLight[]} spotLights - An array of spot lights.
   */
  protected loadSpotLights(spotLights: SpotLight[]): void {
    if (!this.shader) return;

    const uNumSpotLightsLoc = this.gl.getUniformLocation(this.shader.shaderProgram!, "u_numSpotLights");
    const uSpotPositionsLoc = this.gl.getUniformLocation(this.shader.shaderProgram!, "u_spotLightPositions[0]");
    const uSpotDirectionsLoc = this.gl.getUniformLocation(this.shader.shaderProgram!, "u_spotLightDirections[0]");
    const uSpotColorsLoc = this.gl.getUniformLocation(this.shader.shaderProgram!, "u_spotLightColors[0]");
    const uSpotInnerConeCosLoc = this.gl.getUniformLocation(this.shader.shaderProgram!, "u_spotLightInnerConeCos[0]");
    const uSpotOuterConeCosLoc = this.gl.getUniformLocation(this.shader.shaderProgram!, "u_spotLightOuterConeCos[0]");
    const uSpotConstAttsLoc = this.gl.getUniformLocation(this.shader.shaderProgram!, "u_spotLightConstantAtts[0]");
    const uSpotLinearAttsLoc = this.gl.getUniformLocation(this.shader.shaderProgram!, "u_spotLightLinearAtts[0]");
    const uSpotQuadraticAttsLoc = this.gl.getUniformLocation(this.shader.shaderProgram!, "u_spotLightQuadraticAtts[0]");

    const spotPositionsFlat: number[] = [];
    const spotDirectionsFlat: number[] = [];
    const spotColorsFlat: number[] = [];
    const spotInnerConeCosFlat: number[] = [];
    const spotOuterConeCosFlat: number[] = [];
    const spotConstAttsFlat: number[] = [];
    const spotLinearAttsFlat: number[] = [];
    const spotQuadraticAttsFlat: number[] = [];

    spotLights.forEach((light) => {
      spotPositionsFlat.push(...light.transform.position);
      const normalizedDir = vec3.normalize(vec3.create(), light.direction);
      spotDirectionsFlat.push(...normalizedDir);
      spotColorsFlat.push(...light.color.toVec3());
      spotInnerConeCosFlat.push(Math.cos(light.coneAngles.inner));
      spotOuterConeCosFlat.push(Math.cos(light.coneAngles.outer));
      spotConstAttsFlat.push(light.attenuation.constant);
      spotLinearAttsFlat.push(light.attenuation.linear);
      spotQuadraticAttsFlat.push(light.attenuation.quadratic);
    });

    if (uNumSpotLightsLoc) this.gl.uniform1i(uNumSpotLightsLoc, spotLights.length);
    if (spotLights.length > 0) {
      if (uSpotPositionsLoc) this.gl.uniform3fv(uSpotPositionsLoc, spotPositionsFlat);
      if (uSpotDirectionsLoc) this.gl.uniform3fv(uSpotDirectionsLoc, spotDirectionsFlat);
      if (uSpotColorsLoc) this.gl.uniform3fv(uSpotColorsLoc, spotColorsFlat);
      if (uSpotInnerConeCosLoc) this.gl.uniform1fv(uSpotInnerConeCosLoc, spotInnerConeCosFlat);
      if (uSpotOuterConeCosLoc) this.gl.uniform1fv(uSpotOuterConeCosLoc, spotOuterConeCosFlat);
      if (uSpotConstAttsLoc) this.gl.uniform1fv(uSpotConstAttsLoc, spotConstAttsFlat);
      if (uSpotLinearAttsLoc) this.gl.uniform1fv(uSpotLinearAttsLoc, spotLinearAttsFlat);
      if (uSpotQuadraticAttsLoc) this.gl.uniform1fv(uSpotQuadraticAttsLoc, spotQuadraticAttsFlat);
    }
  }

  /**
    Loads directional light data into the shader's uniform arrays.
   * @protected
   * @param {DirectionalLight[]} directionalLights - An array of directional lights.
   */
  protected loadDirectionalLights(directionalLights: DirectionalLight[]): void {
    if (!this.shader) return;

    const uNumDirLightsLoc = this.gl.getUniformLocation(this.shader.shaderProgram!, "u_numDirectionalLights");
    const uDirDirectionsLoc = this.gl.getUniformLocation(this.shader.shaderProgram!, "u_directionalLightDirections[0]");
    const uDirColorsLoc = this.gl.getUniformLocation(this.shader.shaderProgram!, "u_directionalLightColors[0]");

    const dirDirectionsFlat: number[] = [];
    const dirColorsFlat: number[] = [];

    directionalLights.forEach((light) => {
      const normalizedDir = vec3.normalize(vec3.create(), light.direction);
      dirDirectionsFlat.push(...normalizedDir);
      dirColorsFlat.push(...light.color.toVec3());
    });

    if (uNumDirLightsLoc) this.gl.uniform1i(uNumDirLightsLoc, directionalLights.length);
    if (directionalLights.length > 0) {
      if (uDirDirectionsLoc) this.gl.uniform3fv(uDirDirectionsLoc, dirDirectionsFlat);
      if (uDirColorsLoc) this.gl.uniform3fv(uDirColorsLoc, dirColorsFlat);
    }
  }

  /**
    Loads point light data into the shader's uniform arrays.
   * @protected
   * @param {PointLight[]} pointLights - An array of point lights.
   */
  protected loadPointLights(pointLights: PointLight[]): void {
    if (!this.shader) return;

    const uNumPointLightsLoc = this.gl.getUniformLocation(this.shader.shaderProgram!, "u_numPointLights");
    const uPointPositionsLoc = this.gl.getUniformLocation(this.shader.shaderProgram!, "u_pointLightPositions[0]");
    const uPointColorsLoc = this.gl.getUniformLocation(this.shader.shaderProgram!, "u_pointLightColors[0]");
    const uPointConstAttsLoc = this.gl.getUniformLocation(this.shader.shaderProgram!, "u_pointLightConstantAtts[0]");
    const uPointLinearAttsLoc = this.gl.getUniformLocation(this.shader.shaderProgram!, "u_pointLightLinearAtts[0]");
    const uPointQuadraticAttsLoc = this.gl.getUniformLocation(this.shader.shaderProgram!, "u_pointLightQuadraticAtts[0]");

    const pointPositionsFlat: number[] = [];
    const pointColorsFlat: number[] = [];
    const pointConstAttsFlat: number[] = [];
    const pointLinearAttsFlat: number[] = [];
    const pointQuadraticAttsFlat: number[] = [];

    pointLights.forEach((light) => {
      pointPositionsFlat.push(...light.transform.position);
      pointColorsFlat.push(...light.color.toVec3());
      pointConstAttsFlat.push(light.attenuation.constant);
      pointLinearAttsFlat.push(light.attenuation.linear);
      pointQuadraticAttsFlat.push(light.attenuation.quadratic);
    });

    if (uNumPointLightsLoc) this.gl.uniform1i(uNumPointLightsLoc, pointLights.length);
    if (pointLights.length > 0) {
      if (uPointPositionsLoc) this.gl.uniform3fv(uPointPositionsLoc, pointPositionsFlat);
      if (uPointColorsLoc) this.gl.uniform3fv(uPointColorsLoc, pointColorsFlat);
      if (uPointConstAttsLoc) this.gl.uniform1fv(uPointConstAttsLoc, pointConstAttsFlat);
      if (uPointLinearAttsLoc) this.gl.uniform1fv(uPointLinearAttsLoc, pointLinearAttsFlat);
      if (uPointQuadraticAttsLoc) this.gl.uniform1fv(uPointQuadraticAttsLoc, pointQuadraticAttsFlat);
    }
  }
}