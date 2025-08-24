import { ShaderUniformsEnum } from "../enums/shader-uniforms.enum";
import { Texture } from "../textures/texture";
import { Shader } from "./shader";
export class UnlitShader extends Shader {
    static instanciate(gl, material) {
        return new UnlitShader(gl, material);
    }
    constructor(gl, material) {
        super(gl, material, "assets/shaders/frag/unlit.frag", "assets/shaders/vertex/vertex.vert");
        this.gl = gl;
        this.material = material;
    }
    loadDataIntoShader() {
        var _a;
        if (!this.material)
            return;
        if (!this.material.mainTex && this.material.mainTexUrl) {
            this.material.mainTex = new Texture(this.gl, this.material.mainTexUrl);
            this.material.mainTex.load();
        }
        else if (!((_a = this.material.mainTex) === null || _a === void 0 ? void 0 : _a.isImageLoaded) && this.material.mainTexUrl) {
            this.material.mainTex.load();
        }
        this.setVec4(ShaderUniformsEnum.U_MAT_COLOR, this.material.color.toVec4());
        this.setVec2(ShaderUniformsEnum.U_UV_SCALE, this.material.uvScale);
        this.setVec2(ShaderUniformsEnum.U_UV_OFFSET, this.material.uvOffset);
        if (this.material.mainTex && this.material.mainTex.isImageLoaded) {
            this.setTexture(ShaderUniformsEnum.U_MAIN_TEX, this.material.mainTex, 0);
        }
        super.loadDataIntoShader();
    }
}
