// src/primitives/CubePrimitive.ts
import { CubePrimitive } from "./cube-primitive";
export class SkyboxPrimitive extends CubePrimitive {
    static instanciate(vertices, normals, uvs, indices) {
        return new SkyboxPrimitive();
    }
    constructor(size = 2.0) {
        super(size);
    }
}
