// The visuals: the terrain mesh and its painted surface, the ball, the flag,
// the aim marker, the sky and the light.
import { vec2, vec3 } from 'gl-matrix';
import {
  Color, CubePrimitive, DirectionalLight, LathePrimitive, Light, LitMaterial, LitShader, Mesh, MeshData, MeshRendererBehaviour,
  Resources, Scene, SceneEntity, SpherePrimitive, Texture,
} from '../../../src';
import { BALL, Tree } from './ball';
import { Hole, WaterShape } from './course';
import { HeightField, Surface } from './terrain';
import { GolferRig, rigEntities } from './golfer';

type Gl = WebGL2RenderingContext;

/** The colours of each surface, as RGB 0–255. */
export const SURFACE_RGB: Record<Surface, [number, number, number]> = {
  tee: [112, 196, 84],
  fairway: [96, 182, 72],
  rough: [58, 132, 50],
  sand: [232, 214, 160],
  green: [124, 212, 92],
  water: [52, 140, 206],
  out: [44, 100, 42],
};

async function canvasTexture(gl: Gl, width: number, height: number, draw: (c: CanvasRenderingContext2D) => void): Promise<Texture> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  draw(canvas.getContext('2d')!);
  return Resources.for(gl).getTexture(canvas.toDataURL('image/png'));
}

async function material(gl: Gl, color: number[], opts: { tex?: Texture; specular?: number; roughness?: number } = {}): Promise<LitMaterial> {
  const m = new LitMaterial();
  m.color = new Color(color[0], color[1], color[2], 1);
  m.mainTex = opts.tex ?? await Resources.for(gl).getTexture('builtin://white');
  m.specularStrength = opts.specular ?? 0.1;
  m.roughness = opts.roughness ?? 0.8;
  return m;
}

function render(gl: Gl, entity: SceneEntity, meshData: MeshData, m: LitMaterial): void {
  const mesh = new Mesh();
  mesh.meshData = meshData;
  const renderer = new MeshRendererBehaviour(gl);
  renderer.mesh = mesh;
  renderer.shader = new LitShader(gl, m);
  entity.addBehaviour(renderer);
}

function makeEntity(scene: Scene, name: string, parent?: SceneEntity): SceneEntity {
  const e = new SceneEntity(name);
  if (parent) e.transform.setParent(parent.transform);
  scene.addEntity(e);
  return e;
}

/** The height grid as a mesh, UVs spanning the whole area (u along x, v along z). */
export function terrainMesh(field: HeightField): MeshData {
  const v: vec3[] = [], nrm: vec3[] = [], uv: vec2[] = [], idx: number[] = [];
  const n = [0, 1, 0];
  for (let j = 0; j < field.nz; j++) {
    for (let i = 0; i < field.nx; i++) {
      const x = field.x0 + i * field.cell, z = field.z0 + j * field.cell;
      v.push([x, field.heightAt(i, j), z]);
      field.normal(x, z, n);
      nrm.push([n[0], n[1], n[2]]);
      uv.push([i / (field.nx - 1), j / (field.nz - 1)]);
    }
  }
  for (let j = 0; j < field.nz - 1; j++) {
    for (let i = 0; i < field.nx - 1; i++) {
      const a = j * field.nx + i, b = a + 1, c = a + field.nx, d = c + 1;
      // Counter-clockwise seen from above (+y): a, c, b and b, c, d.
      idx.push(a, c, b, b, c, d);
    }
  }
  const m = new MeshData(v, nrm, uv, idx);
  m.providedNormals = true;
  return m;
}

