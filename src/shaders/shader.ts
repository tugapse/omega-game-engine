import { mat4, mat3, vec4, vec3, vec2 } from "gl-matrix";
import { EngineCache } from "../core/engineCache";
import { MeshData } from "../core/mesh";
import { ShaderUniformsEnum } from "../enums/shader-uniforms.enum";
import { JsonSerializable } from "../core/json-serializable";
import { JsonSerializedData } from "../interfaces/json-serialized-data.interface";
import { ColorMaterial } from "../materials/color-material";
import { Texture } from "../textures/texture";
import { v4 as uuidv4 } from 'uuid';
import { ObjectInstanciator } from "../core";

/**
  An interface defining the structure for WebGL buffers associated with a mesh.
 */
export interface WebGLBuffers {
  /**
    The buffer for vertex positions.
   * @type {WebGLBuffer | null}
   */
  position: WebGLBuffer | null;
  /**
    The buffer for vertex normals.
   * @type {WebGLBuffer | null}
   */
  normal: WebGLBuffer | null;
  /**
    The buffer for texture coordinates.
   * @type {WebGLBuffer | null}
   */
  uv: WebGLBuffer | null;
  /**
    The buffer for tangent vectors.
   * @type {WebGLBuffer | null}
   */
  tangent: WebGLBuffer | null;
  /**
    The buffer for bitangent vectors.
   * @type {WebGLBuffer | null}
   */
  bitangent: WebGLBuffer | null;
  /**
    The buffer for element indices.
   * @type {WebGLBuffer | null}
   */
  indices: WebGLBuffer | null;
}

/**
  A class that manages the creation, compilation, and usage of WebGL shader programs, including handling vertex attributes and uniforms.
 * @augments {JsonSerializable}
 */
export class Shader extends JsonSerializable {

  protected override _className = "Shader"

  /**
    A map of string keys to URLs for reusable shader function files.
    
   * @type {{ [key: string]: string }}
   */
  public static SHADER_FUNCTIONS: { [key: string]: string } = {
    "//@INCLUDE_LIGHT_FUNC": "assets/shaders/functions/light.frag",
    "//@INCLUDE_LIGHT_HEADER": "assets/shaders/functions/light-header.frag",
  };

  /**
    Pre-fetches the GLSL source code for all registered shader functions.
    
   * @returns {void}
   */
  public static preFetchFunctionsGlsl(): void {
    for (const a of Object.values(Shader.SHADER_FUNCTIONS)) {
      EngineCache.loadShaderSource(a);
    }
  }

  /**
    Creates a new Shader instance.
    
   * @param {WebGL2RenderingContext} gl - The WebGL2 rendering context.
   * @param {ColorMaterial} material - The material associated with this shader.
   * @returns {Shader} - A new Shader instance.
   */
  public static instanciate(gl: WebGL2RenderingContext, material: ColorMaterial): Shader {
    return new Shader(gl, material);
  }

  /**
    Gets the unique identifier of the shader.
   * @readonly
   * @type {string}
   */
  public get uuid(): string {
    return this._uuid;
  }

  public get shaderProgram(): WebGLProgram { return this._shaderProgram; }
  /**
    The compiled WebGL shader program.
   * @type {WebGLProgram}
   */
  public _shaderProgram!: WebGLProgram;
  /**
    A flag indicating if the shader has been initialized.
   * @private
   * @type {boolean}
   */
  private _initialized: boolean = false;
  /**
    The unique identifier for the shader.
   * @protected
   * @type {string}
   */
  protected _uuid: string;

  public get buffers(): WebGLBuffers { return this._buffers }
  /**
    The WebGL buffers for vertex data.
   * @type {WebGLBuffers}
   */
  protected _buffers: WebGLBuffers = {
    position: null,
    normal: null,
    uv: null,
    tangent: null,
    bitangent: null,
    indices: null,
  };

