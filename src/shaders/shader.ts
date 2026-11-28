import { Resources } from '../core/resources/resources';
import { mat4, mat3, vec4, vec3, vec2 } from 'gl-matrix';
import { MeshData } from '../core/mesh';
import { ShaderUniformsEnum } from '../enums/shader-uniforms.enum';
import { JsonSerializable } from '../core/json-serializable';
import { JsonSerializedData } from '../interfaces/json-serialized-data';
import { ColorMaterial } from '../materials/color-material';
import { Texture } from '../textures/texture';
import { v4 as uuidv4 } from 'uuid';
import { ObjectInstanciator } from '../core';
import { ShaderSources } from './shader-sources';
import { SkinnedMeshData } from '../core/model/model-data';

/**
  An interface defining the structure for WebGL buffers associated with a mesh.
 */
export interface WebGLBuffers {
  position: WebGLBuffer | null;
  normal: WebGLBuffer | null;
  uv: WebGLBuffer | null;
  tangent: WebGLBuffer | null;
  bitangent: WebGLBuffer | null;
  indices: WebGLBuffer | null;
  /** Skinned meshes: 4 joint indices per vertex (UNSIGNED_SHORT). */
  joints?: WebGLBuffer | null;
  /** Skinned meshes: 4 joint weights per vertex. */
  weights?: WebGLBuffer | null;
}

/**
  A class that manages the creation, compilation, and usage of WebGL shader programs, including handling vertex attributes and uniforms.
 * @augments {JsonSerializable}
 */
export class Shader extends JsonSerializable {
  protected override _className = 'Shader';

  /**
    A map of string keys to URLs for reusable shader function files.
   * @type {{ [key: string]: string }}
   */
  public static SHADER_FUNCTIONS: { [key: string]: string } = {
      '@INCLUDE_FOG_FUNC': ShaderSources.frag.fog,
      '@INCLUDE_LIGHT_FUNC': ShaderSources.frag.light,
      '@INCLUDE_UTIL_FUNC': ShaderSources.frag.functions,
  };

  public static preFetchFunctionsGlsl(): void {
    for (const a of Object.values(Shader.SHADER_FUNCTIONS)) {
      Resources.for().getShader(a);
    }
  }

  public static instanciate(
    gl: WebGL2RenderingContext,
    material: ColorMaterial,
  ): Shader {
    return new Shader(gl, material);
  }

  public get shaderProgram(): WebGLProgram {
    return this._shaderProgram;
  }
  public _shaderProgram!: WebGLProgram;

  public get initialized() {
    return this._initialized;
  }
  protected _initialized: boolean = false;

  public get buffers(): WebGLBuffers {
    return this._buffers;
  }
  protected _buffers: WebGLBuffers = {
    position: null,
    normal: null,
    uv: null,
    tangent: null,
    bitangent: null,
    indices: null,
  };

  public fragmentSource: string | null = null;
  public vertexSource: string | null = null;

  /**
   * Preprocessor defines compiled into both stages (e.g. `SKINNED`), added
   * right after `#version`. Set them before `initialize()`.
   */
  public defines: string[] = [];

  /**
   * Shares the linked program with every other shader that has the same
   * sources and defines on the same context (set before `initialize()`): for
   * many renderers of one kind, such as grass tiles. A shared program is never
   * deleted. Uniforms are per program, so every draw must set the ones it uses.
   */
  public shareProgram = false;
  private static readonly sharedPrograms = new WeakMap<WebGL2RenderingContext, Map<string, WebGLProgram>>();
  private usesSharedProgram = false;

  /** Type of the index buffer: UNSIGNED_INT for meshes over 65 535 vertices. */
  public indexType: number = 0x1403; // UNSIGNED_SHORT

  constructor(
    protected gl: WebGL2RenderingContext,
    public material: ColorMaterial,
    public fragUri: string = ShaderSources.frag.color,
    public vertexUri: string = ShaderSources.vertex.default,
  ) {
    super('Shader');
    this._uuid = uuidv4();
  }

