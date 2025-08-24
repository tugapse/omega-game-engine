import { MeshData } from "../core/mesh";
import { Scene } from "./scene";
export class SceneManager {
    static addDependency(className, func) {
        SceneManager.dependecies[className] = func;
    }
    static instanciateObjectFromJsonData(className, args) {
        if (this.dependecies[className]) {
            if (args && args.length > 0) {
                return this.dependecies[className](...args);
            }
            else {
                return this.dependecies[className]();
            }
        }
        else {
            console.warn("[WANR] Class Object not found! Implement Class instancing for: ", className);
        }
        return null;
    }
    static loadScene(gl, jsonData, scene) {
        scene = scene || new Scene();
        const { meshMaps, lights, objects } = jsonData;
        const meshes = SceneManager.instaciateSceneMeshes(meshMaps);
        jsonData['objects'] = SceneManager.instaciateSceneObjects(scene, objects, meshes, gl);
        scene.fromJson(jsonData);
        return scene;
    }
    static instaciateSceneMeshes(meshMaps) {
        const meshes = {};
        for (const data of Object.values(meshMaps)) {
            const mData = new MeshData([]);
            mData.fromJson(data);
            meshes[data['uuid']] = mData;
        }
        return meshes;
    }
    static instaciateSceneObjects(scene, objects, meshes, gl) {
        const transforms = {};
        const entities = objects.map((e) => {
            e['entity'] = SceneManager.instanciateObjectFromJsonData(e.type);
            const enTransform = e['entity'].transform;
            enTransform.fromJson(e['transform']);
            transforms[enTransform.uuid] = enTransform;
            return e;
        });
        this.prepareTransforms(transforms, entities);
        objects.forEach((e) => {
            e.entity.scene = scene;
            e.behaviours.forEach((behaviourJsonData) => {
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
        return objects.map((e) => e.entity);
    }
    static prepareTransforms(transforms, entities) {
        for (const ent of entities) {
            if (ent.transform.parent) {
                ent.entity.transform.setParent(transforms[ent.transform.parent]);
            }
        }
    }
    static creatSceneSnapshot(scene) {
        return scene.toJsonObject();
    }
}
SceneManager.dependecies = {};
