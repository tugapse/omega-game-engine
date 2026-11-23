// A simple player for tests (and the title screen later): runs right, and
// jumps, holding the button for a full jump, at walls, gaps and enemies ahead.
import { Hero, HeroInput, stepHero } from './hero';
import { Level, LevelSpec, solidAt, tileAt } from './level';
import { STEP } from './physics';
import { makeWorld, nextTry, stepWorld, World } from './world';

export interface Bot {
  /** Seconds the jump button has been held (-1: not held). */
  held: number;
  /** Running during this jump (a shorter jump without it). */
  run: boolean;
}

export function makeBot(): Bot {
  return { held: -1, run: true };
}

/** Whether jumping now (running or not) lands safely: on solid ground, not in a gap or on spikes. */
function safeJump(hero: Hero, level: Level, run: boolean): boolean {
  const h: Hero = { ...hero, body: { ...hero.body }, contacts: { ...hero.contacts } };
  for (let i = 0; i < 360; i++) {
    const t = i * STEP;
    stepHero(h, { left: false, right: true, run, jump: t < 0.5, jumpPressed: i === 0 }, level);
    if (h.body.y < -1) return false;
    if (i > 2 && h.body.onGround) {
      const b = h.body;
      for (let tx = Math.floor(b.x - b.w / 2); tx <= Math.floor(b.x + b.w / 2 - 1e-6); tx++) {
        if (tileAt(level, tx, Math.floor(b.y)) === 'spikes') return false;
      }
      return true;
    }
  }
  return true;
}

/** What the bot presses this step. */
export function botInput(bot: Bot, w: World, dt: number): HeroInput {
  const b = w.hero.body;
  const front = b.x + b.w / 2;
  const row = Math.floor(b.y + 0.01);
  let jumpNow = false;
  if (b.onGround) {
    // A wall within reach (something solid in the next 1.5 m at foot or knee height), or spikes.
    for (let d = 0.05; d <= 1.5 && !jumpNow; d += 0.25) {
      const col = Math.floor(front + d);
      if (solidAt(w.level, col, row) || solidAt(w.level, col, row + 1)) jumpNow = true;
      if (d < 1 && tileAt(w.level, col, row) === 'spikes') jumpNow = true;
    }
    // A gap: no ground just ahead.
    const ahead = Math.floor(front + 0.3);
    if (!solidAt(w.level, ahead, row - 1) && !solidAt(w.level, ahead, row - 2)) jumpNow = true;
    // An enemy coming up (the flyer only when it is low).
    for (const e of w.enemies) {
      if (e.state !== 'walk' && e.state !== 'slide' && e.state !== 'shell') continue;
      const gap = e.body.x - e.body.w / 2 - front;
      if (gap > 0 && gap < 2.4 && e.body.y < b.y + b.h + 0.5 && e.body.y + e.body.h > b.y - 0.2) jumpNow = true;
    }
  }
  let pressed = false;
  if (jumpNow && bot.held < 0) {
    // Look before leaping: running if that lands safely, else a shorter jump, else wait a step.
    if (safeJump(w.hero, w.level, true)) { pressed = true; bot.run = true; }
    else if (safeJump(w.hero, w.level, false)) { pressed = true; bot.run = false; }
  }
  if (b.onGround && !pressed && bot.held < 0) bot.run = true;
  if (pressed) bot.held = 0;
  else if (bot.held >= 0) bot.held += dt;
  // Let go once the jump has peaked (and a moment after landing, to press again).
  if (bot.held > 0.5 || (bot.held > 0.05 && b.vy <= 0 && b.onGround)) bot.held = -1;
  return { left: false, right: true, run: bot.run, jump: bot.held >= 0, jumpPressed: pressed };
}

/** Runs the bot through a level, trying again after each death: whether it reached the goal. */
export function botRun(spec: LevelSpec, maxTime = 600): { reached: boolean; deaths: number; x: number; world: World } {
  let w = makeWorld(spec);
  let bot = makeBot();
  let deaths = 0, t = 0;
  // The camera's right edge, roughly: the bot runs right, so a fixed lead is enough.
  while (t < maxTime) {
    stepWorld(w, botInput(bot, w, STEP), w.hero.body.x + 9, STEP);
    t += STEP;
    if (w.cleared) return { reached: true, deaths, x: w.hero.body.x, world: w };
    if (w.dead) {
      deaths++;
      const next = nextTry(w);
      if (!next) return { reached: false, deaths, x: w.hero.body.x, world: w };
      w = next;
      bot = makeBot();
    }
  }
  return { reached: false, deaths, x: w.hero.body.x, world: w };
}
