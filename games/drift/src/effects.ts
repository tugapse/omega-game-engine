// What a slide leaves behind: dark tyre marks on the road from the rear
// wheels, and puffs of smoke that grow, rise and fade. And a flame from the
// exhaust while the turbo lasts.
//
// The marks are one mesh of many quads, kept as a ring: each new piece of mark
// overwrites the oldest straight in the vertex buffer on the GPU (the engine
// has no dynamic meshes), so they cost one draw however many there are.
import { vec2, vec3 } from 'gl-matrix';
import { LitMaterial, MeshData, MeshRendererBehaviour, Scene, SceneEntity, SpherePrimitive } from '../../../src';
import { Car } from './car';
import { canvasTexture, makeEntity, material, render } from './look';
import { Track } from './track';

type Gl = WebGL2RenderingContext;

/** Pieces of mark kept, how long each is (m), how wide (m), and how high over the road (m). */
const MARKS = { pieces: 900, every: 0.45, width: 0.26, y: 0.03 };
/** Smoke puffs in the pool, how long one lasts (s), and puffs a second while sliding hard. */
const SMOKE = { pool: 36, life: 1.1, rate: 16 };

/** Where the rear wheels are, from the car's centre: back (m) and to each side (m). */
const REAR = { back: 1.15, side: 0.85 };

export interface Effects {
  /** Leaves marks and smoke behind the car, by how hard its rear tyres slide (0 to 1). */
  update(car: Car, slide: number, dt: number): void;
  /** Wipes the marks and the smoke (a new race). */
  clear(): void;
}

interface Puff { e: SceneEntity; m: LitMaterial; x: number; y: number; z: number; t: number; size: number; vx: number; vz: number }

export async function dressEffects(gl: Gl, scene: Scene, track: Track, smokeColor = [0.72, 0.72, 0.76]): Promise<Effects> {
  // The marks: quads with their four corners, all folded flat at a far corner of the track at first.
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const p of track.samples) { x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y); }
  const v: vec3[] = [], n: vec3[] = [], uv: vec2[] = [], idx: number[] = [];
  for (let i = 0; i < MARKS.pieces; i++) {
    const k = v.length;
    for (let j = 0; j < 4; j++) { v.push([x0, -1, -y0]); n.push([0, 1, 0]); uv.push([j & 1, j >> 1]); }
    idx.push(k, k + 1, k + 3, k, k + 3, k + 2);
  }
  // Two corners spread over the whole track, so the mesh's bounds never cull it.
  v[0] = [x0 - 10, -1, -(y0 - 10)];
  v[1] = [x1 + 10, -1, -(y1 + 10)];
  const mesh = new MeshData(v, n, uv, idx);
  mesh.providedNormals = true;
  const markEntity = makeEntity(scene, 'Tyre marks');
  const markTex = await canvasTexture(gl, 16, (c, s) => {
    c.fillStyle = '#fff'; c.fillRect(0, 0, s, s);
    c.fillStyle = 'rgba(0,0,0,.25)'; for (let i = 0; i < s; i += 3) c.fillRect(i, 0, 1, s);
  });
  const marks = render(gl, markEntity, mesh, await material(gl, [0.06, 0.06, 0.07], { tex: markTex, alpha: 0.55, specular: 0 }));
  marks.receiveShadows = false;
  let next = 0;
  const last: ({ x: number; y: number } | null)[] = [null, null];
  const piece = new Float32Array(12);

  /** One quad from a to b (on the plane), written over the oldest. */
  const lay = (ax: number, ay: number, bx: number, by: number, w: number) => {
    const buf = (marks as MeshRendererBehaviour).shader?.buffers.position;
    if (!buf) return;
    const dx = bx - ax, dy = by - ay, l = Math.hypot(dx, dy) || 1;
    const nx = (-dy / l) * w / 2, ny = (dx / l) * w / 2;
    const corners = [[ax + nx, ay + ny], [ax - nx, ay - ny], [bx + nx, by + ny], [bx - nx, by - ny]];
    corners.forEach(([x, y], j) => { piece[j * 3] = x; piece[j * 3 + 1] = MARKS.y; piece[j * 3 + 2] = -y; });
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    // The first piece holds the bounds' corners: never overwrite it.
    if (next === 0) next = 1;
    gl.bufferSubData(gl.ARRAY_BUFFER, next * 12 * 4, piece);
    next = (next + 1) % MARKS.pieces;
  };

  // The smoke.
  const ball = new SpherePrimitive(1, 12, 9);
  const puffs: Puff[] = [];
  for (let i = 0; i < SMOKE.pool; i++) {
    const e = makeEntity(scene, `Smoke ${i}`);
    const m = await material(gl, smokeColor, { alpha: 0.5, specular: 0, roughness: 1 });
    render(gl, e, ball, m);
    e.show = false;
    puffs.push({ e, m, x: 0, y: 0, z: 0, t: Infinity, size: 1, vx: 0, vz: 0 });
  }
  let puffNext = 0, owed = 0;

  return {
    update(car, slide, dt) {
      const cos = Math.cos(car.heading), sin = Math.sin(car.heading);
      const wheels = [1, -1].map((side) => ({
        x: car.x - cos * REAR.back - sin * REAR.side * side,
        y: car.y - sin * REAR.back + cos * REAR.side * side,
      }));
      // Marks while sliding.
      wheels.forEach((w, i) => {
        if (slide < 0.25) { last[i] = null; return; }
        const l = last[i];
        if (!l) { last[i] = w; return; }
        if (Math.hypot(w.x - l.x, w.y - l.y) >= MARKS.every) {
          lay(l.x, l.y, w.x, w.y, MARKS.width);
          last[i] = w;
        }
      });
      // Smoke while sliding hard.
      owed += slide > 0.55 ? SMOKE.rate * slide * dt : 0;
      while (owed >= 1) {
        owed -= 1;
        const w = wheels[puffNext % 2];
        const p = puffs[puffNext];
        puffNext = (puffNext + 1) % SMOKE.pool;
        p.x = w.x + (Math.random() - 0.5) * 0.4; p.z = -(w.y + (Math.random() - 0.5) * 0.4); p.y = 0.35;
        p.vx = car.vx * 0.15 + (Math.random() - 0.5); p.vz = -car.vy * 0.15 + (Math.random() - 0.5);
        p.t = 0; p.size = 0.3 + Math.random() * 0.2;
        p.e.show = true;
      }
      for (const p of puffs) {
        if (p.t === Infinity) continue;
        p.t += dt;
        if (p.t >= SMOKE.life) { p.t = Infinity; p.e.show = false; continue; }
        const k = p.t / SMOKE.life;
        p.x += p.vx * dt; p.z += p.vz * dt; p.y += 0.9 * dt;
        const s = p.size * (1 + k * 2);
        p.e.transform.setLocalPosition(p.x, p.y + s * 0.3, p.z);
        p.e.transform.setLocalScale(s, s * 0.75, s);
        p.m.color.a = 0.32 * (1 - k) * (1 - k);
      }
    },
    clear() {
      const buf = (marks as MeshRendererBehaviour).shader?.buffers.position;
      if (buf) {
        // Fold every piece back under the road (keeping the bounds' corners).
        const flat = new Float32Array((MARKS.pieces - 1) * 12).fill(-1);
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferSubData(gl.ARRAY_BUFFER, 12 * 4, flat);
      }
      next = 1; last[0] = last[1] = null;
      for (const p of puffs) { p.t = Infinity; p.e.show = false; }
    },
  };
}
