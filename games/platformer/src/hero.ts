// The hero's movement: speeding up and slowing down, a jump whose height
// follows how long the button is held, and a little forgiveness (coyote time:
// a jump just after leaving a ledge still counts; jump buffer: a press just
// before landing still counts). No engine, so it is tested in Node.
import { Level } from './level';
import { Body, Contacts, moveBody, STEP } from './physics';

export const HERO = {
  width: 0.7,
  height: 0.9,
  /** Top speed walking and running (m/s). */
  walk: 6,
  run: 9.5,
  /** Speeding up on the ground and in the air, and slowing down (m/s²). */
  accel: 32,
  airAccel: 22,
  decel: 38,
  /** Turning round on the ground: braking is quicker than speeding up. */
  turn: 60,
  /** Jump speed (m/s), plus this share of the running speed. */
  jump: 18.3,
  jumpFromSpeed: 0.12,
  /** Gravity going up with the button held, going up without it, and falling (m/s²). */
  gravityHeld: 40,
  gravityCut: 120,
  gravityFall: 75,
  /** The fastest fall (m/s). */
  maxFall: 22,
  /** Seconds after leaving a ledge a jump still counts, and before landing a press is kept. */
  coyote: 0.1,
  buffer: 0.12,
};

/** What the player is pressing this step. */
export interface HeroInput {
  left: boolean;
  right: boolean;
  /** The jump button is down. */
  jump: boolean;
  /** The jump button went down since the last step (a press, not a hold). */
  jumpPressed: boolean;
  run: boolean;
}

export const NO_INPUT: HeroInput = { left: false, right: false, jump: false, jumpPressed: false, run: false };

export interface Hero {
  body: Body;
  /** 1 facing right, -1 facing left. */
  facing: number;
  /** Time since last on the ground, and since the last jump press not yet used (s). */
  airTime: number;
  bufferTime: number;
  /** Going up from a jump (so letting go of the button cuts it short). */
  jumping: boolean;
  /** What happened on the last step. */
  contacts: Contacts;
  /** Jumped on the last step (for the sound and the squash). */
  jumped: boolean;
}

export function makeHero(x: number, y: number): Hero {
  return {
    body: { x, y, w: HERO.width, h: HERO.height, vx: 0, vy: 0, onGround: true },
    facing: 1,
    airTime: 0,
    bufferTime: Infinity,
    jumping: false,
    contacts: { wallLeft: false, wallRight: false, landed: false, bumped: null },
    jumped: false,
  };
}

function approach(v: number, target: number, rate: number, dt: number): number {
  return v < target ? Math.min(target, v + rate * dt) : Math.max(target, v - rate * dt);
}

/** One fixed step of the hero. */
export function stepHero(hero: Hero, input: HeroInput, level: Level, dt = STEP): void {
  const b = hero.body;
  const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  const top = input.run ? HERO.run : HERO.walk;

  // Across.
  if (dir !== 0) {
    hero.facing = dir;
    const turning = b.vx * dir < 0;
    const rate = b.onGround ? (turning ? HERO.turn : HERO.accel) : HERO.airAccel;
    // Above walking speed after letting go of run: ease back down rather than snap.
    const rateTo = Math.abs(b.vx) > top && b.vx * dir > 0 ? HERO.decel * 0.5 : rate;
    b.vx = approach(b.vx, dir * top, rateTo, dt);
  } else {
    b.vx = approach(b.vx, 0, b.onGround ? HERO.decel : HERO.airAccel * 0.5, dt);
  }

  // The jump: a press is kept for a moment, and the ledge is forgiven for a moment.
  hero.airTime = b.onGround ? 0 : hero.airTime + dt;
  hero.bufferTime = input.jumpPressed ? 0 : hero.bufferTime + dt;
  hero.jumped = false;
  if (hero.bufferTime <= HERO.buffer && hero.airTime <= HERO.coyote && !hero.jumping) {
    b.vy = HERO.jump + HERO.jumpFromSpeed * Math.abs(b.vx);
    b.onGround = false;
    hero.jumping = true;
    hero.jumped = true;
    hero.airTime = HERO.coyote + dt;
    hero.bufferTime = Infinity;
  }

  // Gravity: light while rising with the button held, heavy otherwise.
  const g = b.vy > 0 ? (hero.jumping && input.jump ? HERO.gravityHeld : HERO.gravityCut) : HERO.gravityFall;
  b.vy = Math.max(-HERO.maxFall, b.vy - g * dt);
  if (b.vy <= 0) hero.jumping = false;

  hero.contacts = moveBody(level, b, dt);
  if (hero.contacts.bumped) hero.jumping = false;
}

/** The hero has fallen out of the level. */
export function fellOut(hero: Hero): boolean {
  return hero.body.y < -3;
}
