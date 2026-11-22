// The visuals: meshes, materials (with textures drawn on canvases) and lights.
import { vec2, vec3 } from 'gl-matrix';
import {
  Color, CubePrimitive, DirectionalLight, LathePrimitive, Light, LitMaterial, LitShader, Mesh, MeshData,
  MeshRendererBehaviour, Resources, Scene, SceneEntity, SpherePrimitive, SpotLight, Texture,
} from '../../../src';
import { BALL, LANE, LaneEntities, PIN, PIN_SPOTS } from './lane';

type Gl = WebGL2RenderingContext;

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
  m.specularStrength = opts.specular ?? 0.2;
  m.roughness = opts.roughness ?? 0.6;
  return m;
}

/** Adds a mesh renderer to `entity` (mesh and shader set before it initialises). */
function render(gl: Gl, entity: SceneEntity, meshData: MeshData, m: LitMaterial): void {
  const mesh = new Mesh();
  mesh.meshData = meshData;
  const renderer = new MeshRendererBehaviour(gl);
  renderer.mesh = mesh;
  renderer.shader = new LitShader(gl, m);
  entity.addBehaviour(renderer);
}

/** A box the size of a lane block, as a child entity scaled to its half extents. */
function boxVisual(gl: Gl, scene: Scene, parent: SceneEntity, halfExtents: vec3, m: LitMaterial): void {
  const child = new SceneEntity(`${parent.name} (mesh)`);
  child.transform.setParent(parent.transform);
  child.transform.setLocalScale(halfExtents[0], halfExtents[1], halfExtents[2]);
  render(gl, child, new CubePrimitive(2), m);
  scene.addEntity(child);
}

/** A flat rectangle on y = 0 from x0..x1 and z0..z1, UV u along x and v along z (0 at z0). */
function flatQuad(x0: number, x1: number, z0: number, z1: number, y = 0): MeshData {
  const v: vec3[] = [[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]];
  const n: vec3[] = v.map(() => [0, 1, 0]);
  const uv: vec2[] = [[0, 0], [1, 0], [1, 1], [0, 1]];
  // Counter-clockwise seen from above when z1 < z0 (the lane runs towards -Z).
  return new MeshData(v, n, uv, z1 < z0 ? [0, 1, 2, 0, 2, 3] : [0, 2, 1, 0, 3, 2]);
}

/** Maple boards, the aiming arrows and dots, the foul line and the pin spots. */
function drawLane(c: CanvasRenderingContext2D, w: number, h: number): void {
  const length = -LANE.deckEnd;
  const boards = 39;
  for (let b = 0; b < boards; b++) {
    const shade = 0.92 + ((b * 37) % 11) / 110;
    c.fillStyle = `rgb(${Math.round(222 * shade)}, ${Math.round(178 * shade)}, ${Math.round(122 * shade)})`;
    c.fillRect((b / boards) * w, 0, w / boards + 1, h);
    c.fillStyle = 'rgba(90, 60, 30, 0.25)';
    c.fillRect((b / boards) * w, 0, 1, h);
  }
  // Grain.
  for (let i = 0; i < 1400; i++) {
    c.fillStyle = `rgba(120, 80, 40, ${0.04 + Math.random() * 0.05})`;
    c.fillRect(Math.random() * w, Math.random() * h, 1, 6 + Math.random() * 30);
  }
  const vOf = (metres: number) => (metres / length) * h;
  const boardX = (board: number) => ((board - 0.5) / boards) * w;
  c.fillStyle = '#7a1c14';
  c.fillRect(0, 0, w, 3); // foul line
  c.fillStyle = '#3a2a1a';
  for (const board of [5, 10, 15, 20, 25, 30, 35]) {
    // Arrows, the middle one furthest down the lane.
    const y = vOf(4.6 - Math.abs(board - 20) * 0.03);
    c.beginPath();
    c.moveTo(boardX(board), y + 22);
    c.lineTo(boardX(board) - 4, y);
    c.lineTo(boardX(board) + 4, y);
    c.closePath();
    c.fill();
  }
  for (const board of [3, 5, 8, 11, 14, 26, 29, 32, 35, 37]) {
    c.beginPath();
    c.arc(boardX(board), vOf(2.1), 2, 0, Math.PI * 2);
    c.fill();
  }
  c.strokeStyle = '#3a2a1a';
  for (const spot of PIN_SPOTS) {
    c.beginPath();
    c.arc(((spot[0] + LANE.halfWidth) / (2 * LANE.halfWidth)) * w, vOf(-spot[2]), 3, 0, Math.PI * 2);
    c.stroke();
  }
}

