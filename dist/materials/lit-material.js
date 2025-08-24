import { UnlitMaterial } from "./unlit-material";
export class LitMaterial extends UnlitMaterial {
    constructor() {
        super(...arguments);
        this.normalTexUrl = "";
        this.specularStrength = 1.0;
        this.roughness = 0.2;
        this.normalMapStrength = 0.2;
    }
    toJsonObject() {
        return {
            ...super.toJsonObject(),
            normalTexUrl: this.normalTexUrl,
            specularStrength: this.specularStrength,
            roughness: this.roughness,
            normalMapStrength: this.normalMapStrength
        };
    }
    fromJson(jsonObject) {
        super.fromJson(jsonObject);
        this.normalTexUrl = jsonObject['normalTexUrl'];
        this.roughness = jsonObject['roughness'];
        this.normalMapStrength = jsonObject['normalMapStrength'];
    }
    static instanciate() {
        return new LitMaterial();
    }
}
