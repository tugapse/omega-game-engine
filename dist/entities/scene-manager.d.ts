import { JsonSerializedData } from "../interfaces/json-serialized-data";
import { Scene } from "./scene";
export declare class SceneManager {
    private static dependecies;
    static addDependency<T>(className: string, func: Function): void;
    static instanciateObjectFromJsonData(className: string, args?: any[]): any;
    static loadScene(gl: WebGL2RenderingContext, jsonData: JsonSerializedData, scene?: Scene): Scene;
    private static instaciateSceneMeshes;
    private static instaciateSceneObjects;
    static prepareTransforms(transforms: any, entities: any): void;
    static creatSceneSnapshot(scene: Scene): JsonSerializedData;
}