  public async initialize(): Promise<boolean> {
    if (this._initialized) {
      return true;
    }
    const keys: string[] = Object.keys(Shader.SHADER_FUNCTIONS);

    let vsSource = await Resources.for().getShader(this.vertexUri);
    let fsSource = await Resources.for().getShader(this.fragUri);

    if (vsSource.trim().startsWith('<')) {
      console.warn(`[Shader Warning] Vertex source from ${this.vertexUri} starts with '<'. It may be HTML.`);
    }
    if (fsSource.trim().startsWith('<')) {
      console.warn(`[Shader Warning] Fragment source from ${this.fragUri} starts with '<'. It may be HTML.`);
    }

    for (const obkey of keys) {
      if (fsSource.includes(obkey)) {
        const url: string = Shader.SHADER_FUNCTIONS[obkey] as string;
        const text = await Resources.for().getShader(url);
        fsSource = fsSource.replace(obkey, text);
      }
    }
    
    vsSource = Shader.withDefines(vsSource, this.defines);
    fsSource = Shader.withDefines(fsSource, this.defines);

    const shareKey = this.shareProgram ? `${vsSource}\u0000${fsSource}` : '';
    if (this.shareProgram) {
      const shared = Shader.sharedPrograms.get(this.gl)?.get(shareKey);
      if (shared) {
        this._shaderProgram = shared;
        this.usesSharedProgram = true;
        this._initialized = true;
        return true;
      }
    }

    const vertexShader = this.compileShader(
      this.gl,
      this.gl.VERTEX_SHADER,
      vsSource,
      this.vertexUri
    );
    const fragmentShader = this.compileShader(
      this.gl,
      this.gl.FRAGMENT_SHADER,
      fsSource,
      this.fragUri
    );

    if (!vertexShader || !fragmentShader) {
      return false;
    }
    this._shaderProgram = this.createProgram(
      this.gl,
      vertexShader,
      fragmentShader,
    ) as WebGLProgram;
    if (this.shareProgram && this._shaderProgram) {
      let programs = Shader.sharedPrograms.get(this.gl);
      if (!programs) Shader.sharedPrograms.set(this.gl, (programs = new Map()));
      programs.set(shareKey, this._shaderProgram);
      this.usesSharedProgram = true;
    }
    this._initialized = true;
    return true;
  }

  /** Inserts `#define` lines after the `#version` line of a GLSL source. */
  public static withDefines(source: string, defines: string[]): string {
    if (!defines.length) return source;
    const lines = defines.map((d) => `#define ${d}`).join('\n') + '\n';
    const version = /^\s*#version[^\n]*\n/.exec(source);
    return version ? source.slice(0, version[0].length) + lines + source.slice(version[0].length) : lines + source;
  }

  public initBuffers(gl: WebGL2RenderingContext, mesh: MeshData): void {
    if (!mesh.providedNormals || mesh.normals.length !== mesh.vertices.length) mesh.calculateNormals();
    mesh.calculateTangentsAndBitangents();
    const buffers: WebGLBuffers = {
      position: null,
      normal: null,
      uv: null,
      tangent: null,
      bitangent: null,
      indices: null,
    };

    buffers.position = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    const positions: number[] = [];
    for (const v of mesh.vertices) {
      positions.push(v[0], v[1], v[2]);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    buffers.normal = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
    const normals: number[] = [];
    for (const n of mesh.normals) {
      normals.push(n[0], n[1], n[2]);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

    buffers.uv = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.uv);
    const uvs: number[] = [];
    for (const uv of mesh.uvs) {
      uvs.push(uv[0], uv[1]);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);

    if (mesh.tangents && mesh.tangents.length > 0) {
      buffers.tangent = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.tangent);
      const tangents: number[] = [];
      for (const t of mesh.tangents) {
        tangents.push(t[0], t[1], t[2]);
      }
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(tangents),
        gl.STATIC_DRAW,
      );
    }

