/**
 * @module
 * A factory for creating and triggering various types of audio voices,
 * such as synthesizers, samplers, and noise generators. It handles the
 * dynamic construction of Web Audio API graphs for each voice.
 */

import { AudioCache } from './audio-cache';

/**
 * Defines the parameters for triggering a single audio voice.
 * This configuration object is used to control the properties of a synth, sampler, or noise voice.
 */
export interface VoiceTriggerOptions {
  /** The pitch of the note in Hertz (e.g., 440.0 for A4). */
  frequency: number;
  /** The total duration of the note in seconds, including attack and release phases. */
  duration: number;
  /** The precise time on the `AudioContext` timeline when the note should start playing. */
  startTime: number;
  /** The peak volume of the note, typically between 0.0 and 1.0. */
  volume?: number;
  /** The stereo panning position, from -1.0 (left) to 1.0 (right). */
  pan?: number;
  /** The cutoff frequency for the low-pass or high-pass filter in Hertz. */
  cutoff?: number;
  /** The mix level for the global reverb send, from 0.0 to 1.0. */
  reverbMix?: number;
  /** The mix level for the global delay send, from 0.0 to 1.0. */
  delayMix?: number;
  /** The amount of distortion to apply, from 0.0 to 1.0. */
  distortionMix?: number;
  /** (Not yet implemented) The mix level for a chorus effect. */
  chorusMix?: number;
  /** The time in seconds for portamento (pitch glide) from a previous note. */
  glideTime?: number;
  /** The speed of the Low-Frequency Oscillator (LFO) in Hertz, used for vibrato. */
  lfoRate?: number;
  /** The intensity of the LFO, affecting the depth of the vibrato. */
  lfoDepth?: number;
}

/**
 * Responsible for creating and scheduling audio "voices".
 *
 * @remarks
 * A "voice" is a temporary audio graph that produces a single sound, such as a
 * synthesizer note, a sampled sound effect, or a burst of noise. This factory
 * connects these voices to the main audio engine's routing buses.
 */
export class VoiceFactory {
  private noiseBuffer: AudioBuffer | null = null;
  private distortionCurves = new Map<number, Float32Array>();

  /**
   * Creates an instance of VoiceFactory.
   * @param audioContext - The root `AudioContext` for creating nodes.
   * @param audioCache - The cache for retrieving audio samples.
   * @param routingDestination - The primary `AudioNode` to which all voices will be routed (e.g., a sub-mix bus).
   * @param reverbBus - (Optional) The global reverb `AudioNode` for effect sends.
   * @param delayBus - (Optional) The global delay `AudioNode` for effect sends.
   */
  constructor(
    private audioContext: AudioContext,
    private audioCache: AudioCache,
    private routingDestination: AudioNode,
    private reverbBus?: AudioNode,
    private delayBus?: AudioNode
  ) {}

  /**
   * Creates and triggers a synthesizer voice using a basic oscillator.
   *
   * @remarks
   * This method constructs a temporary audio graph consisting of an `OscillatorNode`
   * connected to an envelope, filter, and panner. It supports various waveforms,
   * pitch glide (portamento), and LFO-driven vibrato.
   *
   * @param waveform - The shape of the oscillator's wave (e.g., 'sine', 'sawtooth').
   * @param note - An object containing the parameters for the note, conforming to `VoiceTriggerOptions`.
   * @param startTime - The `AudioContext` time at which the note should start.
   * @param prevFrequency - (Optional) The frequency of the previously played note, used for calculating pitch glide.
   * @returns The `OscillatorNode` at the core of the generated voice.
   */
  public triggerSynthVoice(
    waveform: OscillatorType, 
    note: any, 
    startTime: number, 
    prevFrequency?: number
  ): OscillatorNode {
    const ctx = this.audioContext;
    const dest = this.createSubGraph(note, startTime, note.duration);

    const osc = ctx.createOscillator();
    osc.type = waveform;

    if (note.glideTime > 0 && prevFrequency !== undefined && prevFrequency > 0 && note.frequency > 0) {
      osc.frequency.setValueAtTime(prevFrequency, startTime);
      osc.frequency.exponentialRampToValueAtTime(note.frequency, startTime + note.glideTime);
    } else {
      osc.frequency.setValueAtTime(note.frequency, startTime);
    }

    if (note.lfoDepth > 0) {
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(note.lfoRate, startTime);
      lfoGain.gain.setValueAtTime(note.lfoDepth, startTime);

      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start(startTime);
      lfo.stop(startTime + note.duration + 0.1);
    }

    osc.connect(dest);
    osc.start(startTime);
    osc.stop(startTime + note.duration + 0.1);

    return osc;
  }

  /**
   * Creates and triggers a white noise voice.
   * Useful for percussion sounds like hi-hats or snare drums, or for sound effects like wind.
   * @param note - An object containing the parameters for the noise event.
   * @param startTime - The `AudioContext` time at which the noise should start.
   * @returns The `AudioBufferSourceNode` playing the noise.
   */
  public triggerNoiseVoice(note: any, startTime: number): AudioBufferSourceNode {
    const ctx = this.audioContext;
    const dest = this.createSubGraph(note, startTime, note.duration, true);

    const source = ctx.createBufferSource();
    source.buffer = this.getWhiteNoiseBuffer();
    source.loop = true;

    source.connect(dest);
    source.start(startTime);
    source.stop(startTime + note.duration + 0.1);

    return source;
  }

