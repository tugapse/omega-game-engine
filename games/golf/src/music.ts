// Background music: a light, sunny tune for a morning on the course (an
// original), synthesised and scheduled with plain Web Audio, like the sounds.
// No audio files. The score is a pure function, so it is tested in Node.

export const MUSIC = {
  bpm: 100,
  /** Sixteenth notes per bar. */
  stepsPerBar: 16,
  /** Bars before the tune repeats. */
  bars: 16,
  volume: 0.32,
};

export type Voice = 'pluck' | 'pad' | 'bass' | 'bell' | 'shaker' | 'kick';

/** One note: a voice, a MIDI note, a length in sixteenths and a velocity 0..1. */
export interface MusicNote { voice: Voice; midi: number; steps: number; velocity: number }

/** D major: D G Bm A | D G Em A, then G A F#m Bm | G A D D in the second half. */
const CHORDS: { notes: number[]; bass: number }[][] = [
  [
    { notes: [62, 66, 69], bass: 38 }, { notes: [62, 67, 71], bass: 43 }, { notes: [62, 66, 71], bass: 47 }, { notes: [61, 64, 69], bass: 45 },
    { notes: [62, 66, 69], bass: 38 }, { notes: [62, 67, 71], bass: 43 }, { notes: [64, 67, 71], bass: 40 }, { notes: [61, 64, 69], bass: 45 },
  ],
  [
    { notes: [62, 67, 71], bass: 43 }, { notes: [61, 64, 69], bass: 45 }, { notes: [61, 66, 69], bass: 42 }, { notes: [62, 66, 71], bass: 47 },
    { notes: [62, 67, 71], bass: 43 }, { notes: [61, 64, 69], bass: 45 }, { notes: [62, 66, 69], bass: 38 }, { notes: [62, 66, 69], bass: 38 },
  ],
];

/** The bell melody, two bars per line: [step within the two bars, MIDI, length]. */
const MELODY: [number, number, number][][] = [
  [[0, 78, 4], [4, 76, 2], [6, 74, 2], [8, 76, 6], [16, 79, 4], [20, 78, 2], [22, 76, 2], [24, 74, 8]],
  [[0, 74, 3], [3, 76, 3], [6, 78, 2], [8, 81, 6], [16, 79, 4], [20, 76, 4], [24, 73, 8]],
  [[0, 79, 4], [4, 81, 4], [8, 83, 6], [16, 81, 4], [20, 78, 4], [24, 76, 8]],
  [[0, 79, 3], [3, 78, 3], [6, 76, 2], [8, 78, 6], [16, 74, 12]],
];

/** The notes that start at `step` (sixteenths since the start); the tune loops every {@link MUSIC.bars} bars. */
export function notesAt(step: number): MusicNote[] {
  const loopStep = step % (MUSIC.stepsPerBar * MUSIC.bars);
  const bar = Math.floor(loopStep / MUSIC.stepsPerBar);
  const s = loopStep % MUSIC.stepsPerBar;
  const half = bar < 8 ? 0 : 1;
  const chord = CHORDS[half][bar % 8];
  const out: MusicNote[] = [];
  // A soft pad holds the chord for the bar.
  if (s === 0) for (const midi of chord.notes) out.push({ voice: 'pad', midi: midi - 12, steps: 16, velocity: 0.35 });
  // A plucked arpeggio on the eighths: up and down the chord, an octave up at the top.
  if (s % 2 === 0) {
    const order = [0, 1, 2, 1, 0, 1, 2, 1];
    const k = order[s / 2];
    out.push({ voice: 'pluck', midi: chord.notes[k] + (s === 4 || s === 12 ? 12 : 0), steps: 2, velocity: s % 4 === 0 ? 0.55 : 0.4 });
  }
  // Bass on the root, a push into beat 3.
  for (const [at, len, fifth] of [[0, 6, false], [6, 2, false], [8, 6, true], [14, 2, false]] as const) {
    if (s === at) out.push({ voice: 'bass', midi: chord.bass + (fifth ? 7 : 0), steps: len, velocity: at === 0 ? 0.85 : 0.6 });
  }
  // A light shaker on the sixteenths and a soft kick on the beats (none in the first two bars).
  if (bar >= 2) {
    out.push({ voice: 'shaker', midi: 0, steps: 1, velocity: s % 4 === 2 ? 0.4 : 0.18 });
    if (s % 8 === 0) out.push({ voice: 'kick', midi: 0, steps: 1, velocity: 0.5 });
  }
  // The melody comes in from bar 4, two bars per phrase.
  if (bar >= 4) {
    const phrase = MELODY[Math.floor((bar - 4) / 2) % MELODY.length];
    const at = ((bar - 4) % 2) * 16 + s;
    for (const [t, midi, len] of phrase) if (t === at) out.push({ voice: 'bell', midi, steps: len, velocity: 0.5 });
  }
  return out;
}

const hz = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

