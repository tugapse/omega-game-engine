import { EntityBehaviour } from "../behaviours/entity-behaviour";
import { Transform } from "../core/transform";
import { EntityType } from '../enums/entity-type';
import { JsonSerializable } from '../interfaces/json-serializable';
import { JsonSerializedData } from '../interfaces/json-serialized-data';
import { Scene } from "./scene";
export declare class GlEntity extends JsonSerializable {
    name: string;
    transform: Transform;
    static instanciate(name?: string, transform?: Transform): GlEntity;
    protected destroyed: boolean;
    scene: Scene;
    active: boolean;
    show: boolean;
    tag: string;
    updateInEditor: boolean;
    protected behaviours: EntityBehaviour[];
    protected _uuid: string;
    get uuid(): string;
    entityType: EntityType | number;
    constructor(name: string, transform?: Transform);
    initialize(): void;
    update(ellapsed: number): void;
    draw(): void;
    destroy(): void;
    addBehaviour(behaviour: EntityBehaviour): void;
    removeBehaviour(behaviour: EntityBehaviour): void;
    /**
    * Retrieves behaviours of a specific type from the collection.
    * T must be a type that extends EntityBehaviour.
    * @param constructor The constructor function of the type to filter by.
    * @returns An array of behaviours of the specified type.
    */
    getBehaviours<T extends EntityBehaviour>(constructor: new (...args: any[]) => T): T[];
    /**
  * Retrieves behaviours of a specific type from the collection.
  * T must be a type that extends EntityBehaviour.
  * @param constructor The constructor function of the type to filter by.
  * @returns An array of behaviours of the specified type.
  */
    getBehaviour<T extends EntityBehaviour>(constructor: new (...args: any[]) => T): T | undefined;
    fromJson(jsonObject: JsonSerializedData): void;
    toJsonObject(): JsonSerializedData;
    clone(): GlEntity;
}
