// The bosses at the end of each world, in an arena closed by gates: three
// stomps beat one, then the gates open to the flag. Each has its own pattern:
//   Rei Bolota (meadow): a crowned slime that walks at Bit, crouches and leaps.
//   Geodo (caves): a crystal golem that stops and fires shards, low (jump
//     them) and high (stay down).
//   Turbina (clouds): a drone that flies out of reach dropping bolts, then
//     swoops down and rests on the floor, where it can be stomped.
// They get faster with each stomp. No engine, so it is tested in Node, and
// the bot plays fights ahead with it.
import { Level, Theme } from './level';
import { Body, moveBody, STEP } from './physics';

export type BossKind = 'king' | 'golem' | 'drone';

export const BOSS_OF: Record<Theme, BossKind> = { meadow: 'king', caves: 'golem', clouds: 'drone' };
export const BOSS_NAME: Record<BossKind, string> = { king: 'Rei Bolota', golem: 'Geodo', drone: 'Turbina' };

export const BOSS = {
  hp: 3,
  /** After a stomp it flashes this long (s): no harm either way. */
  hurtTime: 1.3,
  /** The fight starts once Bit is this far (m) past the arena's back gate. */
  wakeAfter: 1.5,
  gravity: 40,
  points: { hit: 1000, down: 5000 },
  /** How high (m/s) a stomp bounces Bit (and with the button held). */
  bounce: 13,
  bounceHeld: 17,
  king: { w: 2.2, h: 1.9, walk: 2.4, faster: 0.8, walkTime: 2.2, crouch: 0.5, leapVy: 15, leapVx: 6 },
  golem: { w: 2, h: 2.3, walk: 1.6, walkTime: 2, aim: 0.6, shotSpeed: 7.5, shotGap: 0.5, low: 0.15, high: 1.2 },
  drone: { w: 2.2, h: 1.1, fly: 3, hover: 5.6, dropEvery: 2.4, swoopEvery: 5.5, dive: 8, rest: 1.5, rise: 4 },
  shot: { w: 0.55, h: 0.35, life: 6 },
  bolt: { w: 0.4, h: 0.4, gravity: 24 },
};

export interface Shot { body: Body; gravity: number; time: number; gone: boolean }

export type BossState = 'idle' | 'walk' | 'crouch' | 'leap' | 'aim' | 'shoot' | 'fly' | 'swoop' | 'rest' | 'rise' | 'down' | 'gone';

export interface Boss {
  kind: BossKind;
  body: Body;
  hp: number;
  state: BossState;
  /** Time in this state, and since the fight began (s). */
  time: number;
  clock: number;
  dir: number;
  /** Seconds left flashing after a stomp. */
  hurt: number;
  /** The floor's height (its feet at the start), and shots fired in this volley. */
  floor: number;
  fired: number;
  /** When the drone last dropped a bolt and last swooped (clock, s). */
  lastDrop: number;
  lastSwoop: number;
  shots: Shot[];
}

export function makeBoss(kind: BossKind, x: number, y: number): Boss {
  const size = BOSS[kind];
  const floor = y;
  const by = kind === 'drone' ? floor + BOSS.drone.hover : floor;
  return {
    kind, hp: BOSS.hp, state: 'idle', time: 0, clock: 0, dir: -1, hurt: 0, floor, fired: 0, lastDrop: 0, lastSwoop: 0, shots: [],
    body: { x, y: by, w: size.w, h: size.h, vx: 0, vy: 0, onGround: kind !== 'drone' },
  };
}

export const cloneBoss = (b: Boss): Boss => ({ ...b, body: { ...b.body }, shots: b.shots.map((s) => ({ ...s, body: { ...s.body } })) });

/** How many stomps it has taken make it this much quicker (1 at full health). */
const pace = (b: Boss) => 1 + 0.25 * (BOSS.hp - b.hp);

function setState(b: Boss, s: BossState): void {
  b.state = s;
  b.time = 0;
}

