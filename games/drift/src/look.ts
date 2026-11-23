// The visuals: the track (asphalt, kerbs, walls, the start line) as strips
// built from its centre line, cut into pieces that hide off screen; grass,
// trees round it and the light; the car (a body and four wheels that steer
// and roll). The plane's (x, y) is the world's (x, -z); y is up.
import { vec2, vec3 } from 'gl-matrix';
import {
  Color, CubePrimitive, RenderLayer, DirectionalLight, LathePrimitive, Light, LitMaterial, LitShader, Mesh, MeshData,
  MeshRendererBehaviour, Resources, Scene, SceneEntity, SpherePrimitive, Texture,
} from '../../../src';
import { Car } from './car';
import { THEMES } from './themes';
import { Track } from './track';

type Gl = WebGL2RenderingContext;

export async function canvasTexture(gl: Gl, size: number, draw: (c: CanvasRenderingContext2D, s: number) => void, height = size): Promise<Texture> {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = height;
  draw(canvas.getContext('2d')!, size);
  return Resources.for(gl).getTexture(canvas.toDataURL('image/png'));
}

export async function material(gl: Gl, color: number[], opts: { tex?: Texture; glow?: Texture; specular?: number; roughness?: number; alpha?: number } = {}): Promise<LitMaterial> {
  const m = new LitMaterial();
  m.color = new Color(color[0], color[1], color[2], opts.alpha ?? 1);
  m.mainTex = opts.tex ?? await Resources.for(gl).getTexture('builtin://white');
  if (opts.glow) m.emissiveTex = opts.glow;
  m.specularStrength = opts.specular ?? 0.08;
  m.roughness = opts.roughness ?? 0.8;
  return m;
}

export function makeEntity(scene: Scene, name: string, parent?: SceneEntity): SceneEntity {
  const e = new SceneEntity(name);
  if (parent) e.transform.setParent(parent.transform);
  scene.addEntity(e);
  return e;
}

/** Draws `meshData` on `entity`; see-through when the material's colour has alpha under 1. */
export function render(gl: Gl, entity: SceneEntity, meshData: MeshData, m: LitMaterial): MeshRendererBehaviour {
  const mesh = new Mesh();
  mesh.meshData = meshData;
  const renderer = new MeshRendererBehaviour(gl);
  renderer.mesh = mesh;
  renderer.shader = new LitShader(gl, m);
  if (m.color.a < 1) {
    renderer.renderLayer = RenderLayer.TRANSPARENT;
    renderer.castShadows = false;
    renderer.writeToDephBuffer = false;
  }
  entity.addBehaviour(renderer);
  return renderer;
}

/** Copies of `part`, each moved and scaled, as one mesh (the engine has no instancing). */
export function merge(part: MeshData, places: { at: number[]; scale: number[] }[]): MeshData {
  const v: vec3[] = [], n: vec3[] = [], uv: vec2[] = [], idx: number[] = [];
  for (const { at, scale } of places) {
    const base = v.length;
    part.vertices.forEach((p, i) => {
      v.push([p[0] * scale[0] + at[0], p[1] * scale[1] + at[1], p[2] * scale[2] + at[2]]);
      const q = part.normals[i] ?? [0, 1, 0];
      const nx = q[0] / scale[0], ny = q[1] / scale[1], nz = q[2] / scale[2], l = Math.hypot(nx, ny, nz) || 1;
      n.push([nx / l, ny / l, nz / l]);
      uv.push(part.uvs[i] ?? [0, 0]);
    });
    for (const i of part.indices) idx.push(base + i);
  }
  const m = new MeshData(v, n, uv, idx);
  m.providedNormals = true;
  return m;
}

/** Samples per piece of the track's meshes (about a metre each). */
const PIECE = 60;

/**
 * A flat band along the track from `a` to `b` metres off the centre line
 * (positive left), at height `y`, for samples i0..i1; v runs along it, one
 * unit per `vEvery` metres, and u across from 0 at `a` to 1 at `b`.
 */