/** White pin with two red bands around the neck (v follows the profile's length). */
function drawPin(c: CanvasRenderingContext2D, w: number, h: number): void {
  c.fillStyle = '#f4f1ea';
  c.fillRect(0, 0, w, h);
  const p = PIN.profile;
  const lengths = [0];
  for (let i = 1; i < p.length; i++) lengths.push(lengths[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]));
  const total = lengths[lengths.length - 1];
  const vAt = (y: number) => {
    for (let i = 1; i < p.length; i++) {
      if (y <= p[i - 1][1] && y >= p[i][1]) {
        const t = (p[i - 1][1] - y) / ((p[i - 1][1] - p[i][1]) || 1);
        return (lengths[i - 1] + t * (lengths[i] - lengths[i - 1])) / total;
      }
    }
    return 0;
  };
  c.fillStyle = '#c0141c';
  for (const [top, bottom] of [[10.95, 10.55], [10.25, 9.85]]) {
    const y0 = vAt(top * 0.0254) * h, y1 = vAt(bottom * 0.0254) * h;
    c.fillRect(0, y0, w, y1 - y0);
  }
}

/** A dark swirl ball with three finger holes, so its roll shows. */
function drawBall(c: CanvasRenderingContext2D, w: number, h: number): void {
  const g = c.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, '#1b3f8f');
  g.addColorStop(0.5, '#4f2a8a');
  g.addColorStop(1, '#14306e');
  c.fillStyle = g;
  c.fillRect(0, 0, w, h);
  for (let i = 0; i < 40; i++) {
    c.strokeStyle = `rgba(160, 190, 255, ${0.05 + Math.random() * 0.08})`;
    c.lineWidth = 2 + Math.random() * 6;
    c.beginPath();
    c.moveTo(Math.random() * w, Math.random() * h);
    c.bezierCurveTo(Math.random() * w, Math.random() * h, Math.random() * w, Math.random() * h, Math.random() * w, Math.random() * h);
    c.stroke();
  }
  c.fillStyle = '#05060a';
  for (const [u, v, r] of [[0.25, 0.3, 0.035], [0.32, 0.3, 0.035], [0.285, 0.42, 0.045]]) {
    c.beginPath();
    c.ellipse(u * w, v * h, r * w * 0.7, r * h * 1.4, 0, 0, Math.PI * 2);
    c.fill();
  }
}

/** The pinsetter's sweep bar (no physics: main.ts moves it). */
export async function makeSweepBar(gl: Gl, scene: Scene): Promise<SceneEntity> {
  const bar = new SceneEntity('Sweep bar');
  scene.addEntity(bar);
  boxVisual(gl, scene, bar, vec3.fromValues(LANE.halfWidth + 0.2, 0.07, 0.012), await material(gl, [0.55, 0.56, 0.6], { specular: 0.7, roughness: 0.3 }));
  return bar;
}

