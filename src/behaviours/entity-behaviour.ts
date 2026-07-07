import { Transform } from '../core/transform';
import { SceneEntity } from '../entities/entity';
import { JsonSerializable } from '../core/json-serializable';
import { JsonSerializedData } from '../interfaces/json-serialized-data';
import { v4 as uuidv4 } from 'uuid';
import { RenderLayer } from '../enums';

/**
 * Represents the base class for all components that define the behavior of an entity.
 *
 * @remarks
 * This class provides the foundational structure for creating custom scripts (behaviors) that can be attached to entities in the scene.
 * It includes lifecycle methods such as `initialize`, `update`, and `destroy`, as well as serialization and cloning capabilities.
 * @augments {JsonSerializable}
 */
export class EntityBehaviour extends JsonSerializable {
  /**
   * A static factory method to create an instance of the behaviour.
   * This method should be overridden by subclasses to provide a way to create instances of the specific behaviour type.
   * @param {any} [args] - Optional arguments for instantiation.
   * @returns {EntityBehaviour}
   */
  static instanciate(args?: any): EntityBehaviour {
    return new EntityBehaviour();
  }

  [key: string]: any;
  /**
   * Indicates whether the behaviour is currently active.
   * An inactive behaviour will not have its `update` method called.
   * @defaultValue `true`
   */
  public active: boolean = true;

  /**
   * The render layer this behaviour belongs to.
   * This is used by the rendering pipeline to sort objects (e.g., for transparency).
   * @see {RenderLayer}
   * @defaultValue `RenderLayer.OPAQUE`
   */
  public renderLayer: RenderLayer = RenderLayer.OPAQUE;
  /**
   * The parent entity to which this behaviour is attached.
   * This is set automatically when the behavior is added to an entity.
   */
  public parent!: SceneEntity;
  /**
   * A flag indicating if the behaviour has been initialized.
   * @defaultValue `false`
   * @protected
   */
  protected _initialized = false;

  /**
   * Gets the transform component of the parent entity.
   * This provides easy access to the position, rotation, and scale of the entity.
   * @type {Transform}
   * @readonly
   */
  public get transform(): Transform {
    return this.parent?.transform;
  }

  /**
   * Creates an instance of EntityBehaviour.
   */
  constructor() {
    super('EntityBehaviour');
    this._uuid = uuidv4();
    this._serializationIgnoreKeys.push(
      'parent',
      '_initialized',
      '_serializationIgnoreKeys',
    );
  }

  /**
   * Initializes the behaviour.
   * This method is called once when the behaviour is first added to an entity.
   * Subclasses should call `super.initialize()` and can override this to perform one-time setup.
   * @returns `true` if initialization is successful.
   */
  public initialize(): boolean {
    return (this._initialized = true);
  }

  /**
   * Updates the behaviour every frame.
   * This method is called on every frame for active behaviours.
   * @param elapsed - The time elapsed since the last frame in seconds.
   */
  public update(elapsed: number): void {}

  /**
   * Updates the behaviour specifically for editor mode.
   * This method is called on every frame when the engine is in editor mode.
   * @param elapsed - The time elapsed since the last frame in seconds.
   */
  public updateEditor(elapsed: number): void {}

  /**
   * Draws any visual representation of the behaviour.
   * This is often used for debugging purposes, such as drawing bounding boxes or other gizmos.
   */
  public draw(): void {}

  /**
   * Cleans up resources used by the behaviour.
   * This method is called when the behaviour is about to be destroyed.
   */
  public destroy(): void {}

  /**
   * Serializes the behaviour's state to a JSON object.
   * This is used for saving the scene or entity state.
   * @override
   * @returns The JSON object representation of the behavior.
   */
  public override toJsonObject(): JsonSerializedData {
    return {
      ...super.toJsonObject(),
      active: this.active,
      uuid: this.uuid,
    };
  }

  /**
   * Deserializes the behaviour's state from a JSON object.
   * This is used for loading a scene or entity state.
   * @override
   * @param jsonObject - The JSON object to deserialize from.
   */
  public override fromJson(jsonObject: JsonSerializedData): void {
    super.fromJson(jsonObject);
    this.active = jsonObject['active'];
    this._uuid = jsonObject['uuid'];
  }

  /**
   * Creates a clone of the behaviour.
   * This method should be overridden by subclasses to implement deep cloning of the behaviour.
   * @returns A new instance of the behaviour, or `null` if cloning is not supported.
   */
  public clone(): EntityBehaviour | null {
    return null;
  }
}
