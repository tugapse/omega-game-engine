import { mat4, vec3 } from 'gl-matrix'; // Import vec3 for lookAt calculations
import { EntityType } from "../enums/entity-type";
import { GlEntity } from "./entity";
export class Camera extends GlEntity {
    static get mainCamera() { return this._mainCamera; }
    get projectionMatrix() { return this._projectionMatrix; }
    get viewMatrix() { return this._viewMatrix; }
    constructor() {
        super("Camera");
        this.fieldOfView = (45 * Math.PI) / 180;
        this.nearPlane = 0.1;
        this.farPlane = 2000.0;
        this.aspectRatio = 1; // This needs to be updated, perhaps by CanvasViewport
        this.tag = "Camera";
        this.entityType = EntityType.CAMERA;
        this._projectionMatrix = mat4.create();
        this._viewMatrix = mat4.create();
    }
    static setMainCamera(camera) {
        this._mainCamera = camera;
    }
    initialize() {
        // It's good practice to set initial aspect ratio here if CanvasViewport is available
        // For example: this.aspectRatio = CanvasViewport.width / CanvasViewport.height;
        this.updateProjectionMatrix();
        this.updateViewMatrix(); // Ensure view matrix is updated on initialization
        super.initialize();
    }
    /**
     * Updates the camera's projection matrix based on its current fieldOfView, aspectRatio, nearPlane, and farPlane.
     * This should be called whenever the canvas/viewport dimensions change.
     */
    updateProjectionMatrix() {
        mat4.perspective(this._projectionMatrix, this.fieldOfView, this.aspectRatio, this.nearPlane, this.farPlane);
    }
    /**
     * Updates the camera's view matrix based on its current transform (position and rotation).
     * This method now explicitly uses mat4.lookAt to align the camera's view correctly,
     * considering that the Transform class's 'forward' is now +Z.
     */
    updateViewMatrix() {
        const cameraPosition = this.transform.position; // The 'eye' position of the camera
        // Calculate the 'center' point the camera is looking at.
        // Since our Transform's 'forward' is +Z, we add this vector to the camera's position
        // to get the point directly in front of the camera's 'front face'.
        const lookAtTarget = vec3.add(vec3.create(), cameraPosition, this.transform.forward);
        // The 'up' direction for the camera. This should be consistent with the Transform's 'up' (+Y).
        const cameraUp = this.transform.up;
        // Use mat4.lookAt to generate the view matrix. This function expects the camera
        // to be looking down its own local negative Z-axis. By providing the
        // 'eye', 'center', and 'up' vectors, we ensure the view matrix is correctly
        // oriented to look from the camera's position towards the calculated target.
        mat4.lookAt(this._viewMatrix, cameraPosition, lookAtTarget, cameraUp);
    }
    update(ellapsed) {
        // Ensure projection matrix is updated if aspect ratio changes (e.g., window resize)
        // this.updateProjectionMatrix(); // Consider calling this here if aspect ratio is dynamic
        this.updateViewMatrix(); // Always update view matrix as camera moves
        super.update(ellapsed);
    }
    toJsonObject() {
        return {
            ...super.toJsonObject(),
            fieldOfView: this.fieldOfView,
            nearPlane: this.nearPlane,
            farPlane: this.farPlane,
            aspectRatio: this.aspectRatio,
        };
    }
    static instanciate(name, transform) {
        const camera = new Camera();
        camera.name = name || camera.name;
        camera.transform = transform || camera.transform;
        return camera;
    }
}
