// The visuals: the level's tiles as merged meshes (cut into chunks that hide
// off screen), the sky and hills behind, the goal flag, and the hero (Bit, a
// small round robot; plain shapes for now).
import { vec2, vec3 } from 'gl-matrix';
import {
  Color, CubePrimitive, DirectionalLight, Light, LitMaterial, LitShader, Mesh, MeshData, MeshRendererBehaviour,
  Resources, Scene, SceneEntity, SpherePrimitive, Texture,
} from '../../../src';
import { Level, Tile, tileAt } from './level';

type Gl = WebGL2RenderingContext;

/** Columns per chunk of the level's meshes. */
export const CHUNK = 16;
/** How deep (m) the ground runs back from the front, and the blocks. */
const GROUND_DEPTH = { front: 1.2, back: 2.4 };

export async function canvasTexture(gl: Gl, size: number, draw: (c: CanvasRenderingContext2D, s: number) => void): Promise<Texture> {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
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

/** A rectangle facing +z (towards the camera), from (x0, y0) to (x1, y1) at depth z. */
function quad(x0: number, y0: number, x1: number, y1: number, z: number): MeshData {
  const m = new MeshData(
    [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]],
    [[0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]],
    [[0, 1], [1, 1], [1, 0], [0, 0]],
    [0, 1, 2, 0, 2, 3],
  );
  m.providedNormals = true;
  return m;
}

/** The kinds of tile mesh: ground splits into its grassy top row and the earth under it. */
/** Static tile meshes (bricks and bonus blocks change, so they are drawn one by one in things.ts). */
type Part = 'grass' | 'earth' | 'deep' | 'block' | 'spikes';

function partOf(level: Level, x: number, y: number): Part | null {
  const t: Tile = tileAt(level, x, y);
  if (t === 'ground') return tileAt(level, x, y + 1) === 'ground' ? 'earth' : 'grass';
  if (t === 'block' || t === 'spikes') return t;
  return null;
}

/** The tile textures, drawn on canvases. */
async function tileMaterials(gl: Gl): Promise<Record<Part, LitMaterial>> {
  const grass = await canvasTexture(gl, 64, (c, s) => {
    c.fillStyle = '#5fbf3c'; c.fillRect(0, 0, s, s);
    c.fillStyle = '#74d24c';
    for (let i = 0; i < 10; i++) c.fillRect((i * 23) % 60, (i * 13) % 60, 6, 3);
    c.fillStyle = '#4aa22e'; c.fillRect(0, s - 8, s, 8);
  });
  const earth = await canvasTexture(gl, 64, (c, s) => {
    c.fillStyle = '#7a5130'; c.fillRect(0, 0, s, s);
    c.fillStyle = '#8c6038';
    for (let i = 0; i < 9; i++) c.fillRect((i * 29) % 58, (i * 19) % 58, 7, 4);
    c.fillStyle = '#69452a';
    for (let i = 0; i < 6; i++) c.fillRect((i * 37 + 11) % 58, (i * 23 + 7) % 58, 5, 3);
  });
  const block = await canvasTexture(gl, 64, (c, s) => {
    c.fillStyle = '#8f96a8'; c.fillRect(0, 0, s, s);
    c.fillStyle = '#b4bccd'; c.fillRect(0, 0, s, 6); c.fillRect(0, 0, 6, s);
    c.fillStyle = '#656b7a'; c.fillRect(0, s - 6, s, 6); c.fillRect(s - 6, 0, 6, s);
    c.fillStyle = '#7d8496'; c.fillRect(20, 20, 24, 24);
  });
  return {
    grass: await material(gl, [1, 1, 1], { tex: grass }),
    earth: await material(gl, [1, 1, 1], { tex: earth }),
    deep: await material(gl, [0.36, 0.23, 0.14], { specular: 0 }),
    block: await material(gl, [1, 1, 1], { tex: block, specular: 0.2 }),
    spikes: await material(gl, [0.78, 0.8, 0.86], { specular: 0.7, roughness: 0.25 }),
  };
}