/** Copies of `part`, each moved and scaled, as one mesh (the engine has no instancing). */
function merge(part: MeshData, places: { at: number[]; scale: number[] }[]): MeshData {
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

/** The range's rings (inner and outer radius, m) and their colours: 50, 25 and 10 points. */
const RING_RADII: [number, number][] = [[0, 3], [7.2, 8], [14.2, 15]];
const RING_COLOURS: number[][] = [[1, 0.24, 0.65], [1, 0.82, 0.25], [0.18, 0.89, 1]];

/** A flat ring (or a disc when the inner radius is 0) on y = 0, facing up. */
function ringMesh(inner: number, outer: number, seg = 48): MeshData {
  const v: vec3[] = [], uv: vec2[] = [], idx: number[] = [];
  for (let i = 0; i <= seg; i++) {
    const a = (i / seg) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
    v.push([c * inner, 0, s * inner], [c * outer, 0, s * outer]);
    uv.push([0, 0], [1, 1]);
    if (i > 0) { const k = i * 2; idx.push(k - 2, k, k - 1, k - 1, k, k + 1); }
  }
  const m = new MeshData(v, v.map(() => [0, 1, 0] as vec3), uv, idx);
  m.providedNormals = true;
  return m;
}

/** A material that glows in its colour (so the rings read from far away). */
async function glowMaterial(gl: Gl, color: number[]): Promise<LitMaterial> {
  const m = await material(gl, color, { specular: 0 });
  m.emissiveTex = await canvasTexture(gl, 4, 4, (c) => { c.fillStyle = `rgb(${color.map((x) => Math.round(x * 255)).join(',')})`; c.fillRect(0, 0, 4, 4); });
  return m;
}

/** A flat water surface: an ellipse (a fan) or a band along a line, at `level`. */
function waterMesh(shape: WaterShape, level: number): MeshData {
  const v: vec3[] = [], uv: vec2[] = [], idx: number[] = [];
  if (shape.kind === 'lake') {
    const c = Math.cos(shape.rot ?? 0), s = Math.sin(shape.rot ?? 0), seg = 40;
    v.push([shape.x, level, shape.z]); uv.push([0.5, 0.5]);
    for (let i = 0; i <= seg; i++) {
      const a = (i / seg) * Math.PI * 2, u = Math.cos(a) * (shape.rx + 1.5), w = Math.sin(a) * (shape.rz + 1.5);
      v.push([shape.x + u * c - w * s, level, shape.z + u * s + w * c]); uv.push([0.5 + Math.cos(a) / 2, 0.5 + Math.sin(a) / 2]);
      if (i > 0) idx.push(0, i + 1, i);
    }
  } else {
    const half = shape.width / 2 + 1.5;
    shape.line.forEach((p, i) => {
      const a = shape.line[Math.max(0, i - 1)], b = shape.line[Math.min(shape.line.length - 1, i + 1)];
      const dx = b.x - a.x, dz = b.z - a.z, l = Math.hypot(dx, dz) || 1;
      const nx = -dz / l, nz = dx / l;
      v.push([p.x + nx * half, level, p.z + nz * half], [p.x - nx * half, level, p.z - nz * half]);
      uv.push([0, i], [1, i]);
      if (i > 0) { const k = i * 2; idx.push(k - 2, k - 1, k, k - 1, k + 1, k); }
    });
  }
  // Facing up either way round.
  const tri = idx.slice();
  for (let i = 0; i < tri.length; i += 3) idx.push(tri[i], tri[i + 2], tri[i + 1]);
  const m = new MeshData(v, v.map(() => [0, 1, 0] as vec3), uv, idx);
  m.providedNormals = true;
  return m;
}

/** Paints the surface grid, one pixel per cell, with mowing stripes and a little noise. */
function drawSurfaces(c: CanvasRenderingContext2D, field: HeightField): void {
  const img = c.createImageData(field.snx, field.snz);
  let seed = 7;
  const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 2 ** 32; };
  for (let j = 0; j < field.snz; j++) {
    for (let i = 0; i < field.snx; i++) {
      const x = field.x0 + (i + 0.5) * field.surfaceCell, z = field.z0 + (j + 0.5) * field.surfaceCell;
      const s = field.surface(x, z);
      const [r, g, b] = SURFACE_RGB[s];
      let k = 0.94 + rnd() * 0.08;
      if (s === 'fairway') k *= Math.floor(z / 8) % 2 === 0 ? 1.06 : 0.95; // stripes across the hole
      if (s === 'green') k *= Math.floor((x + z) / 3) % 2 === 0 ? 1.04 : 0.97;
      const o = (j * field.snx + i) * 4;
      img.data[o] = Math.min(255, r * k); img.data[o + 1] = Math.min(255, g * k); img.data[o + 2] = Math.min(255, b * k);
      img.data[o + 3] = 255;
    }
  }
  c.putImageData(img, 0, 0);
}

export interface HoleLook {
  /** Every entity of the hole (show is not inherited, so each is shown or hidden). */
  parts: SceneEntity[];
}

export interface CourseLook {
  ball: SceneEntity;
  flag: SceneEntity;
  marker: SceneEntity;
  /** Puts the flag (and cup) at a point on the ground. */
  placeFlag(x: number, y: number, z: number): void;
  /** Shows or takes out the pole and its flag (the cup stays). */
  setPole(visible: boolean): void;
  /** Shows or hides the whole flag, cup included (the range has none). */
  setFlag(visible: boolean): void;
  /** Range targets: rings on the ground at these points, or none. */
  setTargets(points: { x: number; y: number; z: number }[] | null): Promise<void>;
  /** Shows this hole's ground, water and trees (built the first time), hides the others. */
  showHole(hole: Hole): Promise<void>;
}

