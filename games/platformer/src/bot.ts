// A simple player for tests (and the title screen later): runs right, and
// jumps, holding the button for a full jump, at walls, gaps and enemies ahead.
// It looks before leaping (simulating the jump with the platforms moving), and
// stops at an edge to wait when no jump from there would land safely, such as
// for a moving platform to come by.
import { Hero, HERO, HeroInput, NO_INPUT } from './hero';
import { LevelSpec, solidAt, tileAt } from './level';
import { STEP } from './physics';
import { cloneStage, Stage, stepHeroOnStage } from './platforms';
import { makeWorld, nextTry, stepWorld, World } from './world';

export interface Bot {
  /** Seconds the jump button has been held (-1: not held). */
  held: number;
  /** Running during this jump (a shorter jump without it). */
  run: boolean;
  /** How long (s) to hold the button for this jump. */
  hold: number;
}

export function makeBot(): Bot {
  return { held: -1, run: true, hold: 0.5 };
}

/** The jumps the bot tries, best first: running or walking, held fully or briefly. */
const JUMPS = [{ run: true, hold: 0.5 }, { run: false, hold: 0.5 }, { run: true, hold: 0.2 }, { run: false, hold: 0.2 }];
/** Walking off the edge without jumping (hold < 0: no press). */
const STEP_OFF = { run: false, hold: -1 };

const copyHero = (h: Hero): Hero => ({ ...h, body: { ...h.body }, contacts: { ...h.contacts } });

/** Whether there is something to stand on at x, at or a little below feet height (tiles or a platform). */
function groundAt(stage: Stage, x: number, feet: number): boolean {
  const row = Math.floor(feet + 0.01), col = Math.floor(x);
  for (const r of [row, row - 1, row - 2]) {
    if (tileAt(stage.level, col, r) === 'spikes') return false;
    if (r < row && solidAt(stage.level, col, r)) return true;
  }
  return stage.platforms.some((p) => p.state !== 'gone' && p.state !== 'fall' && x > p.x && x < p.x + p.w && p.y + 1 <= feet + 0.1 && p.y + 1 >= feet - 2);
}

/**
 * Whether a landing spot is safe: not on spikes, and with room to stop there
 * (letting go of everything, Bit does not slide off). A falling platform
 * counts, as the bot jumps off it at once.
 */
function safeLanding(stage: Stage, h: Hero): boolean {
  const b = h.body;
  if (onSpikes(stage, h)) return false;
  if (h.riding >= 0 && stage.platforms[h.riding].spec.kind === 'fall') return true;
  const y = b.y;
  for (let i = 0; i < 90; i++) {
    stepHeroOnStage(stage, h, NO_INPUT, STEP);
    if (b.y < y - 0.5 || onSpikes(stage, h)) return false;
  }
  // Firm footing: something under Bit's middle, not just a toe on an edge.
  return groundAt(stage, b.x, b.y);
}

/** Whether Bit touches the part of a spike tile that hurts (as in world.ts). */
function onSpikes(stage: Stage, h: Hero): boolean {
  const b = h.body;
  for (let tx = Math.floor(b.x - b.w / 2); tx <= Math.floor(b.x + b.w / 2 - 1e-6); tx++) {
    for (let ty = Math.floor(b.y); ty <= Math.floor(b.y + b.h - 1e-6); ty++) {
      if (tileAt(stage.level, tx, ty) === 'spikes' && b.y < ty + 0.55) return true;
    }
  }
  return false;
}

/** Whether jumping now (running or not) lands safely: on solid ground or a platform, not in a gap or on spikes. */
function safeJump(w: World, run: boolean, hold: number): boolean {
  const stage = cloneStage(w), h = copyHero(w.hero);
  for (let i = 0; i < 360; i++) {
    const t = i * STEP;
    stepHeroOnStage(stage, h, { left: false, right: true, run, jump: t < hold, jumpPressed: hold >= 0 && i === 0 }, STEP);
    if (h.body.y < -1 || onSpikes(stage, h)) return false;
    if (i > 2 && h.body.onGround) return safeLanding(stage, h);
  }
  return true;
}

