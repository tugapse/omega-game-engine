import { describe, expect, it, vi } from 'vitest';

vi.hoisted(() => {
  (globalThis as any).WebGL2RenderingContext ??= new Proxy({}, { get: () => 0 });
});
import { buildBit, clipFor, LOOPING } from './bit';

function poseAt(rig: ReturnType<typeof buildBit>, clip: string, t: number) {
  rig.animator.play(clip);
  rig.animator.time = t;
  rig.root.transform.updateMatrices();
  return (name: string) => Array.from(rig.bones.get(name)!.transform.worldPosition);
}

describe('Bit', () => {
  it('has its six clips', () => {
    const rig = buildBit();
    expect(rig.animator.clipList.map((c) => c.name)).toEqual(['Idle', 'Run', 'Jump', 'Fall', 'Die', 'Victory']);
  });

  it('looping clips end where they start, so they loop without a jump', () => {
    const rig = buildBit();
    for (const clip of rig.animator.clipList) {
      if (!LOOPING[clip.name as keyof typeof LOOPING]) continue;
      const start = poseAt(rig, clip.name, 0), end = poseAt(rig, clip.name, clip.duration);
      for (const bone of ['HandR', 'FootL', 'Antenna']) {
        start(bone).forEach((v, i) => expect(v).toBeCloseTo(end(bone)[i], 3));
      }
    }
  });

  it('keeps the feet at the ground when running, and swings them forward and back', () => {
    const rig = buildBit();
    const clip = rig.animator.getClip('Run')!;
    let front = -Infinity, back = Infinity;
    for (let t = 0; t <= clip.duration; t += 1 / 30) {
      const at = poseAt(rig, 'Run', t);
      for (const foot of ['FootR', 'FootL']) {
        expect(at(foot)[1]).toBeGreaterThan(-0.02);
        expect(at(foot)[1]).toBeLessThan(0.2);
        front = Math.max(front, at(foot)[2]);
        back = Math.min(back, at(foot)[2]);
      }
    }
    expect(front).toBeGreaterThan(0.08);
    expect(back).toBeLessThan(-0.08);
  });

  it('raises its arms when jumping', () => {
    const rig = buildBit();
    const at = poseAt(rig, 'Jump', 0.15);
    expect(at('HandR')[1]).toBeGreaterThan(at('ArmR')[1]);
    expect(at('HandL')[1]).toBeGreaterThan(at('ArmL')[1]);
  });

  it('picks the clip from what the hero is doing', () => {
    const base = { onGround: true, vx: 0, vy: 0, dead: false, won: false };
    expect(clipFor(base).clip).toBe('Idle');
    expect(clipFor({ ...base, vx: 9.5 })).toEqual({ clip: 'Run', speed: 9.5 / 6 });
    expect(clipFor({ ...base, onGround: false, vy: 5 }).clip).toBe('Jump');
    expect(clipFor({ ...base, onGround: false, vy: -5 }).clip).toBe('Fall');
    expect(clipFor({ ...base, dead: true }).clip).toBe('Die');
    expect(clipFor({ ...base, won: true }).clip).toBe('Victory');
  });
});
