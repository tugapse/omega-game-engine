
// Hashes without sin() (Dave Hoskins, "Hash without Sine"). The classic
// fract(sin(x) * 43758.5) needs an exact sin() of large arguments: phone GPUs
// (Mali, Adreno) reduce the range with little precision, and the noise turns
// into bands and hard straight lines (the clouds near the horizon, where the
// coordinates are large). These only use fract() and products.
float rand(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

float hash3D(vec3 p) {
    vec3 p3 = fract(p * 0.1031);
    p3 += dot(p3, p3.zyx + 31.32);
    return fract((p3.x + p3.y) * p3.z);
}

float noise3D(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    
    vec3 u = f * f * (3.0 - 2.0 * f);

    return mix(mix(mix(hash3D(i + vec3(0.0, 0.0, 0.0)), hash3D(i + vec3(1.0, 0.0, 0.0)), u.x),
                   mix(hash3D(i + vec3(0.0, 1.0, 0.0)), hash3D(i + vec3(1.0, 1.0, 0.0)), u.x), u.y),
               mix(mix(hash3D(i + vec3(0.0, 0.0, 1.0)), hash3D(i + vec3(1.0, 0.0, 1.0)), u.x),
                   mix(hash3D(i + vec3(0.0, 1.0, 1.0)), hash3D(i + vec3(1.0, 1.0, 1.0)), u.x), u.y), u.z);
}

