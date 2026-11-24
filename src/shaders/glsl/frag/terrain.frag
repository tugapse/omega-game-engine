#version 300 es
precision highp float;
precision highp sampler2DArray;

// The terrain material (terrain/terrain-material.ts): up to 8 layers, each
// placed by rules on height and slope, then by the painted splat on top, and
// blended by the height of their textures. Keep the rules in step with
// terrainAutoWeights in terrain-rules.ts, which bakes them into the splat.

#define MAX_LAYERS 8

uniform int u_fogEnabled;

uniform highp sampler2DArray u_layerAlbedo;   // rgb colour, a height
uniform highp sampler2DArray u_layerNormal;   // rgb normal, a roughness
uniform sampler2D u_splat0;                   // painted weights of layers 0-3
uniform sampler2D u_splat1;                   // layers 4-7

uniform int u_layerCount;
uniform vec4 u_layerTiling[MAX_LAYERS];   // metres per repeat, normal strength, roughness, auto (1/0)
uniform vec4 u_layerHeight[MAX_LAYERS];   // min, max, blend (m), noise (m)
uniform vec4 u_layerSlope[MAX_LAYERS];    // min, max, blend (degrees), 0
uniform vec4 u_layerTint[MAX_LAYERS];     // rgb tint, 0
uniform float u_heightBlend;              // depth of the blend by texture height (0 = plain mix)
uniform float u_terrainBaseY;             // world height of the terrain's origin
uniform float u_macroVariation;           // large-scale brightness variation (0 to 1)
uniform vec4 u_brush;                     // the editing brush: world x, z, radius, shown (1/0)

in vec2 v_uv;
in vec3 v_normal;
in vec3 v_position;
in vec3 v_tangent;
in vec3 v_bitangent;

out vec4 fragColor;

@INCLUDE_UTIL_FUNC
@INCLUDE_LIGHT_FUNC
@INCLUDE_FOG_FUNC

float band(float x, float lo, float hi, float blend) {
    float b = max(blend, 0.0001);
    return smoothstep(lo - b, lo + b, x) * (1.0 - smoothstep(hi - b, hi + b, x));
}

// How much layer i covers by its rules (layer 0 is the base: everywhere).
float ruleCover(int i, float height, float slope, float n) {
    if (i == 0) return 1.0;
    if (u_layerTiling[i].w < 0.5) return 0.0;
    vec4 h = u_layerHeight[i];
    vec4 s = u_layerSlope[i];
    float hh = height + n * h.w;
    float ss = slope + n * h.w * 0.5;
    return band(hh, h.x, h.y, h.z) * band(ss, s.x, s.y, s.z);
}

vec4 sampleLayer(highp sampler2DArray tex, int i, vec3 p, vec3 blend, bool tri) {
    float scale = 1.0 / max(u_layerTiling[i].x, 0.01);
    if (!tri) return texture(tex, vec3(p.xz * scale, float(i)));
    return texture(tex, vec3(p.zy * scale, float(i))) * blend.x
         + texture(tex, vec3(p.xz * scale, float(i))) * blend.y
         + texture(tex, vec3(p.xy * scale, float(i))) * blend.z;
}

