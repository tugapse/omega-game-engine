import { quat, vec3 } from 'gl-matrix';
import { Keybord, Mouse } from "../core/input";
import { EntityBehaviour } from "./entity-behaviour";
export class CameraFlyBehaviour extends EntityBehaviour {
    constructor() {
        super(...arguments);
        this.moveSpeed = 20;
        this.rotationSpeed = 0.8;
        this._acceleration = 10;
        this.rotationDampening = 0.4;
        this._forwardVelocity = 0;
        this._strafeVelocity = 0;
        this._upVelocity = 0;
        this._currentYaw = 0;
        this._currentPitch = 0;
    }
    static instanciate() { return new CameraFlyBehaviour(); }
    update(ellapsed) {
        const transform = this.parent.transform;
        const accelerationDelta = this._acceleration * ellapsed;
        const maxSpeed = this.moveSpeed;
        if (Keybord.keyDown['w']) {
            this._forwardVelocity = Math.min(this._forwardVelocity + accelerationDelta, maxSpeed);
        }
        else if (Keybord.keyDown['s']) {
            this._forwardVelocity = Math.max(this._forwardVelocity - accelerationDelta, -maxSpeed);
        }
        else {
            this._forwardVelocity = 0;
        }
        if (Keybord.keyDown['a']) {
            this._strafeVelocity = Math.min(this._strafeVelocity + accelerationDelta, maxSpeed);
        }
        else if (Keybord.keyDown['d']) {
            this._strafeVelocity = Math.max(this._strafeVelocity - accelerationDelta, -maxSpeed);
        }
        else {
            this._strafeVelocity = 0;
        }
        if (Keybord.keyDown['q']) {
            this._upVelocity = Math.max(this._upVelocity - accelerationDelta, -maxSpeed);
        }
        else if (Keybord.keyDown['e']) {
            this._upVelocity = Math.min(this._upVelocity + accelerationDelta, maxSpeed);
        }
        else {
            this._upVelocity = 0;
        }
        // --- Camera Movement Logic ---
        const movementVector = vec3.create();
        if (this._forwardVelocity !== 0) {
            vec3.scaleAndAdd(movementVector, movementVector, transform.forward, this._forwardVelocity);
        }
        if (this._strafeVelocity !== 0) {
            vec3.scaleAndAdd(movementVector, movementVector, transform.right, this._strafeVelocity);
        }
        if (this._upVelocity !== 0) {
            const worldUp = vec3.fromValues(0, 1, 0);
            vec3.scaleAndAdd(movementVector, movementVector, worldUp, this._upVelocity);
        }
        transform.translate(movementVector[0] * ellapsed, movementVector[1] * ellapsed, movementVector[2] * ellapsed);
        // --- Corrected Camera Rotation Logic (Mouse Input) ---
        if (Mouse.mouseButtonDown[0]) {
            this._currentYaw += -Mouse.mouseMovement.x * this.rotationSpeed;
            this._currentPitch += Mouse.mouseMovement.y * this.rotationSpeed;
        }
        // Clamp the pitch to prevent flipping
        this._currentPitch = Math.max(-90, Math.min(90, this._currentPitch));
        // Create the yaw and pitch quaternions
        const yawQuat = quat.create();
        quat.fromEuler(yawQuat, 0, this._currentYaw, 0);
        const pitchQuat = quat.create();
        quat.fromEuler(pitchQuat, this._currentPitch, 0, 0);
        // Combine them correctly to get the final roll-free rotation
        const finalRotation = quat.create();
        quat.multiply(finalRotation, yawQuat, pitchQuat);
        // Smoothly interpolate the actual transform rotation towards the final rotation
        const smoothedRotation = quat.create();
        quat.slerp(smoothedRotation, transform.rotationQuat, finalRotation, this.rotationDampening);
        transform.setRotationQuat(smoothedRotation);
        super.update(ellapsed);
    }
    toJsonObject() {
        return {
            ...super.toJsonObject(),
            moveSpeed: this.moveSpeed,
            rotationSpeed: this.rotationSpeed,
            rotationDampening: this.rotationDampening
        };
    }
    fromJson(jsonObject) {
        this.moveSpeed = jsonObject['moveSpeed'];
        this.rotationSpeed = jsonObject['rotationSpeed'];
        this.rotationDampening = jsonObject['rotationDampening'];
    }
}
