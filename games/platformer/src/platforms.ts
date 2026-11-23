// Platforms Bit can stand on: ones that slide or ride up and down a track, and
// ones that fall a moment after Bit lands on them. Bit jumps up through them
// and lands on their top; standing on one carries him along. No engine, so it
// is tested in Node (and the bot uses it to look before leaping).
import { Hero, HeroInput, stepHero } from './hero';
import { Level, PlatformSpec } from './level';
import { boxBlocked, STEP } from './physics';

export const PLATFORMS = {
  /** Top speed (m/s) along a track; they ease in and out at the ends. */
  speed: 2.4,
  /** Drawn thickness (m) under the top. */
  thick: 0.45,
  /** A falling platform shakes this long (s) after Bit lands on it, then drops. */
  fallDelay: 0.45,
  fallGravity: 28,
};

export interface Platform {
  spec: PlatformSpec;
  /** Left end and the row whose top it is at (top = y + 1), and how far it moved on the last step. */
  x: number;
  y: number;
  w: number;
  dx: number;
  dy: number;
  /** still: in place or moving on its track; shake: about to fall; fall; gone: out of the level. */
  state: 'still' | 'shake' | 'fall' | 'gone';
  /** Time in this state (s), and the fall's speed (m/s). */
  time: number;
  vy: number;
  /** Where on its track it starts (radians of the easing cycle) and how long a cycle takes (s). */
  phase: number;
  period: number;
}

export function makePlatforms(specs: PlatformSpec[]): Platform[] {
  return specs.map((spec) => {
    let phase = 0, period = 0;
    if (spec.track && spec.track.to !== spec.track.from) {
      const range = spec.track.to - spec.track.from;
      const start = spec.track.axis === 'x' ? spec.x : spec.y;
      const k = Math.min(1, Math.max(0, (start - spec.track.from) / range));
      phase = Math.acos(1 - 2 * k);
      // Peak speed of the cosine easing is π·range/period.
      period = (Math.PI * Math.abs(range)) / PLATFORMS.speed;
    }
    return { spec, x: spec.x, y: spec.y, w: spec.w, dx: 0, dy: 0, state: 'still', time: 0, vy: 0, phase, period };
  });
}

/** What a platform step needs: the tiles, the platforms, and the time since the level began (s). */
export interface Stage {
  level: Level;
  platforms: Platform[];
  elapsed: number;
}

/** Moves the platforms to where they are at `stage.elapsed` (falling ones by one step). */
export function movePlatforms(stage: Stage, dt = STEP): void {
  for (const p of stage.platforms) {
    const x0 = p.x, y0 = p.y;
    p.time += dt;
    const t = p.spec.track;
    if (p.state === 'shake' && p.time >= PLATFORMS.fallDelay) { p.state = 'fall'; p.time = 0; }
    if (p.state === 'fall') {
      p.vy -= PLATFORMS.fallGravity * dt;
      p.y += p.vy * dt;
      if (p.y < -5) p.state = 'gone';
    } else if (t && p.period > 0) {
      const pos = t.from + ((t.to - t.from) * (1 - Math.cos(p.phase + (2 * Math.PI * stage.elapsed) / p.period))) / 2;
      if (t.axis === 'x') p.x = pos; else p.y = pos;
    }
    p.dx = p.x - x0;
    p.dy = p.y - y0;
  }
}

/** Whether a body (middle x, width w) is over a platform's top. */
export const overPlatform = (x: number, w: number, p: Platform) => x + w / 2 > p.x + 0.04 && x - w / 2 < p.x + p.w - 0.04;

/**
 * One fixed step of the hero with the platforms: they move, the one Bit
 * stands on carries him, he moves, and he lands on any top he came down onto.
 * Returns whether he landed on a platform this step (from the air).
 */
export function stepHeroOnStage(stage: Stage, hero: Hero, input: HeroInput, dt = STEP): boolean {
  const b = hero.body;
  const tops = stage.platforms.map((p) => p.y + 1);
  stage.elapsed += dt;
  movePlatforms(stage, dt);
  // Carried along by the platform underfoot (unless a wall or the ceiling is in the way).
  const ridden = hero.riding >= 0 ? stage.platforms[hero.riding] : null;
  if (ridden) {
    if (ridden.state === 'gone') hero.riding = -1;
    else {
      if (!boxBlocked(stage.level, b.x + ridden.dx, b.y, b.w, b.h)) b.x += ridden.dx;
      if (!boxBlocked(stage.level, b.x, ridden.y + 1, b.w, b.h)) b.y = ridden.y + 1;
      else hero.riding = -1;
    }
  }
  const wasRiding = hero.riding;
  const feetBefore = b.y;
  stepHero(hero, input, stage.level, dt);
  hero.riding = -1;
  if (b.vy > 0) return false;
  let best = -1, bestTop = -Infinity;
  stage.platforms.forEach((p, i) => {
    if (p.state === 'gone' || !overPlatform(b.x, b.w, p)) return;
    const top = p.y + 1;
    if (feetBefore >= Math.min(tops[i], top) - 0.02 && b.y <= top + 1e-6 && top > bestTop) { best = i; bestTop = top; }
  });
  if (best < 0 || (b.onGround && b.y > bestTop)) return false;
  const p = stage.platforms[best];
  b.y = bestTop;
  b.vy = 0;
  b.onGround = true;
  hero.jumping = false;
  hero.riding = best;
  if (p.spec.kind === 'fall' && p.state === 'still') { p.state = 'shake'; p.time = 0; }
  return wasRiding !== best;
}

/** A copy of the platforms' state, for looking ahead (the bot). */
export function cloneStage(stage: Stage): Stage {
  return { level: stage.level, platforms: stage.platforms.map((p) => ({ ...p })), elapsed: stage.elapsed };
}
