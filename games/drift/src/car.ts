// The car on a flat plane, a fixed step at a time: a bicycle model (one front
// and one rear axle) whose tyres push sideways against their slip, up to what
// their grip allows. Power at the rear eats into the rear tyres' grip, so the
// throttle and the handbrake swing the tail out; steering against the slide
// (countersteer) holds it or straightens it. No engine, so it runs in Node.
//
// The plane has x and y (y "up the map"); the heading is the angle from +x.

export const STEP = 1 / 120;
const G = 9.81;

export interface CarSpec {
  /** Kerb mass (kg) and how hard it is to spin (kg·m²). */
  mass: number;
  inertia: number;
  /** From the centre of mass to the front and the rear axle (m). */
  front: number;
  rear: number;
  /** Most drive force (N), the engine's power (W), and the top speed (m/s), a soft limiter. */
  drive: number;
  power: number;
  top: number;
  /** Brake force (N), and the drive in reverse (share of `drive`). */
  brake: number;
  reverse: number;
  /** Tyre grip (μ) front and rear, and the rear's with the handbrake on. */
  gripFront: number;
  gripRear: number;
  gripHandbrake: number;
  /** Side force per radian of slip, per newton of load (cornering stiffness). */
  stiffness: number;
  /** Air drag (N per (m/s)²) and rolling resistance (N per m/s). */
  drag: number;
  rolling: number;
  /** Most the front wheels turn (rad) standing still and at top speed. */
  steerLow: number;
  steerHigh: number;
  /** How fast (rad/s) the wheels turn towards where the player steers. */
  steerRate: number;
  /** Radius (m) of the circle the car is to the walls. */
  radius: number;
  /**
   * Help to hold a slide: past `assistFrom` (rad) of drift angle a torque
   * (N·m per rad) turns the nose back towards where the car goes, so a slide
   * is held with the throttle and not lost into a spin.
   */
  assistFrom: number;
  assist: number;
}

/** The first car: small, light and willing to slide. */
export const CAR: CarSpec = {
  mass: 900,
  inertia: 1100,
  front: 1.05,
  rear: 1.15,
  drive: 11000,
  power: 120000,
  top: 34,
  brake: 11000,
  reverse: 0.4,
  gripFront: 1.0,
  gripRear: 1.1,
  gripHandbrake: 0.45,
  stiffness: 12,
  drag: 0.9,
  rolling: 18,
  steerLow: 0.6,
  steerHigh: 0.22,
  steerRate: 3.2,
  radius: 1.05,
  assistFrom: 0.5,
  assist: 9000,
};

export interface CarInput {
  /** 0 to 1 each. */
  throttle: number;
  brake: number;
  /** -1 (left) to 1 (right). */
  steer: number;
  handbrake: boolean;
}

export const NO_INPUT: CarInput = { throttle: 0, brake: 0, steer: 0, handbrake: false };

export interface Car {
  spec: CarSpec;
  x: number;
  y: number;
  heading: number;
  /** Velocity on the plane (m/s) and the spin (rad/s, positive turns left). */
  vx: number;
  vy: number;
  spin: number;
  /** The front wheels' angle (rad, positive left). */
  wheel: number;
  /** Grip of the ground under the car (1 on the road) and its extra drag (N per m/s). */
  surfaceGrip: number;
  surfaceDrag: number;
  /** Rear tyres' slip (rad, signed), for the drift and the look. */
  slip: number;
  /** Going backwards on purpose (brake held at a standstill). */
  reversing: boolean;
  /** Share (0 to 1) of the rear tyres' grip in use, past 1 they slide. */
  rearLoad: number;
}

export function makeCar(x: number, y: number, heading: number, spec: CarSpec = CAR): Car {
  return { spec, x, y, heading, vx: 0, vy: 0, spin: 0, wheel: 0, surfaceGrip: 1, surfaceDrag: 0, slip: 0, reversing: false, rearLoad: 0 };
}

export const cloneCar = (c: Car): Car => ({ ...c });

export const speedOf = (c: Car) => Math.hypot(c.vx, c.vy);

/** Speed along the car's nose (m/s, negative going backwards). */
export function forwardSpeed(c: Car): number {
  return c.vx * Math.cos(c.heading) + c.vy * Math.sin(c.heading);
}

