import { v4 as uuidv4 } from 'uuid';
import { Transform } from "../core/transform";
import { EntityType } from '../enums/entity-type';
import { JsonSerializable } from '../interfaces/json-serializable';
export class GlEntity extends JsonSerializable {
    static instanciate(name = "Entity", transform) {
        return new GlEntity(name, transform);
    }
    get uuid() {
        return this._uuid;
    }
    ;
    constructor(name, transform = new Transform()) {
        super();
        this.name = name;
        this.transform = transform;
        this.destroyed = false;
        this.active = true;
        this.show = true;
        this.tag = "Entity";
        this.updateInEditor = false;
        this.behaviours = [];
        this.entityType = EntityType.STATIC;
        this._uuid = uuidv4();
    }
    initialize() {
        for (const behaviour of this.behaviours) {
            behaviour.initialize();
        }
        this.destroyed = false;
    }
    update(ellapsed) {
        if (!this.active)
            return;
        this.transform.updateMatrices();
        for (const behaviour of this.behaviours) {
            behaviour.update(ellapsed);
        }
    }
    draw() {
        if (!this.active)
            return;
        for (const behaviour of this.behaviours) {
            behaviour.draw();
        }
    }
    destroy() {
        for (const behaviour of this.behaviours) {
            behaviour.destroy();
        }
        this.destroyed = true;
    }
    addBehaviour(behaviour) {
        behaviour.parent = this;
        behaviour.initialize();
        this.behaviours.push(behaviour);
    }
    removeBehaviour(behaviour) {
        var _a;
        const index = this.behaviours.indexOf(behaviour);
        if (index >= 0) {
            const beToremove = this.behaviours.splice(index, 1);
            (_a = beToremove[0]) === null || _a === void 0 ? void 0 : _a.destroy();
        }
    }
    /**
    * Retrieves behaviours of a specific type from the collection.
    * T must be a type that extends EntityBehaviour.
    * @param constructor The constructor function of the type to filter by.
    * @returns An array of behaviours of the specified type.
    */
    getBehaviours(constructor) {
        return this.behaviours.filter((o) => o instanceof constructor);
    }
    /**
  * Retrieves behaviours of a specific type from the collection.
  * T must be a type that extends EntityBehaviour.
  * @param constructor The constructor function of the type to filter by.
  * @returns An array of behaviours of the specified type.
  */
    getBehaviour(constructor) {
        return this.behaviours.find((o) => o instanceof constructor);
    }
    fromJson(jsonObject) {
        if (jsonObject['type'] != this.constructor.name)
            return;
        this.name = jsonObject['name'];
        this.entityType = jsonObject['entityType'];
        this._uuid = jsonObject['uuid'] || uuidv4();
        this.active = jsonObject['active'];
        this.show = jsonObject['show'];
        this.tag = jsonObject['tag'];
        this.updateInEditor = jsonObject['updateInEditor'];
        this.transform.fromJson(jsonObject['transform']);
    }
    toJsonObject() {
        const result = {
            ...super.toJsonObject(),
            uuid: this.uuid,
            entityType: this.entityType,
            type: this.constructor.name,
            active: this.active,
            show: this.show,
            name: this.name,
            tag: this.tag,
            transform: this.transform.toJsonObject(),
            updateInEditor: this.updateInEditor,
            behaviours: this.behaviours.map(e => e.toJsonObject())
        };
        return result;
    }
    clone() {
        const newEntity = GlEntity.instanciate(this.name, this.transform);
        newEntity.fromJson(this.toJsonObject());
        return newEntity;
    }
}
