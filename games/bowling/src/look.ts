// The visuals: meshes, materials (with textures drawn on canvases) and lights.
import { vec2, vec3 } from 'gl-matrix';
import {
  Color, CubePrimitive, DirectionalLight, LathePrimitive, Light, LitMaterial, LitShader, Mesh, MeshData,
  MeshRendererBehaviour, Resources, Scene, SceneEntity, SpherePrimitive, SpotLight, Texture,
} from '../../../src';
import { BALL, LANE, LaneEntities, PIN, PIN_SPOTS } from './lane';
import { BowlerRig, rigEntities } from './bowler';
import { OBSTACLE, ObstacleField } from './obstacles';

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
export async function dressLane(gl: Gl, scene: Scene, lane: LaneEntities): Promise<{ ballMesh: MeshData; ballMaterial: LitMaterial }> {
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
  const ballMesh = new SpherePrimitive(BALL.radius, 32, 16);
  const ballMaterial = await material(gl, [1, 1, 1], { tex: ballTex, specular: 1, roughness: 0.05 });
  render(gl, lane.ball, ballMesh, ballMaterial);

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
  return { ballMesh, ballMaterial };
}

/** Shirt colours, one per player. */
export const SHIRTS: number[][] = [[0.85, 0.28, 0.17], [0.12, 0.62, 0.6], [0.88, 0.65, 0.15], [0.48, 0.3, 0.77]];

/**
 * A capsule-like limb hanging down from its joint: radius r0 at the joint,
 * r1 at length `length`, rounded at both ends.
 */
function limb(length: number, r0: number, r1: number): MeshData {
  const profile: [number, number][] = [];
  for (let k = 0; k <= 4; k++) {
    const a = (k / 4) * (Math.PI / 2);
    profile.push([r0 * Math.sin(a), r0 * Math.cos(a) * 0.8]);
  }
  for (let k = 0; k <= 4; k++) {
    const a = (k / 4) * (Math.PI / 2);
    profile.push([r1 * Math.cos(a), -length - r1 * Math.sin(a) * 0.8]);
  }
  return new LathePrimitive(profile, 12);
}

/** A piece of the figure: a mesh on a joint, offset and scaled. */
function part(gl: Gl, scene: Scene, joint: SceneEntity, mesh: MeshData, m: LitMaterial, at: number[] = [0, 0, 0], scale: number[] = [1, 1, 1]): SceneEntity {
  const e = new SceneEntity(`${joint.name} (mesh)`);
  e.transform.setParent(joint.transform);
  e.transform.setLocalPosition(at[0], at[1], at[2]);
  e.transform.setLocalScale(scale[0], scale[1], scale[2]);
  render(gl, e, mesh, m);
  scene.addEntity(e);
  return e;
}

/** The dressed bowler: change the shirt (one colour per player), show or hide the figure. */
export interface BowlerLook {
  setShirt(player: number): void;
  setVisible(visible: boolean): void;
}

/**
 * Gives the bowler its meshes (simple rounded shapes: torso, head, limbs,
 * shoes) and the ball in its hand.
 */
