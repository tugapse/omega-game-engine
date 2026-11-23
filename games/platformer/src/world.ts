// A level being played: the hero, the coins, the blocks that change, the
// enemies, spikes, the checkpoint, the clock, lives and score. One fixed step
// at a time, reporting what happened as events (for sounds and effects).
// No engine, so it is tested in Node.
import { fellOut, Hero, HeroInput, makeHero, stepHero } from './hero';
import { Level, LevelSpec, parseLevel, Tile, tileAt } from './level';
import { Body, moveBody, STEP } from './physics';

export const RULES = {
  lives: 3,
  /** Seconds to finish a level. */
  time: 300,
  /** Coins for an extra life. */
  coinsForLife: 100,
  points: { coin: 200, stomp: 100, kick: 400, timeLeft: 10 },
  /** Bounce off an enemy (m/s), higher with the jump button held. */
  bounce: 10,
  bounceHeld: 15,
  /** How far (m) past the camera's right edge enemies wake up. */
  wakeAhead: 2,
};

export const ENEMY = {
  walker: { w: 0.8, h: 0.75, speed: 2 },
  shell: { w: 0.8, h: 0.9, speed: 1.6, shellH: 0.6, slide: 11 },
  flyer: { w: 0.8, h: 0.7, bob: 1.5, period: 2.6 },
  gravity: 60,
  maxFall: 20,
  /** A kicked shell cannot hurt the hero for this long (s). */
  kickGrace: 0.25,
};

export type EnemyKind = 'walker' | 'shell' | 'flyer';
/** asleep: not yet in view; walk; shell: hidden in its shell, still; slide: a kicked shell; squashed: stomped flat; out: knocked off, falling. */
export type EnemyState = 'asleep' | 'walk' | 'shell' | 'slide' | 'squashed' | 'out' | 'gone';

export interface Enemy {
  id: number;
  kind: EnemyKind;
  body: Body;
  dir: number;
  state: EnemyState;
  /** Time in this state (s). */
  time: number;
  /** Where it started (the flyer bobs around it). */
  home: { x: number; y: number };
  grace: number;
}

export interface Coin { x: number; y: number; taken: boolean }

export type WorldEvent =
  | { type: 'coin'; x: number; y: number; fromBlock: boolean }
  | { type: 'bump'; x: number; y: number; tile: Tile }
  | { type: 'stomp' | 'kick' | 'knock'; x: number; y: number; points: number; enemy: number }
  | { type: 'jump' | 'land' | 'checkpoint' | 'oneUp' | 'die' | 'clear' | 'wall'; x: number; y: number };

export interface World {
  spec: LevelSpec;
  level: Level;
  hero: Hero;
  enemies: Enemy[];
  coins: Coin[];
  checkpoints: { x: number; y: number }[];
  /** The checkpoint reached (respawns start here). */
  checkpoint: { x: number; y: number } | null;
  lives: number;
  coinCount: number;
  score: number;
  /** Seconds left. */
  time: number;
  /** Stomps in a row without landing (each scores double). */
  chain: number;
  dead: boolean;
  cleared: boolean;
  /** What happened on the last step. */
  events: WorldEvent[];
}

/** What carries over from one try to the next. */
export interface Carry { lives: number; coinCount: number; score: number; checkpoint: { x: number; y: number } | null }

/** A fresh try at a level: everything back in place, with lives and score carried over. */
export function makeWorld(spec: LevelSpec, carry?: Carry): World {
  const level = parseLevel(spec);
  const start = carry?.checkpoint ?? level.start;
  const enemies: Enemy[] = [];
  const coins: Coin[] = [];
  const checkpoints: { x: number; y: number }[] = [];
  for (const t of level.things) {
    if (t.kind === 'coin') coins.push({ x: t.x, y: t.y + 0.5, taken: false });
    else if (t.kind === 'checkpoint') checkpoints.push({ x: t.x, y: t.y });
    else {
      const size = ENEMY[t.kind];
      enemies.push({
        id: enemies.length, kind: t.kind, dir: -1, state: 'asleep', time: 0, home: { x: t.x, y: t.y }, grace: 0,
        body: { x: t.x, y: t.y, w: size.w, h: size.h, vx: 0, vy: 0, onGround: false },
      });
    }
  }
  return {
    spec, level, hero: makeHero(start.x, start.y), enemies, coins, checkpoints,
    checkpoint: carry?.checkpoint ?? null,
    lives: carry?.lives ?? RULES.lives, coinCount: carry?.coinCount ?? 0, score: carry?.score ?? 0,
    time: RULES.time, chain: 0, dead: false, cleared: false, events: [],
  };
}

