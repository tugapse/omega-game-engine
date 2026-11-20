import { mat4 } from 'gl-matrix';
import { SceneFog } from '../../core';
import { Camera, Light } from '../../entities';
import { EntityType, GLPrimitiveType, ShaderUniformsEnum } from '../../enums';
import { LitMaterial } from '../../materials';
import { LitShader } from '../../shaders';
import { RendererBehaviour } from './renderer-behaviour';

/**
 * A renderer for mesh-based objects that supports normal maps, lighting, and shadow mapping.
 * This class extends the base RendererBehaviour to provide more advanced rendering features.
 */
export class MeshRendererBehaviour extends RendererBehaviour {
  static override instanciate(
    gl: WebGL2RenderingContext,
  ): MeshRendererBehaviour {
    return new MeshRendererBehaviour(gl);
  }
  protected override _className = 'MeshRendererBehaviour';

  // --- PER-OBJECT PERMANENT BUFFERS TO ELIMINATE GC CHURN ---
  private readonly _mvpScratch = mat4.create();

  protected _normalMapUniformLocation: WebGLUniformLocation | null = null;
  protected _specularMapUniformLocation: WebGLUniformLocation | null = null;
  protected _roughnessMapUniformLocation: WebGLUniformLocation | null = null;
  protected _aoMapUniformLocation: WebGLUniformLocation | null = null;
  protected _emissiveMapUniformLocation: WebGLUniformLocation | null = null;

  protected _tangentAttributeLocation: GLint = -1;
  protected _bitangentAttributeLocation: GLint = -1;

  // Cache for our generated 1x1 fallback textures
  private _defaultTextures: { [key: string]: WebGLTexture } = {};

  public receiveShadows = true;

  public get shadowMapTexture() {
    return this.parent.scene.shadowmap?.shadowmapTexture;
  }

  public get fog() {
    return this.parent.scene['sceneFog'] as SceneFog;
  }

  constructor(public override _gl: WebGL2RenderingContext) {
    super(_gl);
    this.drawPrimitiveType = GLPrimitiveType.TRIANGLES;
  }

  override draw(): void {
    if (!this.mesh || !this.shader?._shaderProgram) {
      return;
    }
    this.shader.use();

    if (this.shader instanceof LitShader) {
      this.shader.setInt(ShaderUniformsEnum.U_USE_SHADOWS, 0);
      if (this.shadowMapTexture && this.shadowMapTexture.glTexture) {
        const lightEntity = this.parent.scene.lights.find(
          (obj) =>
            obj.entityType === EntityType.LIGHT_DIRECTIONAL &&
            obj.active &&
            obj.show,
        );
        this.shader.setTexture(
          ShaderUniformsEnum.U_SHADOW_MAP,
          this.shadowMapTexture,
          2,
        );
        this.shader.setVec2(ShaderUniformsEnum.U_SHADOW_MAP_SIZE, [
          this.shadowMapTexture.width,
          this.shadowMapTexture.height,
        ]);
        this.shadowMapTexture.bind();

        if (lightEntity) {
          let { lightMvpMatrix } = this.createLightMatrices(
            Camera.mainCamera.transform,
            lightEntity as Light,
          );
          mat4.multiply(
            this._mvpScratch,
            lightMvpMatrix,
            this.transform.modelMatrix,
          );
          this.shader.setMat4(
            ShaderUniformsEnum.U_LIGHT_MVP_MATRIX,
            this._mvpScratch,
          );
          this.receiveShadows &&
            this.shader.setInt(ShaderUniformsEnum.U_USE_SHADOWS, 1);
        }
      }

      this.setShaderVariables();
    }

    const viewMatrix = Camera.mainCamera.viewMatrix;
    this.shader.setMat4(ShaderUniformsEnum.U_VIEW_MATRIX, viewMatrix);

    this.shader.setInt(
      ShaderUniformsEnum.U_FOG_ENABLED,
      this.fog.enabled ? 1 : 0,
    );
    if (this.fog.enabled) {
      this.shader.setVec3(
        ShaderUniformsEnum.U_FOG_COLOR,
        this.fog.color.toVec3(),
      );
      this.shader.setFloat(ShaderUniformsEnum.U_FOG_DENSITY, this.fog.density);
      this.shader.setFloat(
        ShaderUniformsEnum.U_FOG_DISTANCE,
        this.fog.distance,
      );
      this.shader.setInt(ShaderUniformsEnum.U_FOG_TYPE, this.fog.fogType);
      this.shader.setFloat(
        ShaderUniformsEnum.U_FOG_HEIGHT_FALLOFF,
        this.fog.heightFalloff,
      );
      this.shader.setFloat(
        ShaderUniformsEnum.U_FOG_BASE_HEIGHT,
        this.fog.baseHeight,
      );
    }

    super.setShaderVariables();
    super.draw();
    this.shadowMapTexture?.unBind();
  }

