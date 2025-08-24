import { vec3 } from "gl-matrix";
import { GlEntity } from "./entity";
import { Color } from "../core/color";
import { Transform } from "../core/transform";
import { EntityType } from "../enums/entity-type";
import { JsonSerializedData } from "../interfaces/json-serialized-data";
export declare class Light extends GlEntity {
    entityType: EntityType;
    color: Color;
    constructor(name: string);
    toJsonObject(): JsonSerializedData;
    fromJson(jsonObject: JsonSerializedData): void;
    static instanciate(name?: string, transform?: Transform): Light;
}
export declare class DirectionalLight extends Light {
    direction: vec3;
    entityType: EntityType;
    constructor(name: string);
    toJsonObject(): JsonSerializedData;
    fromJson(jsonObject: JsonSerializedData): void;
    static instanciate(name?: string, transform?: Transform): DirectionalLight;
}
export declare class PointLight extends Light {
    entityType: EntityType;
    attenuation: {
        constant: number;
        linear: number;
        quadratic: number;
    };
    constructor(name: string);
    toJsonObject(): JsonSerializedData;
    fromJson(jsonObject: JsonSerializedData): void;
    static instanciate(name?: string, transform?: Transform): PointLight;
}
export declare class SpotLight extends Light {
    entityType: EntityType;
    direction: vec3;
    coneAngles: {
        inner: number;
        outer: number;
    };
    attenuation: {
        constant: number;
        linear: number;
        quadratic: number;
    };
    constructor(name: string);
    toJsonObject(): JsonSerializedData;
    fromJson(jsonObject: JsonSerializedData): void;
    static instanciate(name?: string, transform?: Transform): SpotLight;
}
