import { ParsedMtlData } from "./interfaces";
export declare class MtlParser {
    private parsedMaterials;
    private currentMaterial;
    /**
     * Parses the content of an MTL (Material Template Library) file string.
     * @param mtlContent The entire content of the MTL file as a string.
     * @returns A ParsedMtlData object containing all defined materials.
     */
    parse(mtlContent: string): ParsedMtlData;
    private resetParser;
    private handleNewMaterial;
    private setNumericProperty;
    private setColorProperty;
    private setTextureMapProperty;
}
