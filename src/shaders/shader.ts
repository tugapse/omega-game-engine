import { mat4, mat3, vec4, vec3, vec2 } from 'gl-matrix';
import { EngineCache } from '../core/engineCache';
import { MeshData } from '../core/mesh';
import { ShaderUniformsEnum } from '../enums/shader-uniforms.enum';
import { JsonSerializable } from '../core/json-serializable';
import { JsonSerializedData } from '../interfaces/json-serialized-data';
import { ColorMaterial } from '../materials/color-material';
import { Texture } from '../textures/texture';
import { v4 as uuidv4 } from 'uuid';
import { ObjectInstanciator } from '../core';
import { ShaderSources } from './shader-sources';

/**
 * An interface defining the structure for WebGL buffers associated with a mesh's geometry.
 */
export interface WebGLBuffers {
  /** Buffer for vertex positions. */
  position: WebGLBuffer | null;
  /** Buffer for vertex normals. */
  normal: WebGLBuffer | null;
  /** Buffer for vertex UV coordinates. */
  uv: WebGLBuffer | null;
  /** Buffer for vertex tangents, used in normal mapping. */
  tangent: WebGLBuffer | null;
  /** Buffer for vertex bitangents, used in normal mapping. */
  bitangent: WebGLBuffer | null;
  /** Buffer for vertex indices for indexed drawing. */
  indices: WebGLBuffer | null;
}

/**
 * The base class for all shaders. It manages the asynchronous loading, compilation, and linking
 * of GLSL source code into a `WebGLProgram`. It also handles the creation of vertex buffers
 * and provides helper methods for setting uniforms.
 *
 * @augments {JsonSerializable}
 */
export class Shader extends JsonSerializable {
  protected override _className = 'Shader';

  /**
   * A static map of include directives to their corresponding GLSL file URLs.
   * This allows for modular and reusable shader code.
   *
   * @example
   * // In a fragment shader:
   * // #version 300 es
   * // @INCLUDE_FOG_FUNC
   * // ...
   *
   * @type {{ [key: string]: string }}
   */
  public static SHADER_FUNCTIONS: { [key: string]: string } = {
      '@INCLUDE_FOG_FUNC': ShaderSources.frag.fog,
      '@INCLUDE_LIGHT_FUNC': ShaderSources.frag.light,
      '@INCLUDE_UTIL_FUNC': ShaderSources.frag.functions,
  };

  /**
   * Pre-fetches all registered shader function files to populate the engine's cache.
   * This can reduce latency when shaders are compiled for the first time.
   */
  public static preFetchFunctionsGlsl(): void {
    for (const a of Object.values(Shader.SHADER_FUNCTIONS)) {
      EngineCache.loadShaderSource(a);
    }
  }

  /**
   * A static factory method to create an instance of the shader.
   * @param gl - The WebGL2 rendering context.
   * @param material - The material associated with this shader.
   */
  public static instanciate(
    gl: WebGL2RenderingContext,
    material: ColorMaterial,
  ): Shader {
    return new Shader(gl, material);
  }

  /**
   * Gets the underlying compiled `WebGLProgram`.
   * @readonly
   */
  public get shaderProgram(): WebGLProgram {
    return this._shaderProgram;
  }
  public _shaderProgram!: WebGLProgram;

  /**
   * Gets a flag indicating if the shader has been successfully compiled and linked.
   * @readonly
   */
  public get initialized() {
    return this._initialized;
  }
  private _initialized: boolean = false;

  /**
   * Gets the WebGL buffers associated with the mesh geometry for this shader.
   * @readonly
   */
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

  /** The raw source code of the fragment shader, loaded asynchronously. */
  public fragmentSource: string | null = null;
  /** The raw source code of the vertex shader, loaded asynchronously. */
  public vertexSource: string | null = null;

  /**
   * Creates an instance of Shader.
   * @param gl - The WebGL2 rendering context.
   * @param material - The material that holds the properties for this shader.
   * @param fragUri - The URI for the fragment shader source file.
   * @param vertexUri - The URI for the vertex shader source file.
   */
  constructor(
    protected gl: WebGL2RenderingContext,
    public material: ColorMaterial,
    public fragUri: string = ShaderSources.frag.color,
    public vertexUri: string = ShaderSources.vertex.default,
  ) {
    super('Shader');
    this._uuid = uuidv4();
  }

