import { vec2 } from "gl-matrix";
import { JsonSerializedData } from "../interfaces/json-serialized-data";
import { Texture } from "../textures/texture";
import { ColorMaterial } from "./color-material";


export class UnlitMaterial extends ColorMaterial {
  public mainTexUrl: string = "";
  public uvScale: vec2 = vec2.fromValues(1, 1);
  public uvOffset: vec2 = vec2.create();
  public mainTex!: Texture;

  override toJsonObject(): JsonSerializedData {
    return {
      ...super.toJsonObject(),
      mainTexUrl: this.mainTexUrl,
      uvScale: [...this.uvScale],
      uvOffset: [...this.uvOffset]
    }
  }
  override fromJson(jsonObject: JsonSerializedData): void {
    super.fromJson(jsonObject);
    this.name = jsonObject['name'];
    this.mainTexUrl = jsonObject['mainTexUrl'];
    this.uvScale = jsonObject['uvScale'];
    this.uvOffset = jsonObject['uvOffset'];
  }
  static override instanciate(): UnlitMaterial {
      return new UnlitMaterial();
  }
}
