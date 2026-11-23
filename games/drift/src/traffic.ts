// Cars bumping into each other: each car is two circles (front and back), and
// cars that overlap are pushed apart and bounce, sharing the push by mass.
import { Car, endDrift } from './car';

/** Each circle's radius (m) and how far it is from the car's centre along its nose (m). */
export const BODY = { radius: 0.95, along: 0.85 };
/** How much of the closing speed bounces back. */
export const BOUNCE = 0.3;

const circles = (c: Car) => {
  const cos = Math.cos(c.heading), sin = Math.sin(c.heading);
  return [[c.x + cos * BODY.along, c.y + sin * BODY.along], [c.x - cos * BODY.along, c.y - sin * BODY.along]];
};

/** Pushes overlapping cars apart; returns the hardest hit's speed (m/s) for each car. */
export function collide(cars: Car[]): number[] {
  const hits = cars.map(() => 0);
  for (let i = 0; i < cars.length; i++) {
    for (let j = i + 1; j < cars.length; j++) {
      const a = cars[i], b = cars[j];
      if (Math.abs(a.x - b.x) > 5 || Math.abs(a.y - b.y) > 5) continue;
      for (const pa of circles(a)) for (const pb of circles(b)) {
        const dx = pb[0] - pa[0], dy = pb[1] - pa[1];
        const d = Math.hypot(dx, dy), min = BODY.radius * 2;
        if (d >= min || d < 1e-6) continue;
        const nx = dx / d, ny = dy / d;
        const ma = a.spec.mass, mb = b.spec.mass, sum = ma + mb;
        // Apart, by mass.
        const over = min - d;
        a.x -= nx * over * (mb / sum); a.y -= ny * over * (mb / sum);
        b.x += nx * over * (ma / sum); b.y += ny * over * (ma / sum);
        // Bounce along the line between them.
        const closing = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
        if (closing > 0) {
          const k = (1 + BOUNCE) * closing / sum;
          a.vx -= nx * k * mb; a.vy -= ny * k * mb;
          b.vx += nx * k * ma; b.vy += ny * k * ma;
          hits[i] = Math.max(hits[i], closing);
          hits[j] = Math.max(hits[j], closing);
          if (closing > 4) { endDrift(a); endDrift(b); }
        }
      }
    }
  }
  return hits;
}
