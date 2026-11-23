// The sounds, synthesised with Web Audio (no sound files): the engine, which
// follows the revs through five gears, the tyres squealing in a slide, and the
// effects (the start lights, laps, a record, drift points banked or lost, the
// turbo, knocks, the finish, the menus). Plain Web Audio, as in the other games.
import { Car, forwardSpeed } from './car';

export type Sfx =
  | 'click' | 'beep' | 'go' | 'lap' | 'record' | 'bank' | 'link' | 'lost' | 'turbo' | 'bump' | 'crash' | 'finish' | 'win';

/** The gears: where each tops out, as a share of the top speed. */
const GEARS = [0.2, 0.38, 0.56, 0.76, 1];

/** The revs (0 to 1, idle to the limiter) at a share of the top speed, through the gears. */
export function revs(share: number): number {
  const s = Math.max(0, Math.min(1.1, share));
  let low = 0;
  for (const top of GEARS) {
    if (s <= top) return 0.18 + 0.82 * ((s - low) / (top - low));
    low = top;
  }
  return 1;
}

export class Sound {
  private ctx: AudioContext | null = null;
  private out: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private motor: { a: OscillatorNode; b: OscillatorNode; filter: BiquadFilterNode; gain: GainNode } | null = null;
  private squeal: { src: AudioBufferSourceNode; filter: BiquadFilterNode; gain: GainNode } | null = null;
  muted = false;

