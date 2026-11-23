// Sound effects, synthesised with Web Audio (no sound files): jumps, landing,
// coins, blocks, stomps, power-ups, sparks, hurt and death, the checkpoint,
// the flag's fanfare, the bosses' thuds, shots and fall, gates and falling
// platforms. Plain Web Audio rather than the engine's AudioEngine, whose
// voices break up (bug G12) and outlive what made them (G13), as in golf.

export type Sfx =
  | 'jump' | 'land' | 'coin' | 'big' | 'bump' | 'break' | 'stomp' | 'kick' | 'item' | 'power' | 'shrink'
  | 'shoot' | 'fizzle' | 'oneUp' | 'die' | 'checkpoint' | 'clear' | 'gameOver' | 'bossHit' | 'bossDown'
  | 'thud' | 'bossShot' | 'drop' | 'gate' | 'shake' | 'click';

export class Sound {
  private ctx: AudioContext | null = null;
  private out: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  muted = false;

  /** Call from a user gesture: browsers start audio suspended. */
  unlock(): void {
    if (!this.ctx) {
      const Ctx = window.AudioContext ?? (window as any).webkitAudioContext;
      if (!Ctx) return;
      this.ctx = new Ctx();
      this.out = this.ctx.createGain();
      this.out.gain.value = this.muted ? 0 : 0.55;
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
    if (this.out && this.ctx) this.out.gain.setTargetAtTime(muted ? 0 : 0.55, this.ctx.currentTime, 0.02);
  }

  private parts(): { ctx: AudioContext; out: GainNode; noise: AudioBuffer } | null {
    if (!this.ctx || !this.out || !this.noise || this.muted || this.ctx.state !== 'running') return null;
    return { ctx: this.ctx, out: this.out, noise: this.noise };
  }

  /** A tone from `f0` to `f1` Hz over `length` s (exponential sweep), with a quick attack and a fall. */
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
  private hiss(type: BiquadFilterType, f0: number, f1: number, gain: number, length: number, delay = 0, q = 1): void {
    const a = this.parts();
    if (!a) return;
    const { ctx, out, noise } = a;
    const t = ctx.currentTime + delay;
    const src = ctx.createBufferSource();
    src.buffer = noise;
    src.playbackRate.value = 0.8 + Math.random() * 0.4;
    const f = ctx.createBiquadFilter();
    f.type = type; f.Q.value = q;
    f.frequency.setValueAtTime(f0, t);
    f.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + length);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + Math.min(0.01, length / 4));
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
      case 'jump': this.tone('square', 300, 720, 0.07, 0.16); break;
      case 'land': this.hiss('lowpass', 900, 200, 0.12, 0.08); break;
      case 'coin': this.run('square', [88, 93], 0.06, 0.05, 0.16); break;
      case 'big': this.run('triangle', [84, 88, 91, 96, 100], 0.05, 0.12, 0.3); this.run('square', [96, 100, 103], 0.07, 0.03, 0.2); break;
      case 'bump': this.tone('triangle', 180, 90, 0.2, 0.1); break;
      case 'break': this.hiss('bandpass', 1400, 300, 0.3, 0.22, 0, 0.8); this.tone('square', 220, 70, 0.06, 0.15); break;
      case 'stomp': this.tone('square', 520, 140, 0.1, 0.12); this.hiss('lowpass', 1200, 300, 0.12, 0.07); break;
      case 'kick': this.tone('triangle', 180, 520, 0.15, 0.1); break;
      case 'item': this.run('triangle', [60, 64, 67, 72, 76, 79], 0.05, 0.1, 0.12); break;
      case 'power': this.run('square', [67, 71, 74, 79, 83, 86, 91], 0.045, 0.06, 0.12); break;
      case 'shrink': this.run('square', [79, 74, 70, 67, 62], 0.06, 0.06, 0.12); break;
      case 'shoot': this.tone('sawtooth', 900, 260, 0.06, 0.12); break;
      case 'fizzle': this.hiss('highpass', 3000, 1500, 0.05, 0.1); break;
      case 'oneUp': this.run('square', [76, 79, 88, 84, 86, 91], 0.08, 0.06, 0.14); break;
      case 'die': this.run('square', [72, 71, 70, 69, 65, 64, 60], 0.09, 0.07, 0.18); break;
      case 'checkpoint': this.run('triangle', [79, 84, 88], 0.08, 0.12, 0.35); break;
      case 'clear': this.run('square', [72, 76, 79, 84, 79, 84, 88], 0.11, 0.07, 0.22); this.run('triangle', [48, 52, 55, 60], 0.2, 0.15, 0.5); break;
      case 'gameOver': this.run('triangle', [67, 64, 60, 55, 52, 48], 0.2, 0.12, 0.45); break;
      case 'bossHit': this.tone('sawtooth', 220, 60, 0.18, 0.3); this.hiss('lowpass', 1500, 200, 0.25, 0.25); break;
      case 'bossDown':
        this.hiss('lowpass', 2500, 80, 0.4, 1.1);
        this.tone('sawtooth', 300, 40, 0.15, 0.9);
        this.run('square', [72, 76, 79, 84, 88, 91, 96], 0.09, 0.06, 0.2);
        break;
      case 'thud': this.tone('sine', 110, 40, 0.4, 0.25); this.hiss('lowpass', 500, 80, 0.2, 0.2); break;
      case 'bossShot': this.tone('triangle', 1400, 500, 0.07, 0.18); break;
      case 'drop': this.tone('sine', 900, 300, 0.07, 0.25); break;
      case 'gate': this.tone('sawtooth', 90, 60, 0.1, 0.4); this.hiss('bandpass', 400, 200, 0.12, 0.4, 0, 3); break;
      case 'shake': this.hiss('lowpass', 600, 300, 0.06, 0.3); break;
      case 'click': this.tone('triangle', 900, 900, 0.05, 0.05); break;
    }
  }
}
