import { JsonSerializable } from "./json-serializable";

/**
 * Represents an Axis-Aligned Bounding Box (AABB) in 3D space,
 * defined by its minimum and maximum corner coordinates.
 * @augments {JsonSerializable}
 */
export class BoundingBox extends JsonSerializable {
  /**
   * Creates an instance of BoundingBox.
   * @param min_x - The minimum x-coordinate of the bounding box.
   * @param max_x - The maximum x-coordinate of the bounding box.
   * @param min_y - The minimum y-coordinate of the bounding box.
   * @param max_y - The maximum y-coordinate of the bounding box.
   * @param min_z - The minimum z-coordinate of the bounding box.
   * @param max_z - The maximum z-coordinate of the bounding box.
   */
  constructor(
    public min_x: number,
    public max_x: number,
    public min_y: number,
    public max_y: number,
    public min_z: number,
    public max_z: number,
  ) {
    super("BoundingBox");
  }

  /**
   * Gets the width of the bounding box (size along the X-axis).
   * @returns The width of the box.
   */
  get width(): number {
    return this.max_x - this.min_x;
  }

  /**
   * Gets the height of the bounding box (size along the Y-axis).
   * @returns The height of the box.
   */
  get height(): number {
    return this.max_y - this.min_y;
  }

  /**
   * Gets the depth of the bounding box (size along the Z-axis).
   * @returns The depth of the box.
   */
  get depth(): number {
    return this.max_z - this.min_z;
  }
}

/**
 * Represents a 3D bounding sphere defined by its center and radius.
 * @augments {JsonSerializable}
 */
export class BoundingSphere extends JsonSerializable {
  /**
   * Creates an instance of BoundingSphere.
   * @param x - The x-coordinate of the center of the sphere.
   * @param y - The y-coordinate of the center of the sphere.
   * @param z - The z-coordinate of the center of the sphere.
   * @param radius - The radius of the sphere.
   */
  constructor(
    public x: number,
    public y: number,
    public z: number,
    public radius: number
  ) {
    super("BoundingSphere");
  }
}
