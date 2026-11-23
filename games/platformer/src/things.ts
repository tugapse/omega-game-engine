// The visuals of what changes as a level is played: bricks and bonus blocks
// (with a little hop when bumped), coins (spinning; one pops out of a bonus
// block), the enemies (our own: Bolota, a round slime; Casco, a beetle that
// hides in its shell; Zumbido, a buzzing drone) and the checkpoint posts.
import { CubePrimitive, LitMaterial, MeshData, Scene, SceneEntity, SpherePrimitive } from '../../../src';
import { blockMaterials, canvasTexture, makeEntity, material, render } from './look';
import { Enemy, World } from './world';

type Gl = WebGL2RenderingContext;

export interface ThingsLook {
  /** Matches the visuals to the world (a new try resets everything); `dt` drives the animations. */
  sync(w: World, dt: number, view: { left: number; right: number }): void;
  /** Starts the hop of a bumped block and, for a coin from a bonus block, its pop. */
  bump(x: number, y: number, coin: boolean): void;
  hide(): void;
}

interface Part { e: SceneEntity; at: number[]; scale: number[] }

/** An entity made of parts that move together (parts keep their own offsets and sizes). */
function group(scene: Scene, name: string) {
  const root = makeEntity(scene, name);
  const parts: Part[] = [];
  return {
    root, parts,
    add(gl: Gl, mesh: MeshData, mat: LitMaterial, at: number[], scale: number[], parent: SceneEntity = root): SceneEntity {
      const e = makeEntity(scene, `${name} part`, parent);
      e.transform.setLocalPosition(at[0], at[1], at[2]);
      e.transform.setLocalScale(scale[0], scale[1], scale[2]);
      render(gl, e, mesh, mat);
      parts.push({ e, at, scale });
      return e;
    },
    show(on: boolean) { for (const p of parts) p.e.show = on; },
  };
}

type Group = ReturnType<typeof group>;

