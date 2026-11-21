#define MAX_DIRECTIONAL_LIGHTS 5
#define MAX_POINT_LIGHTS 20
#define MAX_SPOT_LIGHTS 20

uniform float u_specularStrength;
uniform float u_roughness;
uniform vec3 u_cameraPosition;
uniform float u_normalMapStrength;

#define MAX_SHADOW_VIEWS 17
#define MAX_SHADOW_SLOTS 7

// Shadow views of the frame, all in one depth atlas (core/render/shadows.ts:
// keep the order and sizes in sync with SHADOWS_LAYOUT).
layout(std140) uniform ShadowsBlock {
    mat4 u_shadowMatrix[MAX_SHADOW_VIEWS];  // world -> light clip space
    vec4 u_shadowRect[MAX_SHADOW_VIEWS];    // atlas uv: x, y, size, size
    vec4 u_shadowParams[MAX_SHADOW_SLOTS];  // depth bias, normal bias, toward-light bias, first view
    vec4 u_shadowExtra[MAX_SHADOW_SLOTS];   // x: strength (per light)
    vec4 u_shadowAtlas;                     // 1/atlas size, 0, enabled
};
uniform highp sampler2DShadow u_shadowAtlasMap;
uniform int u_receiveShadows;

uniform sampler2D u_normalMap;
uniform sampler2D u_specularMap;
uniform sampler2D u_roughnessMap;
uniform sampler2D u_aoMap;
uniform sampler2D u_emissiveMap;

// All lights of the frame, uploaded once per frame (core/render/lights-ubo.ts:
// keep the order and sizes in sync with LIGHTS_LAYOUT).
layout(std140) uniform LightsBlock {
    vec4 u_lightAmbient;
    ivec4 u_lightCounts;                        // x directional, y point, z spot
    vec4 u_dirDirection[MAX_DIRECTIONAL_LIGHTS];
    vec4 u_dirColor[MAX_DIRECTIONAL_LIGHTS];    // w: shadow slot (-1 none)
    vec4 u_pointPosition[MAX_POINT_LIGHTS];     // w: range
    vec4 u_pointColor[MAX_POINT_LIGHTS];        // w: shadow slot
    vec4 u_pointAtten[MAX_POINT_LIGHTS];        // constant, linear, quadratic
    vec4 u_spotPosition[MAX_SPOT_LIGHTS];       // w: range
    vec4 u_spotDirection[MAX_SPOT_LIGHTS];
    vec4 u_spotColor[MAX_SPOT_LIGHTS];          // w: shadow slot
    vec4 u_spotCone[MAX_SPOT_LIGHTS];           // cos inner, cos outer
    vec4 u_spotAtten[MAX_SPOT_LIGHTS];
};

// Face of a point light's cube for a direction from the light: +X -X +Y -Y +Z -Z
// (same rule as cubeFaceFor in shadows.ts).
int cubeFace(vec3 v) {
    vec3 a = abs(v);
    if (a.x >= a.y && a.x >= a.z) return v.x > 0.0 ? 0 : 1;
    if (a.y >= a.z) return v.y > 0.0 ? 2 : 3;
    return v.z > 0.0 ? 4 : 5;
}

