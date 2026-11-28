## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| AudioEngineDiagnostics | [src/audio/audio-diagnostics.ts](/src/audio/audio-diagnostics.ts) |

This component is responsible for executing a comprehensive battery of diagnostic tests against the core audio processing pipeline. Its primary function is to verify the operational integrity of various subsystems, including the audio graph initialization, memory caching, synthesizer routing, sampler pitch-shifting, and the precision of the sequencer clock. The suite is designed to be run only in response to a user gesture to satisfy browser audio constraints.

Architecturally, `AudioEngineDiagnostics` acts as a high-level service or test harness. It orchestrates interactions with lower-level components such as [AudioEngine](/src/audio/audio-engine.ts), [AudioCache](/src/audio/audio-cache.ts), [SequencerClock](/src/audio/sequencer-clock.ts), and [VoiceFactory](/src/audio/voice-factory.ts) to confirm that all interconnected parts function as expected under simulated load.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| AudioEngineDiagnostics | Class | Manages the execution of the full audio diagnostic suite. |
| runDiagnosticSuite | Method | Executes the complete diagnostic battery asynchronously. Must be called following a user gesture. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `runDiagnosticSuite` method sequentially calls five private diagnostic methods. `testCoreInitialization` verifies the `AudioContext` and sets master volume. `testProceduralCacheRegistration` generates a sine wave buffer and registers it with the cache. `testSynthVoiceTriggers` schedules immediate and delayed voice events using `VoiceFactory`. `testSamplerVoiceTriggers` schedules two sample triggers with different pitch parameters. Finally, `testSequencerClockAccuracy` initiates a timed sequence using `SequencerClock` and monitors tick events.
- **Side Effects:** Interacts with the console (`console.log`, `console.error`), and mutates the state of the injected dependencies (`AudioEngine`, `AudioCache`, `VoiceFactory`, `SequencerClock`).
- **Error Handling:** The `runDiagnosticSuite` method wraps the entire diagnostic sequence in a `try...catch` block, logging any encountered errors via `console.error`.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None
- **Internal:** [AudioCache](/src/audio/audio-cache.ts), [AudioEngine](/src/audio/audio-engine.ts), [SequencerClock](/src/audio/sequencer-clock.ts), [VoiceFactory](/src/audio/voice-factory.ts)