
import { mat4, quat, vec3 } from 'gl-matrix';
import { v4 as uuidv4 } from 'uuid';
import { SceneEntity } from '../entities';
import { JsonSerializedData } from '../interfaces/json-serialized-data';
import { JsonSerializable } from './json-serializable';
import { Vector3 } from './vector';

/**
 * A helper function to convert a quaternion to Euler angles in radians.
 * @param out - The `vec3` to store the resulting Euler angles.
 * @param q - The source `quat` to convert.
 * @private
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
 * Represents the position, rotation, and scale of an object in 3D space.
 * It handles hierarchical transformations (parent-child relationships) and calculates
 * the corresponding model matrix for rendering.
 *
 * @remarks
 * Transformations are calculated lazily. The model matrix and world-space properties
 * are only recomputed when they are accessed and the transform is marked as "dirty".
 *
 * @augments {JsonSerializable}
 */
export class Transform extends JsonSerializable {
  /** @inheritdoc */
  public static get className() {
    return 'Transform';
  }

  /** The local position relative to the parent transform. @private */
  private _position: vec3;
  /** The local rotation as Euler angles in degrees. @private */
  private _rotationInDegrees: vec3;
  /** The local rotation as a quaternion, relative to the parent transform. @private */
  private _rotation: quat;
  /** The local scale relative to the parent transform. @private */
  private _scale: vec3;

  /** The final model matrix that transforms from local to world space. @private */
  private _modelMatrix: mat4;
  /** The matrix representing only the local transformations. @private */
  private _localMatrix: mat4;

  /** The parent transform in the hierarchy. If null, this is a root transform. @private */
  private _parent: Transform | null = null;
  /** The list of child transforms. @private */
  private _children: Transform[] = [];
  /** A flag indicating if the transform's properties have changed and matrices need to be recalculated. @private */
  private _dirty: boolean = true;

  /** A reference to the entity that owns this transform. */
  public parentEntity: SceneEntity | null = null;

  /**
   * Creates an instance of Transform.
   * Initializes with default position (0,0,0), rotation (0,0,0), and scale (1,1,1).
   */
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

  /**
   * Gets the final model matrix that transforms from this object's local space to world space.
   * The matrix is updated if the transform is dirty.
   */
  public get modelMatrix(): mat4 {
    return this._modelMatrix;
  }

  // --- Local Space ---
  /** Gets the local position of the transform, relative to its parent. */
  public get localPosition(): vec3 {
    return this._position;
  }
  /** Gets the local rotation of the transform as Euler angles (in degrees), relative to its parent. */
  public get localRotation(): vec3 {
    return this._rotationInDegrees;
  }
  /** Gets the local rotation of the transform as a quaternion, relative to its parent. */
  public get localRotationQuat(): quat {
    return this._rotation;
  }
  /** Gets the local scale of the transform, relative to its parent. */
  public get localScale(): vec3 {
    return this._scale;
  }

  // --- World Space Getters/Setters ---
  /**
   * Gets the world-space position of the transform.
   * @returns A new `vec3` representing the world position.
   */
  public get worldPosition(): vec3 {
    const out = vec3.create();
    mat4.getTranslation(out, this._modelMatrix);
    return out;
  }

  /**
   * Sets the world-space position of the transform.
   * This will calculate the appropriate local position based on the parent's transform.
   * @param newWorldPosition - The desired new world position.
   */
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

  /**
   * Gets the world-space rotation of the transform as a quaternion.
   * @returns A new `quat` representing the world rotation.
   */
  public get worldRotationQuat(): quat {
    const out = quat.create();
    mat4.getRotation(out, this._modelMatrix);
    return out;
  }

  /**
   * Sets the world-space rotation of the transform using a quaternion.
   * This will calculate the appropriate local rotation based on the parent's transform.
   * @param newWorldRotation - The desired new world rotation quaternion.
   */
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

  /**
   * Gets the world-space rotation of the transform as Euler angles (in degrees).
   * @returns A new `vec3` representing the world rotation in degrees.
   */
  public get worldRotation(): vec3 {
    const euler = vec3.create();
    toEuler(euler, this.worldRotationQuat);
    vec3.scale(euler, euler, 180 / Math.PI);
    return euler;
  }

  /**
   * Sets the world-space rotation of the transform using Euler angles (in degrees).
   * This will calculate the appropriate local rotation based on the parent's transform.
   * @param newWorldRotation - The desired new world rotation in degrees.
   */
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

  /**
   * Gets the final, combined world-space scale of the transform.
   * @returns A new `vec3` representing the world scale.
   */
  public get worldScale(): vec3 {
    const out = vec3.create();
    mat4.getScaling(out, this._modelMatrix);
    return out;
  }

  /**
   * Sets the world-space scale of the transform.
   * This will calculate the appropriate local scale based on the parent's transform.
   * @param newWorldScale - The desired new world scale.
   */
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