function band(track: Track, i0: number, i1: number, a: number, b: number, y: number, vEvery: number): MeshData {
  const v: vec3[] = [], n: vec3[] = [], uv: vec2[] = [], idx: number[] = [];
  const ss = track.samples;
  for (let i = i0; i <= i1; i++) {
    const p = ss[i % ss.length];
    const s = i * (track.length / ss.length);
    for (const [off, u] of [[a, 0], [b, 1]]) {
      v.push([p.x + p.nx * off, y, -(p.y + p.ny * off)]);
      n.push([0, 1, 0]);
      uv.push([u, s / vEvery]);
    }
    if (i > i0) {
      const k = v.length - 4;
      idx.push(k, k + 1, k + 3, k, k + 3, k + 2);
    }
  }
  const m = new MeshData(v, n, uv, idx);
  m.providedNormals = true;
  return m;
}

/** A wall along the track at `off` metres (its face towards the road), `h` high and `t` thick. */
function wall(track: Track, i0: number, i1: number, off: number, h: number, t: number): MeshData {
  const v: vec3[] = [], n: vec3[] = [], uv: vec2[] = [], idx: number[] = [];
  const ss = track.samples;
  const out = Math.sign(off);
  const quadStrip = (face: (p: typeof ss[0]) => [number, number, number, number, number], normal: (p: typeof ss[0]) => vec3) => {
    const start = v.length;
    for (let i = i0; i <= i1; i++) {
      const p = ss[i % ss.length];
      const s = i * (track.length / ss.length);
      const [o0, y0, o1, y1] = face(p);
      v.push([p.x + p.nx * o0, y0, -(p.y + p.ny * o0)], [p.x + p.nx * o1, y1, -(p.y + p.ny * o1)]);
      n.push(normal(p), normal(p));
      uv.push([s / 4, 1], [s / 4, 0]);
      if (i > i0) {
        const k = start + (i - i0) * 2 - 2;
        idx.push(k, k + 1, k + 3, k, k + 3, k + 2);
      }
    }
  };
  // The face towards the road, then the top.
  quadStrip(() => [off, 0, off, h, 0], (p) => [-p.nx * out, 0, p.ny * out]);
  quadStrip(() => [off, h, off + out * t, h, 0], () => [0, 1, 0]);
  const m = new MeshData(v, n, uv, idx);
  m.providedNormals = true;
  return m;
}

export interface TrackLook {
  /** Hides the pieces far from the camera (x, y on the plane). */
  update(x: number, y: number): void;
}

