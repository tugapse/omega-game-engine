import { mat4, quat, vec3 } from 'gl-matrix';
import { v4 as uuidv4 } from 'uuid';
import { SceneEntity } from '../entities';
import { JsonSerializedData } from '../interfaces/json-serialized-data';
import { JsonSerializable } from './json-serializable';
import { Vector3 } from './vector';

/**
 * A helper function to convert a quaternion to Euler angles in radians.
 */
/**
 * Euler angles (radians) of a rotation, in the order `quat.fromEuler` uses by
 * default (gl-matrix "zyx": q = qz * qy * qx), so that
 * `setLocalRotation(toEuler(q))` gives back `q`.
 */
function toEuler(out: vec3, q: quat): void {
  const x = q[0],
    y = q[1],
    z = q[2],
    w = q[3];
  const sinPitch = Math.max(-1, Math.min(1, 2 * (w * y - z * x)));
  out[0] = Math.atan2(2 * (w * x + y * z), 1 - 2 * (x * x + y * y));
  out[1] = Math.asin(sinPitch);
  out[2] = Math.atan2(2 * (w * z + x * y), 1 - 2 * (y * y + z * z));
}


export class Transform extends JsonSerializable {
  public static get className() {
    return 'Transform';
  }

  private _position: vec3;
  private _rotationInDegrees: vec3;
  private _rotation: quat;
  private _scale: vec3;

  private _modelMatrix: mat4;
  private _localMatrix: mat4;

  private _parent: Transform | null = null;
  private _children: Transform[] = [];
  private _dirty: boolean = true;

  public parentEntity: SceneEntity | null = null;

  constructor() {
    super('Transform');
    this._position = vec3.create();
    this._rotation = quat.create();
    this._rotationInDegrees = vec3.create();
    this._scale = vec3.fromValues(1, 1, 1);
    this._modelMatrix = mat4.create();
    this._localMatrix = mat4.create();
    this._uuid = uuidv4();
    this._dirty = true;
  }

  public get modelMatrix(): mat4 {
    return this.current;
  }

  /**
   * The model matrix, recomputed first when the transform changed since the
   * last update. Entities that are never drawn (cameras, lights in edit mode)
   * are not updated every frame, and their position, directions and lookAt
   * must still be right.
   */
  private get current(): mat4 {
    if (this._dirty) this.updateMatrices();
    return this._modelMatrix;
  }

  // --- Local Space ---
  public get localPosition(): vec3 {
    return this._position;
  }
  public get localRotation(): vec3 {
    return this._rotationInDegrees;
  }
  public get localRotationQuat(): quat {
    return this._rotation;
  }
  public get localScale(): vec3 {
    return this._scale;
  }

  // --- World Space Getters/Setters ---
  public get worldPosition(): vec3 {
    const out = vec3.create();
    mat4.getTranslation(out, this.current);
    return out;
  }

  public set worldPosition(newWorldPosition: vec3) {
    if (this._parent) {
      const invParentWorld = mat4.create();
      mat4.invert(invParentWorld, this._parent.modelMatrix);
      vec3.transformMat4(this._position, newWorldPosition, invParentWorld);
    } else {
      vec3.copy(this._position, newWorldPosition);
    }
    this._dirty = true;
  }

  public get worldRotationQuat(): quat {
    const out = quat.create();
    mat4.getRotation(out, this.current);
    return out;
  }

  public set worldRotationQuat(newWorldRotation: quat) {
    if (this._parent) {
      const invParentWorldRot = quat.create();
      quat.invert(invParentWorldRot, this._parent.worldRotationQuat);
      quat.multiply(this._rotation, invParentWorldRot, newWorldRotation);
    } else {
      quat.copy(this._rotation, newWorldRotation);
    }
    quat.normalize(this._rotation, this._rotation);
    this.updateEulerFromQuat();
    this._dirty = true;
  }

  public get worldRotation(): vec3 {
    const euler = vec3.create();
    toEuler(euler, this.worldRotationQuat);
    vec3.scale(euler, euler, 180 / Math.PI);
    return euler;
  }