  /**
   * Gets the parent of this transform in the scene hierarchy.
   * @returns The parent `Transform` or `null` if it's a root object.
   */
  public get parent(): Transform | null {
    return this._parent;
  }

  // --- Mutators ---
  /**
   * Sets the local position of the transform.
   * @param x - The new local X position. Defaults to 0.
   * @param y - The new local Y position. Defaults to 0.
   * @param z - The new local Z position. Defaults to 0.
   */
  public setLocalPosition(x = 0, y = 0, z = 0): void {
    vec3.set(this._position, x, y, z);
    this._dirty = true;
  }

  /**
   * Sets the local rotation using Euler angles.
   * @param xDegrees - The new local pitch in degrees. Defaults to 0.
   * @param yDegrees - The new local yaw in degrees. Defaults to 0.
   * @param zDegrees - The new local roll in degrees. Defaults to 0.
   */
  public setLocalRotation(xDegrees = 0, yDegrees = 0, zDegrees = 0): void {
    vec3.set(this._rotationInDegrees, xDegrees, yDegrees, zDegrees);
    quat.fromEuler(this._rotation, xDegrees, yDegrees, zDegrees);
    this._dirty = true;
  }

  /**
   * Sets the local scale of the transform.
   * @param x - The new local X scale. Defaults to 1.
   * @param y - The new local Y scale. Defaults to 1.
   * @param z - The new local Z scale. Defaults to 1.
   */
  public setLocalScale(x = 1, y = 1, z = 1): void {
    vec3.set(this._scale, x, y, z);
    this._dirty = true;
  }

  /**
   * Sets the world position of the transform.
   * @param x - The new world X position. Defaults to 0.
   * @param y - The new world Y position. Defaults to 0.
   * @param z - The new world Z position. Defaults to 0.
   */
  public setWorldPosition(x = 0, y = 0, z = 0): void {
    this.worldPosition = vec3.fromValues(x, y, z);
  }

  /**
   * Sets the world rotation using Euler angles.
   * @param xDegrees - The new world pitch in degrees. Defaults to 0.
   * @param yDegrees - The new world yaw in degrees. Defaults to 0.
   * @param zDegrees - The new world roll in degrees. Defaults to 0.
   */
  public setWorldRotation(xDegrees = 0, yDegrees = 0, zDegrees = 0): void {
    this.worldRotation = vec3.fromValues(xDegrees, yDegrees, zDegrees);
  }

  /**
   * Sets the world scale of the transform.
   * @param x - The new world X scale. Defaults to 1.
   * @param y - The new world Y scale. Defaults to 1.
   * @param z - The new world Z scale. Defaults to 1.
   */
  public setWorldScale(x = 1, y = 1, z = 1): void {
    this.worldScale = vec3.fromValues(x, y, z);
  }

  /**
   * Moves the transform by the given amounts in local space.
   * @param x - Amount to move along the local X-axis. Defaults to 0.
   * @param y - Amount to move along the local Y-axis. Defaults to 0.
   * @param z - Amount to move along the local Z-axis. Defaults to 0.
   */
  public translate(x = 0, y = 0, z = 0): void {
    vec3.add(this._position, this._position, vec3.fromValues(x, y, z));
    this._dirty = true;
  }

  /**
   * Rotates the transform by the given Euler angles in degrees.
   * @param xDegrees - Amount to rotate around the local X-axis. Defaults to 0.
   * @param yDegrees - Amount to rotate around the local Y-axis. Defaults to 0.
   * @param zDegrees - Amount to rotate around the local Z-axis. Defaults to 0.
   */
  public rotate(xDegrees = 0, yDegrees = 0, zDegrees = 0): void {
    vec3.add(
      this._rotationInDegrees,
      this._rotationInDegrees,
      vec3.fromValues(xDegrees, yDegrees, zDegrees),
    );
    const rotationToAdd = quat.create();
    quat.fromEuler(rotationToAdd, xDegrees, yDegrees, zDegrees);
    quat.multiply(this._rotation, this._rotation, rotationToAdd);
    quat.normalize(this._rotation, this._rotation);
    this._dirty = true;
  }

  /**
   * Scales the transform by multiplying the current local scale by the given values.
   * @param x - Amount to scale along the local X-axis. Defaults to 1.
   * @param y - Amount to scale along the local Y-axis. Defaults to 1.
   * @param z - Amount to scale along the local Z-axis. Defaults to 1.
   */
  public scale(x = 1, y = 1, z = 1): void {
    vec3.multiply(this._scale, this._scale, vec3.fromValues(x, y, z));
    this._dirty = true;
  }

  /**
   * Recalculates the `localMatrix` and `modelMatrix` if the transform is dirty.
   * This method is called recursively down the transform hierarchy to ensure all
   * child matrices are also updated.
   */
  public updateMatrices(): void {
    if (this._dirty) {
      mat4.fromRotationTranslationScale(
        this._localMatrix,
        this._rotation,
        this._position,
        this._scale,
      );
      if (this._parent) {
        mat4.multiply(
          this._modelMatrix,
          this._parent.modelMatrix,
          this._localMatrix,
        );
      } else {
        mat4.copy(this._modelMatrix, this._localMatrix);
      }
    }
    for (const child of this._children) {
      child.setDirty(this._dirty);
      child.updateMatrices();
    }
    this._dirty = false;
  }

