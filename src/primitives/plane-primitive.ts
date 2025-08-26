import { vec2, vec3 } from "gl-matrix";
import { MeshData } from "../core/mesh"; // Assuming MeshData is in this path

export class PlanePrimitive extends MeshData {
  constructor(resolution: number = 1) { // Removed 'size' parameter, now only takes resolution
    // Ensure resolution is at least 1
    resolution = Math.max(1, Math.floor(resolution));

    // The total size of the plane is now equal to its resolution
    const size = resolution;
    const halfSize = size / 2.0;
    const segmentSize = 1.0; // Each segment is now 1 unit wide/deep

    const vertices: vec3[] = [];
    const normals: vec3[] = [];
    const uvs: vec2[] = [];
    const indices: number[] = [];

    // Generate vertices, normals, and UVs for the grid
    for (let i = 0; i <= resolution; i++) { // Iterate along Z-axis (depth)
      for (let j = 0; j <= resolution; j++) { // Iterate along X-axis (width)
        // Calculate X and Z coordinates for the vertex on the XZ plane
        // Vertices are placed at multiples of segmentSize from the center
        const x = -halfSize + j * segmentSize;
        const z = -halfSize + i * segmentSize;

        // Add vertex (X, Y=0, Z) - Y is now the vertical "up" axis for the plane
        vertices.push(vec3.fromValues(x, 0.0, z));

        // Add normal (always pointing in +Y direction for a floor on XZ plane)
        normals.push(vec3.fromValues(0.0, 1.0, 0.0));

        // Add UV coordinates (scale from 0 to 1 across the plane's total size)
        uvs.push(vec2.fromValues(j / resolution, i / resolution));
      }
    }

    // Generate indices for the triangles
    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        // Calculate the base index for the current quad
        const baseIndex = i * (resolution + 1) + j;

        // Triangle 1 (bottom-left, top-left, top-right)
        indices.push(
          baseIndex,
          baseIndex + (resolution + 1),
          baseIndex + (resolution + 1) + 1
        );

        // Triangle 2 (bottom-left, top-right, bottom-right)
        indices.push(
          baseIndex,
          baseIndex + (resolution + 1) + 1,
          baseIndex + 1
        );
      }
    }

    super(vertices, normals, uvs, indices);
  }
}
