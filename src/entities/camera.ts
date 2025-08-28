import { mat4, vec3 } from 'gl-matrix';
import { Transform } from "../core/transform";
import { EntityType } from "../enums/entity-type";
import { JsonSerializedData } from "../interfaces/json-serialized-data";
import { GlEntity } from "./entity";

/**
  Represents a camera in the 3D scene, responsible for generating the view and projection matrices.
 * @augments {GlEntity}
 */
export class Camera extends GlEntity {
  /**
    The main camera instance for the scene.
   * @private
    
   * @type {Camera}
   */
  private static _mainCamera: Camera;
  /**
    Gets the main camera instance.
   * @readonly
    
   * @type {Camera}
   */
  public static get mainCamera(): Camera {
    return this._mainCamera;
  }
  /**
    The camera's field of view in radians.
   * @type {number}
   */
  public fieldOfView: number = (45 * Math.PI) / 180;
  /**
    The distance to the near clipping plane.
   * @type {number}
   */
  public nearPlane: number = 0.1;
  /**
    The distance to the far clipping plane.
   * @type {number}
   */
  public farPlane: number = 2000.0;
  /**
    The aspect ratio of the viewport.
   * @type {number}
   */
  public aspectRatio: number = 1;
  /**
    The projection matrix of the camera.
   * @private
   * @type {mat4}
   */
  private _projectionMatrix!: mat4;
  /**
    The view matrix of the camera.
   * @private
   * @type {mat4}
   */
  private _viewMatrix!: mat4;
  /**
    The tag for the camera entity.
   * @override
   * @type {string}
   */
  public override tag: string = "Camera";
  /**
    Gets the projection matrix.
   * @readonly
   * @type {mat4}
   */
  public get projectionMatrix(): mat4 {
    return this._projectionMatrix;
  }
  /**
    Gets the view matrix.
   * @readonly
   * @type {mat4}
   */
  public get viewMatrix(): mat4 {
    return this._viewMatrix;
  }

  /**
    Creates an instance of Camera.
   */
  constructor() {
    super("Camera");
    this.entityType = EntityType.CAMERA;
    this._projectionMatrix = mat4.create();
    this._viewMatrix = mat4.create();
  }

  /**
    Sets the main camera instance for static access.
    
   * @param {Camera} camera - The camera to set as the main camera.
   * @returns {void}
   */
  public static setMainCamera(camera: Camera): void {
    this._mainCamera = camera;
  }

  /**
    Initializes the camera, updating its matrices.
   * @override
   * @returns {void}
   */
  override initialize(): void {
    this.updateProjectionMatrix();
    this.updateViewMatrix();
    super.initialize();
  }

  /**
    Updates the camera's projection matrix based on its current fieldOfView, aspectRatio, nearPlane, and farPlane.
   * This should be called whenever the viewport dimensions change.
   * @returns {void}
   */
  public updateProjectionMatrix(): void {
    mat4.perspective(
      this._projectionMatrix,
      this.fieldOfView,
      this.aspectRatio,
      this.nearPlane,
      this.farPlane
    );
  }

  /**
    Updates the camera's view matrix based on its current transform (position and rotation).
   * @private
   * @returns {void}
   */
  private updateViewMatrix(): void {
    const cameraPosition = this.transform.position;
    const lookAtTarget = vec3.add(vec3.create(), cameraPosition, this.transform.forward);
    const cameraUp = this.transform.up;
    mat4.lookAt(this._viewMatrix, cameraPosition, lookAtTarget, cameraUp);
  }

  /**
    Updates the camera each frame.
   * @override
   * @param {number} ellapsed - The elapsed time since the last update.
   * @returns {void}
   */
  override update(ellapsed: number): void {
    this.updateViewMatrix();
    super.update(ellapsed);
  }

  /**
    Serializes the camera's state to a JSON object.
   * @override
   * @returns {JsonSerializedData} - The JSON object representation.
   */
  override toJsonObject(): JsonSerializedData {
    return {
      ...super.toJsonObject(),
      fieldOfView: this.fieldOfView,
      nearPlane: this.nearPlane,
      farPlane: this.farPlane,
      aspectRatio: this.aspectRatio,
    };
  }

  /**
    Creates a new Camera instance.
    
   * @override
   * @param {string} [name="Camera"] - The name of the camera.
   * @param {Transform} [transform] - The transform for the camera.
   * @returns {Camera} - The newly created Camera instance.
   */
  static override instanciate(name?: string, transform?: Transform): Camera {
    const camera = new Camera();
    camera.name = name || camera.name;
    camera.transform = transform || camera.transform;
    return camera;
  }
}