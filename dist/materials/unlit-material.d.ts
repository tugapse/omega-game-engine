import { vec2 } from "gl-matrix";
import { JsonSerializedData } from "../interfaces/json-serialized-data";
import { Texture } from "../textures/texture";
import { ColorMaterial } from "./color-material";
export declare class UnlitMaterial extends ColorMaterial {
    mainTexUrl: string;
    uvScale: vec2;
    uvOffset: vec2;
    mainTex: Texture;
    toJsonObject(): JsonSerializedData;
    fromJson(jsonObject: JsonSerializedData): void;
    static instanciate(): UnlitMaterial;
}