/** The angle (rad) between where the car points and where it goes; 0 when slow. */
export function driftAngle(c: Car): number {
  const v = speedOf(c);
  if (v < 3) return 0;
  const a = Math.atan2(c.vy, c.vx) - c.heading;
  return Math.atan2(Math.sin(a), Math.cos(a));
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** One fixed step. */
export function stepCar(c: Car, input: CarInput, dt = STEP): void {
  const s = c.spec;
  const cos = Math.cos(c.heading), sin = Math.sin(c.heading);
  // In the car's frame: u along the nose, w to its left.
  let u = c.vx * cos + c.vy * sin;
  let w = -c.vx * sin + c.vy * cos;
  const speed = Math.hypot(u, w);

  // Steering: less lock at speed; the wheels turn at a set rate.
  const lock = s.steerLow + (s.steerHigh - s.steerLow) * clamp(speed / s.top, 0, 1);
  const want = -clamp(input.steer, -1, 1) * lock;
  const turn = s.steerRate * dt;
  c.wheel += clamp(want - c.wheel, -turn, turn);

  // Going backwards: hold the brake once stopped; the throttle ends it.
  if (input.throttle > 0.05) c.reversing = false;
  else if (input.brake > 0.05 && u < 0.5) c.reversing = true;
  if (input.brake < 0.05 && u > -0.5) c.reversing = false;

  // Each axle carries half the weight (no load transfer: steadier for an arcade).
  const load = (s.mass * G) / 2;
  const grip = c.surfaceGrip;
  const maxFront = s.gripFront * grip * load;
  const maxRear = (input.handbrake ? s.gripHandbrake : s.gripRear) * grip * load;

  // Slip angles, with a floor on the speed under them so a crawl is not twitchy.
  const along = Math.max(Math.abs(u), 4);
  const back = u < 0 ? -1 : 1;
  const slipFront = Math.atan2(w + c.spin * s.front, along) - c.wheel * back;
  const slipRear = Math.atan2(w - c.spin * s.rear, along);
  let sideFront = clamp(-s.stiffness * load * slipFront, -maxFront, maxFront);
  let sideRear = clamp(-s.stiffness * load * slipRear, -maxRear, maxRear);

  // Drive at the rear wheels; the brakes on all four (60% front), the handbrake at the rear.
  let push = 0, stopFront = 0;
  if (c.reversing) push = -s.drive * s.reverse * input.brake * clamp(1 - Math.abs(u) / (s.top * 0.3), 0, 1);
  else {
    push = Math.min(s.drive, s.power / Math.max(1, u)) * clamp(input.throttle, 0, 1) * clamp((s.top - u) / 2, 0, 1);
    if (input.brake > 0 && Math.abs(u) > 0.05) {
      const f = Math.sign(u) * s.brake * input.brake * Math.min(1, Math.abs(u) / 0.5);
      push -= f * 0.4;
      stopFront = -f * 0.6;
    }
  }
  if (input.handbrake && Math.abs(u) > 0.05) push -= Math.sign(u) * s.brake * 0.35 * Math.min(1, Math.abs(u) / 0.5);
  // Each axle's tyres share their grip between the push along and the hold across.
  const share = (along: number, side: number, max: number): [number, number, number] => {
    const used = Math.hypot(along, side);
    if (used <= max) return [along, side, used / Math.max(1, max)];
    const k = max / used;
    return [along * k, side * k, used / Math.max(1, max)];
  };
  [stopFront, sideFront] = share(stopFront, sideFront, maxFront);
  [push, sideRear, c.rearLoad] = share(push, sideRear, maxRear);
  // Rolling resistance, ground drag and air.
  const resist = s.rolling + c.surfaceDrag;
  const ws = Math.sin(c.wheel), wc = Math.cos(c.wheel);
  const frontU = stopFront * wc - sideFront * ws, frontW = stopFront * ws + sideFront * wc;
  // A flat rolling drag too, so a coasting car stops (fading in from a standstill).
  const flat = Math.min(1, speed) * s.mass * 0.15 / Math.max(speed, 1e-6);
  const fu = push + frontU - resist * u - s.drag * u * speed - flat * u;
  const fw = sideRear + frontW - resist * w * 0.2 - s.drag * w * speed - flat * w;
  let torque = frontW * s.front - sideRear * s.rear;
  // The slide assist: going forwards, past the angle, back towards the velocity.
  if (u > 2 && speed > 6) {
    const angle = Math.atan2(w, u);
    const past = Math.abs(angle) - s.assistFrom;
    if (past > 0) torque += Math.sign(angle) * past * s.assist * Math.min(1, speed / 12);
  }

  u += (fu / s.mass) * dt;
  w += (fw / s.mass) * dt;
  c.spin += (torque / s.inertia) * dt;
  // At a crawl, settle instead of creeping.
  if (speed < 0.5 && input.throttle < 0.05 && !c.reversing) { u *= 0.9; w *= 0.9; c.spin *= 0.9; }

  c.heading += c.spin * dt;
  // Back to the plane (the frame of the step's start: the velocity only turns by the tyres' forces).
  c.vx = u * cos - w * sin;
  c.vy = u * sin + w * cos;
  c.x += c.vx * dt;
  c.y += c.vy * dt;
  c.slip = slipRear;
}
