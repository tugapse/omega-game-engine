#version 300 es
uniform mat4 u_modelMatrix;
in vec4 a_position;

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

#ifdef INSTANCED
in vec4 a_instanceA;
in vec4 a_instanceB;
#endif

void main() {
#if defined(INSTANCED)
    float ic = cos(a_instanceA.w), isn = sin(a_instanceA.w);
    vec3 p = a_position.xyz;
    gl_Position = u_modelMatrix * vec4((p.x * ic - p.z * isn) * a_instanceB.x + a_instanceA.x, p.y * a_instanceB.y + a_instanceA.y, (p.x * isn + p.z * ic) * a_instanceB.x + a_instanceA.z, 1.0);
#elif defined(SKINNED)
    gl_Position = u_modelMatrix * (skinMatrix() * a_position);
#else
    gl_Position = u_modelMatrix * a_position;
#endif
}
