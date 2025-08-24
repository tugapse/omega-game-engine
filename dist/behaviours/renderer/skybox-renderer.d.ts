import { JsonSerializedData } from "../../interfaces/json-serialized-data";
import { RenderMeshBehaviour } from "./render-mesh-behaviour";
export declare class SkyboxRenderer extends RenderMeshBehaviour {
    static instanciate(gl: WebGL2RenderingContext): SkyboxRenderer;
    initialize(): boolean;
    protected setGlSettings(): void;
    draw(): void;
    setCameraMatrices(): void;
    setShaderVariables(): void;
    fromJson(jsonObject: JsonSerializedData): void;
}
