// The course: nine holes of our own, par 36. Tees at the origin, holes running towards -z.
import { HoleSpec } from './course';

export const COURSE_NAME = 'Vale Omega';

export const HOLES: HoleSpec[] = [
  {
    name: 'Abertura', par: 4, tee: { x: 0, z: 0 }, pin: { x: 6, z: -305 },
    fairway: [{ x: 0, z: -25 }, { x: -3, z: -150 }, { x: 4, z: -260 }, { x: 6, z: -290 }], fairwayWidth: 34,
    green: { radius: 15, tiltX: 0.01, tiltZ: 0.015 }, relief: { height: 1.4, waves: 3, seed: 1 },
    bunkers: [{ x: -12, z: -300, rx: 6, rz: 4 }, { x: 20, z: -312, rx: 5, rz: 4 }, { x: 15, z: -215, rx: 7, rz: 4 }],
    trees: { count: 40, seed: 11 }, windMax: 3,
  },
  {
    name: 'Lago Azul', par: 3, tee: { x: 0, z: 0 }, pin: { x: -4, z: -148 },
    fairway: [{ x: 0, z: -12 }, { x: -4, z: -135 }], fairwayWidth: 26,
    green: { radius: 14, tiltX: -0.015, tiltZ: 0.01 }, relief: { height: 1.2, waves: 2, seed: 2 },
    water: [{ kind: 'lake', x: -2, z: -85, rx: 30, rz: 22 }],
    bunkers: [{ x: 10, z: -158, rx: 5, rz: 4 }, { x: -19, z: -150, rx: 4, rz: 6 }],
    trees: { count: 30, seed: 22 }, windMax: 4,
  },
  {
    name: 'Pinhal', par: 5, tee: { x: 0, z: 0 }, pin: { x: -120, z: -430 },
    fairway: [{ x: 0, z: -25 }, { x: 5, z: -180 }, { x: -25, z: -280 }, { x: -80, z: -370 }, { x: -112, z: -415 }], fairwayWidth: 32,
    green: { radius: 16, tiltX: 0.012, tiltZ: 0.01 }, relief: { height: 1.8, waves: 4, seed: 3 },
    bunkers: [{ x: -8, z: -240, rx: 8, rz: 5 }, { x: -100, z: -447, rx: 6, rz: 4 }],
    trees: { count: 70, seed: 33, at: [{ x: -30, z: -200 }, { x: -40, z: -215 }, { x: -46, z: -235 }, { x: -52, z: -255 }] }, windMax: 4,
  },
  {
    name: 'Duna', par: 4, tee: { x: 0, z: 0 }, pin: { x: 10, z: -345 },
    fairway: [{ x: 0, z: -25 }, { x: 8, z: -200 }, { x: 10, z: -330 }], fairwayWidth: 30,
    green: { radius: 15, tiltX: 0.015, tiltZ: -0.01 }, relief: { height: 2, waves: 2, seed: 4 },
    bunkers: [
      { x: -14, z: -190, rx: 9, rz: 5, rot: 0.3 }, { x: 24, z: -230, rx: 8, rz: 5 }, { x: -10, z: -275, rx: 6, rz: 6 },
      { x: -4, z: -332, rx: 6, rz: 3 }, { x: 27, z: -350, rx: 5, rz: 6 }, { x: 12, z: -367, rx: 8, rz: 3 },
    ],
    trees: { count: 25, seed: 44 }, windMax: 6,
  },
  {
    name: 'Ribeiro', par: 4, tee: { x: 0, z: 0 }, pin: { x: -10, z: -360 },
    fairway: [{ x: 0, z: -25 }, { x: -2, z: -200 }, { x: -6, z: -280 }, { x: -10, z: -345 }], fairwayWidth: 32,
    green: { radius: 15, tiltX: 0.01, tiltZ: 0.02 }, relief: { height: 1.4, waves: 3, seed: 5 },
    water: [{ kind: 'creek', line: [{ x: -70, z: -235 }, { x: -20, z: -228 }, { x: 20, z: -240 }, { x: 70, z: -232 }], width: 7 }],
    bunkers: [{ x: 6, z: -373, rx: 6, rz: 4 }],
    trees: { count: 45, seed: 55 }, windMax: 3,
  },
  {
    name: 'Ilha', par: 3, tee: { x: 0, z: 0 }, pin: { x: 0, z: -125 },
    fairway: [{ x: 0, z: -12 }, { x: 0, z: -55 }], fairwayWidth: 24,
    green: { radius: 12, tiltX: 0.01, tiltZ: 0.01 }, relief: { height: 1, waves: 2, seed: 6 },
    water: [{ kind: 'lake', x: 0, z: -112, rx: 30, rz: 38 }],
    trees: { count: 25, seed: 66 }, windMax: 3,
  },
  {
    name: 'Colina', par: 4, tee: { x: 0, z: 0 }, pin: { x: -6, z: -300 },
    fairway: [{ x: 0, z: -25 }, { x: -4, z: -150 }, { x: -6, z: -285 }], fairwayWidth: 30,
    green: { radius: 15, tiltX: 0.015, tiltZ: -0.02 }, relief: { height: 1.5, waves: 2, seed: 7, rise: 12 },
    bunkers: [{ x: 12, z: -287, rx: 5, rz: 4 }],
    trees: { count: 40, seed: 77 }, windMax: 5,
  },
  {
    name: 'Cotovelo', par: 5, tee: { x: 0, z: 0 }, pin: { x: 150, z: -420 },
    fairway: [{ x: 0, z: -25 }, { x: 0, z: -200 }, { x: 40, z: -290 }, { x: 110, z: -370 }, { x: 140, z: -405 }], fairwayWidth: 32,
    green: { radius: 16, tiltX: -0.012, tiltZ: 0.012 }, relief: { height: 1.6, waves: 3, seed: 8 },
    water: [{ kind: 'lake', x: 62, z: -215, rx: 28, rz: 40, rot: 0.4 }],
    bunkers: [{ x: 128, z: -432, rx: 6, rz: 4 }, { x: 163, z: -405, rx: 4, rz: 6 }],
    trees: { count: 60, seed: 88 }, windMax: 4,
  },
  {
    name: 'Regresso', par: 4, tee: { x: 0, z: 0 }, pin: { x: 8, z: -375 },
    fairway: [{ x: 0, z: -25 }, { x: 4, z: -220 }, { x: 8, z: -360 }], fairwayWidth: 32,
    green: { radius: 15, tiltX: 0.012, tiltZ: 0.01 }, relief: { height: 1.3, waves: 3, seed: 9 },
    water: [{ kind: 'lake', x: -32, z: -362, rx: 15, rz: 28 }],
    bunkers: [{ x: 27, z: -372, rx: 5, rz: 7 }, { x: 22, z: -345, rx: 5, rz: 3 }],
    trees: { count: 40, seed: 99 }, windMax: 5,
  },
];
