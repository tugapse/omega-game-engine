## 1. Architectural Role
|  |  |
| :--- | :--- |
| Name | SequencerClock |
| Source file | sequencer-clock.ts |

The **SequencerClock** serves as a high-precision timing authority designed to drive rhythmic audio events with sample-accurate accuracy. Its primary purpose is to decouple musical timing from the main execution thread, ensuring that audio scheduling remains unaffected by UI rendering overhead or main-thread "jank."

**Functional Mission**
The core mission of the **SequencerClock** is to provide a stable, jitter-free temporal reference for musical sequences. It solves the problem of timing drift inherent in standard `setInterval` or `setTimeout` calls on the main thread by offloading the heartbeat of the clock to a dedicated Web Worker. This allows the system to schedule audio events into the future using the `AudioContext` timeline, providing a buffer that absorbs fluctuations in main-thread availability.

**System Context & Integration**
This component acts as the temporal engine for the audio subsystem. It integrates closely with the `AudioContext` to translate musical concepts (BPM, ticks) into precise hardware-level timestamps. While it does not directly produce sound, it provides the "when" for the audio engine, feeding precise timestamps to callback functions that typically trigger voice instantiation or parameter automation within the broader audio architecture.

- **INTERNAL REFERENCES**: The clock's logic is documented in [sequencer-clock.md](/AgentDocs/audio/sequencer-clock.md).

## 2. Environment & Configuration
**Environment Lookups:**
- `bpm` (via `ClockConfig`)  The tempo in beats per minute.
- `ticksPerBeat` (via `ClockConfig`)  The number of subdivisions per beat (e.g., 4 for 16th notes).
- `lookaheadMs` (via `ClockConfig`)  The temporal window (in ms) for scheduling future events.
- `overlapMs` (via `ClockConfig`)  The frequency (in ms) of the worker's heartbeat check.

**Hardcoded Constants:**
- `bpm` (Default: `120`)  Standard starting tempo.
- `ticksPerBeat` (Default: `4`)  Standard starting subdivision.
- `lookaheadMs` (Default: `150.0`)  Default scheduling buffer.
- `overlapMs` (Default: `35.0`)  Default worker polling interval.
- `minBpm` (Clamped: `20`)  Lower bound for tempo changes.
- `maxBpm` (Clamped: `300`)  Upper bound for tempo changes.
- `initialOffset` (Default: `0.05`)  Safety offset added to `audioContext.currentTime` to prevent scheduling in the past.

## 3. Interface & API Surface
| Entity | Type | Functional Responsibility |
| :--- | :--- | :--- |
| `ClockConfig` | Interface | Defines the configuration schema for tempo and scheduling precision. |
| `SequencerClock` | Class | The primary controller for the worker-based timing loop. |
| `start` | Method | Initializes the worker, sets the initial tick, and begins the scheduling loop via a callback. |
| `stop` | Method | Terminates the Web Worker and resets the clock state. |
| `setBpm` | Method | Updates the tempo with clamping logic (20-300 BPM). |
| `getBpm` | Method | Returns the current tempo. |
| `getTick` | Method | Returns the current sequence tick count. |

## 4. Execution Logic & Flow
- **Initialization**: 
    1. The `SequencerClock` is instantiated with an `AudioContext` and `ClockConfig`.
    2. Upon calling `start()`, `currentTick` is reset to 0.
    3. `nextTickTime` is calculated as `audioContext.currentTime + 0.05` to provide a safety buffer.
    4. `spawnWorker()` creates a Blob-based Web Worker to run a background `setInterval`.
- **Data Path**: 
    1. **Worker Thread**: Sends a `'tick'` message to the main thread at every `overlapMs` interval.
    2. **Main Thread**: Receives `'tick'` $\rightarrow$ invokes `scheduleAhead()`.
    3. **Scheduling Logic**: `scheduleAhead()` compares `nextTickTime` against `audioContext.currentTime + lookaheadSec`.
    4. **Output**: If within the window, the `onScheduleCallback` is executed with `(currentTick, nextTickTime, stepDuration)`, and `advanceTick()` increments the state.
- **Conditional Branching**:
    - `start()`: If `isRunning` is true, the method exits immediately to prevent multiple workers.
    - `stop()`: If `isRunning` is false, the method exits.
    - `setBpm()`: Clamps the input value between 20 and 300.
    - `scheduleAhead()`: A `while` loop continues scheduling as long as the next scheduled tick falls within the lookahead window.

## 5. Resource Dependencies
- **Standard Libraries**: `Blob`, `URL`, `Worker` (Web APIs).
- **Internal Modules**: None.
- **External Packages**: `AudioContext` (Web Audio API).