void main() {
    vec3 geo = normalize(v_normal);
    float slope = degrees(acos(clamp(geo.y, 0.0, 1.0)));
    float height = v_position.y - u_terrainBaseY;
    // One noise for every rule, so the borders of the layers wander a little.
    float n = noise3D(v_position * 0.09) * 0.65 + noise3D(v_position * 0.31) * 0.35 - 0.5;

    // 1. The rules: each layer covers those before it.
    float w[MAX_LAYERS];
    for (int i = 0; i < MAX_LAYERS; i++) w[i] = 0.0;
    for (int i = 0; i < MAX_LAYERS; i++) {
        if (i >= u_layerCount) break;
        float c = ruleCover(i, height, slope, n);
        for (int j = 0; j < i; j++) w[j] *= 1.0 - c;
        w[i] = c;
    }

    // 2. The painting on top: its weights sum to how much it covers.
    vec4 s0 = texture(u_splat0, v_uv);
    vec4 s1 = texture(u_splat1, v_uv);
    float painted[MAX_LAYERS] = float[](s0.r, s0.g, s0.b, s0.a, s1.r, s1.g, s1.b, s1.a);
    float cover = clamp(s0.r + s0.g + s0.b + s0.a + s1.r + s1.g + s1.b + s1.a, 0.0, 1.0);

    // 3. Sample the layers that show, blended by their texture heights.
    bool tri = false;
#ifdef TRIPLANAR
    tri = geo.y < 0.7;
#endif
    vec3 tb = pow(abs(geo), vec3(4.0));
    tb /= max(tb.x + tb.y + tb.z, 0.0001);

    vec4 albedo[MAX_LAYERS];
    float score[MAX_LAYERS];
    float best = -1.0;
    for (int i = 0; i < MAX_LAYERS; i++) {
        score[i] = -1.0;
        if (i >= u_layerCount) break;
        w[i] = w[i] * (1.0 - cover) + painted[i];
        if (w[i] < 0.004) continue;
        albedo[i] = sampleLayer(u_layerAlbedo, i, v_position, tb, tri);
        score[i] = w[i] + albedo[i].a * u_heightBlend;
        best = max(best, score[i]);
    }
    // Layers within the blend depth of the strongest show, the higher texels first.
    float floorScore = best - max(u_heightBlend, 0.0001) - 0.12;
    vec3 color = vec3(0.0);
    vec3 detail = vec3(0.0);
    float rough = 0.0;
    float total = 0.0;
    for (int i = 0; i < MAX_LAYERS; i++) {
        if (i >= u_layerCount) break;
        if (score[i] < 0.0) continue;
        float b = u_heightBlend > 0.0 ? max(score[i] - floorScore, 0.0) : w[i];
        if (b <= 0.0) continue;
        vec4 nm = texture(u_layerNormal, vec3(v_position.xz / max(u_layerTiling[i].x, 0.01), float(i)));
        color += pow(albedo[i].rgb + 0.0001, vec3(2.2)) * u_layerTint[i].rgb * b;
        detail += vec3((nm.rg * 2.0 - 1.0) * u_layerTiling[i].y, nm.b * 2.0 - 1.0) * b;
        rough += nm.a * u_layerTiling[i].z * b;
        total += b;
    }
    total = max(total, 0.0001);
    color /= total;
    detail /= total;
    rough /= total;

    // Large patches a little lighter or darker, against visible tiling.
    color *= 1.0 + (noise3D(v_position * 0.012) - 0.5) * u_macroVariation;

    // The normal map is laid flat on the ground (u along x, v along z), so it
    // is turned onto the surface; it fades on steep sides.
    vec3 t = normalize(vec3(1.0, 0.0, 0.0) - geo * geo.x);
    vec3 bt = normalize(cross(t, geo));
    vec3 normal = normalize(mat3(t, bt, geo) * detail);
    normal = normalize(mix(geo, normal, clamp(geo.y * 1.4, 0.0, 1.0)));

    vec3 lit = calculateLitColorWithNormal(color, normal, 0.04 * (1.0 - rough), rough, 1.0, vec3(0.0));

    vec3 fogged = lit;
    if (u_fogEnabled == 1) {
        vec3 mainLightDir = u_lightCounts.x > 0 ? u_dirDirection[0].xyz : vec3(0.0);
        vec3 mainLightCol = u_lightCounts.x > 0 ? u_dirColor[0].rgb : vec3(0.0);
        fogged = applyFog(lit, v_fogDistance, v_position, u_cameraPosition, u_lightCounts.x, mainLightDir, mainLightCol);
    }
    // The brush: a ring and a dot where it would act.
    if (u_brush.w > 0.5) {
        float d = distance(v_position.xz, u_brush.xy);
        float width = max(u_brush.z * 0.035, 0.12);
        float ring = 1.0 - smoothstep(width * 0.5, width, abs(d - u_brush.z));
        float centre = 1.0 - smoothstep(width * 0.6, width, d);
        fogged = mix(fogged, vec3(1.0, 0.82, 0.25), max(ring, centre) * 0.9);
        fogged = mix(fogged, fogged * 1.15 + vec3(0.03), step(d, u_brush.z) * 0.35);
    }
    fragColor = vec4(max(fogged, 0.0), 1.0);
}
