// The visuals: the track (asphalt, kerbs, walls, the start line) as strips
// built from its centre line, cut into pieces that hide off screen; grass,
// trees round it and the light; the car (a body and four wheels that steer
// and roll). The plane's (x, y) is the world's (x, -z); y is up.
import { vec2, vec3 } from 'gl-matrix';
import {
  Color, CubePrimitive, DirectionalLight, LathePrimitive, Light, LitMaterial, LitShader, Mesh, MeshData,
  MeshRendererBehaviour, Resources, Scene, SceneEntity, SpherePrimitive, Texture,
} from '../../../src';
import { Car } from './car';
import { Track } from './track';

type Gl = WebGL2RenderingContext;

export async function canvasTexture(gl: Gl, size: number, draw: (c: CanvasRenderingContext2D, s: number) => void, height = size): Promise<Texture> {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = height;
  draw(canvas.getContext('2d')!, size);
  return Resources.for(gl).getTexture(canvas.toDataURL('image/png'));
}

export async function material(gl: Gl, color: number[], opts: { tex?: Texture; glow?: Texture; specular?: number; roughness?: number } = {}): Promise<LitMaterial> {
  const m = new LitMaterial();
  m.color = new Color(color[0], color[1], color[2], 1);
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

export function render(gl: Gl, entity: SceneEntity, meshData: MeshData, m: LitMaterial): void {
  const mesh = new Mesh();
  mesh.meshData = meshData;
  const renderer = new MeshRendererBehaviour(gl);
  renderer.mesh = mesh;
  renderer.shader = new LitShader(gl, m);
  entity.addBehaviour(renderer);
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
  const asphalt = await canvasTexture(gl, 128, (c, s) => {
    c.fillStyle = '#3a3a44'; c.fillRect(0, 0, s, s);
    // Speckles, darker tyre lines and the dashed middle line.
    for (let i = 0; i < 900; i++) {
      const g = 50 + ((i * 37) % 30);
      c.fillStyle = `rgb(${g},${g},${g + 8})`;
      c.fillRect((i * 53) % s, (i * 97) % s, 2, 2);
    }
    c.fillStyle = 'rgba(20,20,26,.25)';
    c.fillRect(s * 0.22, 0, s * 0.1, s); c.fillRect(s * 0.68, 0, s * 0.1, s);
    c.fillStyle = '#e8e4d8';
    c.fillRect(s / 2 - 2, 0, 4, s / 2);
    // The edge lines.
    c.fillRect(3, 0, 3, s); c.fillRect(s - 6, 0, 3, s);
  });
  const kerb = await canvasTexture(gl, 32, (c, s) => {
    c.fillStyle = '#e8263f'; c.fillRect(0, 0, s, s / 2);
    c.fillStyle = '#f4f1ea'; c.fillRect(0, s / 2, s, s / 2);
  });
  const tyres = await canvasTexture(gl, 64, (c, s) => {
    c.fillStyle = '#20202a'; c.fillRect(0, 0, s, s);
    c.fillStyle = '#2de2ff'; c.fillRect(0, s * 0.42, s / 2, s * 0.16);
    c.fillStyle = '#ff3ea5'; c.fillRect(s / 2, s * 0.42, s / 2, s * 0.16);
  });
  const mats = {
    road: await material(gl, [1, 1, 1], { tex: asphalt, specular: 0.15, roughness: 0.7 }),
    kerb: await material(gl, [1, 1, 1], { tex: kerb, specular: 0.2 }),
    wall: await material(gl, [1, 1, 1], { tex: tyres, specular: 0.3, roughness: 0.5 }),
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
  // The start line: a chequered strip across the road.
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

  return {
    update(x, y) {
      for (const piece of pieces) {
        const near = Math.hypot(piece.x - x, piece.y - y) < 260;
        for (const e of piece.e) e.show = near;
      }
    },
  };
}

/** Grass under everything, trees round the track (kept off it), the sky's colour and the light. */
export async function dressWorld(gl: Gl, scene: Scene, track: Track): Promise<void> {
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const p of track.samples) { x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y); }
  const pad = 140;
  x0 -= pad; x1 += pad; y0 -= pad; y1 += pad;
  const grassTex = await canvasTexture(gl, 128, (c, s) => {
    c.fillStyle = '#4f9a3c'; c.fillRect(0, 0, s, s);
    for (let i = 0; i < 500; i++) {
      c.fillStyle = i % 3 ? '#5aa845' : '#468a35';
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
  render(gl, makeEntity(scene, 'Grass'), ground, await material(gl, [1, 1, 1], { tex: grassTex }));

  // Trees on a loose grid, where nothing of the track is near.
  const trunks: { at: number[]; scale: number[] }[] = [];
  const crowns: { at: number[]; scale: number[] }[] = [];
  let seed = 7;
  const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const clear = track.wall + 4;
  for (let x = x0 + 10; x < x1 - 10; x += 14) {
    for (let y = y0 + 10; y < y1 - 10; y += 14) {
      const tx = x + (rand() - 0.5) * 10, ty = y + (rand() - 0.5) * 10;
      if (rand() < 0.45) continue;
      let near = Infinity;
      for (let i = 0; i < track.samples.length; i += 3) {
        const p = track.samples[i];
        near = Math.min(near, Math.hypot(p.x - tx, p.y - ty));
      }
      if (near < clear) continue;
      const h = 3 + rand() * 3;
      trunks.push({ at: [tx, h * 0.25, -ty], scale: [0.35, h * 0.5, 0.35] });
      crowns.push({ at: [tx, h * 0.55 + 1.2, -ty], scale: [1.6 + rand(), 1.8 + rand() * 1.5, 1.6 + rand()] });
    }
  }
  if (trunks.length) {
    render(gl, makeEntity(scene, 'Trunks'), merge(new CubePrimitive(1), trunks), await material(gl, [0.42, 0.28, 0.18]));
    render(gl, makeEntity(scene, 'Crowns'), merge(new SpherePrimitive(1, 10, 8), crowns), await material(gl, [0.22, 0.55, 0.24], { specular: 0.05 }));
  }

  const ambient = new Light('Ambient light');
  ambient.color = new Color(0.42, 0.46, 0.55, 1);
  scene.addEntity(ambient);
  const sun = new DirectionalLight('Sun');
  sun.color = new Color(1, 0.96, 0.88, 1);
  sun.transform.rotate(55, 35, 0);
  sun.castShadows = true;
  scene.addEntity(sun);
}

export interface CarLook {
  root: SceneEntity;
  update(car: Car, dt: number): void;
}

/** A wheel: a short cylinder on its side (axle across the car), with a hub. */
function wheelMesh(r: number, w: number): MeshData {
  return new LathePrimitive([[0, w / 2], [r * 0.6, w / 2], [r, w / 2 - 0.02], [r, -w / 2 + 0.02], [r * 0.6, -w / 2], [0, -w / 2]], 18);
}

/** The car, for now a body of blocks (its own model comes in phase 3), in `color`. */
export async function dressCar(gl: Gl, scene: Scene, color: number[]): Promise<CarLook> {
  const root = makeEntity(scene, 'Car');
  const body = makeEntity(scene, 'Body', root);
  const paint = await material(gl, color, { specular: 0.7, roughness: 0.25 });
  const glass = await material(gl, [0.12, 0.16, 0.24], { specular: 0.9, roughness: 0.1 });
  const dark = await material(gl, [0.08, 0.08, 0.1], { specular: 0.2 });
  const lamp = await material(gl, [1, 1, 0.9], { glow: await canvasTexture(gl, 4, (c, s) => { c.fillStyle = '#fff6c8'; c.fillRect(0, 0, s, s); }) });
  const tail = await material(gl, [1, 0.1, 0.15], { glow: await canvasTexture(gl, 4, (c, s) => { c.fillStyle = '#a0101a'; c.fillRect(0, 0, s, s); }) });
  const cube = new CubePrimitive(1);
  // Along +x (the nose), across z, y up; the car is 3.7 m long and 1.8 m wide.
  render(gl, body, merge(cube, [{ at: [0, 0.55, 0], scale: [3.7, 0.5, 1.8] }, { at: [1.45, 0.42, 0], scale: [0.8, 0.3, 1.82] }]), paint);
  render(gl, makeEntity(scene, 'Cabin', body), merge(cube, [{ at: [-0.25, 1.05, 0], scale: [1.9, 0.52, 1.5] }]), glass);
  render(gl, makeEntity(scene, 'Roof', body), merge(cube, [{ at: [-0.3, 1.33, 0], scale: [1.6, 0.06, 1.42] }]), paint);
  render(gl, makeEntity(scene, 'Bumpers', body), merge(cube, [{ at: [1.88, 0.35, 0], scale: [0.12, 0.25, 1.75] }, { at: [-1.88, 0.35, 0], scale: [0.12, 0.25, 1.75] }]), dark);
  render(gl, makeEntity(scene, 'Lamps', body), merge(cube, [{ at: [1.86, 0.62, 0.6], scale: [0.06, 0.16, 0.38] }, { at: [1.86, 0.62, -0.6], scale: [0.06, 0.16, 0.38] }]), lamp);
  render(gl, makeEntity(scene, 'Tail lamps', body), merge(cube, [{ at: [-1.86, 0.65, 0.62], scale: [0.06, 0.14, 0.4] }, { at: [-1.86, 0.65, -0.62], scale: [0.06, 0.14, 0.4] }]), tail);
  const tyre = wheelMesh(0.36, 0.3);
  const rubber = await material(gl, [0.1, 0.1, 0.12], { specular: 0.1 });
  const wheels: { pivot: SceneEntity; spinner: SceneEntity; front: boolean }[] = [];
  for (const [x, z] of [[1.15, 0.85], [1.15, -0.85], [-1.15, 0.85], [-1.15, -0.85]]) {
    const pivot = makeEntity(scene, 'Wheel pivot', root);
    pivot.transform.setLocalPosition(x, 0.36, z);
    const spinner = makeEntity(scene, 'Wheel roll', pivot);
    // The lathe's axis is y: laid across the car (along z) under the roller.
    const t = makeEntity(scene, 'Wheel', spinner);
    t.transform.setLocalRotation(90, 0, 0);
    render(gl, t, tyre, rubber);
    wheels.push({ pivot, spinner, front: x > 0 });
  }
  let roll = 0;
  return {
    root,
    update(car, dt) {
      root.transform.setLocalPosition(car.x, 0, -car.y);
      root.transform.setLocalRotation(0, (car.heading * 180) / Math.PI, 0);
      const u = car.vx * Math.cos(car.heading) + car.vy * Math.sin(car.heading);
      roll += (u / 0.36) * dt;
      // The body leans out of a turn and dips under braking (a touch, for life).
      const lean = Math.max(-4, Math.min(4, car.spin * u * 0.18));
      body.transform.setLocalRotation(lean, 0, 0);
      for (const w of wheels) {
        w.pivot.transform.setLocalRotation(0, w.front ? (car.wheel * 180) / Math.PI : 0, 0);
        w.spinner.transform.setLocalRotation(0, 0, (-roll * 180) / Math.PI);
      }
    },
  };
}
