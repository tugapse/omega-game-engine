import { JsonSerializedData } from "../interfaces/json-serialized-data";
import { Texture } from "../textures/texture";
import { UnlitMaterial } from "./unlit-material";


export class LitMaterial extends UnlitMaterial {

  public normalTexUrl: string = "";
  public specularStrength: number = 1.0;
  public roughness: number = 0.2;
  public normalMapStrength: number = 0.2;

  public normalTex!: Texture;

  override toJsonObject(): JsonSerializedData {
    return {
      ...super.toJsonObject(),
      normalTexUrl: this.normalTexUrl,
      specularStrength: this.specularStrength,
      roughness: this.roughness,
      normalMapStrength: this.normalMapStrength
    }
  }
  override fromJson(jsonObject: JsonSerializedData): void {
    super.fromJson(jsonObject);
    this.normalTexUrl = jsonObject['normalTexUrl'];
    this.roughness = jsonObject['roughness'];
    this.normalMapStrength = jsonObject['normalMapStrength'];
  }

  static override instanciate(): LitMaterial {
    return new LitMaterial();
  }
}
