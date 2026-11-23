// The chase camera: behind and above the car, looking a little ahead of it.
// It swings round after the car with a lag, and it looks along a blend of the
// car's nose and where it is going, so in a slide the car is seen sideways.
import { Car, speedOf } from './car';

export const CHASE = {
  /** Behind (m) and above (m) the car, and how far ahead of it (m) it looks. */
  back: 7.5,
  up: 3.4,
  ahead: 5,
  /** How fast (1/s) it catches up with the direction, and with the car. */
  turn: 4,
  follow: 10,
  /** How much the velocity's direction counts over the nose's, at speed (0 to 1). */
  motion: 0.55,
  /** Field of view (degrees) standing and at top speed. */
  fov: 58,
  fovFast: 70,
};

export interface ChaseState {
  /** The direction it looks along (rad on the plane), and where it is. */
  dir: number;
  x: number;
  y: number;
  fov: number;
}

const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

export function makeChase(car: Car): ChaseState {
  return { dir: car.heading, x: car.x - Math.cos(car.heading) * CHASE.back, y: car.y - Math.sin(car.heading) * CHASE.back, fov: CHASE.fov };
}

/** Where the camera wants to look along: the nose, bent towards the motion at speed (never backwards). */
export function chaseDirection(car: Car): number {
  const v = speedOf(car);
  if (v < 3) return car.heading;
  const motion = Math.atan2(car.vy, car.vx);
  const diff = wrap(motion - car.heading);
  // Going backwards: keep looking along the nose.
  if (Math.abs(diff) > Math.PI / 2) return car.heading;
  const k = CHASE.motion * Math.min(1, (v - 3) / 10);
  return car.heading + diff * k;
}

export function followCar(c: ChaseState, car: Car, dt: number): void {
  const want = chaseDirection(car);
  c.dir += wrap(want - c.dir) * Math.min(1, CHASE.turn * dt);
  const tx = car.x - Math.cos(c.dir) * CHASE.back, ty = car.y - Math.sin(c.dir) * CHASE.back;
  const k = Math.min(1, CHASE.follow * dt);
  c.x += (tx - c.x) * k;
  c.y += (ty - c.y) * k;
  const v = Math.min(1, speedOf(car) / car.spec.top);
  c.fov += (CHASE.fov + (CHASE.fovFast - CHASE.fov) * v * v - c.fov) * Math.min(1, 2 * dt);
}
