import { MeshData } from "../core/mesh";
export declare class ObjParser {
    private tempVertices;
    private tempNormals;
    private tempUVs;
    private tempFaces;
    private outputVertices;
    private outputNormals;
    private outputUVs;
    private outputIndices;
    /**
     * Parses the content of an OBJ file string.
     * @param objContent The entire content of the OBJ file as a string.
     * @returns A ParsedObjData object containing the mesh data.
     */
    parse(objContent: string): MeshData;
    private resetParser;
    private parseVertex;
    private parseUV;
    private parseNormal;
    private parseFace;
    private consolidateMeshData;
}
