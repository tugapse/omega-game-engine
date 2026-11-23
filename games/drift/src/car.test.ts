import { describe, expect, it } from 'vitest';
import { CarInput, driftAngle, forwardSpeed, makeCar, speedOf, STEP, stepCar } from './car';

const run = (input: Partial<CarInput>, seconds: number, car = makeCar(0, 0, 0)) => {
  const i: CarInput = { throttle: 0, brake: 0, steer: 0, handbrake: false, ...input };
  for (let t = 0; t < seconds; t += STEP) stepCar(car, i);
  return car;
};
const deg = (r: number) => (r * 180) / Math.PI;

describe('car', () => {
  it('reaches 100 km/h in about 6 s and tops out near 34 m/s', () => {
    const car = makeCar(0, 0, 0);
    let t = 0;
    while (speedOf(car) < 100 / 3.6) { stepCar(car, { throttle: 1, brake: 0, steer: 0, handbrake: false }); t += STEP; }
    expect(t).toBeGreaterThan(4.5);
    expect(t).toBeLessThan(7);
    run({ throttle: 1 }, 30, car);
    expect(speedOf(car)).toBeGreaterThan(31);
    expect(speedOf(car)).toBeLessThan(34.5);
  });

  it('drives straight along its heading', () => {
    const car = run({ throttle: 1 }, 3, makeCar(0, 0, Math.PI / 2));
    expect(Math.abs(car.x)).toBeLessThan(1e-6);
    expect(car.y).toBeGreaterThan(10);
  });

  it('steers right with a positive steer and left with a negative one', () => {
    const right = makeCar(0, 0, 0); right.vx = 15;
    run({ throttle: 0.4, steer: 0.5 }, 1, right);
    expect(right.heading).toBeLessThan(-0.2);
    const left = makeCar(0, 0, 0); left.vx = 15;
    run({ throttle: 0.4, steer: -0.5 }, 1, left);
    expect(left.heading).toBeGreaterThan(0.2);
  });

  it('holds a corner without sliding on part throttle', () => {
    const car = makeCar(0, 0, 0); car.vx = 22;
    let most = 0;
    for (let t = 0; t < 3; t += STEP) { stepCar(car, { throttle: 0.5, brake: 0, steer: 1, handbrake: false }); most = Math.max(most, Math.abs(deg(driftAngle(car)))); }
    expect(most).toBeLessThan(12);
  });

  it('kicks the tail out with the handbrake, and the assist stops a spin', () => {
    const car = makeCar(0, 0, 0); car.vx = 22;
    let most = 0;
    for (let t = 0; t < 3; t += STEP) {
      stepCar(car, { throttle: 0.7, brake: 0, steer: 1, handbrake: t < 0.5 });
      most = Math.max(most, Math.abs(deg(driftAngle(car))));
    }
    expect(most).toBeGreaterThan(25);
    expect(most).toBeLessThan(75);
  });

  it('power-slides with full throttle and full lock', () => {
    const car = makeCar(0, 0, 0); car.vx = 22;
    let most = 0;
    for (let t = 0; t < 3; t += STEP) { stepCar(car, { throttle: 1, brake: 0, steer: 1, handbrake: false }); most = Math.max(most, Math.abs(deg(driftAngle(car)))); }
    expect(most).toBeGreaterThan(20);
  });

  it('straightens out of a slide when the steering is let go', () => {
    const car = makeCar(0, 0, 0); car.vx = 22;
    run({ throttle: 0.7, steer: 1, handbrake: true }, 0.6, car);
    expect(Math.abs(deg(driftAngle(car)))).toBeGreaterThan(15);
    run({ throttle: 0.3 }, 2, car);
    expect(Math.abs(deg(driftAngle(car)))).toBeLessThan(5);
  });

  it('brakes to a stop, then reverses with the brake held', () => {
    const car = makeCar(0, 0, 0); car.vx = 25;
    let t = 0;
    while (forwardSpeed(car) > 0.3 && t < 10) { stepCar(car, { throttle: 0, brake: 1, steer: 0, handbrake: false }); t += STEP; }
    expect(t).toBeLessThan(3.5);
    run({ brake: 1 }, 2, car);
    expect(forwardSpeed(car)).toBeLessThan(-2);
    expect(car.reversing).toBe(true);
    run({ throttle: 1 }, 2, car);
    expect(car.reversing).toBe(false);
    expect(forwardSpeed(car)).toBeGreaterThan(0);
  });

  it('comes to rest on its own', () => {
    const car = makeCar(0, 0, 0); car.vx = 3;
    run({}, 20, car);
    expect(speedOf(car)).toBeLessThan(0.05);
  });

  it('slides more on grass', () => {
    const road = makeCar(0, 0, 0); road.vx = 18;
    const grass = makeCar(0, 0, 0); grass.vx = 18; grass.surfaceGrip = 0.6; grass.surfaceDrag = 260;
    let a = 0, b = 0;
    for (let t = 0; t < 1.5; t += STEP) {
      const i = { throttle: 0.6, brake: 0, steer: 1, handbrake: false };
      stepCar(road, i); stepCar(grass, i);
      a = Math.max(a, Math.abs(driftAngle(road))); b = Math.max(b, Math.abs(driftAngle(grass)));
    }
    expect(b).toBeGreaterThan(a);
    expect(speedOf(grass)).toBeLessThan(speedOf(road));
  });
});