  /**
   * Creates and triggers a sampler voice from a cached `AudioBuffer`.
   *
   * @remarks
   * This method plays back a pre-loaded or procedurally generated audio sample.
   * It automatically calculates the correct `playbackRate` to pitch-shift the sample
   * to the desired frequency.
   *
   * @param sampleId - The unique identifier of the sample in the `AudioCache`.
   * @param note - An object containing the parameters for the note.
   * @param startTime - The `AudioContext` time at which the note should start.
   * @param rootFrequency - The original root frequency of the sample (e.g., 261.63 for Middle C). This is crucial for accurate pitching.
   * @returns The `AudioBufferSourceNode` playing the sample.
   */
  public triggerSamplerVoice(
    sampleId: string, 
    note: any, 
    startTime: number, 
    rootFrequency = 261.63
  ): AudioBufferSourceNode {
    const ctx = this.audioContext;
    const sampleBuffer = this.audioCache.get(sampleId);
    
    const dest = this.createSubGraph(note, startTime, note.duration);

    const source = ctx.createBufferSource();
    source.buffer = sampleBuffer;

    const targetPlaybackRate = note.frequency / rootFrequency;
    source.playbackRate.setValueAtTime(targetPlaybackRate, startTime);

    source.connect(dest);
    source.start(startTime);
    source.stop(startTime + note.duration + 0.1);

    return source;
  }

  /**
   * Creates the common subgraph for a voice, including envelope, filter, and panner.
   * This is the main processing chain that the raw sound source (oscillator, noise, or sampler) is connected to.
   * @param note - The note configuration object.
   * @param startTime - The start time for scheduling audio parameter changes.
   * @param duration - The duration of the note for envelope calculation.
   * @param isNoise - A flag to indicate if the filter should be configured for noise (high-pass).
   * @returns The entry `AudioNode` (an envelope `GainNode`) of the created subgraph.
   * @private
   */
  private createSubGraph(
    note: any, 
    startTime: number, 
    duration: number, 
    isNoise = false
  ): AudioNode {
    const ctx = this.audioContext;
    const noteEnd = startTime + duration;

    const envelopeGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const panner = ctx.createStereoPanner();

    filter.type = isNoise ? 'highpass' : 'lowpass';
    filter.frequency.setValueAtTime(note.cutoff || 2000, startTime);
    filter.Q.setValueAtTime(isNoise ? 1 : 2, startTime);

    panner.pan.setValueAtTime(note.pan || 0, startTime);

    const attack = isNoise ? 0.005 : 0.02;
    const release = 0.1;
    const peakVolume = note.volume !== undefined ? note.volume * 0.8 : 0.8;

    envelopeGain.gain.setValueAtTime(0, startTime);
    envelopeGain.gain.linearRampToValueAtTime(peakVolume, startTime + attack);
    envelopeGain.gain.setValueAtTime(peakVolume, Math.max(startTime + attack, noteEnd - release));
    envelopeGain.gain.linearRampToValueAtTime(0.001, noteEnd);

    envelopeGain.connect(filter);
    filter.connect(panner);
    panner.connect(this.routingDestination);

    this.routeParallelSends(note, panner, startTime);

    return envelopeGain;
  }

  /**
   * Connects a voice's output to the parallel effects buses (reverb, delay, etc.).
   * @param note - The note configuration object, containing mix levels.
   * @param sourceNode - The node from which to send the signal to the effects.
   * @param startTime - The start time for scheduling audio parameter changes.
   * @private
   */
  private routeParallelSends(note: any, sourceNode: AudioNode, startTime: number): void {
    const ctx = this.audioContext;

    if (note.reverbMix > 0 && this.reverbBus) {
      const revSend = ctx.createGain();
      revSend.gain.setValueAtTime(note.reverbMix * 0.7, startTime);
      sourceNode.connect(revSend);
      revSend.connect(this.reverbBus);
    }

    if (note.delayMix > 0 && this.delayBus) {
      const delSend = ctx.createGain();
      delSend.gain.setValueAtTime(note.delayMix * 0.6, startTime);
      sourceNode.connect(delSend);
      delSend.connect(this.delayBus);
    }

    if (note.distortionMix > 0) {
      const shaper = ctx.createWaveShaper();
      shaper.curve = this.makeDistortionCurve(note.distortionMix);
      shaper.oversample = '4x';
      
      const distSend = ctx.createGain();
      distSend.gain.setValueAtTime(note.distortionMix * 0.5, startTime);
      
      sourceNode.connect(shaper);
      shaper.connect(distSend);
      distSend.connect(this.routingDestination);
    }
  }

  /**
   * Generates and caches a 2-second buffer of white noise.
   * The buffer is reused for all subsequent noise voices to save memory and processing time.
   * @private
   */
  private getWhiteNoiseBuffer(): AudioBuffer {
    if (this.noiseBuffer) return this.noiseBuffer;

    const sampleRate = this.audioContext.sampleRate;
    const bufferSize = sampleRate * 2.0;
    const buffer = this.audioContext.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    this.noiseBuffer = buffer;
    return buffer;
  }

  /**
   * Creates a distortion curve for the `WaveShaperNode`.
   * Caches the curve based on the `amount` to avoid recalculating for the same distortion level.
   * @param amount - The intensity of the distortion, from 0.0 to 1.0.
   * @private
   */
  private makeDistortionCurve(amount: number): Float32Array<ArrayBuffer> {
    if (this.distortionCurves.has(amount)) {
      return this.distortionCurves.get(amount)! as Float32Array<ArrayBuffer>;
    }

    const k = amount * 100;
    const n_samples = 2048; // Optimized resolution
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    
    this.distortionCurves.set(amount, curve);
    return curve;
  }
}