  /**
    Creates an instance of Shader.
   * @param {WebGL2RenderingContext} gl - The WebGL2 rendering context.
   * @param {ColorMaterial} material - The material associated with this shader.
   * @param {string} [fragUri="assets/shaders/frag/color.frag"] - The URI for the fragment shader source.
   * @param {string} [vertexUri="assets/shaders/vertex/vertex.vert"] - The URI for the vertex shader source.
   */
  constructor(
    protected gl: WebGL2RenderingContext,
    public material: ColorMaterial,
    public fragUri: string = "assets/shaders/frag/color.frag",
    public vertexUri: string = "assets/shaders/vertex/vertex.vert"
  ) {
    super("Shader");
    this._uuid = uuidv4();
  }

  /**
    Initializes the shader by compiling and linking the shader programs.
   * @returns {Promise<void>}
   */
  public async initialize(): Promise<void> {
    if (this._initialized) {
      return;
    }
    const keys: string[] = Object.keys(Shader.SHADER_FUNCTIONS);

    let vsSource = await EngineCache.loadShaderSource(this.vertexUri);
    let fsSource = await EngineCache.loadShaderSource(this.fragUri);

    for (const obkey of keys) {
      if (fsSource.includes(obkey)) {
        const url: string = Shader.SHADER_FUNCTIONS[obkey] as string;
        const text = await EngineCache.loadShaderSource(url);
        fsSource = fsSource.replace(obkey, text);
      }
    }

    const vertexShader = this.compileShader(this.gl, this.gl.VERTEX_SHADER, vsSource);
    const fragmentShader = this.compileShader(this.gl, this.gl.FRAGMENT_SHADER, fsSource);

    if (!vertexShader || !fragmentShader) {
      return;
    }
    this._shaderProgram = this.createProgram(this.gl, vertexShader, fragmentShader) as WebGLProgram;
    this._initialized = true;
  }

  /**
    Initializes the WebGL buffers with mesh data.
   * @param {WebGL2RenderingContext} gl - The WebGL2 rendering context.
   * @param {MeshData} mesh - The mesh data to use for the buffers.
   * @returns {void}
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
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tangents), gl.STATIC_DRAW);
    }

    if (mesh.bitangents && mesh.bitangents.length > 0) {
      buffers.bitangent = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.bitangent);
      const bitangents: number[] = [];
      for (const b of mesh.bitangents) {
        bitangents.push(b[0], b[1], b[2]);
      }
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bitangents), gl.STATIC_DRAW);
    }

    buffers.indices = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), gl.STATIC_DRAW);

    this._buffers = buffers;
  }

  /**
    Binds the vertex attribute buffers to the shader program's attributes.
   * @returns {void}
   */
  public bindBuffers(): void {
    if (!this.gl || !this._shaderProgram) return;

    const positionAttributeLocation = this.gl.getAttribLocation(this._shaderProgram, ShaderUniformsEnum.A_POSITION);
    if (this._buffers.position && positionAttributeLocation !== -1) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._buffers.position);
      this.gl.vertexAttribPointer(positionAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
      this.gl.enableVertexAttribArray(positionAttributeLocation);
    } else if (positionAttributeLocation !== -1) {
      this.gl.disableVertexAttribArray(positionAttributeLocation);
    }

