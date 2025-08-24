import { vec2 } from "gl-matrix";
import { ColorMaterial } from "./color-material";
export class UnlitMaterial extends ColorMaterial {
    constructor() {
        super(...arguments);
        this.mainTexUrl = "";
        this.uvScale = vec2.fromValues(1, 1);
        this.uvOffset = vec2.create();
    }
    toJsonObject() {
        return {
            ...super.toJsonObject(),
            mainTexUrl: this.mainTexUrl,
            uvScale: [...this.uvScale],
            uvOffset: [...this.uvOffset]
        };
    }
    fromJson(jsonObject) {
        super.fromJson(jsonObject);
        this.name = jsonObject['name'];
        this.mainTexUrl = jsonObject['mainTexUrl'];
        this.uvScale = jsonObject['uvScale'];
        this.uvOffset = jsonObject['uvOffset'];
    }
    static instanciate() {
        return new UnlitMaterial();
    }
}
