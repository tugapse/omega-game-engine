// A simple player for tests (and the title screen later): runs right, and
// jumps, holding the button for a full jump, at walls and gaps ahead.
import { Hero, HeroInput, HERO } from './hero';
import { Level, solidAt } from './level';

export interface Bot {
  /** Seconds the jump button has been held (-1: not held). */
  held: number;
}

export function makeBot(): Bot {
  return { held: -1 };
}

/** What the bot presses this step. */
export function botInput(bot: Bot, hero: Hero, level: Level, dt: number): HeroInput {
  const b = hero.body;
  const front = b.x + b.w / 2;
  const row = Math.floor(b.y + 0.01);
  let jumpNow = false;
  if (b.onGround) {
    // A wall within reach (something solid in the next 1.5 m at foot or knee height).
    for (let d = 0.05; d <= 1.5 && !jumpNow; d += 0.25) {
      const col = Math.floor(front + d);
      if (solidAt(level, col, row) || solidAt(level, col, row + 1)) jumpNow = true;
    }
    // A gap: no ground just ahead.
    const ahead = Math.floor(front + 0.3);
    if (!solidAt(level, ahead, row - 1) && !solidAt(level, ahead, row - 2)) jumpNow = true;
  }
  const pressed = jumpNow && bot.held < 0;
  if (pressed) bot.held = 0;
  else if (bot.held >= 0) bot.held += dt;
  // Let go once the jump has peaked (and a moment after landing, to press again).
  if (bot.held > 0.5 || (bot.held > 0.05 && b.vy <= 0 && b.onGround)) bot.held = -1;
  const jump = bot.held >= 0;
  return { left: false, right: true, run: true, jump, jumpPressed: pressed, };
}

/** Runs the bot through a level: whether it reached the goal, and how long it took (s). */
export function botRun(level: Level, makeHero: (x: number, y: number) => Hero, step: (h: Hero, i: HeroInput) => void, dt: number, maxTime = 120): { reached: boolean; time: number; x: number } {
  const hero = makeHero(level.start.x, level.start.y);
  const bot = makeBot();
  let t = 0;
  while (t < maxTime) {
    step(hero, botInput(bot, hero, level, dt));
    t += dt;
    if (hero.body.y < -3) return { reached: false, time: t, x: hero.body.x };
    if (hero.body.x >= level.goal.x - HERO.width) return { reached: true, time: t, x: hero.body.x };
  }
  return { reached: false, time: t, x: hero.body.x };
}
