import { EngineCache } from "../core/engineCache";
import { Camera } from "../entities/camera";
import { ShaderUniformsEnum } from "../enums/shader-uniforms.enum";
import { Texture } from "../textures/texture";
import { Shader } from "./shader";
export class LitShader extends Shader {
    static instanciate(gl, material) {
        return new LitShader(gl, material);
    }
    constructor(gl, material) {
        super(gl, material, "assets/shaders/frag/phong.frag", "assets/shaders/vertex/vertex.vert");
        this.gl = gl;
        this.material = material;
    }
    loadDataIntoShader() {
        if (!this.material)
            return;
        this.checkAndLoadTextures();
        if (!this.material.color.toVec4) {
            debugger;
        }
        this.setVec4(ShaderUniformsEnum.U_MAT_COLOR, this.material.color.toVec4());
        this.setVec2(ShaderUniformsEnum.U_UV_SCALE, this.material.uvScale);
        this.setVec2(ShaderUniformsEnum.U_UV_OFFSET, this.material.uvOffset);
        this.setFloat(ShaderUniformsEnum.U_SPECULAR_STRENGTH, this.material.specularStrength);
        this.setFloat(ShaderUniformsEnum.U_ROUGHNESS, Math.max(this.material.roughness, 0.01));
        this.setFloat(ShaderUniformsEnum.U_NORMAL_MAP_STRENGTH, this.material.normalMapStrength);
        this.setVec3(ShaderUniformsEnum.U_CAMERA_POSITION, Camera.mainCamera.transform.position);
        if (this.material.mainTex && this.material.mainTex.isImageLoaded) {
            this.setTexture(ShaderUniformsEnum.U_MAIN_TEX, this.material.mainTex, 0);
        }
        super.loadDataIntoShader();
    }
    checkAndLoadTextures() {
        if (!this.material.mainTex && this.material.mainTexUrl) {
            this.material.mainTex = EngineCache.getTexture2D(this.material.mainTexUrl, this.gl);
        }
        else if (!this.material.mainTex && !this.material.mainTexUrl) {
            this.material.mainTex = Texture.getDefaultWhiteTexture(this.gl);
        }
        if (!this.material.normalTex && this.material.normalTexUrl) {
            this.material.normalTex = EngineCache.getTexture2D(this.material.normalTexUrl, this.gl);
        }
        else if (!this.material.normalTex && !this.material.normalTexUrl) {
            this.material.normalTex = Texture.getDefaultWhiteTexture(this.gl);
        }
    }
}