/** Gives the lane its meshes and adds the room and the lights to `scene`. */
export async function dressLane(gl: Gl, scene: Scene, lane: LaneEntities): Promise<void> {
  const laneTex = await canvasTexture(gl, 256, 2048, (c) => drawLane(c, 256, 2048));
  const laneMat = await material(gl, [1, 1, 1], { tex: laneTex, specular: 0.9, roughness: 0.15 });
  const gutterMat = await material(gl, [0.18, 0.19, 0.22], { specular: 0.6, roughness: 0.3 });
  const darkMat = await material(gl, [0.05, 0.05, 0.06], { specular: 0.1 });
  const floorMat = await material(gl, [0.24, 0.2, 0.17], { specular: 0.3, roughness: 0.4 });
  const wallMat = await material(gl, [0.16, 0.1, 0.2], { specular: 0.05, roughness: 0.9 });

  for (const { entity, name, halfExtents } of lane.blocks) {
    if (name === 'storage') continue;
    const m = name === 'lane' ? darkMat : name.startsWith('gutter') ? gutterMat
      : name === 'approach' ? floorMat : darkMat;
    boxVisual(gl, scene, entity, halfExtents, m);
  }
  // The lane's top: one textured quad just above the slab.
  const top = new SceneEntity('Lane surface');
  render(gl, top, flatQuad(-LANE.halfWidth, LANE.halfWidth, 0, LANE.deckEnd, 0.0005), laneMat);
  scene.addEntity(top);

  const pinTex = await canvasTexture(gl, 64, 256, (c) => drawPin(c, 64, 256));
  const pinMat = await material(gl, [1, 1, 1], { tex: pinTex, specular: 0.8, roughness: 0.1 });
  const pinMesh = new LathePrimitive(PIN.profile, 20);
  for (const pin of lane.pins) render(gl, pin, pinMesh, pinMat);

  const ballTex = await canvasTexture(gl, 256, 128, (c) => drawBall(c, 256, 128));
  render(gl, lane.ball, new SpherePrimitive(BALL.radius, 32, 16), await material(gl, [1, 1, 1], { tex: ballTex, specular: 1, roughness: 0.05 }));

  // The room: side walls, back wall, floor around the lane.
  const room = (name: string, center: number[], half: number[], m: LitMaterial) => {
    const e = new SceneEntity(name);
    e.transform.setLocalPosition(center[0], center[1], center[2]);
    scene.addEntity(e);
    boxVisual(gl, scene, e, vec3.fromValues(half[0], half[1], half[2]), m);
  };
  room('Left wall', [-2.6, 1.5, -8], [0.1, 1.8, 13], wallMat);
  room('Right wall', [2.6, 1.5, -8], [0.1, 1.8, 13], wallMat);
  room('Back wall', [0, 1.5, -21.1], [2.6, 1.8, 0.1], darkMat);
  room('Masking', [0, 1.35, -19.2], [2.6, 0.55, 0.05], wallMat);
  room('Floor', [0, -0.12, -8], [2.6, 0.02, 13], floorMat);

  const ambient = new Light('Ambient light');
  ambient.color = new Color(0.12, 0.11, 0.13, 1);
  scene.addEntity(ambient);
  const fill = new DirectionalLight('Fill light');
  fill.color = new Color(1, 0.92, 0.85, 0.25);
  fill.transform.rotate(50, -30, 0);
  scene.addEntity(fill);
  const spot = (name: string, position: number[], target: number[], cone: [number, number], shadows: boolean, intensity = 1) => {
    const s = new SpotLight(name);
    s.color = new Color(1, 0.93, 0.82, intensity);
    s.transform.setLocalPosition(position[0], position[1], position[2]);
    s.transform.lookAt(vec3.fromValues(target[0], target[1], target[2]));
    s.coneAngles.inner = cone[0];
    s.coneAngles.outer = cone[1];
    s.range = 14;
    s.castShadows = shadows;
    scene.addEntity(s);
  };
  spot('Approach light', [0, 3.2, 1.5], [0, 0, -2.5], [30, 45], true);
  spot('Lane light 1', [0, 3.2, -6], [0, 0, -8], [30, 45], false, 0.8);
  spot('Lane light 2', [0, 3.2, -12], [0, 0, -14], [30, 45], false, 0.8);
  spot('Pin light', [0, 1.6, -17.0], [0, 0.1, -18.8], [28, 42], true, 1.2);
}