  /**
   * Asynchronously loads, preprocesses (handles includes), compiles, and links the shader program.
   * This method must be called and awaited before the shader can be used.
   * @returns A promise that resolves to `true` if initialization is successful, `false` otherwise.
   */
  public async initialize(): Promise<boolean> {
    if (this._initialized) {
      return true;
    }
    const keys: string[] = Object.keys(Shader.SHADER_FUNCTIONS);

    let vsSource = await EngineCache.loadShaderSource(this.vertexUri);
    let fsSource = await EngineCache.loadShaderSource(this.fragUri);

    if (vsSource.trim().startsWith('<')) {
      console.warn(`[Shader Warning] Vertex source from ${this.vertexUri} starts with '<'. It may be HTML.`);
    }
    if (fsSource.trim().startsWith('<')) {
      console.warn(`[Shader Warning] Fragment source from ${this.fragUri} starts with '<'. It may be HTML.`);
    }

    for (const obkey of keys) {
      if (fsSource.includes(obkey)) {
        const url: string = Shader.SHADER_FUNCTIONS[obkey] as string;
        const text = await EngineCache.loadShaderSource(url);
        fsSource = fsSource.replace(obkey, text);
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
    this._initialized = true;
    return true;
  }

  /**
   * Creates and populates WebGL buffers for the given mesh data.
   * This includes vertex positions, normals, UVs, tangents, bitangents, and indices.
   * @param gl - The WebGL2 rendering context.
   * @param mesh - The `MeshData` object containing the geometry.
   */
  public initBuffers(gl: WebGL2RenderingContext, mesh: MeshData): void {
    mesh.calculateNormals();
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

    buffers.indices = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(mesh.indices),
      gl.STATIC_DRAW,
    );

    this._buffers = buffers;
  }

  /**
   * Binds all the vertex attribute buffers (position, normal, uv, etc.) and the index buffer
   * to prepare for a draw call.
   */
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

    if (this._buffers.indices) {
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this._buffers.indices);
    }
  }

  /**
   * Activates this shader program for rendering (`gl.useProgram`).
   */
  public use(): void {
    if (!this._shaderProgram || !this._initialized) {
      return;
    }
    this.gl.useProgram(this._shaderProgram);
  }

  /**
   * A placeholder method for any cleanup needed after a draw call.
   * Subclasses can override this to unbind textures, for example.
   */
  public release(): void {}

  /**
   * Loads data from the associated `material` into the shader's uniforms.
   * Subclasses should override this to handle their specific material properties.
   */
  public loadDataIntoShader(): void {
    if (!this.material) return;
    this.use();
    const material = this.material as ColorMaterial;
    if (material)
      this.setVec4(ShaderUniformsEnum.U_MAT_COLOR, material.color.toVec4());
  }

  /**
   * Sets a `mat4` uniform value in the shader.
   * @param name - The name of the uniform.
   * @param value - The matrix to set.
   */
  public setMat4(name: string, value: mat4): void {
    const location = this.gl.getUniformLocation(this._shaderProgram, name);
    if (location) {
      this.use();
      this.gl.uniformMatrix4fv(location, false, Float32Array.from(value));
    }
  }

  /**
   * Sets a `mat3` uniform value in the shader.
   * @param name - The name of the uniform.
   * @param value - The matrix to set.
   */
  public setMat3(name: string, value: mat3): void {
    const location = this.gl.getUniformLocation(this._shaderProgram, name);
    if (location) {
      this.gl.uniformMatrix3fv(location, false, Float32Array.from(value));
    }
  }

  /**
   * Sets a `vec4` uniform value in the shader.
   * @param name - The name of the uniform.
   * @param vec - The vector to set.
   */
  public setVec4(name: string, vec: vec4): void {
    const location = this.gl.getUniformLocation(this._shaderProgram, name);
    if (location) {
      this.gl.uniform4fv(location, Float32Array.from(vec));
    }
  }

  /**
   * Sets a `vec3` uniform value in the shader.
   * @param name - The name of the uniform.
   * @param vec - The vector to set.
   */
  public setVec3(name: string, vec: vec3): void {
    const location = this.gl.getUniformLocation(this._shaderProgram, name);
    if (location) {
      this.gl.uniform3fv(location, Float32Array.from(vec));
    }
  }

  /**
   * Sets a `vec2` uniform value in the shader.
   * @param name - The name of the uniform.
   * @param vec - The vector to set.
   */
  public setVec2(name: string, vec: vec2): void {
    const location = this.gl.getUniformLocation(this._shaderProgram, name);
    if (location) {
      this.gl.uniform2fv(location, Float32Array.from(vec));
    }
  }

  /**
   * Sets a `float` uniform value in the shader.
   * @param name - The name of the uniform.
   * @param num - The number to set.
   */
  public setFloat(name: string, num: number): void {
    const location = this.gl.getUniformLocation(this._shaderProgram, name);
    if (location) {
      this.gl.uniform1f(location, num);
    }
  }

  /**
   * Sets an `int` uniform value in the shader.
   * @param name - The name of the uniform.
   * @param num - The integer to set.
   */
  setInt(name: string, num: number) {
    this.use();
    const location = this.gl.getUniformLocation(this._shaderProgram, name);
    if (location) {
      this.gl.uniform1i(location, num);
    }
  }

  /**
   * Binds a 2D texture to a sampler uniform in the shader.
   * @param name - The name of the `sampler2D` uniform.
   * @param texture - The `Texture` object to bind.
   * @param textureIndex - The texture unit to use (e.g., 0 for TEXTURE0).
   */
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

  /**
   * Populates a `WebGLBuffer` with vertex data.
   * @param buffer - The buffer to populate.
   * @param values - An array of `vec3` data.
   */
  public setBuffer(buffer: WebGLBuffer, values: vec3[]): void {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(values.flat() as number[]),
      this.gl.STATIC_DRAW,
    );
  }

  /**
   * Populates the index buffer with new index data.
   * @param values - An array of indices.
   */
  public setIndices(values: number[]): void {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this._buffers.indices);
    const indicesArray = new Uint16Array(values);
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      indicesArray,
      this.gl.STATIC_DRAW,
    );
  }
  
  /**
   * Compiles a single shader (vertex or fragment).
   * @param gl - The WebGL2 rendering context.
   * @param type - The type of shader (`gl.VERTEX_SHADER` or `gl.FRAGMENT_SHADER`).
   * @param source - The GLSL source code.
   * @param uri - The source URI, for logging purposes.
   * @private
   */
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

  /**
   * Links a vertex and fragment shader into a `WebGLProgram`.
   * @param gl - The WebGL2 rendering context.
   * @param vertexShader - The compiled vertex shader.
   * @param fragmentShader - The compiled fragment shader.
   * @private
   */
  private createProgram(
    gl: WebGL2RenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader,
  ): WebGLProgram | null {
    const shaderProgram = gl.createProgram();
    if (!shaderProgram) {
      return null;
    }

    if(this._shaderProgram)
      this.gl.deleteProgram(this._shaderProgram);

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

    const blockIndex = gl.getUniformBlockIndex(shaderProgram, 'CameraBlock');

    if (blockIndex !== gl.INVALID_INDEX) {
      gl.uniformBlockBinding(shaderProgram, blockIndex, 0);
    }

    return shaderProgram;
  }

  /**
   * Forces the shader to re-initialize, recompiling from its source URIs.
   */
  public recompile(): void {
    this._initialized = false;
    this.initialize();
  }

  /**
   * Deletes all WebGL resources associated with this shader (program and buffers).
   */
  public destroy(): void {
    if (this._buffers.position) this.gl.deleteBuffer(this._buffers.position);
    if (this._buffers.normal) this.gl.deleteBuffer(this._buffers.normal);
    if (this._buffers.uv) this.gl.deleteBuffer(this._buffers.uv);
    if (this._buffers.tangent) this.gl.deleteBuffer(this._buffers.tangent);
    if (this._buffers.bitangent) this.gl.deleteBuffer(this._buffers.bitangent);
    if (this._buffers.indices) this.gl.deleteBuffer(this._buffers.indices);
    if (this._shaderProgram) this.gl.deleteProgram(this._shaderProgram);
    this._initialized = false;
  }

  /**
   * Serializes the shader's state to a JSON object.
   * @override
   * @returns The serialized JSON data.
   */
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

  /**
   * Deserializes the shader's state from a JSON object.
   * @override
   * @param jsonObject - The JSON data to deserialize from.
   */
  public override fromJson(jsonObject: JsonSerializedData): void {
    super.fromJson(jsonObject);
    this.deserializeAutomatically(jsonObject);
  }
}