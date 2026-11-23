// The championship: three cups, one in each place, each of three races (its
// two tracks, then the first the other way round) against the same five
// rivals. Points by place, 10 for a win down to 3 for sixth; the most points
// after the three races takes the cup. Each cup's rivals are quicker and drive
// better cars. No engine, so it is tested in Node.
import { ThemeName } from './themes';
import { reversed, TRACKS } from './tracks';

export interface Cup {
  theme: ThemeName;
  name: string;
  /** The tracks' ids, in order. */
  races: string[];
  /** The rivals' pace (0 to 1), from the slowest, and the cars they drive (ids from CARS). */
  pace: [number, number];
  cars: string[];
}

const ids = (theme: ThemeName) => {
  const [a, b] = TRACKS.filter((t) => t.theme === theme);
  return [a.id, b.id, reversed(a).id];
};

export const CUPS: Cup[] = [
  { theme: 'city', name: 'Taça da Cidade', races: ids('city'), pace: [0, 0.3], cars: ['bolinha', 'bolinha', 'bolinha', 'bolinha', 'bolinha'] },
  { theme: 'desert', name: 'Taça do Deserto', races: ids('desert'), pace: [0.2, 0.6], cars: ['bolinha', 'faisca', 'bolinha', 'faisca', 'trovao'] },
  { theme: 'snow', name: 'Taça da Montanha', races: ids('snow'), pace: [0.45, 0.85], cars: ['faisca', 'trovao', 'faisca', 'trovao', 'cometa'] },
];

export const CUP_ORDER: ThemeName[] = CUPS.map((c) => c.theme);

/** Points for each place, first to sixth. */
export const POINTS = [10, 8, 6, 5, 4, 3];

/** The five rivals' names. */
export const RIVALS = ['Duarte', 'Inês', 'Tiago', 'Marta', 'Rui'];

export interface Championship {
  cup: number;
  /** Races done, and the points of the player (0) and the five rivals (1 to 5). */
  race: number;
  points: number[];
  /** Each race's finishing order (racer indices). */
  results: number[][];
}

export const makeChampionship = (cup: number): Championship => ({ cup, race: 0, points: [0, 0, 0, 0, 0, 0], results: [] });

/** The rivals' paces for a cup, spread from its slowest to its quickest. */
export function rivalPaces(cup: Cup): number[] {
  return RIVALS.map((_, i) => cup.pace[0] + ((cup.pace[1] - cup.pace[0]) * i) / (RIVALS.length - 1));
}

/** Adds a race's finishing order (racer indices, the winner first). */
export function addResult(c: Championship, order: number[]): void {
  order.forEach((racer, place) => { c.points[racer] += POINTS[place] ?? 0; });
  c.results.push(order.slice());
  c.race++;
}

export const cupOver = (c: Championship) => c.race >= CUPS[c.cup].races.length;

/** The racers by points (ties: the better last race). */
export function table(c: Championship): number[] {
  const last = c.results[c.results.length - 1] ?? [];
  return c.points.map((_, i) => i).sort((a, b) => c.points[b] - c.points[a] || last.indexOf(a) - last.indexOf(b));
}

/** The player's place in the table (1 to 6). */
export const playerPlace = (c: Championship) => table(c).indexOf(0) + 1;
