// Particles: little bits that fly out and fade (dust where Bit jumps and
// lands, sparkles from coins, stars from stomps, a burst when a boss is hit).
// A few entities per colour, reused (the engine has no instancing), each
// shrinking away over its life.
import { CubePrimitive, LitMaterial, Scene, SceneEntity, SpherePrimitive } from '../../../src';
import { canvasTexture, makeEntity, material, render } from './look';

type Gl = WebGL2RenderingContext;

export type Bits = 'dust' | 'gold' | 'star' | 'pink' | 'teal';

export interface Burst {
  /** How many bits, how fast (m/s) they fly out, and how much upward they lean (0: all round, 1: straight up). */
  n: number;
  speed: number;
  up?: number;
  /** How long (s) they last, their size (m), and gravity (m/s²). */
  life?: number;
  size?: number;
  gravity?: number;
}

export interface Effects {
  burst(kind: Bits, x: number, y: number, b: Burst): void;
  update(dt: number): void;
  hide(): void;
}

interface Bit { e: SceneEntity; x: number; y: number; z: number; vx: number; vy: number; vz: number; t: number; life: number; size: number; gravity: number; spin: number }

const POOL: Record<Bits, number> = { dust: 24, gold: 24, star: 16, pink: 20, teal: 16 };

export async function dressEffects(gl: Gl, scene: Scene, dustColor: number[]): Promise<Effects> {
  const ball = new SpherePrimitive(1, 8, 6);
  const cube = new CubePrimitive(1);
  const glow = async (css: string) => canvasTexture(gl, 4, (c, s) => { c.fillStyle = css; c.fillRect(0, 0, s, s); });
  const mats: Record<Bits, LitMaterial> = {
    dust: await material(gl, dustColor, { specular: 0 }),
    gold: await material(gl, [1, 0.85, 0.3], { glow: await glow('#a07010'), specular: 0.8, roughness: 0.2 }),
    star: await material(gl, [1, 1, 0.85], { glow: await glow('#b0a060'), specular: 0.5 }),
    pink: await material(gl, [1, 0.35, 0.65], { glow: await glow('#a01450'), specular: 0.4 }),
    teal: await material(gl, [0.2, 0.95, 0.85], { glow: await glow('#0b6a60'), specular: 0.4 }),
  };
  const free: Record<Bits, SceneEntity[]> = { dust: [], gold: [], star: [], pink: [], teal: [] };
  for (const kind of Object.keys(POOL) as Bits[]) {
    for (let i = 0; i < POOL[kind]; i++) {
      const e = makeEntity(scene, `${kind} bit ${i}`);
      render(gl, e, kind === 'star' || kind === 'gold' ? cube : ball, mats[kind]);
      e.show = false;
      free[kind].push(e);
    }
  }
  const live: (Bit & { kind: Bits })[] = [];
  // A cheap repeatable spread, so bursts do not all look the same.
  let seed = 1;
  const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };

  return {
    burst(kind, x, y, b) {
      for (let i = 0; i < b.n; i++) {
        let e = free[kind].pop();
        if (!e) {
          // All in use: take the oldest of this kind.
          const old = live.findIndex((p) => p.kind === kind);
          if (old < 0) return;
          e = live[old].e;
          live.splice(old, 1);
        }
        const a = rand() * Math.PI * 2, up = b.up ?? 0.5;
        const sp = b.speed * (0.5 + rand() * 0.6);
        const vx = Math.cos(a) * sp * (1 - up * 0.6);
        const vy = Math.abs(Math.sin(a)) * sp * (0.4 + up) + up * sp * 0.4;
        e.show = true;
        live.push({
          kind, e, x, y, z: 0.4, vx, vy, vz: (rand() - 0.3) * sp * 0.4, t: 0,
          life: (b.life ?? 0.6) * (0.7 + rand() * 0.6), size: (b.size ?? 0.12) * (0.7 + rand() * 0.6), gravity: b.gravity ?? 18, spin: (rand() - 0.5) * 900,
        });
      }
    },
    update(dt) {
      for (let i = live.length - 1; i >= 0; i--) {
        const p = live[i];
        p.t += dt;
        if (p.t >= p.life) { p.e.show = false; free[p.kind].push(p.e); live.splice(i, 1); continue; }
        p.vy -= p.gravity * dt;
        p.vx *= 1 - Math.min(1, dt * 1.5);
        p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
        const s = p.size * (1 - p.t / p.life);
        p.e.transform.setLocalPosition(p.x, p.y, p.z);
        p.e.transform.setLocalScale(s, s, s);
        p.e.transform.setLocalRotation(p.t * p.spin, p.t * p.spin * 0.7, 0);
      }
    },
    hide() {
      for (const p of live) { p.e.show = false; free[p.kind].push(p.e); }
      live.length = 0;
    },
  };
}
