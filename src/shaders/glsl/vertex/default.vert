#version 300 es

// This replaces individual camera uniforms
layout(std140) uniform CameraBlock {
    mat4 u_viewMatrix;
    mat4 u_projectionMatrix;
};

uniform mat4 u_worldMatrix;
uniform mat3 u_worldInverseTransposeMatrix;

uniform float u_time;
uniform vec2 u_screenResolution;

uniform float u_fogDistance;

in vec3 a_position;
in vec3 a_normal;
in vec2 a_uv;
in vec3 a_tangent;
in vec3 a_bitangent;

#ifdef SKINNED
// Skinning: 4 joints per vertex; the joint matrices are rows of a float
// texture, 4 texels (columns) per joint, written by SkinnedMeshRendererBehaviour.
in uvec4 a_joints;
in vec4 a_weights;
uniform highp sampler2D u_jointTexture;

mat4 jointMatrix(uint joint) {
  int row = int(joint);
  return mat4(
    texelFetch(u_jointTexture, ivec2(0, row), 0),
    texelFetch(u_jointTexture, ivec2(1, row), 0),
    texelFetch(u_jointTexture, ivec2(2, row), 0),
    texelFetch(u_jointTexture, ivec2(3, row), 0));
}

mat4 skinMatrix() {
  return a_weights.x * jointMatrix(a_joints.x)
       + a_weights.y * jointMatrix(a_joints.y)
       + a_weights.z * jointMatrix(a_joints.z)
       + a_weights.w * jointMatrix(a_joints.w);
}
#endif

// Outputs to the fragment shader
out vec2 v_uv;
out vec3 v_normal;
out vec3 v_position;
out vec3 v_position_view;
out vec3 v_tangent;
out vec3 v_bitangent;
out float v_fogDistance;

void main() {
  vec4 localPosition = vec4(a_position, 1.0);
  vec3 localNormal = a_normal;
  vec3 localTangent = a_tangent;
  vec3 localBitangent = a_bitangent;
#ifdef SKINNED
  // Joint matrices are in mesh space, so the world matrices apply after.
  // mat3(skin) is right for normals while bones have no non-uniform scale.
  mat4 skin = skinMatrix();
  localPosition = skin * localPosition;
  localNormal = mat3(skin) * localNormal;
  localTangent = mat3(skin) * localTangent;
  localBitangent = mat3(skin) * localBitangent;
#endif

  // Standard vertex transformations
  vec4 worldPosition = u_worldMatrix * localPosition;
  
  vec4 viewPosition = u_viewMatrix * worldPosition;

  v_position = worldPosition.xyz;
  v_position_view = viewPosition.xyz;
  v_normal = u_worldInverseTransposeMatrix * localNormal;
  v_tangent = u_worldInverseTransposeMatrix * localTangent;
  v_bitangent = u_worldInverseTransposeMatrix * localBitangent;
  v_uv = a_uv;

  // Calculate the distance for fog (using true radial distance from the camera)
  v_fogDistance = length(viewPosition.xyz) + u_fogDistance;

  // We multiply the matrices in order (Projection * View * Model) directly in the shader
  gl_Position = u_projectionMatrix * viewPosition;
  gl_PointSize = 10.0;
}