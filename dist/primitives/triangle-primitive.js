import { MeshData } from "../core/mesh";
export class TrianglePrimitive extends MeshData {
    constructor() {
        const vertices = [
            [0.0, 1.0, 0.0], // 0: Top vertex
            [-1.0, -1.0, 0.0], // 1: Bottom-left vertex
            [1.0, -1.0, 0.0] // 2: Bottom-right vertex
        ];
        const normals = [
            [0.0, 0.0, 1.0], // Normal pointing out of the XY plane
            [0.0, 0.0, 1.0],
            [0.0, 0.0, 1.0]
        ];
        const uvs = [
            [0.5, 1.0], // Top center of the texture
            [0.0, 0.0], // Bottom-left of the texture
            [1.0, 0.0] // Bottom-right of the texture
        ];
        // Indices for the single triangle (already in CCW order)
        const indices = [0, 1, 2];
        // Pass lineIndices to the super constructor
        super(vertices, normals, uvs, indices);
    }
}