/** After dying: the next try (from the checkpoint), or null when there are no lives left. */
export function nextTry(w: World): World | null {
  if (w.lives <= 0) return null;
  return makeWorld(w.spec, { lives: w.lives, coinCount: w.coinCount, score: w.score, checkpoint: w.checkpoint });
}

const overlap = (a: Body, b: Body) =>
  Math.abs(a.x - b.x) < (a.w + b.w) / 2 && a.y < b.y + b.h && b.y < a.y + a.h;

function addCoins(w: World, n: number): void {
  for (let i = 0; i < n; i++) {
    w.coinCount++;
    w.score += RULES.points.coin;
    if (w.coinCount % RULES.coinsForLife === 0) { w.lives++; w.events.push({ type: 'oneUp', x: w.hero.body.x, y: w.hero.body.y }); }
  }
}

function die(w: World): void {
  if (w.dead) return;
  w.dead = true;
  w.lives--;
  w.events.push({ type: 'die', x: w.hero.body.x, y: w.hero.body.y });
}

/** Points for the next stomp in a row: 100, 200, 400, 800, then 1000. */
function chainPoints(w: World): number {
  const p = Math.min(1000, RULES.points.stomp * 2 ** w.chain);
  w.chain++;
  return p;
}

/** Knocks an enemy off (from below, or by a shell): it flips and falls out. */
function knock(w: World, e: Enemy, points: number): void {
  e.state = 'out';
  e.time = 0;
  e.body.vy = 9;
  e.body.vx = e.dir * 1.5;
  w.score += points;
  w.events.push({ type: 'knock', x: e.body.x, y: e.body.y, points, enemy: e.id });
}

function setShellSize(e: Enemy, shell: boolean): void {
  e.body.h = shell ? ENEMY.shell.shellH : ENEMY.shell.h;
}

function stepEnemy(w: World, e: Enemy, dt: number): void {
  e.time += dt;
  e.grace = Math.max(0, e.grace - dt);
  const b = e.body;
  if (e.state === 'squashed') { if (e.time > 0.5) e.state = 'gone'; return; }
  if (e.state === 'out') {
    b.vy -= ENEMY.gravity * dt;
    b.x += b.vx * dt; b.y += b.vy * dt;
    if (b.y < -6) e.state = 'gone';
    return;
  }
  if (e.kind === 'flyer') {
    b.y = e.home.y + 1 + Math.sin((e.time / ENEMY.flyer.period) * Math.PI * 2) * ENEMY.flyer.bob;
    e.dir = w.hero.body.x < b.x ? -1 : 1;
    return;
  }
  const speed = e.state === 'slide' ? ENEMY.shell.slide : e.state === 'shell' ? 0 : ENEMY[e.kind].speed;
  b.vx = e.dir * speed;
  b.vy = Math.max(-ENEMY.maxFall, b.vy - ENEMY.gravity * dt);
  const c = moveBody(w.level, b, dt);
  if (c.wallLeft || c.wallRight) {
    e.dir = -e.dir;
    if (e.state === 'slide') w.events.push({ type: 'wall', x: b.x, y: b.y });
  }
  if (b.y < -3) e.state = 'gone';
}

/** Whether a body stands on top of the tile at (tx, ty). */
const standsOn = (b: Body, tx: number, ty: number) =>
  Math.abs(b.y - (ty + 1)) < 0.05 && b.x + b.w / 2 > tx && b.x - b.w / 2 < tx + 1;

/**
 * One fixed step. `viewRight` is the camera's right edge (m): enemies wake up
 * just past it, so they are where the level put them when they come into view.
 */
