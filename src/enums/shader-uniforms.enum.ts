/**
  An enumeration of common uniform variable names used in shaders.
 * These strings are used to link JavaScript variables to their corresponding uniforms in GLSL shaders,
 * ensuring consistency and preventing typos.
 */
export enum ShaderUniformsEnum {
  /**
    A uniform for passing elapsed time to the shader.
   */
  U_TIME = "u_time",
  /**
    A uniform for passing the screen resolution (width and height) to the shader.
   */
  U_SCREEN_RESOLUTION = "u_screenResolution",
  /**
    A uniform for the combined Model-View-Projection matrix.
   */
  U_MVP_MATRIX = "u_mvpMatrix",
  /**
    A uniform for passing the base color of a material.
   */
  U_MAT_COLOR = "u_matColor",
  /**
    A uniform for scaling UV coordinates.
   */
  U_UV_SCALE = "u_uvScale",
  /**
    A uniform for the main texture sampler.
   */
  U_MAIN_TEX = "u_mainTex",
  /**
    A uniform for the normal map texture sampler.
   */
  U_NORMAL_MAP = "u_normalMap",
  /**
    A uniform for the strength of the normal map effect.
   */
  U_NORMAL_MAP_STRENGTH = "u_normalMapStrength",
  /**
    A uniform for offsetting UV coordinates.
   */
  U_UV_OFFSET = "u_uvOffset",
  /**
    A uniform for passing ambient light color to the shader.
   */
  U_AMBIENT_LIGHT = "u_ambientLight",
  /**
    A uniform for the model matrix, which transforms from local to world space.
   */
  U_MODEL_MATRIX = "u_modelMatrix",
  /**
    A uniform for the normal matrix, used for transforming normal vectors.
   */
  U_NORMAL_MATRIX = "u_normalMatrix",
  /**
    A uniform for the world matrix, also known as the model matrix.
   */
  U_WORLD_MATRIX = "u_worldMatrix",
  /**
    A uniform for the inverse transpose of the world matrix, used to correctly transform normal vectors.
   */
  U_WORLD_INVERSE_TRANSPOSE_MATRIX = "u_worldInverseTransposeMatrix",
  /**
    An attribute for passing tangent vectors to the shader.
   */
  A_TANGENT = "a_tangent",
  /**
    An attribute for passing bitangent vectors to the shader.
   */
  A_BITANGENT = "a_bitangent",
  /**
    A uniform for passing the specular strength of a material.
   */
  U_SPECULAR_STRENGTH = "u_specularStrength",
  /**
    A uniform for passing the roughness value of a material, affecting specular highlights.
   */
  U_ROUGHNESS = "u_roughness",
  /**
    A uniform for passing the camera's position in world space.
   */
  U_CAMERA_POSITION = "u_cameraPosition",
}