export async function dressTrack(gl: Gl, scene: Scene, track: Track): Promise<TrackLook> {
  const theme = THEMES[track.theme];
  const asphalt = await canvasTexture(gl, 128, (c, s) => {
    c.fillStyle = theme.road; c.fillRect(0, 0, s, s);
    // Speckles, darker tyre lines and the dashed middle line.
    for (let i = 0; i < 900; i++) {
      c.fillStyle = `rgba(${i % 2 ? '255,255,255' : '0,0,0'},${0.04 + ((i * 37) % 10) / 120})`;
      c.fillRect((i * 53) % s, (i * 97) % s, 2, 2);
    }
    c.fillStyle = 'rgba(10,10,16,.22)';
    c.fillRect(s * 0.22, 0, s * 0.1, s); c.fillRect(s * 0.68, 0, s * 0.1, s);
    c.fillStyle = '#e8e4d8';
    c.fillRect(s / 2 - 2, 0, 4, s / 2);
    // The edge lines.
    c.fillRect(3, 0, 3, s); c.fillRect(s - 6, 0, 3, s);
  });
  const kerb = await canvasTexture(gl, 32, (c, s) => {
    c.fillStyle = theme.kerb[0]; c.fillRect(0, 0, s, s / 2);
    c.fillStyle = theme.kerb[1]; c.fillRect(0, s / 2, s, s / 2);
  });
  const tyres = await canvasTexture(gl, 64, (c, s) => {
    c.fillStyle = '#20202a'; c.fillRect(0, 0, s, s);
    c.fillStyle = theme.barrier[0]; c.fillRect(0, s * 0.42, s / 2, s * 0.16);
    c.fillStyle = theme.barrier[1]; c.fillRect(s / 2, s * 0.42, s / 2, s * 0.16);
  });
  // At night the barriers' stripes glow.
  const glowStripes = track.theme === 'city' ? tyres : undefined;
  const mats = {
    road: await material(gl, [1, 1, 1], { tex: asphalt, specular: 0.15, roughness: 0.7 }),
    kerb: await material(gl, [1, 1, 1], { tex: kerb, specular: 0.2, glow: track.theme === 'city' ? kerb : undefined }),
    wall: await material(gl, [1, 1, 1], { tex: tyres, specular: 0.3, roughness: 0.5, glow: glowStripes }),
  };
  const n = track.samples.length;
  const pieces: { e: SceneEntity[]; x: number; y: number }[] = [];
  for (let i0 = 0; i0 < n; i0 += PIECE) {
    const i1 = Math.min(n, i0 + PIECE);
    const es: SceneEntity[] = [];
    const add = (name: string, mesh: MeshData, m: LitMaterial) => {
      const e = makeEntity(scene, `${name} ${i0}`);
      render(gl, e, mesh, m);
      es.push(e);
    };
    add('Road', band(track, i0, i1, track.half, -track.half, 0.02, track.half * 2), mats.road);
    add('Kerb left', band(track, i0, i1, track.half, track.kerbEdge, 0.05, 2), mats.kerb);
    add('Kerb right', band(track, i0, i1, -track.half, -track.kerbEdge, 0.05, 2), mats.kerb);
    add('Wall left', wall(track, i0, i1, track.wall, 0.9, 0.8), mats.wall);
    add('Wall right', wall(track, i0, i1, -track.wall, 0.9, 0.8), mats.wall);
    const mid = track.samples[Math.floor((i0 + i1) / 2) % n];
    pieces.push({ e: es, x: mid.x, y: mid.y });
  }
  // The start line: a chequered strip across the road, under a gantry.
  const chequer = await canvasTexture(gl, 64, (c, s) => {
    const k = s / 8;
    for (let i = 0; i < 8; i++) for (let j = 0; j < 2; j++) { c.fillStyle = (i + j) % 2 ? '#111' : '#f4f1ea'; c.fillRect(i * k, j * s / 2, k, s / 2); }
  });
  const p = track.samples[0];
  const line = new MeshData(
    [-1, 1].flatMap((along) => [track.half, -track.half].map((off) => [p.x + p.nx * off + p.tx * along, 0.035, -(p.y + p.ny * off + p.ty * along)] as vec3)),
    [[0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0]],
    [[0, 0], [1, 0], [0, 1], [1, 1]],
    [0, 1, 3, 0, 3, 2],
  );
  line.providedNormals = true;
  render(gl, makeEntity(scene, 'Start line'), line, await material(gl, [1, 1, 1], { tex: chequer }));
  const gantry = makeEntity(scene, 'Gantry');
  gantry.transform.setLocalPosition(p.x, 0, -p.y);
  gantry.transform.setLocalRotation(0, (Math.atan2(p.ty, p.tx) * 180) / Math.PI, 0);
  const w = track.kerbEdge + 0.6;
  render(gl, gantry, merge(new CubePrimitive(1), [
    { at: [0, 3, w], scale: [0.5, 6, 0.5] }, { at: [0, 3, -w], scale: [0.5, 6, 0.5] }, { at: [0, 6.2, 0], scale: [0.7, 0.9, w * 2 + 0.5] },
  ]), await material(gl, [0.16, 0.14, 0.22], { specular: 0.4 }));
  const banner = makeEntity(scene, 'Banner', gantry);
  render(gl, banner, merge(new CubePrimitive(1), [{ at: [-0.36, 6.2, 0], scale: [0.04, 0.6, w * 2 - 1] }]),
    await material(gl, [1, 1, 1], { tex: chequer, glow: chequer }));

  return {
    update(x, y) {
      for (const piece of pieces) {
        const near = Math.hypot(piece.x - x, piece.y - y) < 260;
        for (const e of piece.e) e.show = near;
      }
    },
  };
}

type Places = { at: number[]; scale: number[] }[];

