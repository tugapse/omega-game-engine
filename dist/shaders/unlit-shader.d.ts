import { UnlitMaterial } from "../materials/unlit-material";
import { Shader } from "./shader";
export declare class UnlitShader extends Shader {
    gl: WebGL2RenderingContext;
    material: UnlitMaterial;
    static instanciate(gl: WebGL2RenderingContext, material: UnlitMaterial): UnlitShader;
    constructor(gl: WebGL2RenderingContext, material: UnlitMaterial);
    loadDataIntoShader(): void;
}