  /**
   * Attaches this transform to a new parent.
   * If it already has a parent, it will be detached first.
   * @param parent - The new parent `Transform`, or `null` to make this a root object.
   */
  public setParent(parent: Transform | null): void {
    if (this._parent) {
      const index = this._parent._children.indexOf(this);
      if (index > -1) this._parent._children.splice(index, 1);
    }
    this._parent = parent;
    if (this._parent) this._parent._children.push(this);
    this._dirty = true;
  }

  /** Gets the right direction vector `(+X)` in world space. */
  public get right(): vec3 {
    return vec3.fromValues(
      this._modelMatrix[0],
      this._modelMatrix[1],
      this._modelMatrix[2],
    );
  }
  /** Gets the left direction vector `(-X)` in world space. */
  public get left(): vec3 {
    return vec3.negate(vec3.create(), this.right);
  }
  /** Gets the up direction vector `(+Y)` in world space. */
  public get up(): vec3 {
    return vec3.fromValues(
      this._modelMatrix[4],
      this._modelMatrix[5],
      this._modelMatrix[6],
    );
  }
  /** Gets the down direction vector `(-Y)` in world space. */
  public get down(): vec3 {
    return vec3.negate(vec3.create(), this.up);
  }
  /**
   * Gets the forward direction vector `(+Z)` in world space.
   * Note: In a right-handed coordinate system, this points "into" the screen.
   */
  public get forward(): vec3 {
    return vec3.fromValues(
      this._modelMatrix[8],
      this._modelMatrix[9],
      this._modelMatrix[10],
    );
  }
  /**
   * Gets the back direction vector `(-Z)` in world space.
   * Note: In a right-handed coordinate system, this points "out of" the screen.
   */
  public get back(): vec3 {
    return vec3.negate(vec3.create(), this.forward);
  }

  /**
   * Rotates the transform to face a target point in world space.
   * @param target - The world-space position to look at. Can be a `vec3` or a `Vector3`.
   * @param worldUp - The vector that defines the "up" direction for the orientation.
   * Defaults to `(0, 1, 0)`. Can be a `vec3` or a `Vector3`.
   */
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

  /**
   * Serializes the transform's state to a JSON object.
   * @returns The serialized JSON data.
   */
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

  /**
   * Deserializes the transform's state from a JSON object.
   * @param jsonObject - The JSON data to deserialize from.
   */
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

  /**
   * Rotates the transform by applying a quaternion.
   * @param q - The quaternion to multiply the current rotation by.
   */
  public rotateByQuat(q: quat): void {
    quat.multiply(this._rotation, q, this._rotation);
    quat.normalize(this._rotation, this._rotation);
    this.updateEulerFromQuat();
    this._dirty = true;
  }

  /**
   * Manually sets the dirty flag for this transform.
   * @param dirty - The new state of the dirty flag.
   */
  public setDirty(dirty: boolean): void {
    this._dirty = dirty;
  }

  /**
   * Sets the local rotation using a quaternion.
   * @param newRotation - The new local rotation quaternion.
   */
  public setLocalRotationQuat(newRotation: quat): void {
    quat.copy(this._rotation, newRotation);
    quat.normalize(this._rotation, this._rotation);
    this.updateEulerFromQuat();
    this._dirty = true;
  }

  /**
   * Updates the internal Euler angle representation (`_rotationInDegrees`)
   * from the internal quaternion (`_rotation`).
   * @private
   */
  private updateEulerFromQuat(): void {
    const euler = vec3.create();
    toEuler(euler, this._rotation);
    vec3.scale(this._rotationInDegrees, euler, 180 / Math.PI);
  }

  /**
   * Converts a given quaternion to Euler angles in degrees.
   * @param q - The quaternion to convert.
   * @returns A `vec3` containing the Euler angles.
   */
  public getEulerFromQuat(q: quat): vec3 {
    const eulerRadians = vec3.create();
    toEuler(eulerRadians, q);
    vec3.scale(eulerRadians, eulerRadians, 180 / Math.PI);
    return eulerRadians;
  }
}

/**
 * @deprecated Use `localPosition` instead. This is a convenience alias.
 */
Object.defineProperty(Transform.prototype, 'position', {
  get: function () {
    return this.localPosition;
  },
});
/**
 * @deprecated Use `localRotation` instead. This is a convenience alias.
 */
Object.defineProperty(Transform.prototype, 'rotation', {
  get: function () {
    return this.localRotation;
  },
});
/**
 * @deprecated Use `localRotationQuat` instead. This is a convenience alias.
 */
Object.defineProperty(Transform.prototype, 'rotationQuat', {
  get: function () {
    return this.localRotationQuat;
  },
});
