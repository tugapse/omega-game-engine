#version 300 es
precision highp float;

// Final copy of the scene to the bound framebuffer. The scene is drawn in
// linear colour (HDR targets can hold values above 1): this applies the
// exposure, the tone mapping and then the sRGB gamma, and writes depth through
// gl_FragDepth, so what is drawn afterwards (editor grid, gizmos) is still
// hidden by the scene's objects.
in vec2 v_uv;
uniform sampler2D u_color;
uniform highp sampler2D u_depth;
uniform int u_toneMapping;   // 0 none (clamp), 1 Reinhard, 2 ACES (Narkowicz fit)
uniform float u_exposure;
out vec4 fragColor;

vec3 aces(vec3 x) {
    return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

void main() {
    vec4 color = texture(u_color, v_uv);
    vec3 rgb = color.rgb * u_exposure;
    if (u_toneMapping == 1) rgb = rgb / (1.0 + rgb);
    else if (u_toneMapping == 2) rgb = aces(rgb);
    fragColor = vec4(pow(clamp(rgb, 0.0, 1.0), vec3(1.0 / 2.2)), color.a);
    gl_FragDepth = texture(u_depth, v_uv).r;
}
