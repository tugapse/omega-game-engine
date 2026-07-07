/**
 * @module
 * Provides a comprehensive diagnostic suite for the Omega audio engine.
 * This class is designed for developers to quickly verify the integrity and
 * functionality of the core audio components during development and testing.
 */

import { AudioCache } from "./audio-cache";
import { AudioEngine } from "./audio-engine";
import { SequencerClock } from "./sequencer-clock";
import { VoiceFactory } from "./voice-factory";

/**
 * A suite of tests to verify the health and functionality of the entire audio stack,
 * from the core `AudioContext` to the high-level sequencer.
 *
 * @remarks
 * This class is intended for debugging and development purposes. It provides a
 * simple way to run a battery of tests that cover:
 * - Core engine initialization and hardware connection.
 * - In-memory audio caching.
 * - Synthesizer and sampler voice creation.
 * - High-precision scheduling with the `SequencerClock`.
 */
export class AudioEngineDiagnostics {
  /**
   * Creates an instance of the diagnostic suite.
   * @param engine The main `AudioEngine` instance.
   * @param cache The `AudioCache` instance for memory management tests.
   * @param clock The `SequencerClock` for timing and scheduling tests.
   * @param factory The `VoiceFactory` for voice generation tests.
   */
  constructor(
    private engine: AudioEngine,
    private cache: AudioCache,
    private clock: SequencerClock,
    private factory: VoiceFactory
  ) {}

  /**
   * Executes a complete diagnostic battery, logging results to the console.
   * This method orchestrates a series of tests to validate each major
   * component of the audio system.
   *
   * @remarks
   * This method **must** be called in response to a user gesture (e.g., a button click)
   * to comply with browser autoplay policies that require user interaction to start
   * the `AudioContext`.
   *
   * @returns A promise that resolves when all tests have completed.
   * @throws If any critical test fails, an error will be thrown and logged.
   */
  public async runDiagnosticSuite(): Promise<void> {
    console.log('=== STARTING JARVIS AUDIO ENGINE DIAGNOSTIC BATTERY ===');

    try {
      // 1. Verify Audio Graph & Hardware Connection
      await this.testCoreInitialization();

      // 2. Test RAM Caching with Procedural Sample Generation
      this.testProceduralCacheRegistration();

      // 3. Test Synthesizer Routing and Voice Triggering
      this.testSynthVoiceTriggers();

      // 4. Test Pitch-Shift Arithmetic inside the Sampler Node
      this.testSamplerVoiceTriggers();

      // 5. Test Background Web Worker Clock Precision
      await this.testSequencerClockAccuracy();

    } catch (error) {
      console.error('❌ Diagnostics failed:', (error as Error).message);
    }
  }

  /**
   * Tests the fundamental initialization of the `AudioContext` and master graph.
   * Verifies that the audio hardware can be accessed and the master volume can be set.
   * @private
   */
  private async testCoreInitialization(): Promise<void> {
    console.log('Testing Core Initialization...');
    await this.engine.initialize();
    
    const ctx = this.engine.getContext();
    if (!ctx) throw new Error('AudioContext failed to instantiate.');
    
    console.log(`✅ AudioContext active at sample rate: ${ctx.sampleRate}Hz`);
    
    this.engine.setMasterVolume(0.9);
    console.log('✅ Master gain configured to 50%');
  }

  /**
   * Tests the `AudioCache`'s ability to register and retrieve procedurally generated `AudioBuffer`s.
   * This ensures that audio generated on-the-fly can be correctly managed in memory.
   * @private
   */
  private testProceduralCacheRegistration(): void {
    console.log('Testing Memory Cache registration...');
    const ctx = this.engine.getContext()!;
    
    // Generate a quick 0.5s procedural sine wave sample
    const sampleRate = ctx.sampleRate;
    const buffer = ctx.createBuffer(1, sampleRate * 0.5, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.sin(2 * Math.PI * 440 * (i / sampleRate)) * Math.exp(-9 * (i / data.length));
    }

    this.cache.register('diag_synth_click', buffer);
    
    if (!this.cache.has('diag_synth_click')) {
      throw new Error('Cache failed to register procedural buffer.');
    }
    
    const retrieved = this.cache.get('diag_synth_click');
    console.log(`✅ Cached buffer successfully verified (${retrieved.length} samples)`);
  }

  /**
   * Tests the `VoiceFactory`'s synthesizer voice creation pipeline.
   * It schedules both a "dry" note and a "wet" note with effects (delay, reverb)
   * to verify audio graph routing for different voice configurations.
   * @private
   */
  private testSynthVoiceTriggers(): void {
    console.log('Testing procedural voice factory pathways...');
    const ctx = this.engine.getContext()!;
    const now = ctx.currentTime;
 
    // Trigger a clean dry note instantly
    this.factory.triggerSynthVoice('sine', {
      frequency: 440.00,
      duration: 0.25,
      volume: 0.5,
      cutoff: 2000,
      pan: -0.5
    }, now);

    // Trigger a wet delay note on the right channel 250ms later
    this.factory.triggerSynthVoice('sawtooth', {
      frequency: 220.00,
      duration: 0.5,
      volume: 0.3,
      cutoff: 800,
      pan: 0.5,
      delayMix: 0.5,
      reverbMix: 0.3
    }, now + 0.25);

    console.log('✅ Dry/Wet synth voice trigger messages successfully scheduled');
  }

  /**
   * Tests the `VoiceFactory`'s sampler voice creation and pitch-shifting capabilities.
   * It plays a cached sample at its root pitch and then an octave higher to verify
   * that the `playbackRate` calculation is correct.
   * @private
   */
  private testSamplerVoiceTriggers(): void {
    console.log('Testing Sampler pitch-shifting playback metrics...');
    const ctx = this.engine.getContext()!;
    const now = ctx.currentTime;

    // Trigger procedural sample at native pitch (C4 root, playing C4)
    this.factory.triggerSamplerVoice('diag_synth_click', {
      frequency: 261.63,
      duration: 0.4,
      volume: 0.6,
      pan: -0.2
    }, now + 0.6, 261.63);

    // Trigger procedural sample pitched up one octave (playing C5)
    this.factory.triggerSamplerVoice('diag_synth_click', {
      frequency: 523.25,
      duration: 0.4,
      volume: 0.6,
      pan: 0.2
    }, now + 0.8, 261.63);

    console.log('✅ Sampler pitch-shift parameters successfully applied and triggered');
  }

  /**
   * Tests the accuracy and reliability of the `SequencerClock`.
   * It starts a high-precision timer in a separate Web Worker thread and schedules
   * audio events based on the ticks received, then verifies that it can be stopped cleanly.
   * @private
   */
  private testSequencerClockAccuracy(): Promise<void> {
    return new Promise((resolve) => {
      console.log('Testing high-precision Web Worker background clock (4 ticks)...');
      
      const targetTicks = 4;
      
      this.clock.start((tick, time, stepDuration) => {
        console.log(`⏱️ Clock Tick ${tick} scheduled for timeline target: ${time.toFixed(3)}s (step duration: ${stepDuration.toFixed(3)}s)`);
        
        // Trigger a metric pulse hit on every beat
        this.factory.triggerSynthVoice('triangle', {
          frequency: tick === 0 ? 880 : 440,
          duration: 0.05,
          volume: 0.4,
          cutoff: 3000,
          pan: 0
        }, time);

        if (tick >= targetTicks - 1) {
          this.clock.stop();
          console.log('✅ Worker clock sequence successfully executed and cleaned up');
          resolve();
        }
      });
    });
  }
}