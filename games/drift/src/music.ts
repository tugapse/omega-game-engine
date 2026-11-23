// The music: a tune of our own for each place, synthesised and scheduled with
// plain Web Audio (no audio files), like the other games'. The scores are pure
// functions, so they are tested in Node.
//   city: a night drive of a tune in A minor, arpeggios and a driving beat, 108 bpm.
//   desert: a bright, plucked tune in D dorian, 124 bpm.
//   snow: a slow tune of bells over pads in G major, 96 bpm.
import { ThemeName } from './themes';

export type TuneName = ThemeName;
export type Voice = 'lead' | 'bell' | 'pluck' | 'pulse' | 'pad' | 'bass' | 'kick' | 'snare' | 'hat' | 'rim';

/** One note: a voice, a MIDI note, a length in sixteenths and a velocity 0..1. */
export interface MusicNote { voice: Voice; midi: number; steps: number; velocity: number }

export interface Tune {
  bpm: number;
  /** Bars before it repeats (the chords and the melody both fit it). */
  bars: number;
  /** A chord per bar, looping: its notes and its bass. */
  chords: { notes: number[]; bass: number }[];
  /** Two-bar phrases, in turn: [step within the two bars, MIDI, length in sixteenths]. */
  melody: [number, number, number][][];
  /** The melody's voice, and the bar it comes in at. */
  lead: Voice;
  melodyFrom: number;
  /** The chord broken into notes: on the eighths, on the sixteenths, or held as a pad. */
  backing: 'eighths' | 'sixteenths' | 'pad';
  /** Bass hits in a bar: [step, length, on the fifth]. */
  bass: [number, number, boolean][];
  drums: 'chip' | 'soft' | 'drive';
  /** The notes it keeps to (pitch classes), for the tests. */
  scale: number[];
  volume: number;
}

const C = (notes: number[], bass: number) => ({ notes, bass });

export const TUNES: Record<TuneName, Tune> = {
  city: {
    bpm: 108, bars: 16, lead: 'lead', melodyFrom: 2, backing: 'sixteenths', drums: 'drive', volume: 0.26,
    chords: [C([57, 60, 64], 45), C([57, 60, 65], 41), C([55, 60, 64], 48), C([55, 59, 62], 43), C([57, 60, 64], 45), C([57, 60, 65], 41), C([55, 59, 62], 43), C([55, 59, 64], 40)],
    melody: [
      [[0, 76, 4], [4, 74, 2], [6, 72, 2], [8, 71, 4], [12, 72, 4], [16, 69, 6], [24, 72, 2], [26, 74, 2], [28, 76, 4]],
      [[0, 77, 4], [4, 76, 2], [6, 74, 2], [8, 72, 4], [12, 74, 4], [16, 76, 8], [24, 79, 4], [28, 76, 4]],
      [[0, 81, 6], [6, 79, 2], [8, 77, 4], [12, 76, 4], [16, 74, 4], [20, 72, 4], [24, 71, 4], [28, 72, 4]],
      [[0, 76, 2], [2, 77, 2], [4, 76, 2], [6, 74, 2], [8, 72, 8], [16, 71, 4], [20, 72, 4], [24, 69, 8]],
    ],
    bass: [[0, 1, false], [2, 1, false], [4, 1, false], [6, 1, true], [8, 1, false], [10, 1, false], [12, 1, false], [14, 1, true]],
    scale: [9, 11, 0, 2, 4, 5, 7],
  },
  desert: {
    bpm: 124, bars: 16, lead: 'pluck', melodyFrom: 2, backing: 'eighths', drums: 'chip', volume: 0.27,
    chords: [C([62, 65, 69], 38), C([62, 67, 71], 43), C([62, 65, 69], 38), C([60, 64, 67], 48), C([62, 65, 69], 38), C([62, 67, 71], 43), C([60, 64, 69], 45), C([60, 64, 67], 48)],
    melody: [
      [[0, 74, 2], [2, 77, 2], [4, 79, 4], [8, 81, 2], [10, 79, 2], [12, 77, 4], [16, 76, 4], [20, 74, 4], [24, 72, 4], [28, 74, 4]],
      [[0, 74, 2], [2, 77, 2], [4, 79, 2], [6, 81, 2], [8, 83, 4], [12, 81, 4], [16, 79, 6], [24, 77, 2], [26, 76, 2], [28, 74, 4]],
      [[0, 86, 4], [4, 84, 2], [6, 83, 2], [8, 81, 4], [12, 79, 4], [16, 81, 2], [18, 79, 2], [20, 77, 4], [24, 76, 8]],
      [[0, 74, 3], [3, 76, 3], [6, 77, 2], [8, 79, 4], [12, 77, 4], [16, 74, 12]],
    ],
    bass: [[0, 2, false], [4, 2, true], [8, 2, false], [12, 2, true]],
    scale: [2, 4, 5, 7, 9, 11, 0],
  },
  snow: {
    bpm: 96, bars: 16, lead: 'bell', melodyFrom: 2, backing: 'pad', drums: 'soft', volume: 0.3,
    chords: [C([55, 59, 62], 43), C([54, 57, 62], 38), C([55, 59, 64], 40), C([55, 60, 64], 48), C([55, 59, 62], 43), C([54, 57, 62], 38), C([55, 60, 64], 48), C([54, 57, 62], 38)],
    melody: [
      [[0, 79, 4], [4, 81, 4], [8, 83, 6], [16, 81, 4], [20, 79, 4], [24, 78, 8]],
      [[0, 76, 4], [4, 78, 4], [8, 79, 4], [12, 81, 4], [16, 83, 12], [28, 81, 4]],
      [[0, 86, 6], [8, 84, 4], [12, 83, 4], [16, 81, 6], [24, 79, 4], [28, 78, 4]],
      [[0, 79, 4], [4, 78, 4], [8, 76, 4], [12, 74, 4], [16, 79, 16]],
    ],
    bass: [[0, 6, false], [6, 2, false], [8, 6, true], [14, 2, false]],
    scale: [7, 9, 11, 0, 2, 4, 6],
  },
};

