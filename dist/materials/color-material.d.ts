import { Color } from "../core/color";
import { JsonSerializable } from "../interfaces/json-serializable";
import { JsonSerializedData } from "../interfaces/json-serialized-data";
export declare class ColorMaterial extends JsonSerializable {
    static instanciate(): ColorMaterial;
    name: string;
    color: Color;
    toJsonObject(): JsonSerializedData;
    fromJson(jsonObject: JsonSerializedData): void;
}
