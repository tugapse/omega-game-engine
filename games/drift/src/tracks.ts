// The six tracks, two in each place, each a closed line through control
// points. The tests check each one: no bend tighter than 12 m, the walls of
// one part never near another's, and both the grip driver and a player who
// only holds the handbrake in the bends lap it without leaving the road.
import { TrackSpec } from './track';

const T = (id: string, name: string, theme: TrackSpec['theme'], width: number, points: [number, number][]): TrackSpec =>
  ({ id, name, theme, width, kerb: 1.2, runoff: 6, points });

export const TRACKS: TrackSpec[] = [
  T('avenida', 'Avenida Néon', 'city', 14, [
    [0, 0], [140, 0], [175, 10], [190, 40], [190, 100], [175, 130], [140, 140], [100, 140], [80, 160], [60, 190], [20, 200],
    [-20, 190], [-40, 160], [-45, 60], [-35, 20]]),
  T('porto', 'Porto à Noite', 'city', 14, [
    [0, 0], [100, 0], [130, -20], [170, -20], [200, 0], [210, 40], [190, 70], [150, 80], [120, 110], [120, 160], [90, 190],
    [40, 190], [10, 160], [0, 110], [-30, 80], [-30, 30]]),
  T('dunas', 'Dunas Douradas', 'desert', 15, [
    [0, 0], [160, 0], [230, 40], [250, 110], [210, 170], [140, 180], [90, 150], [40, 170], [-20, 150], [-50, 90], [-40, 30]]),
  T('canhao', 'Canhão Vermelho', 'desert', 15, [
    [0, 0], [120, -10], [180, 20], [205, 80], [175, 125], [115, 120], [75, 145], [80, 200], [40, 240], [-20, 230], [-50, 180],
    [-30, 120], [-60, 70], [-40, 20]]),
  T('pico', 'Pico Gelado', 'snow', 13, [
    [0, 0], [100, 0], [140, 30], [130, 70], [90, 80], [70, 110], [90, 150], [140, 160], [170, 200], [140, 240], [80, 240],
    [30, 210], [-10, 160], [-30, 100], [-20, 40]]),
  T('vale', 'Vale Branco', 'snow', 13, [
    [0, 0], [130, 0], [170, 30], [160, 80], [110, 100], [60, 90], [30, 120], [50, 170], [110, 180], [160, 210], [150, 260],
    [90, 280], [20, 260], [-30, 210], [-50, 140], [-40, 70], [-30, 20]]),
];


/** A track driven the other way round (same line, the start at the same place): the third race of each cup. */
export function reversed(spec: TrackSpec): TrackSpec {
  const [first, ...rest] = spec.points;
  return { ...spec, id: `${spec.id}-r`, name: `${spec.name} (ao contrário)`, points: [first, ...rest.reverse()] };
}

/** Every track there is: the six, and each the other way round. */
export const ALL_TRACKS: TrackSpec[] = [...TRACKS, ...TRACKS.map(reversed)];

export const anyTrack = (id: string) => ALL_TRACKS.find((t) => t.id === id) ?? TRACKS[0];
