import { EntityBehaviour } from '../behaviours';
import { EngineCache, JsonSerializable } from '../core';
import { MeshData } from '../core/mesh';
import { ObjectInstanciator } from '../core/object-instanciator';
import { Transform } from '../core/transform';
import { JsonSerializedData } from '../interfaces/json-serialized-data';
import { CubemapTexture, Texture } from '../textures';
import { SceneEntity } from '../entities/entity';
import { Scene } from '../entities/scene';

/**
 * A static class responsible for managing the loading, instantiation, and serialization of scenes and their components.
 * It acts as the main entry point for converting a JSON representation of a scene into a live, interactive scene graph.
 */
export class SceneManager {
  /**
   * Asynchronously loads a scene from a JSON data object.
   * This method orchestrates the entire deserialization process, including instantiating meshes,
   * loading textures, creating entities, and attaching behaviors.
   *
   * @param gl - The WebGL2 rendering context.
   * @param jsonData - The JSON data representing the scene.
   * @param scene - An optional existing `Scene` instance to load into. If not provided, a new one is created.
   * @returns A promise that resolves with the loaded or newly created `Scene` instance.
   */
  public static async loadScene(
    gl: WebGL2RenderingContext,
    jsonData: JsonSerializedData,
    scene?: Scene,
  ): Promise<Scene> {
    EngineCache.clear();
    scene = scene || new Scene();
    scene.setGlRenderingContext(gl);

    const { meshMaps, objects, textureMaps } = jsonData;
    const meshes: { [key: string]: MeshData } =
      SceneManager.instaciateSceneMeshes(meshMaps);
    await SceneManager.instaciateAndLoadSceneTextures(textureMaps, gl);

    jsonData['objects'] = SceneManager.instaciateSceneObjects(
      scene,
      objects,
      meshes,
      gl,
    );
    scene.fromJson(jsonData);

    return scene;
  }

  /**
   * Asynchronously loads all textures defined in the scene's JSON data.
   * It handles both 2D textures and cubemaps, populating the `EngineCache`.
   * @param texturesMaps - The raw texture data from the JSON.
   * @param gl - The WebGL2 rendering context.
   * @private
   */
  private static async instaciateAndLoadSceneTextures(
    texturesMaps: any,
    gl: WebGL2RenderingContext,
  ): Promise<void> {
    for (const textureJsonData of Object.values(texturesMaps) as any[]) {
      if (textureJsonData.url) {
        await EngineCache.getTexture2D(textureJsonData.url, gl);
      } else if (textureJsonData.uris) {
        const keys = textureJsonData.uris;
        await EngineCache.getTextureCube(
          {
            right: keys[0],
            left: keys[1],
            up: keys[2],
            bottom: keys[3],
            front: keys[4],
            back: keys[5],
          },
          gl,
        );
      }
    }
  }
  /**
   * Instantiates all `MeshData` objects from the scene's JSON data.
   * @param meshMaps - The raw mesh data from the JSON.
   * @returns A map of mesh UUIDs to their corresponding `MeshData` instances.
   * @private
   */
  private static instaciateSceneMeshes(meshMaps: any): {
    [key: string]: MeshData;
  } {
    const meshes: { [key: string]: MeshData } = {};

    for (const data of Object.values(meshMaps) as any[]) {
      const mData = new MeshData([]);
      mData.fromJson(data);
      meshes[data['uuid']] = mData;
    }
    return meshes;
  }

  /**
   * Instantiates all entities and their behaviors from the scene's JSON data.
   * @param scene - The scene instance to which objects will belong.
   * @param objects - The raw entity data from the JSON.
   * @param meshes - A map of instantiated meshes, used to link renderers to their geometry.
   * @param gl - The WebGL2 rendering context.
   * @returns An array of the newly instantiated `SceneEntity` objects.
   * @private
   */
  private static instaciateSceneObjects(
    scene: Scene,
    objects: JsonSerializable[],
    meshes: { [key: string]: MeshData },
    gl: WebGL2RenderingContext,
  ): any[] {
    const instanciatedTransforms: { [key: string]: Transform } = {};

    objects.forEach((ob: JsonSerializable) => {
      this.instanciateEntity(ob, instanciatedTransforms);
      this.instanciateBehaviours(ob, scene, meshes, gl);
    });

    return objects.map((e: any) => e.entity);
  }

  /**
   * Links parent and child transforms based on their UUIDs to reconstruct the scene hierarchy.
   * @param transforms - A map of all instantiated transforms, indexed by their UUIDs.
   * @param entities - An array of raw entity data containing parent-child relationships.
   */
  static prepareTransforms(
    transforms: { [key: string]: Transform },
    entities: any,
  ): void {
    for (const ent of entities) {
      if (ent.transform.parent) {
        ent.entity.transform.setParent(transforms[ent.transform.parent]);
      }
    }
  }

  /**
   * Creates a snapshot of the current scene state in a serializable JSON format.
   * @param scene - The scene to snapshot.
   * @returns A JSON data object representing the entire scene.
   */
  public static creatSceneSnapshot(scene: Scene): JsonSerializedData {
    return scene.toJsonObject();
  }

  /**
   * Instantiates all behaviors for a given entity from the JSON data.
   * @param jsonObject - The JSON data for a single entity.
   * @param scene - The parent scene.
   * @param meshes - The map of available mesh data.
   * @param gl - The WebGL2 rendering context.
   * @private
   */
  private static instanciateBehaviours(
    jsonObject: JsonSerializedData,
    scene: Scene,
    meshes: { [key: string]: MeshData },
    gl: WebGL2RenderingContext,
  ) {
    jsonObject['entity'].scene = scene;
    jsonObject['entity'].behaviours = [];

    if (!jsonObject['behaviours']) {
      jsonObject['behaviours'] = [];
      console.debug('No behaviours found in scene JSON data', jsonObject);
      // throw new Error('No behaviours found in scene JSON data',jsonObject)
    }

    jsonObject['behaviours'].forEach((behaviourJsonData: any) => {
      if (behaviourJsonData.mesh) {
        behaviourJsonData['meshData'] =
          meshes[behaviourJsonData.mesh.meshDataId];
      }
      const newBehaviour =
        ObjectInstanciator.instanciateObjectFromJsonData<EntityBehaviour>(
          behaviourJsonData.className || behaviourJsonData.type,
          [gl],
        );
      if (newBehaviour) {
        // newBehaviour.parent = jsonObject["entity"];
        newBehaviour.fromJson(behaviourJsonData);
        jsonObject['entity'].addBehaviour(newBehaviour);
      }
    });
  }

  /**
   * Instantiates a single `SceneEntity` and its `Transform` from JSON data.
   * @param jsonObject - The JSON data for the entity.
   * @param instanciatedTransforms - A map to store the newly created transform for later hierarchy linking.
   * @private
   */
  private static instanciateEntity(
    jsonObject: JsonSerializedData,
    instanciatedTransforms: { [key: string]: Transform },
  ): void {
    const entity =
      ObjectInstanciator.instanciateObjectFromJsonData<SceneEntity>(
        jsonObject['className'],
      ) || new SceneEntity(jsonObject['name']);
    entity.fromJson(jsonObject);
    instanciatedTransforms[entity.transform.uuid] = entity.transform;
    jsonObject['entity'] = entity;
  }
}
