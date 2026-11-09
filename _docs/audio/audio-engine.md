## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| AudioEngine | audio/audio-engine.md |

This component serves as the core abstraction layer for the entire audio subsystem, encapsulating the Web Audio API's `AudioContext`. Its primary responsibility is to construct and manage a complex, pre-configured audio routing graph that handles signal flow from individual sound sources through sub-mix buses, global effects returns (reverb, delay), and finally to the master output. It ensures that audio processing is structured, controllable, and ready for immediate use upon initialization.

Architecturally, `AudioEngine` functions as a central service provider within the application. It manages the state of the audio context (suspended/running) and exposes controlled access pointssuch as `getSynthBus()` or `setMasterVolume()`allowing other parts of the application, like sound emitters or game logic controllers, to interact with the audio graph without needing direct knowledge of the underlying Web Audio API nodes.

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| AudioEngineConfig | Interface | Defines configuration options for the `AudioContext`, including `sampleRate` and `latencyHint`. |
| AudioEngine | Class | The main engine class responsible for graph construction, context management, and audio routing. |
| initialize | Method | Asynchronously resumes the audio context, required to start playback after user interaction. |
| suspend | Method | Asynchronously pauses the audio context, freeing up system resources. |
| resume | Method | Asynchronously resumes a suspended audio context. |
| getContext | Method | Returns the underlying `AudioContext` instance. |
| getAnalyser | Method | Returns the master `AnalyserNode` for signal visualization. |
| getSynthBus | Method | Returns the `GainNode` controlling the volume for synthesizer sounds. |
| getSfxBus | Method | Returns the `GainNode` controlling the volume for sound effects. |
| getMusicBus | Method | Returns the `GainNode` controlling the volume for music tracks. |
| getReverbBus | Method | Returns the `ConvolverNode` used for the global reverb return path. |
| getDelayBus | Method | Returns the `DelayNode` used for the global feedback delay return path. |
| setMasterVolume | Method | Sets the overall gain level for the entire audio engine. |
| setBusVolume | Method | Adjusts the gain level for a specific sub-mix category ('synth', 'sfx', or 'music'). |

## 3. Implementation Details & Side Effects
- **Core Logic:** The engine constructs a fixed topology upon instantiation: individual sources connect to sub-mix buses, which then feed into the master volume/compressor chain. Parallel paths are established for effects returns (reverb and delay), which are mixed back into the master chain. The `generateSyntheticImpulseResponse` method procedurally creates the necessary buffer for the convolver, avoiding external file loading.
- **Side Effects:** Mutates the global state of the browser's `AudioContext` (suspending/resuming) and manipulates the internal state of numerous Web Audio API nodes (GainNode, DynamicsCompressorNode, etc.).
- **Error Handling:** Relies on the browser's native implementation for context state management. The `setBusVolume` method clamps input values between 0.0 and 2.0 to prevent extreme gain issues.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** Web Audio API (`AudioContext`, `GainNode`, `DynamicsCompressorNode`, etc.).
- **Internal:** None.