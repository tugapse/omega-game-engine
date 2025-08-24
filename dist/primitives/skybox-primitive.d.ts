import { vec2, vec3 } from "gl-matrix";
import { CubePrimitive } from "./cube-primitive";
export declare class SkyboxPrimitive extends CubePrimitive {
    static instanciate(vertices?: vec3[], normals?: vec3[], uvs?: vec2[], indices?: number[]): CubePrimitive;
    constructor(size?: number);
}
