import { vec2, vec3 } from "gl-matrix";
import { JsonSerializable } from "../interfaces/json-serializable";
import { JsonSerializedData } from "../interfaces/json-serialized-data";
export declare const loadTorusPrimitive: () => Promise<MeshData>;
export declare const loadCilinderPrimitive: () => Promise<MeshData>;
/**
 * @class MeshData
 * @description Base class for geometric mesh data.
 * It stores vertex positions, normals, and UV coordinates, along with optional tangent and bitangent vectors for normal mapping.
 */
export declare class MeshData extends JsonSerializable {
    static instanciate(vertices?: vec3[], normals?: vec3[], uvs?: vec2[], indices?: number[]): MeshData;
    vertices: vec3[];
    normals: vec3[];
    uvs: vec2[];
    indices: number[];
    tangents?: vec3[];
    bitangents?: vec3[];
    uuid: string;
    constructor(vertices: vec3[], normals?: vec3[], // Make normals optional in constructor, as they can be generated
    uvs?: vec2[], // Make uvs optional in constructor
    indices?: number[]);
    /**
     * Calculates smooth normals and generates indices for the mesh based on its vertices. 📐
     * If `this.indices` is not already set, it generates sequential indices assuming the vertices
     * are ordered to form triangles (e.g., 3 vertices per triangle).
     * It computes face normals and then averages them for vertex normals to create a smooth appearance.
     * The calculated normals and indices are stored directly in `this.normals` and `this.indices`.
     */
    calculateNormals(): void;
    /**
     * Inverts the direction of all normal vectors in the mesh. 🔄
     * This is useful for flipping faces or correcting normal orientations.
     */
    invertNormals(): void;
    /**
     * Calculates tangents and bitangents for the mesh and populates the instance's arrays.
     * This method should be called after the mesh's vertices, normals, UVs, and indices are set.
     */
    calculateTangentsAndBitangents(): void;
    toJsonObject(): JsonSerializedData;
    fromJson(jsonObject: any): void;
}
export declare class Mesh extends JsonSerializable {
    meshData: MeshData;
    toJsonObject(): JsonSerializedData;
    fromJson(jsonObject: JsonSerializedData): void;
}