// 16-tap rotated Poisson PCF inside one atlas tile. Returns 1 lit, 0 shadowed.
float sampleShadowView(int view, vec3 position, float depthBias) {
    vec4 clip = u_shadowMatrix[view] * vec4(position, 1.0);
    if (clip.w <= 0.0) return 1.0;
    vec3 p = clip.xyz / clip.w * 0.5 + 0.5;
    if (p.z > 1.0 || p.x < 0.0 || p.x > 1.0 || p.y < 0.0 || p.y > 1.0) return 1.0;

    vec2 poissonDisk[16] = vec2[](
        vec2(-0.94201624, -0.39906216), vec2(0.94558609, -0.76890725),
        vec2(-0.09418410, -0.92938870), vec2(0.34495938, 0.29387760),
        vec2(-0.91588581, 0.45778432), vec2(-0.81544232, -0.87912464),
        vec2(-0.38277543, 0.27676845), vec2(0.97484398, 0.75648379),
        vec2(0.44323325, -0.97511554), vec2(0.53742981, -0.47373420),
        vec2(-0.26496911, -0.41893023), vec2(0.79197514, 0.19090188),
        vec2(-0.24188840, 0.99706507), vec2(-0.81409555, 0.14304622),
        vec2(0.19984126, 0.78641367), vec2(0.14383161, -0.14100790)
    );

    vec4 rect = u_shadowRect[view];
    float texel = u_shadowAtlas.x;
    // Stay a texel and a half inside the tile so no tap reads the neighbour.
    vec2 lo = rect.xy + vec2(texel * 1.5);
    vec2 hi = rect.xy + rect.zw - vec2(texel * 1.5);
    vec2 uv = rect.xy + p.xy * rect.zw;
    float radius = texel * 2.5;

    float angle = rand(p.xy) * 6.283185;
    float c = cos(angle);
    float s = sin(angle);
    float lit = 0.0;
    for (int i = 0; i < 16; i++) {
        vec2 o = vec2(poissonDisk[i].x * c - poissonDisk[i].y * s, poissonDisk[i].x * s + poissonDisk[i].y * c);
        lit += texture(u_shadowAtlasMap, vec3(clamp(uv + o * radius, lo, hi), p.z - depthBias));
    }
    return lit / 16.0;
}

// Light reaching a point from shadow slot `slotF` (-1: no shadow).
// lightPos is only used for point lights (to pick the cube face).
float shadowFactor(float slotF, vec3 normal, vec3 toLight, vec3 lightPos, bool isPoint) {
    int slot = int(slotF);
    if (slot < 0 || u_receiveShadows == 0 || u_shadowAtlas.z < 0.5) return 1.0;
    vec4 prm = u_shadowParams[slot];
    float ndotl = clamp(dot(normal, toLight), 0.0, 1.0);
    // Normal offset grows at grazing angles, where acne appears first.
    vec3 position = v_position + normal * prm.y * (2.0 - ndotl) + toLight * prm.z;
    int view = int(prm.w) + (isPoint ? cubeFace(v_position - lightPos) : 0);
    float lit = sampleShadowView(view, position, prm.x * (2.0 - ndotl));
    return mix(1.0, lit, u_shadowExtra[slot].x);
}

vec3 getFinalNormal(vec2 uv) {
    vec3 n = normalize(v_normal);
    
    if (u_normalMapStrength > 0.0) {
        if (length(v_tangent) > 0.0001 && length(v_bitangent) > 0.0001) {
            vec3 normalFromMap = texture(u_normalMap, uv).rgb * 2.0 - 1.0;
            mat3 tbnMatrix = mat3(normalize(v_tangent), normalize(v_bitangent), n);
            vec3 perturbedNormal = tbnMatrix * normalFromMap;
            return normalize(mix(n, normalize(perturbedNormal), u_normalMapStrength));
        }
    }
    return n;
}

vec2 calculateBlinnPhong(vec3 lightDir, vec3 viewDir, vec3 normal, float shininess, float specStrength) {
    float diffuseIntensity = max(dot(normal, lightDir), 0.0);
    float specularIntensity = 0.0;
    
    if (diffuseIntensity > 0.0) {
        vec3 halfVecSum = lightDir + viewDir;
        vec3 halfVec = length(halfVecSum) > 0.0001 ? normalize(halfVecSum) : normal;
        specularIntensity = pow(max(0.0, dot(normal, halfVec)), shininess) * specStrength;
    }
    return vec2(diffuseIntensity, specularIntensity);
}

vec3 applyDirectionalLight(int index, vec3 baseColor, vec3 viewDir, vec3 normal, float shininess, float specStrength) {
    vec3 lightDir = normalize(-u_dirDirection[index].xyz);
    vec2 intensities = calculateBlinnPhong(lightDir, viewDir, normal, shininess, specStrength);
    
    if (intensities.x <= 0.0) return vec3(0.0);

    float shadow = shadowFactor(u_dirColor[index].w, normal, lightDir, vec3(0.0), false);

    vec3 diffuse = baseColor * intensities.x;
    vec3 specular = vec3(1.0) * intensities.y;
    return (diffuse + specular) * u_dirColor[index].rgb * shadow;
}