export async function dressBowler(
  gl: Gl, scene: Scene, rig: BowlerRig, ball: { ballMesh: MeshData; ballMaterial: LitMaterial },
): Promise<BowlerLook> {
  const shirt = await material(gl, SHIRTS[0], { specular: 0.15, roughness: 0.8 });
  const pants = await material(gl, [0.12, 0.13, 0.17], { specular: 0.1, roughness: 0.8 });
  const skin = await material(gl, [0.86, 0.64, 0.5], { specular: 0.2, roughness: 0.6 });
  const hair = await material(gl, [0.12, 0.08, 0.05], { specular: 0.3, roughness: 0.5 });
  const shoe = await material(gl, [0.85, 0.85, 0.82], { specular: 0.3, roughness: 0.5 });
  const sole = await material(gl, [0.6, 0.12, 0.1], { specular: 0.2, roughness: 0.6 });
  const b = (name: string) => rig.bones.get(name)!;
  for (const e of rigEntities(rig)) scene.addEntity(e);
  const parts: SceneEntity[] = [];
  const add = (...args: Parameters<typeof part>) => { parts.push(part(...args)); };

  add(gl, scene, b('Hips'), new LathePrimitive([[0, 0.07], [0.13, 0.06], [0.155, -0.01], [0.14, -0.09], [0, -0.1]], 16), pants, [0, 0, 0], [1, 1, 0.72]);
  add(gl, scene, b('Spine'), new LathePrimitive([[0, 0.25], [0.15, 0.24], [0.135, 0.12], [0.145, 0], [0, -0.02]], 16), shirt, [0, 0, 0], [1, 1, 0.66]);
  add(gl, scene, b('Chest'), new LathePrimitive([[0, 0.21], [0.12, 0.2], [0.2, 0.16], [0.19, 0.05], [0.15, -0.02], [0, -0.03]], 16), shirt, [0, 0, 0], [1, 1, 0.62]);
  add(gl, scene, b('Head'), new LathePrimitive([[0.045, 0.07], [0.05, -0.01]], 10), skin);
  add(gl, scene, b('Head'), new SpherePrimitive(0.105, 18, 12), skin, [0, 0.15, -0.005], [0.95, 1.05, 1]);
  add(gl, scene, b('Head'), new SpherePrimitive(0.11, 18, 12), hair, [0, 0.17, 0.012], [0.98, 0.95, 1]);
  for (const side of ['R', 'L']) {
    add(gl, scene, b(`Shoulder${side}`), limb(0.31, 0.052, 0.042), shirt);
    add(gl, scene, b(`Elbow${side}`), limb(0.27, 0.04, 0.032), skin);
    add(gl, scene, b(`Hand${side}`), new SpherePrimitive(0.045, 12, 8), skin, [0, -0.04, 0], [0.8, 1.2, 0.6]);
    add(gl, scene, b(`Hip${side}`), limb(0.44, 0.078, 0.058), pants);
    add(gl, scene, b(`Knee${side}`), limb(0.44, 0.056, 0.042), pants);
    add(gl, scene, b(`Foot${side}`), new CubePrimitive(2), shoe, [0, -0.025, -0.055], [0.05, 0.035, 0.12]);
    add(gl, scene, b(`Foot${side}`), new CubePrimitive(2), sole, [0, -0.055, -0.055], [0.052, 0.006, 0.122]);
  }
  render(gl, rig.ball, ball.ballMesh, ball.ballMaterial);
  return {
    setShirt(player: number) {
      const c = SHIRTS[player % SHIRTS.length];
      shirt.color = new Color(c[0], c[1], c[2], 1);
    },
    setVisible(visible: boolean) {
      for (const p of parts) p.show = visible;
    },
  };
}

/**
 * The aim guide: glowing chevrons on the lane in front of the ball, pointing
 * where a straight swipe sends it. Built along -Z from the origin; the game
 * places it at the ball and turns it about Y.
 */
export async function makeAimGuide(gl: Gl, scene: Scene): Promise<SceneEntity> {
  const v: vec3[] = [], n: vec3[] = [], uv: vec2[] = [], idx: number[] = [];
  const tri = (a: vec3, b: vec3, c: vec3) => {
    // Counter-clockwise seen from above (normal +Y).
    const up = (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]);
    const base = v.length;
    v.push(a, ...(up > 0 ? [b, c] : [c, b]));
    n.push([0, 1, 0], [0, 1, 0], [0, 1, 0]);
    uv.push([0.5, 0.5], [0.5, 0.5], [0.5, 0.5]);
    idx.push(base, base + 1, base + 2);
  };
  // Solid arrowheads, long along the lane: the camera sees the lane at a grazing angle.
  for (let k = 0; k < 6; k++) {
    const z = -0.9 - k * 0.85, w = 0.06, len = 0.4;
    tri([0, 0, z - len], [-w, 0, z], [w, 0, z]);
  }
  const guide = new SceneEntity('Aim guide');
  const glow = await canvasTexture(gl, 4, 4, (c) => { c.fillStyle = '#ff4d0a'; c.fillRect(0, 0, 4, 4); });
  const m = await material(gl, [0, 0, 0], { specular: 0 });
  m.emissiveTex = glow;
  render(gl, guide, new MeshData(v, n, uv, idx), m);
  scene.addEntity(guide);
  return guide;
}

