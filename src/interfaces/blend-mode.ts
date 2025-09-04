import { BlendingSourceFactor, BlendingDestinationFactor } from "../enums/gl/blend";

export interface BlendingMode {
    sourcefactor: BlendingSourceFactor;
    destfactor: BlendingDestinationFactor;
}