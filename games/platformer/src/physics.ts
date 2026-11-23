// Boxes moving through the tile grid: one axis at a time, pushed out of solid
// tiles, with the tiles they bumped reported back. Fixed step, so the same
// inputs always give the same run.
import { Level, solidAt } from './level';

/** The fixed step (s). */
export const STEP = 1 / 120;

/** A box: x is its middle, y its bottom (the feet). */
export interface Body {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  onGround: boolean;
}

export interface Contacts {
  /** Hit a wall on the left or the right this step. */
  wallLeft: boolean;
  wallRight: boolean;
  /** Landed this step (was in the air). */
  landed: boolean;
  /** Hit the ceiling this step: the tile bumped (the one most under the head's middle). */
  bumped: { x: number; y: number } | null;
}

const EPS = 1e-6;
/** How far (m) a head may overlap a corner and still slip past it. */
export const CORNER_SLIP = 0.22;

function overlapsSolid(level: Level, x0: number, y0: number, x1: number, y1: number): boolean {
  for (let tx = Math.floor(x0); tx <= Math.floor(x1 - EPS); tx++) {
    for (let ty = Math.floor(y0); ty <= Math.floor(y1 - EPS); ty++) {
      if (solidAt(level, tx, ty)) return true;
    }
  }
  return false;
}

/** Moves a body by its velocity for one step, stopping it at solid tiles. */
export function moveBody(level: Level, b: Body, dt = STEP): Contacts {
  const c: Contacts = { wallLeft: false, wallRight: false, landed: false, bumped: null };
  const half = b.w / 2;

  // Across.
  let x = b.x + b.vx * dt;
  if (b.vx > 0 && overlapsSolid(level, x - half, b.y, x + half, b.y + b.h)) {
    x = Math.floor(x + half - EPS) - half;
    // A wall may be further than one tile only at very high speed: settle back until clear.
    while (overlapsSolid(level, x - half, b.y, x + half, b.y + b.h)) x -= 1;
    b.vx = 0; c.wallRight = true;
  } else if (b.vx < 0 && overlapsSolid(level, x - half, b.y, x + half, b.y + b.h)) {
    x = Math.floor(x - half) + 1 + half;
    while (overlapsSolid(level, x - half, b.y, x + half, b.y + b.h)) x += 1;
    b.vx = 0; c.wallLeft = true;
  }
  b.x = x;

  // Up and down.
  const wasOnGround = b.onGround;
  let y = b.y + b.vy * dt;
  b.onGround = false;
  if (b.vy <= 0) {
    if (overlapsSolid(level, b.x - half, y, b.x + half, y + b.h)) {
      y = Math.floor(y) + 1;
      b.vy = 0;
      b.onGround = true;
      c.landed = !wasOnGround;
    } else if (b.vy === 0 && overlapsSolid(level, b.x - half, y - 0.02, b.x + half, y)) {
      b.onGround = true;
    }
  } else if (overlapsSolid(level, b.x - half, y, b.x + half, y + b.h)) {
    const row = Math.floor(y + b.h - EPS);
    // Only a corner in the way: slip past it instead of bonking.
    const left = Math.floor(b.x - half), right = Math.floor(b.x + half - EPS);
    const leftSolid = solidAt(level, left, row), rightSolid = solidAt(level, right, row);
    if (leftSolid !== rightSolid) {
      const shift = leftSolid ? left + 1 - (b.x - half) : right - (b.x + half);
      if (Math.abs(shift) <= CORNER_SLIP && !overlapsSolid(level, b.x + shift - half, y, b.x + shift + half, y + b.h)) {
        b.x += shift;
        b.y = y;
        return c;
      }
    }
    y = row - b.h;
    b.vy = 0;
    // The tile bumped: the one under the middle of the head, or the other one if that is empty.
    const mid = Math.floor(b.x);
    const bx = solidAt(level, mid, row) ? mid : leftSolid ? left : right;
    c.bumped = { x: bx, y: row };
  }
  b.y = y;
  return c;
}