export function stepWorld(w: World, input: HeroInput, viewRight: number, dt = STEP): void {
  w.events = [];
  if (w.dead || w.cleared) return;
  const hero = w.hero, hb = hero.body;
  const feetBefore = hb.y;

  w.time -= dt;
  if (w.time <= 0) { w.time = 0; die(w); return; }

  stepHero(hero, input, w.level, dt);
  if (hero.jumped) w.events.push({ type: 'jump', x: hb.x, y: hb.y });
  if (hero.contacts.landed) w.events.push({ type: 'land', x: hb.x, y: hb.y });
  if (hb.onGround) w.chain = 0;

  // A block hit from below: a bonus block gives a coin and is used up; anything on top is knocked off.
  const bump = hero.contacts.bumped;
  if (bump) {
    const tile = tileAt(w.level, bump.x, bump.y);
    w.events.push({ type: 'bump', x: bump.x, y: bump.y, tile });
    if (tile === 'bonus') {
      w.level.tiles[bump.x][bump.y] = 'used';
      addCoins(w, 1);
      w.events.push({ type: 'coin', x: bump.x + 0.5, y: bump.y + 1, fromBlock: true });
    }
    if (tile === 'bonus' || tile === 'brick' || tile === 'used') {
      for (const e of w.enemies) {
        if ((e.state === 'walk' || e.state === 'shell') && standsOn(e.body, bump.x, bump.y)) knock(w, e, RULES.points.stomp);
      }
      for (const c of w.coins) {
        if (!c.taken && Math.floor(c.x) === bump.x && Math.floor(c.y) === bump.y + 1) {
          c.taken = true; addCoins(w, 1);
          w.events.push({ type: 'coin', x: c.x, y: c.y, fromBlock: true });
        }
      }
    }
  }

  // Coins touched.
  for (const c of w.coins) {
    if (c.taken) continue;
    if (Math.abs(c.x - hb.x) < hb.w / 2 + 0.3 && c.y > hb.y - 0.3 && c.y < hb.y + hb.h + 0.3) {
      c.taken = true; addCoins(w, 1);
      w.events.push({ type: 'coin', x: c.x, y: c.y, fromBlock: false });
    }
  }

  // Spikes: the lower part of their tile hurts.
  for (let tx = Math.floor(hb.x - hb.w / 2); tx <= Math.floor(hb.x + hb.w / 2 - 1e-6); tx++) {
    for (let ty = Math.floor(hb.y); ty <= Math.floor(hb.y + hb.h - 1e-6); ty++) {
      if (tileAt(w.level, tx, ty) === 'spikes' && hb.y < ty + 0.55) { die(w); return; }
    }
  }

  // Enemies: wake up, move, meet the hero and each other.
  for (const e of w.enemies) {
    if (e.state === 'asleep') {
      if (e.body.x - e.body.w / 2 < viewRight + RULES.wakeAhead) { e.state = 'walk'; e.time = 0; }
      else continue;
    }
    if (e.state === 'gone') continue;
    stepEnemy(w, e, dt);
  }
  for (const e of w.enemies) {
    if (e.state !== 'slide') continue;
    for (const o of w.enemies) {
      if (o === e || (o.state !== 'walk' && o.state !== 'shell' && o.state !== 'slide')) continue;
      if (overlap(e.body, o.body)) { o.dir = e.dir; knock(w, o, chainPoints(w)); }
    }
  }
  for (const e of w.enemies) {
    if (e.state !== 'walk' && e.state !== 'shell' && e.state !== 'slide') continue;
    if (!overlap(hb, e.body)) continue;
    // From above, coming down: a stomp.
    const fromAbove = hb.vy <= 0 && feetBefore >= e.body.y + e.body.h * 0.45;
    if (fromAbove) {
      const points = e.state === 'shell' ? RULES.points.kick : chainPoints(w);
      if (e.kind === 'walker') { e.state = 'squashed'; e.time = 0; }
      else if (e.kind === 'flyer') knock(w, e, 0);
      else if (e.state === 'walk' || e.state === 'slide') { e.state = 'shell'; e.time = 0; setShellSize(e, true); }
      else { e.state = 'slide'; e.dir = hb.x < e.body.x ? 1 : -1; e.grace = ENEMY.kickGrace; }
      hb.y = Math.max(hb.y, e.body.y + e.body.h);
      hb.vy = input.jump ? RULES.bounceHeld : RULES.bounce;
      hero.jumping = input.jump;
      w.score += points;
      w.events.push({ type: e.state === 'slide' ? 'kick' : 'stomp', x: e.body.x, y: e.body.y + e.body.h, points, enemy: e.id });
      continue;
    }
    // A still shell from the side: kick it.
    if (e.state === 'shell') {
      e.state = 'slide';
      e.dir = hb.x < e.body.x ? 1 : -1;
      e.grace = ENEMY.kickGrace;
      w.score += RULES.points.kick;
      w.events.push({ type: 'kick', x: e.body.x, y: e.body.y, points: RULES.points.kick, enemy: e.id });
      continue;
    }
    if (e.grace > 0) continue;
    die(w);
    return;
  }

  // Checkpoints and the goal.
  for (const cp of w.checkpoints) {
    if (hb.x >= cp.x && (!w.checkpoint || w.checkpoint.x < cp.x)) {
      w.checkpoint = cp;
      w.events.push({ type: 'checkpoint', x: cp.x, y: cp.y });
    }
  }
  if (fellOut(hero)) { die(w); return; }
  if (hb.x + hb.w / 2 >= w.level.goal.x - 0.5) {
    w.cleared = true;
    w.score += Math.ceil(w.time) * RULES.points.timeLeft;
    w.events.push({ type: 'clear', x: hb.x, y: hb.y });
  }
}
