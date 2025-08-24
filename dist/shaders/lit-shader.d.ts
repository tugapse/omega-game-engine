import { LitMaterial } from "../materials/lit-material";
import { Shader } from "./shader";
export declare class LitShader extends Shader {
    gl: WebGL2RenderingContext;
    material: LitMaterial;
    static instanciate(gl: WebGL2RenderingContext, material: LitMaterial): LitShader;
    constructor(gl: WebGL2RenderingContext, material: LitMaterial);
    loadDataIntoShader(): void;
    private checkAndLoadTextures;
}
