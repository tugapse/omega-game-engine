import { Transform } from "../core/transform";
import { GlEntity } from "../entities/entity";
import { JsonSerializable } from "../core/json-serializable";
import { JsonSerializedData } from "../interfaces/json-serialized-data.interface";
import { v4 as uuidv4 } from 'uuid';

/**
  The base class for all components that define the behavior of an entity.
 * @augments {JsonSerializable}
 */
export class EntityBehaviour extends JsonSerializable {

  /**
    A static factory method to create an instance of the behaviour.
    
   * @param {any} [args] - Optional arguments for instantiation.
   * @returns {any}
   */
  static instanciate(args?: any): EntityBehaviour { return new EntityBehaviour(); }
  

  [key: string]: any;
  /**
    Indicates whether the behaviour is currently active.
   * @type {boolean}
   */
  public active: boolean = true;
  /**
    The parent entity to which this behaviour is attached.
   * @type {GlEntity}
   */
  public parent!: GlEntity;
  /**
    A flag indicating if the behaviour has been initialized.
   * @protected
   * @type {boolean}
   */
  protected _initialized = false;

  public get uuid() { return this._uuid; }
  protected _uuid: string;

  /**
    Gets the transform component of the parent entity.
   * @type {Transform}
   */
  public get transform(): Transform {
    return this.parent?.transform;
  }

  /**
    Creates an instance of EntityBehaviour.
   */
  constructor() {
    super("EntityBehaviour");
    this._uuid = uuidv4();
  }

  /**
    Initializes the behaviour.
   * @returns {boolean} - True if initialization is successful.
   */
  public initialize(): boolean {
    return (this._initialized = true);
  }

  /**
    Updates the behaviour every frame.
   * @param {number} ellapsed - The time elapsed since the last frame in milliseconds.
   */
  public update(ellapsed: number): void { }

  /**
    Updates the behaviour specifically for editor mode.
   * @param {number} ellapsed - The time elapsed since the last frame in milliseconds.
   */
  public updateEditor(ellapsed: number): void { }

  /**
    Draws any visual representation of the behaviour.
   */
  public draw(): void { }

  /**
    Cleans up resources used by the behaviour.
   */
  public destroy(): void { }

  /**
    Serializes the behaviour's state to a JSON object.
   * @override
   * @returns {JsonSerializedData} - The JSON object representation.
   */
  public override toJsonObject(): JsonSerializedData {
    return {
      ...super.toJsonObject(),
      active: this.active,
      uuid: this.uuid
    };
  }

  /**
    Deserializes the behaviour's state from a JSON object.
   * @override
   * @param {JsonSerializedData} jsonObject - The JSON object to deserialize from.
   */
  public override fromJson(jsonObject: JsonSerializedData): void {
    this.active = jsonObject["active"];
    this._uuid = jsonObject['uuid'];
  }

  /**
    Creates a clone of the behaviour.
   * @returns {EntityBehaviour | null} - A new instance of the behaviour or null if not implemented.
   */
  public clone(): EntityBehaviour | null {
    return null;
  }
}