function fire(b: Boss, x: number, y: number, vx: number, vy: number, gravity: number, size: { w: number; h: number }): void {
  b.shots.push({ body: { x, y, w: size.w, h: size.h, vx, vy, onGround: false }, gravity, time: 0, gone: false });
}

const overlapsSolid = (level: Level, s: Body) => {
  for (let tx = Math.floor(s.x - s.w / 2); tx <= Math.floor(s.x + s.w / 2 - 1e-6); tx++) {
    for (let ty = Math.floor(s.y); ty <= Math.floor(s.y + s.h - 1e-6); ty++) {
      const t = level.tiles[tx]?.[ty];
      if (t && t !== 'empty' && t !== 'spikes') return true;
    }
  }
  return false;
};

/** One fixed step of the boss and its shots; `hero` is where Bit is (it is not moved). */
export function stepBoss(b: Boss, hero: Body, level: Level, dt = STEP): string[] {
  const events: string[] = [];
  b.time += dt;
  b.hurt = Math.max(0, b.hurt - dt);
  const body = b.body;
  const toHero = hero.x < body.x ? -1 : 1;

  for (const s of b.shots) {
    if (s.gone) continue;
    s.time += dt;
    s.body.vy -= s.gravity * dt;
    s.body.x += s.body.vx * dt;
    s.body.y += s.body.vy * dt;
    if (s.time > BOSS.shot.life || s.body.y < -2 || overlapsSolid(level, s.body)) s.gone = true;
  }
  b.shots = b.shots.filter((s) => !s.gone);

  if (b.state === 'gone') return events;
  if (b.state === 'down') {
    // Knocked out: flips and falls through the floor.
    body.vy -= BOSS.gravity * dt;
    body.y += body.vy * dt;
    if (b.time > 2.5) setState(b, 'gone');
    return events;
  }
  if (b.state === 'idle') return events;
  b.clock += dt;
  const k = pace(b);

  if (b.kind === 'king') {
    const c = BOSS.king;
    if (b.state === 'walk') {
      if (b.time < dt * 1.5) b.dir = toHero;
      body.vx = b.dir * (c.walk + c.faster * (BOSS.hp - b.hp));
      if (b.time > c.walkTime / k) { setState(b, 'crouch'); body.vx = 0; }
    } else if (b.state === 'crouch') {
      body.vx = 0;
      if (b.time > c.crouch / k) {
        setState(b, 'leap');
        body.vy = c.leapVy;
        body.vx = Math.max(-c.leapVx, Math.min(c.leapVx, (hero.x - body.x) / 1.1));
        body.onGround = false;
      }
    }
    body.vy = Math.max(-25, body.vy - BOSS.gravity * dt);
    const hit = moveBody(level, body, dt);
    if (hit.wallLeft || hit.wallRight) b.dir = -b.dir;
    if (b.state === 'leap' && hit.landed) { setState(b, 'walk'); events.push('thud'); }
  } else if (b.kind === 'golem') {
    const c = BOSS.golem;
    if (b.state === 'walk') {
      if (b.time < dt * 1.5) b.dir = toHero;
      body.vx = b.dir * c.walk * k;
      if (b.time > c.walkTime) { setState(b, 'aim'); body.vx = 0; b.dir = toHero; }
    } else if (b.state === 'aim') {
      body.vx = 0;
      b.dir = toHero;
      if (b.time > c.aim / k) { setState(b, 'shoot'); b.fired = 0; }
    } else if (b.state === 'shoot') {
      body.vx = 0;
      // One shard more for each stomp taken: low, high, low.
      const volley = 1 + BOSS.hp - b.hp;
      if (b.time >= b.fired * c.shotGap && b.fired < volley) {
        const high = b.fired % 2 === 1;
        fire(b, body.x + b.dir * (body.w / 2 + 0.3), b.floor + (high ? c.high : c.low), b.dir * c.shotSpeed, 0, 0, BOSS.shot);
        b.fired++;
        events.push('shoot');
      }
      if (b.fired >= volley && b.time > b.fired * c.shotGap + 0.3) setState(b, 'walk');
    }
    body.vy = Math.max(-25, body.vy - BOSS.gravity * dt);
    const hit = moveBody(level, body, dt);
    if (hit.wallLeft || hit.wallRight) b.dir = -b.dir;
  } else {
    const c = BOSS.drone;
    const hoverY = b.floor + c.hover;
    if (b.state === 'fly') {
      body.vx = b.dir * c.fly * k;
      body.vy = 0;
      body.y = hoverY + Math.sin(b.clock * 3) * 0.25;
      if (b.clock - b.lastDrop > c.dropEvery / k) {
        b.lastDrop = b.clock;
        fire(b, body.x, body.y - 0.1, 0, 0, BOSS.bolt.gravity, BOSS.bolt);
        events.push('drop');
      }
      if (b.clock - b.lastSwoop > c.swoopEvery) { b.lastSwoop = b.clock; setState(b, 'swoop'); b.dir = toHero; }
    } else if (b.state === 'swoop') {
      // Down at Bit, at an angle.
      body.vy = -c.dive;
      body.vx = Math.max(-c.dive, Math.min(c.dive, (hero.x - body.x) * 2.5));
      if (body.y <= b.floor + 0.05) { body.y = b.floor; body.vy = 0; body.vx = 0; setState(b, 'rest'); events.push('thud'); }
    } else if (b.state === 'rest') {
      body.vx = 0; body.vy = 0;
      if (b.time > c.rest / k) setState(b, 'rise');
    } else if (b.state === 'rise') {
      body.vx = 0;
      body.vy = c.rise;
      if (body.y >= hoverY) { body.y = hoverY; setState(b, 'fly'); b.lastDrop = b.clock; }
    }
    // Flying: across, turning at the arena's walls; up and down freely.
    const nx = body.x + body.vx * dt;
    const turned = overlapsSolid(level, { ...body, x: nx });
    if (turned) { b.dir = -b.dir; body.vx = 0; } else body.x = nx;
    if (b.state !== 'fly') body.y = Math.max(b.floor, body.y + body.vy * dt);
  }
  return events;
}

