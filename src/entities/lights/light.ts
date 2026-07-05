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