/** The notes that start at `step` (sixteenths since the start); the tune loops every `bars` bars. */
export function notesAt(tune: Tune, step: number): MusicNote[] {
  const loopStep = step % (16 * tune.bars);
  const bar = Math.floor(loopStep / 16);
  const s = loopStep % 16;
  const chord = tune.chords[bar % tune.chords.length];
  const out: MusicNote[] = [];
  // The chord: a soft pad for the bar always, broken into notes as well unless it is all pad.
  if (s === 0) for (const midi of chord.notes) out.push({ voice: 'pad', midi: midi - 12, steps: 16, velocity: tune.backing === 'pad' ? 0.5 : 0.25 });
  if (tune.backing === 'eighths' && s % 2 === 0) {
    const k = [0, 1, 2, 1, 0, 1, 2, 1][s / 2];
    out.push({ voice: 'pulse', midi: chord.notes[k] + (s === 4 || s === 12 ? 12 : 0), steps: 2, velocity: s % 4 === 0 ? 0.5 : 0.35 });
  } else if (tune.backing === 'sixteenths') {
    const k = [0, 1, 2, 3][s % 4];
    out.push({ voice: 'pluck', midi: k === 3 ? chord.notes[0] + 12 : chord.notes[k] + 12, steps: 1, velocity: s % 4 === 0 ? 0.32 : 0.2 });
  } else if (tune.backing === 'pad' && s % 4 === 2) {
    out.push({ voice: 'pluck', midi: chord.notes[(s / 2) % 3 | 0] + 12, steps: 2, velocity: 0.22 });
  }
  for (const [at, len, fifth] of tune.bass) {
    if (s === at) out.push({ voice: 'bass', midi: chord.bass + (fifth ? 7 : 0), steps: len, velocity: at === 0 ? 0.85 : 0.6 });
  }
  // Drums, none in the first bar.
  if (bar >= 1) {
    if (tune.drums === 'chip') {
      if (s % 8 === 0) out.push({ voice: 'kick', midi: 0, steps: 1, velocity: 0.6 });
      if (s % 8 === 4) out.push({ voice: 'snare', midi: 0, steps: 1, velocity: 0.45 });
      if (s % 2 === 0) out.push({ voice: 'hat', midi: 0, steps: 1, velocity: s % 4 === 2 ? 0.4 : 0.22 });
    } else if (tune.drums === 'soft') {
      if (s === 0) out.push({ voice: 'kick', midi: 0, steps: 1, velocity: 0.4 });
      if (s === 8) out.push({ voice: 'rim', midi: 0, steps: 1, velocity: 0.35 });
      if (s % 4 === 2) out.push({ voice: 'hat', midi: 0, steps: 1, velocity: 0.15 });
    } else {
      if (s % 4 === 0) out.push({ voice: 'kick', midi: 0, steps: 1, velocity: 0.7 });
      if (s % 8 === 4) out.push({ voice: 'snare', midi: 0, steps: 1, velocity: 0.6 });
      out.push({ voice: 'hat', midi: 0, steps: 1, velocity: s % 2 === 0 ? 0.3 : 0.15 });
    }
  }
  if (bar >= tune.melodyFrom) {
    const phraseBar = bar - tune.melodyFrom;
    const phrase = tune.melody[Math.floor(phraseBar / 2) % tune.melody.length];
    const at = (phraseBar % 2) * 16 + s;
    for (const [t, midi, len] of phrase) if (t === at) out.push({ voice: tune.lead, midi, steps: len, velocity: 0.55 });
  }
  return out;
}

