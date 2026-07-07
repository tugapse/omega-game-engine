/**
 * @module
 * Provides a high-precision, Web Worker-based sequencer clock for sample-accurate audio event scheduling.
 * This clock is designed to be resilient to main thread UI jank and provides a stable timing source.
 */

/**
 * Configuration for the SequencerClock.
 */
export interface ClockConfig {
  /** The tempo in beats per minute (BPM). */
  bpm: number;
  /** The number of ticks (subdivisions) per beat. For example, 4 for 16th notes. */
  ticksPerBeat: number;
  /**
   * How far into the future (in milliseconds) the clock should schedule audio events.
   * A larger value provides a more stable schedule at the cost of higher latency for tempo changes.
   * @defaultValue `150.0`
   */
  lookaheadMs: number;
  /**
   * The frequency (in milliseconds) at which the scheduling function is called to check for upcoming notes.
   * This should be less than `lookaheadMs`. A smaller value is more CPU-intensive but more responsive.
   * @defaultValue `35.0`
   */
  overlapMs: number;
}

/**
 * A high-precision musical event scheduler that uses a Web Worker for its timing source.
 *
 * @remarks
 * By offloading the `setInterval` timer to a background thread, the clock remains
 * stable and accurate even if the main UI thread is busy or blocked. It schedules
 * events in advance based on the `lookaheadMs` configuration, passing precise
 * `AudioContext` timestamps to a callback function. This is the preferred method
 * for creating rhythm-based games or musical sequencers.
 */
export class SequencerClock {
  private worker: Worker | null = null;
  private isRunning = false;
  private currentTick = 0;
  private nextTickTime = 0;
  /** The callback function that is invoked for each scheduled tick. */
  private onScheduleCallback: ((tick: number, time: number, stepDuration: number) => void) | null = null;

  constructor(
    private audioContext: AudioContext,
    private config: ClockConfig = { bpm: 120, ticksPerBeat: 4, lookaheadMs: 150.0, overlapMs: 35.0 }
  ) {}

  /**
   * Starts the sequencer clock.
   * @param callback - A function that will be called for each tick. It receives the
   * tick number, the precise `AudioContext` time for the event, and the duration of one step.
   *
   * @example
   * clock.start((tick, time, stepDuration) => {
   *   console.log(`Scheduling note for tick ${tick} at time ${time}`);
   * });
   */
  public start(callback: (tick: number, time: number, stepDuration: number) => void): void {
    if (this.isRunning) return;

    this.onScheduleCallback = callback;
    this.isRunning = true;
    
    this.currentTick = 0;
    // Safe timing offset to ensure first ticks don't schedule in the past
    this.nextTickTime = this.audioContext.currentTime + 0.05;

    this.spawnWorker();
    this.worker?.postMessage('start');
  }

  /**
   * Stops the sequencer clock and terminates the Web Worker to free up resources.
   * The clock state is reset.
   */
  public stop(): void {
    if (!this.isRunning) return;
    
    this.worker?.postMessage('stop');
    this.worker?.terminate();
    this.worker = null;
    this.isRunning = false;
  }

  /**
   * Sets a new tempo for the clock at runtime.
   * The value is clamped between 20 and 300 BPM.
   * @param newBpm - The new tempo in beats per minute.
   */
  public setBpm(newBpm: number): void {
    this.config.bpm = Math.max(20, Math.min(300, newBpm));
  }

  /**
   * Gets the current tempo of the clock.
   * @returns The current BPM.
   */
  public getBpm(): number {
    return this.config.bpm;
  }

  /**
   * Gets the current tick number of the sequence.
   * @returns The current tick count, starting from 0.
   */
  public getTick(): number {
    return this.currentTick;
  }

  /**
   * Calculates the duration of a single tick in seconds.
   * @private
   */
  private getStepDuration(): number {
    const secondsPerBeat = 60.0 / this.config.bpm;
    return secondsPerBeat / this.config.ticksPerBeat;
  }

  /**
   * The core scheduling logic. This function is called by the Web Worker's timer.
   * It checks how far ahead the next event is and, if it's within the lookahead window,
   * invokes the user-provided callback with the precise timing information.
   * @private
   */
  private scheduleAhead(): void {
    const stepDuration = this.getStepDuration();
    const lookaheadSec = this.config.lookaheadMs / 1000.0;

    while (this.nextTickTime < this.audioContext.currentTime + lookaheadSec) {
      this.onScheduleCallback?.(this.currentTick, this.nextTickTime, stepDuration);
      this.advanceTick();
    }
  }

  /**
   * Increments the tick counter and calculates the time for the next tick.
   * @private
   */
  private advanceTick(): void {
    this.nextTickTime += this.getStepDuration();
    this.currentTick++;
  }

  private spawnWorker(): void {
    const workerCode = `
      // This script runs in a separate, background thread.
      // Its only job is to send a 'tick' message back to the main thread
      // at a reliable interval, triggering the scheduleAhead() function.
      // This avoids using setInterval on the main thread, which can be
      // unreliable and cause timing drift.

      let timerId = null;
      let interval = ${this.config.overlapMs};

      self.onmessage = (e) => {
        if (e.data === 'start') {
          timerId = setInterval(() => self.postMessage('tick'), interval);
        } else if (e.data === 'stop') {
          if (timerId) {
            clearInterval(timerId);
            timerId = null;
          }
        }
      };
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    this.worker = new Worker(url);

    this.worker.onmessage = (e) => {
      if (e.data === 'tick' && this.isRunning) {
        this.scheduleAhead();
      }
    };

    URL.revokeObjectURL(url);
  }
}