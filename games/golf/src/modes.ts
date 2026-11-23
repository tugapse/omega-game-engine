// The other games: "nearest the pin" (one shot at each of three greens, the
// metres left count) and the range (ten shots at three targets, points).
import { HoleSpec } from './course';

/** A nearest-the-pin challenge: which hole, and where the shot is played from (the tee when absent). */
export interface Challenge { hole: number; from?: { x: number; z: number } }

export const NEAREST: Challenge[] = [
  { hole: 1 }, // Lago Azul, over the lake
  { hole: 5 }, // Ilha, the island green
  { hole: 0, from: { x: 2, z: -195 } }, // Abertura, an approach of about 110 m
];

/** Metres counted for a ball in water or out of bounds. */
export const MISS_METRES = 30;

/** The range: shots per player, and the three targets on hole 1's fairway (distance from the tee). */
export const RANGE_SHOTS = 10;
export const RANGE_DISTANCES = [70, 130, 190];
/** Rings around a target: within this many metres scores these points. */
export const RINGS: { radius: number; points: number }[] = [{ radius: 3, points: 50 }, { radius: 8, points: 25 }, { radius: 15, points: 10 }];

/** The targets: points on the fairway's centre line at the range distances from the tee. */
export function rangeTargets(spec: HoleSpec): { x: number; z: number }[] {
  const line = [spec.tee, ...spec.fairway];
  return RANGE_DISTANCES.map((d) => {
    let left = d;
    for (let i = 1; i < line.length; i++) {
      const a = line[i - 1], b = line[i], len = Math.hypot(b.x - a.x, b.z - a.z);
      if (left <= len) return { x: a.x + ((b.x - a.x) * left) / len, z: a.z + ((b.z - a.z) * left) / len };
      left -= len;
    }
    return line[line.length - 1];
  });
}

/** Points for a ball resting at (x, z): the best ring of the nearest target. */
export function rangePoints(targets: { x: number; z: number }[], x: number, z: number): number {
  const d = Math.min(...targets.map((t) => Math.hypot(t.x - x, t.z - z)));
  return RINGS.find((r) => d <= r.radius)?.points ?? 0;
}
