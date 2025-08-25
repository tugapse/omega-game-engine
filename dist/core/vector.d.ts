import { vec2, vec3, vec4 } from "gl-matrix";
import { JsonSerializable, JsonSerializedData } from "../interfaces";
export declare class Vector2 extends JsonSerializable {
    protected _vec: vec2;
    get vector(): vec2;
    get x(): number;
    get y(): number;
    set x(value: number);
    set y(value: number);
    constructor(x?: number, y?: number);
    fromJson(jsonObject: JsonSerializedData): void;
    toJsonObject(): JsonSerializedData;
    set(x?: number, y?: number, z?: number, w?: number): void;
}
export declare class Vector3 extends Vector2 {
    protected _vec: vec3;
    get vector(): vec3;
    get x(): number;
    get y(): number;
    get z(): number;
    set x(value: number);
    set y(value: number);
    set z(value: number);
    constructor(x?: number, y?: number, z?: number);
    fromJson(jsonObject: JsonSerializedData): void;
    toJsonObject(): JsonSerializedData;
    set(x?: number, y?: number, z?: number): void;
}
export declare class Vector4 extends Vector3 {
    protected _vec: vec4;
    get vector(): vec4;
    get x(): number;
    get y(): number;
    get z(): number;
    get w(): number;
    set x(value: number);
    set y(value: number);
    set z(value: number);
    set w(value: number);
    constructor(x?: number, y?: number, z?: number, w?: number);
    fromJson(jsonObject: JsonSerializedData): void;
    toJsonObject(): JsonSerializedData;
    set(x?: number, y?: number, z?: number, w?: number): void;
}
