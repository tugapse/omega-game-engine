import { JsonSerializedData } from "../interfaces/json-serialized-data.interface";
import { CubemapTexture } from "../textures/cubemap-texture";
import { ColorMaterial } from "./color-material";

/**
  Represents a material that uses a cube map texture for skyboxes or reflections.
 * @augments {ColorMaterial}
 */
export class CubemapMaterial extends ColorMaterial {

  protected override _className = "CubemapMaterial";

  /**
    The URI for the right side (positive X) of the cubemap.
   * @type {string}
   */
  public rightSideUri: string = "assets/images/skybox/blue/right.jpeg";
  /**
    The URI for the left side (negative X) of the cubemap.
   * @type {string}
   */
  public leftSideUri: string = "assets/images/skybox/blue/left.jpeg";
  /**
    The URI for the top side (positive Y) of the cubemap.
   * @type {string}
   */
  public topSideUri: string = "assets/images/skybox/blue/top.jpeg";
  /**
    The URI for the bottom side (negative Y) of the cubemap.
   * @type {string}
   */
  public bottomSideUri: string = "assets/images/skybox/blue/bottom.jpeg";
  /**
    The URI for the back side (positive Z) of the cubemap.
   * @type {string}
   */
  public backSideUri: string = "assets/images/skybox/blue/back.jpeg";
  /**
    The URI for the front side (negative Z) of the cubemap.
   * @type {string}
   */
  public frontSideUri: string = "assets/images/skybox/blue/front.jpeg";
  /**
    The cube map texture.
   * @type {CubemapTexture}
   */
  public mainTex!: CubemapTexture;

  /**
    Deserializes the material's state from a JSON object.
   * Note: This implementation currently does not deserialize properties.
   * @override
   * @param {JsonSerializedData} jsonObject - The JSON object to deserialize from.
   * @returns {void}
   */
  override fromJson(jsonObject: JsonSerializedData): void {
    super.fromJson(jsonObject);

  }

  /**
    Serializes the material's state to a JSON object.
   * @override
   * @returns {JsonSerializedData} - The JSON object representation.
   */
  override toJsonObject(): JsonSerializedData {
    return {
      ...super.toJsonObject(),
      rightSideUri: this.rightSideUri,
      leftSideUri: this.leftSideUri,
      topSideUri: this.topSideUri,
      bottomSideUri: this.bottomSideUri,
      backSideUri: this.backSideUri,
      frontSideUri: this.frontSideUri,
    };
  }

  /**
    Creates a new instance of CubemapMaterial.
    
   * @override
   * @returns {CubemapMaterial} - A new CubemapMaterial instance.
   */
  static override instanciate(): CubemapMaterial {
    return new CubemapMaterial();
  }
  
}