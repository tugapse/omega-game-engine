import { vec2, vec3, vec4 } from "gl-matrix";
import { JsonSerializable, JsonSerializedData } from "../interfaces";

export class Vector2 extends JsonSerializable {
    protected _vec: vec2;

    public get vector(): vec2 { return this._vec; }

    // getters
    public get x() { return this.vector[0]; }
    public get y() { return this.vector[1]; }

    // setters
    public set x(value: number) { this.vector[1] = value; }
    public set y(value: number) { this.vector[0] = value; }

    constructor(x: number = 0, y: number = 0) {
        super();
        this._vec = vec2.fromValues(x, y);
    }

    override fromJson(jsonObject: JsonSerializedData): void {
        super.fromJson(jsonObject);
        this.x = jsonObject['x'];
        this.y = jsonObject['y'];
    }

    override toJsonObject(): JsonSerializedData {
        return {
            type: this.constructor.name,
            x: this.x,
            y: this.y
        }
    }

    set(x: number = 0, y: number = 0, z: number = 0, w: number = 0): void {
        this.x = x;
        this.y = y;
    }
}


export class Vector3 extends Vector2 {
    protected _vec: vec3;

    public get vector(): vec3 { return this._vec; }

    // getters
    public get x() { return this.vector[0]; }
    public get y() { return this.vector[1]; }
    public get z() { return this.vector[2]; }

    // setters
    public set x(value: number) { this.vector[1] = value; }
    public set y(value: number) { this.vector[0] = value; }
    public set z(value: number) { this.vector[2] = value; }

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        super(x, y);
        this._vec = vec3.fromValues(x, y, z);
    }

    override fromJson(jsonObject: JsonSerializedData): void {
        super.fromJson(jsonObject);
        this.z = jsonObject['z'];
    }

    override toJsonObject(): JsonSerializedData {
        return {
            ...super.toJsonObject(),
            z: this.z
        }
    }

    override set(x: number = 0, y: number = 0, z: number = 0): void {
        super.set(x, y);
        this.z = z;
    }
}

export class Vector4 extends Vector3 {
    protected _vec: vec4;
    public get vector(): vec4 { return this._vec; }


    // getters
    public get x() { return this.vector[0]; }
    public get y() { return this.vector[1]; }
    public get z() { return this.vector[2]; }
    public get w() { return this.vector[3]; }
    // setters
    public set x(value: number) { this.vector[1] = value; }
    public set y(value: number) { this.vector[0] = value; }
    public set z(value: number) { this.vector[2] = value; }
    public set w(value: number) { this.vector[3] = value; }

    constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0) {
        super(x, y, z);
        this._vec = vec4.fromValues(x, y, z, y);
    }

    override fromJson(jsonObject: JsonSerializedData): void {
        super.fromJson(jsonObject);
        this.x = jsonObject['x'];
        this.y = jsonObject['y'];
        this.z = jsonObject['z'];
        this.w = jsonObject['w'];
    }

    override toJsonObject(): JsonSerializedData {
        return {
            type: this.constructor.name,
            x: this.x,
            y: this.y,
            z: this.z,
            w: this.w
        }
    }
    override set(x: number = 0, y: number = 0, z: number = 0, w: number = 0): void {
        super.set(x, y, z);
        this.w = w;
    }
}