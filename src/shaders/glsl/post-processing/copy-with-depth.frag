#version 300 es
precision highp float;

// Copies a render target to the bound framebuffer: colour, and depth through
// gl_FragDepth, so what is drawn afterwards (editor grid, gizmos) is still
// hidden by the scene's objects.
in vec2 v_uv;
uniform sampler2D u_color;
uniform highp sampler2D u_depth;
out vec4 fragColor;

void main() {
    fragColor = texture(u_color, v_uv);
    gl_FragDepth = texture(u_depth, v_uv).r;
}
