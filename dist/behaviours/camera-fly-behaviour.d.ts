import { EntityBehaviour } from "./entity-behaviour";
import { JsonSerializedData } from '../interfaces/json-serialized-data';
export declare class CameraFlyBehaviour extends EntityBehaviour {
    static instanciate(): CameraFlyBehaviour;
    moveSpeed: number;
    rotationSpeed: number;
    rotationDampening: number;
    protected _acceleration: number;
    protected _forwardVelocity: number;
    protected _strafeVelocity: number;
    protected _upVelocity: number;
    protected _currentYaw: number;
    protected _currentPitch: number;
    update(ellapsed: number): void;
    protected updateInput(ellapsed: number): void;
    toJsonObject(): JsonSerializedData;
    fromJson(jsonObject: JsonSerializedData): void;
}
