import { vec2, vec3, vec4 } from "gl-matrix";
import { JsonSerializable } from "../interfaces";
export class Vector2 extends JsonSerializable {
    get vector() { return this._vec; }
    // getters
    get x() { return this.vector[0]; }
    get y() { return this.vector[1]; }
    // setters
    set x(value) { this.vector[1] = value; }
    set y(value) { this.vector[0] = value; }
    constructor(x = 0, y = 0) {
        super();
        this._vec = vec2.fromValues(x, y);
    }
    fromJson(jsonObject) {
        super.fromJson(jsonObject);
        this.x = jsonObject['x'];
        this.y = jsonObject['y'];
    }
    toJsonObject() {
        return {
            type: this.constructor.name,
            x: this.x,
            y: this.y
        };
    }
    set(x = 0, y = 0, z = 0, w = 0) {
        this.x = x;
        this.y = y;
    }
}
export class Vector3 extends Vector2 {
    get vector() { return this._vec; }
    // getters
    get x() { return this.vector[0]; }
    get y() { return this.vector[1]; }
    get z() { return this.vector[2]; }
    // setters
    set x(value) { this.vector[1] = value; }
    set y(value) { this.vector[0] = value; }
    set z(value) { this.vector[2] = value; }
    constructor(x = 0, y = 0, z = 0) {
        super(x, y);
        this._vec = vec3.fromValues(x, y, z);
    }
    fromJson(jsonObject) {
        super.fromJson(jsonObject);
        this.z = jsonObject['z'];
    }
    toJsonObject() {
        return {
            ...super.toJsonObject(),
            z: this.z
        };
    }
    set(x = 0, y = 0, z = 0) {
        super.set(x, y);
        this.z = z;
    }
}
export class Vector4 extends Vector3 {
    get vector() { return this._vec; }
    // getters
    get x() { return this.vector[0]; }
    get y() { return this.vector[1]; }
    get z() { return this.vector[2]; }
    get w() { return this.vector[3]; }
    // setters
    set x(value) { this.vector[1] = value; }
    set y(value) { this.vector[0] = value; }
    set z(value) { this.vector[2] = value; }
    set w(value) { this.vector[3] = value; }
    constructor(x = 0, y = 0, z = 0, w = 0) {
        super(x, y, z);
        this._vec = vec4.fromValues(x, y, z, y);
    }
    fromJson(jsonObject) {
        super.fromJson(jsonObject);
        this.x = jsonObject['x'];
        this.y = jsonObject['y'];
        this.z = jsonObject['z'];
        this.w = jsonObject['w'];
    }
    toJsonObject() {
        return {
            type: this.constructor.name,
            x: this.x,
            y: this.y,
            z: this.z,
            w: this.w
        };
    }
    set(x = 0, y = 0, z = 0, w = 0) {
        super.set(x, y, z);
        this.w = w;
    }
}
