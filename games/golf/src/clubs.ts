// The five clubs, and how a swing (power and curve) becomes a shot.
import { Shot } from './ball';
import { FEEL, Surface } from './terrain';

export type ClubId = 'driver' | 'wood' | 'iron' | 'wedge' | 'putter';

export interface Club {
  id: ClubId;
  name: string;
  /** Ball speed at full power, m/s. */
  speed: number;
  /** Launch angle, degrees. */
  launch: number;
  /** Backspin at full power, rad/s. */
  backspin: number;
  /** Sidespin for a full curve, rad/s. */
  sidespin: number;
}

export const CLUBS: Club[] = [
  { id: 'driver', name: 'Driver', speed: 63, launch: 11, backspin: 290, sidespin: 80 },
  { id: 'wood', name: 'Madeira', speed: 50, launch: 13, backspin: 400, sidespin: 80 },
  { id: 'iron', name: 'Ferro', speed: 42, launch: 18, backspin: 650, sidespin: 90 },
  { id: 'wedge', name: 'Wedge', speed: 30, launch: 32, backspin: 950, sidespin: 70 },
  { id: 'putter', name: 'Putter', speed: 0, launch: 0, backspin: 0, sidespin: 0 },
];

export const club = (id: ClubId): Club => CLUBS.find((c) => c.id === id)!;

/** The longest putt (on a flat green) at full power, metres. */
export const MAX_PUTT = 20;
/** Weakest swing that still counts. */
export const MIN_POWER = 0.05;

/**
 * The shot for a swing: `power` 0–1, `curve` -1 (hook, left) to 1 (slice,
 * right), `direction` the aim in radians. Speed grows with the square root
 * of power, so a half swing goes about half as far. A putt's power maps to
 * the distance it would roll on a flat green.
 */
export function shotFor(c: Club, power: number, direction: number, curve = 0): Shot {
  const p = Math.max(MIN_POWER, Math.min(1, power));
  if (c.id === 'putter') {
    // v² = 2·a·d on a flat green, plus a touch for the cup.
    const speed = Math.sqrt(2 * FEEL.green.rolling * p * MAX_PUTT) + 0.05;
    return { speed, launch: 0, direction: direction + curve * 0.02, backspin: 0, sidespin: 0 };
  }
  const k = Math.sqrt(p);
  return {
    speed: c.speed * k,
    launch: (c.launch * Math.PI) / 180,
    direction,
    backspin: c.backspin * (0.6 + 0.4 * k),
    sidespin: c.sidespin * curve * (0.4 + 0.6 * k),
  };
}

/**
 * The club for `distance` metres: the shortest whose full shot (`reach`, carry
 * plus roll on the fairway) gets there; the driver when none does. Only from
 * the tee does the driver come up; off the fairway the wood is the longest.
 */
export function suggestClub(distance: number, reach: Record<ClubId, number>, onGreen: boolean, fromTee: boolean): ClubId {
  if (onGreen) return 'putter';
  const order: ClubId[] = ['wedge', 'iron', 'wood', 'driver'];
  for (const id of order) {
    if (id === 'driver' && !fromTee) return 'wood';
    if (reach[id] >= distance) return id;
  }
  return fromTee ? 'driver' : 'wood';
}

/**
 * How much of its speed a club keeps from this lie: the rough grabs the club,
 * sand takes most of it (less with the wedge, made for it). Putts are untouched.
 */
export function lieFactor(lie: Surface, id: ClubId): number {
  if (id === 'putter') return 1;
  if (lie === 'rough') return id === 'wedge' || id === 'iron' ? 0.82 : 0.72;
  if (lie === 'sand') return id === 'wedge' ? 0.75 : 0.45;
  return 1;
}