/** Gives the obstacle pool its meshes: bollards, rubber bumpers, striped sliders, a paddle and wind arrows. */
export async function dressObstacles(gl: Gl, scene: Scene, field: ObstacleField): Promise<void> {
  // Each texture twice: lit, and dimmer as a glow, so the obstacles read from the far end of a dark lane.
  const banded = (glow: number) => canvasTexture(gl, 16, 64, (c) => {
    c.fillStyle = shade('#f26a1b', glow);
    c.fillRect(0, 0, 16, 64);
    c.fillStyle = shade('#f4f1ea', glow);
    c.fillRect(0, 14, 16, 9);
    c.fillRect(0, 32, 16, 9);
  });
  const hazard = (glow: number) => canvasTexture(gl, 64, 64, (c) => {
    c.fillStyle = shade('#f2c21b', glow);
    c.fillRect(0, 0, 64, 64);
    c.fillStyle = '#1a1a1a';
    for (let k = -64; k < 128; k += 22) {
      c.beginPath();
      c.moveTo(k, 0); c.lineTo(k + 11, 0); c.lineTo(k + 11 - 64, 64); c.lineTo(k - 64, 64);
      c.fill();
    }
  });
  const flat = (hex: string, glow: number) => canvasTexture(gl, 4, 4, (c) => { c.fillStyle = shade(hex, glow); c.fillRect(0, 0, 4, 4); });
  const glowing = async (m: LitMaterial, tex: Texture) => { m.emissiveTex = tex; return m; };
  const postMat = await glowing(await material(gl, [1, 1, 1], { tex: await banded(1), specular: 0.4, roughness: 0.4 }), await banded(0.45));
  const rubber = await glowing(await material(gl, [0.75, 0.08, 0.1], { specular: 0.5, roughness: 0.3 }), await flat('#c0141c', 0.5));
  const hazardMat = await glowing(await material(gl, [1, 1, 1], { tex: await hazard(1), specular: 0.5, roughness: 0.35 }), await hazard(0.45));
  const metal = await glowing(await material(gl, [0.8, 0.42, 0.12], { specular: 0.9, roughness: 0.25 }), await flat('#d06a1c', 0.4));
  const steel = await material(gl, [0.5, 0.52, 0.56], { specular: 0.9, roughness: 0.2 });
  const arrows = await material(gl, [0, 0, 0], { specular: 0 });
  arrows.emissiveTex = await canvasTexture(gl, 4, 4, (c) => { c.fillStyle = '#3ad0ff'; c.fillRect(0, 0, 4, 4); });

  const { post, bumper, slider, spinner } = OBSTACLE;
  const postMesh = new LathePrimitive([[0, post.height], [post.radius * 0.7, post.height - 0.005], [post.radius, post.height - 0.03], [post.radius, 0.02], [post.radius * 1.15, 0], [0, 0]], 16);
  const bumperMesh = new LathePrimitive([[0, bumper.height], [bumper.radius * 0.8, bumper.height], [bumper.radius, bumper.height - 0.02], [bumper.radius, 0.01], [0, 0]], 16);
  // Wind: rows of arrowheads pointing +X across the lane, for a zone 2 m long (scaled to the zone's length).
  const v: vec3[] = [], n: vec3[] = [], uv: vec2[] = [], idx: number[] = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 3; col++) {
      const z = -0.75 + row * 0.5 + (col % 2) * 0.25, x = -0.3 + col * 0.3;
      const base = v.length;
      // Counter-clockwise seen from above.
      v.push([x + 0.09, 0, z], [x - 0.06, 0, z - 0.07], [x - 0.06, 0, z + 0.07]);
      n.push([0, 1, 0], [0, 1, 0], [0, 1, 0]);
      uv.push([0.5, 0.5], [0.5, 0.5], [0.5, 0.5]);
      idx.push(base, base + 1, base + 2);
    }
  }
  const windMesh = new MeshData(v, n, uv, idx);

  for (const slot of field.slots) {
    const e = slot.entity;
    scene.addEntity(e);
    switch (slot.kind) {
      case 'post': part(gl, scene, e, postMesh, postMat); break;
      case 'bumper': part(gl, scene, e, bumperMesh, rubber); break;
      case 'slider': part(gl, scene, e, new CubePrimitive(2), hazardMat, [0, slider.half[1], 0], slider.half); break;
      case 'spinner':
        part(gl, scene, e, new CubePrimitive(2), metal, [0, spinner.half[1], 0], spinner.half);
        part(gl, scene, e, new LathePrimitive([[0, 0.24], [0.05, 0.24], [0.05, 0], [0, 0]], 12), steel);
        break;
      case 'wind': part(gl, scene, e, windMesh, arrows); break;
    }
  }
}

/** A #rrggbb colour scaled by `k` (0..1). */
function shade(hex: string, k: number): string {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.round(v * k));
  return `rgb(${c.join(', ')})`;
}
