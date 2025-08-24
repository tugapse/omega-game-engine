import { vec3, vec4 } from "gl-matrix";
import { JsonSerializable } from "../interfaces/json-serializable";
import { JsonSerializedData } from "../interfaces/json-serialized-data";
export declare class Color extends JsonSerializable {
    static createFromJsonData(jsonData: JsonSerializedData): Color;
    get r(): number;
    get g(): number;
    get b(): number;
    get a(): number;
    set g(value: number);
    set r(value: number);
    set b(value: number);
    set a(value: number);
    private vector;
    constructor(r?: number, g?: number, b?: number, a?: number);
    toJsonObject(): {
        [key: string]: any;
    };
    fromJson(jsonObject: {
        [key: string]: any;
    }): void;
    toVec3(): vec3;
    toVec4(): vec4;
}
