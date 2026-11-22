// Background music: soft lounge bossa ("elevator music"), synthesised and
// sequenced in code with the engine's SequencerClock. No audio files.
import { AudioEngine, SequencerClock } from '../../../src';

export const MUSIC = {
  bpm: 92,
  /** Sixteenth notes per bar. */
  stepsPerBar: 16,
  volume: 0.48,
};

/** One note to play: a voice, a MIDI note, a length in steps and a velocity 0..1. */
export interface MusicNote {
  voice: 'keys' | 'vibes' | 'bass' | 'hat' | 'rim';
  midi: number;
  steps: number;
  velocity: number;
}

/** Eight bars in F major: Fmaj7 Dm9 Gm7 C9 | Bbmaj7 Am7 Gm7 C7. Voicings and bass roots as MIDI. */
const CHORDS: { keys: number[]; bass: number; tones: number[] }[] = [
  { keys: [53, 57, 60, 64], bass: 41, tones: [65, 69, 72, 76, 79] }, // Fmaj7
  { keys: [53, 57, 60, 64], bass: 38, tones: [62, 65, 69, 72, 76] }, // Dm9
  { keys: [53, 55, 58, 62], bass: 43, tones: [62, 65, 67, 70, 74] }, // Gm7
  { keys: [52, 58, 62, 67], bass: 36, tones: [64, 67, 70, 72, 74] }, // C9
  { keys: [53, 57, 58, 62], bass: 46, tones: [62, 65, 69, 70, 74] }, // Bbmaj7
  { keys: [52, 55, 57, 60], bass: 45, tones: [64, 67, 69, 72, 76] }, // Am7
  { keys: [53, 55, 58, 62], bass: 43, tones: [62, 65, 67, 70, 74] }, // Gm7
  { keys: [52, 55, 58, 62], bass: 36, tones: [64, 67, 70, 72, 76] }, // C7
];

/** Rhythms for the vibraphone melody: [step, length] within a bar. */
const MELODY_RHYTHMS: [number, number][][] = [
  [[0, 6], [6, 2], [8, 8]],
  [[2, 4], [6, 4], [10, 6]],
  [[0, 3], [3, 3], [6, 10]],
  [[4, 4], [8, 2], [10, 2], [12, 4]],
  [[0, 12]],
];

