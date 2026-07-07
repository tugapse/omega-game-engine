import { JsonSerializable } from "../../core";
import { JsonSerializedData } from "../../interfaces";

/**
  Defines the properties for the cone angles of a spotlight.
 */
export class LightConeAngles extends JsonSerializable {
  /**
    The inner cone angle in degrees.
   * @type {number}
   */
  public inner: number = 20.0; // Typical physical flashlight inner beam
  /**
    The outer cone angle in degrees.
   * @type {number}
   */
  public outer: number = 30.0; // Typical physical flashlight outer beam

  constructor() {
    super('LightConeAngles');
  }

  public override toJsonObject(): JsonSerializedData {
    return this.serializeAutomatically();
  }
  public override fromJson(jsonObject: JsonSerializedData): void {
    super.fromJson(jsonObject);
    this.deserializeAutomatically(jsonObject);
  }
}