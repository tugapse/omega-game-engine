import { vec3, mat4, quat } from 'gl-matrix';
import { v4 as uuidv4 } from 'uuid';
import { JsonSerializable } from './json-serializable';
import { JsonSerializedData } from '../interfaces/json-serialized-data.interface';

/**
  A helper function to convert a quaternion to Euler angles in radians.
 * This function handles Gimbal lock cases and ensures a consistent conversion.
 * @param {vec3} out - The vector to store the resulting Euler angles (in radians).
 * @param {quat} q - The source quaternion.
 */
function toEuler(out: vec3, q: quat): void {
  const x = q[0],
    y = q[1],
    z = q[2],
    w = q[3];
  const x2 = x * x,
    y2 = y * y,
    z2 = z * z;
  const unit = x2 + y2 + z2 + w * w;
  const test = x * w - y * z;

  if (test > 0.4995 * unit) {
    out[0] = Math.PI / 2;
    out[1] = 2 * Math.atan2(y, w);
    out[2] = 0;
  } else if (test < -0.4995 * unit) {
    out[0] = -Math.PI / 2;
    out[1] = -2 * Math.atan2(y, w);
    out[2] = 0;
  } else {
    out[0] = Math.asin(2 * (w * x - y * z));
    out[1] = Math.atan2(2 * w * y + 2 * z * x, 1 - 2 * (x2 + y2));
    out[2] = Math.atan2(2 * w * z + 2 * x * y, 1 - 2 * (z2 + y2));
  }
}

/**
  Represents the position, rotation, and scale of an object in 3D space.
 * It manages local and world matrices and a hierarchy with a parent and children.
 * @augments {JsonSerializable}
 */
export class Transform extends JsonSerializable {

  public static get className() { return "Transform"; }

  /**
    The local position of the transform.
   * @private
   * @type {vec3}
   */
  private _position!: vec3;
  /**
    The rotation of the transform in degrees.
   * @private
   * @type {vec3}
   */
  private _rotationInDegrees!: vec3;
  /**
    The rotation of the transform as a quaternion.
   * @private
   * @type {quat}
   */
  private _rotation!: quat;
  /**
    The local scale of the transform.
   * @private
   * @type {vec3}
   */
  private _scale!: vec3;

  /**
    The world-space model matrix.
   * @private
   * @type {mat4}
   */
  private _modelMatrix!: mat4;
  /**
    The local-space matrix relative to its parent.
   * @private
   * @type {mat4}
   */
  private _localMatrix!: mat4;
  /**
    The parent transform in the hierarchy.
   * @private
   * @type {Transform | null}
   */
  private _parent: Transform | null = null;
  /**
    An array of child transforms.
   * @private
   * @type {Transform[]}
   */
  private _children: Transform[] = [];

  /**
    A flag to indicate if the matrices need to be re-calculated.
   * @private
   * @type {boolean}
   */
  private _dirty: boolean = true;

  /**
    Creates an instance of Transform.
   */
  constructor() {
    super("Transform");
    this._position = vec3.create();
    this._rotation = quat.create();
    this._rotationInDegrees = vec3.create();
    this._scale = vec3.fromValues(1, 1, 1);
    this._modelMatrix = mat4.create();
    this._localMatrix = mat4.create();
    this._uuid = uuidv4();
    this._dirty = true;
  }

  /**
    Gets the world-space model matrix.
   * @type {mat4}
   */
  public get modelMatrix(): mat4 {
    return this._modelMatrix;
  }
  /**
    Gets the local position.
   * @type {vec3}
   */
  public get position(): vec3 {
    return this._position;
  }
  /**
    Gets the rotation in degrees.
   * @type {vec3}
   */
  public get rotation(): vec3 {
    return this._rotationInDegrees;
  }
  /**
    Gets the rotation as a quaternion.
   * @type {quat}
   */
  public get rotationInRadians(): quat {
    return this._rotation;
  }
  /**
    Gets the local scale.
   * @type {vec3}
   */
  public get localScale(): vec3 {
    return this._scale;
  }
  /**
    Gets the parent transform.
   * @type {Transform | null}
   */
  public get parent(): Transform | null {
    return this._parent;
  }

  /**
    Sets the local position of the transform.
   * @param {number} [x=0] - The x-coordinate.
   * @param {number} [y=0] - The y-coordinate.
   * @param {number} [z=0] - The z-coordinate.
   * @returns {void}
   */
  public setPosition(x: number = 0, y: number = 0, z: number = 0): void {
    vec3.set(this._position, x, y, z);
    this._dirty = true;
  }

