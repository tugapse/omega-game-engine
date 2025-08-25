import { Color } from "../core/color";
import { Transform } from "../core/transform";
import { Vector3 } from "../core/vector";
import { EntityType } from "../enums/entity-type";
import { JsonSerializedData } from "../interfaces/json-serialized-data";
import { GlEntity } from "./entity";
export declare class LightAttenuation {
    constant: number;
    linear: number;
    quadratic: number;
}
export declare class LightConeAngles {
    inner: number;
    outer: number;
}
export declare class Light extends GlEntity {
    entityType: EntityType;
    color: Color;
    constructor(name: string);
    toJsonObject(): JsonSerializedData;
    fromJson(jsonObject: JsonSerializedData): void;
    static instanciate(name?: string, transform?: Transform): Light;
}
export declare class DirectionalLight extends Light {
    direction: Vector3;
    entityType: EntityType;
    constructor(name: string);
    toJsonObject(): JsonSerializedData;
    fromJson(jsonObject: JsonSerializedData): void;
    static instanciate(name?: string, transform?: Transform): DirectionalLight;
}
export declare class PointLight extends Light {
    entityType: EntityType;
    attenuation: LightAttenuation;
    constructor(name: string);
    toJsonObject(): JsonSerializedData;
    fromJson(jsonObject: JsonSerializedData): void;
    static instanciate(name?: string, transform?: Transform): PointLight;
}
export declare class SpotLight extends Light {
    entityType: EntityType;
    direction: Vector3;
    coneAngles: LightConeAngles;
    attenuation: LightAttenuation;
    constructor(name: string);
    toJsonObject(): JsonSerializedData;
    fromJson(jsonObject: JsonSerializedData): void;
    static instanciate(name?: string, transform?: Transform): SpotLight;
}
