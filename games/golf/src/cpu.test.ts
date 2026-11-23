/** The computer opponent: a harder computer takes fewer strokes. */
import { describe, expect, it } from 'vitest';
import { BallState, Course, hit, restingBall, stepBall } from './ball';
import { club, ClubId, CLUBS, lieFactor, MAX_PUTT, shotFor } from './clubs';
import { buildHole, seeded } from './course';
import { HOLES } from './holes';
import { HeightField } from './terrain';
import { CpuSkill, planShot } from './cpu';
import { dropPoint } from './course';
import { MAX_STROKES } from './match';

const flat = new HeightField(-150, -400, 4, 76, 106, 4).paint(() => 'fairway');
const reach = Object.fromEntries(CLUBS.map((c) => [c.id, c.id === 'putter' ? MAX_PUTT
  : (() => { const b = restingBall(flat, 0, 0); hit(b, shotFor(c, 1, 0)); while (b.phase === 'flying' || b.phase === 'rolling') stepBall(b, { ground: flat, cup: { x: 1e6, z: 1e6 } }); return -b.pos[2]; })()])) as Record<ClubId, number>;

/** Plays a hole as the computer would in the game; returns the strokes. */
function playHole(skill: CpuSkill, index: number, seed: number): number {
  const hole = buildHole(HOLES[index]);
  const course: Course = { ground: hole.ground, cup: hole.spec.pin, trees: hole.trees };
  const rnd = seeded(seed);
  let ball: BallState = restingBall(hole.ground, hole.spec.tee.x, hole.spec.tee.z);
  let strokes = 0;
  while (strokes < MAX_STROKES) {
    const from = { x: ball.pos[0], z: ball.pos[2] };
    const plan = planShot(skill, hole, course, from, reach, rnd);
    const shot = shotFor(club(plan.club), plan.swing.power, plan.aim, plan.swing.curve);
    shot.speed *= lieFactor(hole.ground.surface(from.x, from.z), plan.club);
    hit(ball, shot);
    strokes++;
    while (ball.phase === 'flying' || ball.phase === 'rolling') stepBall(ball, course);
    if (ball.phase === 'holed') break;
    if (ball.phase === 'water') { strokes++; const d = dropPoint(hole.ground, from, { x: ball.pos[0], z: ball.pos[2] }); ball = restingBall(hole.ground, d.x, d.z); }
    else if (ball.phase === 'out') { strokes++; ball = restingBall(hole.ground, from.x, from.z); }
  }
  return strokes;
}

describe('computer opponent', () => {
  it('a harder computer takes fewer strokes over the same holes', () => {
    const holes = [0, 1, 5];
    const total = (s: CpuSkill) => holes.reduce((sum, h) => sum + playHole(s, h, 7 + h) + playHole(s, h, 31 + h), 0);
    const easy = total('easy'), medium = total('medium'), hard = total('hard');
    const par = holes.reduce((s, h) => s + HOLES[h].par, 0) * 2;
    console.log('strokes over', holes.length * 2, 'holes (par', par + '): easy', easy, 'medium', medium, 'hard', hard);
    expect(hard).toBeLessThan(easy);
    expect(hard).toBeLessThanOrEqual(par + 4);
  }, 300_000);
});
