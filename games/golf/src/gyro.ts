// Optional motion control: hold a finger on the screen, swing the phone like a
// club, and let go to hit. The swing's peak rate is the power; a wrist twist
// just before letting go curves the ball. Experimental: the gesture stays the
// default and `?gyro` shows the button, as in the bowling.
import { Swing } from './swing';

export const GYRO = {
  /** Peak swing rate (deg/s about the screen's horizontal axis) for the softest and the fullest swing. */
  softSwing: 120,
  fullSwing: 900,
  /** Wrist twist (degrees about the phone's long axis) in the last moments, for curve. */
  twistWindowMs: 300,
  twistDeadZoneDeg: 10,
  twistFullDeg: 60,
};

export interface MotionSample { time: number; swing: number; twist: number }

/** Swing samples (rates in deg/s, times in ms) to a swing, or null when the phone barely moved. */
export function gyroToSwing(samples: MotionSample[]): Swing | null {
  if (samples.length < 3) return null;
  const peak = Math.max(...samples.map((s) => Math.abs(s.swing)));
  if (peak < GYRO.softSwing) return null;
  const power = Math.min(1, (peak - GYRO.softSwing) / (GYRO.fullSwing - GYRO.softSwing) * 0.95 + 0.05);
  const end = samples[samples.length - 1].time;
  let twist = 0;
  for (let i = 1; i < samples.length; i++) {
    if (samples[i].time < end - GYRO.twistWindowMs) continue;
    twist += samples[i].twist * ((samples[i].time - samples[i - 1].time) / 1000);
  }
  const amount = Math.min(1, Math.max(0, (Math.abs(twist) - GYRO.twistDeadZoneDeg) / (GYRO.twistFullDeg - GYRO.twistDeadZoneDeg)));
  // Rolling the top of the phone to the right (clockwise from behind) opens the face: a slice.
  return { power, curve: Math.sign(twist) * amount || 0 };
}

/** Reads DeviceMotion while a finger is held; {@link release} turns the swing into a {@link Swing}. */
export class GyroSwing {
  enabled = false;
  private holding = false;
  private samples: MotionSample[] = [];
  private readonly onMotion = (e: DeviceMotionEvent) => {
    if (!this.holding || !e.rotationRate) return;
    this.samples.push({ time: e.timeStamp, swing: e.rotationRate.beta ?? 0, twist: e.rotationRate.gamma ?? 0 });
  };

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

  hold(): void { this.holding = true; this.samples = []; }

  release(): Swing | null {
    this.holding = false;
    const s = gyroToSwing(this.samples);
    this.samples = [];
    return s;
  }
}
