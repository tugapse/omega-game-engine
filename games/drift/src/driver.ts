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