/** Plays {@link notesAt} through an AudioContext, scheduling a little ahead. */
export class GolfMusic {
  private timer: number | null = null;
  private step = 0;
  private nextTime = 0;
  private bus: GainNode | null = null;
  private noise: AudioBuffer | null = null;

  constructor(private readonly context: () => AudioContext | null) {}

  get playing(): boolean { return this.timer !== null; }

  start(): void {
    const ctx = this.context();
    if (!ctx || this.timer !== null) return;
    if (!this.bus) {
      this.bus = ctx.createGain();
      this.bus.connect(ctx.destination);
      this.noise = ctx.createBuffer(1, ctx.sampleRate / 2, ctx.sampleRate);
      const d = this.noise.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    this.bus.gain.cancelScheduledValues(ctx.currentTime);
    this.bus.gain.setValueAtTime(0.0001, ctx.currentTime);
    this.bus.gain.exponentialRampToValueAtTime(MUSIC.volume, ctx.currentTime + 1.5);
    this.nextTime = ctx.currentTime + 0.1;
    this.timer = window.setInterval(() => this.schedule(ctx), 25);
  }

  stop(): void {
    const ctx = this.context();
    if (this.timer !== null) window.clearInterval(this.timer);
    this.timer = null;
    if (ctx && this.bus) {
      this.bus.gain.cancelScheduledValues(ctx.currentTime);
      this.bus.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.2);
    }
  }

  /** Softer while something else wants attention (the pause menu). */
  duck(on: boolean): void {
    const ctx = this.context();
    if (ctx && this.bus && this.timer !== null) this.bus.gain.setTargetAtTime(on ? MUSIC.volume * 0.35 : MUSIC.volume, ctx.currentTime, 0.2);
  }

  private schedule(ctx: AudioContext): void {
    const stepTime = 60 / MUSIC.bpm / 4;
    // A tab in the background falls behind: skip ahead rather than play a burst.
    if (this.nextTime < ctx.currentTime - 0.2) this.nextTime = ctx.currentTime + 0.05;
    while (this.nextTime < ctx.currentTime + 0.12) {
      for (const n of notesAt(this.step)) this.play(ctx, n, this.nextTime, n.steps * stepTime);
      this.step++;
      this.nextTime += stepTime;
    }
  }

  private play(ctx: AudioContext, n: MusicNote, t: number, length: number): void {
    const bus = this.bus!;
    const env = (g: GainNode, peak: number, attack: number, release: number) => {
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(peak, t + attack);
      g.gain.exponentialRampToValueAtTime(0.0001, t + release);
    };
    const osc = (type: OscillatorType, f: number) => { const o = ctx.createOscillator(); o.type = type; o.frequency.value = f; return o; };
    const g = ctx.createGain();
    g.connect(bus);
    const v = n.velocity;
    const sources: AudioScheduledSourceNode[] = [];
    let end = t + length;
    switch (n.voice) {
      case 'pluck': {
        const o = osc('triangle', hz(n.midi));
        const f = ctx.createBiquadFilter(); f.type = 'lowpass';
        f.frequency.setValueAtTime(3500, t); f.frequency.exponentialRampToValueAtTime(700, t + 0.3);
        o.connect(f).connect(g); env(g, 0.18 * v, 0.004, t + 0.45 - t); sources.push(o); end = t + 0.5;
        break;
      }
      case 'pad': {
        for (const d of [-6, 6]) { const o = osc('sawtooth', hz(n.midi)); o.detune.value = d; const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 900; o.connect(f).connect(g); sources.push(o); }
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.025 * v, t + 0.6); g.gain.setValueAtTime(0.025 * v, t + length - 0.3); g.gain.exponentialRampToValueAtTime(0.0001, t + length + 0.4);
        end = t + length + 0.5;
        break;
      }
      case 'bass': {
        const o = osc('sine', hz(n.midi)); const o2 = osc('triangle', hz(n.midi)); o.connect(g); o2.connect(g);
        env(g, 0.3 * v, 0.01, Math.min(length, 0.6)); sources.push(o, o2); end = t + Math.min(length, 0.6) + 0.05;
        break;
      }
      case 'bell': {
        const o = osc('sine', hz(n.midi)); const o2 = osc('sine', hz(n.midi) * 3.01);
        const g2 = ctx.createGain(); g2.gain.value = 0.25; o2.connect(g2).connect(g); o.connect(g);
        env(g, 0.16 * v, 0.005, Math.max(0.6, length) ); sources.push(o, o2); end = t + Math.max(0.6, length) + 0.05;
        break;
      }
      case 'shaker': {
        const src = ctx.createBufferSource(); src.buffer = this.noise;
        const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 6000;
        src.connect(f).connect(g); env(g, 0.05 * v, 0.003, 0.06); sources.push(src); end = t + 0.08;
        break;
      }
      case 'kick': {
        const o = osc('sine', 120); o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.15);
        o.connect(g); env(g, 0.35 * v, 0.003, 0.2); sources.push(o); end = t + 0.25;
        break;
      }
    }
    for (const src of sources) { src.start(t); src.stop(end); }
  }
}
