import { EntityBehaviour } from "./entity-behaviour";
import { JsonSerializedData } from '../interfaces/json-serialized-data';
export declare class CameraFlyBehaviour extends EntityBehaviour {
    static instanciate(): CameraFlyBehaviour;
    moveSpeed: number;
    rotationSpeed: number;
    private _acceleration;
    rotationDampening: number;
    private _forwardVelocity;
    private _strafeVelocity;
    private _upVelocity;
    private _currentYaw;
    private _currentPitch;
    update(ellapsed: number): void;
    toJsonObject(): JsonSerializedData;
    fromJson(jsonObject: JsonSerializedData): void;
}