/** The materials of the blocks that change: brick, bonus block, and a used bonus block. */
export async function blockMaterials(gl: Gl): Promise<{ brick: LitMaterial; bonus: LitMaterial; used: LitMaterial }> {
  const brick = await canvasTexture(gl, 64, (c, s) => {
    c.fillStyle = '#c4643c'; c.fillRect(0, 0, s, s);
    c.strokeStyle = '#8a3f22'; c.lineWidth = 4;
    c.strokeRect(2, 2, s - 4, s - 4);
    c.beginPath(); c.moveTo(0, s / 2); c.lineTo(s, s / 2); c.moveTo(s / 2, 0); c.lineTo(s / 2, s / 2);
    c.moveTo(s / 4, s / 2); c.lineTo(s / 4, s); c.moveTo((3 * s) / 4, s / 2); c.lineTo((3 * s) / 4, s); c.stroke();
  });
  // The bonus block: a gold panel with a bright diamond in the middle, which glows.
  const bonusDraw = (c: CanvasRenderingContext2D, s: number, glow: boolean) => {
    c.fillStyle = glow ? '#000' : '#e8a91c'; c.fillRect(0, 0, s, s);
    if (!glow) {
      c.fillStyle = '#ffd55a'; c.fillRect(0, 0, s, 5); c.fillRect(0, 0, 5, s);
      c.fillStyle = '#a86f0c'; c.fillRect(0, s - 5, s, 5); c.fillRect(s - 5, 0, 5, s);
    }
    c.fillStyle = glow ? '#7a5a10' : '#fff3c4';
    c.beginPath(); c.moveTo(s / 2, 14); c.lineTo(s - 16, s / 2); c.lineTo(s / 2, s - 14); c.lineTo(16, s / 2); c.closePath(); c.fill();
  };
  const bonus = await canvasTexture(gl, 64, (c, s) => bonusDraw(c, s, false));
  const bonusGlow = await canvasTexture(gl, 64, (c, s) => bonusDraw(c, s, true));
  const used = await canvasTexture(gl, 64, (c, s) => {
    c.fillStyle = '#8a6a3e'; c.fillRect(0, 0, s, s);
    c.fillStyle = '#a3825a'; c.fillRect(0, 0, s, 5); c.fillRect(0, 0, 5, s);
    c.fillStyle = '#65492a'; c.fillRect(0, s - 5, s, 5); c.fillRect(s - 5, 0, 5, s);
    c.fillStyle = '#6f5432'; for (const [x, y] of [[12, 12], [46, 12], [12, 46], [46, 46]]) c.fillRect(x, y, 6, 6);
  });
  return {
    brick: await material(gl, [1, 1, 1], { tex: brick }),
    bonus: await material(gl, [1, 1, 1], { tex: bonus, glow: bonusGlow, specular: 0.4, roughness: 0.4 }),
    used: await material(gl, [1, 1, 1], { tex: used }),
  };
}

/** A four-sided spike: base 1 × 1 on y = 0, point at y = 1. */
function pyramid(): MeshData {
  const v: vec3[] = [], n: vec3[] = [], uv: vec2[] = [], idx: number[] = [];
  const corners: [number, number][] = [[-0.5, 0.5], [0.5, 0.5], [0.5, -0.5], [-0.5, -0.5]];
  for (let i = 0; i < 4; i++) {
    const [ax, az] = corners[i], [bx, bz] = corners[(i + 1) % 4];
    const mx = (ax + bx) / 2, mz = (az + bz) / 2, l = Math.hypot(mx, 0.5, mz);
    const base = v.length;
    v.push([ax, 0, az], [bx, 0, bz], [0, 1, 0]);
    for (let k = 0; k < 3; k++) n.push([mx / l, 0.5 / l, mz / l]);
    uv.push([0, 1], [1, 1], [0.5, 0]);
    idx.push(base, base + 1, base + 2);
  }
  const m = new MeshData(v, n, uv, idx);
  m.providedNormals = true;
  return m;
}

export interface LevelLook {
  /** Shows only the chunks near the camera. */
  showAround(x: number, halfWidth: number): void;
  /** Removes the level's meshes (for the next level). */
  hide(): void;
}

