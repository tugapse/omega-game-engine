import { JsonSerializedData } from "./json-serialized-data";
export declare class JsonSerializable {
    toJsonObject(): JsonSerializedData;
    fromJson(jsonObject: JsonSerializedData): void;
}