/** Wakes the boss: the fight begins. */
export function wakeBoss(b: Boss): void {
  if (b.state !== 'idle') return;
  setState(b, b.kind === 'king' || b.kind === 'golem' ? 'walk' : 'fly');
  b.clock = 0;
}

const overlap = (a: Body, c: Body) => Math.abs(a.x - c.x) < (a.w + c.w) / 2 && a.y < c.y + c.h && c.y < a.y + a.h;

export type Contact = 'stomp' | 'bounce' | 'hurt' | 'down' | null;

/**
 * Bit against the boss and its shots this step (`feetBefore`: Bit's feet
 * before the step). A stomp from above costs the boss a hit ('down' for the
 * last one); landing on it while it flashes just bounces; touching it from
 * the side or a shot hurts Bit. `star`: Bit has the star (touching it is a hit).
 */
export function bossContact(b: Boss, hero: Body, feetBefore: number, star = false): Contact {
  if (b.state === 'down' || b.state === 'gone') return null;
  for (const s of b.shots) {
    if (!s.gone && overlap(hero, s.body)) { s.gone = true; return star ? null : 'hurt'; }
  }
  if (!overlap(hero, b.body)) return null;
  const top = b.body.y + b.body.h;
  const fromAbove = hero.vy <= 0 && feetBefore >= top - Math.min(0.6, b.body.h * 0.4);
  if ((fromAbove || star) && b.hurt <= 0) {
    b.hp--;
    b.hurt = BOSS.hurtTime;
    if (b.hp <= 0) { setState(b, 'down'); b.body.vy = 8; b.shots = []; return 'down'; }
    // The drone flies back up when stomped.
    if (b.kind === 'drone' && (b.state === 'rest' || b.state === 'swoop')) setState(b, 'rise');
    return 'stomp';
  }
  if (fromAbove) return 'bounce';
  if (b.hurt > 0) return null;
  return star ? null : 'hurt';
}
