import { vec3 } from "gl-matrix";
import { RenderMeshBehaviour } from "../behaviours/renderer/render-mesh-behaviour";
import { EntityType } from "../enums/entity-type";
import { Camera } from "./camera";
import { GlEntity } from "./entity";
import { Light } from "./light";
export class Scene extends GlEntity {
    static get currentScene() { return this._currentScene; }
    get objects() { return this._objects; }
    get lights() { return this._objects.filter(o => o instanceof Light); }
    constructor() {
        super("Scene");
        this.isRunning = false;
        this.color = vec3.fromValues(0.2, 1, 0.2);
        this.tag = "Scene";
        this.entityType = EntityType.SCENE;
        this.ellapsedTime = 0;
        this._objects = [];
        !Scene._currentScene && (Scene._currentScene = this);
    }
    initialize() {
        for (const object of this.objects) {
            object.initialize();
        }
        super.initialize();
    }
    update(ellapsed) {
        if (this.destroyed)
            return;
        Camera.mainCamera.update(ellapsed);
        if (!this.isRunning)
            return;
        this.ellapsedTime += ellapsed;
        super.update(ellapsed);
        for (const object of this.objects.filter(e => e.active)) {
            object.update(ellapsed);
        }
    }
    draw() {
        if (this.destroyed)
            return;
        if (!this.gl || !Camera.mainCamera)
            return;
        this.gl.clearColor(this.color[0], Math.sin(this.ellapsedTime) * this.color[1], this.color[2], 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        for (const object of this.objects.filter(e => e.active && e.show)) {
            object.draw();
        }
        super.draw();
    }
    addEntity(entity) {
        if (this.destroyed)
            return;
        entity.scene = this;
        this._objects.push(entity);
        entity.initialize();
    }
    setGlRenderingContext(gl) {
        this.gl = gl;
        this.behaviours.forEach(b => {
            if (b instanceof RenderMeshBehaviour) {
                const beh = b;
                beh.gl = gl;
            }
        });
    }
    destroy() {
        for (const child of this.lights) {
            child.destroy();
        }
        for (const child of this.objects) {
            child.destroy();
        }
        this._objects = [];
        super.destroy();
    }
    fromJson(jsonObject) {
        super.fromJson(jsonObject);
        for (const entity of jsonObject['objects']) {
            this.addEntity(entity);
        }
    }
    toJsonObject() {
        const meshMaps = {};
        const renderers = this.objects.filter(e => e.getBehaviour(RenderMeshBehaviour)).map(o => o.getBehaviour(RenderMeshBehaviour));
        for (const renderer of renderers) {
            if (renderer.mesh)
                meshMaps[renderer.mesh.meshData.uuid] = renderer.mesh.meshData.toJsonObject();
            else {
                console.debug("No mesh for renderer", renderer);
            }
        }
        return {
            ...super.toJsonObject(),
            objects: this.objects.map(o => o.toJsonObject()),
            meshMaps: meshMaps,
        };
    }
    setCurrent() {
        Scene._currentScene = this;
    }
    getEntitieByName(name) {
        return this.objects.find(o => o.name == name);
    }
    getEntitieByUuid(uuid) {
        return this.objects.find(o => o.uuid == uuid);
    }
    getEntitiesByTag(tag) {
        return this.objects.filter(o => o.tag == tag);
    }
    /**
      * Retrieves entities of a specific type from the collection.
      * T must be a type that extends GLEntity.
      * @param constructor The constructor function of the type to filter by (e.g., GLErrorEntity).
      * @returns An array of entities of the specified type.
      */
    getEntities(constructor) {
        return this._objects.filter((o) => o instanceof constructor);
    }
}