/** How much bigger the ball is drawn than it is, so it can be seen. */
export const BALL_LOOK = 1.6;

async function dressHole(gl: Gl, scene: Scene, hole: Hole, mats: { water: LitMaterial; trunk: LitMaterial; leaves: LitMaterial; skirt: LitMaterial }): Promise<HoleLook> {
  const field = hole.ground;
  const parts: SceneEntity[] = [];
  const entity = (sc: Scene, name: string, parent?: SceneEntity) => { const e = makeEntity(sc, name, parent); parts.push(e); return e; };
  const root = entity(scene, `Hole ${hole.spec.name}`);
  const tex = await canvasTexture(gl, field.snx, field.snz, (c) => drawSurfaces(c, field));
  const ground = entity(scene, 'Terrain', root);
  render(gl, ground, terrainMesh(field), await material(gl, [1, 1, 1], { tex, specular: 0, roughness: 1 }));
  // A wide skirt below the edges, so the world does not end at the hole's area.
  const skirt = entity(scene, 'Skirt', root);
  const lowest = field.heights.reduce((a, b) => Math.min(a, b), Infinity);
  skirt.transform.setLocalPosition((field.x0 + field.x1) / 2, lowest - 3.5, (field.z0 + field.z1) / 2);
  skirt.transform.setLocalScale(1500, 1, 1500);
  render(gl, skirt, new CubePrimitive(1), mats.skirt);
  hole.water.forEach((w, i) => render(gl, entity(scene, `Water ${i}`, root), waterMesh(w.shape, w.level), mats.water));
  if (hole.trees.length) {
    const trunk = new LathePrimitive([[1, 0], [0.8, 0.5], [0.6, 1]], 7);
    const crown = new SpherePrimitive(1, 9, 6);
    render(gl, entity(scene, 'Trunks', root), merge(trunk, hole.trees.map((t: Tree) => ({ at: [t.x, t.y - 0.2, t.z], scale: [t.trunkRadius, t.canopyY - t.y, t.trunkRadius] }))), mats.trunk);
    render(gl, entity(scene, 'Crowns', root), merge(crown, hole.trees.map((t: Tree) => ({ at: [t.x, t.canopyY, t.z], scale: [t.canopyRadius, t.canopyRadius * 1.15, t.canopyRadius] }))), mats.leaves);
  }
  return { parts };
}

