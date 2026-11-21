import { Color } from '../../core/color';
import { Transform } from '../../core/transform';
import { EntityType } from '../../enums/entity-type.enum';
import { SceneEntity } from '../entity';

/**
  The base class for all light types in the engine.
 * @augments {SceneEntity}
 */
export class Light extends SceneEntity {
  protected override _className = 'Light';

  /**
    The type of the entity, specifically set to LIGHT_AMBIENT.
   * @override
   * @type {EntityType}
   */
  public override entityType: EntityType = EntityType.LIGHT_AMBIENT;
  /**
    The color and intensity of the light.
   * @type {Color}
   */
  public color: Color;

  /** Whether this light casts shadows (ambient light ignores it). */
  public castShadows = false;
  /**
   * Bias against shadow acne: the shadow lookup moves toward the light by this
   * many shadow-map texels (their world size at that point). Too much detaches
   * shadows from their objects (peter panning).
   */
  public shadowDepthBias = 0.5;
  /** Offset along the surface normal at grazing angles, in shadow-map texels. */
  public shadowNormalBias = 1;
  /** How dark this light's shadow is: 0 none, 1 no light from it at all. */
  public shadowStrength = 0.75;

  /**
    Creates an instance of Light.
   * @param {string} name - The name of the light entity.
   */
  constructor(name: string) {
    super(name);
    this.color = new Color(0.2, 0.2, 0.2, 1);
    this.entityType = EntityType.LIGHT_AMBIENT;
  }

  /**
    Creates a new Light instance.

   * @override
   * @param {string} [name="Light"] - The name of the light.
   * @param {Transform} [transform] - The transform for the light.
   * @returns {Light} - The newly created Light instance.
   */
  static override instanciate(name?: string, transform?: Transform): Light {
    return new Light(name || 'Light');
  }
}


