## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| SequencerClock | audio/sequencer-clock |

This component provides a high-precision, sample-accurate timing mechanism essential for musical sequencing applications. Its primary responsibility is to manage and dispatch scheduled audio events based on a defined tempo (BPM) and subdivision (ticksPerBeat), ensuring timing stability even when the main application thread experiences performance bottlenecks.

The `SequencerClock` acts as a core timing service within the audio subsystem. It leverages a dedicated Web Worker to run its timing loop, decoupling the critical scheduling process from the main thread. It interfaces with the `AudioContext` to provide precise, real-world timestamps for event execution, making it a foundational utility for rhythm-based components like [Sequencer](/audio/sequencer.md) or [NoteScheduler](/audio/note-scheduler.md).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| ClockConfig | Interface | Defines the operational parameters for the clock, including BPM, ticksPerBeat, lookaheadMs, and overlapMs. |
| SequencerClock | Class | Manages the timing, scheduling, and lifecycle of the audio clock. |
| start | Method | Initiates the clock, starting the Web Worker and beginning the scheduling process. Requires a callback function. |
| stop | Method | Halts the clock, terminates the associated Web Worker, and resets the internal state. |
| setBpm | Method | Dynamically updates the tempo of the clock, clamping the value between 20 and 300 BPM. |
| getBpm | Method | Retrieves the current tempo setting of the clock. |
| getTick | Method | Returns the current sequential tick count of the sequencer. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The clock operates by calculating the duration of a single tick based on BPM and ticksPerBeat. It uses a `while` loop within `scheduleAhead()` to check if the next scheduled tick time (`nextTickTime`) falls within the defined `lookaheadMs` window relative to the current `AudioContext.currentTime`. When a tick is scheduled, the user callback is invoked with the precise `AudioContext` time. The Web Worker's role is to periodically signal the main thread (via `postMessage('tick')`) at the `overlapMs` interval, triggering the `scheduleAhead()` check.

- **Side Effects:** The code spawns and manages a `Worker` instance, which constitutes spawning a background process. It interacts directly with the `AudioContext` provided during construction.

- **Error Handling:** The `setBpm` method implements input validation by clamping the provided BPM value between 20 and 300 to prevent invalid timing calculations.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.
- **Internal:** None.