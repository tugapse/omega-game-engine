// The visuals: the terrain mesh and its painted surface, the ball, the flag,
// the aim marker, the sky and the light.
import { vec2, vec3 } from 'gl-matrix';
import {
  Color, CubePrimitive, DirectionalLight, Light, LitMaterial, LitShader, Mesh, MeshData, MeshRendererBehaviour,
  Resources, Scene, SceneEntity, SpherePrimitive, Texture,
} from '../../../src';
import { BALL } from './ball';
import { Hole } from './course';
import { HeightField, Surface } from './terrain';

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

function entity(scene: Scene, name: string, parent?: SceneEntity): SceneEntity {
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
  return new MeshData(v, nrm, uv, idx);
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

export interface CourseLook {
  ball: SceneEntity;
  flag: SceneEntity;
  marker: SceneEntity;
  /** Puts the flag (and cup) at a point on the ground. */
  placeFlag(x: number, y: number, z: number): void;
}

/** How much bigger the ball is drawn than it is, so it can be seen. */
export const BALL_LOOK = 1.6;

export async function dressCourse(gl: Gl, scene: Scene, hole: Hole): Promise<CourseLook> {
  const field = hole.ground;
  const tex = await canvasTexture(gl, field.snx, field.snz, (c) => drawSurfaces(c, field));
  const ground = entity(scene, 'Terrain');
  render(gl, ground, terrainMesh(field), await material(gl, [1, 1, 1], { tex, specular: 0, roughness: 1 }));
  // A wide skirt below the edges, so the world does not end at the hole's area.
  const skirt = entity(scene, 'Skirt');
  const lowest = field.heights.reduce((a, b) => Math.min(a, b), Infinity);
  skirt.transform.setLocalPosition((field.x0 + field.x1) / 2, lowest - 3.5, (field.z0 + field.z1) / 2);
  skirt.transform.setLocalScale(1500, 1, 1500);
  render(gl, skirt, new CubePrimitive(1), await material(gl, SURFACE_RGB.out.map((c) => (c / 255) * 0.85), { specular: 0, roughness: 1 }));

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

  // Where the ball should land: a ring of four bright bars on the ground.
  const marker = entity(scene, 'Marker');
  const markMat = await material(gl, [0.2, 0.95, 1]);
  for (let k = 0; k < 4; k++) {
    const bar = entity(scene, `Marker ${k}`, marker);
    const a = (k * Math.PI) / 2;
    bar.transform.setLocalPosition(Math.cos(a) * 2.2, 0.15, Math.sin(a) * 2.2);
    bar.transform.setLocalScale(k % 2 ? 1.2 : 0.18, 0.05, k % 2 ? 0.18 : 1.2);
    render(gl, bar, new CubePrimitive(2), markMat);
  }
  // A thin beacon above it, so it can be seen from far away.
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
  };
}
