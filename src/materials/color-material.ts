import { Color } from "../core/color";
import { JsonSerializable } from "../interfaces/json-serializable";
import { JsonSerializedData } from "../interfaces/json-serialized-data";

export class ColorMaterial extends JsonSerializable {

  public static instanciate() { return new ColorMaterial(); }

  public name: string = "Color Material";
  public color: Color = new Color();

  override toJsonObject(): JsonSerializedData {
    return {
      ...super.toJsonObject(),
      color: this.color.toJsonObject(),

    }
  }

  override fromJson(jsonObject: JsonSerializedData): void {
    this.name = jsonObject['name'];
    this.color = Color.createFromJsonData(jsonObject['color']);

  }
}
