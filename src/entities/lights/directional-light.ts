import { vec3 } from "gl-matrix";
import { Color, Transform } from "../../core";
import { EntityType } from "../../enums";
import { Light } from "./light";

/**
  Represents a directional light source, which simulates light from a distant source like the sun.
 * @augments {Light}
 */
export class DirectionalLight extends Light {
  public static override get className() {
    return 'DirectionalLight';
  }

  protected override _className = 'DirectionalLight';

  /**
    The type of the entity, specifically set to LIGHT_DIRECTIONAL.
   * @override
   * @type {EntityType}
   */
  public override entityType: EntityType = EntityType.LIGHT_DIRECTIONAL;

  /**
    Gets the direction of the light, derived from the transform's rotation.
   * @readonly
   * @type {vec3}
   */
  public get direction(): vec3 {
    return vec3.normalize(
      vec3.create(),
      this.invertLightDirection ? this.transform.back : this.transform.forward,
    );
  }

  public invertLightDirection = false;

  /**
    Creates an instance of DirectionalLight.
   * @param {string} name - The name of the light entity.
   */
  constructor(name: string) {
    super(name);
    this.entityType = EntityType.LIGHT_DIRECTIONAL;
    this.color = new Color(1.0, 0.98, 0.95, 0.7);
  }

  /**
    Creates a new DirectionalLight instance.

   * @override
   * @param {string} [name="Directional Light"] - The name of the directional light.
   * @param {Transform} [transform] - The transform for the directional light.
   * @returns {DirectionalLight} - The newly created DirectionalLight instance.
   */
  static override instanciate(
    name?: string,
    transform?: Transform,
  ): DirectionalLight {
    return new DirectionalLight(name || 'Directional Light');
  }
}