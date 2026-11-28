#version 300 es
precision highp float;

uniform int u_fogEnabled; 

uniform sampler2D u_mainTex;
uniform vec4 u_matColor;
uniform vec2 u_uvScale;
uniform vec2 u_uvOffset;
uniform float u_emmission;
uniform float u_id;
uniform float u_sid;

in vec2 v_uv;
in vec3 v_normal;
in vec3 v_position;
in vec3 v_tangent;
in vec3 v_bitangent;

out vec4 fragColor;

#ifdef INSTANCED
in float v_tint;
#endif
#ifdef GRASS
// How dark the foot is beside the tip (uv v from 0 at the foot to 1 at the tip).
uniform float u_tipShade;
#endif

@INCLUDE_UTIL_FUNC
@INCLUDE_LIGHT_FUNC
@INCLUDE_FOG_FUNC
void main() {
    vec2 uv = (v_uv * u_uvScale) + u_uvOffset;
    vec4 sampledTexColor = texture(u_mainTex, uv);
    
    // We add a tiny offset (0.0001) to avoid pow(0, ...) undefined behavior in some older drivers
    vec3 linearTexColor = pow(sampledTexColor.rgb + 0.0001, vec3(2.2));
    vec3 linearMatColor = pow(u_matColor.rgb + 0.0001, vec3(2.2)); 
    
    vec4 baseColor = vec4(linearTexColor * linearMatColor, (u_matColor.a * sampledTexColor.a));
#ifdef INSTANCED
    baseColor.rgb *= 0.7 + 0.6 * v_tint;
#endif
#ifdef GRASS
    baseColor.rgb *= mix(1.0 - u_tipShade, 1.0, v_uv.y);
#endif

    // Lighting calculation (math is now accurately happening in linear space)
    vec3 totalLitColorRGB = calculateTotalLitColor(baseColor.rgb, uv);

    // Linear and unclamped: lights may go above 1 (HDR); the pipeline's final
    // copy tone maps and gamma-encodes.
    vec4 finalColor = vec4(max(totalLitColorRGB, 0.0), baseColor.a);
    vec3 foggedRGB = finalColor.rgb;

    // Fog application (fog math also blends much better in linear space)
    if (u_fogEnabled == 1) {
        vec3 mainLightDir = u_lightCounts.x > 0 ? u_dirDirection[0].xyz : vec3(0.0);
        vec3 mainLightCol = u_lightCounts.x > 0 ? u_dirColor[0].rgb : vec3(0.0);
        
        foggedRGB = applyFog(
            finalColor.rgb, 
            v_fogDistance, 
            v_position, 
            u_cameraPosition, 
            u_lightCounts.x, 
            mainLightDir, 
            mainLightCol
        );
    }
  
    fragColor = vec4(max(foggedRGB, 0.0), finalColor.a);
}