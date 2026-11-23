// The visuals of what changes as a level is played: bricks and bonus blocks
// (with a little hop when bumped), coins (spinning; one pops out of a bonus
// block), the enemies (our own: Bolota, a round slime; Casco, a beetle that
// hides in its shell; Zumbido, a buzzing drone), the checkpoint posts, the
// power-ups (a battery, a thruster and a star), sparks and broken bricks.
import { CubePrimitive, LitMaterial, MeshData, Scene, SceneEntity, SpherePrimitive } from '../../../src';
import { vec2, vec3 } from 'gl-matrix';
import { blockMaterials, canvasTexture, makeEntity, material, render } from './look';
import { Enemy, ItemKind, World } from './world';
import { PLATFORMS } from './platforms';
import { THEMES } from './themes';
import { Boss } from './boss';

type Gl = WebGL2RenderingContext;

export interface ThingsLook {
  /** Matches the visuals to the world (a new try resets everything); `dt` drives the animations. */
  sync(w: World, dt: number, view: { left: number; right: number }): void;
  /** Starts the hop of a bumped block and, for a coin from a bonus block, its pop. */
  bump(x: number, y: number, coin: boolean): void;
  /** Bits of a broken brick flying off. */
  breakAt(x: number, y: number): void;
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

/** A five-pointed star, extruded `depth` m, about 1 m across, facing +z. */
function starMesh(depth = 0.35): MeshData {
  const v: vec3[] = [], n: vec3[] = [], uv: vec2[] = [], idx: number[] = [];
  const pts: number[][] = [];
  for (let i = 0; i < 10; i++) {
    const a = Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? 0.22 : 0.5;
    pts.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  for (const side of [1, -1]) {
    // A fan from the middle, front and back.
    const c = v.length;
    v.push([0, 0, (side * depth) / 2]); n.push([0, 0, side]); uv.push([0.5, 0.5]);
    for (const [x, y] of pts) { v.push([x, y, (side * depth) / 2]); n.push([0, 0, side]); uv.push([x + 0.5, 0.5 - y]); }
    for (let i = 0; i < 10; i++) {
      const a = c + 1 + i, b = c + 1 + ((i + 1) % 10);
      if (side > 0) idx.push(c, a, b); else idx.push(c, b, a);
    }
  }
  for (let i = 0; i < 10; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[(i + 1) % 10];
    const nx = y1 - y0, ny = -(x1 - x0), l = Math.hypot(nx, ny);
    const b = v.length;
    for (const [x, y, z] of [[x0, y0, depth / 2], [x1, y1, depth / 2], [x1, y1, -depth / 2], [x0, y0, -depth / 2]]) {
      v.push([x, y, z]); n.push([nx / l, ny / l, 0]); uv.push([0, 0]);
    }
    idx.push(b, b + 2, b + 1, b, b + 3, b + 2);
  }
  const m = new MeshData(v, n, uv, idx);
  m.providedNormals = true;
  return m;
}

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
      if (t !== 'brick' && t !== 'bonus' && t !== 'power' && t !== 'star') continue;
      const looks: Record<string, SceneEntity> = {};
      for (const kind of t === 'brick' ? ['brick'] as const : ['bonus', 'used'] as const) {
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

  // Big coins: a large gold coin with a star on each face.
  const bigMat = await material(gl, [1, 0.72, 0.12], { glow: await glow('#6a4400'), specular: 1, roughness: 0.15 });
  const bigStarMat = await material(gl, [1, 0.95, 0.6], { glow: await glow('#a08020'), specular: 0.6, roughness: 0.2 });
  const bigStar = starMesh(0.06);
  const bigCoins = w.bigCoins.map((c, i) => {
    const g = group(scene, `Big coin ${i}`);
    const spin = makeEntity(scene, 'Big coin spin', g.root);
    g.add(gl, coinMesh, bigMat, [0, 0, 0], [0.46, 0.46, 0.1], spin);
    for (const z of [0.08, -0.08]) g.add(gl, bigStar, bigStarMat, [0, 0, z], [0.5, 0.5, 1], spin);
    return { g, spin };
  });

  // Platforms: a plank in the world's colour, with darker ends (falling ones have cracks).
  const theme = THEMES[level.theme];
  const moverMat = await material(gl, theme.mover, { specular: 0.6, roughness: 0.3 });
  const fallerMat = await material(gl, theme.faller, { specular: 0.2 });
  const capMat = await material(gl, [0.25, 0.26, 0.32], { specular: 0.5, roughness: 0.3 });
  const crackMat = await material(gl, [0.2, 0.14, 0.12], { specular: 0 });
  const platformLooks = w.platforms.map((p, i) => {
    const g = group(scene, `Platform ${i}`);
    const th = PLATFORMS.thick, fall = p.spec.kind === 'fall';
    g.add(gl, cube, fall ? fallerMat : moverMat, [0, 0, 0], [p.w - 0.04, th, 1.3]);
    for (const sx of [-1, 1]) g.add(gl, cube, capMat, [sx * (p.w / 2 - 0.08), 0, 0], [0.14, th + 0.04, 1.34]);
    if (fall) {
      for (let k = 1; k < p.w; k++) g.add(gl, cube, crackMat, [-p.w / 2 + k + 0.1 * (k % 2 ? 1 : -1), 0, 0.66], [0.05, th * 0.8, 0.02]);
    }
    return g;
  });

  // Gates of a boss arena: glowing bars, shown while their tile is a gate.
  const barMat = await material(gl, [1, 0.3, 0.6], { glow: await glow('#a01450'), specular: 0.6, roughness: 0.3 });
  const frameMat = await material(gl, [0.3, 0.3, 0.38], { specular: 0.6, roughness: 0.3 });
  const gateSpots = [...w.backGates];
  for (let x = 0; x < level.width; x++) for (let y = 0; y < level.height; y++) if (level.tiles[x][y] === 'gate') gateSpots.push({ x, y });
  const gates = gateSpots.map((g, i) => {
    const look = group(scene, `Gate ${i}`);
    look.root.transform.setLocalPosition(g.x + 0.5, g.y, 0);
    for (const bx of [-0.3, 0, 0.3]) look.add(gl, cube, barMat, [bx, 0.5, 0], [0.09, 1, 0.09]);
    look.add(gl, cube, frameMat, [0, 0.03, 0], [1, 0.06, 0.4]);
    look.show(false);
    return { look, ...g };
  });

  // The boss, and its shots.
  const boss = w.boss ? await bossLook(gl, scene, w.boss, cube, ball, glow) : null;

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

  // Power-ups: a few looks of each kind, reused.
  const tealGlow = await glow('#0b5a50');
  const batteryBody = await material(gl, [0.15, 0.85, 0.75], { glow: tealGlow, specular: 0.6, roughness: 0.3 });
  const metal = await material(gl, [0.82, 0.85, 0.9], { specular: 0.8, roughness: 0.25 });
  const boltMat = await material(gl, [1, 0.9, 0.3], { glow: await glow('#806000'), specular: 0.2 });
  const rocketMat = await material(gl, [1, 0.45, 0.15], { specular: 0.7, roughness: 0.25 });
  const flameMat = await material(gl, [1, 0.85, 0.3], { glow: await glow('#ff9a20'), specular: 0 });
  const starMat = await material(gl, [1, 0.88, 0.25], { glow: await glow('#7a5a00'), specular: 0.9, roughness: 0.2 });
  const star = starMesh();
  type ItemLook = { g: Group; spin: SceneEntity; flame?: SceneEntity };
  const itemLook = (kind: ItemKind, i: number): ItemLook => {
    const g = group(scene, `${kind} ${i}`);
    const spin = makeEntity(scene, `${kind} spin`, g.root);
    let flame: SceneEntity | undefined;
    if (kind === 'battery') {
      g.add(gl, cube, batteryBody, [0, 0.33, 0], [0.38, 0.5, 0.38], spin);
      g.add(gl, cube, metal, [0, 0.62, 0], [0.18, 0.08, 0.18], spin);
      g.add(gl, cube, metal, [0, 0.09, 0], [0.4, 0.04, 0.4], spin);
      g.add(gl, cube, boltMat, [0, 0.36, 0.2], [0.08, 0.28, 0.02], spin).transform.setLocalRotation(0, 0, 20);
    } else if (kind === 'thruster') {
      g.add(gl, ball, rocketMat, [0, 0.42, 0], [0.18, 0.3, 0.18], spin);
      g.add(gl, ball, metal, [0, 0.62, 0.0], [0.1, 0.12, 0.1], spin);
      for (const sx of [-1, 1]) g.add(gl, cube, metal, [sx * 0.17, 0.2, 0], [0.12, 0.2, 0.04], spin);
      flame = g.add(gl, ball, flameMat, [0, 0.08, 0], [0.1, 0.16, 0.1], spin);
    } else {
      g.add(gl, star, starMat, [0, 0.38, 0], [0.75, 0.75, 0.75], spin);
      for (const sx of [-1, 1]) g.add(gl, ball, black, [sx * 0.07, 0.42, 0.13], [0.03, 0.06, 0.02], spin);
    }
    g.show(false);
    return { g, spin, flame };
  };
  const itemPool: Record<ItemKind, ItemLook[]> = {
    battery: [0, 1, 2].map((i) => itemLook('battery', i)),
    thruster: [0, 1, 2].map((i) => itemLook('thruster', i)),
    star: [0, 1].map((i) => itemLook('star', i)),
  };
  const sparkMat = await material(gl, [1, 0.75, 0.25], { glow: await glow('#ffb040'), specular: 0 });
  const sparkLooks = Array.from({ length: 2 }, (_, i) => {
    const g = group(scene, `Spark ${i}`);
    g.add(gl, ball, sparkMat, [0, 0, 0], [0.16, 0.16, 0.16]);
    g.add(gl, ball, flameMat, [0, 0, 0], [0.26, 0.08, 0.08]);
    g.show(false);
    return g;
  });
  /** Bits of broken bricks: four each, flying up and out, then falling. */
  const debrisLooks = Array.from({ length: 12 }, (_, i) => {
    const e = makeEntity(scene, `Brick bit ${i}`);
    render(gl, e, cube, blocks.brick);
    e.transform.setLocalScale(0.4, 0.4, 0.4);
    e.show = false;
    return e;
  });
  const debris: { e: SceneEntity; x: number; y: number; vx: number; vy: number; t: number }[] = [];

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
          e.show = vis && kind === (tile === 'power' || tile === 'star' ? 'bonus' : tile);
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
      world.bigCoins.forEach((c, i) => {
        const { g, spin } = bigCoins[i];
        const on = !c.taken && near(c.x, view);
        g.show(on);
        if (!on) return;
        g.root.transform.setLocalPosition(c.x, c.y + Math.sin(time * 2.5 + c.x) * 0.08, 0);
        spin.transform.setLocalRotation(0, time * 120, 0);
      });
      for (const g of gates) g.look.show(world.level.tiles[g.x][g.y] === 'gate' && near(g.x, view));
      if (boss && world.boss) boss.place(world.boss, time);
      world.platforms.forEach((p, i) => {
        const g = platformLooks[i];
        const on = p.state !== 'gone' && p.x + p.w > view.left - 2 && p.x < view.right + 2;
        g.show(on);
        if (!on) return;
        const shake = p.state === 'shake' ? Math.sin(p.time * 70) * 0.06 : 0;
        g.root.transform.setLocalPosition(p.x + p.w / 2 + shake, p.y + 1 - PLATFORMS.thick / 2, 0);
      });
      const used: Record<ItemKind, number> = { battery: 0, thruster: 0, star: 0 };
      for (const it of world.items) {
        if (it.state === 'gone') continue;
        const look = itemPool[it.kind][used[it.kind]++];
        if (!look) continue;
        look.g.show(true);
        look.g.root.transform.setLocalPosition(it.body.x, it.body.y, it.state === 'rise' ? -0.05 : 0);
        look.spin.transform.setLocalRotation(0, it.kind === 'star' ? Math.sin(time * 4) * 25 : time * 120, 0);
        if (look.flame) look.flame.transform.setLocalScale(0.1, 0.16 * (1 + 0.3 * Math.sin(time * 40)), 0.1);
      }
      for (const kind of Object.keys(itemPool) as ItemKind[]) {
        for (let i = used[kind]; i < itemPool[kind].length; i++) itemPool[kind][i].g.show(false);
      }
      sparkLooks.forEach((g, i) => {
        const sp = world.sparks[i];
        g.show(!!sp);
        if (!sp) return;
        g.root.transform.setLocalPosition(sp.body.x, sp.body.y + sp.body.h / 2, 0.2);
        g.root.transform.setLocalRotation(0, 0, time * 720 * -sp.dir);
      });
      for (let i = debris.length - 1; i >= 0; i--) {
        const d = debris[i];
        d.t += dt; d.vy -= 40 * dt; d.x += d.vx * dt; d.y += d.vy * dt;
        if (d.y < -3 || d.t > 1.5) { d.e.show = false; debris.splice(i, 1); continue; }
        d.e.transform.setLocalPosition(d.x, d.y, 0.3);
        d.e.transform.setLocalRotation(d.t * 500, d.t * 300 * Math.sign(d.vx), 0);
      }
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
    breakAt(x, y) {
      for (const [vx, vy] of [[-3, 12], [3, 12], [-2.5, 8], [2.5, 8]]) {
        const e = debrisLooks.find((p) => !debris.some((d) => d.e === p)) ?? debrisLooks[0];
        e.show = true;
        debris.push({ e, x: x + 0.5 + Math.sign(vx) * 0.2, y: y + 0.5 + (vy > 10 ? 0.2 : -0.2), vx, vy, t: 0 });
      }
    },
    hide() {
      for (const l of Object.values(itemPool).flat()) l.g.show(false);
      for (const g of sparkLooks) g.show(false);
      for (const d of debris) d.e.show = false;
      debris.length = 0;
      for (const t of tiles.values()) for (const e of Object.values(t.looks)) e.show = false;
      for (const e of [...coins, ...popPool]) e.show = false;
      for (const l of enemyLooks) l.g.show(false);
      for (const c of checkpoints) c.g.show(false);
      for (const b of bigCoins) b.g.show(false);
      for (const g of platformLooks) g.show(false);
      for (const g of gates) g.look.show(false);
      boss?.hide();
    },
  };
}

/** The boss: Rei Bolota (a crowned slime), Geodo (a rock golem with crystals on its back) or Turbina (a flying drone). */
async function bossLook(
  gl: Gl, scene: Scene, b: Boss, cube: MeshData, ball: MeshData, glow: (css: string) => Promise<import('../../../src').Texture>,
) {
  const g = group(scene, `Boss ${b.kind}`);
  const body = makeEntity(scene, 'Boss body', g.root);
  const white = await material(gl, [1, 1, 1], { specular: 0.2 });
  const black = await material(gl, [0.05, 0.05, 0.08], { specular: 0.6, roughness: 0.2 });
  const spin: SceneEntity[] = [];
  const add = (mesh: MeshData, m: LitMaterial, at: number[], scale: number[], rot?: number[]) => {
    const e = g.add(gl, mesh, m, at, scale, body);
    if (rot) e.transform.setLocalRotation(rot[0], rot[1], rot[2]);
    return e;
  };
  if (b.kind === 'king') {
    const slime = await material(gl, [0.6, 0.28, 0.92], { specular: 0.6, roughness: 0.3 });
    const gold = await material(gl, [1, 0.78, 0.2], { glow: await glow('#5a3a00'), specular: 0.9, roughness: 0.2 });
    add(ball, slime, [0, 0.95, 0], [1.15, 0.95, 1]);
    add(cube, gold, [0, 1.85, 0], [0.9, 0.22, 0.75]);
    for (const cx of [-0.32, 0, 0.32]) add(cube, gold, [cx, 2.02, 0], [0.18, 0.18, 0.18], [0, 0, 45]);
    for (const sx of [-1, 1]) {
      add(ball, white, [sx * 0.32, 1.2, 0.85], [0.22, 0.26, 0.12]);
      add(ball, black, [sx * 0.3, 1.17, 0.95], [0.1, 0.13, 0.06]);
      add(cube, black, [sx * 0.33, 1.52, 0.88], [0.4, 0.07, 0.05], [0, 0, sx * -20]);
      add(ball, black, [sx * 0.55, 0.08, 0.2], [0.3, 0.12, 0.35]);
    }
  } else if (b.kind === 'golem') {
    const rock = await material(gl, [0.42, 0.38, 0.5], { specular: 0.15 });
    const dark = await material(gl, [0.28, 0.25, 0.35], { specular: 0.15 });
    const crystal = await material(gl, [0.25, 0.95, 0.9], { glow: await glow('#0d6a64'), specular: 0.9, roughness: 0.15 });
    const eye = await material(gl, [1, 0.6, 0.2], { glow: await glow('#ff8a20'), specular: 0 });
    add(cube, rock, [0, 1.0, 0], [1.7, 1.3, 1.2]);
    add(cube, rock, [0, 1.95, 0.05], [1.0, 0.7, 0.9]);
    for (const sx of [-1, 1]) {
      add(cube, dark, [sx * 1.0, 1.0, 0], [0.4, 1.1, 0.5]);
      add(cube, dark, [sx * 0.45, 0.18, 0], [0.5, 0.36, 0.6]);
      add(cube, eye, [sx * 0.22, 2.0, 0.5], [0.18, 0.1, 0.05]);
    }
    for (const [cx, cy, r] of [[-0.5, 1.75, 25], [0, 2.0, 0], [0.5, 1.75, -25], [-0.3, 1.4, 35], [0.35, 1.45, -30]]) {
      add(cube, crystal, [cx, cy + 0.3, -0.5], [0.22, 0.8, 0.22], [0, 45, r]);
    }
  } else {
    const metal = await material(gl, [0.75, 0.78, 0.85], { specular: 0.9, roughness: 0.2 });
    const orange = await material(gl, [1, 0.5, 0.15], { specular: 0.6, roughness: 0.3 });
    const eye = await material(gl, [1, 0.2, 0.25], { glow: await glow('#ff2030'), specular: 0 });
    add(ball, metal, [0, 0.4, 0], [1.15, 0.35, 0.9]);
    add(ball, orange, [0, 0.62, 0], [0.55, 0.38, 0.5]);
    add(ball, black, [0, 0.42, 0.75], [0.32, 0.2, 0.15]);
    add(ball, eye, [0, 0.42, 0.85], [0.15, 0.12, 0.08]);
    for (const sx of [-1, 1]) {
      add(cube, metal, [sx * 0.75, 0.9, 0], [0.08, 0.5, 0.08]);
      const pivot = makeEntity(scene, 'Rotor', body);
      pivot.transform.setLocalPosition(sx * 0.75, 1.17, 0);
      g.add(gl, cube, black, [0, 0, 0], [1.1, 0.04, 0.16], pivot);
      spin.push(pivot);
      add(ball, metal, [sx * 1.05, 0.25, 0], [0.18, 0.18, 0.18]);
    }
  }
  // Shots: shards (golem) or bolts (drone), a few of each, reused.
  const shardMat = await material(gl, [0.3, 1, 0.95], { glow: await glow('#20b0a8'), specular: 0.9, roughness: 0.1 });
  const boltMat = await material(gl, [1, 0.85, 0.2], { glow: await glow('#ffb020'), specular: 0.2 });
  const shots = Array.from({ length: 6 }, (_, i) => {
    const e = makeEntity(scene, `Boss shot ${i}`);
    if (b.kind === 'drone') { render(gl, e, ball, boltMat); e.transform.setLocalScale(0.24, 0.24, 0.24); }
    else { render(gl, e, cube, shardMat); e.transform.setLocalScale(0.6, 0.2, 0.2); }
    e.show = false;
    return e;
  });
  return {
    place(boss: Boss, time: number) {
      const on = boss.state !== 'gone' && !(boss.hurt > 0 && Math.floor(boss.hurt / 0.08) % 2 === 0);
      g.show(on);
      const bd = boss.body;
      g.root.transform.setLocalPosition(bd.x, bd.y + (boss.state === 'down' ? bd.h : 0), 0);
      let sy = 1;
      if (boss.state === 'crouch' || boss.state === 'aim') sy = 0.82;
      else if (boss.state === 'leap') sy = 1.12;
      else if (boss.kind === 'king' && boss.state === 'walk') sy = 1 + Math.sin(time * 9) * 0.05;
      body.transform.setLocalScale(1 / Math.sqrt(sy), sy, 1);
      const yaw = boss.kind === 'drone' ? 0 : boss.dir < 0 ? -40 : 40;
      g.root.transform.setLocalRotation(0, yaw, boss.state === 'down' ? 180 : boss.kind === 'drone' ? -boss.body.vx * 3 : 0);
      for (const p of spin) p.transform.setLocalRotation(0, time * 1500, 0);
      shots.forEach((e, i) => {
        const s = boss.shots[i];
        e.show = !!s;
        if (!s) return;
        e.transform.setLocalPosition(s.body.x, s.body.y + s.body.h / 2, 0);
        e.transform.setLocalRotation(boss.kind === 'drone' ? 0 : time * 600, 0, 0);
      });
    },
    hide() { g.show(false); for (const e of shots) e.show = false; },
  };
}