    const normalAttributeLocation = this.gl.getAttribLocation(this._shaderProgram, ShaderUniformsEnum.A_NORMAL);
    if (this._buffers.normal && normalAttributeLocation !== -1) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._buffers.normal);
      this.gl.vertexAttribPointer(normalAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
      this.gl.enableVertexAttribArray(normalAttributeLocation);
    } else if (normalAttributeLocation !== -1) {
      this.gl.disableVertexAttribArray(normalAttributeLocation);
    }

    const uvAttributeLocation = this.gl.getAttribLocation(this._shaderProgram, 'a_uv');
    if (this._buffers.uv && uvAttributeLocation !== -1) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._buffers.uv);
      this.gl.vertexAttribPointer(uvAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);
      this.gl.enableVertexAttribArray(uvAttributeLocation);
    } else if (uvAttributeLocation !== -1) {
      this.gl.disableVertexAttribArray(uvAttributeLocation);
    }

    const tangentAttributeLocation = this.gl.getAttribLocation(this._shaderProgram, ShaderUniformsEnum.A_TANGENT);
    if (this._buffers.tangent && tangentAttributeLocation !== -1) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._buffers.tangent);
      this.gl.vertexAttribPointer(tangentAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
      this.gl.enableVertexAttribArray(tangentAttributeLocation);
    } else if (tangentAttributeLocation !== -1) {
      console.debug("Tangent attribute location not found");
      this.gl.disableVertexAttribArray(tangentAttributeLocation);
    }

    const bitangentAttributeLocation = this.gl.getAttribLocation(this._shaderProgram, ShaderUniformsEnum.A_BITANGENT);
    if (this._buffers.bitangent && bitangentAttributeLocation !== -1) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._buffers.bitangent);
      this.gl.vertexAttribPointer(bitangentAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
      this.gl.enableVertexAttribArray(bitangentAttributeLocation);
    } else if (bitangentAttributeLocation !== -1) {
      console.debug("Bitangent attribute location not found");
      this.gl.disableVertexAttribArray(bitangentAttributeLocation);
    }

    if (this._buffers.indices) {
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this._buffers.indices);
    }
  }

  /**
    Activates the shader program for rendering.
   * @returns {void}
   */
  public use(): void {
    if (!this._shaderProgram || !this._initialized) {
      return;
    }
    this.gl.useProgram(this._shaderProgram);
  }
   
  public release(): void { }


  /**
    Loads material data into the shader's uniforms.
   * @returns {void}
   */
  public loadDataIntoShader(): void {
    if (!this.material) return;
    const material = this.material as ColorMaterial;
    if (material)
      this.setVec4(ShaderUniformsEnum.U_MAT_COLOR, material.color.toVec4());
 
  }

  /**
    Sets a `mat4` uniform in the shader.
   * @param {string} name - The name of the uniform.
   * @param {mat4} value - The matrix value.
   * @returns {void}
   */
  public setMat4(name: string, value: mat4): void {
    const location = this.gl.getUniformLocation(this._shaderProgram, name);
    if (location) {
      this.gl.uniformMatrix4fv(location, false, Float32Array.from(value));
    }
  }

  /**
    Sets a `mat3` uniform in the shader.
   * @param {string} name - The name of the uniform.
   * @param {mat3} value - The matrix value.
   * @returns {void}
   */
  public setMat3(name: string, value: mat3): void {
    const location = this.gl.getUniformLocation(this._shaderProgram, name);
    if (location) {
      this.gl.uniformMatrix3fv(location, false, Float32Array.from(value));
    }
  }

  /**
    Sets a `vec4` uniform in the shader.
   * @param {string} name - The name of the uniform.
   * @param {vec4} vec - The vector value.
   * @returns {void}
   */
  public setVec4(name: string, vec: vec4): void {
    const location = this.gl.getUniformLocation(this._shaderProgram, name);
    if (location) {
      this.gl.uniform4fv(location, Float32Array.from(vec));
    }
  }

  /**
    Sets a `vec3` uniform in the shader.
   * @param {string} name - The name of the uniform.
   * @param {vec3} vec - The vector value.
   * @returns {void}
   */
  public setVec3(name: string, vec: vec3): void {
    const location = this.gl.getUniformLocation(this._shaderProgram, name);
    if (location) {
      this.gl.uniform3fv(location, Float32Array.from(vec));
    }
  }

  /**
    Sets a `vec2` uniform in the shader.
   * @param {string} name - The name of the uniform.
   * @param {vec2} vec - The vector value.
   * @returns {void}
   */
  public setVec2(name: string, vec: vec2): void {
    const location = this.gl.getUniformLocation(this._shaderProgram, name);
    if (location) {
      this.gl.uniform2fv(location, Float32Array.from(vec));
    }
  }

  /**
    Sets a float uniform in the shader.
   * @param {string} name - The name of the uniform.
   * @param {number} num - The float value.
   * @returns {void}
   */
  public setFloat(name: string, num: number): void {
    const location = this.gl.getUniformLocation(this._shaderProgram, name);
    if (location) {
      this.gl.uniform1f(location, num);
    }
  }

  /**
    Sets a texture uniform in the shader.
   * @param {string} name - The name of the uniform.
   * @param {Texture} texture - The texture object.
   * @param {number} textureIndex - The texture unit index to bind to.
   * @returns {void}
   */
  public setTexture(name: string, texture: Texture, textureIndex: number): void {
    const location = this.gl.getUniformLocation(this._shaderProgram, name);
    if (location) {
      this.gl.activeTexture(this.gl.TEXTURE0 + textureIndex);
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture.glTexture);
      this.gl.uniform1i(location, textureIndex);
    }
  }

  /**
    Sets vertex buffer data.
   * @param {WebGLBuffer} buffer - The buffer to set the data for.
   * @param {vec3[]} values - An array of vectors representing the vertex data.
   * @returns {void}
   */
  public setBuffer(buffer: WebGLBuffer, values: vec3[]): void {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(values.flat() as number[]), this.gl.STATIC_DRAW);
  }

  /**
    Sets index buffer data.
   * @param {number[]} values - An array of indices.
   * @returns {void}
   */
  public setIndices(values: number[]): void {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this._buffers.indices);
    const indicesArray = new Uint16Array(values);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, indicesArray, this.gl.STATIC_DRAW);
  }

  /**
    Compiles a single shader from source.
   * @private
   * @param {WebGL2RenderingContext} gl - The WebGL2 rendering context.
   * @param {number} type - The type of shader (e.g., `gl.VERTEX_SHADER`).
   * @param {string} source - The GLSL source code.
   * @returns {WebGLShader | null} - The compiled shader or null on failure.
   */
  private compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) {
      return null;
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('An error occurred compiling the shader:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  /**
    Creates and links a WebGL program from vertex and fragment shaders.
   * @private
   * @param {WebGL2RenderingContext} gl - The WebGL2 rendering context.
   * @param {WebGLShader} vertexShader - The compiled vertex shader.
   * @param {WebGLShader} fragmentShader - The compiled fragment shader.
   * @returns {WebGLProgram | null} - The linked program or null on failure.
   */
  private createProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
    const shaderProgram = gl.createProgram();
    if (!shaderProgram) {
      return null;
    }
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error('Unable to initialize the shader program:', gl.getProgramInfoLog(shaderProgram));
      return null;
    }
    return shaderProgram;
  }

  /**
    Recompiles the shader program and re-initializes it.
   * @returns {void}
   */
  public recompile(): void {
    this.destroy();
    this.initialize();
  }

  /**
    Destroys all WebGL resources associated with this shader.
   * @returns {void}
   */
  public destroy(): void {
    if (this._buffers.position)
      this.gl.deleteBuffer(this._buffers.position);
    if (this._buffers.normal)
      this.gl.deleteBuffer(this._buffers.normal);
    if (this._buffers.uv)
      this.gl.deleteBuffer(this._buffers.uv);
    if (this._buffers.tangent)
      this.gl.deleteBuffer(this._buffers.tangent);
    if (this._buffers.bitangent)
      this.gl.deleteBuffer(this._buffers.bitangent);
    if (this._buffers.indices)
      this.gl.deleteBuffer(this._buffers.indices);
    if (this._shaderProgram)
      this.gl.deleteProgram(this._shaderProgram);
    this._initialized = false;
  }

  /**
    Serializes the shader's state to a JSON object.
   * @override
   * @returns {JsonSerializedData} - The JSON object representation.
   */
  public override toJsonObject(): JsonSerializedData {
    return {
      ...super.toJsonObject(),
      uuid: this.uuid,
      type: this.constructor.name,
      fragUri: this.fragUri,
      vertexUri: this.vertexUri,
      material: this.material.toJsonObject()
    };
  }

  /**
    Deserializes the shader's state from a JSON object.
   * @override
   * @param {JsonSerializedData} jsonObject - The JSON object to deserialize from.
   * @returns {void}
   */
  public override fromJson(jsonObject: JsonSerializedData): void {
    this.fragUri = jsonObject['fragUri'];
    this.vertexUri = jsonObject['vertexUri'];
    this.material = ObjectInstanciator.instanciateObjectFromJsonData(jsonObject.material.className) || new ColorMaterial();
    this.material.fromJson(jsonObject['material']);
  }
}