export async function dressCourse(gl: Gl, scene: Scene): Promise<CourseLook> {
  const entity = makeEntity;
  const mats = {
    water: await material(gl, [0.2, 0.52, 0.85], { specular: 0.9, roughness: 0.15 }),
    trunk: await material(gl, [0.42, 0.29, 0.18]),
    leaves: await material(gl, [0.2, 0.48, 0.2], { specular: 0.05 }),
    skirt: await material(gl, SURFACE_RGB.out.map((c) => (c / 255) * 0.85), { specular: 0, roughness: 1 }),
  };
  const looks = new Map<Hole, HoleLook>();
  const targets: SceneEntity[] = [], poles: SceneEntity[] = [];
  let flagOn = true;

  const ball = entity(scene, 'Ball');
  render(gl, ball, new SpherePrimitive(BALL.radius * BALL_LOOK, 20, 12), await material(gl, [1, 1, 1], { specular: 0.6, roughness: 0.3 }));

  const flag = entity(scene, 'Flag');
  const pole = entity(scene, 'Pole', flag);
  pole.transform.setLocalPosition(0, 1.25, 0);
  pole.transform.setLocalScale(0.02, 1.25, 0.02);
  render(gl, pole, new CubePrimitive(2), await material(gl, [0.95, 0.95, 0.9]));
  const cloth = entity(scene, 'Cloth', flag);
  cloth.transform.setLocalPosition(0.36, 2.25, 0);
  cloth.transform.setLocalScale(0.35, 0.22, 0.01);
  render(gl, cloth, new CubePrimitive(2), await material(gl, [1, 0.18, 0.42]));
  const cup = entity(scene, 'Cup', flag);
  cup.transform.setLocalPosition(0, 0.003, 0);
  cup.transform.setLocalScale(BALL.cupRadius, 0.004, BALL.cupRadius);
  render(gl, cup, new CubePrimitive(2), await material(gl, [0.05, 0.05, 0.05]));

  // Where the ball should land: a ring of four bright bars on the ground and a beacon above.
  const marker = entity(scene, 'Marker');
  const markMat = await material(gl, [0.2, 0.95, 1]);
  for (let k = 0; k < 4; k++) {
    const bar = entity(scene, `Marker ${k}`, marker);
    const a = (k * Math.PI) / 2;
    bar.transform.setLocalPosition(Math.cos(a) * 2.2, 0.15, Math.sin(a) * 2.2);
    bar.transform.setLocalScale(k % 2 ? 1.2 : 0.18, 0.05, k % 2 ? 0.18 : 1.2);
    render(gl, bar, new CubePrimitive(2), markMat);
  }
  const beacon = entity(scene, 'Beacon', marker);
  beacon.transform.setLocalPosition(0, 3, 0);
  beacon.transform.setLocalScale(0.12, 3, 0.12);
  render(gl, beacon, new CubePrimitive(2), markMat);

  const ambient = new Light('Ambient light');
  ambient.color = new Color(0.45, 0.5, 0.58, 1);
  scene.addEntity(ambient);
  const sun = new DirectionalLight('Sun');
  sun.color = new Color(1, 0.96, 0.88, 1.1);
  sun.transform.rotate(55, -35, 0);
  sun.castShadows = true;
  scene.addEntity(sun);

  return {
    ball, flag, marker,
    placeFlag(x, y, z) { flag.transform.setLocalPosition(x, y, z); },
    setPole(visible) { pole.show = visible && flagOn; cloth.show = visible && flagOn; },
    setFlag(visible) { flagOn = visible; pole.show = visible; cloth.show = visible; cup.show = visible; },
    async setTargets(points) {
      for (const e of [...targets, ...poles]) e.show = false;
      if (!points) return;
      while (targets.length < points.length * RING_COLOURS.length) {
        const k = targets.length % RING_COLOURS.length;
        const e = entity(scene, `Target ring ${targets.length}`);
        render(gl, e, ringMesh(RING_RADII[k][0], RING_RADII[k][1]), await glowMaterial(gl, RING_COLOURS[k]));
        targets.push(e);
      }
      while (poles.length < points.length) {
        const e = entity(scene, `Target pole ${poles.length}`);
        e.transform.setLocalScale(0.08, 2.5, 0.08);
        render(gl, e, new CubePrimitive(2), await glowMaterial(gl, RING_COLOURS[0]));
        poles.push(e);
      }
      points.forEach((p, i) => {
        poles[i].transform.setLocalPosition(p.x, p.y + 2.5, p.z);
        poles[i].show = true;
        for (let k = 0; k < RING_COLOURS.length; k++) {
          const e = targets[i * RING_COLOURS.length + k];
          e.transform.setLocalPosition(p.x, p.y + 0.05 + k * 0.01, p.z);
          e.show = true;
        }
      });
    },
    async showHole(hole) {
      if (!looks.has(hole)) looks.set(hole, await dressHole(gl, scene, hole, mats));
      for (const [h, l] of looks) for (const e of l.parts) e.show = h === hole;
    },
  };
}

/** Shirt colours, one per player. */
export const SHIRTS: number[][] = [[0.85, 0.28, 0.17], [0.12, 0.62, 0.6], [0.88, 0.65, 0.15], [0.48, 0.3, 0.77]];

/** A capsule-like limb hanging down from its joint: radius r0 at the joint, r1 at `length`. */
function limb(length: number, r0: number, r1: number): MeshData {
  const profile: [number, number][] = [];
  for (let k = 0; k <= 4; k++) { const a = (k / 4) * (Math.PI / 2); profile.push([r0 * Math.sin(a), r0 * Math.cos(a) * 0.8]); }
  for (let k = 0; k <= 4; k++) { const a = (k / 4) * (Math.PI / 2); profile.push([r1 * Math.cos(a), -length - r1 * Math.sin(a) * 0.8]); }
  return new LathePrimitive(profile, 12);
}

export interface GolferLook {
  setShirt(player: number): void;
  setVisible(visible: boolean): void;
  /** Shows the club's head for this club (a putter's is flat and long). */
  setClub(id: string, shaft: number): void;
}

