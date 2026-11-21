import { describe, expect, it, vi } from 'vitest';

// The GL enums read WebGL2RenderingContext constants when imported; Node has none.
vi.hoisted(() => {
  (globalThis as any).WebGL2RenderingContext ??= new Proxy({}, { get: () => 0 });
});
import { SceneEntity } from '../src/entities/entity';
import { Animator } from '../src/animation/animator';
import { AnimationClip } from '../src/animation/animation-clip';

/** A root with a Hips bone and an Animator holding a 1 s clip that walks Hips 2 units along X and bobs Y. */
function rig(clips: AnimationClip[]) {
  const root = new SceneEntity('Model');
  const hips = new SceneEntity('Hips');
  hips.transform.setParent(root.transform);
  const animator = new Animator();
  root.addBehaviour(animator);
  clips.forEach((c) => animator.addClip(c));
  return { hips, animator };
}
const walk = new AnimationClip('Walk', [{ target: 'Hips', property: 'translation', interpolation: 'LINEAR', times: Float32Array.from([0, 1]), values: Float32Array.from([0, 1, 0, 2, 1.5, 0]) }]);
const idle = new AnimationClip('Idle', [{ target: 'Hips', property: 'translation', interpolation: 'LINEAR', times: Float32Array.from([0, 1]), values: Float32Array.from([5, 1, 0, 5, 1, 0]) }]);

describe('Animator', () => {
  it('poses bones by name and advances time', () => {
    const { hips, animator } = rig([walk]);
    animator.play('Walk', { loop: false });
    animator.advance(0.5);
    expect(Array.from(hips.transform.localPosition)).toEqual([1, 1.25, 0]);
  });

  it('keeps the root bone in place horizontally with inPlace', () => {
    const { hips, animator } = rig([walk]);
    animator.inPlace = true;
    animator.play('Walk', { loop: false });
    animator.advance(0.5);
    expect(Array.from(hips.transform.localPosition)).toEqual([0, 1.25, 0]);
  });

  it('loops and fires onLoop, or stops and fires onFinished', () => {
    const { animator } = rig([walk]);
    let loops = 0, finished = 0;
    animator.onLoop.subscribe(() => loops++);
    animator.onFinished.subscribe(() => finished++);
    animator.play('Walk', { loop: true });
    animator.advance(2.5);
    expect(loops).toBe(1); // one wrap per step past the end
    animator.play('Walk', { loop: false });
    animator.advance(3);
    expect(finished).toBe(1);
    expect(animator.isPlaying()).toBe(false);
  });

  it('crossfades between clips', () => {
    const { hips, animator } = rig([walk, idle]);
    animator.play('Walk', { loop: false });
    animator.crossFade('Idle', 1);
    animator.advance(0.5); // walk at 0.5 (x=1), idle x=5, weight 0.5
    expect(hips.transform.localPosition[0]).toBeCloseTo(3);
    animator.advance(0.6);
    expect(hips.transform.localPosition[0]).toBeCloseTo(5);
    expect(animator.currentClip?.name).toBe('Idle');
  });
});
