#define MAX_DIRECTIONAL_LIGHTS 5
#define MAX_POINT_LIGHTS 20
#define MAX_SPOT_LIGHTS 20

uniform float u_specularStrength;
uniform float u_roughness;
uniform vec3 u_cameraPosition;
uniform float u_normalMapStrength;

uniform int u_useShadows;
uniform float u_shadowStrength;
uniform highp sampler2DShadow u_shadowMap;
uniform vec2 u_shadowMapSize;

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

float is_in_shadow_pcf(vec4 lightSpacePosition, vec3 finalNormal, vec3 lightDir) {
    vec3 projCoords = lightSpacePosition.xyz / lightSpacePosition.w;
    projCoords = projCoords * 0.5 + 0.5;

    if (projCoords.z > 1.0 || projCoords.z < 0.0 || projCoords.x < 0.0 || projCoords.x > 1.0 || projCoords.y < 0.0 || projCoords.y > 1.0 || u_useShadows == 0) {
        return 1.0;
    }

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

    float shadow = 0.0;
    float filterRadius = 0.0008;
    vec2 texelSize = 1.0 / u_shadowMapSize;
    float bias = max(0.002 * (1.0 - dot(finalNormal, lightDir)), 0.001);

    float angle = rand(projCoords.xy) * 6.283185;
    float cosAngle = cos(angle);
    float sinAngle = sin(angle);

    for (int i = 0; i < 16; i++) {
        vec2 rotatedSample = vec2(
            poissonDisk[i].x * cosAngle - poissonDisk[i].y * sinAngle,
            poissonDisk[i].x * sinAngle + poissonDisk[i].y * cosAngle
        );

        vec2 sampleCoord = projCoords.xy + rotatedSample * filterRadius;
        sampleCoord = clamp(sampleCoord, 0.0005, 0.9995);

        shadow += texture(u_shadowMap, vec3(sampleCoord, projCoords.z - bias));
    }

    float shadowFactor = shadow / 16.0;
    return mix(1.0, shadowFactor, u_shadowStrength);
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

    float shadowFactor = is_in_shadow_pcf(v_lightSpacePosition, normal, lightDir);

    vec3 diffuse = baseColor * intensities.x;
    vec3 specular = vec3(1.0) * intensities.y;
    return (diffuse + specular) * u_dirColor[index].rgb * shadowFactor;
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

    return (diffuse + specular) * u_pointColor[index].rgb * attenuation;
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

    return (diffuse + specular) * u_spotColor[index].rgb * attenuation * coneFactor;
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