vec3 applyPointLight(int index, vec3 baseColor, vec3 viewDir, vec3 normal, float shininess, float specStrength) {
    vec3 lightVec = u_pointPosition[index].xyz - v_position;
    vec3 lightDir = normalize(lightVec);

    vec2 intensities = calculateBlinnPhong(lightDir, viewDir, normal, shininess, specStrength);
    if (intensities.x <= 0.0) return vec3(0.0);

    float distance = length(lightVec);
    float attenuation = 1.0 / (u_pointAtten[index].x +
                               u_pointAtten[index].y * distance +
                               u_pointAtten[index].z * (distance * distance));

    vec3 diffuse = baseColor * intensities.x;
    vec3 specular = vec3(1.0) * intensities.y;
    float shadow = shadowFactor(u_pointColor[index].w, normal, lightDir, u_pointPosition[index].xyz, true);

    return (diffuse + specular) * u_pointColor[index].rgb * attenuation * shadow;
}

vec3 applySpotLight(int index, vec3 baseColor, vec3 viewDir, vec3 normal, float shininess, float specStrength) {
    vec3 lightVec = u_spotPosition[index].xyz - v_position;
    vec3 lightDir = normalize(lightVec);

    vec2 intensities = calculateBlinnPhong(lightDir, viewDir, normal, shininess, specStrength);
    if (intensities.x <= 0.0) return vec3(0.0);

    float angleCos = dot(lightDir, -u_spotDirection[index].xyz);
    float coneFactor = smoothstep(u_spotCone[index].y, u_spotCone[index].x, angleCos);
    
    if (coneFactor <= 0.0) return vec3(0.0);

    float distance = length(lightVec);
    float attenuation = 1.0 / (u_spotAtten[index].x +
                               u_spotAtten[index].y * distance +
                               u_spotAtten[index].z * (distance * distance));
    
    vec3 diffuse = baseColor * intensities.x;
    vec3 specular = vec3(1.0) * intensities.y;
    float shadow = shadowFactor(u_spotColor[index].w, normal, lightDir, vec3(0.0), false);

    return (diffuse + specular) * u_spotColor[index].rgb * attenuation * coneFactor * shadow;
}

vec3 calculateTotalLitColor(vec3 baseColor, vec2 uv) {
    vec3 finalNormal = getFinalNormal(uv);
    
    vec3 cameraDelta = u_cameraPosition - v_position;
    vec3 viewDir = length(cameraDelta) > 0.0001 ? normalize(cameraDelta) : vec3(0.0, 0.0, 1.0);
    
    float sampledSpecular = texture(u_specularMap, uv).r;
    float sampledRoughness = texture(u_roughnessMap, uv).r;
    
    float finalRoughness = sampledRoughness * u_roughness;
    
    // Fade out specular intensity completely on rough surfaces to prevent the milky wash
    float finalSpecularStrength = sampledSpecular * u_specularStrength * (1.0 - finalRoughness);
    
    float clampedRoughness = clamp(finalRoughness * finalRoughness, 0.001, 0.999);
    float shininess = (2.0 / clampedRoughness) - 2.0;

    float ao = texture(u_aoMap, uv).r;
    vec3 emissive = texture(u_emissiveMap, uv).rgb;

    vec3 totalLitColorRGB = (u_lightAmbient.rgb * baseColor * ao) + emissive;

    for (int i = 0; i < u_lightCounts.x; ++i) {
        totalLitColorRGB += applyDirectionalLight(i, baseColor, viewDir, finalNormal, shininess, finalSpecularStrength);
    }

    for (int i = 0; i < u_lightCounts.y; ++i) {
        totalLitColorRGB += applyPointLight(i, baseColor, viewDir, finalNormal, shininess, finalSpecularStrength);
    }

    for (int i = 0; i < u_lightCounts.z; ++i) {
        totalLitColorRGB += applySpotLight(i, baseColor, viewDir, finalNormal, shininess, finalSpecularStrength);
    }
    
    return totalLitColorRGB;
}