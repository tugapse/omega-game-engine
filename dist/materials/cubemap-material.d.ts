import { JsonSerializedData } from "../interfaces/json-serialized-data";
import { CubeMapTexture } from "../textures/cubemap-texture";
import { ColorMaterial } from "./color-material";
export declare class CubemapMaterial extends ColorMaterial {
    rightSideUri: string;
    leftSideUri: string;
    topSideUri: string;
    bottomSideUri: string;
    backSideUri: string;
    frontSideUri: string;
    mainTex: CubeMapTexture;
    fromJson(jsonObject: JsonSerializedData): void;
    toJsonObject(): JsonSerializedData;
    static instanciate(): CubemapMaterial;
}