  /**
    Sets the rotation of the transform using Euler angles in degrees.
   * @param {number} [xDegrees=0] - The rotation around the x-axis in degrees.
   * @param {number} [yDegrees=0] - The rotation around the y-axis in degrees.
   * @param {number} [zDegrees=0] - The rotation around the z-axis in degrees.
   * @returns {void}
   */
  public setRotation(xDegrees: number = 0, yDegrees: number = 0, zDegrees: number = 0): void {
    vec3.set(this._rotationInDegrees, xDegrees, yDegrees, zDegrees);
    quat.fromEuler(this._rotation, xDegrees, yDegrees, zDegrees);
    this._dirty = true;
  }

  /**
    Sets the local scale of the transform.
   * @param {number} [x=1] - The scale factor for the x-axis.
   * @param {number} [y=1] - The scale factor for the y-axis.
   * @param {number} [z=1] - The scale factor for the z-axis.
   * @returns {void}
   */
  public setScale(x: number = 1, y: number = 1, z: number = 1): void {
    vec3.set(this._scale, x, y, z);
    this._dirty = true;
  }

  /**
    Translates the transform by a given vector.
   * @param {number} [x=0] - The x-component of the translation vector.
   * @param {number} [y=0] - The y-component of the translation vector.
   * @param {number} [z=0] - The z-component of the translation vector.
   * @returns {void}
   */
  public translate(x: number = 0, y: number = 0, z: number = 0): void {
    vec3.add(this._position, this._position, vec3.fromValues(x, y, z));
    this._dirty = true;
  }

  /**
    Rotates the transform by a given amount of Euler angles in degrees.
   * @param {number} [xDegrees=0] - The rotation around the x-axis in degrees.
   * @param {number} [yDegrees=0] - The rotation around the y-axis in degrees.
   * @param {number} [zDegrees=0] - The rotation around the z-axis in degrees.
   * @returns {void}
   */
  public rotate(xDegrees: number = 0, yDegrees: number = 0, zDegrees: number = 0): void {
    vec3.add(this._rotationInDegrees, this._rotationInDegrees, vec3.fromValues(xDegrees, yDegrees, zDegrees));
    const rotationToAdd = quat.create();
    quat.fromEuler(rotationToAdd, xDegrees, yDegrees, zDegrees);
    quat.multiply(this._rotation, this._rotation, rotationToAdd);
    this._dirty = true;
  }

  /**
    Scales the transform by a given amount.
   * @param {number} [x=1] - The scale factor for the x-axis.
   * @param {number} [y=1] - The scale factor for the y-axis.
   * @param {number} [z=1] - The scale factor for the z-axis.
   * @returns {void}
   */
  public scale(x: number = 1, y: number = 1, z: number = 1): void {
    vec3.multiply(this._scale, this._scale, vec3.fromValues(x, y, z));
    this._dirty = true;
  }

  /**
    Updates the local and world matrices based on the current position, rotation, and scale.
   * This method is recursive and updates all child transforms.
   * @returns {void}
   */
  public updateMatrices(): void {
    if (this._dirty) {
      mat4.fromRotationTranslationScale(this._localMatrix, this._rotation, this._position, this._scale);
      if (this._parent) {
        mat4.multiply(this._modelMatrix, this._parent.modelMatrix, this._localMatrix);
      } else {
        mat4.copy(this._modelMatrix, this._localMatrix);
      }
      this._dirty = false;
    }
    for (const child of this._children) {
      child.updateMatrices();
    }
  }

  /**
    Sets the parent of the transform, managing the hierarchy.
   * @param {Transform | null} parent - The new parent transform, or null to remove the parent.
   * @returns {void}
   */
  public setParent(parent: Transform | null): void {
    if (this._parent) {
      const index = this._parent._children.indexOf(this);
      if (index > -1) {
        this._parent._children.splice(index, 1);
      }
    }
    this._parent = parent;
    if (this._parent) {
      this._parent._children.push(this);
    }
    this._dirty = true;
  }