const hz = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

/** Plays a tune through an AudioContext, scheduling a little ahead; switching tunes fades across. */
export class Music {
  private timer: number | null = null;
  private step = 0;
  private nextTime = 0;
  private bus: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private tune: Tune = TUNES.city;
  /** The tune playing (or to play once started). */
  name: TuneName = 'city';
  muted = false;

  constructor(private readonly context: () => AudioContext | null) {}

  get playing(): boolean { return this.timer !== null; }

  /** Plays a tune from its start (the same one already playing carries on). */
  play(name: TuneName): void {
    if (name === this.name && this.playing) return;
    this.name = name;
    this.tune = TUNES[name];
    this.step = 0;
    if (this.muted) return;
    const ctx = this.context();
    if (!ctx) return;
    if (!this.bus) {
      this.bus = ctx.createGain();
      this.bus.connect(ctx.destination);
      this.noise = ctx.createBuffer(1, ctx.sampleRate / 2, ctx.sampleRate);
      const d = this.noise.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    this.bus.gain.cancelScheduledValues(ctx.currentTime);
    this.bus.gain.setValueAtTime(0.0001, ctx.currentTime);
    this.bus.gain.exponentialRampToValueAtTime(this.tune.volume, ctx.currentTime + 0.8);
    this.nextTime = ctx.currentTime + 0.1;
    if (this.timer === null) this.timer = window.setInterval(() => this.schedule(ctx), 25);
  }

  stop(): void {
    const ctx = this.context();
    if (this.timer !== null) window.clearInterval(this.timer);
    this.timer = null;
    if (ctx && this.bus) {
      this.bus.gain.cancelScheduledValues(ctx.currentTime);
      this.bus.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.15);
    }
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (muted) this.stop();
    else this.play(this.name);
  }

  /** Softer while something else wants attention (the pause, a banner). */
  duck(on: boolean): void {
    const ctx = this.context();
    if (ctx && this.bus && this.timer !== null) this.bus.gain.setTargetAtTime(on ? this.tune.volume * 0.3 : this.tune.volume, ctx.currentTime, 0.2);
  }

  private schedule(ctx: AudioContext): void {
    const stepTime = 60 / this.tune.bpm / 4;
    if (this.nextTime < ctx.currentTime - 0.2) this.nextTime = ctx.currentTime + 0.05;
    while (this.nextTime < ctx.currentTime + 0.12) {
      for (const n of notesAt(this.tune, this.step)) this.note(ctx, n, this.nextTime, n.steps * stepTime);
      this.step++;
      this.nextTime += stepTime;
    }
  }