export async function dressThings(gl: Gl, scene: Scene, w: World): Promise<ThingsLook> {
  const level = w.level;
  const cube = new CubePrimitive(1);
  const ball = new SpherePrimitive(1, 20, 12);
  const blocks = await blockMaterials(gl);
  const glow = async (css: string) => canvasTexture(gl, 4, (c, s) => { c.fillStyle = css; c.fillRect(0, 0, s, s); });

  // Bricks and bonus blocks: one entity each (a used look waiting behind a bonus block).
  const tiles = new Map<string, { x: number; y: number; looks: Record<string, SceneEntity>; hop: number }>();
  for (let x = 0; x < level.width; x++) {
    for (let y = 0; y < level.height; y++) {
      const t = level.tiles[x][y];
      if (t !== 'brick' && t !== 'bonus') continue;
      const looks: Record<string, SceneEntity> = {};
      for (const kind of t === 'bonus' ? ['bonus', 'used'] as const : ['brick'] as const) {
        const e = makeEntity(scene, `${kind} ${x},${y}`);
        e.transform.setLocalPosition(x + 0.5, y + 0.5, 0);
        render(gl, e, cube, blocks[kind]);
        looks[kind] = e;
      }
      tiles.set(`${x},${y}`, { x, y, looks, hop: 0 });
    }
  }

  // Coins: a gold disc that spins.
  const coinMat = await material(gl, [1, 0.78, 0.18], { glow: await glow('#5a3f00'), specular: 0.9, roughness: 0.2 });
  const coinMesh = new SpherePrimitive(1, 18, 10);
  const coinLook = (name: string) => {
    const e = makeEntity(scene, name);
    render(gl, e, coinMesh, coinMat);
    e.transform.setLocalScale(0.32, 0.32, 0.07);
    return e;
  };
  const coins = w.coins.map((c, i) => coinLook(`Coin ${i}`));
  /** Coins popping out of bonus blocks: up, then gone. */
  const pops: { e: SceneEntity; x: number; y: number; t: number }[] = [];
  const popPool = Array.from({ length: 4 }, (_, i) => coinLook(`Coin pop ${i}`));
  for (const e of popPool) e.show = false;

  // The enemies.
  const purple = await material(gl, [0.62, 0.32, 0.9], { specular: 0.5, roughness: 0.35 });
  const white = await material(gl, [1, 1, 1], { specular: 0.2 });
  const black = await material(gl, [0.05, 0.05, 0.08], { specular: 0.6, roughness: 0.2 });
  const shellMat = await material(gl, [0.95, 0.38, 0.18], { specular: 0.7, roughness: 0.25 });
  const spotMat = await material(gl, [1, 0.85, 0.35], { specular: 0.3 });
  const darkMat = await material(gl, [0.18, 0.15, 0.2], { specular: 0.3 });
  const yellow = await material(gl, [1, 0.82, 0.15], { specular: 0.5, roughness: 0.3 });
  const wing = await material(gl, [0.75, 0.92, 1], { glow: await glow('#2a4a5a'), specular: 0.9, roughness: 0.1 });
  type EnemyLook = { g: Group; body: SceneEntity; extra: SceneEntity[]; wings: SceneEntity[] };
  const enemyLooks: EnemyLook[] = w.enemies.map((en) => {
    const g = group(scene, `${en.kind} ${en.id}`);
    // Everything hangs off one body entity, so squashing and flipping move it all.
    const body = makeEntity(scene, `${en.kind} ${en.id} body`, g.root);
    const extra: SceneEntity[] = [], wings: SceneEntity[] = [];
    if (en.kind === 'walker') {
      g.add(gl, ball, purple, [0, 0.36, 0], [0.42, 0.36, 0.4], body);
      for (const sx of [-1, 1]) {
        g.add(gl, ball, white, [sx * 0.13, 0.46, 0.33], [0.1, 0.12, 0.06], body);
        g.add(gl, ball, black, [sx * 0.12, 0.45, 0.38], [0.05, 0.07, 0.03], body);
        // Cross brows.
        g.add(gl, cube, black, [sx * 0.13, 0.6, 0.35], [0.16, 0.035, 0.03], body).transform.setLocalRotation(0, 0, sx * -18);
        extra.push(g.add(gl, ball, darkMat, [sx * 0.2, 0.05, 0.05], [0.12, 0.06, 0.16], body));
      }
    } else if (en.kind === 'shell') {
      g.add(gl, ball, shellMat, [0, 0.38, 0], [0.42, 0.34, 0.38], body);
      for (const [sx, sy] of [[-0.18, 0.55], [0.15, 0.6], [0, 0.42], [0.25, 0.4], [-0.27, 0.36]]) {
        g.add(gl, ball, spotMat, [sx, sy, 0.3], [0.07, 0.07, 0.05], body);
      }
      g.add(gl, cube, darkMat, [0, 0.1, 0], [0.7, 0.08, 0.6], body);
      // Head and legs: hidden in the shell.
      const head = g.add(gl, ball, darkMat, [0.42, 0.32, 0.08], [0.18, 0.16, 0.16], body);
      extra.push(head);
      for (const sx of [-1, 1]) {
        extra.push(g.add(gl, ball, white, [0.52, 0.38, 0.08 + sx * 0.08], [0.05, 0.06, 0.04], body));
        for (const lz of [-0.18, 0.18]) extra.push(g.add(gl, cube, darkMat, [sx * 0.2, 0.05, lz], [0.06, 0.12, 0.06], body));
      }
    } else {
      g.add(gl, ball, yellow, [0, 0.35, 0], [0.34, 0.3, 0.3], body);
      g.add(gl, ball, black, [0, 0.35, 0], [0.345, 0.08, 0.305], body);
      g.add(gl, ball, black, [0, 0.18, 0], [0.2, 0.08, 0.2], body);
      for (const sx of [-1, 1]) {
        g.add(gl, ball, white, [sx * 0.11, 0.45, 0.24], [0.08, 0.1, 0.05], body);
        g.add(gl, ball, black, [sx * 0.11, 0.45, 0.28], [0.04, 0.05, 0.025], body);
      }
      for (const sx of [-1, 1]) {
        const pivot = makeEntity(scene, 'wing pivot', body);
        pivot.transform.setLocalPosition(sx * 0.12, 0.62, -0.05);
        g.add(gl, ball, wing, [sx * 0.2, 0.12, 0], [0.24, 0.12, 0.03], pivot);
        wings.push(pivot);
      }
    }
    return { g, body, extra, wings };
  });

  // Checkpoints: a post with a flag, grey until reached.
  const postMat = await material(gl, [0.85, 0.87, 0.9], { specular: 0.5 });
  const offMat = await material(gl, [0.55, 0.57, 0.62]);
  const onMat = await material(gl, [0.15, 0.85, 0.75], { glow: await glow('#0a4a40') });
  const checkpoints = w.checkpoints.map((cp, i) => {
    const g = group(scene, `Checkpoint ${i}`);
    g.root.transform.setLocalPosition(cp.x, cp.y, -0.6);
    g.add(gl, cube, postMat, [0, 1.1, 0], [0.08, 2.2, 0.08]);
    g.add(gl, ball, postMat, [0, 2.25, 0], [0.1, 0.1, 0.1]);
    const off = g.add(gl, cube, offMat, [0.35, 1.9, 0], [0.6, 0.4, 0.04]);
    const on = g.add(gl, cube, onMat, [0.35, 1.9, 0], [0.6, 0.4, 0.04]);
    return { g, cp, off, on };
  });

  let time = 0;
  const near = (x: number, view: { left: number; right: number }) => x > view.left - 2 && x < view.right + 2;
  const placeEnemy = (look: EnemyLook, en: Enemy) => {
    const b = en.body;
    const on = en.state !== 'gone' && en.state !== 'asleep';
    look.g.show(on);
    if (!on) return;
    look.g.root.transform.setLocalPosition(b.x, b.y, 0);
    // Faces the way it walks, turned a little towards the camera.
    const yaw = en.dir < 0 ? -55 : 55;
    let sy = 1, roll = 0, lift = 0;
    if (en.state === 'squashed') sy = 0.25;
    if (en.state === 'out') { roll = 180; lift = b.h; }
    if (en.kind === 'walker' && en.state === 'walk') sy = 1 + Math.sin(en.time * 14) * 0.06;
    look.g.root.transform.setLocalRotation(0, yaw, roll);
    look.body.transform.setLocalPosition(0, lift, 0);
    look.body.transform.setLocalScale(1 / Math.sqrt(sy), sy, 1);
    const hidden = en.kind === 'shell' && (en.state === 'shell' || en.state === 'slide');
    for (const e of look.extra) e.show = !hidden;
    if (en.kind === 'shell' && en.state === 'slide') look.g.root.transform.setLocalRotation(0, time * 900, 0);
    for (const [i, p] of look.wings.entries()) p.transform.setLocalRotation(0, 0, (i ? -1 : 1) * Math.sin(time * 50) * 35);
  };

  return {
    sync(world, dt, view) {
      time += dt;
      for (const t of tiles.values()) {
        const tile = world.level.tiles[t.x][t.y];
        t.hop = Math.max(0, t.hop - dt);
        const lift = Math.sin((t.hop / 0.18) * Math.PI) * 0.3 * (t.hop > 0 ? 1 : 0);
        const vis = near(t.x, view);
        for (const [kind, e] of Object.entries(t.looks)) {
          e.show = vis && kind === tile;
          e.transform.setLocalPosition(t.x + 0.5, t.y + 0.5 + lift, 0);
        }
      }
      world.coins.forEach((c, i) => {
        const e = coins[i];
        e.show = !c.taken && near(c.x, view);
        if (e.show) {
          e.transform.setLocalPosition(c.x, c.y + Math.sin(time * 3 + c.x) * 0.05, 0);
          e.transform.setLocalRotation(0, time * 180 + c.x * 40, 0);
        }
      });
      for (let i = pops.length - 1; i >= 0; i--) {
        const p = pops[i];
        p.t += dt;
        const k = p.t / 0.45;
        if (k >= 1) { p.e.show = false; pops.splice(i, 1); continue; }
        p.e.transform.setLocalPosition(p.x, p.y + Math.sin(k * Math.PI) * 1.8, 0.1);
        p.e.transform.setLocalRotation(0, p.t * 1400, 0);
      }
      world.enemies.forEach((en, i) => placeEnemy(enemyLooks[i], en));
      for (const c of checkpoints) {
        const reached = !!world.checkpoint && world.checkpoint.x >= c.cp.x;
        const vis = near(c.cp.x, view);
        c.g.show(vis);
        c.on.show = vis && reached;
        c.off.show = vis && !reached;
      }
    },
    bump(x, y, coin) {
      const t = tiles.get(`${x},${y}`);
      if (t) t.hop = 0.18;
      if (coin) {
        const e = popPool.find((p) => !pops.some((q) => q.e === p)) ?? popPool[0];
        e.show = true;
        pops.push({ e, x: x + 0.5, y: y + 1, t: 0 });
      }
    },
    hide() {
      for (const t of tiles.values()) for (const e of Object.values(t.looks)) e.show = false;
      for (const e of [...coins, ...popPool]) e.show = false;
      for (const l of enemyLooks) l.g.show(false);
      for (const c of checkpoints) c.g.show(false);
    },
  };
}
