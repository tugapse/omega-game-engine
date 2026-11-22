// Optional motion control: hold a finger on the screen, swing the phone like
// the bowling arm, and let go to bowl. Experimental; the swipe stays the default.
import { ThrowParams } from './lane';
import { THROW } from './controls';

export const GYRO = {
  /** Peak swing rate (deg/s about the screen's horizontal axis) for the slowest and fastest throw. */
  slowSwing: 150,
  fastSwing: 800,
  /** Wrist twist (degrees about the phone's long axis) in the last moments before release, for spin. */
  twistWindowMs: 300,
  twistDeadZoneDeg: 10,
  twistFullDeg: 60,
};

interface Sample { time: number; swing: number; twist: number }

/** Reads DeviceMotion while a finger is held; {@link release} turns the swing into a throw. */
export class GyroThrow {
  enabled = false;
  private holding = false;
  private samples: Sample[] = [];
  private readonly onMotion = (e: DeviceMotionEvent) => {
    if (!this.holding || !e.rotationRate) return;
    // beta: about the screen's x axis (the arm swing, phone upright);
    // gamma: about its y (long) axis (the wrist twist).
    this.samples.push({ time: e.timeStamp, swing: e.rotationRate.beta ?? 0, twist: e.rotationRate.gamma ?? 0 });
  };

  /** True where the device has motion sensors (still needs {@link enable}). */
  static get available(): boolean {
    return typeof window !== 'undefined' && 'DeviceMotionEvent' in window;
  }

  /** Asks for permission where needed (iOS, from a tap) and starts listening. */
  async enable(): Promise<boolean> {
    const request = (DeviceMotionEvent as any).requestPermission as (() => Promise<string>) | undefined;
    if (request && (await request()) !== 'granted') return false;
    window.addEventListener('devicemotion', this.onMotion);
    this.enabled = true;
    return true;
  }

  disable(): void {
    window.removeEventListener('devicemotion', this.onMotion);
    this.enabled = false;
    this.holding = false;
  }

  /** A finger went down: start recording the swing. */
  hold(): void {
    this.holding = true;
    this.samples = [];
  }

  /** The finger lifted: the throw, or null if the phone barely moved. */
  release(): ThrowParams | null {
    this.holding = false;
    const t = gyroToThrow(this.samples);
    this.samples = [];
    return t;
  }
}

/** Swing samples (rates in deg/s, times in ms) to a throw; pure, for tests. */
export function gyroToThrow(samples: Sample[]): ThrowParams | null {
  if (samples.length < 3) return null;
  const peak = Math.max(...samples.map((s) => Math.abs(s.swing)));
  if (peak < GYRO.slowSwing) return null;
  const f = Math.min(1, (peak - GYRO.slowSwing) / (GYRO.fastSwing - GYRO.slowSwing));
  const speed = THROW.minSpeed + f * (THROW.maxSpeed - THROW.minSpeed);
  // Twist: integrate the twist rate over the last moments before release.
  const end = samples[samples.length - 1].time;
  let twist = 0;
  for (let i = 1; i < samples.length; i++) {
    if (samples[i].time < end - GYRO.twistWindowMs) continue;
    twist += samples[i].twist * ((samples[i].time - samples[i - 1].time) / 1000);
  }
  const amount = Math.min(1, Math.max(0, (Math.abs(twist) - GYRO.twistDeadZoneDeg) / (GYRO.twistFullDeg - GYRO.twistDeadZoneDeg)));
  // Turning the top of the phone to the left (counter-clockwise from behind) hooks left.
  const spin = Math.sign(twist) * amount * THROW.maxSpin;
  return { speed, angle: 0, spin: spin || 0 };
}