  protected override initializeShader(): void {
    super.initializeShader();
    if (!this.shader) return;
    this.shader.buffers.normal = this._gl.createBuffer();
    this.shader.buffers.tangent = this._gl.createBuffer();
    this.shader.buffers.bitangent = this._gl.createBuffer();
    this.shader.initBuffers(this._gl, this.mesh.meshData);
  }

  protected override setShaderVariables(): void {
    this.shader!.setFloat(
      ShaderUniformsEnum.U_SHADOW_STRENGTH,
      this.parent.scene.shadowmap.shadowstrength.value,
    );
    this.setNormalMapsInformation();
  }

  protected getNormalMapLocations(): void {
    if (this.shader?._shaderProgram) {
      this._normalMapUniformLocation = this._gl.getUniformLocation(
        this.shader._shaderProgram,
        ShaderUniformsEnum.U_NORMAL_TEX,
      );
      this._specularMapUniformLocation = this._gl.getUniformLocation(
        this.shader._shaderProgram,
        'u_specularMap',
      );
      this._roughnessMapUniformLocation = this._gl.getUniformLocation(
        this.shader._shaderProgram,
        'u_roughnessMap',
      );
      this._aoMapUniformLocation = this._gl.getUniformLocation(
        this.shader._shaderProgram,
        'u_aoMap',
      );
      this._emissiveMapUniformLocation = this._gl.getUniformLocation(
        this.shader._shaderProgram,
        'u_emissiveMap',
      );

      this._worldMatrixUniformLocation = this._gl.getUniformLocation(
        this.shader._shaderProgram,
        ShaderUniformsEnum.U_WORLD_MATRIX,
      );
      this._worldInverseTransposeMatrixUniformLocation =
        this._gl.getUniformLocation(
          this.shader._shaderProgram,
          ShaderUniformsEnum.U_WORLD_INVERSE_TRANSPOSE_MATRIX,
        );
      this._tangentAttributeLocation = this._gl.getAttribLocation(
        this.shader._shaderProgram,
        ShaderUniformsEnum.A_TANGENT,
      );
      this._bitangentAttributeLocation = this._gl.getAttribLocation(
        this.shader._shaderProgram,
        ShaderUniformsEnum.A_BITANGENT,
      );
    }
  }

  // Generates and caches the exact mathematical 1x1 pixels needed for missing maps
  protected getDefaultTexture(
    type: 'white' | 'black' | 'normal',
  ): WebGLTexture {
    if (this._defaultTextures[type]) return this._defaultTextures[type];

    const tex = this._gl.createTexture()!;
    this._gl.bindTexture(this._gl.TEXTURE_2D, tex);

    let pixel: Uint8Array;
    if (type === 'white') pixel = new Uint8Array([255, 255, 255, 255]);
    else if (type === 'black') pixel = new Uint8Array([0, 0, 0, 255]);
    else pixel = new Uint8Array([128, 128, 255, 255]); // Flat Normal Blue

    this._gl.texImage2D(
      this._gl.TEXTURE_2D,
      0,
      this._gl.RGBA,
      1,
      1,
      0,
      this._gl.RGBA,
      this._gl.UNSIGNED_BYTE,
      pixel,
    );

    // Essential filtering so 1x1 textures work correctly without mipmaps
    this._gl.texParameteri(
      this._gl.TEXTURE_2D,
      this._gl.TEXTURE_MIN_FILTER,
      this._gl.NEAREST,
    );
    this._gl.texParameteri(
      this._gl.TEXTURE_2D,
      this._gl.TEXTURE_MAG_FILTER,
      this._gl.NEAREST,
    );

    this._defaultTextures[type] = tex;
    return tex;
  }

  protected bindMap(
    mapData: any,
    location: WebGLUniformLocation | null,
    unit: number,
    fallbackType: 'white' | 'black' | 'normal',
  ) {
    if (!location) return;

    let glTex;
    if (mapData && mapData.glTexture) {
      glTex = mapData.glTexture;
    } else {
      glTex = this.getDefaultTexture(fallbackType);
    }

    this._gl.activeTexture(this._gl.TEXTURE0 + unit);
    this._gl.bindTexture(this._gl.TEXTURE_2D, glTex);
    this._gl.uniform1i(location, unit);
  }

  protected setNormalMapsInformation(): void {
    if (!this.shader) return;
    this.getNormalMapLocations();

    const material = this.shader.material as LitMaterial;

    // Explicitly define the correct fallback color for each map type
    this.bindMap(
      material.normalTex,
      this._normalMapUniformLocation,
      1,
      'normal',
    );
    this.bindMap(
      material.specularTex,
      this._specularMapUniformLocation,
      3,
      'white',
    );
    this.bindMap(
      material.roughnessTex,
      this._roughnessMapUniformLocation,
      4,
      'white',
    );
    this.bindMap(material.aoTex, this._aoMapUniformLocation, 5, 'white');
    this.bindMap(
      material.emissiveTex,
      this._emissiveMapUniformLocation,
      6,
      'black',
    );
  }
}
