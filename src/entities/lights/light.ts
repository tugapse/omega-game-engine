import { Color } from '../../core/color';
import { Transform } from '../../core/transform';
import { EntityType } from '../../enums/entity-type.enum';
import { SceneEntity } from '../entity';

/**
 * The base class for all light types in the engine (e.g., Ambient, Directional, Point, Spot).
 * It holds common properties such as color and intensity.
 * @augments {SceneEntity}
 */
export class Light extends SceneEntity {
  protected override _className = 'Light';

  /**
   * The type of the entity. Subclasses like `DirectionalLight` will override this.
   * @override
   * @type {EntityType}
   * @defaultValue `EntityType.LIGHT_AMBIENT`
   */
  public override entityType: EntityType = EntityType.LIGHT_AMBIENT;
  /**
   * The color and intensity of the light. The alpha component of the color is often used to control intensity.
   * @type {Color}
   */
  public color: Color;

  /**
   * Creates an instance of Light.
   * @param name - The name of the light entity.
   */
  constructor(name: string) {
    super(name);
    this.color = new Color(0.2, 0.2, 0.2, 1);
    this.entityType = EntityType.LIGHT_AMBIENT;
  }

  /**
   * Creates a new Light instance.
   * @override
   * @param name - The name of the light. Defaults to "Light".
   * @param transform - The transform for the light.
   * @returns The newly created Light instance.
   */
  static override instanciate(name?: string, transform?: Transform): Light {
    return new Light(name || 'Light');
  }
}
