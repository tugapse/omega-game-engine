import { JsonSerializable, JsonSerializedData } from "../../interfaces";

/**
  Defines the properties for light attenuation, controlling how light intensity diminishes with distance.
 */
export class LightAttenuation extends JsonSerializable {
  constructor() {
    super('LightAttenuation');
  }
  /**
    The constant component of attenuation.
   * @type {number}
   */
  public constant: number = 0.2;
  /**
    The linear component of attenuation.
   * @type {number}
   */
  public linear: number = 0.01; // 0.0 for strict physical inverse square law falloff
  /**
    The quadratic component of attenuation.
   * @type {number}
   */
  public quadratic: number = 0.001; // 1.0 for strict physical inverse square law falloff

  public override toJsonObject(): JsonSerializedData {
    return this.serializeAutomatically();
  }
  public override fromJson(jsonObject: JsonSerializedData): void {
    super.fromJson(jsonObject);
    this.deserializeAutomatically(jsonObject);
  }
}