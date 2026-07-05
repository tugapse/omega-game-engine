import { Color, Transform } from "../../core";
import { EntityType } from "../../enums";
import { JsonSerializedData } from "../../interfaces";
import { Light } from "./light";
import { LightAttenuation } from "./light-attenuation";

/**
  Represents a point light source, which emits light in all directions from a single point.
 * @augments {Light}
 */
export class PointLight extends Light {
  protected override _className = 'PointLight';
  public static override get className() {
    return 'PointLight';
  }

  /**
    The type of the entity, specifically set to LIGHT_POINT.
   * @override
   * @type {EntityType}
   */
  public override entityType: EntityType = EntityType.LIGHT_POINT;
  /**
    The attenuation properties of the light.
   * @type {LightAttenuation}
   */
  public attenuation!: LightAttenuation;

  /**
    Creates an instance of PointLight.
   * @param {string} name - The name of the light entity.
   */
  constructor(name: string) {
    super(name);
    this.entityType = EntityType.LIGHT_POINT;
    // Incandescent light bulb (approx 2800K)
    this.color = new Color(1.0, 0.85, 0.57, 1.0);
    this.attenuation = new LightAttenuation();
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
    Creates a new PointLight instance.

   * @override
   * @param {string} [name="Light"] - The name of the point light.
   * @param {Transform} [transform] - The transform for the point light.
   * @returns {PointLight} - The newly created PointLight instance.
   */
  static override instanciate(
    name?: string,
    transform?: Transform,
  ): PointLight {
    return new PointLight(name || 'Light');
  }
}