import { quat, vec3 } from 'gl-matrix';
import { Keybord, Mouse } from "../core/input";
import { EntityBehaviour } from "./entity-behaviour";
import { JsonSerializedData } from '../interfaces/json-serialized-data.interface';


export interface ICameraMoveKeys {
  forward: string,
  back: string,
  left: string
  right: string,
  up: string,
  down: string
}
export interface ICameraMouseButtons {
  pan: number,
  look: number
}
/**
   CameraFlyBehaviour
  
 * Implements a free-look camera controller, often referred to as "flycam" or "FPS camera."
 * It allows movement with W/A/S/D/Q/E keys and rotation with mouse input.
 * The movement includes smooth acceleration and deceleration, and rotation is smoothly dampened.
 *
 * This behaviour can be attached to an Entity to control its transform,
 * making it behave like a camera in a 3D scene.
 *
 * @extends EntityBehaviour
 */
export class CameraFlyBehaviour extends EntityBehaviour {


  /**
   * Instantiates a new CameraFlyBehaviour instance.
   * @returns {CameraFlyBehaviour} A new instance of CameraFlyBehaviour.
   */
  static override instanciate(): CameraFlyBehaviour { return new CameraFlyBehaviour(); }

  /**
   * The maximum speed at which the camera can move.
   * @type {number}
   * @default 20
   */
  public moveSpeed = 20;

  /**
   * The sensitivity of mouse input for camera rotation.
   * @type {number}
   * @default 0.8
   */
  public rotationSpeed = 0.8;

  /**
   * The dampening factor for rotation. A higher value means rotation snaps faster.
   * Value between 0 and 1.
   * @type {number}
   * @default 0.4
   */
  public rotationDampening = 0.4;

  /**
   * The dampening factor for movement. A higher value means movement stops faster.
   * Value between 0 and 1.
   * @type {number}
   * @default 0.15
   */
  public moveDampening = 0.15;

  public moveKeys: ICameraMoveKeys = {
    forward: "w",
    back: "s",
    left: "a",
    right: "d",
    up: "q",
    down: "e"
  }

  public lookMouseButtons: ICameraMouseButtons = {
    pan: 1,
    look: 2
  }

  /**
   * The rate at which the camera accelerates to `moveSpeed`.
   * @type {number}
   * @default 10
   */
  protected _acceleration = 10;

  /** @protected Current forward/backward velocity. */
  protected _forwardVelocity = 0;
  /** @protected Current strafe (left/right) velocity. */
  protected _strafeVelocity = 0;
  /** @protected Current up/down velocity. */
  protected _upVelocity = 0;

  /** @protected Current accumulated yaw (horizontal rotation) in degrees. */
  protected _currentYaw = 0;
  /** @protected Current accumulated pitch (vertical rotation) in degrees. */
  protected _currentPitch = 0;


  constructor() {
    super();
    this._className = "CameraFlyBehaviour";
  }

  /**
   * Updates the camera's state based on input.
   * @param {number} ellapsed - The time elapsed since the last update in seconds.
   */
  override update(ellapsed: number): void {
    this.updateInput(ellapsed);
    super.update(ellapsed);
  }

