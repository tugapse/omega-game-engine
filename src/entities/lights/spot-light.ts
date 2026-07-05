import { vec3 } from "gl-matrix";
import { Color, Transform } from "../../core";
import { EntityType } from "../../enums";
import { JsonSerializedData } from "../../interfaces";
import { Light } from "./light";
import { LightAttenuation } from "./light-attenuation";
import { LightConeAngles } from "./light-cone";



/**
  Represents a spot light source, which emits light in a cone shape.
 * @augments {Light}
 */
export class SpotLight extends Light {
  protected override _className = 'SpotLight';

  /**
    The type of the entity, specifically set to LIGHT_SPOT.
   * @override
   * @type {EntityType}
   */
  public override entityType: EntityType = EntityType.LIGHT_SPOT;
  /**
    The cone angles that define the shape of the spotlight.
   * @type {LightConeAngles}
   */
  public coneAngles: LightConeAngles = new LightConeAngles();
  /**
    The attenuation properties of the light.
   * @type {LightAttenuation}
   */
  public attenuation: LightAttenuation = new LightAttenuation();
  /**
    Gets the direction of the light, derived from the transform's rotation.
   * @readonly
   * @type {vec3}
   */
  public get toLightDirection(): vec3 {
    return this.transform.forward;
  }

  /**
    Creates an instance of SpotLight.
   * @param {string} name - The name of the light entity.
   */
  constructor(name: string) {
    super(name);
    this.entityType = EntityType.LIGHT_SPOT;
    // LED/Halogen flashlight (approx 5000K)
    this.color = new Color(1.0, 0.96, 0.89, 1.0);
  }

  public override toJsonObject(): JsonSerializedData {
    const result = this.serializeAutomatically();
    return result;
  }

  public override fromJson(jsonObject: JsonSerializedData): void {
    super.fromJson(jsonObject);
    this.deserializeAutomatically(jsonObject);
  }

  /**
    Creates a new SpotLight instance.

   * @override
   * @param {string} [name="Light"] - The name of the spot light.
   * @param {Transform} [transform] - The transform for the spot light.
   * @returns {SpotLight} - The newly created SpotLight instance.
   */
  static override instanciate(name?: string, transform?: Transform): SpotLight {
    return new SpotLight(name || 'Light');
  }
}
