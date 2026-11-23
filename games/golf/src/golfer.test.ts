/** The golfer: feet on the ground, the club back high at the top and down at the ball at impact. */
import { vec3 } from 'gl-matrix';
import { describe, expect, it, vi } from 'vitest';

vi.hoisted(() => {
  (globalThis as any).WebGL2RenderingContext ??= new Proxy({}, { get: () => 0 });
});
import { buildGolfer, IMPACT_TIME, TOP_TIME } from './golfer';

function at(clip: string, t: number) {
  const rig = buildGolfer();
  rig.animator.initialize?.();
  rig.animator.play(clip, { loop: false });
  rig.animator.time = t;
  rig.root.transform.updateMatrices();
  const p = (name: string) => vec3.clone(rig.bones.get(name)!.transform.worldPosition);
  return { rig, head: vec3.clone(rig.head.transform.worldPosition), footR: p('FootR'), footL: p('FootL'), handL: p('HandL') };
}

describe('golfer', () => {
  it('keeps both feet on the ground through the swing', () => {
    for (let t = 0; t <= 2.2; t += 0.1) {
      const s = at('Swing', t);
      expect(Math.min(s.footR[1], s.footL[1])).toBeGreaterThan(0.03);
      expect(Math.min(s.footR[1], s.footL[1])).toBeLessThan(0.2);
    }
  });
  it('brings the club head down to the ground in front at address and impact', () => {
    for (const t of [0, IMPACT_TIME]) {
      const s = at('Swing', t);
      expect(s.head[1]).toBeLessThan(0.25);
      expect(s.head[2]).toBeLessThan(-0.3); // in front of the feet
    }
  });
  it('takes the club up high at the top of the backswing', () => {
    expect(at('Swing', TOP_TIME).head[1]).toBeGreaterThan(1.3);
  });
});
