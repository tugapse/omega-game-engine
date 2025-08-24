import { vec4 } from "gl-matrix";
/**
 * @interface ParsedObjData
 * @description Represents the consolidated mesh data parsed from an OBJ file,
 * ready for use in a graphics API like WebGL.
 */
export interface ParsedObjData {
    /**
     * Flattened array of vertex positions (e.g., [x1, y1, z1, x2, y2, z2, ...]).
     */
    vertices: number[];
    /**
     * Flattened array of vertex normals (e.g., [nx1, ny1, nz1, nx2, ny2, nz2, ...]).
     */
    normals: number[];
    /**
     * Flattened array of vertex texture coordinates (e.g., [u1, v1, u2, v2, ...]).
     */
    uvs: number[];
    /**
     * Indexed drawing buffer: A list of indices referring to the consolidated
     * vertex attributes (positions, normals, uvs). These define the triangles.
     */
    indices: number[];
}
/**
 * @interface ObjFace
 * @description Represents a single face (polygon) as defined in the OBJ file,
 * storing 0-based indices to original vertex, UV, and normal lists.
 */
export interface ObjFace {
    /**
     * Array of 0-based vertex position indices for this face.
     */
    positions: number[];
    /**
     * Array of 0-based vertex texture coordinate indices for this face.
     * Can contain -1 if UVs are not provided for a vertex.
     */
    uvs: number[];
    /**
     * Array of 0-based vertex normal indices for this face.
     * Can contain -1 if normals are not provided for a vertex.
     */
    normals: number[];
}
/**
 * @interface MtlMaterial
 * @description Represents a single material definition parsed from an MTL file.
 */
export interface MtlMaterial {
    name: string;
    Ns?: number;
    Ka?: vec4;
    Kd?: vec4;
    Ks?: vec4;
    Ke?: vec4;
    Ni?: number;
    d?: number;
    illum?: number;
    map_Kd?: string;
    map_Ks?: string;
    map_Bump?: string;
}
/**
 * @interface ParsedMtlData
 * @description Holds a collection of materials parsed from an MTL file,
 * mapped by their material names.
 */
export interface ParsedMtlData {
    [materialName: string]: MtlMaterial;
}
