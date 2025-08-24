import { Transform } from "../core/transform";
import { GlEntity } from "../entities/entity";
import { JsonSerializable } from "../interfaces/json-serializable";
import { JsonSerializedData } from "../interfaces/json-serialized-data";
export declare abstract class EntityBehaviour extends JsonSerializable {
    static instanciate(args?: any): any;
    active: boolean;
    parent: GlEntity;
    protected _initialized: boolean;
    get transform(): Transform;
    constructor();
    initialize(): boolean;
    update(ellapsed: number): void;
    updateEditor(ellapsed: number): void;
    draw(): void;
    destroy(): void;
    toJsonObject(): JsonSerializedData;
    fromJson(jsonObject: JsonSerializedData): void;
    clone(): EntityBehaviour | null;
}
