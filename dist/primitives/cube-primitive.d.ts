import { vec2, vec3 } from "gl-matrix";
import { MeshData } from "../core/mesh";
export declare class CubePrimitive extends MeshData {
    static instanciate(vertices?: vec3[], normals?: vec3[], uvs?: vec2[], indices?: number[]): CubePrimitive;
    constructor(size?: number);
}
