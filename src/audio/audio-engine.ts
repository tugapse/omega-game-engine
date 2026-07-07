/**
 * @module
 * Web Audio Engine Core.
 * Handles the master graph, sub-mix routing, and global effects return buses.
 * Configured for early-load graph construction with deferred gesture activation.
 */

export interface AudioEngineConfig {
  /**
   * The desired sample rate for the AudioContext. If not provided, the browser's default will be used.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/AudioContextOptions/sampleRate
   */
  sampleRate?: number;
  /**
   * Provides a hint to the browser about the desired audio latency.
   * 'interactive' (default) is good for games. 'balanced' and 'playback' offer higher latency for better stability.
   * @defaultValue 'interactive'
   * @see https://developer.mozilla.org/en-US/docs/Web/API/AudioContextOptions/latencyHint
   */
  latencyHint?: AudioContextLatencyCategory;
}

/**
 * The central hub for all audio operations in the Omega engine.
 *
 * @remarks
 * This class encapsulates a Web Audio API `AudioContext` and constructs a
 * permanent, pre-configured audio routing graph upon instantiation. This graph includes:
 * - A master output chain with dynamics compression.
 * - Sub-mix buses for grouping sounds (e.g., synths, sound effects, music).
 * - Global send/return effects buses for shared reverb and delay.
 *
 * The `AudioContext` is created in a 'suspended' state and must be activated
 * via the `initialize()` method, typically in response to a user gesture.
 */
export class AudioEngine {
  /** The underlying Web Audio API AudioContext. */
  private ctx: AudioContext;
  
  // Master Chain Nodes
  /** The main volume control for the entire engine. */
  private masterVolumeNode!: GainNode;
  /** A master bus compressor to prevent clipping and even out dynamics. */
  private dynamicsCompressor!: DynamicsCompressorNode;
  /** An analyser node for visualizing the final output signal. */
  private masterAnalyser!: AnalyserNode;

  // Sub-mix Group Buses
  /** A gain node for controlling the volume of all synthesizer voices. */
  private synthSubBus!: GainNode;
  /** A gain node for controlling the volume of all sound effects. */
  private sfxSubBus!: GainNode;
  /** A gain node for controlling the volume of all music tracks. */
  private musicSubBus!: GainNode;

  // Global Return FX Buses
  private reverbReturnBus!: ConvolverNode;
  private delayReturnBus!: DelayNode;
  private delayFeedbackGain!: GainNode;

  /**
   * Creates and initializes the core audio graph.
   * @param config - Optional configuration for the underlying `AudioContext`.
   */
  constructor(private config: AudioEngineConfig = {}) {
    // Instantiate AudioContext immediately on class load.
    // The browser automatically initializes this in a "suspended" state
    // to comply with autoplay security policies, allowing safe graph setup.
    const options: AudioContextOptions = {
      latencyHint: this.config.latencyHint || 'interactive'
    };
    if (this.config.sampleRate) {
      options.sampleRate = this.config.sampleRate;
    }

    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)(options);
    