/** The ground off the road, the scenery of the track's place round it, its sky, fog and light. */
export async function dressWorld(gl: Gl, scene: Scene, track: Track): Promise<void> {
  const theme = THEMES[track.theme];
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const p of track.samples) { x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y); }
  const pad = 160;
  x0 -= pad; x1 += pad; y0 -= pad; y1 += pad;
  const groundTex = await canvasTexture(gl, 128, (c, s) => {
    c.fillStyle = theme.ground[0]; c.fillRect(0, 0, s, s);
    for (let i = 0; i < 500; i++) {
      c.fillStyle = i % 3 ? theme.ground[1] : theme.ground[2];
      c.fillRect((i * 71) % s, (i * 43) % s, 3, 2);
    }
  });
  const tile = 10;
  const ground = new MeshData(
    [[x0, 0, -y0], [x1, 0, -y0], [x1, 0, -y1], [x0, 0, -y1]],
    [[0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0]],
    [[0, 0], [(x1 - x0) / tile, 0], [(x1 - x0) / tile, (y1 - y0) / tile], [0, (y1 - y0) / tile]],
    [0, 1, 2, 0, 2, 3],
  );
  ground.providedNormals = true;
  render(gl, makeEntity(scene, 'Ground'), ground, await material(gl, [1, 1, 1], { tex: groundTex, specular: theme.name === 'snow' ? 0.3 : 0.05 }));

  let seed = 7;
  const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const near = (x: number, y: number) => {
    let d = Infinity;
    for (let i = 0; i < track.samples.length; i += 3) { const p = track.samples[i]; d = Math.min(d, Math.hypot(p.x - x, p.y - y)); }
    return d;
  };
  /** Spots on a loose grid, at least `clear` m from the track (and at most `far` m). */
  const spots = (step: number, keep: number, clear: number, far = Infinity) => {
    const out: { x: number; y: number; d: number }[] = [];
    for (let x = x0 + 10; x < x1 - 10; x += step) for (let y = y0 + 10; y < y1 - 10; y += step) {
      const tx = x + (rand() - 0.5) * step * 0.7, ty = y + (rand() - 0.5) * step * 0.7;
      if (rand() > keep) continue;
      const d = near(tx, ty);
      if (d >= clear && d <= far) out.push({ x: tx, y: ty, d });
    }
    return out;
  };
  const cube = new CubePrimitive(1);
  const ball = new SpherePrimitive(1, 10, 8);
  const cone = new LathePrimitive([[0, 1], [1, 0], [0, 0]], 10);
  const clear = track.wall + 4;
  const put = async (name: string, part: MeshData, places: Places, color: number[], opts: Parameters<typeof material>[2] = {}) => {
    if (places.length) render(gl, makeEntity(scene, name), merge(part, places), await material(gl, color, opts));
  };
  // A ring of far things (mountains, mesas, towers) round everything.
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, ring = Math.max(x1 - x0, y1 - y0) / 2 + 40;

  if (theme.scenery === 'city') {
    const windows = await canvasTexture(gl, 64, (c, s) => {
      c.fillStyle = '#141428'; c.fillRect(0, 0, s, s);
      for (let i = 0; i < 4; i++) for (let j = 0; j < 8; j++) {
        const lit = (i * 7 + j * 13) % 5 < 2;
        c.fillStyle = lit ? ((i + j) % 3 ? '#ffd27a' : '#7ae8ff') : '#23233a';
        c.fillRect(4 + i * 15, 3 + j * 8, 9, 5);
      }
    });
    const blocks: Places = [], lamps: Places = [], heads: Places = [];
    for (const p of spots(22, 0.75, clear + 4)) {
      const h = 10 + rand() * (p.d > 60 ? 45 : 22), w = 9 + rand() * 8, d = 9 + rand() * 8;
      blocks.push({ at: [p.x, h / 2, -p.y], scale: [w, h, d] });
    }
    for (let a = 0; a < Math.PI * 2; a += 0.12) {
      const h = 40 + rand() * 50;
      blocks.push({ at: [cx + Math.cos(a) * ring, h / 2, -(cy + Math.sin(a) * ring)], scale: [18, h, 18] });
    }
    // Street lamps along both sides.
    for (let i = 0; i < track.samples.length; i += 28) {
      const q = track.samples[i];
      for (const side of [1, -1]) {
        const off = side * (track.wall + 1.4);
        const x = q.x + q.nx * off, y = q.y + q.ny * off;
        lamps.push({ at: [x, 3, -y], scale: [0.2, 6, 0.2] });
        heads.push({ at: [x - q.nx * side * 0.6, 6, -(y - q.ny * side * 0.6)], scale: [1.4, 0.25, 0.5] });
      }
    }
    // Windows on every side: the texture tiles by the box's size.
    await put('Buildings', cube, blocks, [1, 1, 1], { tex: windows, glow: windows, specular: 0.2 });
    await put('Lamp posts', cube, lamps, [0.25, 0.25, 0.3], { specular: 0.4 });
    const warm = await canvasTexture(gl, 4, (c, s) => { c.fillStyle = '#ffe2a0'; c.fillRect(0, 0, s, s); });
    await put('Lamp heads', cube, heads, [1, 0.95, 0.8], { glow: warm });
  } else if (theme.scenery === 'desert') {
    const trunks: Places = [], rocks: Places = [], mesas: Places = [];
    for (const p of spots(16, 0.4, clear)) {
      if (rand() < 0.55) {
        const h = 2.5 + rand() * 3;
        trunks.push({ at: [p.x, h / 2, -p.y], scale: [0.55, h, 0.55] });
        // Two arms.
        trunks.push({ at: [p.x + 0.7, h * 0.55, -p.y], scale: [0.9, 0.4, 0.4] }, { at: [p.x + 1.05, h * 0.7, -p.y], scale: [0.4, h * 0.35, 0.4] });
        if (rand() < 0.6) trunks.push({ at: [p.x - 0.6, h * 0.45, -p.y], scale: [0.8, 0.35, 0.35] }, { at: [p.x - 0.9, h * 0.55, -p.y], scale: [0.35, h * 0.25, 0.35] });
      } else {
        const r = 1 + rand() * 2.5;
        rocks.push({ at: [p.x, r * 0.25, -p.y], scale: [r * (1 + rand()), r * 0.7, r] });
      }
    }
    for (let a = 0; a < Math.PI * 2; a += 0.22) {
      const h = 25 + rand() * 30, w = 40 + rand() * 50;
      mesas.push({ at: [cx + Math.cos(a) * (ring + 30), h / 2, -(cy + Math.sin(a) * (ring + 30))], scale: [w, h, w * 0.7] });
    }
    await put('Cacti', cube, trunks, [0.3, 0.55, 0.28], { specular: 0.1 });
    await put('Rocks', ball, rocks, [0.72, 0.42, 0.26], { specular: 0.05 });
    await put('Mesas', cube, mesas, [0.74, 0.33, 0.2], { specular: 0.02 });
  } else {
    const pines: Places = [], tips: Places = [], trunks: Places = [], peaks: Places = [], caps: Places = [];
    for (const p of spots(13, 0.55, clear)) {
      const h = 4 + rand() * 5, r = h * 0.3;
      trunks.push({ at: [p.x, 0.6, -p.y], scale: [0.4, 1.2, 0.4] });
      pines.push({ at: [p.x, 1, -p.y], scale: [r, h, r] });
      tips.push({ at: [p.x, 1 + h * 0.62, -p.y], scale: [r * 0.42, h * 0.4, r * 0.42] });
    }
    for (let a = 0; a < Math.PI * 2; a += 0.3) {
      const h = 70 + rand() * 80, r = 60 + rand() * 50;
      const x = cx + Math.cos(a) * (ring + 60), y = cy + Math.sin(a) * (ring + 60);
      peaks.push({ at: [x, 0, -y], scale: [r, h, r] });
      caps.push({ at: [x, h * 0.62, -y], scale: [r * 0.385, h * 0.385, r * 0.385] });
    }
    await put('Trunks', cube, trunks, [0.38, 0.26, 0.18]);
    await put('Pines', cone, pines, [0.12, 0.36, 0.25], { specular: 0.05 });
    await put('Snow on pines', cone, tips, [0.95, 0.97, 1], { specular: 0.3 });
    await put('Mountains', cone, peaks, [0.45, 0.5, 0.6], { specular: 0.05 });
    await put('Snow caps', cone, caps, [0.97, 0.98, 1], { specular: 0.3 });
  }

  const ambient = new Light('Ambient light');
  ambient.color = new Color(theme.ambient[0], theme.ambient[1], theme.ambient[2], 1);
  scene.addEntity(ambient);
  const sun = new DirectionalLight('Sun');
  sun.color = new Color(theme.sun[0], theme.sun[1], theme.sun[2], 1);
  sun.transform.rotate(theme.sunAngle[0], theme.sunAngle[1], 0);
  sun.castShadows = true;
  scene.addEntity(sun);
  scene.sceneFog.enabled = theme.fogDensity > 0;
  scene.sceneFog.fogType = 1;
  scene.sceneFog.density = theme.fogDensity;
  scene.sceneFog.color = new Color(theme.fog[0], theme.fog[1], theme.fog[2], 1);
  gl.clearColor(theme.sky[0], theme.sky[1], theme.sky[2], 1);
}

