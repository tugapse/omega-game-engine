import { MeshData } from "../core/mesh";
export class QuadPrimitive extends MeshData {
    constructor(size = 2.0) {
        const halfSize = size / 2.0;
        const vertices = [];
        const normals = [];
        const uvs = [];
        const indices = [];
        const addFace = (v0, v1, v2, v3, normal, uv0, uv1, uv2, uv3, baseIndex) => {
            vertices.push(v0, v1, v2, v3);
            normals.push(normal, normal, normal, normal);
            uvs.push(uv0, uv1, uv2, uv3);
            indices.push(baseIndex + 0, baseIndex + 1, baseIndex + 2, baseIndex + 0, baseIndex + 2, baseIndex + 3);
        };
        // Front face (+Z)
        addFace([-halfSize, -halfSize, 0], [halfSize, -halfSize, 0], [halfSize, halfSize, 0], [-halfSize, halfSize, 0], [0.0, 0.0, 1.0], [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0], 0 * 4);
        super(vertices, normals, uvs, indices);
    }
}