/** Whether running on and jumping at the edge (as the bot would) lands safely. */
function safeRunUp(w: World): boolean {
  const stage = cloneStage(w), h = copyHero(w.hero);
  let jumpAt = -1;
  for (let i = 0; i < 480; i++) {
    const b = h.body;
    const press = jumpAt < 0 && b.onGround && !groundAt(stage, b.x + b.w / 2 + 0.3, b.y);
    if (press) jumpAt = i;
    const holding = jumpAt >= 0 && (i - jumpAt) * STEP < 0.5;
    stepHeroOnStage(stage, h, { left: false, right: true, run: true, jump: holding, jumpPressed: press }, STEP);
    if (b.y < -1 || onSpikes(stage, h)) return false;
    if (jumpAt >= 0 && i - jumpAt > 2 && b.onGround) return safeLanding(stage, h);
  }
  return true;
}

/** What the bot presses this step. */
export function botInput(bot: Bot, w: World, dt: number): HeroInput {
  const b = w.hero.body;
  const front = b.x + b.w / 2;
  const row = Math.floor(b.y + 0.01);
  let jumpNow = false, wait = false;
  if (b.onGround) {
    // A wall within reach (something solid in the next 1.5 m at foot or knee height), or spikes.
    for (let d = 0.05; d <= 1.5 && !jumpNow; d += 0.25) {
      const col = Math.floor(front + d);
      if (solidAt(w.level, col, row) || solidAt(w.level, col, row + 1)) jumpNow = true;
      if (d < 1 && tileAt(w.level, col, row) === 'spikes') jumpNow = true;
    }
    // A gap: nothing to stand on just ahead (looking a little further when stopped at an edge).
    if (!groundAt(w, front + (Math.abs(b.vx) < 1 ? 0.8 : 0.3), b.y)) jumpNow = true;
    // Standing on a falling platform: off it as soon as it is safe.
    if (w.hero.riding >= 0 && w.platforms[w.hero.riding].spec.kind === 'fall') jumpNow = true;
    wait = jumpNow;
    // An enemy coming up (the flyer only when it is low).
    for (const e of w.enemies) {
      if (e.state !== 'walk' && e.state !== 'slide' && e.state !== 'shell') continue;
      const gap = e.body.x - e.body.w / 2 - front;
      if (gap > 0 && gap < 2.4 && e.body.y < b.y + b.h + 0.5 && e.body.y + e.body.h > b.y - 0.2) jumpNow = true;
    }
  }
  let pressed = false, stepOff = false;
  if (jumpNow && bot.held < 0) {
    // Look before leaping: running if that lands safely, else a shorter jump, else wait.
    const jump = JUMPS.find((j) => safeJump(w, j.run, j.hold));
    if (jump) { pressed = true; bot.run = jump.run; bot.hold = jump.hold; }
    else if (safeJump(w, STEP_OFF.run, STEP_OFF.hold)) { bot.run = false; stepOff = true; }
  }
  let stop = false;
  if (b.onGround && !pressed && bot.held < 0) {
    bot.run = true;
    if (stepOff) bot.run = false;
    else if (wait) stop = true;
    else {
      // A gap coming up within braking distance: run on only if the jump at its edge will land.
      const brake = (b.vx * b.vx) / (2 * HERO.decel) + 0.6;
      for (let d = 0.3; d <= brake && !stop; d += 0.25) {
        if (!groundAt(w, front + d, b.y)) stop = !safeRunUp(w);
        if (!groundAt(w, front + d, b.y)) break;
      }
    }
  }
  if (pressed) bot.held = 0;
  else if (bot.held >= 0) bot.held += dt;
  // Let go once the jump has peaked (and a moment after landing, to press again).
  const holding = bot.held >= 0 && bot.held < bot.hold;
  if (bot.held > 0.5 || (bot.held > 0.05 && b.vy <= 0 && b.onGround)) bot.held = -1;
  return { left: false, right: !stop, run: bot.run, jump: holding, jumpPressed: pressed };
}

/** Runs the bot through a level, trying again after each death: whether it reached the goal. */
export function botRun(spec: LevelSpec, maxTime = 600): { reached: boolean; deaths: number; x: number; time: number; world: World } {
  let w = makeWorld(spec);
  let bot = makeBot();
  let deaths = 0, t = 0;
  // The camera's right edge, roughly: the bot runs right, so a fixed lead is enough.
  while (t < maxTime) {
    stepWorld(w, botInput(bot, w, STEP), w.hero.body.x + 9, STEP);
    t += STEP;
    if (w.cleared) return { reached: true, deaths, x: w.hero.body.x, time: t, world: w };
    if (w.dead) {
      deaths++;
      const next = nextTry(w);
      if (!next) return { reached: false, deaths, x: w.hero.body.x, time: t, world: w };
      w = next;
      bot = makeBot();
    }
  }
  return { reached: false, deaths, x: w.hero.body.x, time: t, world: w };
}
