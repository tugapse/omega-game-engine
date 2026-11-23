// Sounds, synthesised with Web Audio (no sound files): the swing's whoosh, the
// club meeting the ball (a crack for woods, a click for irons, a tap for
// putts), the ball landing, leaves, a trunk, a splash, the cup's rattle, and a
// chime for a good score. Plain Web Audio rather than the engine's AudioEngine,
// whose voices break up (bug G12) and outlive what made them (G13).

export class GolfSound {
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
      this.out.gain.value = this.muted ? 0 : 0.7;
      this.out.connect(this.ctx.destination);
      this.noise = this.ctx.createBuffer(1, this.ctx.sampleRate, this.ctx.sampleRate);
      const d = this.noise.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.out && this.ctx) this.out.gain.setTargetAtTime(muted ? 0 : 0.7, this.ctx.currentTime, 0.02);
  }

  /** The audio graph when it can play now, or null (locked, muted). */
  private parts(): { ctx: AudioContext; out: GainNode; noise: AudioBuffer } | null {
    if (!this.ctx || !this.out || !this.noise || this.muted || this.ctx.state !== 'running') return null;
    return { ctx: this.ctx, out: this.out, noise: this.noise };
  }

  /** A burst of filtered noise: `type` filter at `freq` (Hz, sweeping to `freqTo`), `gain`, `length` seconds. */
  private hiss(type: BiquadFilterType, freq: number, freqTo: number, gain: number, length: number, delay = 0, q = 1): void {
    const a = this.parts();
    if (!a) return;
    const { ctx, out, noise } = a;
    const t = ctx.currentTime + delay;
    const src = ctx.createBufferSource();
    src.buffer = noise;
    src.playbackRate.value = 0.8 + Math.random() * 0.4;
    const f = ctx.createBiquadFilter();
    f.type = type; f.Q.value = q;
    f.frequency.setValueAtTime(freq, t);
    f.frequency.exponentialRampToValueAtTime(Math.max(20, freqTo), t + length);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + Math.min(0.02, length / 4));
    g.gain.exponentialRampToValueAtTime(0.0001, t + length);
    src.connect(f).connect(g).connect(out);
    src.start(t, Math.random() * 0.5);
    src.stop(t + length + 0.05);
  }

  /** A short tone: `freq` (Hz, gliding to `freqTo`), `gain`, `length` seconds. */
  private tone(freq: number, freqTo: number, gain: number, length: number, delay = 0, type: OscillatorType = 'sine'): void {
    const a = this.parts();
    if (!a) return;
    const { ctx, out } = a;
    const t = ctx.currentTime + delay;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(20, freqTo), t + length);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + length);
    o.connect(g).connect(out);
    o.start(t);
    o.stop(t + length + 0.05);
  }

  /** The club cutting the air on the way down (louder for a fuller swing). */
  swing(power: number): void {
    this.hiss('bandpass', 500, 2400, 0.08 + 0.25 * power, 0.28, 0, 1.5);
  }

  /** The strike: a crack (woods), a click (irons), a tap (putter). */
  strike(club: string, power: number): void {
    const g = 0.25 + 0.5 * power;
    if (club === 'putter') { this.tone(1400, 900, 0.25, 0.06); this.hiss('highpass', 3000, 3000, 0.08, 0.03); return; }
    if (club === 'driver' || club === 'wood') { this.tone(900, 300, g * 0.6, 0.08, 0, 'triangle'); this.hiss('highpass', 2500, 1200, g, 0.09); return; }
    this.tone(2200, 1500, g * 0.5, 0.05); this.hiss('highpass', 4000, 2500, g * 0.8, 0.05);
  }

  /** The ball landing: a thud, softer on sand and rough. */
  land(surface: string, speed: number): void {
    const g = Math.min(0.5, speed / 40) * (surface === 'sand' ? 0.4 : surface === 'rough' ? 0.6 : 1);
    if (g < 0.02) return;
    this.hiss('lowpass', surface === 'sand' ? 900 : 500, 150, g, 0.12);
  }

  leaves(): void { this.hiss('bandpass', 3000, 1800, 0.12, 0.35, 0, 0.7); }
  trunk(): void { this.tone(220, 140, 0.35, 0.1, 0, 'triangle'); this.hiss('lowpass', 800, 300, 0.2, 0.08); }
  splash(): void { this.hiss('lowpass', 2500, 300, 0.45, 0.6); this.hiss('bandpass', 1200, 500, 0.2, 0.4, 0.05); }

  /** The ball dropping in: a few rattles against the cup. */
  cup(): void {
    for (let k = 0; k < 4; k++) this.tone(1800 - k * 150, 1500 - k * 150, 0.25 / (k + 1), 0.04, k * (0.05 + k * 0.012), 'triangle');
  }

  /** A rising chime: two to four notes for a good score. */
  chime(notes = 3): void {
    const scale = [523.25, 659.25, 783.99, 1046.5];
    for (let k = 0; k < notes; k++) this.tone(scale[k], scale[k], 0.18, 0.5, k * 0.11, 'triangle');
  }

  /** Two falling notes for a miss (water, out of bounds). */
  miss(): void {
    this.tone(392, 370, 0.12, 0.25, 0, 'triangle');
    this.tone(330, 300, 0.12, 0.35, 0.18, 'triangle');
  }
}
