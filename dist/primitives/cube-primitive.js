import { MeshData } from "../core/mesh";
export class CubePrimitive extends MeshData {
    static instanciate(vertices, normals, uvs, indices) {
        return new CubePrimitive();
    }
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
        addFace([-halfSize, -halfSize, halfSize], [halfSize, -halfSize, halfSize], [halfSize, halfSize, halfSize], [-halfSize, halfSize, halfSize], [0.0, 0.0, 1.0], [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0], 0 * 4);
        // Back face (-Z)
        addFace([-halfSize, halfSize, -halfSize], [halfSize, halfSize, -halfSize], [halfSize, -halfSize, -halfSize], [-halfSize, -halfSize, -halfSize], [0.0, 0.0, -1.0], [0.0, 1.0], [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], 1 * 4);
        // Top face (+Y)
        addFace([-halfSize, halfSize, halfSize], [halfSize, halfSize, halfSize], [halfSize, halfSize, -halfSize], [-halfSize, halfSize, -halfSize], [0.0, 1.0, 0.0], [0.0, 1.0], [1.0, 1.0], [1.0, 0.0], [0.0, 0.0], 2 * 4);
        // Bottom face (-Y)
        addFace([-halfSize, -halfSize, -halfSize], [halfSize, -halfSize, -halfSize], [halfSize, -halfSize, halfSize], [-halfSize, -halfSize, halfSize], [0.0, -1.0, 0.0], [0.0, 1.0], [1.0, 1.0], [1.0, 0.0], [0.0, 0.0], 3 * 4);
        // Right face (+X)
        addFace([halfSize, -halfSize, halfSize], [halfSize, -halfSize, -halfSize], [halfSize, halfSize, -halfSize], [halfSize, halfSize, halfSize], [1.0, 0.0, 0.0], [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0], 4 * 4);
        // Left face (-X)
        addFace([-halfSize, -halfSize, -halfSize], [-halfSize, -halfSize, halfSize], [-halfSize, halfSize, halfSize], [-halfSize, halfSize, -halfSize], [-1.0, 0.0, 0.0], [0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0], 5 * 4);
        super(vertices, normals, uvs, indices);
    }
}
