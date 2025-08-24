import { vec3, vec4 } from "gl-matrix";
import { JsonSerializable } from "../interfaces/json-serializable";
export class Color extends JsonSerializable {
    static createFromJsonData(jsonData) {
        const color = new Color();
        color.fromJson(jsonData);
        return color;
    }
    // getters
    get r() { return this.vector[0]; }
    get g() { return this.vector[1]; }
    get b() { return this.vector[2]; }
    get a() { return this.vector[3]; }
    // setters
    set g(value) { this.vector[1] = value; }
    set r(value) { this.vector[0] = value; }
    set b(value) { this.vector[2] = value; }
    set a(value) { this.vector[3] = value; }
    constructor(r = 1, g = 1, b = 1, a = 1) {
        super();
        this.vector = vec4.fromValues(r, g, b, a);
    }
    toJsonObject() {
        return {
            ...super.toJsonObject(),
            r: this.r,
            g: this.g,
            b: this.b,
            a: this.a
        };
    }
    fromJson(jsonObject) {
        this.r = jsonObject['r'];
        this.g = jsonObject['g'];
        this.b = jsonObject['b'];
        this.a = jsonObject['b'];
    }
    toVec3() {
        return vec3.fromValues(this.r, this.g, this.b);
    }
    toVec4() {
        return this.vector;
    }
}
