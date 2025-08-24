import { EngineCache } from "../core/engineCache";
import { ShaderUniformsEnum } from "../enums/shader-uniforms.enum";
import { JsonSerializable } from "../interfaces/json-serializable";
import { ColorMaterial } from "../materials/color-material";
import { v4 as uuidv4 } from 'uuid';
export class Shader extends JsonSerializable {
    static preFetchFunctionsGlsl() {
        for (const a of Object.values(Shader.SHADER_FUNCTIONS)) {
            EngineCache.loadShaderSource(a);
        }
    }
    static instanciate(gl, material) {
        return new Shader(gl, material);
    }
    get uuid() { return this._uuid; }
    constructor(gl, material, fragUri = "assets/shaders/frag/color.frag", vertexUri = "assets/shaders/vertex/vertex.vert") {
        super();
        this.gl = gl;
        this.material = material;
        this.fragUri = fragUri;
        this.vertexUri = vertexUri;
        this.initialized = false;
        this.buffers = {
            position: null,
            normal: null,
            uv: null,
            tangent: null,
            bitangent: null,
            indices: null,
        };
        this._uuid = uuidv4();
    }
    async initialize() {
        if (this.initialized) {
            return;
        }
        const keys = Object.keys(Shader.SHADER_FUNCTIONS);
        let vsSource = await EngineCache.loadShaderSource(this.vertexUri);
        let fsSource = await EngineCache.loadShaderSource(this.fragUri);
        for (const obkey of keys) {
            if (fsSource.includes(obkey)) {
                const url = Shader.SHADER_FUNCTIONS[obkey];
                const text = await EngineCache.loadShaderSource(url);
                fsSource = fsSource.replace(obkey, text);
            }
        }
        const vertexShader = this.compileShader(this.gl, this.gl.VERTEX_SHADER, vsSource);
        const fragmentShader = this.compileShader(this.gl, this.gl.FRAGMENT_SHADER, fsSource);
        if (!vertexShader || !fragmentShader) {
            return;
        }
        this.shaderProgram = this.createProgram(this.gl, vertexShader, fragmentShader);
        this.initialized = true;
    }
    async addShaderImports(vsSource, fsSource) {
    }
    initBuffers(gl, mesh) {
        mesh.calculateNormals();
        mesh.calculateTangentsAndBitangents();
        const buffers = {
            position: null,
            normal: null,
            uv: null,
            tangent: null,
            bitangent: null,
            indices: null,
        };
        buffers.position = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        const positions = [];
        for (const v of mesh.vertices) {
            positions.push(v[0], v[1], v[2]);
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        buffers.normal = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
        const normals = [];
        for (const n of mesh.normals) {
            normals.push(n[0], n[1], n[2]);
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
        buffers.uv = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.uv);
        const uvs = [];
        for (const uv of mesh.uvs) {
            uvs.push(uv[0], uv[1]);
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
        if (mesh.tangents && mesh.tangents.length > 0) {
            buffers.tangent = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.tangent);
            const tangents = [];
            for (const t of mesh.tangents) {
                tangents.push(t[0], t[1], t[2]);
            }
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tangents), gl.STATIC_DRAW);
        }
        if (mesh.bitangents && mesh.bitangents.length > 0) {
            buffers.bitangent = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.bitangent);
            const bitangents = [];
            for (const b of mesh.bitangents) {
                bitangents.push(b[0], b[1], b[2]);
            }
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bitangents), gl.STATIC_DRAW);
        }
        buffers.indices = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), gl.STATIC_DRAW);
        this.buffers = buffers;
    }
    bindBuffers() {
        if (!this.gl || !this.shaderProgram)
            return;
        const positionAttributeLocation = this.gl.getAttribLocation(this.shaderProgram, 'a_position');
        if (this.buffers.position && positionAttributeLocation !== -1) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
            this.gl.vertexAttribPointer(positionAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
            this.gl.enableVertexAttribArray(positionAttributeLocation);
        }
        else if (positionAttributeLocation !== -1) {
            this.gl.disableVertexAttribArray(positionAttributeLocation);
        }
        const normalAttributeLocation = this.gl.getAttribLocation(this.shaderProgram, 'a_normal');
        if (this.buffers.normal && normalAttributeLocation !== -1) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.normal);
            this.gl.vertexAttribPointer(normalAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
            this.gl.enableVertexAttribArray(normalAttributeLocation);
        }
        else if (normalAttributeLocation !== -1) {
            this.gl.disableVertexAttribArray(normalAttributeLocation);
        }
        const uvAttributeLocation = this.gl.getAttribLocation(this.shaderProgram, 'a_uv');
        if (this.buffers.uv && uvAttributeLocation !== -1) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.uv);
            this.gl.vertexAttribPointer(uvAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);
            this.gl.enableVertexAttribArray(uvAttributeLocation);
        }
        else if (uvAttributeLocation !== -1) {
            this.gl.disableVertexAttribArray(uvAttributeLocation);
        }
        const tangentAttributeLocation = this.gl.getAttribLocation(this.shaderProgram, 'a_tangent');
        if (this.buffers.tangent && tangentAttributeLocation !== -1) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.tangent);
            this.gl.vertexAttribPointer(tangentAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
            this.gl.enableVertexAttribArray(tangentAttributeLocation);
        }
        else if (tangentAttributeLocation !== -1) {
            console.debug("Tagent arrtibute location not found");
            this.gl.disableVertexAttribArray(tangentAttributeLocation);
        }
        const bitangentAttributeLocation = this.gl.getAttribLocation(this.shaderProgram, 'a_bitangent');
        if (this.buffers.bitangent && bitangentAttributeLocation !== -1) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.bitangent);
            this.gl.vertexAttribPointer(bitangentAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
            this.gl.enableVertexAttribArray(bitangentAttributeLocation);
        }
        else if (bitangentAttributeLocation !== -1) {
            console.debug("BiTagent arrtibute location not found");
            this.gl.disableVertexAttribArray(bitangentAttributeLocation);
        }
        if (this.buffers.indices) {
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
        }
    }
    use() {
        if (!this.shaderProgram || !this.initialized) {
            return;
        }
        this.gl.useProgram(this.shaderProgram);
    }
    loadDataIntoShader() {
        const material = this.material;
        this.setVec4(ShaderUniformsEnum.U_MAT_COLOR, material.color.toVec4());
    }
    setMat4(name, value) {
        const location = this.gl.getUniformLocation(this.shaderProgram, name);
        if (location) {
            this.gl.uniformMatrix4fv(location, false, Float32Array.from(value));
        }
        else {
            console.warn(`Uniform location for ${name} not found or is null.`);
        }
    }
    setMat3(name, value) {
        const location = this.gl.getUniformLocation(this.shaderProgram, name);
        if (location) {
            this.gl.uniformMatrix3fv(location, false, Float32Array.from(value));
        }
    }
    setVec4(name, vec) {
        const location = this.gl.getUniformLocation(this.shaderProgram, name);
        if (location) {
            this.gl.uniform4fv(location, Float32Array.from(vec));
        }
    }
    setVec3(name, vec) {
        const location = this.gl.getUniformLocation(this.shaderProgram, name);
        if (location) {
            this.gl.uniform3fv(location, Float32Array.from(vec));
        }
    }
    setVec2(name, vec) {
        const location = this.gl.getUniformLocation(this.shaderProgram, name);
        if (location) {
            this.gl.uniform2fv(location, Float32Array.from(vec));
        }
    }
    setFloat(name, num) {
        const location = this.gl.getUniformLocation(this.shaderProgram, name);
        if (location) {
            this.gl.uniform1f(location, num);
        }
    }
    setTexture(name, texture, textureIndex) {
        const location = this.gl.getUniformLocation(this.shaderProgram, name);
        if (location) {
            this.gl.activeTexture(this.gl.TEXTURE0 + textureIndex);
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture.glTexture);
            this.gl.uniform1i(location, textureIndex);
        }
    }
    setBuffer(buffer, values) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(values.flat()), this.gl.STATIC_DRAW);
    }
    setIndices(values) {
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
        const indicesArray = new Uint16Array(values);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, indicesArray, this.gl.STATIC_DRAW);
    }
    compileShader(gl, type, source) {
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
    createProgram(gl, vertexShader, fragmentShader) {
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
    recompile() {
        this.destroy();
        this.initialize();
    }
    destroy() {
        if (this.buffers.position)
            this.gl.deleteBuffer(this.buffers.position);
        if (this.buffers.normal)
            this.gl.deleteBuffer(this.buffers.normal);
        if (this.buffers.uv)
            this.gl.deleteBuffer(this.buffers.uv);
        if (this.buffers.tangent)
            this.gl.deleteBuffer(this.buffers.tangent);
        if (this.buffers.bitangent)
            this.gl.deleteBuffer(this.buffers.bitangent);
        if (this.buffers.indices)
            this.gl.deleteBuffer(this.buffers.indices);
        if (this.shaderProgram)
            this.gl.deleteProgram(this.shaderProgram);
        this.initialized = false;
    }
    toJsonObject() {
        return {
            ...super.toJsonObject(),
            uuid: this.uuid,
            type: this.constructor.name,
            fragUri: this.fragUri,
            vertexUri: this.vertexUri,
            material: this.material.toJsonObject()
        };
    }
    fromJson(jsonObject) {
        this.fragUri = jsonObject['fragUri'];
        this.vertexUri = jsonObject['vertexUri'];
        this.material = new ColorMaterial();
        this.material.fromJson(jsonObject['material']);
    }
}
Shader.SHADER_FUNCTIONS = {
    "@INCLUDE_LIGHT_FUNC": "assets/shaders/functions/light.frag",
    "@INCLUDE_LIGHT_HEADER": "assets/shaders/functions/light-header.frag",
};
