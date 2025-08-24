import { vec3 } from "gl-matrix";
import { JsonSerializedData } from "../interfaces/json-serialized-data";
import { GlEntity } from "./entity";
import { Light } from "./light";
export declare class Scene extends GlEntity {
    private static _currentScene;
    static get currentScene(): Scene;
    isRunning: boolean;
    color: vec3;
    tag: string;
    entityType: number;
    private _objects;
    private gl;
    private ellapsedTime;
    get objects(): GlEntity[];
    get lights(): Light[];
    constructor();
    initialize(): void;
    update(ellapsed: number): void;
    draw(): void;
    addEntity(entity: GlEntity): void;
    setGlRenderingContext(gl: WebGL2RenderingContext): void;
    destroy(): void;
    fromJson(jsonObject: JsonSerializedData): void;
    toJsonObject(): JsonSerializedData;
    setCurrent(): void;
    getEntitieByName(name: string): GlEntity | undefined;
    getEntitieByUuid(uuid: string): GlEntity | undefined;
    getEntitiesByTag(tag: string): GlEntity[];
    /**
      * Retrieves entities of a specific type from the collection.
      * T must be a type that extends GLEntity.
      * @param constructor The constructor function of the type to filter by (e.g., GLErrorEntity).
      * @returns An array of entities of the specified type.
      */
    getEntities<T extends GlEntity>(constructor: new (...args: any[]) => T): T[];
}
