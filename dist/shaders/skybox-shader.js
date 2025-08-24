import { ShaderUniformsEnum } from "../enums/shader-uniforms.enum";
import { CubeMapTexture } from "../textures/cubemap-texture";
import { Shader } from "./shader";
export class SkyboxShader extends Shader {
    static instanciate(gl, material) {
        return new SkyboxShader(gl, material);
    }
    initialize() {
        this.fragUri = "assets/shaders/frag/skybox.frag";
        this.vertexUri = "assets/shaders/vertex/skybox.vert";
        return super.initialize();
    }
    loadDataIntoShader() {
        if (!this.material)
            return;
        const { rightSideUri, leftSideUri, topSideUri, bottomSideUri, backSideUri, frontSideUri } = this.material;
        if (!this.material.mainTex) {
            this.material.mainTex = new CubeMapTexture(this.gl, [
                rightSideUri, leftSideUri,
                topSideUri, bottomSideUri,
                frontSideUri, backSideUri
            ]);
            this.material.mainTex.load();
        }
        else if (!this.material.mainTex.isImageLoaded) {
            this.material.mainTex.load();
        }
        this.setVec4(ShaderUniformsEnum.U_MAT_COLOR, this.material.color.toVec4());
        if (this.material.mainTex && this.material.mainTex.isImageLoaded) {
            this.setTexture(ShaderUniformsEnum.U_MAIN_TEX, this.material.mainTex, 0);
        }
        super.loadDataIntoShader();
    }
    setTexture(name, texture, textureIndex) {
        const location = this.gl.getUniformLocation(this.shaderProgram, name);
        if (location) {
            this.gl.activeTexture(this.gl.TEXTURE0 + textureIndex);
            texture.bind();
            this.gl.uniform1i(location, textureIndex);
        }
    }
    fromJson(jsonObject) {
        super.fromJson(jsonObject);
        this.material = jsonObject['material'];
    }
}
