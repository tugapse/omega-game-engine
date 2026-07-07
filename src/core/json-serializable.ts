import { v4 as uuidV4 } from 'uuid';
import { JsonSerializedData } from '../interfaces/json-serialized-data';
/**
 * An abstract base class providing a common interface for objects that can be serialized
 * to and deserialized from a JSON object. It includes helpers for automatic property
 * serialization and deserialization.
 */
export class JsonSerializable {
  /** Allows for dynamic property access. */
  [key: string]: any;
  /** A user-friendly name for the object instance. */
  public name: string = '';
  /** The name of the class, used for identification during deserialization. */
  protected _className: string;
  /** A unique identifier for this object instance. */
  protected _uuid: string;
  /** A list of property keys to ignore during automatic serialization. */
  protected _serializationIgnoreKeys: string[];

  /**
   * Gets the class name of the object.
   * @returns The class name.
   */
  public get className(): string {
    return this._className;
  }
  /**
   * Gets the unique identifier of the object.
   * @returns The UUID string.
   */
  public get uuid(): string {
    return this._uuid;
  }

  /**
   * Creates an instance of JsonSerializable.
   * @param className - The name of the class being instantiated. This is crucial for the serialization system.
   * @throws If `className` is not provided.
   */
  constructor(className: string) {
    if (!className) throw new Error('className is required');
    this._className = className;
    this.name = this.name;
    this._uuid = uuidV4();
    this._serializationIgnoreKeys = [
      // Internal properties that should never be serialized.
      '_serializationIgnoreKeys',
      // Runtime references that cannot be serialized.
      'scene',
      'parent',
    ];
  }

  private loopAndSaveProperties(value: any): any {
    const type = typeof value;

    // Rule 1: Handle primitives (string, number, boolean)
    if (
      value === null ||
      type === 'string' ||
      type === 'number' ||
      type === 'boolean'
    ) {
      return value;
    }

    // Rule 2: Handle objects with a toJsonObject method (like Color, NumberRange, etc.)
    if (value && typeof value.toJsonObject === 'function') {
      return value.toJsonObject();
    }

    // Rule 3: Handle plain objects recursively
    if (
      type === 'object' &&
      !Array.isArray(value) &&
      value?.constructor === Object
    ) {
      const data: JsonSerializedData = {};
      for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          data[key] = this.loopAndSaveProperties(value[key]);
        }
      }
      return data;
    }

    // Return undefined for types we can't or shouldn't serialize (like functions)
    return undefined;
  }

  /**
   * Creates a base JSON object with common identifying properties.
   * @returns A `JsonSerializedData` object with `type`, `name`, `className`, and `uuid`.
   * @protected
   */
  protected getBaseJsonInfo(): JsonSerializedData {
    return {
      type: this.constructor.name,
      name: this.name,
      className: this.className,
      uuid: this.uuid,
    };
  }
  /**
   * Automatically serializes the public properties of the object.
   * It iterates over the object's keys and uses `loopAndSaveProperties` to serialize each value.
   * Keys listed in `_serializationIgnoreKeys` are skipped.
   *
   * @remarks
   * This is a helper method for subclasses to easily implement `toJsonObject`.
   * @returns A `JsonSerializedData` object representing the object's state.
   * @protected
   */
  protected serializeAutomatically(): JsonSerializedData {
    const data: JsonSerializedData = {};

    for (const key of Object.keys(this)) {
      if (this._serializationIgnoreKeys.includes(key)) {
        continue;
      }
      const value = (this as any)[key];
      const serializedValue = this.loopAndSaveProperties(value);

      if (serializedValue !== undefined) {
        data[key] = serializedValue;
      }
    }

    // Add/overwrite base properties to ensure they are correct.
    return {
      ...data,
      type: this.constructor.name,
      name: this.name,
      className: this.className,
      uuid: this.uuid,
    };
  }

  /**
   * Recursively populates the properties of a target object from a source JSON object.
   * @param target - The class instance to populate.
   * @param source - The JSON data to read from.
   * @private
   */
  private populateProperties(target: any, source: JsonSerializedData): void {
    for (const key in source) {
      if (!Object.prototype.hasOwnProperty.call(source, key)) continue;
      if (!Object.prototype.hasOwnProperty.call(target, key)) continue;

      const sourceValue = source[key];
      const targetProperty = target[key];

      if (sourceValue === null || typeof sourceValue !== 'object') {
        // Primitive from JSON, just assign it.
        target[key] = sourceValue;
      } else if (
        targetProperty &&
        typeof targetProperty.fromJson === 'function'
      ) {
        // The property on our class instance knows how to deserialize itself (e.g., Color, NumberRange).
        targetProperty.fromJson(sourceValue);
      } else if (
        targetProperty &&
        typeof targetProperty === 'object' &&
        !Array.isArray(targetProperty) &&
        targetProperty.constructor === Object
      ) {
        // It's a nested plain object, recurse.
        this.populateProperties(targetProperty, sourceValue);
      } else {
        // For other cases (like arrays or complex objects without fromJson), a simple assignment might work for PODs (Plain Old Data).
        // A more robust solution might require special handling for arrays of JsonSerializable objects.
        target[key] = sourceValue;
      }
    }
  }

  /**
   * Automatically deserializes properties from a JSON object into the current instance.
   * It filters out base properties and ignored keys, then uses `populateProperties` to
   * recursively set the values on the instance.
   *
   * @remarks
   * This is a helper method for subclasses to easily implement `fromJson`.
   * @param jsonObject - The JSON data to deserialize from.
   */
  protected deserializeAutomatically(jsonObject: JsonSerializedData): void {
    // The `super.fromJson` call should be made by the derived class before calling this helper.
    // Create a copy of the jsonObject to avoid modifying the original, and remove keys we don't want to auto-populate.
    const dataToPopulate = { ...jsonObject };
    const baseKeys = ['type', 'name', 'className', 'uuid'];
    for (const key of [...baseKeys, ...this._serializationIgnoreKeys]) {
      delete (dataToPopulate as any)[key];
    }

    this.populateProperties(this, dataToPopulate);
  }

  /**
   * Serializes the object to a JSON-compatible data structure.
   * Subclasses should override this to add their specific properties.
   * @returns A JSON data object representing the object's base state.
   */
  public toJsonObject(): JsonSerializedData {
    return this.getBaseJsonInfo();
  }

  /**
   * Deserializes the object from a JSON-compatible data structure.
   * Subclasses should override this to handle their specific properties, usually calling `super.fromJson` first.
   * @param jsonObject - The JSON data object to deserialize from.
   */
  public fromJson(jsonObject: JsonSerializedData): void {
    this.name = jsonObject['name'];
    if (jsonObject['uuid']) this._uuid = jsonObject['uuid'];
  }
}