    // Construct the permanent routing topology so components can bind safely on load
    this.buildMasterGraph();
    this.buildFXReturnBuses();
    this.buildSubMixBuses();
  }

  /**
   * Activates the audio context. 
   * This is required by modern browsers to start playing audio.
   * @remarks
   * It should be called in response to a user interaction, such as a click or key press.
   */
  public async initialize(): Promise<void> {
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  /**
   * Suspends the audio context thread to free up system CPU/audio hardware resources.
   * This is useful for pausing the game or when the application is in the background.
   */
  public async suspend(): Promise<void> {
    if (this.ctx.state === 'running') {
      await this.ctx.suspend();
    }
  }

  /**
   * Resumes the suspended audio context thread.
   * @see {@link AudioEngine.suspend}
   */
  public async resume(): Promise<void> {
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  /**
   * Builds the main master output block:
   * Master Gain -> Dynamics Compressor -> Analyser -> Physical Audio Output
   * @private
   */
  private buildMasterGraph(): void {
    this.masterVolumeNode = this.ctx.createGain();
    this.masterVolumeNode.gain.setValueAtTime(0.8, this.ctx.currentTime);

    this.dynamicsCompressor = this.ctx.createDynamicsCompressor();
    this.dynamicsCompressor.threshold.setValueAtTime(-12, this.ctx.currentTime);
    this.dynamicsCompressor.knee.setValueAtTime(30, this.ctx.currentTime);
    this.dynamicsCompressor.ratio.setValueAtTime(12, this.ctx.currentTime);
    this.dynamicsCompressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
    this.dynamicsCompressor.release.setValueAtTime(0.25, this.ctx.currentTime);

    this.masterAnalyser = this.ctx.createAnalyser();
    this.masterAnalyser.fftSize = 1024;

    this.masterVolumeNode.connect(this.dynamicsCompressor);
    this.dynamicsCompressor.connect(this.masterAnalyser);
    this.masterAnalyser.connect(this.ctx.destination);
  }

  /**
   * Configures shared Return FX buses (Reverb and Feedback Delay).
   * Note voices send percentages of their signals to these parallel chains.
   * @private
   */
  private buildFXReturnBuses(): void {
    const masterDest = this.masterVolumeNode;

    // Reverb Return Bus
    this.reverbReturnBus = this.ctx.createConvolver();
    this.reverbReturnBus.buffer = this.generateSyntheticImpulseResponse(2.0, 2.0);
    this.reverbReturnBus.connect(masterDest);

    // Feedback Delay Return Bus
    this.delayReturnBus = this.ctx.createDelay(1.0);
    this.delayReturnBus.delayTime.setValueAtTime(0.25, this.ctx.currentTime);

    this.delayFeedbackGain = this.ctx.createGain();
    this.delayFeedbackGain.gain.setValueAtTime(0.4, this.ctx.currentTime);

    this.delayReturnBus.connect(this.delayFeedbackGain);
    this.delayFeedbackGain.connect(this.delayReturnBus); 
    this.delayReturnBus.connect(masterDest);
  }

  /**
   * Constructs isolated summing channels for categorization.
   * @private
   */
  private buildSubMixBuses(): void {
    const masterDest = this.masterVolumeNode;

    this.synthSubBus = this.ctx.createGain();
    this.synthSubBus.gain.setValueAtTime(1.0, this.ctx.currentTime);
    this.synthSubBus.connect(masterDest);

    this.sfxSubBus = this.ctx.createGain();
    this.sfxSubBus.gain.setValueAtTime(1.0, this.ctx.currentTime);
    this.sfxSubBus.connect(masterDest);

    this.musicSubBus = this.ctx.createGain();
    this.musicSubBus.gain.setValueAtTime(1.0, this.ctx.currentTime);
    this.musicSubBus.connect(masterDest);
  }

  /**
   * Generates a procedurally synthesized stereo impulse response buffer for the reverb unit.
   * Note: Eliminates the need to load large external impulse WAV files on startup.
   * @param duration - The length of the reverb tail in seconds.
   * @param decay - The rate at which the reverb tail fades.
   * @returns An `AudioBuffer` containing the generated impulse response.
   * @private
   */
  private generateSyntheticImpulseResponse(duration: number, decay: number): AudioBuffer {
    const sampleRate = this.ctx.sampleRate;
    const length = sampleRate * duration;
    const impulseBuffer = this.ctx.createBuffer(2, length, sampleRate);

    const left = impulseBuffer.getChannelData(0);
    const right = impulseBuffer.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const decayEnvelope = Math.pow(1 - i / length, decay);
      left[i] = (Math.random() * 2 - 1) * decayEnvelope;
      right[i] = (Math.random() * 2 - 1) * decayEnvelope;
    }

    return impulseBuffer;
  }

  // --- Utility Getters for Graph Routing ---

  /**
   * Gets the underlying `AudioContext` instance.
   * @returns The root `AudioContext`.
   */
  public getContext(): AudioContext {
    return this.ctx;
  }

  /**
   * Gets the master `AnalyserNode` for the final output.
   * @returns The master `AnalyserNode`.
   */
  public getAnalyser(): AnalyserNode {
    return this.masterAnalyser;
  }

  /**
   * Gets the sub-mix bus for synthesizer voices.
   * @returns The `GainNode` for the synth bus.
   */
  public getSynthBus(): GainNode {
    return this.synthSubBus;
  }

  /**
   * Gets the sub-mix bus for sound effects.
   * @returns The `GainNode` for the SFX bus.
   */
  public getSfxBus(): GainNode {
    return this.sfxSubBus;
  }

  /**
   * Gets the sub-mix bus for music tracks.
   * @returns The `GainNode` for the music bus.
   */
  public getMusicBus(): GainNode {
    return this.musicSubBus;
  }

  /**
   * Gets the global send/return bus for convolution reverb.
   * @returns The `ConvolverNode` for the reverb bus.
   */
  public getReverbBus(): ConvolverNode {
    return this.reverbReturnBus;
  }

  /**
   * Gets the global send/return bus for feedback delay.
   * @returns The `DelayNode` for the delay bus.
   */
  public getDelayBus(): DelayNode {
    return this.delayReturnBus;
  }

  // --- Dynamic Level Controls ---

  /**
   * Sets the master volume for the entire audio engine.
   * @param value - A value between 0.0 (silent) and 1.0 (full volume).
   */
  public setMasterVolume(value: number): void {
    this.masterVolumeNode.gain.setValueAtTime(Math.max(0, Math.min(1, value)), this.ctx.currentTime);
  }

  /**
   * Sets the volume for a specific sub-mix bus.
   * @param category - The bus to modify ('synth', 'sfx', or 'music').
   * @param value - A gain value. 1.0 is unity gain. Values can exceed 1.0 for boosting.
   */
  public setBusVolume(category: 'synth' | 'sfx' | 'music', value: number): void {
    const targetNode = category === 'synth' ? this.synthSubBus : category === 'sfx' ? this.sfxSubBus : this.musicSubBus;
    targetNode.gain.setValueAtTime(Math.max(0, Math.min(2, value)), this.ctx.currentTime);
  }
}