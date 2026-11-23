// The four cars: how they drive (their specs, from the first car's) and how
// they look. Each is quicker than the one before, in its own way.
import { CAR, CarSpec } from './car';
import type { CarStyle } from './look';

export interface CarModel {
  id: string;
  name: string;
  /** A line about it, shown when choosing. */
  about: string;
  spec: CarSpec;
  style: CarStyle;
}

export const CARS: CarModel[] = [
  {
    id: 'bolinha', name: 'Bolinha', about: 'Leve e dócil: o primeiro carro.',
    spec: CAR,
    style: { paint: [0.95, 0.25, 0.45], stripe: [1, 0.95, 0.85], spoiler: true, wide: 1, long: 1 },
  },
  {
    id: 'faisca', name: 'Faísca', about: 'Mais potência e arranque rápido.',
    spec: { ...CAR, mass: 860, power: 140000, drive: 12000, top: 35.5 },
    style: { paint: [1, 0.78, 0.15], stripe: [0.12, 0.12, 0.16], spoiler: false, wide: 0.97, long: 0.95 },
  },
  {
    id: 'trovao', name: 'Trovão', about: 'Pesado e muito rápido nas retas.',
    spec: { ...CAR, mass: 1000, inertia: 1250, power: 165000, drive: 13000, top: 38, gripFront: 1.05, gripRear: 1.15, brake: 12500 },
    style: { paint: [0.2, 0.5, 1], stripe: [1, 1, 1], spoiler: true, wide: 1.06, long: 1.05 },
  },
  {
    id: 'cometa', name: 'Cometa', about: 'O mais rápido, e agarra-se à estrada.',
    spec: { ...CAR, mass: 920, power: 185000, drive: 13500, top: 40, gripFront: 1.12, gripRear: 1.22, brake: 13000, steerHigh: 0.25 },
    style: { paint: [0.18, 0.9, 0.7], stripe: [0.1, 0.1, 0.14], spoiler: true, wide: 1.04, long: 1.02 },
  },
];

export const carById = (id: string) => CARS.find((c) => c.id === id) ?? CARS[0];
