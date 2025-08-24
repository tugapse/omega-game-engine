import { JsonSerializedData } from "../interfaces/json-serialized-data";
import { Texture } from "../textures/texture";
import { UnlitMaterial } from "./unlit-material";
export declare class LitMaterial extends UnlitMaterial {
    normalTexUrl: string;
    specularStrength: number;
    roughness: number;
    normalMapStrength: number;
    normalTex: Texture;
    toJsonObject(): JsonSerializedData;
    fromJson(jsonObject: JsonSerializedData): void;
    static instanciate(): LitMaterial;
}