/** A small deterministic random generator, so the tune is the same every loop. */
function seeded(seed: number): () => number {
  let s = (seed * 2654435761) >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

/**
 * The notes that start at `step` (sixteenths since the start). Sixteen bars
 * loop: the chords repeat every 8, the melody varies in the second half.
 */
export function notesAt(step: number): MusicNote[] {
  const loopStep = step % (MUSIC.stepsPerBar * 16);
  const bar = Math.floor(loopStep / MUSIC.stepsPerBar);
  const s = loopStep % MUSIC.stepsPerBar;
  const chord = CHORDS[bar % 8];
  const out: MusicNote[] = [];
  // Keys: a bossa comp, a long chord then two short pushes.
  for (const [at, len, vel] of [[0, 6, 0.55], [6, 3, 0.4], [10, 5, 0.45]] as const) {
    if (s === at) for (const midi of chord.keys) out.push({ voice: 'keys', midi, steps: len, velocity: vel });
  }
  // Bass: root, the fifth twice (one anticipating beat 3), root again.
  for (const [at, len, fifth] of [[0, 6, false], [6, 2, true], [8, 6, true], [14, 2, false]] as const) {
    if (s === at) out.push({ voice: 'bass', midi: chord.bass + (fifth ? 7 : 0), steps: len, velocity: at === 0 ? 0.9 : 0.65 });
  }
  // Brushes on the eighths, accent on the off-beats; a 3-2 clave on the rim.
  if (s % 2 === 0) out.push({ voice: 'hat', midi: 0, steps: 1, velocity: s % 4 === 2 ? 0.5 : 0.28 });
  const clave = bar % 2 === 0 ? [0, 6, 12] : [4, 8];
  if (clave.includes(s)) out.push({ voice: 'rim', midi: 0, steps: 1, velocity: 0.35 });
  // Melody: rests every fourth bar, so it breathes.
  if (bar % 4 !== 3) {
    const rnd = seeded(bar % 8 + (bar >= 8 ? 101 : 1));
    const rhythm = MELODY_RHYTHMS[Math.floor(rnd() * MELODY_RHYTHMS.length)];
    rhythm.forEach(([at, len]) => {
      const midi = chord.tones[Math.floor(rnd() * chord.tones.length)];
      if (s === at) out.push({ voice: 'vibes', midi, steps: len, velocity: 0.5 + rnd() * 0.2 });
    });
  }
  return out;
}

const midiToHz = (m: number) => 440 * 2 ** ((m - 69) / 12);

/** Plays {@link notesAt} on the engine's music bus. */
export class BackgroundMusic {
  private readonly ctx: AudioContext;
  private readonly out: GainNode;
  private readonly noise: AudioBuffer;
  private clock: SequencerClock | null = null;
  private level = MUSIC.volume;
  private ducked = false;

  constructor(audio: AudioEngine) {
    this.ctx = audio.getContext();
    this.out = this.ctx.createGain();
    this.out.gain.value = 0;
    this.out.connect(audio.getMusicBus());
    const send = this.ctx.createGain();
    send.gain.value = 0.35;
    this.out.connect(send);
    send.connect(audio.getReverbBus());
    this.noise = this.ctx.createBuffer(1, this.ctx.sampleRate, this.ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }

  get playing(): boolean {
    return this.clock !== null;
  }

  start(): void {
    if (this.clock || this.ctx.state !== 'running') return;
    this.clock = new SequencerClock(this.ctx, { bpm: MUSIC.bpm, ticksPerBeat: 4, lookaheadMs: 200, overlapMs: 50 });
    this.out.gain.setTargetAtTime(this.target(), this.ctx.currentTime, 1.5); // fade in
    this.clock.start((tick, time, stepDuration) => {
      for (const n of notesAt(tick)) this.play(n, time, n.steps * stepDuration);
    });
  }

  stop(): void {
    this.clock?.stop();
    this.clock = null;
    this.out.gain.setTargetAtTime(0, this.ctx.currentTime, 0.2);
  }

  /** Quieter while the ball rolls, so the pins are heard. */
  duck(on: boolean): void {
    if (on === this.ducked) return;
    this.ducked = on;
    if (this.clock) this.out.gain.setTargetAtTime(this.target(), this.ctx.currentTime, on ? 0.3 : 1.2);
  }

  private target(): number {
    return this.level * (this.ducked ? 0.45 : 1);
  }

  private play(n: MusicNote, t: number, length: number): void {
    switch (n.voice) {
      case 'keys': return this.keys(midiToHz(n.midi), t, length, n.velocity);
      case 'vibes': return this.vibes(midiToHz(n.midi), t, length, n.velocity);
      case 'bass': return this.bass(midiToHz(n.midi), t, length, n.velocity);
      case 'hat': return this.hat(t, n.velocity);
      case 'rim': return this.rim(t, n.velocity);
    }
  }

  /** An oscillator with an envelope: attack, decay to `sustain`, release after `length`. */
  private osc(type: OscillatorType, hz: number, t: number, length: number, peak: number, sustain: number, decay: number, release: number, dest: AudioNode): void {
    const o = this.ctx.createOscillator();
    o.type = type;
    o.frequency.value = hz;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + 0.008);
    g.gain.setTargetAtTime(peak * sustain, t + 0.008, decay);
    g.gain.setTargetAtTime(0, t + length, release);
    o.connect(g).connect(dest);
    o.start(t);
    o.stop(t + length + release * 6);
  }

  /** Electric piano: a sine with a short bright "tine" an octave and a fifth up. */
  private keys(hz: number, t: number, length: number, v: number): void {
    const f = this.ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = 2200;
    f.connect(this.out);
    this.osc('sine', hz, t, length, 0.09 * v, 0.45, 0.5, 0.25, f);
    this.osc('sine', hz * 3, t, Math.min(length, 0.15), 0.025 * v, 0.1, 0.06, 0.05, f);
  }

  /** Vibraphone: a pure tone with a fast-fading overtone and a slow tremolo. */
  private vibes(hz: number, t: number, length: number, v: number): void {
    const trem = this.ctx.createGain();
    trem.gain.value = 1;
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 5.2;
    const depth = this.ctx.createGain();
    depth.gain.value = 0.25;
    lfo.connect(depth).connect(trem.gain);
    trem.connect(this.out);
    lfo.start(t);
    lfo.stop(t + length + 1.6);
    this.osc('sine', hz, t, length, 0.11 * v, 0.35, 0.7, 0.35, trem);
    this.osc('sine', hz * 4, t, 0.1, 0.03 * v, 0.05, 0.04, 0.03, trem);
  }

  /** Upright bass: a soft triangle, plucked. */
  private bass(hz: number, t: number, length: number, v: number): void {
    const f = this.ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = 500;
    f.connect(this.out);
    this.osc('triangle', hz, t, length * 0.9, 0.3 * v, 0.4, 0.18, 0.06, f);
  }

  private noiseHit(t: number, type: BiquadFilterType, hz: number, q: number, gain: number, decay: number): void {
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    const f = this.ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = hz;
    f.Q.value = q;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0005, t + decay);
    src.connect(f).connect(g).connect(this.out);
    src.start(t, Math.random() * 0.5);
    src.stop(t + decay + 0.02);
  }

  /** Brushes: a soft swish of high noise. */
  private hat(t: number, v: number): void {
    this.noiseHit(t, 'highpass', 6500, 0.7, 0.05 * v, 0.07);
  }

  /** Rim click: a short knock. */
  private rim(t: number, v: number): void {
    this.noiseHit(t, 'bandpass', 1800, 6, 0.12 * v, 0.03);
  }
}