/** The level's tiles: one mesh per kind of tile per chunk of columns. */
export async function dressLevel(gl: Gl, scene: Scene, level: Level): Promise<LevelLook> {
  const mats = await tileMaterials(gl);
  const cube = new CubePrimitive(1);
  const spike = pyramid();
  const chunks: { x0: number; parts: SceneEntity[] }[] = [];
  for (let x0 = 0; x0 < level.width; x0 += CHUNK) {
    const places: Record<Part, { at: number[]; scale: number[] }[]> = { grass: [], earth: [], deep: [], block: [], spikes: [] };
    for (let x = x0; x < Math.min(level.width, x0 + CHUNK); x++) {
      for (let y = 0; y < level.height; y++) {
        const p = partOf(level, x, y);
        if (!p) continue;
        if (p === 'grass' || p === 'earth') {
          const depth = GROUND_DEPTH.front + GROUND_DEPTH.back, z = (GROUND_DEPTH.front - GROUND_DEPTH.back) / 2;
          places.earth.push({ at: [x + 0.5, y + 0.5, z], scale: [1, 1, depth] });
          // A grassy cap on top, a little proud of the earth.
          if (p === 'grass') places.grass.push({ at: [x + 0.5, y + 0.88, z], scale: [1, 0.26, depth + 0.06] });
          // The earth goes on down under the level, so the view never shows under it.
          if (y === 0) places.deep.push({ at: [x + 0.5, -5, z], scale: [1, 10, depth] });
        } else if (p === 'spikes') {
          // Three spikes across the tile, two rows deep.
          for (const sx of [0.18, 0.5, 0.82]) for (const sz of [-0.25, 0.25]) places.spikes.push({ at: [x + sx, y, sz], scale: [0.3, 0.6, 0.3] });
        } else {
          places[p].push({ at: [x + 0.5, y + 0.5, 0], scale: [1, 1, 1] });
        }
      }
    }
    const parts: SceneEntity[] = [];
    for (const kind of Object.keys(places) as Part[]) {
      if (!places[kind].length) continue;
      const e = makeEntity(scene, `${level.name} ${kind} ${x0}`);
      render(gl, e, merge(kind === 'spikes' ? spike : cube, places[kind]), mats[kind]);
      parts.push(e);
    }
    chunks.push({ x0, parts });
  }
  return {
    showAround(x, halfWidth) {
      for (const c of chunks) {
        const on = c.x0 + CHUNK > x - halfWidth - 2 && c.x0 < x + halfWidth + 2;
        for (const e of c.parts) e.show = on;
      }
    },
    hide() { for (const c of chunks) for (const e of c.parts) e.show = false; },
  };
}

/** The sky (a glowing gradient far behind), hills at two depths, and the light. */
export async function dressWorld(gl: Gl, scene: Scene, width: number): Promise<void> {
  const skyTex = await canvasTexture(gl, 128, (c, s) => {
    const g = c.createLinearGradient(0, 0, 0, s);
    g.addColorStop(0, '#3d8ff0'); g.addColorStop(0.65, '#9fd2ff'); g.addColorStop(1, '#e4f4ff');
    c.fillStyle = g; c.fillRect(0, 0, s, s);
  });
  const black = await canvasTexture(gl, 4, (c, s) => { c.fillStyle = '#000'; c.fillRect(0, 0, s, s); });
  const sky = await material(gl, [0, 0, 0], { tex: black, glow: skyTex, specular: 0 });
  render(gl, makeEntity(scene, 'Sky'), quad(-60, -30, width + 60, 60, -60), sky);

  const sphere = new SpherePrimitive(1, 24, 12);
  const far = await material(gl, [0.48, 0.72, 0.62], { specular: 0 });
  const near = await material(gl, [0.36, 0.7, 0.38], { specular: 0 });
  const hills = (z: number, every: number, size: number, seed: number) => {
    const places: { at: number[]; scale: number[] }[] = [];
    for (let x = -20, i = 0; x < width + 40; x += every, i++) {
      const noise = Math.sin(i * 12.9898 + seed) * 43758.5453;
      const r = size * (0.7 + 0.6 * (noise - Math.floor(noise)));
      places.push({ at: [x, -r * 0.35, z], scale: [r * 1.6, r, r] });
    }
    return merge(sphere, places);
  };
  render(gl, makeEntity(scene, 'Far hills'), hills(-40, 26, 14, 1), far);
  render(gl, makeEntity(scene, 'Near hills'), hills(-18, 15, 6, 7), near);

  const ambient = new Light('Ambient light');
  ambient.color = new Color(0.55, 0.58, 0.66, 1);
  scene.addEntity(ambient);
  const sun = new DirectionalLight('Sun');
  sun.color = new Color(1, 0.96, 0.88, 1.0);
  sun.transform.rotate(50, 30, 0);
  sun.castShadows = true;
  scene.addEntity(sun);
}

