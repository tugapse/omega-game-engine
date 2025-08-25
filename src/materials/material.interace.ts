import { Shader } from "../shaders/shader";

export interface IMaterial {
    loadUniforms(gl: WebGL2RenderingContext, shader: Shader): void;
}