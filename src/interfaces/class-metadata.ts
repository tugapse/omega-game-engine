import { ClassType } from "../enums/class-type.enum";

export interface ClassMetadata {
    name: string;
    type: ClassType;
    path: string;
    description?: string;
}   