  /**
    Gets the right direction vector from the world matrix.
   * @type {vec3}
   */
  public get right(): vec3 {
    return vec3.fromValues(this._modelMatrix[0], this._modelMatrix[1], this._modelMatrix[2]);
  }
  /**
    Gets the left direction vector from the world matrix.
   * @type {vec3}
   */
  public get left(): vec3 {
    return vec3.negate(vec3.create(), this.right);
  }
  /**
    Gets the up direction vector from the world matrix.
   * @type {vec3}
   */
  public get up(): vec3 {
    return vec3.fromValues(this._modelMatrix[4], this._modelMatrix[5], this._modelMatrix[6]);
  }
  /**
    Gets the down direction vector from the world matrix.
   * @type {vec3}
   */
  public get down(): vec3 {
    return vec3.negate(vec3.create(), this.up);
  }
  /**
    Gets the forward direction vector from the world matrix.
   * @type {vec3}
   */
  public get forward(): vec3 {
    return vec3.fromValues(this._modelMatrix[8], this._modelMatrix[9], this._modelMatrix[10]);
  }
  /**
    Gets the back direction vector from the world matrix.
   * @type {vec3}
   */
  public get back(): vec3 {
    return vec3.negate(vec3.create(), this.forward);
  }

  /**
    Orients the transform to look at a specific target point in world space.
   * @param {vec3} target - The target position to look at.
   * @param {vec3} [worldUp] - An optional vector indicating the world's up direction.
   * @returns {void}
   */
  public lookAt(target: vec3, worldUp?: vec3): void {
    const defaultWorldUp = vec3.fromValues(0, 1, 0);
    const effectiveUp = worldUp || defaultWorldUp;
    const tempViewMatrix = mat4.create();
    mat4.lookAt(tempViewMatrix, this._position, target, effectiveUp);
    const tempModelMatrix = mat4.create();
    mat4.invert(tempModelMatrix, tempViewMatrix);
    mat4.getRotation(this._rotation, tempModelMatrix);

    const flipQuat = quat.create();
    quat.fromEuler(flipQuat, 0, 180, 0);
    quat.multiply(this._rotation, this._rotation, flipQuat);

    const euler = vec3.create();
    toEuler(euler, this._rotation);
    vec3.scale(this._rotationInDegrees, euler, 180 / Math.PI);
    this._dirty = true;
  }

  /**
    Serializes the transform's state to a JSON object.
   * @override
   * @returns {JsonSerializedData} - The JSON object representation.
   */
  public override toJsonObject(): JsonSerializedData {
    return {
      ...super.toJsonObject(),
      uuid: this.uuid,
      parent: this.parent?.uuid,
      position: [this._position[0], this._position[1], this._position[2]],
      rotation: [this._rotationInDegrees[0], this._rotationInDegrees[1], this._rotationInDegrees[2]],
      scale: [this._scale[0], this._scale[1], this._scale[2]],
    };
  }

  /**
    Deserializes the transform's state from a JSON object.
   * @override
   * @param {JsonSerializedData} jsonObject - The JSON object to deserialize from.
   * @returns {void}
   */
  public override fromJson(jsonObject: JsonSerializedData): void {
    this._uuid = jsonObject['uuid'];
    this.setPosition(jsonObject['position'][0], jsonObject['position'][1], jsonObject['position'][2]);
    this.setRotation(jsonObject['rotation'][0], jsonObject['rotation'][1], jsonObject['rotation'][2]);
    this.setScale(jsonObject['scale'][0], jsonObject['scale'][1], jsonObject['scale'][2]);
    this._dirty = true;
  }

  /**
    Rotates the transform by a given quaternion.
   * @param {quat} q - The quaternion to rotate by.
   * @returns {void}
   */
  public rotateByQuat(q: quat): void {
    quat.multiply(this._rotation, q, this._rotation);
    const euler = vec3.create();
    toEuler(euler, this._rotation);
    vec3.scale(this._rotationInDegrees, euler, 180 / Math.PI);
    this._dirty = true;
  }

  /**
    Sets the dirty flag of the transform, forcing a matrix recalculation.
   * @param {boolean} dirty - The new state of the dirty flag.
   * @returns {void}
   */
  public setDirty(dirty: boolean): void {
    this._dirty = dirty;
  }

  /**
    Provides a clone of the internal rotation quaternion.
   * @type {quat}
   */
  public get rotationQuat(): quat {
    return quat.clone(this._rotation);
  }

  /**
    Sets the internal rotation quaternion and updates the Euler angles and dirty flag.
   * @param {quat} newRotation - The new rotation quaternion.
   * @returns {void}
   */
  public setRotationQuat(newRotation: quat): void {
    quat.copy(this._rotation, newRotation);
    const euler = vec3.create();
    toEuler(euler, this._rotation);
    vec3.scale(this._rotationInDegrees, euler, 180 / Math.PI);
    this._dirty = true;
  }
}