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
};

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
 * higher than that, so the ground stays in view on low platforms.
 */
export function followHero(
  cam: CameraState, hero: { x: number; y: number; vx: number; onGround: boolean },
  halfWidth: number, levelWidth: number, dt: number, floorY = -Infinity,
): void {
  const want = Math.max(-1, Math.min(1, hero.vx / VIEW.leadSpeed)) * VIEW.lead;
  cam.lead += (want - cam.lead) * (1 - Math.exp(-dt * 2));
  const focus = hero.x + cam.lead;
  let goalX = cam.x;
  if (focus > cam.x + VIEW.deadZone) goalX = focus - VIEW.deadZone;
  else if (focus < cam.x - VIEW.deadZone) goalX = focus + VIEW.deadZone;
  cam.x += (goalX - cam.x) * (1 - Math.exp(-dt * VIEW.followX));
  // Never back, never past the ends.
  const maxX = Math.max(halfWidth, levelWidth - halfWidth);
  cam.minX = Math.max(cam.minX, Math.min(cam.x, maxX));
  cam.x = Math.min(maxX, Math.max(cam.minX, halfWidth, cam.x));
  // Up and down: settle on where the hero stands; in the air only if it leaves the band.
  const feet = Math.max(floorY, hero.y + VIEW.climb);
  if (hero.onGround || Math.abs(feet - cam.goalY) > VIEW.bandY) cam.goalY = feet;
  cam.y += (cam.goalY - cam.y) * (1 - Math.exp(-dt * VIEW.followY));
}