  public set worldRotation(newWorldRotation: vec3) {
    const q = quat.create();
    quat.fromEuler(
      q,
      newWorldRotation[0],
      newWorldRotation[1],
      newWorldRotation[2],
    );
    this.worldRotationQuat = q;
  }

  public get worldScale(): vec3 {
    const out = vec3.create();
    mat4.getScaling(out, this.current);
    return out;
  }

  public set worldScale(newWorldScale: vec3) {
    if (this._parent) {
      const parentWorldScale = this._parent.worldScale;
      this._scale[0] = newWorldScale[0] / parentWorldScale[0];
      this._scale[1] = newWorldScale[1] / parentWorldScale[1];
      this._scale[2] = newWorldScale[2] / parentWorldScale[2];
    } else {
      vec3.copy(this._scale, newWorldScale);
    }
    this._dirty = true;
  }

  public get parent(): Transform | null {
    return this._parent;
  }

  /** The child transforms (read only: use `setParent` to change them). */
  public get children(): readonly Transform[] {
    return this._children;
  }

  // --- Mutators ---
  public setLocalPosition(x = 0, y = 0, z = 0): void {
    vec3.set(this._position, x, y, z);
    this._dirty = true;
  }

  public setLocalRotation(xDegrees = 0, yDegrees = 0, zDegrees = 0): void {
    vec3.set(this._rotationInDegrees, xDegrees, yDegrees, zDegrees);
    quat.fromEuler(this._rotation, xDegrees, yDegrees, zDegrees);
    this._dirty = true;
  }

  public setLocalScale(x = 1, y = 1, z = 1): void {
    vec3.set(this._scale, x, y, z);
    this._dirty = true;
  }

  public setWorldPosition(x = 0, y = 0, z = 0): void {
    this.worldPosition = vec3.fromValues(x, y, z);
  }

  public setWorldRotation(xDegrees = 0, yDegrees = 0, zDegrees = 0): void {
    this.worldRotation = vec3.fromValues(xDegrees, yDegrees, zDegrees);
  }

  public setWorldScale(x = 1, y = 1, z = 1): void {
    this.worldScale = vec3.fromValues(x, y, z);
  }

  public translate(x = 0, y = 0, z = 0): void {
    vec3.add(this._position, this._position, vec3.fromValues(x, y, z));
    this._dirty = true;
  }

  /** Rotates in local space by these Euler angles (degrees). */
  public rotate(xDegrees = 0, yDegrees = 0, zDegrees = 0): void {
    const rotationToAdd = quat.create();
    quat.fromEuler(rotationToAdd, xDegrees, yDegrees, zDegrees);
    quat.multiply(this._rotation, this._rotation, rotationToAdd);
    quat.normalize(this._rotation, this._rotation);
    // The saved angles come from the quaternion: adding the angles is only
    // right when rotating about a single axis.
    this.updateEulerFromQuat();
    this._dirty = true;
  }

  public scale(x = 1, y = 1, z = 1): void {
    vec3.multiply(this._scale, this._scale, vec3.fromValues(x, y, z));
    this._dirty = true;
  }

  public updateMatrices(): void {
    const changed = this._dirty;
    if (changed) {
      mat4.fromRotationTranslationScale(
        this._localMatrix,
        this._rotation,
        this._position,
        this._scale,
      );
      if (this._parent) {
        mat4.multiply(this._modelMatrix, this._parent.current, this._localMatrix);
      } else {
        mat4.copy(this._modelMatrix, this._localMatrix);
      }
      // Clean before the children run: they read this matrix through `current`.
      this._dirty = false;
    }
    for (const child of this._children) {
      child.setDirty(changed || child._dirty);
      child.updateMatrices();
    }
  }

  public setParent(parent: Transform | null): void {
    if (this._parent) {
      const index = this._parent._children.indexOf(this);
      if (index > -1) this._parent._children.splice(index, 1);
    }
    this._parent = parent;
    if (this._parent) this._parent._children.push(this);
    this._dirty = true;
  }