/** Gives the golfer its meshes (rounded shapes, a cap, shoes) and a club in its hands. */
export async function dressGolfer(gl: Gl, scene: Scene, rig: GolferRig): Promise<GolferLook> {
  const shirt = await material(gl, SHIRTS[0], { specular: 0.15 });
  const pants = await material(gl, [0.9, 0.88, 0.8], { specular: 0.1 });
  const skin = await material(gl, [0.86, 0.64, 0.5], { specular: 0.2, roughness: 0.6 });
  const cap = await material(gl, [0.12, 0.13, 0.2], { specular: 0.2 });
  const shoe = await material(gl, [0.96, 0.96, 0.94], { specular: 0.3, roughness: 0.5 });
  const steel = await material(gl, [0.75, 0.76, 0.8], { specular: 0.9, roughness: 0.2 });
  const grip = await material(gl, [0.1, 0.1, 0.1]);
  for (const e of rigEntities(rig)) scene.addEntity(e);
  const b = (name: string) => rig.bones.get(name)!;
  const parts: SceneEntity[] = [];
  const add = (joint: SceneEntity, mesh: MeshData, m: LitMaterial, at: number[] = [0, 0, 0], scale: number[] = [1, 1, 1]) => {
    const e = makeEntity(scene, `${joint.name} (mesh)`, joint);
    e.transform.setLocalPosition(at[0], at[1], at[2]);
    e.transform.setLocalScale(scale[0], scale[1], scale[2]);
    render(gl, e, mesh, m);
    parts.push(e);
    return e;
  };
  add(b('Hips'), new LathePrimitive([[0, 0.07], [0.13, 0.06], [0.155, -0.01], [0.14, -0.09], [0, -0.1]], 16), pants, [0, 0, 0], [1, 1, 0.72]);
  add(b('Spine'), new LathePrimitive([[0, 0.25], [0.15, 0.24], [0.135, 0.12], [0.145, 0], [0, -0.02]], 16), shirt, [0, 0, 0], [1, 1, 0.66]);
  add(b('Chest'), new LathePrimitive([[0, 0.21], [0.12, 0.2], [0.2, 0.16], [0.19, 0.05], [0.15, -0.02], [0, -0.03]], 16), shirt, [0, 0, 0], [1, 1, 0.62]);
  add(b('Head'), new LathePrimitive([[0.045, 0.07], [0.05, -0.01]], 10), skin);
  add(b('Head'), new SpherePrimitive(0.105, 18, 12), skin, [0, 0.15, -0.005], [0.95, 1.05, 1]);
  add(b('Head'), new SpherePrimitive(0.112, 18, 12), cap, [0, 0.19, 0.01], [1, 0.7, 1]);
  add(b('Head'), new CubePrimitive(2), cap, [0, 0.17, -0.11], [0.08, 0.008, 0.06]);
  for (const side of ['R', 'L']) {
    add(b(`Shoulder${side}`), limb(0.31, 0.052, 0.042), shirt);
    add(b(`Elbow${side}`), limb(0.27, 0.04, 0.032), skin);
    add(b(`Hand${side}`), new SpherePrimitive(0.045, 12, 8), side === 'L' ? await material(gl, [0.97, 0.97, 0.97]) : skin, [0, -0.04, 0], [0.8, 1.2, 0.6]);
    add(b(`Hip${side}`), limb(0.44, 0.078, 0.058), pants);
    add(b(`Knee${side}`), limb(0.44, 0.056, 0.042), pants);
    add(b(`Foot${side}`), new CubePrimitive(2), shoe, [0, -0.025, -0.055], [0.05, 0.035, 0.12]);
  }
  // The club: a shaft along -y, a grip at the top, a head at the end.
  const shaft = add(rig.club, new CubePrimitive(2), steel, [0, -0.5, 0], [0.008, 0.5, 0.008]);
  add(rig.club, new CubePrimitive(2), grip, [0, -0.1, 0], [0.014, 0.1, 0.014]);
  const wood = add(rig.head, new SpherePrimitive(1, 12, 8), await material(gl, [0.15, 0.15, 0.18], { specular: 0.8, roughness: 0.25 }), [-0.04, -0.01, 0], [0.06, 0.03, 0.045]);
  const blade = add(rig.head, new CubePrimitive(2), steel, [-0.035, -0.01, 0], [0.04, 0.025, 0.008]);
  const putter = add(rig.head, new CubePrimitive(2), steel, [-0.05, -0.008, 0], [0.06, 0.012, 0.018]);
  let visible = true, kind = 'iron';
  const show = () => {
    for (const p of parts) p.show = visible;
    wood.show = visible && (kind === 'driver' || kind === 'wood');
    blade.show = visible && (kind === 'iron' || kind === 'wedge');
    putter.show = visible && kind === 'putter';
  };
  show();
  return {
    setShirt(player) { const c = SHIRTS[player % SHIRTS.length]; shirt.color = new Color(c[0], c[1], c[2], 1); },
    setVisible(v) { visible = v; show(); },
    setClub(id, length) {
      kind = id;
      shaft.transform.setLocalPosition(0, -length / 2, 0);
      shaft.transform.setLocalScale(0.008, length / 2, 0.008);
      show();
    },
  };
}