  private note(ctx: AudioContext, n: MusicNote, t: number, length: number): void {
    const bus = this.bus!;
    const env = (g: GainNode, peak: number, attack: number, release: number) => {
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + attack);
      g.gain.exponentialRampToValueAtTime(0.0001, t + release);
    };
    const osc = (type: OscillatorType, f: number) => { const o = ctx.createOscillator(); o.type = type; o.frequency.value = f; return o; };
    const noise = (filter: BiquadFilterType, f: number) => {
      const src = ctx.createBufferSource(); src.buffer = this.noise;
      const bq = ctx.createBiquadFilter(); bq.type = filter; bq.frequency.value = f;
      src.connect(bq); return { src, out: bq };
    };
    const g = ctx.createGain();
    g.connect(bus);
    const v = n.velocity;
    const sources: AudioScheduledSourceNode[] = [];
    let end = t + length;
    switch (n.voice) {
      case 'lead': {
        const o = osc('square', hz(n.midi));
        const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 2600;
        o.connect(f).connect(g);
        const len = Math.max(0.12, length * 0.9);
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.06 * v, t + 0.01);
        g.gain.setValueAtTime(0.05 * v, t + len - 0.03); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
        sources.push(o); end = t + len + 0.02;
        break;
      }
      case 'pulse': {
        const o = osc('square', hz(n.midi));
        const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 1800;
        o.connect(f).connect(g); env(g, 0.03 * v, 0.004, 0.15); sources.push(o); end = t + 0.17;
        break;
      }
      case 'pluck': {
        const o = osc('triangle', hz(n.midi));
        const f = ctx.createBiquadFilter(); f.type = 'lowpass';
        f.frequency.setValueAtTime(3500, t); f.frequency.exponentialRampToValueAtTime(700, t + 0.3);
        o.connect(f).connect(g); env(g, 0.16 * v, 0.004, 0.45); sources.push(o); end = t + 0.5;
        break;
      }
      case 'bell': {
        const o = osc('sine', hz(n.midi)); const o2 = osc('sine', hz(n.midi) * 3.01);
        const g2 = ctx.createGain(); g2.gain.value = 0.25; o2.connect(g2).connect(g); o.connect(g);
        const len = Math.max(0.8, length);
        env(g, 0.15 * v, 0.005, len); sources.push(o, o2); end = t + len + 0.05;
        // An echo, softer and later (the mountain's).
        const d = ctx.createDelay(1); d.delayTime.value = 0.32; const dg = ctx.createGain(); dg.gain.value = 0.35;
        g.connect(d).connect(dg).connect(bus);
        break;
      }
      case 'pad': {
        for (const dt of [-7, 7]) { const o = osc('sawtooth', hz(n.midi)); o.detune.value = dt; const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 800; o.connect(f).connect(g); sources.push(o); }
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.022 * v, t + 0.5);
        g.gain.setValueAtTime(0.022 * v, t + Math.max(0.6, length - 0.3)); g.gain.exponentialRampToValueAtTime(0.0001, t + length + 0.4);
        end = t + length + 0.5;
        break;
      }
      case 'bass': {
        const o = osc('triangle', hz(n.midi)); const o2 = osc('sine', hz(n.midi)); o.connect(g); o2.connect(g);
        const len = Math.min(Math.max(length, 0.1), 0.6);
        env(g, 0.28 * v, 0.008, len); sources.push(o, o2); end = t + len + 0.05;
        break;
      }
      case 'kick': {
        const o = osc('sine', 130); o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.14);
        o.connect(g); env(g, 0.38 * v, 0.003, 0.18); sources.push(o); end = t + 0.22;
        break;
      }
      case 'snare': {
        const { src, out } = noise('bandpass', 1800); out.connect(g); env(g, 0.16 * v, 0.002, 0.14); sources.push(src);
        const o = osc('triangle', 190); const og = ctx.createGain(); og.gain.value = 0.5; o.connect(og).connect(g); sources.push(o);
        end = t + 0.16;
        break;
      }
      case 'hat': {
        const { src, out } = noise('highpass', 7000); out.connect(g); env(g, 0.05 * v, 0.002, 0.05); sources.push(src); end = t + 0.06;
        break;
      }
      case 'rim': {
        const o = osc('square', 820); const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1600;
        o.connect(f).connect(g); env(g, 0.06 * v, 0.001, 0.05); sources.push(o); end = t + 0.06;
        break;
      }
    }
    for (const src of sources) { src.start(t); src.stop(end); }
  }
}
