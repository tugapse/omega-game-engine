// Where the side-on camera looks: it follows the hero across with a dead zone,
// looks a little ahead the way the hero runs, never scrolls back, and only
// follows up and down when the hero stands somewhere new (or goes far off).

export const VIEW = {
  /** The hero may move this far (m) either side of the look point before it follows. */
  deadZone: 1.2,
  /** How far ahead (m) it looks at full running speed. */
  lead: 3,
  /** Running speed for the full lead (m/s). */
  leadSpeed: 9.5,
  /** The look point sits this far (m) above the hero's feet. */
  above: 2.4,
  /** How quickly it catches up (1/s) across and up and down. */
  followX: 6,
  followY: 3,
  /** Standing above the floor, the look point sits this far (m) above the feet. */
  climb: 0,
  /** Out of this band (m) above or below the look point it follows even in the air. */
  bandY: 3.5,
  /**
   * The hero always sees at least this much (m) ahead, or this share of the
   * half-width on narrow screens (a phone held upright), so it never reaches
   * the right edge. Wide screens keep the dead zone and lead as they are.
   */
  ahead: 3.25,
  aheadShare: 1.3,
  /** On narrow screens the dead zone shrinks to this share of the half-width. */
  deadZoneShare: 0.3,
};

/** How much (m) the hero must see ahead with this half-width. */
export function aheadFor(halfWidth: number): number {
  return Math.min(VIEW.ahead, halfWidth * VIEW.aheadShare);
}

export interface CameraState {
  x: number;
  y: number;
  /** The lead in use (eases between left and right). */
  lead: number;
  /** The leftmost the camera may look (it never goes back). */
  minX: number;
  /** The height it is heading for. */
  goalY: number;
}

export function makeCamera(x: number, y: number, halfWidth: number): CameraState {
  const cx = Math.max(x, halfWidth);
  return { x: cx, y: y + VIEW.above, lead: 0, minX: cx, goalY: y + VIEW.above };
}

/**
 * Moves the camera for a step: `halfWidth` is half the visible width (m), so it
 * stays inside the level from 0 to `levelWidth`. `floorY` is the lowest it
 * looks (the start's height plus `above`): it only climbs when the hero stands
 * higher than that, so the ground stays in view on low platforms. `topRoom`
 * is how high (m) above the look point the hero's head may go and still be in
 * view below the HUD: past it the camera climbs at once (tall, narrow screens).
 * `back` lets it scroll back for once: while the hero rides a platform that
 * slides back along its track.
 */
export function followHero(
  cam: CameraState, hero: { x: number; y: number; vx: number; onGround: boolean },
  halfWidth: number, levelWidth: number, dt: number, floorY = -Infinity, topRoom = Infinity,
  heroHeight = 0.9, back = false,
): void {
  const want = Math.max(-1, Math.min(1, hero.vx / VIEW.leadSpeed)) * VIEW.lead;
  cam.lead += (want - cam.lead) * (1 - Math.exp(-dt * 2));
  const focus = hero.x + cam.lead;
  const dead = Math.min(VIEW.deadZone, halfWidth * VIEW.deadZoneShare);
  let goalX = cam.x;
  if (focus > cam.x + dead) goalX = focus - dead;
  else if (focus < cam.x - dead) goalX = focus + dead;
  cam.x += (goalX - cam.x) * (1 - Math.exp(-dt * VIEW.followX));
  // A hard limit on the right: the hero keeps some view ahead.
  cam.x = Math.max(cam.x, hero.x + aheadFor(halfWidth) - halfWidth);
  // Never back, never past the ends.
  const maxX = Math.max(halfWidth, levelWidth - halfWidth);
  if (back) cam.minX = Math.min(cam.minX, cam.x);
  cam.minX = Math.max(cam.minX, Math.min(cam.x, maxX));
  cam.x = Math.min(maxX, Math.max(cam.minX, halfWidth, cam.x));
  // Up and down: settle on where the hero stands; in the air only if it leaves the band.
  const feet = Math.max(floorY, hero.y + VIEW.climb);
  if (hero.onGround || Math.abs(feet - cam.goalY) > VIEW.bandY) cam.goalY = feet;
  cam.y += (cam.goalY - cam.y) * (1 - Math.exp(-dt * VIEW.followY));
  // A hard limit on top: the head stays in view.
  const over = hero.y + heroHeight - (cam.y + topRoom);
  if (over > 0) { cam.y += over; cam.goalY = Math.max(cam.goalY, cam.y); }
}
