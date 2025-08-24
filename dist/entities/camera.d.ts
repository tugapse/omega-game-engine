import { mat4 } from 'gl-matrix';
import { Transform } from "../core/transform";
import { JsonSerializedData } from "../interfaces/json-serialized-data";
import { GlEntity } from "./entity";
export declare class Camera extends GlEntity {
    private static _mainCamera;
    static get mainCamera(): Camera;
    fieldOfView: number;
    nearPlane: number;
    farPlane: number;
    aspectRatio: number;
    private _projectionMatrix;
    private _viewMatrix;
    tag: string;
    get projectionMatrix(): mat4;
    get viewMatrix(): mat4;
    constructor();
    static setMainCamera(camera: Camera): void;
    initialize(): void;
    /**
     * Updates the camera's projection matrix based on its current fieldOfView, aspectRatio, nearPlane, and farPlane.
     * This should be called whenever the canvas/viewport dimensions change.
     */
    updateProjectionMatrix(): void;
    /**
     * Updates the camera's view matrix based on its current transform (position and rotation).
     * This method now explicitly uses mat4.lookAt to align the camera's view correctly,
     * considering that the Transform class's 'forward' is now +Z.
     */
    private updateViewMatrix;
    update(ellapsed: number): void;
    toJsonObject(): JsonSerializedData;
    static instanciate(name?: string, transform?: Transform): Camera;
}