  /**
   * Processes keyboard and mouse input to update camera velocities and rotation.
   * Applies acceleration, dampening, and clamps values to stay within limits.
   * @param {number} ellapsed - The time elapsed since the last update in seconds.
   * @protected
   */
  protected updateInput(ellapsed: number) {
    if (!this._initialized || !this.parent?.transform) return;
    const transform = this.parent.transform;

    const accelerationDelta = this._acceleration * ellapsed;
    const maxSpeed = this.moveSpeed;
    const stopThreshold = 0.1;

    if (Keybord.keyDown[this.moveKeys.forward]) {
      this._forwardVelocity = Math.min(this._forwardVelocity + accelerationDelta, maxSpeed);
    } else if (Keybord.keyDown[this.moveKeys.back]) {
      this._forwardVelocity = Math.max(this._forwardVelocity - accelerationDelta, -maxSpeed);
    } else {
      this._forwardVelocity *= (1 - this.moveDampening);
      if (Math.abs(this._forwardVelocity) < stopThreshold) {
        this._forwardVelocity = 0;
      }
    }

    if (Keybord.keyDown[this.moveKeys.left]) {
      this._strafeVelocity = Math.min(this._strafeVelocity + accelerationDelta, maxSpeed);
    } else if (Keybord.keyDown[this.moveKeys.right]) {
      this._strafeVelocity = Math.max(this._strafeVelocity - accelerationDelta, -maxSpeed);
    } else {
      this._strafeVelocity *= (1 - this.moveDampening);
      if (Math.abs(this._strafeVelocity) < stopThreshold) {
        this._strafeVelocity = 0;
      }
    }

    if (Keybord.keyDown[this.moveKeys.up]) {
      this._upVelocity = Math.max(this._upVelocity - accelerationDelta, -maxSpeed);
    } else if (Keybord.keyDown[this.moveKeys.down]) {
      this._upVelocity = Math.min(this._upVelocity + accelerationDelta, maxSpeed);
    } else {
      this._upVelocity *= (1 - this.moveDampening);
      if (Math.abs(this._upVelocity) < stopThreshold) {
        this._upVelocity = 0;
      }
    }
    if (Mouse.mouseButtonDown[this.lookMouseButtons.pan]) {
      this._upVelocity += Mouse.mouseMovement.y * this.moveDampening / 2.0;
      this._strafeVelocity += Mouse.mouseMovement.x * this.moveDampening / 2.0;
    }

    this._forwardVelocity -= Mouse.wheelY * this.moveDampening;

    // --- Camera Movement Logic ---
    const movementVector = vec3.create();

    // Scale and add movement components based on current velocities
    if (Math.abs(this._forwardVelocity) > 0) {
      vec3.scaleAndAdd(movementVector, movementVector, transform.forward, this._forwardVelocity);
    }
    if (Math.abs(this._strafeVelocity) > 0) {
      vec3.scaleAndAdd(movementVector, movementVector, transform.right, this._strafeVelocity);
    }
    if (Math.abs(this._upVelocity) > 0) {
      const worldUp = vec3.fromValues(0, 1, 0); // Define world-up direction
      vec3.scaleAndAdd(movementVector, movementVector, worldUp, this._upVelocity);
    }


    transform.translate(movementVector[0] * ellapsed, movementVector[1] * ellapsed, movementVector[2] * ellapsed);


    if (Mouse.mouseButtonDown[this.lookMouseButtons.look]) {
      this._currentYaw += -Mouse.mouseMovement.x * this.rotationSpeed;
      this._currentPitch += Mouse.mouseMovement.y * this.rotationSpeed;
    }

    this._currentPitch = Math.max(-90, Math.min(90, this._currentPitch));

    const yawQuat = quat.create();
    quat.fromEuler(yawQuat, 0, this._currentYaw, 0);

    const pitchQuat = quat.create();
    quat.fromEuler(pitchQuat, this._currentPitch, 0, 0);

    const finalRotation = quat.create();
    quat.multiply(finalRotation, yawQuat, pitchQuat);

    const smoothedRotation = quat.create();
    quat.slerp(smoothedRotation, transform.rotationQuat, finalRotation, this.rotationDampening);
    transform.setRotationQuat(smoothedRotation);
  }

  /**
   * Serializes the camera's properties to a JSON object for persistence.
   * @returns {JsonSerializedData} An object containing the serialized properties.
   */
  override toJsonObject(): JsonSerializedData {
    return {
      ...super.toJsonObject(),
      moveSpeed: this.moveSpeed,
      rotationSpeed: this.rotationSpeed,
      rotationDampening: this.rotationDampening,
      moveDampening: this.moveDampening
    };
  }

  /**
   * Deserializes the camera's properties from a JSON object.
   * @param {JsonSerializedData} jsonObject - The JSON object to deserialize from.
   */
  override fromJson(jsonObject: JsonSerializedData): void {
    super.fromJson(jsonObject); // Call superclass's fromJson first
    this.moveSpeed = jsonObject['moveSpeed'];
    this.rotationSpeed = jsonObject['rotationSpeed'];
    this.rotationDampening = jsonObject['rotationDampening'];
    if (jsonObject['moveDampening'] !== undefined) {
      this.moveDampening = jsonObject['moveDampening'];
    }
  }
}
