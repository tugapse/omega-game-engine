// The terrain's layers and the rules that place them, in TypeScript: the same
// sums as terrain.frag, so the rules can be baked into the splat ("apply the
// rules") and tested in Node. Keep the two in step.
import { GroundKind } from './terrain-textures';
import { MAX_TERRAIN_LAYERS } from './terrain-data';

export interface TerrainLayer {
  name: string;
  /** The texture made in code when there is no image. */
  ground: GroundKind;
  /** Images for the colour (alpha = height) and the normal map (alpha = roughness), optional. */
  albedoUri?: string;
  normalUri?: string;
  /** Metres per repeat of the texture. */
  tiling: number;
  normalStrength: number;
  /** Multiplies the texture's roughness. */
  roughness: number;
  tint: [number, number, number];
  /** Whether the rules place it (else only painting does). Layer 0 is the base and covers everything. */
  auto: boolean;
  /** Heights (m, above the terrain's origin) it covers, and the width of the fade at each end. */
  height: [number, number];
  heightBlend: number;
  /** Slopes (degrees) it covers, and the width of the fade. */
  slope: [number, number];
  slopeBlend: number;
  /** How far (m) noise moves the edges of the rules. */
  noise: number;
}

export function makeLayer(name: string, ground: GroundKind, rules: Partial<TerrainLayer> = {}): TerrainLayer {
  return {
    name, ground, tiling: 6, normalStrength: 1, roughness: 1, tint: [1, 1, 1], auto: true,
    height: [-1000, 1000], heightBlend: 3, slope: [0, 90], slopeBlend: 3, noise: 4,
    ...rules,
  };
}

/** Grass everywhere, dirt on gentle slopes, rock on steep ones, snow high up. */
export function defaultLayers(): TerrainLayer[] {
  return [
    makeLayer('Relva', 'grass', { tiling: 5 }),
    makeLayer('Terra', 'dirt', { tiling: 6, slope: [20, 90], slopeBlend: 5 }),
    makeLayer('Rocha', 'rock', { tiling: 12, slope: [34, 90], slopeBlend: 4, normalStrength: 1.2 }),
    makeLayer('Neve', 'snow', { tiling: 8, height: [55, 1000], heightBlend: 6, slope: [0, 42], slopeBlend: 5, noise: 6 }),
  ];
}

// ---- The GLSL helpers, ported (functions.frag) ----

const fract = (x: number) => x - Math.floor(x);

function hash3D(x: number, y: number, z: number): number {
  let px = fract(x * 0.1031), py = fract(y * 0.1031), pz = fract(z * 0.1031);
  const d = px * (pz + 31.32) + py * (py + 31.32) + pz * (px + 31.32);
  px += d; py += d; pz += d;
  return fract((px + py) * pz);
}

export function noise3D(x: number, y: number, z: number): number {
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
  const fx = x - ix, fy = y - iy, fz = z - iz;
  const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy), uz = fz * fz * (3 - 2 * fz);
  const h = (a: number, b: number, c: number) => hash3D(ix + a, iy + b, iz + c);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  return lerp(
    lerp(lerp(h(0, 0, 0), h(1, 0, 0), ux), lerp(h(0, 1, 0), h(1, 1, 0), ux), uy),
    lerp(lerp(h(0, 0, 1), h(1, 0, 1), ux), lerp(h(0, 1, 1), h(1, 1, 1), ux), uy),
    uz,
  );
}

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

function band(x: number, lo: number, hi: number, blend: number): number {
  const b = Math.max(blend, 0.0001);
  return smoothstep(lo - b, lo + b, x) * (1 - smoothstep(hi - b, hi + b, x));
}

/** The noise the rules share at a world point (as terrain.frag). */
export function ruleNoise(x: number, y: number, z: number): number {
  return noise3D(x * 0.09, y * 0.09, z * 0.09) * 0.65 + noise3D(x * 0.31, y * 0.31, z * 0.31) * 0.35 - 0.5;
}

/**
 * The weight of each layer from the rules alone at a point: `height` above
 * the terrain's origin (m), `slope` in degrees, `n` from ruleNoise. Each layer
 * covers those before it; the weights sum to 1.
 */
export function terrainAutoWeights(layers: TerrainLayer[], height: number, slope: number, n: number, out: Float32Array = new Float32Array(MAX_TERRAIN_LAYERS)): Float32Array {
  out.fill(0);
  const count = Math.min(layers.length, MAX_TERRAIN_LAYERS);
  for (let i = 0; i < count; i++) {
    const l = layers[i];
    let c: number;
    if (i === 0) c = 1;
    else if (!l.auto) c = 0;
    else c = band(height + n * l.noise, l.height[0], l.height[1], l.heightBlend) * band(slope + n * l.noise * 0.5, l.slope[0], l.slope[1], l.slopeBlend);
    for (let j = 0; j < i; j++) out[j] *= 1 - c;
    out[i] = c;
  }
  return out;
}

/** The rules packed for the shader: four vec4 arrays of 8 (see terrain.frag). */
export function packLayerUniforms(layers: TerrainLayer[]): { tiling: Float32Array; height: Float32Array; slope: Float32Array; tint: Float32Array } {
  const tiling = new Float32Array(MAX_TERRAIN_LAYERS * 4);
  const height = new Float32Array(MAX_TERRAIN_LAYERS * 4);
  const slope = new Float32Array(MAX_TERRAIN_LAYERS * 4);
  const tint = new Float32Array(MAX_TERRAIN_LAYERS * 4);
  layers.slice(0, MAX_TERRAIN_LAYERS).forEach((l, i) => {
    tiling.set([l.tiling, l.normalStrength, l.roughness, l.auto ? 1 : 0], i * 4);
    height.set([l.height[0], l.height[1], l.heightBlend, l.noise], i * 4);
    slope.set([l.slope[0], l.slope[1], l.slopeBlend, 0], i * 4);
    tint.set([l.tint[0], l.tint[1], l.tint[2], 1], i * 4);
  });
  return { tiling, height, slope, tint };
}
