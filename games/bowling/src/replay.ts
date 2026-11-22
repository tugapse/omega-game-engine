// Records the ball and pins every frame of a roll and plays them back (slow motion replays).
import { quat, vec3 } from 'gl-matrix';
import { SceneEntity } from '../../../src';

/** One thing that happened during the roll, replayed at its time (a sound). */
export interface ReplayEvent { time: number; kind: string; gain: number }

export class ReplayRecorder {
  /** Seconds since the roll started, one per frame. */
  readonly times: number[] = [];
  /** Per frame: position (3) and rotation (4) of each entity. */
  readonly frames: Float32Array[] = [];
  readonly events: ReplayEvent[] = [];
  /** When the ball first touched a pin, or null. */
  impactTime: number | null = null;

  constructor(readonly entities: SceneEntity[]) {}

  get duration(): number {
    return this.times.length ? this.times[this.times.length - 1] : 0;
  }

  clear(): void {
    this.times.length = 0;
    this.frames.length = 0;
    this.events.length = 0;
    this.impactTime = null;
  }

  record(time: number): void {
    const frame = new Float32Array(this.entities.length * 7);
    this.entities.forEach((e, i) => {
      frame.set(e.transform.worldPosition, i * 7);
      frame.set(e.transform.worldRotationQuat, i * 7 + 3);
    });
    this.times.push(time);
    this.frames.push(frame);
  }

  event(time: number, kind: string, gain: number): void {
    this.events.push({ time, kind, gain });
  }

  /** Puts every entity where it was at `time` (interpolated between frames). */
  apply(time: number): void {
    const n = this.times.length;
    if (!n) return;
    let i = 1;
    while (i < n - 1 && this.times[i] < time) i++;
    const t0 = this.times[i - 1] ?? 0, t1 = this.times[Math.min(i, n - 1)];
    const k = t1 > t0 ? Math.min(1, Math.max(0, (time - t0) / (t1 - t0))) : 1;
    const a = this.frames[i - 1] ?? this.frames[0], b = this.frames[Math.min(i, n - 1)];
    const p = vec3.create(), pa = vec3.create(), pb = vec3.create();
    const r = quat.create(), ra = quat.create(), rb = quat.create();
    this.entities.forEach((e, j) => {
      const o = j * 7;
      vec3.set(pa, a[o], a[o + 1], a[o + 2]);
      vec3.set(pb, b[o], b[o + 1], b[o + 2]);
      quat.set(ra, a[o + 3], a[o + 4], a[o + 5], a[o + 6]);
      quat.set(rb, b[o + 3], b[o + 4], b[o + 5], b[o + 6]);
      vec3.lerp(p, pa, pb, k);
      quat.slerp(r, ra, rb, k);
      e.transform.setLocalPosition(p[0], p[1], p[2]);
      e.transform.setLocalRotationQuat(r);
    });
  }
}