    if (mesh.bitangents && mesh.bitangents.length > 0) {
      buffers.bitangent = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.bitangent);
      const bitangents: number[] = [];
      for (const b of mesh.bitangents) {
        bitangents.push(b[0], b[1], b[2]);
      }
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(bitangents),
        gl.STATIC_DRAW,
      );
    }

    if (mesh instanceof SkinnedMeshData && mesh.joints.length) {
      buffers.joints = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.joints);
      gl.bufferData(gl.ARRAY_BUFFER, mesh.joints, gl.STATIC_DRAW);
      buffers.weights = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.weights);
      gl.bufferData(gl.ARRAY_BUFFER, mesh.weights, gl.STATIC_DRAW);
    }

    // 16-bit indices address 65 536 vertices; bigger meshes need 32-bit ones.
    const wide = mesh.vertices.length > 0xffff;
    this.indexType = wide ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
    buffers.indices = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      wide ? new Uint32Array(mesh.indices) : new Uint16Array(mesh.indices),
      gl.STATIC_DRAW,
    );

    this._buffers = buffers;
  }

  public bindBuffers(): void {
    if (!this.gl || !this._shaderProgram) return;

    const positionAttributeLocation = this.gl.getAttribLocation(
      this._shaderProgram,
      ShaderUniformsEnum.A_POSITION,
    );
    if (this._buffers.position && positionAttributeLocation !== -1) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._buffers.position);
      this.gl.vertexAttribPointer(
        positionAttributeLocation,
        3,
        this.gl.FLOAT,
        false,
        0,
        0,
      );
      this.gl.enableVertexAttribArray(positionAttributeLocation);
    } else if (positionAttributeLocation !== -1) {
      this.gl.disableVertexAttribArray(positionAttributeLocation);
    }

    const normalAttributeLocation = this.gl.getAttribLocation(
      this._shaderProgram,
      ShaderUniformsEnum.A_NORMAL,
    );
    if (this._buffers.normal && normalAttributeLocation !== -1) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._buffers.normal);
      this.gl.vertexAttribPointer(
        normalAttributeLocation,
        3,
        this.gl.FLOAT,
        false,
        0,
        0,
      );
      this.gl.enableVertexAttribArray(normalAttributeLocation);
    } else if (normalAttributeLocation !== -1) {
      this.gl.disableVertexAttribArray(normalAttributeLocation);
    }

    const uvAttributeLocation = this.gl.getAttribLocation(
      this._shaderProgram,
      ShaderUniformsEnum.A_UV,
    );
    if (this._buffers.uv && uvAttributeLocation !== -1) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._buffers.uv);
      this.gl.vertexAttribPointer(
        uvAttributeLocation,
        2,
        this.gl.FLOAT,
        false,
        0,
        0,
      );
      this.gl.enableVertexAttribArray(uvAttributeLocation);
    } else if (uvAttributeLocation !== -1) {
      this.gl.disableVertexAttribArray(uvAttributeLocation);
    }

    const tangentAttributeLocation = this.gl.getAttribLocation(
      this._shaderProgram,
      ShaderUniformsEnum.A_TANGENT,
    );
    if (this._buffers.tangent && tangentAttributeLocation !== -1) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._buffers.tangent);
      this.gl.vertexAttribPointer(
        tangentAttributeLocation,
        3,
        this.gl.FLOAT,
        false,
        0,
        0,
      );
      this.gl.enableVertexAttribArray(tangentAttributeLocation);
    } else if (tangentAttributeLocation !== -1) {
      this.gl.disableVertexAttribArray(tangentAttributeLocation);
    }

    const bitangentAttributeLocation = this.gl.getAttribLocation(
      this._shaderProgram,
      ShaderUniformsEnum.A_BITANGENT,
    );
    if (this._buffers.bitangent && bitangentAttributeLocation !== -1) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._buffers.bitangent);
      this.gl.vertexAttribPointer(
        bitangentAttributeLocation,
        3,
        this.gl.FLOAT,
        false,
        0,
        0,
      );
      this.gl.enableVertexAttribArray(bitangentAttributeLocation);
    } else if (bitangentAttributeLocation !== -1) {
      this.gl.disableVertexAttribArray(bitangentAttributeLocation);
    }

    this.bindSkinAttributes(this._shaderProgram);

    if (this._buffers.indices) {
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this._buffers.indices);
    }
  }

  /** Points `a_joints` / `a_weights` of `program` at this mesh's skin buffers. */
  public bindSkinAttributes(program: WebGLProgram): void {
    const gl = this.gl;
    const joints = gl.getAttribLocation(program, ShaderUniformsEnum.A_JOINTS);
    const weights = gl.getAttribLocation(program, ShaderUniformsEnum.A_WEIGHTS);
    if (joints !== -1) {
      if (this._buffers.joints) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers.joints);
        gl.vertexAttribIPointer(joints, 4, gl.UNSIGNED_SHORT, 0, 0);
        gl.enableVertexAttribArray(joints);
      } else gl.disableVertexAttribArray(joints);
    }
    if (weights !== -1) {
      if (this._buffers.weights) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers.weights);
        gl.vertexAttribPointer(weights, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(weights);
      } else gl.disableVertexAttribArray(weights);
    }
  }

  public use(): void {
    if (!this._shaderProgram || !this._initialized) {
      return;
    }
    this.gl.useProgram(this._shaderProgram);
  }

  public release(): void {}

  public loadDataIntoShader(): void {
    if (!this.material) return;
    this.use();
    const material = this.material as ColorMaterial;
    if (material)
      this.setVec4(ShaderUniformsEnum.U_MAT_COLOR, material.color.toVec4());
  }

  public setMat4(name: string, value: mat4): void {
    const location = this.gl.getUniformLocation(this._shaderProgram, name);
    if (location) {
      this.use();
      this.gl.uniformMatrix4fv(location, false, Float32Array.from(value));
    }
  }

  public setMat3(name: string, value: mat3): void {
    const location = this.gl.getUniformLocation(this._shaderProgram, name);
    if (location) {
      this.gl.uniformMatrix3fv(location, false, Float32Array.from(value));
    }
  }

  public setVec4(name: string, vec: vec4): void {
    const location = this.gl.getUniformLocation(this._shaderProgram, name);
    if (location) {
      this.gl.uniform4fv(location, Float32Array.from(vec));
    }
  }

  public setVec3(name: string, vec: vec3): void {
    const location = this.gl.getUniformLocation(this._shaderProgram, name);
    if (location) {
      this.gl.uniform3fv(location, Float32Array.from(vec));
    }
  }

  public setVec2(name: string, vec: vec2): void {
    const location = this.gl.getUniformLocation(this._shaderProgram, name);
    if (location) {
      this.gl.uniform2fv(location, Float32Array.from(vec));
    }
  }

  public setFloat(name: string, num: number): void {
    const location = this.gl.getUniformLocation(this._shaderProgram, name);
    if (location) {
      this.gl.uniform1f(location, num);
    }
  }

  setInt(name: string, num: number) {
    this.use();
    const location = this.gl.getUniformLocation(this._shaderProgram, name);
    if (location) {
      this.gl.uniform1i(location, num);
    }
  }

  public setTexture(
    name: string,
    texture: Texture,
    textureIndex: number,
  ): void {
    this.use();
    const location = this.gl.getUniformLocation(this._shaderProgram, name);
    if (location) {
      this.gl.activeTexture(this.gl.TEXTURE0 + textureIndex);
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture.glTexture);
      this.gl.uniform1i(location, textureIndex);
    }
  }

  public setBuffer(buffer: WebGLBuffer, values: vec3[]): void {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(values.flat() as number[]),
      this.gl.STATIC_DRAW,
    );
  }

  public setIndices(values: number[]): void {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this._buffers.indices);
    const indicesArray = new Uint16Array(values);
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      indicesArray,
      this.gl.STATIC_DRAW,
    );
  }
  
  private compileShader(
    gl: WebGL2RenderingContext,
    type: number,
    source: string,
    uri: string
  ): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) {
      return null;
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const shaderType = type === gl.VERTEX_SHADER ? 'Vertex' : 'Fragment';
      const infoLog = gl.getShaderInfoLog(shader);
      
      const sourceLines = source.split('\n');
      const sourcePreview = sourceLines.slice(0, 15).join('\n') + (sourceLines.length > 15 ? '\n...' : '');

      console.error(`[Shader Compilation Error] ${shaderType} Shader failed: ${uri}`);
      console.error(`Info Log:\n${infoLog}`);
      console.error(`Source Preview:\n${sourcePreview}`);

      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  private createProgram(
    gl: WebGL2RenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader,
  ): WebGLProgram | null {
    const shaderProgram = gl.createProgram();
    if (!shaderProgram) {
      return null;
    }

    if (this._shaderProgram && !this.usesSharedProgram)
      this.gl.deleteProgram(this._shaderProgram);
    this.usesSharedProgram = false;

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.trace(
        'Unable to initialize the shader program:',
        gl.getProgramInfoLog(shaderProgram),
      );
      return null;
    }

    // Uniform blocks shared by every shader, filled once per frame by the pipeline.
    const blocks: [string, number][] = [['CameraBlock', 0], ['LightsBlock', 1], ['ShadowsBlock', 2]];
    for (const [name, binding] of blocks) {
      const blockIndex = gl.getUniformBlockIndex(shaderProgram, name);
      if (blockIndex !== gl.INVALID_INDEX) gl.uniformBlockBinding(shaderProgram, blockIndex, binding);
    }

    return shaderProgram;
  }

  public recompile(): void {
    this._initialized = false;
    this.initialize();
  }

  public destroy(): void {
    if (this._buffers.position) this.gl.deleteBuffer(this._buffers.position);
    if (this._buffers.normal) this.gl.deleteBuffer(this._buffers.normal);
    if (this._buffers.uv) this.gl.deleteBuffer(this._buffers.uv);
    if (this._buffers.tangent) this.gl.deleteBuffer(this._buffers.tangent);
    if (this._buffers.bitangent) this.gl.deleteBuffer(this._buffers.bitangent);
    if (this._buffers.indices) this.gl.deleteBuffer(this._buffers.indices);
    if (this._buffers.joints) this.gl.deleteBuffer(this._buffers.joints);
    if (this._buffers.weights) this.gl.deleteBuffer(this._buffers.weights);
    if (this._shaderProgram && !this.usesSharedProgram) this.gl.deleteProgram(this._shaderProgram);
    this._initialized = false;
  }

  public override toJsonObject(): JsonSerializedData {
    return {
      ...super.toJsonObject(),
      uuid: this.uuid,
      type: this.constructor.name,
      fragUri: this.fragUri,
      vertexUri: this.vertexUri,
      material: this.material?.toJsonObject(),
    };
  }

  public override fromJson(jsonObject: JsonSerializedData): void {
    super.fromJson(jsonObject);
    this.deserializeAutomatically(jsonObject);
  }
}