export interface CarLook {
  root: SceneEntity;
  show(on: boolean): void;
  update(car: Car, dt: number): void;
}

/** A wheel: a short cylinder on its side (axle across the car), with a hub. */
function wheelMesh(r: number, w: number): MeshData {
  return new LathePrimitive([[0, w / 2], [r * 0.6, w / 2], [r, w / 2 - 0.04], [r, -w / 2 + 0.04], [r * 0.6, -w / 2], [0, -w / 2]], 18);
}

/** How a car looks: its paint, its stripe, and its shape (a spoiler, how wide and long). */
export interface CarStyle {
  paint: number[];
  stripe: number[];
  spoiler: boolean;
  /** Times the normal width and length. */
  wide: number;
  long: number;
}

export const DEFAULT_STYLE: CarStyle = { paint: [0.95, 0.25, 0.45], stripe: [1, 0.95, 0.85], spoiler: true, wide: 1, long: 1 };

/**
 * A small, round toy car of our own: a chunky body with rounded ends, round
 * wheel arches, a bubble cabin, a stripe and a spoiler. Its wheels steer and
 * roll, and the body leans in a turn. `alpha` under 1 draws it see-through (the ghost).
 */
export async function dressCar(gl: Gl, scene: Scene, style: CarStyle, opts: { alpha?: number; name?: string } = {}): Promise<CarLook> {
  const alpha = opts.alpha;
  const all: SceneEntity[] = [];
  const ent = (name: string, parent?: SceneEntity) => { const e = makeEntity(scene, name, parent); all.push(e); return e; };
  const root = ent(opts.name ?? 'Car');
  const body = ent('Body', root);
  const paint = await material(gl, style.paint, { alpha, specular: 0.7, roughness: 0.25 });
  const stripe = await material(gl, style.stripe, { alpha, specular: 0.6, roughness: 0.3 });
  const glass = await material(gl, [0.1, 0.13, 0.2], { alpha, specular: 0.9, roughness: 0.1 });
  const dark = await material(gl, [0.08, 0.08, 0.1], { alpha, specular: 0.2 });
  const lamp = await material(gl, [1, 1, 0.9], { alpha, glow: await canvasTexture(gl, 4, (c, s) => { c.fillStyle = '#fff6c8'; c.fillRect(0, 0, s, s); }) });
  const tail = await material(gl, [1, 0.1, 0.15], { alpha, glow: await canvasTexture(gl, 4, (c, s) => { c.fillStyle = '#a0101a'; c.fillRect(0, 0, s, s); }) });
  const cube = new CubePrimitive(1);
  const ball = new SpherePrimitive(1, 18, 12);
  const W = style.wide, L = style.long;
  // Along +x (the nose), across z, y up: about 3.7 m long and 1.8 m wide.
  render(gl, body, merge(cube, [{ at: [0, 0.55, 0], scale: [2.6 * L, 0.5, 1.7 * W] }]), paint);
  render(gl, ent('Ends', body), merge(ball, [
    { at: [1.25 * L, 0.55, 0], scale: [0.6, 0.27, 0.85 * W] },
    { at: [-1.25 * L, 0.57, 0], scale: [0.6, 0.29, 0.85 * W] },
    // Round arches over the wheels.
    ...[[1.15, 1], [1.15, -1], [-1.15, 1], [-1.15, -1]].map(([x, z]) => ({ at: [x * L, 0.62, z * 0.72 * W], scale: [0.58, 0.32, 0.22] })),
  ]), paint);
  render(gl, ent('Cabin', body), merge(ball, [{ at: [-0.2 * L, 0.88, 0], scale: [1.2 * L, 0.52, 0.76 * W] }]), glass);
  render(gl, ent('Roof', body), merge(ball, [{ at: [-0.28 * L, 0.97, 0], scale: [0.86 * L, 0.46, 0.79 * W] }]), paint);
  render(gl, ent('Stripe', body), merge(cube, [
    { at: [0.95 * L, 0.81, 0], scale: [1.0 * L, 0.02, 0.36] },
    { at: [-0.28 * L, 1.42, 0], scale: [0.8 * L, 0.02, 0.32] },
  ]), stripe);
  const darkParts = [
    { at: [1.78 * L, 0.36, 0], scale: [0.1, 0.18, 1.5 * W] },
    { at: [-1.78 * L, 0.36, 0], scale: [0.1, 0.18, 1.5 * W] },
  ];
  if (style.spoiler) {
    darkParts.push({ at: [-1.62 * L, 1.08, 0], scale: [0.36, 0.06, 1.62 * W] });
    for (const z of [0.55, -0.55]) darkParts.push({ at: [-1.55 * L, 0.92, z * W], scale: [0.12, 0.3, 0.08] });
  }
  render(gl, ent('Bumpers', body), merge(cube, darkParts), dark);
  render(gl, ent('Lamps', body), merge(ball, [{ at: [1.7 * L, 0.6, 0.52 * W], scale: [0.08, 0.12, 0.2] }, { at: [1.7 * L, 0.6, -0.52 * W], scale: [0.08, 0.12, 0.2] }]), lamp);
  render(gl, ent('Tail lamps', body), merge(cube, [{ at: [-1.83 * L, 0.62, 0.55 * W], scale: [0.04, 0.12, 0.34] }, { at: [-1.83 * L, 0.62, -0.55 * W], scale: [0.04, 0.12, 0.34] }]), tail);
  const tyre = wheelMesh(0.37, 0.34);
  const rubber = await material(gl, [0.1, 0.1, 0.12], { alpha, specular: 0.1 });
  const rim = await material(gl, [0.85, 0.85, 0.9], { alpha, specular: 0.9, roughness: 0.2 });
  const hub = new LathePrimitive([[0, 0.01], [0.2, 0.01], [0.2, -0.01], [0, -0.01]], 12);
  const wheels: { pivot: SceneEntity; spinner: SceneEntity; front: boolean }[] = [];
  for (const [x, z] of [[1.15, 0.8], [1.15, -0.8], [-1.15, 0.8], [-1.15, -0.8]]) {
    const pivot = ent('Wheel pivot', root);
    pivot.transform.setLocalPosition(x * L, 0.37, z * W);
    const spinner = ent('Wheel roll', pivot);
    // The lathe's axis is y: laid across the car (along z) under the roller.
    const t = ent('Wheel', spinner);
    t.transform.setLocalRotation(90, 0, 0);
    render(gl, t, tyre, rubber);
    // The rim on the outer face, off centre so the roll shows.
    const r = ent('Rim', spinner);
    r.transform.setLocalPosition(0.04, 0, Math.sign(z) * 0.175);
    r.transform.setLocalRotation(90, 0, 0);
    render(gl, r, hub, rim);
    wheels.push({ pivot, spinner, front: x > 0 });
  }
  let roll = 0;
  return {
    root,
    show(on) { for (const e of all) e.show = on; },
    update(car, dt) {
      root.transform.setLocalPosition(car.x, 0, -car.y);
      root.transform.setLocalRotation(0, (car.heading * 180) / Math.PI, 0);
      const u = car.vx * Math.cos(car.heading) + car.vy * Math.sin(car.heading);
      roll += (u / 0.37) * dt;
      // The body leans out of a turn (a touch, for life).
      const lean = Math.max(-5, Math.min(5, car.spin * u * 0.2));
      body.transform.setLocalRotation(lean, 0, 0);
      for (const w of wheels) {
        w.pivot.transform.setLocalRotation(0, w.front ? (car.wheel * 180) / Math.PI : 0, 0);
        w.spinner.transform.setLocalRotation(0, 0, (-roll * 180) / Math.PI);
      }
    },
  };
}
