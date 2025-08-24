import { JsonSerializable } from "../interfaces/json-serializable";
export class EntityBehaviour extends JsonSerializable {
    static instanciate(args) { }
    get transform() { return this.parent.transform; }
    constructor() {
        super();
        this.active = true;
        this._initialized = false;
    }
    initialize() { return this._initialized = true; }
    update(ellapsed) { }
    updateEditor(ellapsed) { }
    draw() { }
    destroy() { }
    toJsonObject() {
        return {
            ...super.toJsonObject(),
            active: this.active
        };
    }
    fromJson(jsonObject) {
        this.active = jsonObject['active'];
    }
    clone() { return null; }
}
