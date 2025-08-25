import { Color } from "../core/color";
import { JsonSerializable } from "../interfaces/json-serializable";
export class ColorMaterial extends JsonSerializable {
    constructor() {
        super(...arguments);
        this.name = "Color Material";
        this.color = new Color();
    }
    static instanciate() { return new ColorMaterial(); }
    toJsonObject() {
        return {
            ...super.toJsonObject(),
            color: this.color.toJsonObject(),
        };
    }
    fromJson(jsonObject) {
        this.name = jsonObject['name'];
        this.color = Color.createFromJsonData(jsonObject['color']);
    }
}
