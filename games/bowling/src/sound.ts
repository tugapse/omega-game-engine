// Sounds, synthesised with Web Audio (no sound files): the ball rolling, pins
// clacking, the ball's thud, the pinsetter, and a chime for strikes and spares.
import { AudioEngine } from '../../../src';

/** Loudness 0..1 from a contact force in newtons (Rapier, per step), on a log scale. */
export function forceToGain(force: number, threshold = 20): number {
  if (force <= threshold) return 0;
  return Math.min(1, Math.log10(force / threshold) / 2.5);
}

export class BowlingSound {
  private readonly audio: AudioEngine;
  private readonly ctx: AudioContext;
  private readonly out: GainNode;
  private readonly noise: AudioBuffer;
  private rollGain: GainNode | null = null;
  private rollFilter: BiquadFilterNode | null = null;
  private recent = 0;
  private recentTime = 0;
  muted = false;

  constructor() {
    this.audio = new AudioEngine();
    this.ctx = this.audio.getContext();
    this.out = this.ctx.createGain();
    this.out.gain.value = 0.8;
    this.out.connect(this.audio.getSfxBus());
    // A little room: some of the sound goes through the engine's reverb.
    const send = this.ctx.createGain();
    send.gain.value = 0.25;
    this.out.connect(send);
    send.connect(this.audio.getReverbBus());
    this.noise = this.ctx.createBuffer(1, this.ctx.sampleRate * 2, this.ctx.sampleRate);
    const data = this.noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }

  /** Call from a user gesture: browsers start audio suspended. */
  unlock(): void {
    void this.audio.initialize().then(() => this.startRoll());
  }

  get running(): boolean {
    return this.ctx.state === 'running';
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    this.out.gain.setTargetAtTime(muted ? 0 : 0.8, this.ctx.currentTime, 0.05);
  }

  /** The rolling rumble: a looped noise through a low-pass, silent until {@link roll} turns it up. */
  private startRoll(): void {
    if (this.rollGain) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;
    this.rollFilter = this.ctx.createBiquadFilter();
    this.rollFilter.type = 'lowpass';
    this.rollFilter.frequency.value = 300;
    this.rollFilter.Q.value = 2;
    this.rollGain = this.ctx.createGain();
    this.rollGain.gain.value = 0;
    src.connect(this.rollFilter).connect(this.rollGain).connect(this.out);
    src.start();
  }

  /**
   * The ball rolling at `speed` m/s; 0 when it is off the lane or still.
   * `hollow` is for the gutter (lighter, higher).
   */
  roll(speed: number, hollow = false): void {
    if (!this.rollGain || !this.rollFilter) return;
    const t = this.ctx.currentTime;
    this.rollGain.gain.setTargetAtTime(Math.min(1, speed / 9) * 0.9, t, 0.05);
    this.rollFilter.frequency.setTargetAtTime((hollow ? 700 : 180) + speed * (hollow ? 60 : 35), t, 0.05);
  }

  /** At most a few hits at once, so a strike is loud but not a wall of noise. */
  private allow(): boolean {
    const t = this.ctx.currentTime;
    if (t - this.recentTime > 0.03) { this.recent = 0; this.recentTime = t; }
    return ++this.recent <= 4;
  }

  /** A pin hit (by the ball, another pin or the deck): a woody clack. */
  clack(gain: number, pitch = 1): void {
    if (!this.running || gain <= 0.02 || !this.allow()) return;
    const t = this.ctx.currentTime;
    const p = pitch * (0.9 + Math.random() * 0.2);
    // The click: a short burst of band-passed noise.
    this.burst(t, 0.012, 2600 * p, 4, gain * 0.9);
    // The body: a few decaying partials of a hollow maple pin.
    for (const [f, a, d] of [[820, 0.5, 0.09], [1630, 0.35, 0.06], [2950, 0.2, 0.04]]) {
      this.tone(t, f * p, a * gain, d);
    }
  }

  /** The heavy ball hitting something: a low thud. */
  thud(gain: number): void {
    if (!this.running || gain <= 0.02 || !this.allow()) return;
    const t = this.ctx.currentTime;
    this.burst(t, 0.04, 400, 1, gain * 0.8);
    this.tone(t, 95, gain * 0.7, 0.18);
  }

  /** The pinsetter: a motor whirr for `seconds`. */
  pinsetter(seconds: number): void {
    if (!this.running) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(55, t);
    osc.frequency.linearRampToValueAtTime(70, t + seconds * 0.5);
    osc.frequency.linearRampToValueAtTime(50, t + seconds);
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.12, t + 0.15);
    g.gain.setValueAtTime(0.12, t + seconds - 0.2);
    g.gain.linearRampToValueAtTime(0, t + seconds);
    osc.connect(filter).connect(g).connect(this.out);
    osc.start(t);
    osc.stop(t + seconds + 0.05);
  }

  /** A short rising chime: three notes for a strike, two for a spare. */
  chime(strike: boolean): void {
    if (!this.running) return;
    const t = this.ctx.currentTime;
    const notes = strike ? [523.25, 659.25, 783.99] : [523.25, 659.25];
    notes.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = f;
      const g = this.ctx.createGain();
      const s = t + i * 0.09;
      g.gain.setValueAtTime(0, s);
      g.gain.linearRampToValueAtTime(0.18, s + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, s + 0.6);
      osc.connect(g).connect(this.out);
      osc.start(s);
      osc.stop(s + 0.65);
    });
  }

  private burst(t: number, length: number, freq: number, q: number, gain: number): void {
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = freq;
    filter.Q.value = q;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + length);
    src.connect(filter).connect(g).connect(this.out);
    src.start(t, Math.random() * 1.5);
    src.stop(t + length + 0.01);
  }

  private tone(t: number, freq: number, gain: number, decay: number): void {
    const osc = this.ctx.createOscillator();
    osc.frequency.value = freq;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + decay);
    osc.connect(g).connect(this.out);
    osc.start(t);
    osc.stop(t + decay + 0.01);
  }
}
