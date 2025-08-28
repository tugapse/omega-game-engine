import { JsonSerializedData } from "./json-serialized-data";

/**
  An abstract base class providing a common interface for objects that can be serialized to and deserialized from a JSON object.
 */
export class JsonSerializable {
  /**
    Serializes the object to a JSON-compatible data structure.
   * @returns {JsonSerializedData} - A JSON data object representing the serialized state.
   */
  public toJsonObject(): JsonSerializedData {
    return {
      type: this.constructor.name
    };
  }

  /**
    Deserializes the object from a JSON-compatible data structure.
   * This method is intended to be overridden by subclasses to handle their specific properties.
   * @param {JsonSerializedData} jsonObject - The JSON data object to deserialize from.
   * @returns {void}
   */
  public fromJson(jsonObject: JsonSerializedData): void {}
}