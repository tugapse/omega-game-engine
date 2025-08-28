import { MeshData } from "../core/mesh";
import { Transform } from "../core/transform";
import { JsonSerializedData } from "../interfaces/json-serialized-data";
import { Scene } from "./scene";

/**
  A static class responsible for managing the loading, instantiation, and serialization of scenes and their components.
 */
export class SceneManager {
  /**
    A map that stores dependency injection functions for instantiating classes.
   * @private
    
   * @type {{ [key: string]: Function }}
   */
  private static dependecies: { [key: string]: Function } = {};

  /**
    Adds a class constructor or factory function as a dependency for instantiation.
    
   * @param {string} className - The name of the class.
   * @param {Function} func - The constructor or factory function to be called for instantiation.
   * @returns {void}
   */
  public static addDependency(className: string, func: Function): void {
    SceneManager.dependecies[className] = func;
  }

  /**
    Instantiates an object from a registered class name.
    
   * @param {string} className - The name of the class to instantiate.
   * @param {any[]} [args] - Optional arguments to pass to the constructor/factory function.
   * @returns {any} - A new instance of the specified class, or null if the class is not found.
   */
  public static instanciateObjectFromJsonData(className: string, args?: any[]): any {
    if (this.dependecies[className]) {
      if (args && args.length > 0) {
        return this.dependecies[className](...args);
      } else {
        return this.dependecies[className]();
      }
    } else {
      console.warn("[WANR] Class Object not found! Implement Class instancing for: ", className);
    }
    return null;
  }

  /**
    Loads a scene from a JSON data object.
    
   * @param {WebGL2RenderingContext} gl - The WebGL2 rendering context.
   * @param {JsonSerializedData} jsonData - The JSON data representing the scene.
   * @param {Scene} [scene] - An optional existing Scene instance to load into.
   * @returns {Scene} - The loaded or newly created Scene instance.
   */
  public static loadScene(gl: WebGL2RenderingContext, jsonData: JsonSerializedData, scene?: Scene): Scene {
    scene = scene || new Scene();
    const { meshMaps, objects } = jsonData;
    const meshes: { [key: string]: MeshData; } = SceneManager.instaciateSceneMeshes(meshMaps);

    jsonData['objects'] = SceneManager.instaciateSceneObjects(scene, objects, meshes, gl);
    scene.fromJson(jsonData);

    return scene;
  }

  /**
    Instantiates mesh data objects from the scene JSON data.
   * @private
    
   * @param {any} meshMaps - The raw mesh data from the JSON.
   * @returns {{ [key: string]: MeshData }} - A map of mesh UUIDs to MeshData instances.
   */
  private static instaciateSceneMeshes(meshMaps: any): { [key: string]: MeshData } {
    const meshes: { [key: string]: MeshData } = {};

    for (const data of Object.values(meshMaps) as any[]) {
      const mData = new MeshData([]);
      mData.fromJson(data);
      meshes[data['uuid']] = mData;
    }
    return meshes;
  }

  /**
    Instantiates and initializes all entities and their behaviours in the scene.
   * @private
    
   * @param {Scene} scene - The scene instance.
   * @param {any} objects - The raw entity data from the JSON.
   * @param {{ [key: string]: MeshData }} meshes - A map of instantiated meshes.
   * @param {WebGL2RenderingContext} gl - The WebGL2 rendering context.
   * @returns {any[]} - An array of instantiated entity objects.
   */
  private static instaciateSceneObjects(scene: Scene, objects: any, meshes: { [key: string]: MeshData }, gl: WebGL2RenderingContext): any[] {
    const transforms: { [key: string]: Transform } = {};

    const entities: any[] = objects.map((e: any) => {
      e['entity'] = SceneManager.instanciateObjectFromJsonData(e.type);
      const enTransform = e['entity'].transform as Transform;
      enTransform.fromJson(e['transform']);
      transforms[enTransform.uuid] = enTransform;
      return e;
    });

    this.prepareTransforms(transforms, entities);
    objects.forEach((e: any) => {
      e.entity.scene = scene;

      e.behaviours.forEach((behaviourJsonData: any) => {
        if (behaviourJsonData.mesh) {
          behaviourJsonData['meshData'] = meshes[behaviourJsonData.mesh.meshDataId];
        }
        const newBehaviour = SceneManager.instanciateObjectFromJsonData(behaviourJsonData.type, [gl]);
        if (newBehaviour) {
          newBehaviour.fromJson(behaviourJsonData);
          newBehaviour.parent = e.entity;
          e.entity.addBehaviour(newBehaviour);
        }
      });
      e.entity.fromJson(e);
    });
    return objects.map((e: any) => e.entity);
  }

  /**
    Links parent and child transforms based on their UUIDs.
    
   * @param {{ [key: string]: Transform }} transforms - A map of all instantiated transforms.
   * @param {any} entities - An array of raw entity data.
   * @returns {void}
   */
  static prepareTransforms(transforms: { [key: string]: Transform }, entities: any): void {
    for (const ent of entities) {
      if (ent.transform.parent) {
        ent.entity.transform.setParent(transforms[ent.transform.parent]);
      }
    }
  }

  /**
    Creates a snapshot of the current scene state in a serializable format.
    
   * @param {Scene} scene - The scene to snapshot.
   * @returns {JsonSerializedData} - A JSON data object representing the scene.
   */
  public static creatSceneSnapshot(scene: Scene): JsonSerializedData {
    return scene.toJsonObject();
  }
}