  public get right(): vec3 {
    const m = this.current;
    return vec3.fromValues(
      m[0],
      m[1],
      m[2],
    );
  }
  public get left(): vec3 {
    return vec3.negate(vec3.create(), this.right);
  }
  public get up(): vec3 {
    const m = this.current;
    return vec3.fromValues(
      m[4],
      m[5],
      m[6],
    );
  }
  public get down(): vec3 {
    return vec3.negate(vec3.create(), this.up);
  }
  public get forward(): vec3 {
    const m = this.current;
    return vec3.fromValues(
      m[8],
      m[9],
      m[10],
    );
  }
  public get back(): vec3 {
    return vec3.negate(vec3.create(), this.forward);
  }

  public lookAt(target: vec3 | Vector3, worldUp?: vec3 | Vector3): void {
    const targetVec3 = target instanceof Vector3 ? target.vector : target;
    const worldUpVec3 =
      worldUp instanceof Vector3
        ? worldUp.vector
        : worldUp || vec3.fromValues(0, 1, 0);
    const position = this.worldPosition;

    const zAxis = vec3.normalize(
      vec3.create(),
      vec3.sub(vec3.create(), targetVec3, position),
    );
    const xAxis = vec3.normalize(
      vec3.create(),
      vec3.cross(vec3.create(), worldUpVec3, zAxis),
    );
    const yAxis = vec3.cross(vec3.create(), zAxis, xAxis);

    const lookAtMatrix = mat4.fromValues(
      xAxis[0],
      xAxis[1],
      xAxis[2],
      0,
      yAxis[0],
      yAxis[1],
      yAxis[2],
      0,
      zAxis[0],
      zAxis[1],
      zAxis[2],
      0,
      position[0],
      position[1],
      position[2],
      1,
    );

    const worldRotation = quat.create();
    mat4.getRotation(worldRotation, lookAtMatrix);

    this.worldRotationQuat = worldRotation;
    this._dirty = true;
  }

  public override toJsonObject(): JsonSerializedData {
    return {
      ...super.toJsonObject(),
      uuid: this.uuid,
      parent: this.parent?.uuid,
      position: [
        this.localPosition[0],
        this.localPosition[1],
        this.localPosition[2],
      ],
      rotation: [
        this.localRotation[0],
        this.localRotation[1],
        this.localRotation[2],
      ],
      scale: [this.localScale[0], this.localScale[1], this.localScale[2]],
    };
  }

  public override fromJson(jsonObject: JsonSerializedData): void {
    super.fromJson(jsonObject);
    this.setLocalPosition(
      jsonObject['position'][0],
      jsonObject['position'][1],
      jsonObject['position'][2],
    );
    this.setLocalRotation(
      jsonObject['rotation'][0],
      jsonObject['rotation'][1],
      jsonObject['rotation'][2],
    );
    this.setLocalScale(
      jsonObject['scale'][0],
      jsonObject['scale'][1],
      jsonObject['scale'][2],
    );
    this._dirty = true;
  }

  public rotateByQuat(q: quat): void {
    quat.multiply(this._rotation, q, this._rotation);
    quat.normalize(this._rotation, this._rotation);
    this.updateEulerFromQuat();
    this._dirty = true;
  }

  public setDirty(dirty: boolean): void {
    this._dirty = dirty;
  }

  public setLocalRotationQuat(newRotation: quat): void {
    quat.copy(this._rotation, newRotation);
    quat.normalize(this._rotation, this._rotation);
    this.updateEulerFromQuat();
    this._dirty = true;
  }

  private updateEulerFromQuat(): void {
    const euler = vec3.create();
    toEuler(euler, this._rotation);
    vec3.scale(this._rotationInDegrees, euler, 180 / Math.PI);
  }

  public getEulerFromQuat(q: quat): vec3 {
    const eulerRadians = vec3.create();
    toEuler(eulerRadians, q);
    vec3.scale(eulerRadians, eulerRadians, 180 / Math.PI);
    return eulerRadians;
  }
}

Object.defineProperty(Transform.prototype, 'position', {
  get: function () {
    return this.localPosition;
  },
});
Object.defineProperty(Transform.prototype, 'rotation', {
  get: function () {
    return this.localRotation;
  },
});
Object.defineProperty(Transform.prototype, 'rotationQuat', {
  get: function () {
    return this.localRotationQuat;
  },
});