/** The goal: a tall pole with a flag and a ball on top, standing on the goal tile. */
export async function dressGoal(gl: Gl, scene: Scene, x: number, y: number): Promise<SceneEntity> {
  const goal = makeEntity(scene, 'Goal');
  goal.transform.setLocalPosition(x, y, 0);
  const pole = makeEntity(scene, 'Pole', goal);
  pole.transform.setLocalPosition(0, 4, 0);
  pole.transform.setLocalScale(0.08, 8, 0.08);
  render(gl, pole, new CubePrimitive(1), await material(gl, [0.9, 0.92, 0.95], { specular: 0.5, roughness: 0.3 }));
  const top = makeEntity(scene, 'Pole top', goal);
  top.transform.setLocalPosition(0, 8.2, 0);
  top.transform.setLocalScale(0.25, 0.25, 0.25);
  render(gl, top, new SpherePrimitive(1, 16, 10), await material(gl, [1, 0.8, 0.2], { specular: 0.6, roughness: 0.3 }));
  const flag = makeEntity(scene, 'Flag', goal);
  flag.transform.setLocalPosition(-0.7, 7.3, 0);
  flag.transform.setLocalScale(1.3, 0.9, 0.05);
  render(gl, flag, new CubePrimitive(1), await material(gl, [0.15, 0.85, 0.75]));
  const base = makeEntity(scene, 'Pole base', goal);
  base.transform.setLocalPosition(0, 0.5, 0);
  render(gl, base, new CubePrimitive(1), await material(gl, [0.56, 0.6, 0.68]));
  return goal;
}

export interface HeroLook {
  /** Places the hero: feet at (x, y), turned to `yaw` degrees, squashed by `squash` (1 = none). */
  place(x: number, y: number, yaw: number, squash: number): void;
  setVisible(on: boolean): void;
}

/** Bit, for now: a round body, a dark visor, two eyes, an antenna and two feet. */
export async function dressHero(gl: Gl, scene: Scene): Promise<HeroLook> {
  const root = makeEntity(scene, 'Hero');
  const body = makeEntity(scene, 'Hero body', root);
  const ball = new SpherePrimitive(1, 24, 14);
  const parts: SceneEntity[] = [body];
  const part = (name: string, parent: SceneEntity, at: number[], scale: number[]) => {
    const e = makeEntity(scene, name, parent);
    e.transform.setLocalPosition(at[0], at[1], at[2]);
    e.transform.setLocalScale(scale[0], scale[1], scale[2]);
    parts.push(e);
    return e;
  };
  const shell = part('Shell', body, [0, 0.47, 0], [0.4, 0.4, 0.4]);
  render(gl, shell, ball, await material(gl, [0.95, 0.96, 1], { specular: 0.6, roughness: 0.25 }));
  const band = part('Band', body, [0, 0.4, 0], [0.42, 0.06, 0.42]);
  render(gl, band, ball, await material(gl, [0.15, 0.85, 0.75], { specular: 0.3 }));
  const visor = part('Visor', body, [0, 0.55, 0.22], [0.27, 0.16, 0.2]);
  render(gl, visor, ball, await material(gl, [0.06, 0.08, 0.14], { specular: 0.9, roughness: 0.1 }));
  const eyeGlow = await canvasTexture(gl, 4, (c, s) => { c.fillStyle = '#5ff'; c.fillRect(0, 0, s, s); });
  const eyeMat = await material(gl, [0.4, 1, 1], { glow: eyeGlow, specular: 0 });
  for (const sx of [-1, 1]) {
    const eye = part('Eye', body, [sx * 0.09, 0.57, 0.39], [0.04, 0.06, 0.03]);
    render(gl, eye, ball, eyeMat);
  }
  const stalk = part('Antenna', body, [0, 0.93, 0], [0.025, 0.12, 0.025]);
  render(gl, stalk, new CubePrimitive(2), await material(gl, [0.6, 0.62, 0.7]));
  const tip = part('Antenna tip', body, [0, 1.07, 0], [0.06, 0.06, 0.06]);
  render(gl, tip, ball, await material(gl, [1, 0.3, 0.45], { glow: eyeGlow, specular: 0 }));
  const footMat = await material(gl, [0.25, 0.27, 0.35], { specular: 0.3 });
  for (const sx of [-1, 1]) {
    const foot = part('Foot', body, [sx * 0.16, 0.06, 0.04], [0.12, 0.07, 0.16]);
    render(gl, foot, ball, footMat);
  }
  return {
    place(x, y, yaw, squash) {
      root.transform.setLocalPosition(x, y, 0);
      root.transform.setLocalRotation(0, yaw, 0);
      body.transform.setLocalScale(1 / Math.sqrt(squash), squash, 1 / Math.sqrt(squash));
    },
    setVisible(on) { for (const p of parts) p.show = on; },
  };
}
