import { vec3, vec4 } from "gl-matrix";
import { JsonSerializable } from "./json-serializable";
import { JsonSerializedData } from "../interfaces/json-serialized-data";

/**
 * A class representing a color using RGBA values, backed by a gl-matrix vec4.
 * This class provides methods for manipulating and converting colors, and supports serialization.
 * Color components are represented as floating-point numbers from 0.0 to 1.0.
 *
 * @augments {JsonSerializable}
 */
export class Color extends JsonSerializable {

  public static get className() { return "Color"; }
  /**
   * Creates a new Color instance from a JSON data object.
   * @param jsonData - The JSON object to deserialize from.
   * @returns A new Color instance.
   */
  public static createFromJsonData(jsonData: JsonSerializedData): Color {
    const color = new Color();
    color.fromJson(jsonData);
    return color;
  }

  /**
   * The internal vector storing the color components.
   * @private
   * @type {vec4}
   */
  private vector: vec4;

  /**
   * Gets the red component of the color.
   * @returns The red component (0.0 to 1.0).
   */
  public get r(): number {
    return this.vector[0];
  }
  /**
   * Sets the red component of the color.
   * @param value - The new red value (0.0 to 1.0).
   */
  public set r(value: number) {
    this.vector[0] = value;
  }

  /**
   * Gets the green component of the color.
   * @returns The green component (0.0 to 1.0).
   */
  public get g(): number {
    return this.vector[1];
  }
  /**
   * Sets the green component of the color.
   * @param value - The new green value (0.0 to 1.0).
   */
  public set g(value: number) {
    this.vector[1] = value;
  }

  /**
   * Gets the blue component of the color.
   * @returns The blue component (0.0 to 1.0).
   */
  public get b(): number {
    return this.vector[2];
  }
  /**
   * Sets the blue component of the color.
   * @param value - The new blue value (0.0 to 1.0).
   */
  public set b(value: number) {
    this.vector[2] = value;
  }

  /**
   * Gets the alpha component of the color.
   * @returns The alpha component (0.0 for transparent, 1.0 for opaque).
   */
  public get a(): number {
    return this.vector[3];
  }
  /**
   * Sets the alpha component of the color.
   * @param value - The new alpha value (0.0 to 1.0).
   */
  public set a(value: number) {
    this.vector[3] = value;
  }

  /**
   * Creates an instance of Color.
   * @param r - The red component (0.0 to 1.0). Defaults to 1.
   * @param g - The green component (0.0 to 1.0). Defaults to 1.
   * @param b - The blue component (0.0 to 1.0). Defaults to 1.
   * @param a - The alpha component (0.0 to 1.0). Defaults to 1.
   */
  constructor(r: number = 1, g: number = 1, b: number = 1, a: number = 1) {
    super("Color");
    this.vector = vec4.fromValues(r, g, b, a);
  }

  /**
   * Serializes the color's state to a JSON object.
   * @override
   * @returns The JSON object representation of the color.
   */
  public override toJsonObject(): JsonSerializedData {
    return {
      ...super.toJsonObject(),
      r: this.r,
      g: this.g,
      b: this.b,
      a: this.a,
    };
  }

  /**
   * Deserializes the color's state from a JSON object.
   * @override
   * @param jsonObject - The JSON object to deserialize from.
   */
  public override fromJson(jsonObject: JsonSerializedData): void {
    this.r = jsonObject["r"];
    this.g = jsonObject["g"];
    this.b = jsonObject["b"];
    this.a = jsonObject["a"];
  }

  /**
   * Converts the color to a gl-matrix vec3.
   * @returns A new vec3 containing the RGB components, discarding alpha.
   */
  public toVec3(): vec3 {
    return vec3.fromValues(this.r, this.g, this.b);
  }

  /**
   * Returns the underlying gl-matrix vec4.
   * @returns The vec4 containing the RGBA components.
   */
  public toVec4(): vec4 {
    return this.vector;
  }

  /**
   * Creates a new `Color` instance with the same values as this one.
   * @returns A cloned `Color` instance.
   */
  public clone(): Color {
    return new Color(...this.vector);
  }

  /**
   * Sets the RGBA values of the color.
   * @param r - The red component. Defaults to 1.
   * @param g - The green component. Defaults to 1.
   * @param b - The blue component. Defaults to 1.
   * @param a - The alpha component. Defaults to 1.
   */
  public set(r: number = 1, g: number = 1, b: number = 1, a: number = 1): void {
    this.vector[0] = r;
    this.vector[1] = g;
    this.vector[2] = b;
    this.vector[3] = a;
  }

  /**
   * Linearly interpolates between two colors.
   * @param a - The starting color (when t=0).
   * @param b - The ending color (when t=1).
   * @param t - The interpolation factor, clamped between 0 and 1.
   * @returns The new, interpolated color.
   */
  public static lerp(a: Color, b: Color, t: number): Color {
    const out = new Color();
    vec4.lerp(out.vector, a.vector, b.vector, t);
    return out;
  }
}