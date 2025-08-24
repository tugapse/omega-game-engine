import { DirectionalLight, Light, PointLight, SpotLight } from "../../entities/light";
import { RendererBehaviour } from "./renderer-behaviour";
export declare class RenderMeshBehaviour extends RendererBehaviour {
    gl: WebGL2RenderingContext;
    static instanciate(gl: WebGL2RenderingContext): RenderMeshBehaviour;
    protected normalMapUniformLocation: WebGLUniformLocation | null;
    protected tangentAttributeLocation: GLint;
    protected bitangentAttributeLocation: GLint;
    enableNormalmaps: boolean;
    enableLights: boolean;
    constructor(gl: WebGL2RenderingContext);
    draw(): void;
    protected initializeShader(): void;
    protected setShaderVariables(): void;
    protected getNormalMapLocations(): void;
    protected setNormalMapsInformation(): void;
    protected setLightInformation(): void;
    protected createLightObjectInfo(sceneLights: Light[]): void;
    protected loadSpotLights(spotLights: SpotLight[]): void;
    protected loadDirectionalLights(directionalLights: DirectionalLight[]): void;
    protected loadPointLights(pointLights: PointLight[]): void;
}
