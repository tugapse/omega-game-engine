// A driver that follows the track's centre line: it steers at a point ahead
// (further at speed) and picks its speed from how tight the bends ahead are.
// It drives the car in the browser with ?auto and laps the tracks in the tests.
import { Car, CarInput, forwardSpeed } from './car';
import { Place, sampleAhead, Track } from './track';

export interface Driver {
  /** How much of the grip it dares to use in a bend (1: all of it). */
  nerve: number;
}

export const makeDriver = (nerve = 0.8): Driver => ({ nerve });

/** The fastest speed (m/s) through the tightest bend in the next `reach` metres, braking allowed. */
function safeSpeed(track: Track, place: Place, reach: number, nerve: number, top: number): number {
  let best = top;
  const brake = 7;
  for (let d = 0; d <= reach; d += 3) {
    const p = sampleAhead(track, place.index, d);
    const bend = Math.abs(p.bend);
    const corner = bend > 1e-4 ? Math.sqrt((nerve * 9.81) / bend) : top;
    // How fast it may be now to slow to `corner` by then.
    best = Math.min(best, Math.sqrt(corner * corner + 2 * brake * d));
  }
  return best;
}

export function drive(d: Driver, car: Car, track: Track, place: Place): CarInput {
  const u = forwardSpeed(car);
  const look = 6 + Math.max(0, u) * 0.45;
  const p = sampleAhead(track, place.index, look);
  const ang = Math.atan2(p.y - car.y, p.x - car.x) - car.heading;
  const turn = Math.atan2(Math.sin(ang), Math.cos(ang));
  // Steer is +1 to the right; the angle is positive to the left.
  const steer = Math.max(-1, Math.min(1, -turn * 2.4));
  const want = safeSpeed(track, place, 50 + u * 1.5, d.nerve, car.spec.top);
  let throttle = u < want - 0.5 ? 1 : u < want ? 0.4 : 0;
  // Traction control: ease off when the rear tyres are at their limit.
  if (car.rearLoad > 0.9) throttle = Math.min(throttle, 0.25);
  const brake = u > want + 1.5 ? Math.min(1, (u - want) / 6) : 0;
  return { throttle, brake, steer, handbrake: false };
}

/**
 * The drift assist's guide: the curvature (1/m, positive left) of the arc
 * from where the car goes (its velocity) to the road's line a little ahead
 * (pure pursuit), so a held drift follows the road on its own.
 */
export function guideCurve(car: Car, track: Track, place: Place, offset = 0): number {
  const v = Math.hypot(car.vx, car.vy);
  const look = 7 + v * 0.42;
  const p = sampleAhead(track, place.index, look);
  // Aim a little inside the bend, where a drift wants to be.
  const inside = Math.max(-1, Math.min(1, p.bend * 60)) * track.half * 0.3 + offset;
  const tx = p.x + p.nx * inside, ty = p.y + p.ny * inside;
  const dx = tx - car.x, dy = ty - car.y;
  const dist = Math.hypot(dx, dy) || 1;
  const dir = v > 1 ? Math.atan2(car.vy, car.vx) : car.heading;
  const ang = Math.atan2(dy, dx) - dir;
  return (2 * Math.sin(Math.atan2(Math.sin(ang), Math.cos(ang)))) / dist;
}

/** A rival: how hard it pushes (0 to 1), its own line across the road (m, positive left), and whether it drifts the bends. */
export interface Rival {
  pace: number;
  offset: number;
  drifts: boolean;
  /** The line it is on now (moves to pass a car ahead). */
  lane: number;
}

export const makeRival = (pace: number, offset: number, drifts = true): Rival => ({ pace, offset, drifts, lane: offset });

/** Another car on the track, as a rival sees it. */
export interface Other { car: Car; place: Place }

/**
 * A rival's input: it keeps to its line (moving across to pass a car close
 * ahead), drifts the bends with the guide like a player holding the
 * handbrake, and its pace caps its speed and its throttle in a slide.
 */
export function rivalDrive(r: Rival, car: Car, track: Track, place: Place, others: Other[]): CarInput {
  const u = forwardSpeed(car);
  // Pass a car close ahead on its other side.
  let want = r.offset;
  for (const o of others) {
    let ahead = o.place.along - place.along;
    if (ahead < -track.length / 2) ahead += track.length;
    if (ahead > track.length / 2) ahead -= track.length;
    if (ahead > 0 && ahead < 14 && Math.abs(o.place.side - r.lane) < 2.8) {
      want = o.place.side > 0 ? o.place.side - 3.6 : o.place.side + 3.6;
    }
  }
  const room = track.half - 1.8;
  want = Math.max(-room, Math.min(room, want));
  r.lane += Math.max(-2.5 / 60, Math.min(2.5 / 60, want - r.lane));
  const look = 6 + Math.max(0, u) * 0.45;
  const p = sampleAhead(track, place.index, look);
  const tx = p.x + p.nx * r.lane, ty = p.y + p.ny * r.lane;
  const ang = Math.atan2(ty - car.y, tx - car.x) - car.heading;
  const steer = Math.max(-1, Math.min(1, -Math.atan2(Math.sin(ang), Math.cos(ang)) * 2.4));
  const cap = car.spec.top * (0.78 + 0.22 * r.pace);
  if (r.drifts) {
    let bend = 0;
    for (let k = 5; k <= 30; k += 5) bend = Math.max(bend, Math.abs(sampleAhead(track, place.index, k).bend));
    const hand = bend > 1 / 45 && u > 9;
    const guide = guideCurve(car, track, place, r.lane * 0.5);
    if (hand || car.drift) return { throttle: 0.45 + 0.55 * r.pace, brake: 0, steer: 0, handbrake: hand, guide };
    const throttle = u < cap ? 1 : 0.2;
    return { throttle: car.rearLoad > 0.95 ? Math.min(throttle, 0.5) : throttle, brake: 0, steer, handbrake: false, guide };
  }
  const grip = drive({ nerve: 0.7 + 0.2 * r.pace }, car, track, place);
  return { ...grip, steer, throttle: u < cap ? grip.throttle : 0 };
}