  /** Call from a user gesture: browsers start audio suspended. */
  unlock(): void {
    if (!this.ctx) {
      const Ctx = window.AudioContext ?? (window as any).webkitAudioContext;
      if (!Ctx) return;
      this.ctx = new Ctx();
      this.out = this.ctx.createGain();
      this.out.gain.value = this.muted ? 0 : 0.5;
      this.out.connect(this.ctx.destination);
      this.noise = this.ctx.createBuffer(1, this.ctx.sampleRate, this.ctx.sampleRate);
      const d = this.noise.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
  }

  /** The audio context once unlocked (the music plays through it too). */
  context(): AudioContext | null { return this.ctx; }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.out && this.ctx) this.out.gain.setTargetAtTime(muted ? 0 : 0.5, this.ctx.currentTime, 0.02);
  }

  private parts(): { ctx: AudioContext; out: GainNode; noise: AudioBuffer } | null {
    if (!this.ctx || !this.out || !this.noise || this.muted || this.ctx.state !== 'running') return null;
    return { ctx: this.ctx, out: this.out, noise: this.noise };
  }

  /**
   * The engine and the tyres, once a frame: the revs from the car's speed and
   * the gear, louder on the throttle; the squeal by how hard it slides (0 to 1).
   * `on` false fades both out (the menus).
   */
  engine(car: Car, slide: number, on: boolean): void {
    const a = this.parts();
    if (!a) {
      if (this.motor && this.ctx) this.motor.gain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
      return;
    }
    const { ctx, out, noise } = a;
    if (!this.motor) {
      const osc = (type: OscillatorType) => { const o = ctx.createOscillator(); o.type = type; return o; };
      const m = { a: osc('sawtooth'), b: osc('square'), filter: ctx.createBiquadFilter(), gain: ctx.createGain() };
      m.filter.type = 'lowpass'; m.filter.Q.value = 3;
      const sub = ctx.createGain(); sub.gain.value = 0.5;
      m.a.connect(m.filter); m.b.connect(sub).connect(m.filter);
      m.filter.connect(m.gain).connect(out);
      m.gain.gain.value = 0;
      m.a.start(); m.b.start();
      this.motor = m;
      const src = ctx.createBufferSource(); src.buffer = noise; src.loop = true;
      const filter = ctx.createBiquadFilter(); filter.type = 'bandpass'; filter.frequency.value = 1800; filter.Q.value = 6;
      const gain = ctx.createGain(); gain.gain.value = 0;
      src.connect(filter).connect(gain).connect(out);
      src.start();
      this.squeal = { src, filter, gain };
    }
    const t = ctx.currentTime;
    const share = Math.abs(forwardSpeed(car)) / car.spec.top;
    const r = revs(share);
    const f = 38 + r * 120;
    this.motor.a.frequency.setTargetAtTime(f, t, 0.05);
    this.motor.b.frequency.setTargetAtTime(f / 2, t, 0.05);
    this.motor.filter.frequency.setTargetAtTime(400 + r * 1800 + (car.boost > 0 ? 900 : 0), t, 0.05);
    this.motor.gain.gain.setTargetAtTime(on ? 0.05 + r * 0.06 : 0, t, 0.08);
    const sq = this.squeal!;
    sq.gain.gain.setTargetAtTime(on ? slide * 0.07 : 0, t, 0.06);
    sq.filter.frequency.setTargetAtTime(1500 + slide * 900 + Math.sin(t * 13) * 120, t, 0.05);
  }

  /** A tone from `f0` to `f1` Hz over `length` s, with a quick attack and a fall. */
  private tone(type: OscillatorType, f0: number, f1: number, gain: number, length: number, delay = 0): void {
    const a = this.parts();
    if (!a) return;
    const { ctx, out } = a;
    const t = ctx.currentTime + delay;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + length);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + Math.min(0.01, length / 4));
    g.gain.exponentialRampToValueAtTime(0.0001, t + length);
    o.connect(g).connect(out);
    o.start(t);
    o.stop(t + length + 0.02);
  }

  /** A burst of filtered noise. */
  private hiss(type: BiquadFilterType, f0: number, f1: number, gain: number, length: number, delay = 0): void {
    const a = this.parts();
    if (!a) return;
    const { ctx, out, noise } = a;
    const t = ctx.currentTime + delay;
    const src = ctx.createBufferSource();
    src.buffer = noise;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.setValueAtTime(f0, t);
    f.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + length);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + length);
    src.connect(f).connect(g).connect(out);
    src.start(t, Math.random() * 0.5);
    src.stop(t + length + 0.02);
  }

  /** Notes in a row (MIDI), each `gap` s apart. */
  private run(type: OscillatorType, notes: number[], gap: number, gain: number, length = gap * 1.6): void {
    notes.forEach((m, i) => { const f = 440 * 2 ** ((m - 69) / 12); this.tone(type, f, f * 1.001, gain, length, i * gap); });
  }

  play(s: Sfx): void {
    switch (s) {
      case 'click': this.tone('triangle', 900, 900, 0.05, 0.05); break;
      case 'beep': this.tone('square', 660, 660, 0.07, 0.22); break;
      case 'go': this.tone('square', 1320, 1320, 0.08, 0.5); break;
      case 'lap': this.run('triangle', [79, 84], 0.09, 0.12, 0.25); break;
      case 'record': this.run('square', [76, 79, 84, 88], 0.08, 0.06, 0.2); break;
      case 'bank': this.run('triangle', [84, 91], 0.06, 0.1, 0.18); break;
      case 'link': this.tone('triangle', 700, 1100, 0.06, 0.12); break;
      case 'lost': this.tone('sawtooth', 300, 90, 0.08, 0.35); break;
      case 'turbo': this.hiss('bandpass', 600, 3000, 0.18, 0.6); this.tone('sawtooth', 120, 480, 0.06, 0.5); break;
      case 'bump': this.tone('sine', 120, 50, 0.3, 0.18); this.hiss('lowpass', 900, 200, 0.12, 0.12); break;
      case 'crash': this.hiss('lowpass', 2400, 120, 0.4, 0.5); this.tone('sawtooth', 160, 40, 0.15, 0.4); break;
      case 'finish': this.run('triangle', [72, 76, 79, 84], 0.12, 0.12, 0.35); break;
      case 'win': this.run('square', [72, 76, 79, 84, 79, 84, 88], 0.11, 0.07, 0.22); this.run('triangle', [48, 52, 55, 60], 0.2, 0.15, 0.5); break;
    }
  }
}
