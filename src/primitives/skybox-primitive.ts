// src/primitives/CubePrimitive.ts

import { vec2, vec3 } from "gl-matrix";
import { CubePrimitive } from "./cube-primitive";

export class SkyboxPrimitive extends CubePrimitive {
  static override instanciate(vertices?: vec3[], normals?: vec3[], uvs?: vec2[], indices?: number[]): CubePrimitive {
    return new SkyboxPrimitive();
  }
  constructor(size: number = 2.0) {
    super(size);
  }
}
