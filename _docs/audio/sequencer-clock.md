## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| SequencerClock | [src/audio/sequencer-clock.ts](/src/audio/sequencer-clock.ts) |

This component is responsible for managing the timing and scheduling of events within an audio sequence. It calculates the precise timing for subsequent musical ticks based on a defined BPM and ticks-per-beat configuration. Its primary responsibility is to provide a reliable, time-accurate clock signal to other parts of the audio engine.

It functions as a core timing service within the audio processing layer. It relies on the `AudioContext` for high-resolution time tracking and utilizes a Web Worker to handle the periodic ticking mechanism, decoupling the scheduling logic from the main thread to ensure smooth performance.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `ClockConfig` | Interface | Defines the configuration parameters for the sequencer, including BPM, ticks per beat, and lookahead/overlap timing in milliseconds. |
| `SequencerClock` | Class | Manages the clock state, starting, stopping, and querying the current tick count. |
| `SequencerClock.start(callback)` | Method | Initializes the clock, sets the scheduling callback, and begins the internal ticking mechanism via a Web Worker. |
| `SequencerClock.stop()` | Method | Halts the internal ticking mechanism and terminates the associated Web Worker. |
| `SequencerClock.setBpm(newBpm)` | Method | Updates the BPM of the sequencer, clamping the value between 20 and 300. |
| `SequencerClock.getBpm()` | Method | Returns the current configured BPM value. |
| `SequencerClock.getTick()` | Method | Returns the current sequential tick count. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The clock operates by calculating the duration of a single step (`getStepDuration`) based on BPM and ticks per beat. The `scheduleAhead` method continuously checks if the next scheduled tick time is within the lookahead window. If so, it calls the provided callback with the current tick, scheduled time, and step duration, then advances the tick counter and time. The actual periodic triggering is managed by a Web Worker, which uses `setInterval` based on the `overlapMs` configuration.
- **Side Effects:** The code spawns a Web Worker (`spawnWorker`) which communicates back to the main thread to trigger `scheduleAhead`. It interacts with the `AudioContext` for time synchronization.
- **Error Handling:** The `setBpm` method implements input validation by clamping the provided BPM value between 20 and 300. The `stop` method ensures the worker is terminated and references are cleared.

## 4. Dependencies & Configuration
**Environment & Configuration:**
- No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** `Worker`, `Blob`, `URL` (Browser APIs).
- **Internal:** None.