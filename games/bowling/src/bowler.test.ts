import { describe, expect, it, vi } from 'vitest';

vi.hoisted(() => {
  (globalThis as any).WebGL2RenderingContext ??= new Proxy({}, { get: () => 0 });
});
import { buildBowler, RELEASE_TIME } from './bowler';

/** Poses the rig at `t` seconds of a clip and returns the world position of a joint. */
function poseAt(rig: ReturnType<typeof buildBowler>, t: number) {
  rig.animator.time = t;
  rig.root.transform.updateMatrices();
  return (name: string) => (name === 'ball' ? rig.ball : rig.bones.get(name)!).transform.worldPosition;
}

describe('bowler', () => {
  it('has an idle loop and a throw', () => {
    const rig = buildBowler();
    expect(rig.animator.clipList.map((c) => c.name)).toEqual(['Idle', 'Throw']);
    expect(rig.animator.getClip('Throw')!.duration).toBeGreaterThan(RELEASE_TIME);
  });

  it('keeps both feet on or above the floor through the throw', () => {
    const rig = buildBowler();
    rig.animator.play('Throw');
    for (let t = 0; t <= 2.1; t += 1 / 30) {
      const at = poseAt(rig, t);
      // The ankle joint; the sole is 6 cm below it.
      for (const foot of ['FootL', 'FootR']) expect(at(foot)[1]).toBeGreaterThan(0.055);
    }
  });

  it('lays the ball down low and ahead of the slide foot at the release', () => {
    const rig = buildBowler();
    rig.animator.play('Throw');
    const at = poseAt(rig, RELEASE_TIME);
    const ball = at('ball');
    expect(ball[1]).toBeLessThan(0.25);
    expect(ball[1]).toBeGreaterThan(0.109); // not through the lane
    expect(ball[2]).toBeLessThan(at('FootL')[2]);
    // Then the arm follows through high.
    expect(poseAt(rig, 1.65)('ball')[1]).toBeGreaterThan(1.2);
  });
});
